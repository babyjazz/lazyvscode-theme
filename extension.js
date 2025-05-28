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
      const fs = require("fs");
      const path = require("path");
      const homeDir = require("os").homedir();
      const config = vscode.workspace.getConfiguration();

      const cssFiles = [
        path.join(homeDir, ".vscode", "custom_vscode.css"),
        path.join(homeDir, ".vscode", "custom_vscode_with_shadow.css"),
      ];

      cssFiles.forEach((file) => {
        if (fs.existsSync(file)) {
          let cssContent = fs.readFileSync(file, "utf8");
          // Remove existing root variables if they exist
          cssContent = cssContent.replace(/\:root\s*{[^}]*}\s*/g, "");
          fs.writeFileSync(file, cssContent);
        }
      });

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
      const macCssContent =
        '\n.mac {\n  font-family: "ComicShannsMono Nerd Font" !important;\n  font-weight: bold;\n}\n';

      fs.appendFileSync(cssFilePath, macCssContent);
      fs.appendFileSync(cssFilePathShadow, macCssContent);
    } catch (error) {
      throw new Error(`Failed to write CSS files: ${error.message}`);
    }
  };

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

  const enableComicShannsMonoFont = vscode.commands.registerCommand(
    "babyjazz.enable-comic-shanns-mono-font",
    async () => {
      const config = vscode.workspace.getConfiguration();

      try {
        // Write CSS files
        appendClassnameToCSSFiles();

        // Update font configuration
        const cssToUse = keepCurrentCustomCSSImportPath();
        vscode.window.showInformationMessage(cssToUse);
        await config.update("vscode_custom_css.imports", [cssToUse], true);
        await config.update(
          "editor.fontFamily",
          "ComicShannsMono Nerd Font",
          true
        );
        await config.update(
          "terminal.integrated.fontFamily",
          "ComicShannsMono Nerd Font",
          true
        );
        await config.update("editor.fontWeight", "bold", true);
        await config.update("terminal.integrated.fontWeight", "bold", true);

        // Reload window to apply changes
        await vscode.commands.executeCommand("extension.updateCustomCSS");
        await vscode.commands.executeCommand("workbench.action.reloadWindow");

        return vscode.window.showInformationMessage(
          "Please make sure you've installed ComicShannsMono font"
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to update font settings: " + error.message
        );
      }
    }
  );

  const disableComicShannsMonoFont = vscode.commands.registerCommand(
    "babyjazz.disable-comic-shanns-mono-font",
    async () => {
      const fs = require("fs");
      const path = require("path");
      const homeDir = require("os").homedir();
      const config = vscode.workspace.getConfiguration();

      try {
        const cssToUse = keepCurrentCustomCSSImportPath();
        // Remove .mac CSS block from custom_vscode.css
        const cssFilePath = path.join(homeDir, ".vscode", "custom_vscode.css");
        const cssFilePathShadow = path.join(
          homeDir,
          ".vscode",
          "custom_vscode_with_shadow.css"
        );
        let cssContent = fs.readFileSync(cssFilePath, "utf8");
        cssContent = cssContent.replace(
          /\n\.mac\s*{\s*font-family:\s*"ComicShannsMono Nerd Font"\s*!important;\s*font-weight:\s*bold;\s*}\s*/g,
          ""
        );
        fs.writeFileSync(cssFilePath, cssContent);
        fs.writeFileSync(cssFilePathShadow, cssContent);

        // Reset font configuration
        await config.update("vscode_custom_css.imports", [cssToUse], true);
        await config.update("editor.fontFamily", undefined, true);
        await config.update("terminal.integrated.fontFamily", undefined, true);
        await config.update("editor.fontWeight", undefined, true);
        await config.update("terminal.integrated.fontWeight", undefined, true);

        // Reload window to apply changes
        await vscode.commands.executeCommand("extension.updateCustomCSS");
        return vscode.commands.executeCommand("workbench.action.reloadWindow");
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to reset font settings: " + error.message
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
