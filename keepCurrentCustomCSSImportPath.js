const vscode = require("vscode");

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

module.exports = {
  keepCurrentCustomCSSImportPath,
};
