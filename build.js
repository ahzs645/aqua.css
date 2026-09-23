#!/usr/bin/env node
const dedent = require("dedent");
const ejs = require("ejs");
const fs = require("fs");
const hljs = require("highlight.js");
const path = require("path");
const postcss = require("postcss");
const sass = require("sass");

const { homepage, version } = require("./package.json");

// All paths are resolved from the repo root, whatever the working directory.
const ROOT = __dirname;
const fromRoot = (...parts) => path.join(ROOT, ...parts);

const INLINE_MIME_TYPES = {
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
};
const FONT_EXTENSIONS = new Set([".woff", ".woff2", ".ttf", ".otf"]);
const URL_PATTERN = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;

// Local file referenced by a url(): skips data:, remote, and #fragment URLs.
function localAssetPath(url) {
  if (/^(data:|[a-z]+:|\/\/|#|%23|\/)/i.test(url)) return null;
  return url.split(/[?#]/)[0];
}

function rewriteUrls(root, rewrite) {
  root.walkDecls((decl) => {
    if (!decl.value.includes("url(")) return;
    decl.value = decl.value.replace(URL_PATTERN, (match, quote, url) => {
      const file = localAssetPath(url);
      const next = file && rewrite(file, decl);
      return next ? `url("${next}")` : match;
    });
  });
}

// Copies each asset a stylesheet references into the output folder and points
// the url() at the copy: fonts go to fonts/, everything else next to the CSS,
// so every dist/*.css file resolves the same relative URLs.
function copyAssets({ outDir }) {
  return {
    postcssPlugin: "aqua-copy-assets",
    Once(root, { result }) {
      const cssDir = path.dirname(result.opts.to);
      const sourceDir = path.dirname(result.opts.from);
      rewriteUrls(root, (file) => {
        const source = path.resolve(sourceDir, file);
        if (!fs.existsSync(source) || !fs.statSync(source).isFile()) return null;
        const name = path.basename(source);
        const target = FONT_EXTENSIONS.has(path.extname(name).toLowerCase())
          ? path.join(outDir, "fonts", name)
          : path.join(outDir, name);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(source, target);
        return path.relative(cssDir, target).split(path.sep).join("/");
      });
    },
  };
}
copyAssets.postcss = true;

// Inlines images (not fonts) as base64 data URIs, resolving url()s against
// the output folder.
function inlineAssets({ root: assetRoot }) {
  return {
    postcssPlugin: "aqua-inline-assets",
    Once(root) {
      rewriteUrls(root, (file) => {
        const mime = INLINE_MIME_TYPES[path.extname(file).toLowerCase()];
        const source = path.join(assetRoot, file);
        if (!mime || !fs.existsSync(source)) return null;
        return `data:${mime};base64,${fs.readFileSync(source).toString("base64")}`;
      });
    },
  };
}
inlineAssets.postcss = true;

// Legacy build only. A :root token that references another token is computed
// once, at :root, so expand those chains up front and gather every :root token
// into one block. postcss-css-variables otherwise resolves forward references
// as `undefined` and lets theme overrides leak into the :root defaults.
const ROOT_VAR_REF = /var\(\s*(--[\w-]+)\s*(?:,([^()]*))?\)/g;
function resolveRootVars() {
  return {
    postcssPlugin: "resolve-root-vars",
    Once(root) {
      const raw = new Map();
      root.walkRules((rule) => {
        if (rule.selector.trim() !== ":root") return;
        rule.walkDecls(/^--/, (decl) => {
          raw.set(decl.prop, decl.value);
          decl.remove();
        });
        if (!rule.nodes.length) rule.remove();
      });

      const resolved = new Map();
      const resolve = (name, seen = new Set()) => {
        if (resolved.has(name)) return resolved.get(name);
        if (seen.has(name)) return raw.get(name);
        seen.add(name);
        const value = raw.get(name).replace(ROOT_VAR_REF, (match, ref) =>
          raw.has(ref) ? resolve(ref, seen) : match);
        resolved.set(name, value);
        return value;
      };

      const nodes = [...raw.keys()].map((prop) => postcss.decl({ prop, value: resolve(prop) }));
      root.prepend(postcss.rule({ selector: ":root", nodes }));
    },
  };
}
resolveRootVars.postcss = true;

// postcss-css-variables writes `prop: undefined` when it cannot compute a
// static fallback; the value is invalid CSS either way, so drop it.
function dropUndefinedDecls() {
  return {
    postcssPlugin: "drop-undefined-decls",
    Declaration(decl) {
      if (decl.value.trim() === "undefined") decl.remove();
    },
  };
}
dropUndefinedDecls.postcss = true;

function createPipeline({ outDir, preserveVars, copyAssets: copy, prefixSelector, inlineAssets: inline, inlineAssetRoot }) {
  let pipeline = postcss().use(require("postcss-inline-svg"));

  if (!preserveVars) {
    pipeline = pipeline.use(resolveRootVars());
  }

  pipeline = pipeline
    .use(require("postcss-css-variables")({ preserve: preserveVars }))
    .use(dropUndefinedDecls())
    .use(require("autoprefixer"));

  if (inline) {
    pipeline = pipeline.use(inlineAssets({ root: inlineAssetRoot }));
  }

  if (prefixSelector) {
    pipeline = pipeline.use(require("postcss-prefix-selector")({
      prefix: prefixSelector,
      transform: (prefix, selector, prefixed) => {
        if (selector === ":root") return prefix;
        if (selector === "body" || selector === "html") return `${selector}${prefix}`;
        return prefixed;
      },
    }));
  }

  if (copy) {
    pipeline = pipeline.use(copyAssets({ outDir }));
  }

  return pipeline.use(require("cssnano"));
}

function runPostCSS(input, { from, to, outDir, preserveVars, copyAssets: copy, prefixSelector, inlineAssets: inline, inlineAssetRoot }) {
  return createPipeline({
    outDir,
    preserveVars,
    copyAssets: copy,
    prefixSelector,
    inlineAssets: inline,
    inlineAssetRoot,
  }).process(input, {
    from,
    to,
    map: { inline: false },
  });
}

function buildCSS(outDir) {
  // Compile first so a Sass error leaves the previous output in place.
  const scssResult = sass.compile(fromRoot("src/index.scss"), {
    loadPaths: [fromRoot("src")],
    sourceMap: true,
  });

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  // Copy the icon folder first: the inline and component builds read from it
  if (fs.existsSync(fromRoot("icon"))) {
    fs.cpSync(fromRoot("icon"), path.join(outDir, "icon"), { recursive: true });
    // Copy favicon.ico to the output root for browsers that request /favicon.ico
    if (fs.existsSync(fromRoot("icon/finder-jaguar.ico"))) {
      fs.copyFileSync(fromRoot("icon/finder-jaguar.ico"), path.join(outDir, "favicon.ico"));
    }
  }

  const from = fromRoot("src/index.scss");
  const out = (file) => path.join(outDir, file);
  const write = (file) => (result) => {
    fs.writeFileSync(out(file), result.css);
    fs.writeFileSync(out(`${file}.map`), result.map.toString());
  };

  const input = `/*! aqua.css v${version} - ${homepage} */\n` + scssResult.css;
  return runPostCSS(input, { from, to: out("aqua.css"), outDir, preserveVars: true, copyAssets: true })
    .then(write("aqua.css"))
    .then(() => runPostCSS(input, { from, to: out("aqua.legacy.css"), outDir, preserveVars: false, copyAssets: true }))
    .then(write("aqua.legacy.css"))
    .then(() => runPostCSS(input, {
      from,
      to: out("aqua.scoped.css"),
      outDir,
      preserveVars: true,
      copyAssets: true,
      prefixSelector: ".aqua",
    }))
    .then(write("aqua.scoped.css"))
    .then(() => runPostCSS(fs.readFileSync(out("aqua.css"), "utf-8"), {
      from: out("aqua.css"),
      to: out("aqua.inline.css"),
      outDir,
      preserveVars: true,
      inlineAssets: true,
      inlineAssetRoot: outDir,
    }))
    .then(write("aqua.inline.css"))
    .then(() => buildComponents(outDir));
}

function buildComponents(outDir) {
  const componentDir = path.join(outDir, "components");
  fs.mkdirSync(componentDir, { recursive: true });

  const exclude = new Set([
    "_variables.scss",
    "_mixins.scss",
    "_base.scss",
    "_backgrounds.scss",
    "_themes.scss",
    "_fonts.scss",
  ]);

  const componentFiles = fs.readdirSync(fromRoot("src"))
    .filter((file) => file.startsWith("_") && file.endsWith(".scss") && !exclude.has(file));

  return Promise.all(componentFiles.map((file) => {
    const name = file.replace(/^_/, "").replace(/\.scss$/, "");
    const scssInput = [
      `@use "fonts";`,
      `@use "variables";`,
      `@use "backgrounds";`,
      `@use "themes";`,
      `@use "${name}";`,
    ].join("\n");
    const result = sass.compileString(scssInput, {
      loadPaths: [fromRoot("src")],
      sourceMap: true,
    });
    const input = `/*! aqua.css v${version} - ${homepage} */\n` + result.css;
    const target = path.join(componentDir, `${name}.css`);

    return runPostCSS(input, {
      from: fromRoot("src", file),
      to: target,
      outDir,
      preserveVars: true,
      inlineAssets: true,
      inlineAssetRoot: outDir,
    }).then((processed) => {
      fs.writeFileSync(target, processed.css);
      fs.writeFileSync(`${target}.map`, processed.map.toString());
    });
  }));
}

function buildDocs(outDir = fromRoot("dist")) {
  let id = 0;
  function getNewId() {
    return ++id;
  }
  function getCurrentId() {
    return id;
  }

  const template = fs.readFileSync(fromRoot("docs/index.html.ejs"), "utf-8");

  function example(code) {
    const magicBrackets = /\[\[(.*)\]\]/g;
    const dedented = dedent(code);
    const inline = dedented.replace(magicBrackets, "$1");
    const escaped = hljs.highlight(dedented.replace(magicBrackets, ""), { language: "html" }).value;

    return `<div class="example">
      <div class="raw">${inline}</div>
      <details class="code">
        <summary>Show code</summary>
        <pre><code>${escaped}</code></pre>
        <button class="aqua-button aqua-button--secondary copy" type="button"><span>Copy code</span></button>
      </details>
    </div>`;
  }

  function bareExample(code) {
    const magicBrackets = /\[\[(.*)\]\]/g;
    const dedented = dedent(code);
    const inline = dedented.replace(magicBrackets, "$1");
    const escaped = hljs.highlight(dedented.replace(magicBrackets, ""), { language: "html" }).value;

    return `<div class="example example--bare">
      <div class="raw">${inline}</div>
      <details class="code">
        <summary>Show code</summary>
        <pre><code>${escaped}</code></pre>
        <button class="aqua-button aqua-button--secondary copy" type="button"><span>Copy code</span></button>
      </details>
    </div>`;
  }

  function tabbedExample(tabs) {
    const tabId = getNewId();
    const tabButtons = tabs.map((tab, i) =>
      `<button class="aqua-tab${i === 0 ? ' aqua-tab--active' : ''}" data-doc-tab="${tabId}-${i}">${tab.label}</button>`
    ).join('');

    const tabPanels = tabs.map((tab, i) => {
      const magicBrackets = /\[\[(.*)\]\]/g;
      const dedented = dedent(tab.code);
      const inline = dedented.replace(magicBrackets, "$1");
      const escaped = hljs.highlight(dedented.replace(magicBrackets, ""), { language: "html" }).value;

      return `<div class="aqua-tab-content${i === 0 ? '' : ' hidden'}" data-doc-panel="${tabId}-${i}">
        <div class="example">
          <div class="raw">${inline}</div>
          <details class="code">
            <summary>Show code</summary>
            <pre><code>${escaped}</code></pre>
            <button class="aqua-button aqua-button--secondary copy" type="button"><span>Copy code</span></button>
          </details>
        </div>
      </div>`;
    }).join('');

    return `<div class="aqua-folder-tabs doc-tabbed-example">
      <div class="aqua-tab-bar">${tabButtons}</div>
      ${tabPanels}
    </div>`;
  }

  fs.readdirSync(fromRoot("docs"), { withFileTypes: true }).forEach((entry) => {
    // Skip directories and .ejs files
    if (entry.isFile() && !entry.name.endsWith(".ejs")) {
      fs.copyFileSync(fromRoot("docs", entry.name), path.join(outDir, entry.name));
    }
  });

  fs.writeFileSync(
    path.join(outDir, "index.html"),
    ejs.render(template, { getNewId, getCurrentId, example, bareExample, tabbedExample, homepage }, {
      filename: fromRoot("docs/index.html.ejs")
    })
  );
}

// Builds the library and docs into `outDir` (dist/ by default).
function build({ outDir = fromRoot("dist") } = {}) {
  const target = path.resolve(ROOT, outDir);
  return buildCSS(target).then(() => buildDocs(target));
}

module.exports = build;
module.exports.buildDocs = buildDocs;

if (require.main === module) {
  // `node build.js --out <dir>` builds somewhere other than dist/
  const outIndex = process.argv.indexOf("--out");
  const outDir = outIndex > -1 ? process.argv[outIndex + 1] : undefined;
  build(outDir ? { outDir } : undefined).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
