const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
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

  const enableOrUpdate = async ({ filePath, shouldReload }) => {
    copyFile();

    try {
      const config = vscode.workspace.getConfiguration();
      await config.update("vscode_custom_css.imports", [filePath], true);
      await config.update(
        "terminal.integrated.fontFamily",
        "ComicShannsMono Nerd Font",
        true
      );
      await config.update("editor.fontWeight", "bold", true);
      await config.update(
        "editor.fontFamily",
        "ComicShannsMono Nerd Font",
        true
      );
      await config.update("terminal.integrated.fontWeight", "bold", true);
      await vscode.workspace.saveAll();
      await vscode.commands.executeCommand("extension.updateCustomCSS");
      // vscode.window.showInformationMessage(
      //   "Custom CSS updated successfully"
      // );
      if (shouldReload) {
        return vscode.commands.executeCommand("workbench.action.reloadWindow");
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        "Failed to update Custom CSS: " + err.message
      );
    }
  };

  const enableFancyUI = vscode.commands.registerCommand(
    "babyjazz.enable-lazyvscode-theme",
    () => {
      enableOrUpdate({
        filePath: `file://${process.env.HOME}/.vscode/custom_vscode.css`,
        shouldReload: true,
      });
    }
  );

  const disableFancyUI = vscode.commands.registerCommand(
    "babyjazz.disable-lazyvscode-theme",
    async () => {
      try {
        await vscode.workspace
          .getConfiguration()
          .update("vscode_custom_css.imports", [], true);
        await vscode.workspace
          .getConfiguration()
          .update("editor.fontFamily", undefined, true);
        await vscode.workspace
          .getConfiguration()
          .update("terminal.integrated.fontFamily", undefined, true);
        await vscode.workspace
          .getConfiguration()
          .update("editor.fontWeight", undefined, true);
        await vscode.workspace
          .getConfiguration()
          .update("terminal.integrated.fontWeight", undefined, true);
        await vscode.workspace.saveAll();
        await vscode.commands.executeCommand("extension.updateCustomCSS");
        // vscode.window.showInformationMessage(
        //   "Custom CSS updated successfully"
        // );
        return vscode.commands.executeCommand("workbench.action.reloadWindow");
      } catch (err) {
        vscode.window.showErrorMessage(
          "Failed to update Custom CSS: " + err.message
        );
      }
    }
  );

  const enableShadow = vscode.commands.registerCommand(
    "babyjazz.enable-shadow",
    async () => {
      try {
        const config = vscode.workspace.getConfiguration();
        await config.update(
          "vscode_custom_css.imports",
          [`file://${process.env.HOME}/.vscode/custom_vscode_with_shadow.css`],
          true
        );
        await config.update(
          "terminal.integrated.fontFamily",
          "ComicShannsMono Nerd Font",
          true
        );
        await config.update("editor.fontWeight", "bold", true);
        await config.update(
          "editor.fontFamily",
          "ComicShannsMono Nerd Font",
          true
        );
        await config.update("terminal.integrated.fontWeight", "bold", true);
        await vscode.workspace.saveAll();
        await vscode.commands.executeCommand("extension.updateCustomCSS");
        // vscode.window.showInformationMessage(
        //   "Custom CSS updated successfully"
        // );
        if (shouldReload) {
          return vscode.commands.executeCommand(
            "workbench.action.reloadWindow"
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to update Custom CSS: " + error.message
        );
      }
    }
  );

  const disableShadow = vscode.commands.registerCommand(
    "babyjazz.disable-shadow",
    async () => {
      try {
        const config = vscode.workspace.getConfiguration();
        await config.update(
          "vscode_custom_css.imports",
          [`file://${process.env.HOME}/.vscode/custom_vscode.css`],
          true
        );
        await vscode.workspace.saveAll();
        await vscode.commands.executeCommand("extension.updateCustomCSS");
        // vscode.window.showInformationMessage(
        //   "Custom CSS updated successfully"
        // );
        return vscode.commands.executeCommand("workbench.action.reloadWindow");
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to update Custom CSS: " + error.message
        );
      }
    }
  );

  enableOrUpdate({ shouldReload: false });
  context.subscriptions.push(enableFancyUI);
  context.subscriptions.push(disableFancyUI);
  context.subscriptions.push(enableShadow);
  context.subscriptions.push(disableShadow);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
