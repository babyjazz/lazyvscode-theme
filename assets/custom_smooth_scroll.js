setTimeout(() => {
  const processedEditors = new WeakSet();

  const createSmoothScroll = () => {
    const topEl = document.querySelector('.margin[role="presentation"]');
    const el = document.querySelector(
      ".lines-content.monaco-editor-background"
    );

    // Function to sync top -> transform
    function syncTopToTransform() {
      const computedTop = window.getComputedStyle(topEl).top;
      const topPx = parseFloat(computedTop);

      const style = document.createElement("style");
      style.textContent = `.smooth-scroll { top: 0 !important; }`;
      document.head.appendChild(style);

      el.style.transform = `translateY(${topPx}px)`;
      el.style.willChange = "transform";
      el.style.transition = "transform 0.6s cubic-bezier(0, 0.45, 0.15, 0.99)";
      element.classList.add("smooth-scroll");
    }

    // Initial sync
    syncTopToTransform();

    // Observe inline style changes on the element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          // Check if top changed (you can do more sophisticated diff if needed)
          syncTopToTransform();
        }
      });
    });

    // Start observing
    observer.observe(topEl, { attributes: true });
  };

  // Observe the whole body for any DOM changes
  const observer = new MutationObserver(() => {
    attachSmoothScrollToEditors();
  });

  function attachSmoothScrollToEditors() {
    const editors = document.querySelectorAll(".editor-instance");
    if (editors.length === 0) return;

    editors.forEach((editor) => {
      if (processedEditors.has(editor)) return; // Skip already handled

      const smoothScroll = createSmoothScroll();
      editor.appendChild(smoothScroll);
      processedEditors.add(editor);
    });
  }

  if (document.body) {
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial run in case editor already exists
    attachSmoothScrollToEditors();
  }
}, 3000);
