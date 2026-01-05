const os = require("os");

function isWindows() {
  return os.platform() === "win32";
}

module.exports = {
  isWindows,
};
