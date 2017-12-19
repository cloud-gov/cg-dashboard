const chokidar = require("chokidar");
const fs = require("fs");

// Create a watcher to delete weird files created by the docker containers.
// Files:
// index.html - created from noVNC
chokidar.watch(["^index.html*"]).on("add", file => {
  fs.unlinkSync(`${file}`);
});
