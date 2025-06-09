setTimeout(() => {
  const editorInstance = document.querySelector(".editor-instance");
  const svgNS = "http://www.w3.org/2000/svg";

  // Create SVG container
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "120");
  svg.setAttribute("height", "100");
  svg.style.position = "absolute";
  svg.style.bottom = "-40px";
  svg.style.right = "0";
  // svg.style.opacity = "0.6";
  svg.setAttribute("viewBox", "0 0 120 100");

  // Create main group that will move chicken left-right
  const mainGroup = document.createElementNS(svgNS, "g");
  mainGroup.setAttribute("transform", "translate(0,20)");

  // Animate chicken movement (left-right)
  const moveAnim = document.createElementNS(svgNS, "animateTransform");
  moveAnim.setAttribute("attributeName", "transform");
  moveAnim.setAttribute("type", "translate");
  moveAnim.setAttribute("values", "0,0;60,0;0,0");
  moveAnim.setAttribute("dur", "4s");
  moveAnim.setAttribute("repeatCount", "indefinite");
  mainGroup.appendChild(moveAnim);

  // Body ellipse
  const body = document.createElementNS(svgNS, "ellipse");
  body.setAttribute("cx", "30");
  body.setAttribute("cy", "40");
  body.setAttribute("rx", "15");
  body.setAttribute("ry", "20");
  body.setAttribute("fill", "orange");
  mainGroup.appendChild(body);

  // Wing ellipse
  const wing = document.createElementNS(svgNS, "ellipse");
  wing.setAttribute("cx", "30");
  wing.setAttribute("cy", "40");
  wing.setAttribute("rx", "8");
  wing.setAttribute("ry", "10");
  wing.setAttribute("fill", "goldenrod");
  mainGroup.appendChild(wing);

  // Head group (for flipping and nodding)
  const headGroup = document.createElementNS(svgNS, "g");
  headGroup.setAttribute("transform-origin", "30 30");

  // Head flip animation (instant flip left/right)
  const flipAnim = document.createElementNS(svgNS, "animateTransform");
  flipAnim.setAttribute("attributeName", "transform");
  flipAnim.setAttribute("type", "scale");
  flipAnim.setAttribute("values", "1,1;1,1;-1,1;-1,1;1,1");
  flipAnim.setAttribute("keyTimes", "0;0.499;0.5;0.999;1");
  flipAnim.setAttribute("dur", "4s");
  flipAnim.setAttribute("repeatCount", "indefinite");
  headGroup.appendChild(flipAnim);

  // Head nod animation (rotation, additive to flip)
  const nodAnim = document.createElementNS(svgNS, "animateTransform");
  nodAnim.setAttribute("attributeName", "transform");
  nodAnim.setAttribute("type", "rotate");
  nodAnim.setAttribute("values", "0;15;-5;0");
  nodAnim.setAttribute("dur", "1s");
  nodAnim.setAttribute("repeatCount", "indefinite");
  nodAnim.setAttribute("additive", "sum");
  headGroup.appendChild(nodAnim);

  // Head circle
  const headCircle = document.createElementNS(svgNS, "circle");
  headCircle.setAttribute("cx", "30");
  headCircle.setAttribute("cy", "20");
  headCircle.setAttribute("r", "10");
  headCircle.setAttribute("fill", "orange");
  headGroup.appendChild(headCircle);

  // Eye circle
  const eye = document.createElementNS(svgNS, "circle");
  eye.setAttribute("cx", "33");
  eye.setAttribute("cy", "18");
  eye.setAttribute("r", "2");
  eye.setAttribute("fill", "black");
  headGroup.appendChild(eye);

  // Beak polygon
  const beak = document.createElementNS(svgNS, "polygon");
  beak.setAttribute("points", "38,20 42,22 38,24");
  beak.setAttribute("fill", "yellow");
  headGroup.appendChild(beak);

  // Append head group to main group
  mainGroup.appendChild(headGroup);

  // Left leg (line) with walking animation (translate)
  const leftLeg = document.createElementNS(svgNS, "line");
  leftLeg.setAttribute("x1", "25");
  leftLeg.setAttribute("y1", "55");
  leftLeg.setAttribute("x2", "25");
  leftLeg.setAttribute("y2", "60");
  leftLeg.setAttribute("stroke", "brown");
  leftLeg.setAttribute("stroke-width", "2");

  // Left leg animation
  const leftLegAnim = document.createElementNS(svgNS, "animateTransform");
  leftLegAnim.setAttribute("attributeName", "transform");
  leftLegAnim.setAttribute("type", "translate");
  leftLegAnim.setAttribute("values", "-1,0;1,0;-1,0");
  leftLegAnim.setAttribute("dur", "0.6s");
  leftLegAnim.setAttribute("repeatCount", "indefinite");
  leftLeg.appendChild(leftLegAnim);
  mainGroup.appendChild(leftLeg);

  // Right leg (line) with walking animation (translate)
  const rightLeg = document.createElementNS(svgNS, "line");
  rightLeg.setAttribute("x1", "35");
  rightLeg.setAttribute("y1", "55");
  rightLeg.setAttribute("x2", "35");
  rightLeg.setAttribute("y2", "60");
  rightLeg.setAttribute("stroke", "brown");
  rightLeg.setAttribute("stroke-width", "2");

  // Right leg animation
  const rightLegAnim = document.createElementNS(svgNS, "animateTransform");
  rightLegAnim.setAttribute("attributeName", "transform");
  rightLegAnim.setAttribute("type", "translate");
  rightLegAnim.setAttribute("values", "1,0;-1,0;1,0");
  rightLegAnim.setAttribute("dur", "0.6s");
  rightLegAnim.setAttribute("repeatCount", "indefinite");
  rightLeg.appendChild(rightLegAnim);
  mainGroup.appendChild(rightLeg);

  // Append the whole chicken group to the SVG
  svg.appendChild(mainGroup);

  // Append the SVG to the editorInstance container
  editorInstance.appendChild(svg);
}, 3000);
