// const interval = setInterval(() => {
//   const breadcrumbs = document.querySelector(".breadcrumbs-below-tabs");

//   if (breadcrumbs) {
//     const div = document.createElement("div");
//     div.innerHTML = "🐓";
//     div.classList.add("pets");

//     breadcrumbs.appendChild(div);

//     clearInterval(interval);
//   }
// }, 1000);

setTimeout(() => {
  const numFlakes = 50;
  const colors = ["#ffffff", "#d4f1f9", "#e8f8ff"];

  for (let i = 0; i < numFlakes; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");
    flake.innerHTML = "❄";
    const b = document.querySelector(".editor-container");
    b.insertBefore(flake, b.firstChild);

    const size = Math.random() * 10 + 10 + "px";
    flake.style.left = Math.random() * 160 - 50 + "vw";
    flake.style.fontSize = size;
    flake.style.color = colors[Math.floor(Math.random() * colors.length)];
    flake.style.animationDuration = Math.random() * 6 + 2 + "s";
    flake.style.animationDelay = Math.random() * 10 + "s";
    flake.style.transform = `translateX(${Math.random() * 160 - 100}px)`;
  }
}, 3000);
