"use strict";

/*
  Class Homework #7 — Harsh Kumar
  DGM6109 — Phase 3a Draft
  -------------------------------------------------------
  Purpose:
  Visualize the relationship between workout duration (X)
  and sleep hours (Y), using restfulness level (1–5) as color.

  This chart uses color encoding only (no radius scaling),
  as required by the assignment rubric.
*/

// Step 1: Dataset — 12 daily observations
let dataset = [
  { date: "2025-09-25", duration: 50, sleep: 6.0, restfulness: 1 },
  { date: "2025-09-26", duration: 60, sleep: 6.5, restfulness: 2 },
  { date: "2025-09-27", duration: 65, sleep: 6.8, restfulness: 3 },
  { date: "2025-09-28", duration: 70, sleep: 7.0, restfulness: 3 },
  { date: "2025-09-29", duration: 75, sleep: 7.3, restfulness: 3 },
  { date: "2025-09-30", duration: 78, sleep: 7.5, restfulness: 4 },
  { date: "2025-10-01", duration: 80, sleep: 7.6, restfulness: 4 },
  { date: "2025-10-02", duration: 85, sleep: 7.8, restfulness: 4 },
  { date: "2025-10-03", duration: 88, sleep: 8.0, restfulness: 5 },
  { date: "2025-10-04", duration: 90, sleep: 8.1, restfulness: 5 },
  { date: "2025-10-05", duration: 95, sleep: 8.3, restfulness: 5 },
  { date: "2025-10-06", duration: 100, sleep: 8.5, restfulness: 5 }
];

// Step 2: Sort dataset by X (duration) for logical visual order
dataset.sort((a, b) => a.duration - b.duration);

// Step 3: SVG + Margin Setup (margin convention improves layout control)
const margin = { top: 60, right: 180, bottom: 70, left: 90 };
const svgWidth = 900, svgHeight = 600;
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Step 4: Scales for axes
let xScale = d3.scaleLinear()
  .domain([45, 100]) // padded domain for better visual space
  .nice()
  .range([0, width]);

let yScale = d3.scaleLinear()
  .domain([5.5, 9]) // start from low end of observed range
  .nice()
  .range([height, 0]);

// Step 5: Color scale for restfulness (categorical 1–5)
function colorByRestfulness(level) {
  switch (level) {
    case 1: return "#ff4d4d"; // red = very tired
    case 2: return "#ff9933"; // orange = low
    case 3: return "#ffd633"; // yellow = moderate
    case 4: return "#66cc66"; // light green = good
    case 5: return "#339966"; // dark green = excellent
    default: return "#ccc";
  }
}

// Step 6: Draw circles (each observation = one day)
svg.selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.duration))
  .attr("cy", d => yScale(d.sleep))
  .attr("r", 10)
  .attr("fill", d => colorByRestfulness(d.restfulness))
  .attr("stroke", "#000")
  .attr("opacity", 0.9);

// Step 7: Axes with fixed tick values (shows low + high clearly)
const xAxis = d3.axisBottom(xScale)
  .tickValues([45, 55, 65, 75, 85, 95, 100])
  .tickFormat(d => `${d} min`);

const yAxis = d3.axisLeft(yScale)
  .tickValues([5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9])
  .tickFormat(d => `${d} hrs`);

svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis);

svg.append("g")
  .call(yAxis);

// Step 8: Axis Labels
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("text-anchor", "middle")
  .text("Workout Duration (minutes)");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -60)
  .attr("text-anchor", "middle")
  .text("Sleep Hours (hours)");

// Step 9: Title inside the plot
svg.append("text")
  .attr("x", width / 2)
  .attr("y", -20)
  .attr("text-anchor", "middle")
  .style("font-weight", "bold")
  .text("Bubble Chart — Workout vs Sleep (color = Restfulness)");

// Step 10: Legend for color mapping
const legendData = [
  { level: 1, label: "1 = Very Tired", color: "#ff4d4d" },
  { level: 2, label: "2 = Low", color: "#ff9933" },
  { level: 3, label: "3 = Moderate", color: "#ffd633" },
  { level: 4, label: "4 = Good", color: "#66cc66" },
  { level: 5, label: "5 = Excellent", color: "#339966" }
];

const legend = svg.selectAll(".legend")
  .data(legendData)
  .enter()
  .append("g")
  .attr("class", "legend")
  .attr("transform", (d, i) => `translate(${width + 30}, ${i * 25})`);

legend.append("circle")
  .attr("r", 7)
  .attr("fill", d => d.color)
  .attr("stroke", "#000");

legend.append("text")
  .attr("x", 18)
  .attr("y", 4)
  .text(d => d.label)
  .style("font-size", "13px");

// Step 11: Note explaining non-zero axis choice (for rubric clarity)
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + 65)
  .attr("text-anchor", "middle")
  .attr("font-size", "11px")
  .attr("fill", "#555")
  .text("Axes start at the low end of observed data range (not zero) for better focus.");
