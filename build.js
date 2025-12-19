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

function buildCSS() {
  // First, compile SCSS to CSS
  const scssResult = sass.compile("src/index.scss", {
    loadPaths: ["src"],
    sourceMap: true,
  });

  const input = `/*! aqua.css v${version} - ${homepage} */\n` + scssResult.css;

  // Then process with PostCSS
  return postcss()
    .use(require("postcss-inline-svg"))
    .use(require("postcss-css-variables")({ preserve: true }))
    .use(require("postcss-calc"))
    .use(require("postcss-copy")({ dest: "dist", template: "[name].[ext]" }))
    .use(require("cssnano"))
    .process(input, {
      from: "src/index.scss",
      to: "dist/aqua.css",
      map: { inline: false },
    })
    .then((result) => {
      mkdirp.sync("dist");
      fs.writeFileSync("dist/aqua.css", result.css);
      fs.writeFileSync("dist/aqua.css.map", result.map.toString());
    });
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
      ${inline}
      <details>
        <summary>Show code</summary>
        <pre><code>${escaped}</code></pre>
      </details>
    </div>`;
  }

  glob("docs/*", (err, files) => {
    if (!err) {
      files.forEach((srcFile) => {
        if (!srcFile.endsWith(".ejs")) {
          fs.copyFileSync(srcFile, path.join("dist", path.basename(srcFile)));
        }
      });
    } else throw "error globbing docs directory.";
  });

  fs.writeFileSync(
    path.join(__dirname, "/dist/index.html"),
    ejs.render(template, { getNewId, getCurrentId, example })
  );
}

function build() {
  buildCSS()
    .then(buildDocs)
    .catch((err) => console.log(err));
}

module.exports = build;

build();
