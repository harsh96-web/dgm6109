'use strict';

/*
 Qing Dan Drawing #13 - Ladybug
 Draws a ladybug at given position with choice of head.
 Parameters:
 - svgCanvas: SVG drawing area
 - posX, posY: position (origin is the center of the body)
 - showOrigin: boolean to show origin dot
 - choice: "normal" (trapezoid) or "after" (triangle). Default "normal"
*/
function ladybug(svgCanvas, posX, posY, showOrigin, choice) {
  var bugX = posX;
  var bugY = posY;
  var mode = (choice || "normal");

  // head (two styles)
  if (mode === "normal") {
    var headBottomW = 60;
    var headTopW = 40;
    var headBottomY = bugY - 40;
    var headTopY = bugY - 75;

    var headPoints =
      (bugX - headBottomW/2) + "," + headBottomY + " " +
      (bugX - headTopW/2)    + "," + headTopY    + " " +
      (bugX + headTopW/2)    + "," + headTopY    + " " +
      (bugX + headBottomW/2) + "," + headBottomY;

    svgCanvas.append("polygon")
      .attr("points", headPoints)
      .attr("fill", "blue")
      .attr("stroke", "black");
  } else {
    var side = 60;
    var height = Math.sqrt(3) / 2 * side;
    var triPoints =
      bugX + "," + (bugY - 75) + " " +
      (bugX - side/2) + "," + (bugY - 75 + height) + " " +
      (bugX + side/2) + "," + (bugY - 75 + height);
    svgCanvas.append("polygon")
      .attr("points", triPoints)
      .attr("fill", "blue")
      .attr("stroke", "black");
  }

  // body
  svgCanvas.append("circle")
    .attr("cx", bugX)
    .attr("cy", bugY)
    .attr("r", 50)
    .attr("fill", "orange");

  // center line
  svgCanvas.append("line")
    .attr("x1", bugX)
    .attr("y1", bugY - 50)
    .attr("x2", bugX)
    .attr("y2", bugY + 50)
    .attr("stroke", "black")
    .attr("stroke-width", 1.5);

  // spots
  var spx = bugX - 20;
  var spy = bugY - 20;
  var spots = [
    [spx, spy, 15], [spx-15, spy+20, 8], [spx, spy+40, 15],
    [spx+40, spy, 15], [spx+55, spy+20, 8], [spx+40, spy+40, 15]
  ];
  for (var i=0; i<spots.length; i++) {
    svgCanvas.append("circle")
      .attr("cx", spots[i][0])
      .attr("cy", spots[i][1])
      .attr("r", spots[i][2])
      .attr("fill", "yellow");
  }

  // eyes
  svgCanvas.append("circle").attr("cx", spx+5).attr("cy", spy-40).attr("r", 6).attr("fill","yellow");
  svgCanvas.append("circle").attr("cx", spx+33).attr("cy", spy-40).attr("r", 6).attr("fill","yellow");

  // feet
  var legs = [
    [bugX-80, bugY-50, bugX-35, bugY-20], [bugX-80, bugY-10, bugX-35, bugY-10],
    [bugX-60, bugY+30, bugX-35, bugY+10], [bugX-60, bugY+30, bugX-70, bugY+60],
    [bugX+80, bugY-50, bugX+35, bugY-20], [bugX+80, bugY-10, bugX+35, bugY-10],
    [bugX+60, bugY+30, bugX+35, bugY+10], [bugX+60, bugY+30, bugX+70, bugY+60]
  ];
  for (var j=0; j<legs.length; j++) {
    svgCanvas.append("line")
      .attr("x1", legs[j][0]).attr("y1", legs[j][1])
      .attr("x2", legs[j][2]).attr("y2", legs[j][3])
      .attr("stroke","black");
  }

  // origin
  if (showOrigin) {
    svgCanvas.append("circle")
      .attr("cx", bugX)
      .attr("cy", bugY)
      .attr("r", 3)
      .attr("fill", "deeppink");
  }

  return svgCanvas;
}
