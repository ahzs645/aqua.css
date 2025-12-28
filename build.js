#!/usr/bin/env node
const dedent = require("dedent");
const ejs = require("ejs");
const fs = require("fs");
const glob = require("glob");
const hljs = require("highlight.js");
const mkdirp = require("mkdirp");
const path = require("path");
const postcss = require("postcss");
const sass = require("sass");

const { homepage, version } = require("./package.json");
const INLINE_ASSET_EXTENSIONS = [".png", ".svg", ".gif", ".jpg"];

function createPipeline({ preserveVars, copyAssets, prefixSelector, inlineAssets, inlineAssetRoot }) {
  let pipeline = postcss()
    .use(require("postcss-inline-svg"))
    .use(require("postcss-css-variables")({ preserve: preserveVars }))
    .use(require("postcss-calc"))
    .use(require("autoprefixer"));

  if (inlineAssets) {
    pipeline = pipeline.use(require("postcss-base64")({
      root: inlineAssetRoot,
      extensions: INLINE_ASSET_EXTENSIONS,
    }));
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

  if (copyAssets) {
    pipeline = pipeline.use(require("postcss-copy")({ dest: "dist", template: "[name].[ext]" }));
  }

  return pipeline.use(require("cssnano"));
}

function runPostCSS(input, { from, to, preserveVars, copyAssets, prefixSelector, inlineAssets, inlineAssetRoot }) {
  return createPipeline({
    preserveVars,
    copyAssets,
    prefixSelector,
    inlineAssets,
    inlineAssetRoot,
  }).process(input, {
    from,
    to,
    map: { inline: false },
  });
}

function buildCSS() {
  mkdirp.sync("dist");

  // Copy icon folder to dist before CSS processing (needed for postcss-base64)
  if (fs.existsSync("icon")) {
    copyDirectorySync("icon", path.join("dist", "icon"));
    // Copy favicon.ico to dist root for browsers that request /favicon.ico
    if (fs.existsSync("icon/finder-jaguar.ico")) {
      fs.copyFileSync("icon/finder-jaguar.ico", path.join("dist", "favicon.ico"));
    }
  }

  // Compile SCSS to CSS
  const scssResult = sass.compile("src/index.scss", {
    loadPaths: ["src"],
    sourceMap: true,
  });

  const input = `/*! aqua.css v${version} - ${homepage} */\n` + scssResult.css;
  return runPostCSS(input, {
    from: "src/index.scss",
    to: "dist/aqua.css",
    preserveVars: true,
    copyAssets: true,
  })
    .then((result) => {
      fs.writeFileSync("dist/aqua.css", result.css);
      fs.writeFileSync("dist/aqua.css.map", result.map.toString());
    })
    .then(() => runPostCSS(input, {
      from: "src/index.scss",
      to: "dist/aqua.legacy.css",
      preserveVars: false,
      copyAssets: false,
    }))
    .then((result) => {
      fs.writeFileSync("dist/aqua.legacy.css", result.css);
      fs.writeFileSync("dist/aqua.legacy.css.map", result.map.toString());
    })
    .then(() => runPostCSS(input, {
      from: "src/index.scss",
      to: "dist/aqua.scoped.css",
      preserveVars: true,
      copyAssets: false,
      prefixSelector: ".aqua",
    }))
    .then((result) => {
      fs.writeFileSync("dist/aqua.scoped.css", result.css);
      fs.writeFileSync("dist/aqua.scoped.css.map", result.map.toString());
    })
    .then(() => {
      const inlineSource = fs.readFileSync("dist/aqua.css", "utf-8");
      return runPostCSS(inlineSource, {
        from: "dist/aqua.css",
        to: "dist/aqua.inline.css",
        preserveVars: true,
        copyAssets: false,
        inlineAssets: true,
        inlineAssetRoot: path.join(process.cwd(), "dist"),
      });
    })
    .then((result) => {
      fs.writeFileSync("dist/aqua.inline.css", result.css);
      fs.writeFileSync("dist/aqua.inline.css.map", result.map.toString());
    })
    .then(() => buildComponents());
}

function buildComponents() {
  const componentDir = path.join("dist", "components");
  mkdirp.sync(componentDir);

  const exclude = new Set([
    "_variables.scss",
    "_mixins.scss",
    "_base.scss",
    "_backgrounds.scss",
    "_themes.scss",
    "_fonts.scss",
  ]);

  const componentFiles = fs.readdirSync("src")
    .filter((file) => file.startsWith("_") && file.endsWith(".scss") && !exclude.has(file));

  return Promise.all(componentFiles.map((file) => {
    const name = file.replace(/^_/, "").replace(/\.scss$/, "");
    const scssInput = [
      `@use "variables";`,
      `@use "backgrounds";`,
      `@use "themes";`,
      `@use "${name}";`,
    ].join("\n");
    const result = sass.compileString(scssInput, {
      loadPaths: ["src"],
      sourceMap: true,
    });
    const input = `/*! aqua.css v${version} - ${homepage} */\n` + result.css;
    const target = path.join(componentDir, `${name}.css`);

    return runPostCSS(input, {
      from: `src/${file}`,
      to: target,
      preserveVars: true,
      copyAssets: false,
      inlineAssets: true,
      inlineAssetRoot: path.join(process.cwd(), "dist"),
    }).then((processed) => {
      fs.writeFileSync(target, processed.css);
      fs.writeFileSync(`${target}.map`, processed.map.toString());
    });
  }));
}

function copyDirectorySync(src, dest) {
  mkdirp.sync(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectorySync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function buildDocs() {
  let id = 0;
  function getNewId() {
    return ++id;
  }
  function getCurrentId() {
    return id;
  }

  const template = fs.readFileSync("docs/index.html.ejs", "utf-8");

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

  glob("docs/*", (err, files) => {
    if (!err) {
      files.forEach((srcFile) => {
        // Skip directories and .ejs files
        if (!srcFile.endsWith(".ejs") && fs.statSync(srcFile).isFile()) {
          fs.copyFileSync(srcFile, path.join("dist", path.basename(srcFile)));
        }
      });
    } else throw "error globbing docs directory.";
  });

  fs.writeFileSync(
    path.join(__dirname, "/dist/index.html"),
    ejs.render(template, { getNewId, getCurrentId, example }, {
      filename: path.join(__dirname, "docs/index.html.ejs")
    })
  );
}

function build() {
  return buildCSS()
    .then(buildDocs)
    .catch((err) => console.log(err));
}

module.exports = build;

build();
