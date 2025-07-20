setTimeout(() => {
  // Store currently processed editor instances and their handlers
  const processedEditors = new WeakMap();
  const typingTimeouts = new WeakMap(); // Track timeouts per editor
  const specialAcceptKeys = ["Tab", "Enter"];
  const specialCharacterMapper = ["🤖", "⏎"];

  const handleTypingEffect = (event, editor) => {
    const cursorWrapper = editor.querySelector(".cursors-layer");
    const cursor = editor.querySelector(".cursors-layer > .cursor");
    const isVimInsertMode = cursor.style.width === "2px";
    // Enable this condition if disable specials key
    // if (event.key.length !== 1) return;
    const regex = /^[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]$/;
    const isValidToShow = regex.test(event.key);
    if (!isVimInsertMode) return;
    cursor.classList.add("typing-smear-cursor");
    setTimeout(() => {
      cursor.classList.remove("typing-smear-cursor");
    }, 400);

    if (!isValidToShow && !specialAcceptKeys.includes(event.key)) return;
    const typingText = document.createElement("div");
    typingText.classList.add("typing-text");
    if (specialAcceptKeys.includes(event.key)) {
      const index = specialAcceptKeys.indexOf(event.key);
      typingText.innerHTML = specialCharacterMapper[index];
      cursor.classList.add("tab-smear-cursor");
      setTimeout(() => {
        cursor.classList.remove("tab-smear-cursor");
      }, 400);
    } else {
      typingText.innerHTML = event.key;
    }

    typingText.style.top = cursor.style.top;
    typingText.style.left = cursor.style.left;

    cursorWrapper.appendChild(typingText);
    // Store timeout per editor
    const timeoutId = setTimeout(() => {
      if (cursorWrapper.contains(typingText)) {
        cursorWrapper.removeChild(typingText);
      }
      typingTimeouts.delete(editor); // Clean up after timeout fires
    }, 100);
    typingTimeouts.set(editor, timeoutId);
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
      // Clear any pending typing timeout for this editor
      const timeoutId = typingTimeouts.get(editor);
      if (timeoutId) {
        clearTimeout(timeoutId);
        typingTimeouts.delete(editor);
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
