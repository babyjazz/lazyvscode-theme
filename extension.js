const vscode = require("vscode");
const { followCursor } = require("./follow-cursor");

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

  const appendClassnameToCSSFiles = () => {
    const fs = require("fs");
    const path = require("path");
    const homeDir = require("os").homedir();

    try {
      const cssFilePath = path.join(homeDir, ".vscode", "custom_vscode.css");
      const cssFilePathShadow = path.join(
        homeDir,
        ".vscode",
        "custom_vscode_with_shadow.css"
      );

      // Get font size from VSCode settings
      const config = vscode.workspace.getConfiguration();
      const fontSize = config.get("editor.fontSize") || 14; // Default to 14 if not set
      const fontWeight = config.get("editor.fontWeight") || "bold"; // Default to bold if not set
      const fontFamily =
        config.get("editor.fontFamily") || "Consolas, 'Courier New', monospace"; // Default to VSCode's default font

      const rootVars = `
:root {
  --lazyvscode-font-size: ${fontSize}px;
  --lazyvscode-font-weight: ${fontWeight};
  --lazyvscode-font-family: ${fontFamily};
}
`;
      // const macCssContent = `\n.mac {\n  font-family: var(--lazyvscode-font-family) !important;\n  font-weight: var(--lazyvscode-font-weight);\n}\n`;

      // Write the root variables and mac class to both files
      fs.appendFileSync(cssFilePath, rootVars);
      fs.appendFileSync(cssFilePathShadow, rootVars);
    } catch (error) {
      throw new Error(`Failed to write CSS files: ${error.message}`);
    }
  };

  const enableOrUpdate = async ({ filePath, shouldReload }) => {
    copyFile();
    appendClassnameToCSSFiles();

    try {
      const config = vscode.workspace.getConfiguration();
      await config.update("vscode_custom_css.imports", [filePath], true);
      await vscode.workspace.saveAll();
      await vscode.commands.executeCommand("extension.updateCustomCSS");

      if (shouldReload) {
        return vscode.commands.executeCommand("workbench.action.reloadWindow");
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        "Failed to update Custom CSS: " + error.message
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
        const config = vscode.workspace.getConfiguration();
        await config.update("vscode_custom_css.imports", [], true);
        // Set to VSCode default font settings
        await config.update("editor.fontFamily", undefined, true);
        await config.update("terminal.integrated.fontFamily", undefined, true);
        await config.update("editor.fontWeight", undefined, true);
        await config.update("terminal.integrated.fontWeight", undefined, true);
        await vscode.workspace.saveAll();
        await vscode.commands.executeCommand("extension.updateCustomCSS");
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
        appendClassnameToCSSFiles();
        const config = vscode.workspace.getConfiguration();
        await config.update(
          "vscode_custom_css.imports",
          [`file://${process.env.HOME}/.vscode/custom_vscode_with_shadow.css`],
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

  const disableShadow = vscode.commands.registerCommand(
    "babyjazz.disable-shadow",
    async () => {
      try {
        appendClassnameToCSSFiles();
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

  const keepCurrentCustomCSSImportPath = () => {
    const config = vscode.workspace.getConfiguration();
    const currentImports = config.get("vscode_custom_css.imports") || [];
    const isShadowEnabled = currentImports.some((path) =>
      path.includes("with_shadow")
    );
    const cssToUse = isShadowEnabled
      ? `file://${process.env.HOME}/.vscode/custom_vscode_with_shadow.css`
      : `file://${process.env.HOME}/.vscode/custom_vscode.css`;
    return cssToUse;
  };
  const followCursorRegister = vscode.window.onDidChangeTextEditorSelection(
    () => {
      followCursor();
    }
  );

  followCursor();
  enableOrUpdate({ shouldReload: false });
  context.subscriptions.push(enableFancyUI);
  context.subscriptions.push(disableFancyUI);
  context.subscriptions.push(enableShadow);
  context.subscriptions.push(disableShadow);
  context.subscriptions.push(followCursorRegister);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
