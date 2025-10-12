"use strict";

/**
 * output(content)
 * Adds a new <p> with the given message into #output.
 */
function output(content) {
  const o = document.getElementById("output");
  const p = document.createElement("p");
  p.textContent = content;
  o.appendChild(p);
}

/**
 * rule()
 * Adds a horizontal rule (<hr>) to separate test attempts.
 */
function rule() {
  document.getElementById("output").appendChild(document.createElement("hr"));
}

/**
 * clear()
 * Removes all child elements from #output.
 */
function clear() {
  document.getElementById("output").replaceChildren();
}
