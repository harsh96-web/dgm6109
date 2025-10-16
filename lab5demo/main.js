"use strict";

document.getElementById("drawBtn").addEventListener("click", drawButterfly);

function drawButterfly() {
  d3.select("#canvas").html("");

  const showOrigin = document.getElementById("origin").value === "true";

  const svg = d3.select("#canvas")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

  svg.append("rect")
    .attr("width", 500)
    .attr("height", 500)
    .attr("fill", "white")
    .attr("stroke", "red");

  butterfly(svg, 250, 250, showOrigin);
}