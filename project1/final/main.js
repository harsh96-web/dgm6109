"use strict";

document.getElementById("drawBtn").addEventListener("click", drawImage);

function drawImage() {

  d3.select("#canvas").html("");

  const butterflyX = Number(document.getElementById("xInput").value) || 0;
  const butterflyY = Number(document.getElementById("yInput").value) || 0;
  const choice = document.getElementById("choice").value; // "open" or "closed"

  const svg = d3.select("#canvas").append("svg")
    .attr("width", 500)
    .attr("height", 500);

  // Border
  svg.append("rect")
    .attr("width", 500)
    .attr("height", 500)
    .attr("fill", "white")
    .attr("stroke", "red");

  // Body
  svg.append("rect")
    .attr("x", 245 + butterflyX)
    .attr("y", 120 + butterflyY)
    .attr("width", 10)
    .attr("height", 160)
    .attr("fill", "#00CC00")
    .attr("stroke", "black");

  // Eyes
  svg.append("ellipse")
    .attr("cx", 240 + butterflyX)
    .attr("cy", 120 + butterflyY)
    .attr("rx", 10).attr("ry", 12)
    .attr("fill", "#FF0000").attr("stroke", "black");

  svg.append("ellipse")
    .attr("cx", 260 + butterflyX)
    .attr("cy", 120 + butterflyY)
    .attr("rx", 10).attr("ry", 12)
    .attr("fill", "#FF0000").attr("stroke", "black");

  // Antennae
  svg.append("line")
    .attr("x1", 245 + butterflyX).attr("y1", 110 + butterflyY)
    .attr("x2", 220 + butterflyX).attr("y2", 60 + butterflyY)
    .attr("stroke", "black");

  svg.append("line")
    .attr("x1", 255 + butterflyX).attr("y1", 110 + butterflyY)
    .attr("x2", 280 + butterflyX).attr("y2", 60 + butterflyY)
    .attr("stroke", "black");

  // Wings 
  if (choice === "open") {
    // Upper wings
    svg.append("polygon")
      .attr("points",
        (140 + butterflyX)+","+(160 + butterflyY)+" "+
        (225 + butterflyX)+","+(100 + butterflyY)+" "+
        (247 + butterflyX)+","+(200 + butterflyY))
      .attr("fill", "#FFFF33")
      .attr("stroke", "black");

    svg.append("polygon")
      .attr("points",
        (360 + butterflyX)+","+(155 + butterflyY)+" "+
        (275 + butterflyX)+","+(100 + butterflyY)+" "+
        (253 + butterflyX)+","+(200 + butterflyY))
      .attr("fill", "#FFFF33")
      .attr("stroke", "black");

    // Lower wings
    svg.append("polygon")
      .attr("points",
        (160 + butterflyX)+","+(200 + butterflyY)+" "+
        (247 + butterflyX)+","+(200 + butterflyY)+" "+
        (247 + butterflyX)+","+(300 + butterflyY))
      .attr("fill", "#CC6633")
      .attr("stroke", "black");

    svg.append("polygon")
      .attr("points",
        (340 + butterflyX)+","+(200 + butterflyY)+" "+
        (253 + butterflyX)+","+(200 + butterflyY)+" "+
        (253 + butterflyX)+","+(300 + butterflyY))
      .attr("fill", "#CC6633")
      .attr("stroke", "black");
  }
}