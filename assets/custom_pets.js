setTimeout(() => {
  // Store currently processed editor instances
  const processedEditors = new WeakSet();

  function createCow() {
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

    // Add key event animation
    window.addEventListener("keydown", () => {
      cowElement.classList.add("animate-eyes");
    });
    window.addEventListener("keyup", () => {
      setTimeout(() => {
        cowElement.classList.remove("animate-eyes");
      }, 1000);
    });

    return containerDiv;
  }

  function attachCowToEditors() {
    const editors = document.querySelectorAll(".editor-instance");
    if (editors.length === 0) return;

    editors.forEach((editor) => {
      if (processedEditors.has(editor)) return; // Skip already handled

      const cowContainer = createCow();
      editor.appendChild(cowContainer);
      processedEditors.add(editor);
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
