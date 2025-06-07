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

    fs.copyFileSync(sourcePath, destPath);
    await vscode.workspace
      .getConfiguration()
      .update("babyjazz.is-enable-cursor-trail", true, true);
    await config.update(
      "vscode_custom_css.imports",
      [
        `file://${process.env.HOME}/.vscode/custom_vscode.css`,
        `file://${process.env.HOME}/.vscode/custom_cursor_trail.js`,
      ],
      true
    );
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
    .update("babyjazz.is-enable-cursor-trail", false, true);
  await config.update(
    "vscode_custom_css.imports",
    [`file://${process.env.HOME}/.vscode/custom_vscode.css`],
    true
  );
  await vscode.workspace.saveAll();
  await vscode.commands.executeCommand("extension.updateCustomCSS");
  return vscode.commands.executeCommand("workbench.action.reloadWindow");
};

module.exports = {
  enableCursorTrail,
  disableCursorTrail,
};
