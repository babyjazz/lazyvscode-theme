setTimeout(() => {
  // const cursorWrapper = document.querySelector(".editor-group-container");
  const cursorWrapper = document.querySelector(".editor-container");
  const logger = document.querySelector(".breadcrumbs-below-tabs");
  const logtext = document.createElement("h1");
  logtext.classList.add("sui");
  try {
    const cursorPosition = document.querySelector(".monaco-mouse-cursor-text");
    const rect = cursorPosition.getBoundingClientRect();

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        const y = cursorPosition.style.top;
        const x = cursorPosition.style.left;
        const left = Number(String(x).replace("px", ""));
        const top = Number(String(y).replace("px", ""));
        // +------------------------------------+
        // |            START TRAIL             |
        // +------------------------------------+
        const trailEl = document.createElement("div");
        trailEl.classList.add("trail");
        trailEl.style.position = "fixed";
        trailEl.style.zIndex = 100;
        trailEl.style.width = "6px";
        trailEl.style.height = "12px";
        trailEl.style.backgroundColor = "white";
        trailEl.style.left = left;
        trailEl.style.top = top;
        cursorWrapper.appendChild(trailEl);
        setTimeout(() => {
          trailEl.style.transition = "all 2s";
          trailEl.style.width = "8px";
          trailEl.style.height = "16px";
          trailEl.style.opacity = "0";
          trailEl.style.left = `${left}px`;
          trailEl.style.top = `${top}px`;
          setTimeout(() => {
            trailEl.remove();
          }, 2000);
        }, 10);
        // +------------------------------------+
        // |------------START TRAIL-------------|
        // +------------------------------------+
        logtext.innerHTML = `result: ${y} ${x}`;
      }
    });

    observer.observe(cursorPosition, {
      attributeFilter: ["style"],
    });
  } catch (error) {
    logtext.innerHTML = "ERROR" + error;
  }
  logger.appendChild(logtext);
}, 3000);
