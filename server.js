const liveServer = require("live-server");
const chokidar = require("chokidar");
const build = require("./build");

const watchPaths = [
  "src/**/*.scss",
  "docs/**/*",
  "icon/**/*",
  "fonts/**/*",
];
const usePolling = process.env.CHOKIDAR_USEPOLLING === "true";

const watcher = chokidar.watch(watchPaths, {
  ignoreInitial: true,
  ignored: [
    "**/.DS_Store",
    "**/.git/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/.cache/**",
    "**/.sass-cache/**",
    "**/.idea/**",
    "**/.vscode/**",
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

let buildInProgress = false;
let buildQueued = false;
let buildTimer = null;
let lastReason = "";

function runBuild(reason) {
  if (buildInProgress) {
    buildQueued = true;
    return;
  }

  buildInProgress = true;
  console.log(`Rebuilding...${reason ? ` (${reason})` : ""}`);
  Promise.resolve(build())
    .catch(() => {})
    .finally(() => {
      buildInProgress = false;
      if (buildQueued) {
        buildQueued = false;
        runBuild("queued");
      }
    });
}

function scheduleBuild(reason) {
  lastReason = reason;
  if (buildTimer) return;
  buildTimer = setTimeout(() => {
    buildTimer = null;
    runBuild(lastReason);
  }, 150);
}

["add", "change", "unlink"].forEach((event) => {
  watcher.on(event, (filePath) => {
    scheduleBuild(`${event}: ${filePath}`);
  });
});

liveServer.start({
  port: 3000,
  root: "./dist",
  open: true,
  wait: 500,
});
