'use strict';

/****** function rooster (svgCanvas, x, y, showOrigin, flapChoice) ******
 OVERVIEW 
 Draws a rooster on an SVG canvas in the specified position. 
 Optionally draws a pink dot indicating the drawing's reference origin point. 
 Optionally changes rooster's wing and leg positions. 
 PARAMETERS
 svgCanvas - D3 SVG drawing canvas
 x, y - origin for the rooster
 showOrigin - boolean to show pink origin dot
 flapChoice - pass "flap" for flapping pose; anything else for normal
 RETURNS
 svgCanvas with rooster drawing added.
***********************************************************************/

// tiny helper used by this drawing file only
function closedPolygon() {
  // args are numbers: x1,y1,x2,y2,...
  var pts = [];
  for (var i = 0; i < arguments.length; i += 2) {
    pts.push(arguments[i] + "," + arguments[i + 1]);
  }
  // close shape by repeating first point
  pts.push(arguments[0] + "," + arguments[1]);
  return pts.join(" ");
}

function rooster(svgCanvas, x, y, showOrigin, flapChoice) {

  // Tail
  svgCanvas.append("polyline")
    .attr("points", closedPolygon(
      x - 75, y - 50,
      x - 25, y - 50,
      x,      y,
      x - 50, y,
      x - 75, y + 55,
      x - 100, y))
    .attr("fill", "#D5AE45");

  // Main body 
  svgCanvas.append("polyline")
    .attr("points", closedPolygon(
      x - 50, y,
      x + 100, y,
      x + 50, y + 50,
      x - 25, y + 50))
    .attr("fill", "#FA965B");

  // Neck
  svgCanvas.append("polyline")
    .attr("points", closedPolygon(
      x + 75, y - 50,
      x + 100, y,
      x + 50, y))
    .attr("fill", "#FA965B");

  // Head
  svgCanvas.append("polyline")
    .attr("points", closedPolygon(
      x + 65, y - 80,
      x + 125, y - 50,
      x + 65, y - 30))
    .attr("fill", "#FA965B");

  // Head feather shape
  svgCanvas.append("polyline")
    .attr("points", closedPolygon(
      x + 85, y - 120,
      x + 100, y - 60,
      x + 40, y - 95))
    .attr("fill", "#D5AE45");

  // Eye
  svgCanvas.append("ellipse")
    .attr("cx", x + 80)
    .attr("cy", y - 60)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", "black");

  // Pose
  if (flapChoice === "flap") {
    // Flap wing
    svgCanvas.append("polyline")
      .attr("points", closedPolygon(
        x + 25, y,
        x, y - 30,
        x - 25, y + 50))
      .attr("fill", "#03C9C9");

    // Jumping legs
    svgCanvas.append("line")
      .attr("x1", x).attr("y1", y + 45)
      .attr("x2", x - 15).attr("y2", y + 90)
      .attr("stroke", "black");

    svgCanvas.append("line")
      .attr("x1", x + 25).attr("y1", y + 50)
      .attr("x2", x + 40).attr("y2", y + 90)
      .attr("stroke", "black");
  } else {
    // Wing normal
    svgCanvas.append("polyline")
      .attr("points", closedPolygon(
        x + 25, y,
        x + 50, y + 25,
        x - 25, y + 50))
      .attr("fill", "#75FCFD");

    // Standing legs
    svgCanvas.append("line")
      .attr("x1", x).attr("y1", y + 45)
      .attr("x2", x).attr("y2", y + 100)
      .attr("stroke", "black");

    svgCanvas.append("line")
      .attr("x1", x + 25).attr("y1", y + 50)
      .attr("x2", x + 25).attr("y2", y + 100)
      .attr("stroke", "black");
  }

  // Origin dot
  if (showOrigin) {
    svgCanvas.append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 3)
      .attr("fill", "deeppink");
  }

  return svgCanvas;
}
