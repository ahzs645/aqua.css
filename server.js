const liveServer = require("live-server");
const chokidar = require("chokidar");
const build = require("./build");

chokidar
  .watch(["src/**/*", "docs/**/*", "icon/**/*", "fonts/**/*"], { usePolling: true })
  .on("change", () => {
    console.log("Rebuilding...");
    build();
  });

liveServer.start({
  port: 3000,
  root: "./dist",
  open: true,
  wait: 500,
});
