setTimeout(() => {
  const editorInstance = document.querySelector(".editor-instance");

  // Create a container div to hold the whole structure
  const containerDiv = document.createElement("div");
  containerDiv.style.position = "absolute";
  containerDiv.style.bottom = "110px";
  containerDiv.style.right = "120px";
  containerDiv.style.width = "100px";
  containerDiv.style.height = "100px";
  containerDiv.style.transform = "scale(0.4)";

  editorInstance.appendChild(containerDiv);

  // Your SVG code as a string
  const svgString = `<svg id="cow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 504 504"><defs><style>.cls-1,.cls-2,.cls-5{fill:#603813;}.cls-1,.cls-10,.cls-12,.cls-2,.cls-4,.cls-8,.cls-9{stroke:black;}.cls-1,.cls-10,.cls-12,.cls-2,.cls-3,.cls-4,.cls-7,.cls-8,.cls-9{stroke-miterlimit:10;}.cls-1,.cls-2,.cls-8{stroke-width:10.28px;}.cls-10,.cls-12,.cls-2,.cls-3,.cls-4{stroke-linecap:round;}.cls-12,.cls-13,.cls-3,.cls-7,.cls-8{fill:none;}.cls-3,.cls-7{stroke:#fff;}.cls-10,.cls-12,.cls-3,.cls-4{stroke-width:10px;}.cls-4{fill:#754c24;}.cls-6{fill:#fff;}.cls-7{stroke-width:1.29px;}.cls-11,.cls-9{fill:#231f20;}.cls-9{stroke-width:1.85px;}.cls-10{fill:#eda2b9;}</style></defs><title>cowSVG</title><g id="Layer_1" data-name="Layer 1">
  
  
  
  <path class="cls-1" id="left-ear" d="M197.8,174.33l-3.64,1.49L150.6,193.65c-11,4.52-11.07,20.63.2,24.53a14.05,14.05,0,0,0,9.11,0l26.41-8.67"/><path class="cls-2" id="right-ear" d="M308.94,175.84l43.51,17.81c11,4.52,11.08,20.63-.2,24.53a14.05,14.05,0,0,1-9.11,0l-26.39-8.67"/><path class="cls-3" d="M277.6,186.8c10.52-8.08,19.52-19.89,19.52-36.67"/><path class="cls-3" d="M225.45,186.8c-10.51-8.08-19.51-19.89-19.51-36.67"/><path class="cls-4" d="M186.32,252.81V189.24a15.44,15.44,0,0,1,7.84-13.42,15.07,15.07,0,0,1,3.64-1.49l0,0a19.34,19.34,0,0,1,1.9-.37,14.86,14.86,0,0,1,2-.13h99.57a14.46,14.46,0,0,1,2,.13,16,16,0,0,1,1.9.37h0a15.11,15.11,0,0,1,3.71,1.53,15.45,15.45,0,0,1,7.81,13.4v63.59"/><path class="cls-5" d="M308.94,175.84l-3.71-1.53A15.11,15.11,0,0,1,308.94,175.84Z"/><path class="cls-6" d="M290,240.61h-77s.11-.79,10.71-13c8-9.21,27.77-24.93,27.77-51.73,0,26.44,19.6,42.09,27.44,51.36C289.86,240.06,290,240.61,290,240.61Z"/><path class="cls-5" d="M197.8,174.33l-3.64,1.49A15.07,15.07,0,0,1,197.8,174.33Z"/><line class="cls-7" x1="213.05" y1="238.58" x2="224.12" y2="238.58"/><line class="cls-7" x1="278.94" y1="238.58" x2="290.01" y2="238.58"/><path class="cls-8" d="M197.8,174.33a0,0,0,0,0,0,0"/>
  
  <ellipse id="lids" style="fill:#fff; stroke: none;" class="cls-9"  cx="213.03" cy="197" rx="12" ry="12"/>
  
  <ellipse id="lids" style="fill:#fff; stroke: none;" class="cls-9"  cx="290.03" cy="197" rx="12" ry="12"/>
  
  <ellipse class="cls-9" id="left-eye" cx="213.03" cy="197" rx="5" ry="5"/>
  
  <ellipse class="cls-9" id="right-eye" cx="290.03" cy="197" rx="5" ry="5"/>
  
  
  
  <path class="cls-12" d="M186.32,252.81V189.24a15.44,15.44,0,0,1,7.84-13.42,15.07,15.07,0,0,1,3.64-1.49l0,0a19.34,19.34,0,0,1,1.9-.37,14.86,14.86,0,0,1,2-.13h99.57a14.46,14.46,0,0,1,2,.13,16,16,0,0,1,1.9.37h0a15.11,15.11,0,0,1,3.71,1.53,15.45,15.45,0,0,1,7.81,13.4v63.59"/><path id="flypath" class="cls-13" d="M188.31,161.33c-27.69,9-42.18-32.25-14.93-42.48,19-7.13,62.58-5,89.39,18.87,55,49,83.48,21.25,81.74-8.74s-53-26.36-111.73,10.48C215.84,150.08,200.94,157.25,188.31,161.33Z"/>
  
  <path id="nose" class="cls-10" d="M305.65,245.2a57.6,57.6,0,0,1-26.71,108.57H224.12a57.6,57.6,0,0,1-26.74-108.56,57,57,0,0,1,26.74-6.63h54.82A56.92,56.92,0,0,1,305.65,245.2Z"/>
  
  <path style="fill:black; stroke: none;" class="cls-11" d="M287.36,278.32a17.86,17.86,0,1,1-17.85,17.86A17.86,17.86,0,0,1,287.36,278.32Z"/><path style="fill:black; stroke: none;" class="cls-11" d="M215.7,278.32a17.86,17.86,0,1,1-17.86,17.86A17.85,17.85,0,0,1,215.7,278.32Z"/>
  
  </g>
  
  <circle id="circle" r="2" cx="0" cy="0" fill="black" />

<animateMotion 
           xlink:href="#circle"
           dur="1s"
           begin="0s"
           fill="freeze"
           repeatCount="indefinite">
    <mpath xlink:href="#flypath" />
  </animateMotion>
  
</svg>`;
  // Convert the SVG string into a DOM element
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = svgString.trim();
  const svgElement = tempDiv.firstChild;

  // Append the SVG element to the containerDiv
  containerDiv.appendChild(svgElement);

  window.addEventListener("keydown", (e) => {
    svgElement.style.display = "none";
  });
  window.addEventListener("keyup", (e) => {
    svgElement.style.display = "block";
  });
}, 3000);
