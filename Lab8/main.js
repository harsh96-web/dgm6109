"use strict";

/*
  Lab Homework #8 — Harsh Kumar (DGM6109)
  Bubbleplot: Workout Duration (x) vs Sleep Hours (y)
  ---------------------------------------------------
  Encodings:
    • X-axis: workout duration (minutes)
    • Y-axis: sleep hours (hours)
    • Circle radius: protein intake (grams)  ← (third numeric property via scale)
    • Circle color: restfulness level (1–5)  ← (fourth property via color)
  Rubric coverage:
    - Changed axis meaning from W7 baseline ✔
    - scaleSqrt for size; linear axes ✔
    - color legend + size legend, boxed/titled/labeled ✔
    - sort so large circles draw first (in back) ✔
    - axes, labels with units, reasonable ticks ✔
    - SVG within 900×675, margins used to separate keys ✔
*/

// ---------------------------- STEP 1: DATASET ---------------------------- //
// 12 observations (min required). Names mirror your previous weeks.
const dataset = [
  { date: "2025-09-25", duration: 50,  sleep: 6.0, protein:  80, restfulness: 1 },
  { date: "2025-09-26", duration: 60,  sleep: 6.5, protein:  90, restfulness: 2 },
  { date: "2025-09-27", duration: 65,  sleep: 6.8, protein:  95, restfulness: 3 },
  { date: "2025-09-28", duration: 70,  sleep: 7.0, protein: 100, restfulness: 3 },
  { date: "2025-09-29", duration: 75,  sleep: 7.3, protein: 110, restfulness: 3 },
  { date: "2025-09-30", duration: 78,  sleep: 7.5, protein: 115, restfulness: 4 },
  { date: "2025-10-01", duration: 82,  sleep: 7.6, protein: 120, restfulness: 4 },
  { date: "2025-10-02", duration: 86,  sleep: 7.8, protein: 130, restfulness: 4 },
  { date: "2025-10-03", duration: 90,  sleep: 8.0, protein: 135, restfulness: 5 },
  { date: "2025-10-04", duration: 94,  sleep: 8.1, protein: 140, restfulness: 5 },
  { date: "2025-10-05", duration: 98,  sleep: 8.3, protein: 145, restfulness: 5 },
  { date: "2025-10-06", duration: 102, sleep: 8.5, protein: 150, restfulness: 5 }
];

// Sort so *largest* circles render first (back), smallest last (on top)
dataset.sort((a, b) => b.protein - a.protein);


// ---------------------------- STEP 2: SVG SETUP ---------------------------- //
// Keep within the assignment’s max.
const svgWidth  = 900;
const svgHeight = 640; // a bit taller than 600 for bottom breathing room
const margin = { top: 70, right: 235, bottom: 100, left: 90 };

const width  = svgWidth  - margin.left - margin.right;
const height = svgHeight - margin.top  - margin.bottom;

const svg = d3.select("#chart")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top - 6})`);

// (Debug margins if needed; comment out for submission per PDF)
// svg.append("rect").attr("width", width).attr("height", height)
//   .attr("fill", "none").attr("stroke", "#aaa").attr("stroke-dasharray", "6,6");


// ---------------------------- STEP 3: SCALES ---------------------------- //
// Linear axes (readable), sqrt for area-consistent circle sizes.
const xExtent = d3.extent(dataset, d => d.duration);
const yExtent = d3.extent(dataset, d => d.sleep);
const pExtent = d3.extent(dataset, d => d.protein);

const xScale = d3.scaleLinear()
  .domain(xExtent).nice()
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain(yExtent).nice()
  .range([height, 0]);

const rScale = d3.scaleSqrt()
  .domain(pExtent)
  .range([5, 20]); // slightly larger max; we handled space with margins

// Discrete color mapping (ordinal) for 1–5 restfulness
const colorScale = d3.scaleOrdinal()
  .domain([1, 2, 3, 4, 5])
  .range(["#e74c3c", "#f39c12", "#f1c40f", "#2ecc71", "#27ae60"]);


// ---------------------------- STEP 4: AXES ---------------------------- //
const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat(d => `${d} min`);
const yAxis = d3.axisLeft(yScale).ticks(6).tickFormat(d => `${d} hrs`);

svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis);

svg.append("g").call(yAxis);

// Reference axis lines drawn using scales (per Class #7 reminder)
svg.append("line")
  .attr("x1", 0).attr("y1", height)
  .attr("x2", width).attr("y2", height)
  .attr("stroke", "#d0d0d0").attr("stroke-width", 1);

svg.append("line")
  .attr("x1", 0).attr("y1", height)
  .attr("x2", 0).attr("y2", 0)
  .attr("stroke", "#d0d0d0").attr("stroke-width", 1);


// ---------------------------- STEP 5: TOOLTIP ---------------------------- //
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");


// ---------------------------- STEP 6: BUBBLES ---------------------------- //
svg.selectAll("circle.dot")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("cx", d => xScale(d.duration))
  .attr("cy", d => yScale(d.sleep))
  .attr("r",  d => rScale(d.protein))
  .attr("fill", d => colorScale(d.restfulness))
  .attr("stroke", "#222")
  .attr("opacity", 0.88)
  .on("mouseover", (event, d) => {
    tooltip
      .style("opacity", 0.98)
      .html(
        `<strong>${d.date}</strong><br>
         Workout: ${d.duration} min<br>
         Sleep: ${d.sleep} hrs<br>
         Protein: ${d.protein} g<br>
         Restfulness: ${d.restfulness}/5`
      )
      .style("left", (event.pageX + 14) + "px")
      .style("top",  (event.pageY - 36) + "px");
    d3.select(event.currentTarget)
      .transition().duration(120)
      .attr("r", rScale(d.protein) + 3);
  })
  .on("mouseout", (event, d) => {
    tooltip.style("opacity", 0);
    d3.select(event.currentTarget)
      .transition().duration(120)
      .attr("r", rScale(d.protein));
  });


// ---------------------------- STEP 7: AXIS LABELS + TITLE ---------------------------- //
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + 56)
  .attr("text-anchor", "middle")
  .style("font-weight", "700")
  .text("Workout Duration (minutes)");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -64)
  .attr("text-anchor", "middle")
  .style("font-weight", "700")
  .text("Sleep Hours (hours)");

svg.append("text")
  .attr("x", width / 2)
  .attr("y", -26)
  .attr("text-anchor", "middle")
  .style("font-weight", "700")
  .text("Bubble Chart — Workout, Sleep & Protein");


// ---------------------------- STEP 8: COLOR LEGEND (BOXED) ---------------------------- //
const legendX = width + 20;
const restBoxY = 8;
const restBoxW = 185;
const restBoxH = 152;

svg.append("rect")
  .attr("x", legendX).attr("y", restBoxY)
  .attr("width", restBoxW).attr("height", restBoxH)
  .attr("fill", "none").attr("stroke", "#999").attr("rx", 10);

svg.append("text")
  .attr("x", legendX + 12).attr("y", restBoxY + 22)
  .style("font-weight", "800").text("Restfulness (1–5)");

const restfulnessLegend = [
  { label: "1 = Very Tired", color: "#e74c3c" },
  { label: "2 = Low",        color: "#f39c12" },
  { label: "3 = Moderate",   color: "#f1c40f" },
  { label: "4 = Good",       color: "#2ecc71" },
  { label: "5 = Excellent",  color: "#27ae60" }
];

svg.selectAll(".legend-color")
  .data(restfulnessLegend)
  .enter()
  .append("g")
  .attr("class", "legend-color")
  .attr("transform", (d, i) => `translate(${legendX + 14}, ${restBoxY + 40 + i * 22})`)
  .each(function (d) {
    d3.select(this).append("circle")
      .attr("r", 7).attr("fill", d.color).attr("stroke", "#222");
    d3.select(this).append("text")
      .attr("x", 18).attr("y", 4)
      .style("font-size", "12.5px").text(d.label);
  });


// ---------------------------- STEP 9: SIZE LEGEND (BOXED) ---------------------------- //
// Make the box tall enough for the largest radius (no clipping or overlap).
const sizeBoxY = restBoxY + restBoxH + 22;
const sizeBoxW = 200;

// compute vertical spacing using rScale to guarantee fit
const samples = [80, 100, 130, 150];
const sampleR = samples.map(r => rScale(r));
const rowGap  = 18;                              // gap between rows
const blockH  = sampleR[3]*2 + 8;                // height needed for the biggest circle row
const sizeBoxH = 22 + (sampleR[0]*2 + rowGap) + (sampleR[1]*2 + rowGap) + (sampleR[2]*2 + rowGap) + blockH;

svg.append("rect")
  .attr("x", legendX).attr("y", sizeBoxY)
  .attr("width", sizeBoxW).attr("height", sizeBoxH)
  .attr("fill", "none").attr("stroke", "#999").attr("rx", 10);

svg.append("text")
  .attr("x", legendX + 12).attr("y", sizeBoxY + 22)
  .style("font-weight", "800")
  .text("Protein (g)");

// start drawing after the title line
let cy = sizeBoxY + 42;

samples.forEach((p, i) => {
  const r = rScale(p);
  svg.append("circle")
    .attr("cx", legendX + 26)
    .attr("cy", cy)
    .attr("r", r)
    .attr("fill", "#e9e9e9")
    .attr("stroke", "#555");

  svg.append("text")
    .attr("x", legendX + 58)
    .attr("y", cy + 4)
    .style("font-size", "13px")
    .text(`${p} g`);

  // add height for this row plus gap to next row
  cy += r*2 + rowGap;
});
