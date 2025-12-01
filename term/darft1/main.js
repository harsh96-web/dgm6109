"use strict";

/*
 * ===================================================================
 * FITNESS ENERGY DASHBOARD - BATTERY METAPHOR VISUALIZATION (Apple Revision)
 * ===================================================================
 * 
 * Author: Harsh Kumar
 * Course: DGM 6109 Data Visualization
 * Term: Fall 2025
 * Assignment: Term Project Draft 1
 * 
 * Notes:
 * - Apple-style 64px breathing room (no overflow, all 30 days visible)
 * - Clear legend with explicit units (grams, hours, restfulness 1–5)
 * - Designed to match index.html explanation and rubric requirements
 * ===================================================================
 */

// ===================================================================
// CONFIGURATION
// ===================================================================

let SVG_WIDTH = 1600;              // fixed canvas width
let SVG_HEIGHT = 1600;             // enough height for legend + 30 batteries

let BREATHING_ROOM = 64;           // Apple-style margin left & right

let BATTERY_WIDTH_MIN = 50;
let BATTERY_WIDTH_MAX = 85;
let BATTERY_HEIGHT = 100;

let BATTERIES_PER_ROW = 9;
let ROW_VERTICAL_SPACING = 260;

// ===================================================================
// GLOBAL VARIABLES
// ===================================================================
let data;
let widthScale;
let sleepScale;
let colorScale;

// ===================================================================
// LOAD DATA
// ===================================================================
d3.json("data.json")
    .then(function (loadedData) {
        data = loadedData;
        console.log("Loaded", data.length, "days");
        createBatteryDashboard(data);
    })
    .catch(function (error) {
        console.error("Error loading data.json:", error);
    });

// ===================================================================
// CREATE SCALES
// ===================================================================
function createScales(dataset) {

    // Protein → battery width (grams)
    widthScale = d3.scaleLinear()
        .domain([110, 150])
        .range([BATTERY_WIDTH_MIN, BATTERY_WIDTH_MAX]);

    // Sleep hours → fill percentage (hours)
    sleepScale = d3.scaleLinear()
        .domain([6.2, 8.5])
        .range([0.60, 0.85]);

    // Restfulness 1–5 → color
    colorScale = d3.scaleThreshold()
        .domain([3, 4, 4.5])
        .range([
            "#e74c3c",  // tired
            "#f39c12",  // moderate
            "#f1c40f",  // good
            "#27ae60"   // excellent
        ]);
}

// ===================================================================
// MAIN DASHBOARD FUNCTION
// ===================================================================
function createBatteryDashboard(dataset) {

    createScales(dataset);

    // Pre-compute x,y positions with breathing room
    let positions = [];
    let totalRows = Math.ceil(dataset.length / BATTERIES_PER_ROW);
    let startY = 100;   // y-offset for top row

    for (let row = 0; row < totalRows; row++) {

        let startIndex = row * BATTERIES_PER_ROW;
        let rowData = dataset.slice(startIndex, startIndex + BATTERIES_PER_ROW);
        let count = rowData.length;

        if (count === 0) continue;

        // Width of each battery in this row
        let widths = rowData.map(function (d) {
            return widthScale(d.protein);
        });

        let totalWidth = widths.reduce(function (sum, w) {
            return sum + w;
        }, 0);

        // Available space inside breathing room
        let availableWidth = SVG_WIDTH - (BREATHING_ROOM * 2);

        // Dynamic gap so row fits exactly inside margins
        let gap = (availableWidth - totalWidth) / (count - 1);

        let x = BREATHING_ROOM;

        for (let i = 0; i < count; i++) {
            positions[startIndex + i] = {
                x: x,
                y: startY + row * ROW_VERTICAL_SPACING
            };
            x += widths[i] + gap;
        }
    }

    // ===================================================================
    // DRAW BATTERIES
    // ===================================================================
    let groups = d3.select("#batteryViz")
        .selectAll("g.battery")
        .data(dataset)
        .enter()
        .append("g")
        .attr("class", "battery")
        .attr("transform", function (d, i) {
            return "translate(" + positions[i].x + "," + positions[i].y + ")";
        });

    // Top percentage label (sleep fill %)
    groups.append("text")
        .attr("x", function (d) { return widthScale(d.protein) / 2; })
        .attr("y", -65)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "#2c3e50")
        .text(function (d) {
            return Math.round(sleepScale(d.sleep) * 100) + "%";
        });

    // Workout duration label
    groups.append("text")
        .attr("x", function (d) { return widthScale(d.protein) / 2; })
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "600")
        .attr("fill", "#2196F3")
        .text(function (d) {
            return d.duration + " min";
        });

    // Battery terminal (top cap)
    groups.append("rect")
        .attr("x", function (d) { return widthScale(d.protein) * 0.35; })
        .attr("y", -5)
        .attr("width", function (d) { return widthScale(d.protein) * 0.3; })
        .attr("height", 7)
        .attr("rx", 2)
        .attr("fill", "#2c3e50");

    // Battery outline
    groups.append("rect")
        .attr("x", 0)
        .attr("y", 2)
        .attr("width", function (d) { return widthScale(d.protein); })
        .attr("height", BATTERY_HEIGHT)
        .attr("rx", 5)
        .attr("fill", "white")
        .attr("stroke", "#2c3e50")
        .attr("stroke-width", 3);

    // Battery fill (sleep hours; color = restfulness)
    groups.append("rect")
        .attr("class", "battery-fill")
        .attr("x", 2)
        .attr("y", function (d) {
            return 2 + (BATTERY_HEIGHT - (sleepScale(d.sleep) * BATTERY_HEIGHT));
        })
        .attr("width", function (d) {
            return widthScale(d.protein) - 4;
        })
        .attr("height", function (d) {
            return sleepScale(d.sleep) * BATTERY_HEIGHT;
        })
        .attr("rx", 4)
        .attr("fill", function (d) {
            return colorScale(d.restfulness);
        })
        .attr("opacity", 0.95);

    // Day label
    groups.append("text")
        .attr("x", function (d) { return widthScale(d.protein) / 2; })
        .attr("y", BATTERY_HEIGHT + 22)
        .attr("text-anchor", "middle")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .attr("fill", "#2c3e50")
        .text(function (d) {
            return "Day " + d.day;
        });

    // Date label (MM/DD)
    groups.append("text")
        .attr("x", function (d) { return widthScale(d.protein) / 2; })
        .attr("y", BATTERY_HEIGHT + 38)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#7f8c8d")
        .text(function (d) {
            let parts = d.date.split("-");
            return parseInt(parts[1]) + "/" + parseInt(parts[2]);
        });

    // Sleep text under battery
    groups.append("text")
        .attr("x", function (d) { return widthScale(d.protein) / 2; })
        .attr("y", BATTERY_HEIGHT + 52)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#95a5a6")
        .text(function (d) {
            return d.sleep + "h";
        });

    // Star for very restful days (restfulness == 5)
    groups.filter(function (d) { return d.restfulness === 5; })
        .append("text")
        .attr("class", "peak-star")              // <- needed for spinning CSS
        .attr("x", function (d) { return widthScale(d.protein) / 2; })
        .attr("y", BATTERY_HEIGHT + 68)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("⭐");

    // Create centered legend at bottom
    createLegend();
}

// ===================================================================
// LEGEND — Apple-quality layout with explicit units
// ===================================================================
function createLegend() {

    const LEGEND_WIDTH = 1400;   // centered inside 1600px
    const LEGEND_HEIGHT = 190;
    const legendX = (SVG_WIDTH - LEGEND_WIDTH) / 2;
    const legendY = SVG_HEIGHT - LEGEND_HEIGHT - 30;

    let legend = d3.select("#batteryViz")
        .append("g")
        .attr("class", "legend-group")
        .attr("transform", "translate(" + legendX + "," + legendY + ")");

    // Background panel
    legend.append("rect")
        .attr("width", LEGEND_WIDTH)
        .attr("height", LEGEND_HEIGHT)
        .attr("fill", "#e3f2fd")
        .attr("stroke", "#2196F3")
        .attr("stroke-width", 3)
        .attr("rx", 14);

    // Title: explicitly includes units for rubric
    legend.append("text")
        .attr("x", LEGEND_WIDTH / 2)
        .attr("y", 28)
        .attr("text-anchor", "middle")
        .attr("font-size", "17px")
        .attr("font-weight", "bold")
        .attr("fill", "#1976D2")
        .text("📖 HOW TO READ: width = protein (grams), fill = sleep (hours), color = restfulness (1–5), workout = minutes text");

    // Three equal columns: WIDTH / FILL / COLOR
    const columnWidth = LEGEND_WIDTH / 3;
    const baseY = 60;

    // ---------------------------------------------------------------
    // 1️⃣ WIDTH LEGEND (protein grams)
    // ---------------------------------------------------------------
    let widthG = legend.append("g")
        .attr("transform", "translate(" + (columnWidth * 0 + columnWidth / 2 - 60) + "," + baseY + ")");

    // narrow battery
    widthG.append("rect")
        .attr("x", 0).attr("y", 0)
        .attr("width", 22).attr("height", 40)
        .attr("rx", 3)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    widthG.append("rect")   // tip
        .attr("x", 6).attr("y", -4)
        .attr("width", 10).attr("height", 6)
        .attr("fill", "black");

    widthG.append("text")
        .attr("x", 32).attr("y", 23)
        .attr("font-size", "18px")
        .text("→");

    // wide battery
    widthG.append("rect")
        .attr("x", 60).attr("y", 0)
        .attr("width", 35).attr("height", 40)
        .attr("rx", 3)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    widthG.append("rect")
        .attr("x", 68).attr("y", -4)
        .attr("width", 14).attr("height", 6)
        .attr("fill", "black");

    // label + units
    widthG.append("text")
        .attr("x", 45).attr("y", 68)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#e74c3c")
        .text("WIDTH");
    widthG.append("text")
        .attr("x", 45).attr("y", 84)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#555")
        .text("Protein (110–150 g)");

    // ---------------------------------------------------------------
    // 2️⃣ FILL LEVEL LEGEND (sleep hours)
    // ---------------------------------------------------------------
    let fillG = legend.append("g")
        .attr("transform", "translate(" + (columnWidth * 1 + columnWidth / 2 - 60) + "," + baseY + ")");

    // low sleep battery
    fillG.append("rect")
        .attr("x", 0).attr("y", 0)
        .attr("width", 25).attr("height", 40)
        .attr("rx", 3)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    fillG.append("rect") // tip
        .attr("x", 7).attr("y", -4)
        .attr("width", 10).attr("height", 6)
        .attr("fill", "black");
    fillG.append("rect") // red fill
        .attr("x", 2).attr("y", 23)
        .attr("width", 22).attr("height", 16)
        .attr("fill", "#e74c3c")
        .attr("rx", 2);

    fillG.append("text")
        .attr("x", 36).attr("y", 23)
        .attr("font-size", "18px")
        .text("→");

    // high sleep battery
    fillG.append("rect")
        .attr("x", 60).attr("y", 0)
        .attr("width", 25).attr("height", 40)
        .attr("rx", 3)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    fillG.append("rect") // tip
        .attr("x", 67).attr("y", -4)
        .attr("width", 10).attr("height", 6)
        .attr("fill", "black");
    fillG.append("rect") // green full
        .attr("x", 62).attr("y", 2)
        .attr("width", 22).attr("height", 36)
        .attr("fill", "#27ae60")
        .attr("rx", 2);

    // label + units
    fillG.append("text")
        .attr("x", 45).attr("y", 68)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#27ae60")
        .text("FILL LEVEL");
    fillG.append("text")
        .attr("x", 45).attr("y", 84)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#555")
        .text("Sleep (6.2–8.5 h)");

    // ---------------------------------------------------------------
    // 3️⃣ COLOR LEGEND (restfulness 1–5)
    // ---------------------------------------------------------------
    let colorG = legend.append("g")
        .attr("transform", "translate(" + (columnWidth * 2 + columnWidth / 2 - 60) + "," + baseY + ")");

    // tired battery
    colorG.append("rect")
        .attr("x", 0).attr("y", 0)
        .attr("width", 22).attr("height", 35)
        .attr("rx", 3)
        .attr("fill", "#f39c12")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    colorG.append("rect") // tip
        .attr("x", 6).attr("y", -4)
        .attr("width", 10).attr("height", 6)
        .attr("fill", "black");

    colorG.append("text")
        .attr("x", 32).attr("y", 20)
        .attr("font-size", "18px")
        .text("→");

    // excellent battery
    colorG.append("rect")
        .attr("x", 60).attr("y", 0)
        .attr("width", 22).attr("height", 35)
        .attr("rx", 3)
        .attr("fill", "#27ae60")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    colorG.append("rect")
        .attr("x", 66).attr("y", -4)
        .attr("width", 10).attr("height", 6)
        .attr("fill", "black");

    // COLOR label
    colorG.append("text")
        .attr("x", 45).attr("y", 68)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#2c3e50")
        .text("COLOR");
    colorG.append("text")
        .attr("x", 45).attr("y", 84)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#555")
        .text("Restfulness (1–5)");

    // ----------------------------------------------------
    // GRADIENT BAR (restfulness scale 1–5)
    // ----------------------------------------------------
    const gradWidth = 220;
    const gradX = columnWidth * 2 + columnWidth / 2 - gradWidth / 2 - 10;
    const gradY = baseY + 50;

    // define gradient
    let grad = legend.append("defs")
        .append("linearGradient")
        .attr("id", "restGrad")
        .attr("x1", "0%").attr("x2", "100%")
        .attr("y1", "0%").attr("y2", "0%");

    grad.append("stop").attr("offset", "0%").attr("stop-color", "#e74c3c");
    grad.append("stop").attr("offset", "33%").attr("stop-color", "#f39c12");
    grad.append("stop").attr("offset", "66%").attr("stop-color", "#f1c40f");
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#27ae60");

    legend.append("rect")
        .attr("x", gradX)
        .attr("y", gradY)
        .attr("width", gradWidth)
        .attr("height", 20)
        .attr("fill", "url(#restGrad)")
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .attr("rx", 5);

    // gradient labels (restfulness extremes)
    legend.append("text")
        .attr("x", gradX)
        .attr("y", gradY + 35)
        .attr("font-size", "12px")
        .attr("fill", "#555")
        .text("Tired (1)");

    legend.append("text")
        .attr("x", gradX + gradWidth)
        .attr("y", gradY + 35)
        .attr("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "#555")
        .text("Excellent (5)");
}
