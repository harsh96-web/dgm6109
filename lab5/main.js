'use strict';

// Event listener for Draw button
document.getElementById('drawBtn').addEventListener('click', makeDrawing);

function makeDrawing() {
  // Clear any previous drawings
  d3.select("#canvas").html("");

  // Collect user selections
  const shape1 = document.getElementById("shape1").value;
  const shape2 = document.getElementById("shape2").value;
  const shape3 = document.getElementById("shape3").value;
  const shape4 = document.getElementById("shape4").value;
  const showOrigin = (document.getElementById("origin").value === "true");

  // Create 700x700 SVG drawing area
  const svg = d3.select("#canvas").append("svg")
    .attr("width", 700)
    .attr("height", 700);

  // Background border (white fill, red stroke)
  svg.append("rect")
    .attr("width", 700)
    .attr("height", 700)
    .attr("fill", "white")
    .attr("stroke", "red");

  // Balanced coordinates for 4 shapes (avoids overlap)
  const TL = { x: 180, y: 180 }; // Top-left
  const TR = { x: 520, y: 180 }; // Top-right
  const BL = { x: 180, y: 520 }; // Bottom-left
  const BR = { x: 520, y: 520 }; // Bottom-right

  // Helper: Draw selected shape at given position
  function drawShape(name, x, y) {
    if (name === "butterfly") butterfly(svg, x, y - 20, showOrigin);
    else if (name === "ladybug") ladybug(svg, x, y - 20, showOrigin, "after");
    else if (name === "rooster") rooster(svg, x, y + 10, showOrigin, "flap");
    else if (name === "rabbit") rabbit(svg, x, y + 40, showOrigin);
  }

  // Draw all 4 user-selected shapes
  drawShape(shape1, TL.x, TL.y);
  drawShape(shape2, TR.x, TR.y);
  drawShape(shape3, BL.x, BL.y);
  drawShape(shape4, BR.x, BR.y);
}
