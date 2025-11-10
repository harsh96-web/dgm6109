"use strict";

// =================== DATASET ===================
const allData = [
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

// ✅ Array.filter() → show only adequate-sleep nights (>6 hours)
const dataset = allData.filter(d => d.sleep > 6);

// =================== CHART SETUP ===================
const svgWidth = 900;
const svgHeight = 640;
// right margin extended so legends fit
const margin = { top: 70, right: 280, bottom: 100, left: 110 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top - 6})`);

// =================== SCALES ===================
const xScale = d3.scaleLinear().domain([6, 9]).range([15, width - 15]);
const yScale = d3.scaleLinear().domain([0, 5]).range([height - 10, 10]);
const rScale = d3.scaleSqrt().domain(d3.extent(dataset, d => d.duration)).range([9, 24]);
const colorScale = d3.scaleLinear().domain([0, dataset.length - 1]).range(["#DBEAFE", "#1E3A8A"]);

// =================== AXES ===================
const xAxis = d3.axisBottom(xScale)
  .tickValues([6, 6.5, 7, 7.5, 8, 8.5, 9])
  .tickFormat(d => `${d} hrs`);
const yAxis = d3.axisLeft(yScale)
  .tickValues([0, 1, 2, 3, 4, 5])
  .tickFormat(d => `${d}`);

svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);
svg.append("g").call(yAxis);

// Grid lines
svg.append("line").attr("x1", 0).attr("y1", height).attr("x2", width).attr("y2", height).attr("stroke", "#d0d0d0");
svg.append("line").attr("x1", 0).attr("y1", height).attr("x2", 0).attr("y2", 0).attr("stroke", "#d0d0d0");

// =================== TOOLTIP ===================
const tooltip = d3.select("body").append("div").attr("class", "tooltip");

// =================== CIRCLES ===================
svg.selectAll("circle.dot")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("cx", d => xScale(d.sleep))
  .attr("cy", d => yScale(d.restfulness))
  .attr("r", d => rScale(d.duration))
  .attr("fill", (d, i) => colorScale(i))
  .attr("stroke", "#222")
  .attr("stroke-width", 1.5)
  .attr("opacity", 0.85)
  .on("mouseover", (event, d) => {
    tooltip.style("opacity", 0.98)
      .html(`<strong>${d.date}</strong><br>
             Sleep: ${d.sleep} hrs<br>
             Restfulness: ${d.restfulness}/5<br>
             Workout: ${d.duration} min<br>
             Exercises: ${d.workoutDetails}<br>
             Protein: ${d.protein} g`)
      .style("left", (event.pageX + 14) + "px")
      .style("top", (event.pageY - 36) + "px");
    d3.select(event.currentTarget)
      .transition().duration(120)
      .attr("r", rScale(d.duration) + 3)
      .attr("opacity", 1)
      .attr("stroke-width", 2.5);
  })
  .on("mouseout", (event, d) => {
    tooltip.style("opacity", 0);
    d3.select(event.currentTarget)
      .transition().duration(120)
      .attr("r", rScale(d.duration))
      .attr("opacity", 0.85)
      .attr("stroke-width", 1.5);
  });

// =================== AXIS LABELS ===================
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + 56)
  .attr("text-anchor", "middle")
  .style("font-weight", "700")
  .text("Sleep Hours (hours)");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -75)
  .attr("text-anchor", "middle")
  .style("font-weight", "700")
  .text("Restfulness Level (1–5)");

svg.append("text")
  .attr("x", width / 2)
  .attr("y", -30)
  .attr("text-anchor", "middle")
  .style("font-weight", "700")
  .text("Sleep Hours vs Restfulness (Filtered: Sleep > 6 hrs)");

// =================== LEGENDS ===================
const legendX = width + 25;

// Workout Duration Legend
const sizeBoxY = 15;
const samples = [
  { duration: 60, label: "60 min (Early)", colorIndex: 0 },
  { duration: 82, label: "82 min (Mid)", colorIndex: 5 },
  { duration: 102, label: "102 min (Late)", colorIndex: 10 }
];
const sampleR = samples.map(s => rScale(s.duration));
const rowGap = 24;
const sizeBoxH = 22 + sampleR.reduce((sum, r) => sum + r * 2 + rowGap, 0) + 10;

svg.append("rect")
  .attr("x", legendX).attr("y", sizeBoxY)
  .attr("width", 210).attr("height", sizeBoxH)
  .attr("fill", "none").attr("stroke", "#999").attr("rx", 10);

svg.append("text")
  .attr("x", legendX + 12).attr("y", sizeBoxY + 22)
  .style("font-weight", "800")
  .text("Workout Duration (min)");

let cy = sizeBoxY + 45;
samples.forEach(sample => {
  const r = rScale(sample.duration);
  svg.append("circle")
    .attr("cx", legendX + 30)
    .attr("cy", cy)
    .attr("r", r)
    .attr("fill", colorScale(sample.colorIndex))
    .attr("stroke", "#222")
    .attr("stroke-width", 1.5)
    .attr("opacity", 0.85);
  svg.append("text")
    .attr("x", legendX + 60)
    .attr("y", cy + 4)
    .style("font-size", "12px")
    .text(sample.label);
  cy += r * 2 + rowGap;
});

// Time Progression Legend
const colorBoxY = sizeBoxY + sizeBoxH + 25;
const colorBoxH = 115;
svg.append("rect")
  .attr("x", legendX).attr("y", colorBoxY)
  .attr("width", 210).attr("height", colorBoxH)
  .attr("fill", "none").attr("stroke", "#999").attr("rx", 10);

svg.append("text")
  .attr("x", legendX + 12).attr("y", colorBoxY + 22)
  .style("font-weight", "800")
  .text("Time Progression");

const timeExamples = [
  { label: "Sept 26 (Early)", color: colorScale(0), y: 68 },
  { label: "Sept 30 (Mid)", color: colorScale(5), y: 88 },
  { label: "Oct 6 (Late)", color: colorScale(10), y: 108 }
];

timeExamples.forEach(ex => {
  svg.append("circle")
    .attr("cx", legendX + 20)
    .attr("cy", colorBoxY + ex.y)
    .attr("r", 7)
    .attr("fill", ex.color)
    .attr("stroke", "#222")
    .attr("stroke-width", 1.5)
    .attr("opacity", 0.85);
  svg.append("text")
    .attr("x", legendX + 35)
    .attr("y", colorBoxY + ex.y + 4)
    .style("font-size", "11px")
    .text(ex.label);
});

// Filter Info Box
const infoBoxY = colorBoxY + colorBoxH + 25;
svg.append("rect")
  .attr("x", legendX).attr("y", infoBoxY)
  .attr("width", 210).attr("height", 75)
  .attr("fill", "#fff3cd")
  .attr("stroke", "#ffc107")
  .attr("rx", 10);

svg.append("text")
  .attr("x", legendX + 12)
  .attr("y", infoBoxY + 24)
  .style("font-weight", "800")
  .text("Data Filtered");

svg.append("text")
  .attr("x", legendX + 12)
  .attr("y", infoBoxY + 46)
  .style("font-size", "12px")
  .text(`Showing ${dataset.length}/${allData.length} days`);

svg.append("text")
  .attr("x", legendX + 12)
  .attr("y", infoBoxY + 64)
  .style("font-size", "11px")
  .style("fill", "#666")
  .text("Sept 26 – Oct 6");
