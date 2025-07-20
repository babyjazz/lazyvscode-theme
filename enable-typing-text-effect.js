const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const enableTypingTextEffect = async () => {
  try {
    const homeDir = require("os").homedir();
    const sourcePath = path.join(__dirname, "assets", "custom_typing_text.js");
    const destPath = path.join(homeDir, ".vscode", "custom_typing_text.js");
    const config = vscode.workspace.getConfiguration();

    // Create .vscode directory if it doesn't exist
    if (!fs.existsSync(path.join(homeDir, ".vscode"))) {
      fs.mkdirSync(path.join(homeDir, ".vscode"));
    }

    // Read the original file content
    const originalContent = fs.readFileSync(sourcePath, "utf8");
    try {
      fs.writeFileSync(destPath, originalContent);
    } catch (err) {
      vscode.window.showErrorMessage(
        "Failed to write typing text effect file: " + err.message
      );
    }

    await vscode.workspace
      .getConfiguration()
      .update("lazyvscode-theme.is-enable-typing-text-effect", true, true);
    const currentConfig = await config.get("vscode_custom_css.imports", []);
    currentConfig.push(
      `file://${process.env.HOME}/.vscode/custom_typing_text.js`
    );

    await config.update("vscode_custom_css.imports", currentConfig, true);
    await vscode.workspace.saveAll();
    await vscode.commands.executeCommand("extension.updateCustomCSS");
    return vscode.commands.executeCommand("workbench.action.reloadWindow");
  } catch (error) {
    vscode.window.showErrorMessage(
      "Failed to enable typing text effect: " + error.message
    );
  }
};

const disableTypingTextEffect = async () => {
  const config = vscode.workspace.getConfiguration();

  await vscode.workspace
    .getConfiguration()
    .update("lazyvscode-theme.is-enable-typing-text-effect", false, true);
  const currentConfig = await config.get("vscode_custom_css.imports", []);
  currentConfig.splice(
    currentConfig.indexOf(
      `file://${process.env.HOME}/.vscode/custom_typing_text.js`
    ),
    1
  );
  await config.update("vscode_custom_css.imports", currentConfig, true);
  await vscode.workspace.saveAll();
  await vscode.commands.executeCommand("extension.updateCustomCSS");
  return vscode.commands.executeCommand("workbench.action.reloadWindow");
};

module.exports = {
  enableTypingTextEffect,
  disableTypingTextEffect,
};
