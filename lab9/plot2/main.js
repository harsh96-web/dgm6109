"use strict";

/* Harsh Kumar — Lab 9 Plot 2
   Scatter correlation: x = protein (g), y = sleep (hours)
   Third property: duration (mins) as bubble size
   Uses Array.filter() to include only workout days (duration > 0). */

const full = [
  {"date":"2025-09-25","duration":0,"sleep":7,"protein":115,"restfulness":4},
  {"date":"2025-09-26","duration":70,"sleep":7,"protein":125,"restfulness":4},
  {"date":"2025-09-27","duration":80,"sleep":7.6,"protein":130,"restfulness":4},
  {"date":"2025-09-28","duration":50,"sleep":6.3,"protein":115,"restfulness":3},
  {"date":"2025-09-29","duration":90,"sleep":8.1,"protein":140,"restfulness":5},
  {"date":"2025-09-30","duration":0,"sleep":6.9,"protein":110,"restfulness":3},
  {"date":"2025-10-01","duration":0,"sleep":7.2,"protein":112,"restfulness":4},
  {"date":"2025-10-02","duration":85,"sleep":7.9,"protein":138,"restfulness":4},
  {"date":"2025-10-03","duration":55,"sleep":6.4,"protein":118,"restfulness":3},
  {"date":"2025-10-04","duration":95,"sleep":8.3,"protein":148,"restfulness":5},
  {"date":"2025-10-05","duration":70,"sleep":7.2,"protein":130,"restfulness":4},
  {"date":"2025-10-06","duration":100,"sleep":8.5,"protein":150,"restfulness":5},
  {"date":"2025-10-07","duration":0,"sleep":7,"protein":115,"restfulness":3},
  {"date":"2025-10-08","duration":0,"sleep":7.4,"protein":117,"restfulness":4},
  {"date":"2025-10-09","duration":85,"sleep":7.9,"protein":138,"restfulness":4},
  {"date":"2025-10-10","duration":95,"sleep":8.4,"protein":146,"restfulness":5},
  {"date":"2025-10-11","duration":65,"sleep":7,"protein":126,"restfulness":4},
  {"date":"2025-10-12","duration":80,"sleep":7.8,"protein":134,"restfulness":4},
  {"date":"2025-10-13","duration":50,"sleep":6.2,"protein":112,"restfulness":3},
  {"date":"2025-10-14","duration":90,"sleep":8.2,"protein":144,"restfulness":5}
];

// ---- FILTER: workout days only
const data = full.filter(d => d.duration > 0);

// ---- SVG + margins
const svg = d3.select("#chart"),
      W = +svg.attr("width"),
      H = +svg.attr("height"),
      M = {top:70,right:220,bottom:90,left:80},
      width = W - M.left - M.right,
      height = H - M.top - M.bottom;

const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

// ---- Scales
const x = d3.scaleLinear()
  .domain([d3.min(data,d=>d.protein)-5, d3.max(data,d=>d.protein)+5]) // padding
  .range([0,width]);
const y = d3.scaleLinear().domain([0,10]).range([height,0]);
const r = d3.scaleSqrt().domain(d3.extent(data, d=>d.duration)).range([6,22]);
const color = d3.scaleOrdinal()
  .domain([1,2,3,4,5])
  .range(["#e74c3c","#f39c12","#f1c40f","#52c41a","#237804"]);

// ---- Axes
g.append("g").attr("transform",`translate(0,${height})`)
  .call(d3.axisBottom(x).ticks(6).tickFormat(d=>`${d} g`));
g.append("g").call(d3.axisLeft(y).tickValues([0,2,4,6,8,10]).tickFormat(d=>`${d} hrs`));

g.append("text").attr("x",width/2).attr("y",height+50).attr("text-anchor","middle")
  .style("font-weight","700").text("Protein Intake (grams)");
g.append("text").attr("transform","rotate(-90)").attr("x",-height/2).attr("y",-58)
  .attr("text-anchor","middle").style("font-weight","700").text("Sleep Hours (hours)");

// ---- Tooltip
const tip = d3.select("body").append("div").attr("class","tooltip");

// ---- Points
g.selectAll("circle").data(data).enter().append("circle")
  .attr("cx",d=>x(d.protein))
  .attr("cy",d=>y(d.sleep))
  .attr("r", d=>r(d.duration))
  .attr("fill", d=>color(d.restfulness))
  .attr("stroke","#222").attr("stroke-width",1.3).attr("opacity",0.8)
  .on("mouseover",(ev,d)=>{
    tip.style("opacity",1).html(
      `<strong>${d.date}</strong><br>Protein: ${d.protein} g<br>Sleep: ${d.sleep} hrs<br>Workout: ${d.duration} min<br>Restfulness: ${d.restfulness}/5`
    ).style("left", (ev.pageX+12)+"px").style("top",(ev.pageY-32)+"px");
    d3.select(ev.currentTarget).transition().duration(120).attr("opacity",1).attr("r", r(d.duration)+3);
  })
  .on("mouseout",(ev,d)=>{
    tip.style("opacity",0);
    d3.select(ev.currentTarget).transition().duration(120).attr("opacity",0.8).attr("r", r(d.duration));
  });

// ---- Size key (duration)
const key = g.append("g").attr("transform",`translate(${width+16},10)`);
key.append("rect").attr("width",200).attr("height",170).attr("rx",10).attr("fill","none").attr("stroke","#999");
key.append("text").attr("x",12).attr("y",20).style("font-weight","800").text("Workout Minutes (size)");

[50,70,100].reduce((cy,m)=>{
  key.append("circle").attr("cx",26).attr("cy",cy).attr("r",r(m)).attr("fill","#e9e9e9").attr("stroke","#555");
  key.append("text").attr("x",58).attr("y",cy+4).text(`${m} min`);
  return cy + r(m)*2 + 18;
}, 42);

// ---- Color key (restfulness)
const rest = g.append("g").attr("transform",`translate(${width+16},190)`);
rest.append("rect").attr("width",200).attr("height",152).attr("rx",10).attr("fill","none").attr("stroke","#999");
rest.append("text").attr("x",12).attr("y",20).style("font-weight","800").text("Restfulness (1–5)");
[1,2,3,4,5].forEach((lvl,i)=>{
  const row = rest.append("g").attr("transform",`translate(14,${36+i*22})`);
  row.append("circle").attr("r",7).attr("fill",color(lvl)).attr("stroke","#222");
  row.append("text").attr("x",18).attr("y",4)
     .text(`${lvl} = ${["Very Tired","Low","Moderate","Good","Excellent"][i]}`);
});
