const vscode = require("vscode");

const copyFile = () => {
  const fs = require("fs");
  const path = require("path");
  const homeDir = require("os").homedir();

  const sourcePath = path.join(__dirname, "custom_vscode.css");
  const sourceShadowPath = path.join(
    __dirname,
    "custom_vscode_with_shadow.css"
  );
  const destPath = path.join(homeDir, ".vscode", "custom_vscode.css");
  const destShadowPath = path.join(
    homeDir,
    ".vscode",
    "custom_vscode_with_shadow.css"
  );

  // Create .vscode directory if it doesn't exist
  if (!fs.existsSync(path.join(homeDir, ".vscode"))) {
    fs.mkdirSync(path.join(homeDir, ".vscode"));
  }

  try {
    // Check if source file exists
    if (!fs.existsSync(sourcePath) || !fs.existsSync(sourceShadowPath)) {
      throw new Error("Source file custom_vscode.css not found");
    }

    fs.copyFileSync(sourcePath, destPath);
    fs.copyFileSync(sourceShadowPath, destShadowPath);
    // vscode.window.showInformationMessage(
    //   "Successfully copied custom_vscode.css to user directory"
    // );
  } catch (err) {
    vscode.window.showErrorMessage(
      "Failed to copy css files to user directory: " + err.message
    );
  }
};

module.exports = {
  copyFile,
};
