const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const enableSnow = async () => {
  try {
    const homeDir = require("os").homedir();
    const sourcePath = path.join(__dirname, "assets", "custom_snow.js");
    const destPath = path.join(homeDir, ".vscode", "custom_snow.js");
    const config = vscode.workspace.getConfiguration();

    // Create .vscode directory if it doesn't exist
    if (!fs.existsSync(path.join(homeDir, ".vscode"))) {
      fs.mkdirSync(path.join(homeDir, ".vscode"));
    }

    fs.copyFileSync(sourcePath, destPath);
    await vscode.workspace
      .getConfiguration()
      .update("babyjazz.is-enable-snow", true, true);
    const currentConfig = await config.get("vscode_custom_css.imports", []);
    currentConfig.push(`file://${process.env.HOME}/.vscode/custom_snow.js`);

    await config.update("vscode_custom_css.imports", currentConfig, true);
    await vscode.workspace.saveAll();
    await vscode.commands.executeCommand("extension.updateCustomCSS");
    return vscode.commands.executeCommand("workbench.action.reloadWindow");
  } catch (error) {
    vscode.window.showErrorMessage(
      "Failed to enable snow effect: " + error.message
    );
  }
};

const disableSnow = async () => {
  const config = vscode.workspace.getConfiguration();

  await vscode.workspace
    .getConfiguration()
    .update("babyjazz.is-enable-snow", false, true);
  const currentConfig = await config.get("vscode_custom_css.imports", []);
  currentConfig.splice(
    currentConfig.indexOf(`file://${process.env.HOME}/.vscode/custom_snow.js`),
    1
  );
  await config.update("vscode_custom_css.imports", currentConfig, true);
  await vscode.workspace.saveAll();
  await vscode.commands.executeCommand("extension.updateCustomCSS");
  return vscode.commands.executeCommand("workbench.action.reloadWindow");
};

module.exports = {
  enableSnow,
  disableSnow,
};
