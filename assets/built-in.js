setTimeout(() => {
  const editor = document.querySelector(".editor-instance");
  if (editor) {
    // Observe aria-label changes
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        editor.classList.add("bounce-show-up");
        setTimeout(() => {
          editor.classList.remove("bounce-show-up");
        }, 450);
      }
    });
    observer.observe(editor, {
      attributes: true,
      attributeFilter: ["aria-label"],
    });
  }
}, 3000);
