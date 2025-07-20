const vscode = require("vscode");
const { setFollowCursorSpeed, followCursor } = require("./follow-cursor");

const registerFollowCursor = (followCursorRegister) => {
  const config = vscode.workspace.getConfiguration();
  const enabled = config.get("lazyvscode-theme.follow-cursor", true);
  const speed = config.get("lazyvscode-theme.follow-cursor-speed", 10);
  setFollowCursorSpeed(speed);
  if (enabled) {
    if (!followCursorRegister) {
      followCursorRegister = vscode.window.onDidChangeTextEditorSelection(
        () => {
          followCursor();
        }
      );
    }
  } else {
    if (followCursorRegister) {
      followCursorRegister.dispose();
      followCursorRegister = undefined;
    }
  }
};

module.exports = {
  registerFollowCursor,
};
