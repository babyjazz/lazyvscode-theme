setTimeout(() => {
  const editorInstance = document.querySelector(".editor-instance");

  // Create a container div to hold the whole structure
  const containerDiv = document.createElement("div");
  containerDiv.style.position = "absolute";
  containerDiv.style.bottom = "40px";
  containerDiv.style.right = "30px";
  containerDiv.style.width = "100px";
  containerDiv.style.height = "100px";
  containerDiv.style.transform = "scale(0.4)";

  editorInstance.appendChild(containerDiv);

  // Your new HTML structure as a string
  const cowHTML = `
	<div id="cow">
		<div id="head">
			<div id="face">
				<div id="horns">
					<div id="horn-left"></div>
					<div id="horn-right"></div>
				</div>
				<div id="ears">
					<div id="ear-left">
						<div id="ear-left-detail"></div>
					</div>
					<div id="ear-right">
						<div id="ear-right-detail"></div>
					</div>
				</div>
				<div id="eyes">
					<div id="eye-left">
						<div id="eye-left-detail1">
							<div id="eye-left-detail2"></div>
						</div>
					</div>
					<div id="eye-right">
						<div id="eye-right-detail1">
							<div id="eye-right-detail2"></div>
						</div>
					</div>
				</div>
				<div id="mouth">
					<div id="nostril-left"></div>
					<div id="nostril-right"></div>
				</div>
			</div>
		</div>
	</div>`;

  // Convert the HTML string into DOM elements
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = cowHTML.trim();
  const cowElement = tempDiv.firstChild;

  // Append the HTML element to containerDiv
  containerDiv.appendChild(cowElement);

  // Hide on keydown, show on keyup
  window.addEventListener("keydown", () => {
    cowElement.classList.add("animate-eyes");
  });
  window.addEventListener("keyup", () => {
    setTimeout(() => {
      cowElement.classList.remove("animate-eyes");
    }, 1000);
  });
}, 3000);
