document.getElementById('drawBtn').addEventListener('click', drawButterfly);

function drawButterfly() {
  d3.select("#canvas").html("");

  let svg = d3.select("#canvas").append("svg")
    .attr("width", 700)
    .attr("height", 700);

  svg.append("rect")
    .attr("width", 700)
    .attr("height", 700)
    .attr("fill", "white")
    .attr("stroke", "red");

  butterfly(svg, 350, 350, true);
}
