function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

const DURATION = 1500;

setTimeout(() => {
  const activeObservers = new Map();

  function setupCursorTrail(cursorWrapper) {
    const existing = cursorWrapper.querySelector(".monaco-mouse-cursor-text");
    if (!existing || activeObservers.has(existing)) return;

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        const y = existing.style.top;
        const x = existing.style.left;
        if (x === "0px" && y === "0px") return;

        const left = parseFloat(x);
        const top = parseFloat(y) + 50;
        const random = `${getRandomNumber(2, 14)}px`;
        const translate = `translate(${getRandomNumber(
          -10,
          10
        )}px, ${getRandomNumber(-10, 10)}px)`;
        const colorRandomed = getRandomNumber(100, 255);
        const backgroundColor = `rgb(${colorRandomed}, ${colorRandomed}, ${colorRandomed})`;

        const trailEl = document.createElement("div");
        trailEl.classList.add("trail");
        Object.assign(trailEl.style, {
          position: "absolute",
          zIndex: 100,
          width: random,
          height: random,
          borderRadius: "50%",
          backgroundColor,
          left: `${left}px`,
          top: `${top}px`,
          transform: translate,
          opacity: "0.7",
        });

        cursorWrapper.appendChild(trailEl);

        setTimeout(() => {
          Object.assign(trailEl.style, {
            transition: `all ${DURATION}ms ease-out`,
            opacity: "0",
          });
          setTimeout(() => trailEl.remove(), DURATION);
        }, 10);
      }
    });

    observer.observe(existing, { attributeFilter: ["style"] });
    activeObservers.set(existing, observer);
  }

  function watchEditorInstance(cursorWrapper) {
    // Watch inside this editor-instance for any added .monaco-mouse-cursor-text
    const innerWatcher = new MutationObserver(() => {
      const allCursors = cursorWrapper.querySelectorAll(
        ".monaco-mouse-cursor-text"
      );
      allCursors.forEach((cursor) => {
        setupCursorTrail(cursorWrapper);
      });
    });

    innerWatcher.observe(cursorWrapper, {
      childList: true,
      subtree: true,
    });

    // Also run once in case cursors already exist
    const allCursors = cursorWrapper.querySelectorAll(
      ".monaco-mouse-cursor-text"
    );
    allCursors.forEach(() => setupCursorTrail(cursorWrapper));
  }

  // Watch for added/removed .editor-instance
  const editorInstanceWatcher = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeType !== 1) continue;

        if (addedNode.matches(".editor-instance")) {
          watchEditorInstance(addedNode);
        } else {
          const instances = addedNode.querySelectorAll?.(".editor-instance");
          instances?.forEach(watchEditorInstance);
        }
      }

      for (const removedNode of mutation.removedNodes) {
        if (removedNode.nodeType !== 1) continue;

        const allCursors = removedNode.querySelectorAll?.(
          ".monaco-mouse-cursor-text"
        );
        allCursors?.forEach((cursor) => {
          const observer = activeObservers.get(cursor);
          if (observer) {
            observer.disconnect();
            activeObservers.delete(cursor);
          }
        });
      }
    }
  });

  editorInstanceWatcher.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Init already existing instances
  document.querySelectorAll(".editor-instance").forEach(watchEditorInstance);
}, 3000);
