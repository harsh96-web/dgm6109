"use strict";

/*
 * FITNESS ENERGY DASHBOARD — BATTERY VISUALIZATION
 * Harsh Kumar
 * Term Project – Draft 2
 *
 * Draft 2 changes:
 *  - Red outlines for low-recovery days (restfulness < 4)
 *  - Green outlines for optimal days (restfulness = 5)
 *  - Removed date labels (only Day number + sleep hours)
 *  - Tighter, centered spacing for the last row
 *  - Legend kept and still explains all encodings
 */

// ================================
// CONFIGURATION
// ================================

let SVG_WIDTH = 1600;
let SVG_HEIGHT = 1600;

let BREATHING_ROOM = 64;        // left/right padding inside SVG

let BATTERY_WIDTH_MIN = 50;
let BATTERY_WIDTH_MAX = 85;
let BATTERY_HEIGHT = 100;

let BATTERIES_PER_ROW = 9;
let ROW_VERTICAL_SPACING = 260; //APPLIED FORMULA y = startY + row * ROW_VERTICAL_SPACING
// TO ADJUST VERTICAL SPACING

// ================================
// GLOBAL VARIABLES
// ================================

let data;
let widthScale;
let sleepScale;
let colorScale;

// ================================
// LOAD DATA
// ================================

d3.json("data.json")
    .then(function (loadedData) {
        data = loadedData;
        console.log("Loaded", data.length, "days");
        createBatteryDashboard(data);
    })
    .catch(function (err) {
        console.error("Error loading data.json:", err);
    });

// ================================
// CREATE SCALES
// ================================

function createScales(dataset) {

    // Protein (grams) → battery width
    widthScale = d3.scaleLinear()
        .domain([110, 150])
        .range([BATTERY_WIDTH_MIN, BATTERY_WIDTH_MAX]);

    // Sleep hours → fill percentage of battery height
    sleepScale = d3.scaleLinear()
        .domain([6.2, 8.5])
        .range([0.60, 0.85]);

    // Restfulness (1–5) → fill color
    colorScale = d3.scaleThreshold()
        .domain([3, 4, 4.5])
        .range([
            "#e74c3c",  // low recovery
            "#f39c12",  // moderate
            "#f1c40f",  // good
            "#27ae60"   // excellent
        ]);
}

// ================================
// MAIN DASHBOARD FUNCTION
// ================================

function createBatteryDashboard(dataset) {

    // Build scales using the dataset
    createScales(dataset);

    let positions = [];
    let totalRows = Math.ceil(dataset.length / BATTERIES_PER_ROW);
    let startY = 100;

    // --------------------------------
    // Compute x / y positions per day
    // --------------------------------
    for (let row = 0; row < totalRows; row++) {

        let startIndex = row * BATTERIES_PER_ROW;
        let rowData = dataset.slice(startIndex, startIndex + BATTERIES_PER_ROW);
        let count = rowData.length;

        if (count === 0) {
            continue;
        }

        // Width for each battery in this row
        let widths = rowData.map(function (d) {
            return widthScale(d.protein);
        });

        let totalWidth = widths.reduce(function (sum, w) {
            return sum + w;
        }, 0);

        let availableWidth = SVG_WIDTH - (BREATHING_ROOM * 2);
        let gap;

        // Last row: fixed gap so the final three batteries sit in a tight row
        if (count < BATTERIES_PER_ROW) {
            gap = 95;   // visually tuned spacing for last row
        } else {
            // Normal rows: share remaining space evenly
            gap = (availableWidth - totalWidth) / (count - 1);
        }

        let x = BREATHING_ROOM;

        for (let i = 0; i < count; i++) {
            positions[startIndex + i] = {
                x: x,
                y: startY + row * ROW_VERTICAL_SPACING
            };
            x += widths[i] + gap;
        }
    }

    // ================================
    // DRAW BATTERIES
    // ================================

    let groups = d3.select("#batteryViz") 
        .selectAll("g.battery") 
        .data(dataset) 
        .enter() 
        .append("g") 
        .attr("class", "battery") 
        .attr("transform", function (d, i) { 
            return "translate(" + positions[i].x + "," + positions[i].y + ")"; 
        });

    // Sleep percentage label above battery (based on fill)
    groups.append("text") 
        .attr("x", function (d) { 
            return widthScale(d.protein) / 2; 
        })
        .attr("y", -65) 
        .attr("text-anchor", "middle") 
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "#2c3e50")
        .text(function (d) {
            return Math.round(sleepScale(d.sleep) * 100) + "%"; 
        });

    // Workout duration label (minutes)
    groups.append("text")
        .attr("x", function (d) {
            return widthScale(d.protein) / 2;
        })
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
        .attr("x", function (d) { // x position
            return widthScale(d.protein) * 0.35; 
        })
        .attr("y", -5) // y position
        .attr("width", function (d) { 
            return widthScale(d.protein) * 0.3; 
        })
        .attr("height", 7)
        .attr("rx", 2)
        .attr("fill", "#2c3e50");

    // Battery outline with red/green highlight based on restfulness
    groups.append("rect") 
        .attr("x", 0) // x position
        .attr("y", 2) 
        .attr("width", function (d) { 
            return widthScale(d.protein); 
        })
        .attr("height", BATTERY_HEIGHT) 
        .attr("rx", 5) 
        .attr("fill", "white")
        .attr("stroke-width", 3)
        .attr("stroke", function (d) {
            // Poor day = red outline
            if (d.restfulness < 4) { // restfulness 1, 2, 3
                return "#e74c3c";
            }
            // Optimal recovery = green outline
            if (d.restfulness === 5) {
                return "#27ae60";
            }
            // Normal day = dark outline
            return "#2c3e50";
        });

    // Battery fill (height from sleep, color from restfulness)
    groups.append("rect") // add rect element
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
        .attr("opacity", 0.95)
        .attr("fill", function (d) {
            return colorScale(d.restfulness);
        });

    // Day label under battery
    groups.append("text")
        .attr("x", function (d) {
            return widthScale(d.protein) / 2;
        })
        .attr("y", BATTERY_HEIGHT + 22)
        .attr("text-anchor", "middle")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .attr("fill", "#2c3e50")
        .text(function (d) {
            return "Day " + d.day;
        });

    // Sleep hours label under day (date label removed for Draft 2)
    groups.append("text")
        .attr("x", function (d) {
            return widthScale(d.protein) / 2;
        })
        .attr("y", BATTERY_HEIGHT + 52)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#95a5a6")
        .text(function (d) {
            return d.sleep + "h";
        });

    // Star marker on peak restfulness days (restfulness = 5)
    let starGroup = groups
        .filter(function (d) {
            return d.restfulness === 5;
        })
        .append("g")
        .attr("transform", function (d) {
            let cx = widthScale(d.protein) / 2;
            let cy = BATTERY_HEIGHT + 68;
            return "translate(" + cx + "," + cy + ")";
        });

    starGroup.append("path")
    .attr("class", "peak-star")
    .attr("d", "M0,-10 L2.94,-3.09 L9.51,-3.09 L4.28,1.18 L6.18,7.64 L0,4 L-6.18,7.64 L-4.28,1.18 L-9.51,-3.09 L-2.94,-3.09 Z")
    .attr("fill", "#f1c40f");


    // Legend at the bottom of the SVG
    createLegend();
}

// ================================
// LEGEND
// ================================

function createLegend() {

    const LEGEND_WIDTH = 1400;
    const LEGEND_HEIGHT = 190;
    const legendX = (SVG_WIDTH - LEGEND_WIDTH) / 2;
    const legendY = SVG_HEIGHT - LEGEND_HEIGHT - 30;

    let legend = d3.select("#batteryViz")
        .append("g")
        .attr("class", "legend-group")
        .attr("transform", "translate(" + legendX + "," + legendY + ")");

    // Legend background panel
    legend.append("rect")
        .attr("width", LEGEND_WIDTH)
        .attr("height", LEGEND_HEIGHT)
        .attr("fill", "#e3f2fd")
        .attr("stroke", "#2196F3")
        .attr("stroke-width", 3)
        .attr("rx", 14);

    // Legend title text
    legend.append("text")
        .attr("x", LEGEND_WIDTH / 2)
        .attr("y", 28)
        .attr("text-anchor", "middle")
        .attr("font-size", "17px")
        .attr("font-weight", "bold")
        .attr("fill", "#1976D2")
        .text("HOW TO READ: width = protein (g), fill = sleep (h), color = restfulness (1–5), workout = minutes");

    const columnWidth = LEGEND_WIDTH / 3;
    const baseY = 60;

    // ---------------------------
    // WIDTH LEGEND (protein)
    // ---------------------------

    let widthG = legend.append("g")
        .attr("transform", "translate(" + (columnWidth * 0 + columnWidth / 2 - 60) + "," + baseY + ")"); // first column

    widthG.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 22)
        .attr("height", 40)
        .attr("rx", 3)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    widthG.append("rect")
        .attr("x", 6)
        .attr("y", -4)
        .attr("width", 10)
        .attr("height", 6)
        .attr("fill", "black");

    widthG.append("text")
        .attr("x", 32)
        .attr("y", 23)
        .attr("font-size", "18px")
        .text("→");

    widthG.append("rect")
        .attr("x", 60)
        .attr("y", 0)
        .attr("width", 35)
        .attr("height", 40)
        .attr("rx", 3)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    widthG.append("rect")
        .attr("x", 68)
        .attr("y", -4)
        .attr("width", 14)
        .attr("height", 6)
        .attr("fill", "black");

    widthG.append("text")
        .attr("x", 45)
        .attr("y", 68)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#e74c3c")
        .attr("text-anchor", "middle")
        .text("WIDTH");

    widthG.append("text")
        .attr("x", 45)
        .attr("y", 84)
        .attr("font-size", "11px")
        .attr("fill", "#555")
        .attr("text-anchor", "middle")
        .text("Protein (110–150 g)");

    // ---------------------------
    // FILL LEVEL LEGEND (sleep)
    // ---------------------------

    let fillG = legend.append("g")
        .attr("transform", "translate(" + (columnWidth * 1 + columnWidth / 2 - 60) + "," + baseY + ")");

    fillG.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 25)
        .attr("height", 40)
        .attr("rx", 3)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    fillG.append("rect")
        .attr("x", 7)
        .attr("y", -4)
        .attr("width", 10)
        .attr("height", 6)
        .attr("fill", "black");

    fillG.append("rect")
        .attr("x", 2)
        .attr("y", 23)
        .attr("width", 22)
        .attr("height", 16)
        .attr("fill", "#e74c3c")
        .attr("rx", 2);

    fillG.append("text")
        .attr("x", 36)
        .attr("y", 23)
        .attr("font-size", "18px")
        .text("→");

    fillG.append("rect")
        .attr("x", 60)
        .attr("y", 0)
        .attr("width", 25)
        .attr("height", 40)
        .attr("rx", 3)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    fillG.append("rect")
        .attr("x", 67)
        .attr("y", -4)
        .attr("width", 10)
        .attr("height", 6)
        .attr("fill", "black");

    fillG.append("rect")
        .attr("x", 62)
        .attr("y", 2)
        .attr("width", 22)
        .attr("height", 36)
        .attr("fill", "#27ae60")
        .attr("rx", 2);

    fillG.append("text")
        .attr("x", 45)
        .attr("y", 68)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#27ae60")
        .attr("text-anchor", "middle")
        .text("FILL LEVEL");

    fillG.append("text")
        .attr("x", 45)
        .attr("y", 84)
        .attr("font-size", "11px")
        .attr("fill", "#555")
        .attr("text-anchor", "middle")
        .text("Sleep (6.2–8.5 h)");

    // ---------------------------
    // COLOR LEGEND (restfulness)
    // ---------------------------

    let colorG = legend.append("g")
        .attr("transform", "translate(" + (columnWidth * 2 + columnWidth / 2 - 60) + "," + baseY + ")");

    colorG.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 22)
        .attr("height", 35)
        .attr("rx", 3)
        .attr("fill", "#f39c12")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    colorG.append("rect")
        .attr("x", 6)
        .attr("y", -4)
        .attr("width", 10)
        .attr("height", 6)
        .attr("fill", "black");

    colorG.append("text")
        .attr("x", 32)
        .attr("y", 20)
        .attr("font-size", "18px")
        .text("→");

    colorG.append("rect")
        .attr("x", 60)
        .attr("y", 0)
        .attr("width", 22)
        .attr("height", 35)
        .attr("rx", 3)
        .attr("fill", "#27ae60")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    colorG.append("rect")
        .attr("x", 66)
        .attr("y", -4)
        .attr("width", 10)
        .attr("height", 6)
        .attr("fill", "black");

    colorG.append("text")
        .attr("x", 45)
        .attr("y", 68)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("fill", "#2c3e50")
        .text("COLOR");

    colorG.append("text")
        .attr("x", 45)
        .attr("y", 84)
        .attr("font-size", "11px")
        .attr("fill", "#555")
        .attr("text-anchor", "middle")
        .text("Restfulness (1–5)");

    // ---------------------------
    // RESTFULNESS GRADIENT BAR
    // ---------------------------

    const gradWidth = 220;
    const gradX = columnWidth * 2 + columnWidth / 2 - gradWidth / 2 - 10;
    const gradY = baseY + 50;

    let grad = legend.append("defs")
        .append("linearGradient")
        .attr("id", "restGrad")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

    grad.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#e74c3c");

    grad.append("stop")
        .attr("offset", "33%")
        .attr("stop-color", "#f39c12");

    grad.append("stop")
        .attr("offset", "66%")
        .attr("stop-color", "#f1c40f");

    grad.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#27ae60");

    legend.append("rect")
        .attr("x", gradX)
        .attr("y", gradY)
        .attr("width", gradWidth)
        .attr("height", 20)
        .attr("fill", "url(#restGrad)")
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .attr("rx", 5);

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
