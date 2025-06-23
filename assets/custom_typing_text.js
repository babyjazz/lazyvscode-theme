setTimeout(() => {
  const b = document.querySelector(".cursors-layer");
  const cursor = document.querySelector(".cursors-layer > .cursor");

  document.addEventListener("keydown", (event) => {
    const isVimInsertMode = cursor.style.width === "2px";
    if (event.key.length !== 1) return;
    const regex = /^[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]$/;
    const isValidToShow = regex.test(event.key);
    if (!isVimInsertMode || !isValidToShow) return;

    const typingText = document.createElement("div");
    typingText.classList.add("typing-text");
    typingText.innerHTML = event.key;

    typingText.style.top = cursor.style.top;
    typingText.style.left = cursor.style.left;

    b.appendChild(typingText);
    setTimeout(() => {
      b.removeChild(typingText);
    }, 400);
  });
}, 3000);
