const vscode = require("vscode");
const { copyFile } = require("./copyfile");
const { appendClassnameToCSSFiles } = require("./appendClassNameToCSSFile");
const { registerFollowCursor } = require("./registerFollowCursor");
const {
  keepCurrentCustomCSSImportPath,
} = require("./keepCurrentCustomCSSImportPath");
const fs = require("fs");
const path = require("path");
const { enableSnow, disableSnow } = require("./enable-snow");
const {
  enableCursorTrail,
  disableCursorTrail,
} = require("./enable-cursor-trail");
const {
  enablePetABulgingEyesCow,
  disablePetABulgingEyesCow,
} = require("./enable-a-bulging-eyes-cow");
const {
  enableTypingTextEffect,
  disableTypingTextEffect,
} = require("./enable-typing-text-effect");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  let followCursorRegister;

  // Listen for configuration changes to toggle follow-cursor and speed
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (
      e.affectsConfiguration("babyjazz.follow-cursor") ||
      e.affectsConfiguration("babyjazz.follow-cursor-speed")
    ) {
      registerFollowCursor(followCursorRegister);
    }
  });

  const enableOrUpdate = async ({ filePath, shouldReload }) => {
    copyFile();
    appendClassnameToCSSFiles();
    registerFollowCursor(followCursorRegister);

    try {
      const config = vscode.workspace.getConfiguration();
      const isEnableSnow = await config.get("babyjazz.is-enable-snow", false);
      const isEnablePets = await config.get("babyjazz.is-enable-pets", false);
      const isEnableCursorTrail = await config.get(
        "babyjazz.is-enable-cursor-trail",
        false
      );
      const isEnableTypingTextEffect = await config.get(
        "babyjazz.is-enable-typing-text-effect",
        false
      );
      const isEnableFollowCursor = await config.get(
        "babyjazz.follow-cursor",
        true
      );
      if (filePath) {
        const filePaths = [filePath];
        filePaths.push(`file://${process.env.HOME}/.vscode/built-in.js`);
        if (isEnableSnow) {
          filePaths.push(`file://${process.env.HOME}/.vscode/custom_snow.js`);
        }
        if (isEnableCursorTrail) {
          filePaths.push(
            `file://${process.env.HOME}/.vscode/custom_cursor_trail.js`
          );
        }
        if (isEnablePets) {
          filePaths.push(`file://${process.env.HOME}/.vscode/custom_pets.js`);
        }
        if (isEnableTypingTextEffect) {
          filePaths.push(
            `file://${process.env.HOME}/.vscode/custom_typing_text.js`
          );
        }
        if (isEnableFollowCursor) {
          filePaths.push(
            `file://${process.env.HOME}/.vscode/custom_follow_cursor.js`
          );
        }
        await config.update("vscode_custom_css.imports", filePaths, true);
      }

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

  const disableFollowCursor = vscode.commands.registerCommand(
    "babyjazz.disable-follow-cursor",
    () => {
      if (followCursorRegister) {
        followCursorRegister.dispose();
        followCursorRegister = undefined;
      }
      // Also update the setting so it stays off
      vscode.workspace
        .getConfiguration()
        .update("babyjazz.follow-cursor", false, true);
    }
  );

  const enableSnowCommand = vscode.commands.registerCommand(
    "babyjazz.enable-snow",
    async () => {
      enableSnow();
    }
  );

  const disableSnowCommand = vscode.commands.registerCommand(
    "babyjazz.disable-snow",
    async () => {
      disableSnow();
    }
  );

  const enableCursorTrailCommand = vscode.commands.registerCommand(
    "babyjazz.enable-cursor-trail",
    async () => {
      enableCursorTrail();
    }
  );

  const disableCursorTrailCommand = vscode.commands.registerCommand(
    "babyjazz.disable-cursor-trail",
    async () => {
      disableCursorTrail();
    }
  );

  const enablePetABulgingEyesCowCommand = vscode.commands.registerCommand(
    "babyjazz.enable-pet-a-bulging-eyes-cow",
    async () => {
      enablePetABulgingEyesCow();
    }
  );

  const disablePetABulgingEyesCowCommand = vscode.commands.registerCommand(
    "babyjazz.disable-pet-a-bulging-eyes-cow",
    async () => {
      disablePetABulgingEyesCow();
    }
  );

  const enableTypingTextEffectCommand = vscode.commands.registerCommand(
    "babyjazz.enable-typing-text-effect",
    async () => {
      enableTypingTextEffect();
    }
  );

  const disableTypingTextEffectCommand = vscode.commands.registerCommand(
    "babyjazz.disable-typing-text-effect",
    async () => {
      disableTypingTextEffect();
    }
  );

  enableOrUpdate({ shouldReload: false });
  context.subscriptions.push(enableFancyUI);
  context.subscriptions.push(disableFancyUI);
  context.subscriptions.push(enableShadow);
  context.subscriptions.push(disableShadow);
  context.subscriptions.push(disableFollowCursor);
  context.subscriptions.push(enableSnowCommand);
  context.subscriptions.push(disableSnowCommand);
  context.subscriptions.push(enableCursorTrailCommand);
  context.subscriptions.push(disableCursorTrailCommand);
  context.subscriptions.push(enablePetABulgingEyesCowCommand);
  context.subscriptions.push(disablePetABulgingEyesCowCommand);
  context.subscriptions.push(enableTypingTextEffectCommand);
  context.subscriptions.push(disableTypingTextEffectCommand);
  registerFollowCursor(followCursorRegister);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
