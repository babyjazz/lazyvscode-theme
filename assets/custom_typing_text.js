setTimeout(() => {
  // Store currently processed editor instances and their handlers
  const processedEditors = new WeakMap();
  const specialAcceptKeys = ["Tab"];

  const handleTypingEffect = (event, editor) => {
    const cursorWrapper = editor.querySelector(".cursors-layer");
    const cursor = editor.querySelector(".cursors-layer > .cursor");
    const isVimInsertMode = cursor.style.width === "2px";
    // if (event.key.length !== 1) return;
    const regex = /^[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]$/;
    const isValidToShow = regex.test(event.key);
    if (
      !isVimInsertMode ||
      (!isValidToShow && !specialAcceptKeys.includes(event.key))
    )
      return;

    const typingText = document.createElement("div");
    typingText.classList.add("typing-text");
    if (specialAcceptKeys.includes(event.key)) {
      typingText.innerHTML = "🔥";
    } else {
      typingText.innerHTML = event.key;
    }

    typingText.style.top = cursor.style.top;
    typingText.style.left = cursor.style.left;

    cursorWrapper.appendChild(typingText);
    setTimeout(() => {
      cursorWrapper.removeChild(typingText);
    }, 400);
  };

  function attachTextListener() {
    const editors = document.querySelectorAll(".editor-instance");
    if (editors.length === 0) return;

    editors.forEach((editor) => {
      if (processedEditors.has(editor)) return; // Already handled
      const handler = (event) => handleTypingEffect(event, editor);
      editor.addEventListener("keydown", handler);
      processedEditors.set(editor, handler);
    });
  }

  // If you ever need to remove listeners:
  function detachTextListener() {
    const editors = document.querySelectorAll(".editor-instance");
    editors.forEach((editor) => {
      const handler = processedEditors.get(editor);
      if (handler) {
        editor.removeEventListener("keydown", handler);
        processedEditors.delete(editor);
      }
    });
  }

  // Observe the whole body for any DOM changes
  const observer = new MutationObserver(() => {
    attachTextListener();
  });

  if (document.body) {
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial run in case editor already exists
    attachTextListener();
  }
}, 3000);
