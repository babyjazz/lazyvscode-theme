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
let lineNumber = cursorPosition.line; // Add 1 since VSCode lines are 0-based
let fromLineNumber = cursorPosition.line;
const MIN_RANGE = 8;
const TRAIL_LENGTH = 7;
const SPEED = 6;
let topToBottomInterval = null;
let bottomToTopInterval = null;
let trail = fromLineNumber;
let head = lineNumber;

const followCursor = () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const cursorPosition = editor.selection.active;
  lineNumber = cursorPosition.line; // Add 1 since VSCode lines are 0-based
  const characterNumber = cursorPosition.character + 1; // Add 1 to make it 1-based like line numbers

  log("####1");
  // ONLY TOP TO BOTTOM
  if (lineNumber - trail >= MIN_RANGE) {
    log("####2");
    let i = 0;
    if (!topToBottomInterval) {
      log("####3");
      topToBottomInterval = setInterval(() => {
        log("####4");
        if (trail === fromLineNumber && head === fromLineNumber) {
          trail = fromLineNumber + i;
          head = fromLineNumber + TRAIL_LENGTH + i;
          log("####5");
        } else {
          trail++;
          head++;
          log("####6");
        }
        let range = new vscode.Range(trail, 0, head, 0);
        if (head >= lineNumber) {
          log("####7");
          range = new vscode.Range(trail, 0, lineNumber, 0);
        }

        editor.setDecorations(circleDecorationType, [{ range }]);
        if (trail >= lineNumber) {
          log("####8");
          // --revert --
          const tempTrail = trail;
          const tempHead = head;
          trail = tempHead;
          head = tempTrail;
          fromLineNumber = head;
          //  ./ --revert -- ./
          clearInterval(topToBottomInterval);
          topToBottomInterval = null;
          editor.setDecorations(circleDecorationType, []);
          followCursor();
        } else {
          i++;
        }
      }, SPEED);
    }
  }

  // ONLY BOTTOM TO TOP
  log("####1A");
  if (fromLineNumber - lineNumber >= MIN_RANGE) {
    log("####2A");
    let i = 0;
    if (!bottomToTopInterval) {
      log("####3A");
      bottomToTopInterval = setInterval(() => {
        if (trail === fromLineNumber && head === fromLineNumber) {
          trail = fromLineNumber - i;
          head = fromLineNumber - TRAIL_LENGTH - i;
          log("####4A");
        } else {
          trail--;
          head--;
          log("####5A");
        }
        let range = new vscode.Range(
          head <= 0 ? 0 : head,
          0,
          trail <= 0 ? 0 : trail,
          0
        );
        if (head <= lineNumber) {
          log("####6A");
          range = new vscode.Range(lineNumber, 0, trail, 0);
        }
        editor.setDecorations(circleDecorationType, [{ range }]);
        if (trail <= lineNumber) {
          log("####7A");
          // --revert --
          const tempTrail = trail;
          const tempHead = head;
          trail = tempHead;
          head = tempTrail;
          fromLineNumber = trail;
          //  ./ --revert -- ./
          clearInterval(bottomToTopInterval);
          bottomToTopInterval = null;
          editor.setDecorations(circleDecorationType, []);
          followCursor();
        } else {
          i++;
        }
      }, SPEED);
    }
  }
};

module.exports = {
  followCursor,
};
