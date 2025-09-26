"use strict"

let drawingWidth = 500;
let drawingHeight = 500;

let butterflyx= 100;
let butterflyy =150;

/* Variable that enables you to "talk to" your SVG drawing canvas. */
let drawing = d3.select("#canvas")
    .append("svg")
    .attr("width", drawingWidth)
    .attr("height", drawingHeight);

/* Draw a border that matches the specified drawing area size */
let border = drawing.append("rect")
    .attr("width", drawingWidth)
    .attr("height", drawingHeight)
    .attr("fill", "white")
    .attr("stroke", "red");

/* Drawing Butterfly body */

let body = drawing.append("rect")
    .attr("x", 245 +butterflyx)   // centered at ~250
    .attr("y", 125+ butterflyy) 
    .attr("width", 15)
    .attr("height", 160)
    .attr("fill", "#00CC00")
    .attr("stroke", "black");

/* Butterfly Head / Eyes */

/* left eye */
let leftEye = drawing.append("ellipse") // oval shape
    .attr("cx", 240+butterflyx)   // centered at ~250
    .attr("cy", 120+ butterflyy )
    .attr("rx", 10)
    .attr("ry", 12)
    .attr("fill", "#FF0000")
    .attr("stroke", "black");

/* right eye */
let rightEye = drawing.append("ellipse")
    .attr("cx", 260+butterflyx)
    .attr("cy", 120+ butterflyy)
    .attr("rx", 10)
    .attr("ry", 12)
    .attr("fill", "#FF0000")
    .attr("stroke", "black");


    // Uncomment this code for a longer butterfly body!
// let bodyLower = drawing.append("rect")
//     .attr("x", 247)
//     .attr("y", 280)
//     .attr("width", 6)
//     .attr("height", 80)
//     .attr("fill", "none")
//     .attr("stroke", "black");

/*  Butterfly Upper Wings */

/*  left upper wing */
let leftUpperWing = drawing.append("polygon")
    .attr("points", "140,160 225,100 247,200")
    .attr("fill", "#FFFF33")
    .attr("stroke", "black");


   /*  right upper wing */
let rightUpperWing = drawing.append("polygon")
    .attr("points", "360,155 275,100 253,200")
    .attr("fill", "#FFFF33")
    .attr("stroke", "black");


/* Lower Wings  */

let leftlowerwing = drawing.append("polygon")
.attr("points", "160,200 247,200 247,300")
.attr("fill", "#CC6633")
.attr("stroke", "black");

/*  right lower wing */
let rightLowerWing = drawing.append("polygon")
    .attr("points", "340,200 253,200 253,300")
    .attr("fill", "#CC6633")
    .attr("stroke", "black");

    //uncomment this code for a bigger butterfly lower wing
// let leftLowerWing = drawing.append("polygon")
//     .attr("points", "200,300 247,280 247,350")
//     .attr("fill", "none")
//     .attr("stroke", "black");

 /* butterfly Antennae */

/* left antenna */
let leftAntenna = drawing.append("line")
    .attr("x1", 245 + butterflyx)
    .attr("y1", 110 + butterflyy)
    .attr("x2", 220 + butterflyx)
    .attr("y2", 60 + butterflyy)
    .attr("stroke", "#000000");
    
/* right antenna */
let rightAntenna = drawing.append("line")
    .attr("x1", 255 + butterflyx)
    .attr("y1", 110 + butterflyy)
    .attr("x2", 270 + butterflyx)
    .attr("y2", 60 + butterflyy)
    .attr("stroke", "#000000");



