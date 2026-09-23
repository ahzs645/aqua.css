const { spawn } = require("child_process");
const chokidar = require("chokidar");
const fs = require("fs");
const http = require("http");
const path = require("path");
const build = require("./build");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
// Rebuilds go here first and are swapped into dist/ only once they succeed,
// so the site keeps serving the previous build while a rebuild runs.
const NEXT = path.join(ROOT, ".dist-next");
const PREV = path.join(ROOT, ".dist-prev");
const PORT = Number(process.env.PORT) || 3000;

const watchPaths = [
  "src/**/*.scss",
  "docs/**/*",
  "icon/**/*",
  "fonts/**/*",
];
const usePolling = process.env.CHOKIDAR_USEPOLLING === "true";

/* ---------- Static server with live reload ---------- */

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

const RELOAD_PATH = "/__livereload";
const RELOAD_SCRIPT =
  `<script>new EventSource("${RELOAD_PATH}").onmessage = () => location.reload();</script>`;
const reloadClients = new Set();

function notifyReload() {
  for (const res of reloadClients) res.write("data: reload\n\n");
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);

  if (urlPath === RELOAD_PATH) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write(": connected\n\n");
    reloadClients.add(res);
    req.on("close", () => reloadClients.delete(res));
    return;
  }

  let file = path.join(DIST, urlPath);
  if (!file.startsWith(DIST)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
      return;
    }
    const type = MIME_TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
    if (type.startsWith("text/html")) {
      data = data.toString().replace("</body>", `${RELOAD_SCRIPT}</body>`);
    }
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" }).end(data);
  });
});

/* ---------- Rebuilds ---------- */

let buildInProgress = false;
let buildQueued = false;
let buildTimer = null;
let pendingPaths = new Set();

// Full builds run in a child process so the server keeps answering requests
// (Sass and cssnano would otherwise block it for the whole build).
function buildInChild(outDir) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(ROOT, "build.js"), "--out", outDir], {
      cwd: ROOT,
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`build exited with code ${code}`))));
  });
}

// Renames are synchronous, so no request is served between them.
function swapInNextBuild() {
  fs.rmSync(PREV, { recursive: true, force: true });
  if (fs.existsSync(DIST)) fs.renameSync(DIST, PREV);
  fs.renameSync(NEXT, DIST);
  fs.rmSync(PREV, { recursive: true, force: true });
}

function rebuild(paths) {
  const docsOnly = paths.length > 0 && paths.every((p) => p.split(path.sep)[0] === "docs");

  // Docs-only edits just re-render the page and copy docs assets in place.
  if (docsOnly && fs.existsSync(DIST)) {
    return Promise.resolve().then(() => build.buildDocs(DIST));
  }

  return buildInChild(NEXT)
    .then(swapInNextBuild)
    .catch((error) => {
      fs.rmSync(NEXT, { recursive: true, force: true });
      throw error;
    });
}

function runBuild() {
  if (buildInProgress) {
    buildQueued = true;
    return;
  }

  const paths = [...pendingPaths];
  pendingPaths = new Set();
  buildInProgress = true;
  console.log(`Rebuilding... (${paths.join(", ")})`);
  const started = Date.now();

  rebuild(paths)
    .then(() => {
      console.log(`Rebuilt in ${((Date.now() - started) / 1000).toFixed(1)}s`);
      notifyReload();
    })
    .catch((error) => {
      console.error(error.message);
      console.error("Build failed; still serving the previous build.");
    })
    .finally(() => {
      buildInProgress = false;
      if (buildQueued) {
        buildQueued = false;
        runBuild();
      }
    });
}

function scheduleBuild(filePath) {
  pendingPaths.add(path.relative(ROOT, path.resolve(ROOT, filePath)));
  if (buildTimer) return;
  buildTimer = setTimeout(() => {
    buildTimer = null;
    runBuild();
  }, 150);
}

buildInChild(DIST)
  .then(() => {
    const watcher = chokidar.watch(watchPaths, {
      cwd: ROOT,
      ignoreInitial: true,
      ignored: [
        "**/.DS_Store",
        "**/*.swp",
        "**/*.swo",
        "**/*~",
        "**/#*#",
        "**/.#*",
        "**/*.tmp",
        "**/*.temp",
      ],
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100,
      },
      usePolling,
    });

    ["add", "change", "unlink"].forEach((event) => {
      watcher.on(event, scheduleBuild);
    });

    server.listen(PORT, () => {
      console.log(`Serving dist/ at http://localhost:${PORT} (live reload on)`);
    });
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
