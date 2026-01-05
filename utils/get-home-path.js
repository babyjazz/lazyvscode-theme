const { isWindows } = require("./os-check");

function getHomePath() {
  return isWindows()
    ? process.env.USERPROFILE.replace(/\\/g, "/")
    : process.env.HOME;
}

module.exports = {
  getHomePath,
};
