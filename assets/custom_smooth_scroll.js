setTimeout(() => {
  const topEl = document.querySelector('.margin[role="presentation"]');
  const el = document.querySelector(".lines-content.monaco-editor-background");

  // Function to sync top -> transform
  function syncTopToTransform() {
    const computedTop = window.getComputedStyle(topEl).top;
    const topPx = parseFloat(computedTop);

    // Reset top to 0 and apply transform to match
    el.style.transform = `translateY(${topPx}px)`;
    el.style.willChange = "transform";
    el.style.transition = "transform 0.6s cubic-bezier(0, 0.45, 0.15, 0.99)";
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
}, 3000);
