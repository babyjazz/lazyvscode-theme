const vscode = require("vscode");

const copyFile = () => {
  const fs = require("fs");
  const path = require("path");
  const homeDir = require("os").homedir();

  const sourcePath = path.join(__dirname, "assets", "custom_vscode.css");
  const sourceSnowPath = path.join(__dirname, "assets", "custom_snow.js");
  const sourceCursorTrailPath = path.join(
    __dirname,
    "assets",
    "custom_cursor_trail.js"
  );
  const sourceShadowPath = path.join(
    __dirname,
    "assets",
    "custom_vscode_with_shadow.css"
  );
  const destPath = path.join(homeDir, ".vscode", "custom_vscode.css");
  const destShadowPath = path.join(
    homeDir,
    ".vscode",
    "custom_vscode_with_shadow.css"
  );
  const destSnowPath = path.join(homeDir, ".vscode", "custom_snow.js");
  const destCursorTrailPath = path.join(
    homeDir,
    ".vscode",
    "custom_cursor_trail.js"
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
    fs.copyFileSync(sourceSnowPath, destSnowPath);
    fs.copyFileSync(sourceCursorTrailPath, destCursorTrailPath);

    // Write cursor trail file duration before copy
    const config = vscode.workspace.getConfiguration("babyjazz");
    const duration = config.get("cursor-trail-duration", 1500);
    const cursorTrailContent = `const DURATION = ${duration};\n`;
    // Read the original file content
    const originalContent = fs.readFileSync(sourceCursorTrailPath, "utf8");
    // Write cursorTrailContent as the first line, then the rest of the file
    fs.writeFileSync(destCursorTrailPath, cursorTrailContent + originalContent);

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
