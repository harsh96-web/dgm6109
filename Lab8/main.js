"use strict";

/*
  Lab Homework #8 — Harsh Kumar
  Topic: Workout Duration (x) vs Sleep Hours (y)
  
  Hypothesis: As workout duration (minutes) increases, sleep hours (hours) 
  also increase. Higher protein intake (grams) correlates with better 
  restfulness. Colors show restfulness levels from red (very tired) to 
  green (excellent rest).
  
  Building on my Phase 3a work by adding protein as bubble size.
*/

// Dataset with 12 days of my workout tracking
// Properties: date, duration (minutes), sleep (hours), protein (grams), restfulness (1-5 scale)

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

// Sort by protein so bigger bubbles draw first (prevents hiding small ones)
dataset.sort((a, b) => b.protein - a.protein);


// Set up SVG with margins for axes and legends
// Max allowed: 900x675, I'm using 900x640

const svgWidth  = 900;
const svgHeight = 640;
// Configuration variables for margins
const margin = { top: 70, right: 235, bottom: 100, left: 90 };

const width  = svgWidth  - margin.left - margin.right;
const height = svgHeight - margin.top  - margin.bottom;

const svg = d3.select("#chart")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top - 6})`);


// Create scales for positioning and sizing
// Using d3.extent to get min/max values from data

const xExtent = d3.extent(dataset, d => d.duration);
const yExtent = d3.extent(dataset, d => d.sleep);
const pExtent = d3.extent(dataset, d => d.protein);

// X-axis from 0 to 125 minutes
const xScale = d3.scaleLinear()
  .domain([0, 125])  
  .range([0, width]);

// Y-axis from 0 to 10.22 hours (slightly adjusted for circular bubbles)
const yScale = d3.scaleLinear()
  .domain([0, 10.22])   
  .range([height, 0]);

// Square root scale for bubble radius (better for area perception)
const rScale = d3.scaleSqrt()
  .domain(pExtent)
  .range([7, 21]); 

// Colors: red to green progression showing tiredness to excellent rest
// Fixed colors for levels 4 and 5 to be more distinct
const colorScale = d3.scaleOrdinal()
  .domain([1, 2, 3, 4, 5])
  .range(["#e74c3c", "#f39c12", "#f1c40f", "#52c41a", "#237804"]);


// Make axes start from 0 (professor requirement)
// Tick values: 0, 25, 50, 75, 100, 125 for x-axis

const xAxis = d3.axisBottom(xScale)
  .tickValues([0, 25, 50, 75, 100, 125])  
  .tickFormat(d => `${d} min`);

const yAxis = d3.axisLeft(yScale)
  .tickValues([0, 2, 4, 6, 8, 10])  
  .tickFormat(d => `${d} hrs`);

svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis);

svg.append("g").call(yAxis);

// Light grid lines at the base and side (just for clarity)
svg.append("line")
  .attr("x1", 0).attr("y1", height)
  .attr("x2", width).attr("y2", height)
  .attr("stroke", "#d0d0d0");

svg.append("line")
  .attr("x1", 0).attr("y1", height)
  .attr("x2", 0).attr("y2", 0)
  .attr("stroke", "#d0d0d0");


// Tooltip for showing details on hover

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");


// Draw circles for each data point
// Using transparency (0.75) to see overlapping bubbles

svg.selectAll("circle.dot")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("cx", d => xScale(d.duration))  // Exact x position from data
  .attr("cy", d => yScale(d.sleep))     // Exact y position from data
  .attr("r",  d => rScale(d.protein))   // Size based on protein
  .attr("fill", d => colorScale(d.restfulness))
  .attr("stroke", "#222")
  .attr("stroke-width", 1.5)
  .attr("opacity", 0.75)  // Some transparency to see overlapping bubbles
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

    // Slightly enlarge bubble on hover
    d3.select(event.currentTarget)
      .transition().duration(120)
      .attr("r", rScale(d.protein) + 3)
      .attr("opacity", 1);
  })
  .on("mouseout", (event, d) => {
    tooltip.style("opacity", 0);
    d3.select(event.currentTarget)
      .transition().duration(120)
      .attr("r", rScale(d.protein))
      .attr("opacity", 0.75);
  });


// ---------------------------- TITLES & LABELS ---------------------------- //
// Axis labels and chart title for clarity.

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
  .text("Workout, Sleep & Protein Bubble Chart");


// Legend for colors - showing all 5 restfulness levels

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
  .style("font-weight", "800")
  .text("Restfulness (1–5)");

const restfulnessLegend = [
  { label: "1 = Very Tired", color: "#e74c3c" },
  { label: "2 = Low",        color: "#f39c12" },
  { label: "3 = Moderate",   color: "#f1c40f" },
  { label: "4 = Good",       color: "#52c41a" },
  { label: "5 = Excellent",  color: "#237804" }
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
      .style("font-size", "12.5px")
      .text(d.label);
  });


// Legend for bubble sizes - protein amounts

const sizeBoxY = restBoxY + restBoxH + 22;
const sizeBoxW = 200;
const samples = [80, 100, 130, 150];
const sampleR = samples.map(r => rScale(r));
const rowGap  = 18;
const blockH  = sampleR[3]*2 + 8;
const sizeBoxH = 22 + (sampleR[0]*2 + rowGap) + (sampleR[1]*2 + rowGap) + (sampleR[2]*2 + rowGap) + blockH;

svg.append("rect")
  .attr("x", legendX).attr("y", sizeBoxY)
  .attr("width", sizeBoxW).attr("height", sizeBoxH)
  .attr("fill", "none").attr("stroke", "#999").attr("rx", 10);

svg.append("text")
  .attr("x", legendX + 12).attr("y", sizeBoxY + 22)
  .style("font-weight", "800")
  .text("Protein (g)");

let cy = sizeBoxY + 42;

samples.forEach(p => {
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

  cy += r * 2 + rowGap;
});