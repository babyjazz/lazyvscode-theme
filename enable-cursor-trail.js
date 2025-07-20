const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const enableCursorTrail = async () => {
  try {
    const homeDir = require("os").homedir();
    const sourcePath = path.join(__dirname, "assets", "custom_cursor_trail.js");
    const destPath = path.join(homeDir, ".vscode", "custom_cursor_trail.js");
    const config = vscode.workspace.getConfiguration();

    // Create .vscode directory if it doesn't exist
    if (!fs.existsSync(path.join(homeDir, ".vscode"))) {
      fs.mkdirSync(path.join(homeDir, ".vscode"));
    }

    // Write cursor trail file duration before copy
    const duration = config.get("lazyvscode-theme.cursor-trail-duration", 1500);
    const cursorTrailContent = `const DURATION = ${duration};\n`;
    // Read the original file content
    const originalContent = fs.readFileSync(sourcePath, "utf8");
    // Write cursorTrailContent as the first line, then the rest of the file, with error handling
    try {
      fs.writeFileSync(destPath, cursorTrailContent + originalContent);
    } catch (err) {
      vscode.window.showErrorMessage(
        "Failed to write cursor trail file: " + err.message
      );
    }

    await vscode.workspace
      .getConfiguration()
      .update("lazyvscode-theme.is-enable-cursor-trail", true, true);
    const currentConfig = await config.get("vscode_custom_css.imports", []);
    currentConfig.push(
      `file://${process.env.HOME}/.vscode/custom_cursor_trail.js`
    );

    await config.update("vscode_custom_css.imports", currentConfig, true);
    await vscode.workspace.saveAll();
    await vscode.commands.executeCommand("extension.updateCustomCSS");
    return vscode.commands.executeCommand("workbench.action.reloadWindow");
  } catch (error) {
    vscode.window.showErrorMessage(
      "Failed to enable cursor trail: " + error.message
    );
  }
};

const disableCursorTrail = async () => {
  const config = vscode.workspace.getConfiguration();

  await vscode.workspace
    .getConfiguration()
    .update("lazyvscode-theme.is-enable-cursor-trail", false, true);
  const currentConfig = await config.get("vscode_custom_css.imports", []);
  currentConfig.splice(
    currentConfig.indexOf(
      `file://${process.env.HOME}/.vscode/custom_cursor_trail.js`
    ),
    1
  );
  await config.update("vscode_custom_css.imports", currentConfig, true);
  await vscode.workspace.saveAll();
  await vscode.commands.executeCommand("extension.updateCustomCSS");
  return vscode.commands.executeCommand("workbench.action.reloadWindow");
};

module.exports = {
  enableCursorTrail,
  disableCursorTrail,
};
