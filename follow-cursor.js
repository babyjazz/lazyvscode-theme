const vscode = require("vscode");

// Define circle size constant
const CIRCLE_SIZE = 18;

// Create a decoration type for the circle
const circleDecorationType = vscode.window.createTextEditorDecorationType({
  gutterIconPath: vscode.Uri.parse(
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${CIRCLE_SIZE}" height="${CIRCLE_SIZE}" viewBox="0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}"><defs><filter id="shadow"><feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="%2300539C" flood-opacity="0.8"/></filter></defs><circle cx="${
      CIRCLE_SIZE / 2
    }" cy="${CIRCLE_SIZE / 2}" r="${
      CIRCLE_SIZE / 3
    }" fill="%2300539C" filter="url(%23shadow)"/></svg>`
  ),
  gutterIconSize: `${CIRCLE_SIZE}px`,
});

const log = (msg) => {
  console.log("#################back followCursor #################");
  console.log("debug #", msg);
  console.log("#################back followCursor #################");
};

const editor = vscode.window.activeTextEditor;
const cursorPosition = editor.selection.active;
let fromLineNumber = cursorPosition.line;
let decorationTimeout = null;
const minRange = 50;
const tailLength = 8;
const SPEED = 6;

const followCursor = () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const cursorPosition = editor.selection.active;
  const lineNumber = cursorPosition.line; // Add 1 since VSCode lines are 0-based
  const characterNumber = cursorPosition.character + 1; // Add 1 to make it 1-based like line numbers

  // ONLY TOP TO BOTTOM
  if (lineNumber - fromLineNumber >= minRange) {
    let i = 0;
    const interval = setInterval(() => {
      const trail = fromLineNumber + i;
      const head = fromLineNumber + tailLength + i;

      let range = new vscode.Range(trail, 0, head, 0);
      if (head >= lineNumber) {
        range = new vscode.Range(trail, 0, lineNumber, 0);
      }

      editor.setDecorations(circleDecorationType, [{ range }]);

      log(`from ${trail} to ${lineNumber}`);
      if (trail >= lineNumber) {
        clearInterval(interval);
        fromLineNumber = lineNumber;
        editor.setDecorations(circleDecorationType, []);
      } else {
        i++;
      }
    }, SPEED);
  }
  // ONLY BOTTOM TO TOP
  if (fromLineNumber - lineNumber >= minRange) {
    let i = 0;
    const interval = setInterval(() => {
      const _trail = fromLineNumber - i;
      const _head = fromLineNumber - tailLength - i;
      const trail = _trail <= 0 ? 0 : _trail;
      const head = _head <= 0 ? 0 : _head;

      let range = new vscode.Range(head, 0, trail, 0);
      if (head <= lineNumber) {
        range = new vscode.Range(lineNumber, 0, trail, 0);
      }

      editor.setDecorations(circleDecorationType, [{ range }]);

      if (trail <= lineNumber) {
        log(`end`);
        clearInterval(interval);
        fromLineNumber = lineNumber;
        editor.setDecorations(circleDecorationType, []);
      } else {
        log(`rest of it`);
        i++;
      }
    }, SPEED);
  }

  // Clear any existing timeout
  if (decorationTimeout) {
    clearTimeout(decorationTimeout);
  }
};

module.exports = {
  followCursor,
};
