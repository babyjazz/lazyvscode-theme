function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

setTimeout(() => {
  const cursorWrapper = document.querySelector(".editor-instance");
  // const logger = document.querySelector(".breadcrumbs-below-tabs");
  // const logtext = document.createElement("h1");
  // logtext.classList.add("sui");
  try {
    const cursorPosition = document.querySelector(".monaco-mouse-cursor-text");
    const rect = cursorPosition.getBoundingClientRect();

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        const y = cursorPosition.style.top;
        const x = cursorPosition.style.left;
        const left = Number(String(x).replace("px", ""));
        const top = Number(String(y).replace("px", "")) + 50;
        // +------------------------------------+
        // |            START TRAIL             |
        // +------------------------------------+
        if (x === 0 && y === 0) return;
        const random = `${getRandomNumber(2, 14)}px`;
        const translate = `translate(${getRandomNumber(
          -10,
          10
        )}px, ${getRandomNumber(-10, 10)}px)`;
        const colorRandomed = getRandomNumber(100, 255);
        const backgroundColor = `rgb(${colorRandomed}, ${colorRandomed}, ${colorRandomed})`;
        const trailEl = document.createElement("div");
        trailEl.classList.add("trail");
        trailEl.style.position = "absolute";
        trailEl.style.zIndex = 100;
        trailEl.style.width = random;
        trailEl.style.height = random;
        trailEl.style.borderRadius = "50%";
        trailEl.style.backgroundColor = backgroundColor;
        trailEl.style.left = left;
        trailEl.style.top = top;
        trailEl.style.transform = translate;
        trailEl.style.opacity = "0.7";
        cursorWrapper.appendChild(trailEl);
        setTimeout(() => {
          trailEl.style.transition = "all 2s ease-out";
          trailEl.style.width = random;
          trailEl.style.height = random;
          trailEl.style.transform = translate;
          trailEl.style.backgroundColor = backgroundColor;
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
        // logtext.innerHTML = `result: ${y} ${x}`;
      }
    });

    observer.observe(cursorPosition, {
      attributeFilter: ["style"],
    });
  } catch (error) {
    console.error(error);
    // logtext.innerHTML = "ERROR" + error;
  }
  // logger.appendChild(logtext);
}, 3000);
