"use strict";

const dataset = [
  { date: "2025-09-25", duration: 50, sleep: 6.0, protein: 80, restfulness: 1, workoutDetails: "Light cardio - 5K run" },
  { date: "2025-09-26", duration: 60, sleep: 6.5, protein: 90, restfulness: 2, workoutDetails: "Upper body + 2K run" },
  { date: "2025-09-27", duration: 65, sleep: 6.8, protein: 95, restfulness: 3, workoutDetails: "Bench 185x8, Squat 225x8" },
  { date: "2025-09-28", duration: 70, sleep: 7.0, protein: 100, restfulness: 3, workoutDetails: "HIIT cardio, 85% max HR" },
  { date: "2025-09-29", duration: 75, sleep: 7.3, protein: 110, restfulness: 3, workoutDetails: "Bench 205x5, Squat 275x5" },
  { date: "2025-09-30", duration: 78, sleep: 7.5, protein: 115, restfulness: 4, workoutDetails: "Deadlift 315x5, Rows 135x10" },
  { date: "2025-10-01", duration: 82, sleep: 7.6, protein: 120, restfulness: 4, workoutDetails: "Bench 215x5, Squat 295x5" },
  { date: "2025-10-02", duration: 86, sleep: 7.8, protein: 130, restfulness: 4, workoutDetails: "Deadlift 335x5 + 3K run" },
  { date: "2025-10-03", duration: 90, sleep: 8.0, protein: 135, restfulness: 5, workoutDetails: "Bench 225x3, Squat 315x3" },
  { date: "2025-10-04", duration: 94, sleep: 8.1, protein: 140, restfulness: 5, workoutDetails: "Deadlift 365x3, OHP 135x5" },
  { date: "2025-10-05", duration: 98, sleep: 8.3, protein: 145, restfulness: 5, workoutDetails: "Bench 225x5, Squat 315x5" },
  { date: "2025-10-06", duration: 102, sleep: 8.5, protein: 150, restfulness: 5, workoutDetails: "Deadlift 405x1 PR!, Bench 225x5" }
];

dataset.sort((a, b) => new Date(a.date) - new Date(b.date));

const svgWidth = 900;
const svgHeight = 640;
// Increased right margin so the legend fits (matches your screenshot)
const margin = { top: 70, right: 280, bottom: 100, left: 90 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top - 6})`);

const xScale = d3.scaleLinear().domain([0, 125]).range([0, width]);
const yScale = d3.scaleLinear().domain([0, 10.22]).range([height, 0]);
const rScale = d3.scaleSqrt().domain(d3.extent(dataset, d => d.protein)).range([7, 21]);
const colorScale = d3.scaleOrdinal()
  .domain([1, 2, 3, 4, 5])
  .range(["#e74c3c", "#f39c12", "#f1c40f", "#52c41a", "#237804"]);

const xAxis = d3.axisBottom(xScale).tickValues([0, 25, 50, 75, 100, 125]).tickFormat(d => `${d} min`);
svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis).style("font-size", "12px");

const yAxis = d3.axisLeft(yScale).tickValues([0, 2, 4, 6, 8, 10]).tickFormat(d => `${d} hrs`);
svg.append("g").call(yAxis).style("font-size", "12px");

svg.append("line").attr("x1", 0).attr("y1", height).attr("x2", width).attr("y2", height).attr("stroke", "#d0d0d0");
svg.append("line").attr("x1", 0).attr("y1", height).attr("x2", 0).attr("y2", 0).attr("stroke", "#d0d0d0");

const tooltip = d3.select("body").append("div").attr("class", "tooltip");

svg.selectAll("circle.dot")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("cx", d => xScale(d.duration))
  .attr("cy", d => yScale(d.sleep))
  .attr("r", d => rScale(d.protein))
  .attr("fill", d => colorScale(d.restfulness))
  .attr("stroke", "#2c3e50")
  .attr("stroke-width", 1.5)
  .attr("opacity", 0.8)
  .on("mouseover", (event, d) => {
    tooltip.style("opacity", 1)
      .html(`<strong>${d.date}</strong><br>
      Workout: ${d.duration} min<br>
      Details: ${d.workoutDetails}<br>
      Sleep: ${d.sleep} hrs<br>
      Protein: ${d.protein} g<br>
      Restfulness: ${d.restfulness}/5`)
      .style("left", (event.pageX + 14) + "px")
      .style("top", (event.pageY - 36) + "px");

    d3.select(event.currentTarget)
      .transition().duration(150)
      .attr("r", rScale(d.protein) + 3)
      .attr("opacity", 1)
      .attr("stroke-width", 2.5);
  })
  .on("mouseout", (event, d) => {
    tooltip.style("opacity", 0);
    d3.select(event.currentTarget)
      .transition().duration(150)
      .attr("r", rScale(d.protein))
      .attr("opacity", 0.8)
      .attr("stroke-width", 1.5);
  });

// Labels
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + 56)
  .attr("text-anchor", "middle")
  .style("font-weight", "600")
  .text("Workout Duration (minutes)");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -64)
  .attr("text-anchor", "middle")
  .style("font-weight", "600")
  .text("Sleep Hours (hours)");

svg.append("text")
  .attr("x", width / 2)
  .attr("y", -30)
  .attr("text-anchor", "middle")
  .style("font-weight", "600")
  .text("Workout Duration vs Sleep (Sept 25 - Oct 6, 2025)");

// Legends restored (aligned with your screenshot)
const legendX = width + 25; // adjusted from 20 to 25
const restBoxY = 8;

svg.append("rect")
  .attr("x", legendX).attr("y", restBoxY)
  .attr("width", 210).attr("height", 165)
  .attr("fill", "none").attr("stroke", "#bdc3c7").attr("rx", 8);

svg.append("text")
  .attr("x", legendX + 15).attr("y", restBoxY + 25)
  .style("font-weight", "700")
  .text("Restfulness (1–5)");

const restfulnessLegend = [
  { label: "1 = Very Tired", color: "#e74c3c" },
  { label: "2 = Low", color: "#f39c12" },
  { label: "3 = Moderate", color: "#f1c40f" },
  { label: "4 = Good", color: "#52c41a" },
  { label: "5 = Excellent", color: "#237804" }
];

restfulnessLegend.forEach((r, i) => {
  const yPos = restBoxY + 50 + i * 24;
  svg.append("circle")
    .attr("cx", legendX + 20).attr("cy", yPos).attr("r", 7)
    .attr("fill", r.color).attr("stroke", "#2c3e50").attr("stroke-width", 1.5);
  svg.append("text")
    .attr("x", legendX + 35).attr("y", yPos + 4)
    .style("font-size", "12px")
    .text(r.label);
});

const sizeBoxY = restBoxY + 180;
const samples = [80, 100, 130, 150];
const sampleR = samples.map(r => rScale(r));
const rowGap = 20;
const sizeBoxH = 40 + sampleR.reduce((sum, r) => sum + r * 2 + rowGap, 0);

svg.append("rect")
  .attr("x", legendX).attr("y", sizeBoxY)
  .attr("width", 210).attr("height", sizeBoxH)
  .attr("fill", "none").attr("stroke", "#bdc3c7").attr("rx", 8);

svg.append("text")
  .attr("x", legendX + 15).attr("y", sizeBoxY + 25)
  .style("font-weight", "700")
  .text("Protein (g)");

let cy = sizeBoxY + 50;
samples.forEach(p => {
  const r = rScale(p);
  svg.append("circle")
    .attr("cx", legendX + 30).attr("cy", cy).attr("r", r)
    .attr("fill", "#ecf0f1").attr("stroke", "#7f8c8d").attr("stroke-width", 1.5);
  svg.append("text")
    .attr("x", legendX + 65).attr("y", cy + 4)
    .style("font-size", "13px")
    .text(`${p}g`);
  cy += r * 2 + rowGap;
});
