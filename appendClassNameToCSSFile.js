const vscode = require("vscode");

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
    const cursorSmoothDuration = config.get("babyjazz.cursor-smooth-duration");
    const cursorSmoothEasing = config.get("babyjazz.cursor-smooth-easing");

    const rootVars = `
:root {
  --lazyvscode-font-size: ${fontSize}px;
  --lazyvscode-font-weight: ${fontWeight};
  --lazyvscode-font-family: ${fontFamily};
  --lazyvscode-cursor-smooth-duration: ${cursorSmoothDuration}ms;
  --lazyvscode-cursor-smooth-easing: ${cursorSmoothEasing};
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

module.exports = {
  appendClassnameToCSSFiles,
};
