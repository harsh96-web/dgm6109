"use strict";

/* Harsh Kumar — Lab 9 Plot 1
   Scatter correlation: x = workout minutes, y = sleep hours
   Third+ properties: protein (bubble size), restfulness (color)
   Uses Array.sort() to draw big bubbles first so smaller ones remain visible. */

const data = [
  {"date":"2025-09-25","duration":50,"sleep":6.0,"protein":80,"restfulness":1},
  {"date":"2025-09-26","duration":60,"sleep":6.5,"protein":90,"restfulness":2},
  {"date":"2025-09-27","duration":65,"sleep":6.8,"protein":95,"restfulness":3},
  {"date":"2025-09-28","duration":70,"sleep":7.0,"protein":100,"restfulness":3},
  {"date":"2025-09-29","duration":75,"sleep":7.3,"protein":110,"restfulness":3},
  {"date":"2025-09-30","duration":78,"sleep":7.5,"protein":115,"restfulness":4},
  {"date":"2025-10-01","duration":82,"sleep":7.6,"protein":120,"restfulness":4},
  {"date":"2025-10-02","duration":86,"sleep":7.8,"protein":130,"restfulness":4},
  {"date":"2025-10-03","duration":90,"sleep":8.0,"protein":135,"restfulness":5},
  {"date":"2025-10-04","duration":94,"sleep":8.1,"protein":140,"restfulness":5},
  {"date":"2025-10-05","duration":98,"sleep":8.3,"protein":145,"restfulness":5},
  {"date":"2025-10-06","duration":102,"sleep":8.5,"protein":150,"restfulness":5}
];

// ---- SVG + margins
const svg = d3.select("#chart"),
      W = +svg.attr("width"),
      H = +svg.attr("height"),
      M = {top:70,right:235,bottom:90,left:80},
      width = W - M.left - M.right,
      height = H - M.top - M.bottom;

const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

// ---- Scales (include 0 on both axes, unit-friendly ticks)
const x = d3.scaleLinear().domain([0,125]).range([0,width]);
const y = d3.scaleLinear().domain([0,10]).range([height,0]);
const r = d3.scaleSqrt().domain(d3.extent(data, d=>d.protein)).range([6,20]);
const color = d3.scaleOrdinal()
  .domain([1,2,3,4,5])
  .range(["#e74c3c","#f39c12","#f1c40f","#52c41a","#237804"]);

// ---- Axes
g.append("g").attr("transform",`translate(0,${height})`)
  .call(d3.axisBottom(x).tickValues([0,25,50,75,100,125]).tickFormat(d=>`${d} min`));
g.append("g").call(d3.axisLeft(y).tickValues([0,2,4,6,8,10]).tickFormat(d=>`${d} hrs`));

g.append("text").attr("x",width/2).attr("y",height+50).attr("text-anchor","middle")
  .style("font-weight","700").text("Workout Duration (minutes)");
g.append("text").attr("transform","rotate(-90)").attr("x",-height/2).attr("y",-60)
  .attr("text-anchor","middle").style("font-weight","700").text("Sleep Hours (hours)");

// ---- Sort big → small (so smaller draw on top and remain visible)
const sorted = [...data].sort((a,b)=>b.protein - a.protein);

// ---- Tooltip
const tip = d3.select("body").append("div").attr("class","tooltip");

// ---- Points
g.selectAll("circle").data(sorted).enter().append("circle")
  .attr("cx",d=>x(d.duration))
  .attr("cy",d=>y(d.sleep))
  .attr("r", d=>r(d.protein))
  .attr("fill", d=>color(d.restfulness))
  .attr("stroke","#222").attr("stroke-width",1.3).attr("opacity",0.78)
  .on("mouseover",(ev,d)=>{
    tip.style("opacity",1).html(
      `<strong>${d.date}</strong><br>Workout: ${d.duration} min<br>Sleep: ${d.sleep} hrs<br>Protein: ${d.protein} g<br>Restfulness: ${d.restfulness}/5`
    ).style("left", (ev.pageX+12)+"px").style("top",(ev.pageY-32)+"px");
    d3.select(ev.currentTarget).transition().duration(120).attr("opacity",1).attr("r", r(d.protein)+3);
  })
  .on("mouseout",(ev,d)=>{
    tip.style("opacity",0);
    d3.select(ev.currentTarget).transition().duration(120).attr("opacity",0.78).attr("r", r(d.protein));
  });

// ---- Keys (restfulness + size)
const keyX = width + 18;

// Restfulness key
const rest = g.append("g").attr("class","key").attr("transform",`translate(${keyX},8)`);
rest.append("rect").attr("width",185).attr("height",152).attr("rx",10)
  .attr("fill","none").attr("stroke","#999");
rest.append("text").attr("x",12).attr("y",20).style("font-weight","800").text("Restfulness (1–5)");

[1,2,3,4,5].forEach((lvl,i)=>{
  const row = rest.append("g").attr("transform",`translate(14,${36+i*22})`);
  row.append("circle").attr("r",7).attr("fill",color(lvl)).attr("stroke","#222");
  row.append("text").attr("x",18).attr("y",4)
     .text(`${lvl} = ${["Very Tired","Low","Moderate","Good","Excellent"][i]}`);
});

// Size key (protein)
const size = g.append("g").attr("class","key").attr("transform",`translate(${keyX},172)`);
size.append("rect").attr("width",200).attr("height",170).attr("rx",10)
  .attr("fill","none").attr("stroke","#999");
size.append("text").attr("x",12).attr("y",20).style("font-weight","800").text("Protein (g)");
[80,100,130,150].reduce((cy,p)=>{
  size.append("circle").attr("cx",26).attr("cy",cy).attr("r",r(p))
      .attr("fill","#e9e9e9").attr("stroke","#555");
  size.append("text").attr("x",58).attr("y",cy+4).text(`${p} g`);
  return cy + r(p)*2 + 18;
}, 42);
