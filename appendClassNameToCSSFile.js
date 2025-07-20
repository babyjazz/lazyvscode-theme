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
    const cursorSmoothDuration = config.get(
      "lazyvscode-theme.cursor-smooth-duration"
    );
    const cursorSmoothEasing = config.get(
      "lazyvscode-theme.cursor-smooth-easing"
    );
    const typingTextAnimationName = config.get(
      "lazyvscode-theme.typing-text-animation-name"
    );
    const typingTextAnimationDuration = config.get(
      "lazyvscode-theme.typing-text-animation-duration"
    );
    const typingTextAnimationEasing = config.get(
      "lazyvscode-theme.typing-text-animation-easing"
    );

    const rootVars = `
:root {
  --lazyvscode-font-size: ${fontSize}px;
  --lazyvscode-font-weight: ${fontWeight};
  --lazyvscode-font-family: ${fontFamily};
  --lazyvscode-cursor-smooth-duration: ${cursorSmoothDuration}ms;
  --lazyvscode-cursor-smooth-easing: ${cursorSmoothEasing};
  --lazyvscode-typing-text-animation-name: ${typingTextAnimationName};
  --lazyvscode-typing-text-animation-duration: ${typingTextAnimationDuration}ms;
  --lazyvscode-typing-text-animation-easing: ${typingTextAnimationEasing};
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
