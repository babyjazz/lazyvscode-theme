const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  // Create output channel once at activation time
  const outputChannel = vscode.window.createOutputChannel("BabyJazz");

  // Trail effect configuration
  let previousPositions = [];
  const TRAIL_LENGTH = 10; // Number of previous positions to show in trail
  let currentTimeout = null;
  let isTrailEnabled = false;

  // Create decoration types for different sizes
  const sizes = [16, 14, 12, 10, 8, 6, 4];
  const trailDecorationTypes = sizes.map((size) =>
    vscode.window.createTextEditorDecorationType({
      gutterIconPath: context.asAbsolutePath("circle.svg"),
      gutterIconSize: `${size}px`,
    })
  );

  // Function to start sequential removal of circles
  const startSequentialRemoval = (editor) => {
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }

    const removeNext = () => {
      if (previousPositions.length > 0) {
        // Remove the last (oldest) position
        previousPositions.pop();

        // Clear all decorations and reapply for remaining positions
        trailDecorationTypes.forEach((decorationType) => {
          editor.setDecorations(decorationType, []);
        });

        // Reapply decorations for remaining positions
        previousPositions.forEach((line, index) => {
          const decorationType =
            trailDecorationTypes[
              Math.min(index, trailDecorationTypes.length - 1)
            ];
          editor.setDecorations(decorationType, [
            {
              range: new vscode.Range(line, 0, line, 0),
              renderOptions: { opacity: 1 },
            },
          ]);
        });

        // Schedule next removal if there are more positions
        if (previousPositions.length > 0) {
          currentTimeout = setTimeout(removeNext, 60);
        }
      }
    };

    currentTimeout = setTimeout(removeNext, 60);
  };

  // Function to update trail decorations
  const updateTrailDecorations = (editor) => {
    if (!editor || !isTrailEnabled) {
      trailDecorationTypes.forEach((decorationType) => {
        editor?.setDecorations(decorationType, []);
      });
      return;
    }

    // Clear all previous decorations
    trailDecorationTypes.forEach((decorationType) => {
      editor.setDecorations(decorationType, []);
    });

    // Apply decorations for each position with different sizes
    previousPositions.forEach((line, index) => {
      const decorationType =
        trailDecorationTypes[Math.min(index, trailDecorationTypes.length - 1)];
      editor.setDecorations(decorationType, [
        {
          range: new vscode.Range(line, 0, line, 0),
          renderOptions: { opacity: 1 },
        },
      ]);
    });

    // Start the sequential removal process
    startSequentialRemoval(editor);
  };

  // Function to handle cursor movement
  const handleCursorMove = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !isTrailEnabled) return;

    const currentLine = editor.selection.active.line;

    // Only add position if it's different from the last one
    if (
      previousPositions.length === 0 ||
      previousPositions[0] !== currentLine
    ) {
      // Add new position to the front
      previousPositions.unshift(currentLine);
      previousPositions = previousPositions.slice(0, TRAIL_LENGTH);

      // Clear any existing timeout
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      // Update decorations and start new removal sequence
      updateTrailDecorations(editor);
    }
  };

  // Register cursor movement listener
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(handleCursorMove)
  );

  // Register listener for active editor changes
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      if (isTrailEnabled) {
        handleCursorMove();
      }
    })
  );

  // Register enable trail command
  const enableTrail = vscode.commands.registerCommand(
    "babyjazz.enable-cursor-trail",
    () => {
      isTrailEnabled = true;
      handleCursorMove();
      vscode.window.showInformationMessage("Cursor trail effect enabled");
    }
  );

  // Register disable trail command
  const disableTrail = vscode.commands.registerCommand(
    "babyjazz.disable-cursor-trail",
    () => {
      isTrailEnabled = false;
      previousPositions = [];
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        trailDecorationTypes.forEach((decorationType) => {
          editor.setDecorations(decorationType, []);
        });
      }
      vscode.window.showInformationMessage("Cursor trail effect disabled");
    }
  );

  isTrailEnabled = true;
  handleCursorMove();

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

      // Initialize cursor trail effect
      handleCursorMove();

      if (shouldReload) {
        return vscode.commands.executeCommand("workbench.action.reloadWindow");
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        "Failed to update Custom CSS: " + error.message
      );
    }
  };

  const getCurrentCursorPosition = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      outputChannel.appendLine("No active text editor");
      outputChannel.show();
      return null;
    }

    if (editor.selection.isEmpty) {
      const position = editor.selection.active;
      outputChannel.appendLine(
        `##################### Cursor Position: line ${position.line}, character ${position.character}`
      );
      outputChannel.show(true); // true parameter brings the output to focus

      return {
        line: position.line, // y coordinate (0-based)
        character: position.character, // x coordinate (0-based)
        lineText: editor.document.lineAt(position.line).text,
      };
    }
    return null;
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

  const showPosition = vscode.commands.registerCommand(
    "babyjazz.show-position",
    () => {
      getCurrentCursorPosition();
    }
  );

  enableOrUpdate({ shouldReload: false });
  context.subscriptions.push(enableFancyUI);
  context.subscriptions.push(disableFancyUI);
  context.subscriptions.push(enableShadow);
  context.subscriptions.push(disableShadow);
  context.subscriptions.push(showPosition);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
