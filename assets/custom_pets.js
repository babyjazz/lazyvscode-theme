setTimeout(() => {
  // Store currently processed editor instances and their cow containers
  const processedEditors = new WeakMap();

  function createCow(editor) {
    // Create container
    const containerDiv = document.createElement("div");
    containerDiv.style.position = "absolute";
    containerDiv.style.bottom = "40px";
    containerDiv.style.right = "30px";
    containerDiv.style.width = "100px";
    containerDiv.style.height = "100px";
    containerDiv.style.transform = "scale(0.4)";
    containerDiv.style.zIndex = 1;

    // Cow HTML
    const cowHTML = `
    <div id="cow">
      <div id="head">
        <div id="face">
          <div id="horns">
            <div id="horn-left"></div>
            <div id="horn-right"></div>
          </div>
          <div id="ears">
            <div id="ear-left"><div id="ear-left-detail"></div></div>
            <div id="ear-right"><div id="ear-right-detail"></div></div>
          </div>
          <div id="eyes">
            <div id="eye-left"><div id="eye-left-detail1"><div id="eye-left-detail2"></div></div></div>
            <div id="eye-right"><div id="eye-right-detail1"><div id="eye-right-detail2"></div></div></div>
          </div>
          <div id="mouth">
            <div id="nostril-left"></div>
            <div id="nostril-right"></div>
          </div>
        </div>
      </div>
    </div>`;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cowHTML.trim();
    const cowElement = tempDiv.firstChild;

    containerDiv.appendChild(cowElement);

    let debounceTimeout;
    const animateEyes = () => {
      cowElement.classList.add("animate-eyes");
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        cowElement.classList.remove("animate-eyes");
      }, 1000);
    };
    // Attach to the editor, not window
    editor.addEventListener("keydown", animateEyes);

    // Return both container and the handler for cleanup if needed
    return { containerDiv, animateEyes };
  }

  function attachCowToEditors() {
    const editors = document.querySelectorAll(".editor-instance");
    if (editors.length === 0) return;

    editors.forEach((editor) => {
      if (processedEditors.has(editor)) return; // Already handled

      const { containerDiv, animateEyes } = createCow(editor);
      editor.appendChild(containerDiv);
      processedEditors.set(editor, { containerDiv, animateEyes });
    });
  }

  // If you ever need to remove cows and listeners:
  function detachCowFromEditors() {
    const editors = document.querySelectorAll(".editor-instance");
    editors.forEach((editor) => {
      const data = processedEditors.get(editor);
      if (data) {
        if (data.containerDiv && data.containerDiv.parentNode) {
          data.containerDiv.parentNode.removeChild(data.containerDiv);
        }
        // Remove from the editor, not window
        editor.removeEventListener("keydown", data.animateEyes);
        processedEditors.delete(editor);
      }
    });
  }

  // Observe the whole body for any DOM changes
  const observer = new MutationObserver(() => {
    attachCowToEditors();
  });

  if (document.body) {
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial run in case editor already exists
    attachCowToEditors();
  }
}, 3000);
