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

const editor = vscode.window.activeTextEditor;
const cursorPosition = editor.selection.active;
let lineNumber = cursorPosition.line; // Add 1 since VSCode lines are 0-based
let fromLineNumber = cursorPosition.line;
const MIN_RANGE = 8;
const TRAIL_LENGTH = 7;
let FOLLOW_CURSOR_SPEED = 15; // Default, will be set from config
const DISTANCE_THRESHOLD = 150;
let topToBottomInterval = null;
let bottomToTopInterval = null;
let trail = fromLineNumber;
let head = lineNumber;

const RAINBOW_COLORS = [
  "#FF0000", // Red
  "#FF7F00", // Orange
  "#FFFF00", // Yellow
  "#00FF00", // Green
  "#0000FF", // Blue
  "#4B0082", // Indigo
  "#9400D3", // Violet
];

// Utility to create a circle decoration type of a given size and color
function createCircleDecorationType(size, color) {
  return vscode.window.createTextEditorDecorationType({
    gutterIconPath: vscode.Uri.parse(
      `data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${size}\" height=\"${size}\" viewBox=\"0 0 ${size} ${size}\"><defs><filter id=\"shadow\"><feDropShadow dx=\"0\" dy=\"0\" stdDeviation=\"1\" flood-color=\"${encodeURIComponent(
        color
      )}\" flood-opacity=\"0.8\"/></filter></defs><circle cx=\"${
        size / 2
      }\" cy=\"${size / 2}\" r=\"${size / 3}\" fill=\"${encodeURIComponent(
        color
      )}\" filter=\"url(%23shadow)\"/></svg>`
    ),
    gutterIconSize: `${size}px`,
  });
}

// Set a trail of decorations with varying sizes
function setTrailDecorations(editor, start, end, direction, trailLength) {
  // Remove previous decorations
  if (!editor) return;
  // Clean up all possible previous decorations
  if (setTrailDecorations._activeDecorations) {
    setTrailDecorations._activeDecorations.forEach(({ type }) =>
      type.dispose()
    );
  }
  setTrailDecorations._activeDecorations = [];

  const decorations = [];
  const minSize = 4;
  const maxSize = 18;
  const length = Math.abs(end - start);
  const step = length < trailLength ? 1 : Math.floor(length / trailLength) || 1;
  let indices = [];
  if (direction === "topToBottom") {
    for (let i = 0; i <= length; i += step) {
      indices.push(start - i);
    }
  } else {
    for (let i = 0; i <= length; i += step) {
      indices.push(start + i);
    }
  }
  // Clamp to trailLength
  if (indices.length > trailLength + 1)
    indices = indices.slice(0, trailLength + 1);

  for (let i = 0; i < indices.length; i++) {
    // Interpolate size: head is maxSize, trail is minSize
    const size = Math.round(
      maxSize - ((maxSize - minSize) * i) / (indices.length - 1)
    );
    // Pick color from rainbow palette, spread across the trail
    let colorIdx = Math.floor(
      (i / (indices.length - 1)) * (RAINBOW_COLORS.length - 1)
    );
    if (isNaN(colorIdx) || colorIdx < 0) colorIdx = 0;
    const color = RAINBOW_COLORS[colorIdx];
    const type = createCircleDecorationType(size, color);
    const line = indices[i];
    const range = new vscode.Range(line, 0, line, 0);
    editor.setDecorations(type, [{ range }]);
    setTrailDecorations._activeDecorations.push({ type, line });
  }
}

const followCursor = (enable = true) => {
  if (!enable) return;
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const cursorPosition = editor.selection.active;
  lineNumber = cursorPosition.line; // Add 1 since VSCode lines are 0-based
  const characterNumber = cursorPosition.character + 1; // Add 1 to make it 1-based like line numbers
  // The greater the distance, the smaller the speed (closer to zero, but not negative)
  const distance = Math.abs(lineNumber - fromLineNumber);
  const dynamicSpeed =
    distance < DISTANCE_THRESHOLD
      ? FOLLOW_CURSOR_SPEED
      : Math.max(1, FOLLOW_CURSOR_SPEED - Math.floor(distance / 10));

  // ONLY TOP TO BOTTOM
  if (lineNumber - trail >= MIN_RANGE) {
    let i = 0;
    if (!topToBottomInterval) {
      topToBottomInterval = setInterval(() => {
        if (trail <= fromLineNumber || head <= fromLineNumber) {
          trail = fromLineNumber + 1;
          head = fromLineNumber + TRAIL_LENGTH + 1;
        } else {
          trail++;
          head++;
        }
        let range = new vscode.Range(trail, 0, head, 0);
        if (head >= lineNumber) {
          range = new vscode.Range(trail, 0, lineNumber, 0);
        }

        setTrailDecorations(
          editor,
          trail,
          head >= lineNumber ? lineNumber : head,
          "topToBottom",
          TRAIL_LENGTH
        );
        if (trail >= lineNumber) {
          // --revert --
          const tempTrail = trail;
          const tempHead = head;
          trail = tempHead;
          head = tempTrail;
          fromLineNumber = trail;
          //  ./ --revert -- ./
          clearInterval(topToBottomInterval);
          topToBottomInterval = null;
          editor.setDecorations(circleDecorationType, []);
          if (setTrailDecorations._activeDecorations) {
            setTrailDecorations._activeDecorations.forEach(({ type }) =>
              type.dispose()
            );
            setTrailDecorations._activeDecorations = [];
          }
          followCursor();
        } else {
          i++;
        }
      }, dynamicSpeed);
    }
  }

  // ONLY BOTTOM TO TOP
  if (fromLineNumber - lineNumber >= MIN_RANGE) {
    let i = 0;
    if (!bottomToTopInterval) {
      bottomToTopInterval = setInterval(() => {
        if (trail >= fromLineNumber || head >= fromLineNumber) {
          trail = fromLineNumber - i;
          head = fromLineNumber - TRAIL_LENGTH - i;
        } else {
          trail--;
          head--;
        }
        let range = new vscode.Range(
          head <= 0 ? 0 : head,
          0,
          trail <= 0 ? 0 : trail,
          0
        );
        if (head <= lineNumber) {
          range = new vscode.Range(lineNumber, 0, trail, 0);
        }
        setTrailDecorations(
          editor,
          head <= lineNumber ? lineNumber : head,
          trail,
          "bottomToTop",
          TRAIL_LENGTH
        );
        if (trail <= lineNumber) {
          // --revert --
          const tempTrail = trail;
          const tempHead = head;
          trail = tempHead;
          head = tempTrail;
          fromLineNumber = head;
          //  ./ --revert -- ./
          clearInterval(bottomToTopInterval);
          bottomToTopInterval = null;
          editor.setDecorations(circleDecorationType, []);
          if (setTrailDecorations._activeDecorations) {
            setTrailDecorations._activeDecorations.forEach(({ type }) =>
              type.dispose()
            );
            setTrailDecorations._activeDecorations = [];
          }
          followCursor();
        } else {
          i++;
        }
      }, dynamicSpeed);
    }
  }
};

module.exports = {
  followCursor,
  setFollowCursorSpeed: (speed) => {
    FOLLOW_CURSOR_SPEED = speed;
  },
};
