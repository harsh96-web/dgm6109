"use strict";

/*
  Lab 7 — Harsh Kumar
  Hypothesis: As workout duration (minutes) increases, sleep hours (hours) increase.

  This code builds a simple D3 scatterplot that shows the relationship between
  workout time and hours of sleep from my personal data.
*/

// Step 1: My dataset (8 days of real observations)
let dataset = [
  { duration: 60, sleep: 6.8 },
  { duration: 70, sleep: 7.0 },
  { duration: 80, sleep: 7.6 },
  { duration: 55, sleep: 6.4 },
  { duration: 90, sleep: 8.1 },
  { duration: 85, sleep: 7.9 },
  { duration: 65, sleep: 7.1 },
  { duration: 95, sleep: 8.3 }
];

// Step 2: Set up the SVG chart area
let svg = d3.select("#chart");
let width = +svg.attr("width");
let height = +svg.attr("height");
let padding = 50; // keeps things away from the edges

// Step 3: Create X and Y scales
// These convert my real numbers into screen positions.
let xScale = d3.scaleLinear()
  .domain([50, 100]) // workout range (minutes)
  .range([padding, width - padding]);

let yScale = d3.scaleLinear()
  .domain([6, 9]) // sleep range (hours)
  .range([height - padding, padding]);

// Step 4: Find the average sleep hours
let avgSleep = d3.mean(dataset, d => d.sleep);

// Step 5: Draw a dashed line for average sleep
svg.append("line")
  .attr("x1", padding)
  .attr("y1", yScale(avgSleep))
  .attr("x2", width - padding)
  .attr("y2", yScale(avgSleep))
  .attr("stroke", "#888")
  .attr("stroke-dasharray", "6 4");

// Add a small text label to show what the line means
svg.append("text")
  .attr("x", width - 160)
  .attr("y", yScale(avgSleep) - 8)
  .attr("fill", "#444")
  .style("font-size", "12px")
  .text(`Avg Sleep: ${avgSleep.toFixed(1)} hrs`);

// Step 6: Create a small tooltip for hover info
let tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "#fff")
  .style("border", "1px solid #000")
  .style("padding", "4px 8px")
  .style("font-size", "12px")
  .style("border-radius", "4px")
  .style("pointer-events", "none")
  .style("opacity", 0);

// Step 7: Draw the dots for each data point
svg.selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.duration))
  .attr("cy", height - padding) // start from bottom for animation
  .attr("r", 0)
  .attr("fill", "gray") // black & white theme (rubric rule)
  .attr("stroke", "#222")
  .transition() // animate dots moving upward
  .duration(900)
  .delay((d, i) => i * 80)
  .attr("cy", d => yScale(d.sleep))
  .attr("r", 8);

// Step 8: Add hover animation and tooltip
svg.selectAll("circle")
  .on("mouseover", function(event, d) {
    tooltip.style("opacity", 1)
      .html(`Workout: ${d.duration} min<br>Sleep: ${d.sleep} hrs`);
    d3.select(this)
      .transition().duration(150)
      .attr("r", 12);
  })
  .on("mousemove", function(event) {
    tooltip.style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 20) + "px");
  })
  .on("mouseout", function() {
    tooltip.style("opacity", 0);
    d3.select(this)
      .transition().duration(150)
      .attr("r", 8);
  });

// Step 9: Draw X-axis with ticks and labels
svg.append("g")
  .attr("transform", `translate(0, ${height - padding})`)
  .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => d + " min"));

// Step 10: Draw Y-axis
svg.append("g")
  .attr("transform", `translate(${padding}, 0)`)
  .call(d3.axisLeft(yScale).ticks(6).tickFormat(d => d + " hrs"));

// Step 11: Add text labels for both axes
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height - 10)
  .attr("text-anchor", "middle")
  .text("Workout Duration (minutes)");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", 20)
  .attr("text-anchor", "middle")
  .text("Sleep Hours (hours)");

// Done. This chart shows that longer workouts seem to match better sleep.
