"use strict";

/**
 * output(content, kind = "info")
 * Adds a new <p> with the given message into #output.
 * kind: "info" | "error" | "success"
 */
function output(content, kind = "info") {
  const o = document.getElementById("output");
  const p = document.createElement("p");
  p.textContent = content;

  // add color
  if (kind === "error") {
    p.style.color = "#B00020";          // red
    p.setAttribute("role", "alert");     // accessibility
  } else if (kind === "success") {
    p.style.color = "#1B5E20";           // green
  }

  o.appendChild(p);
}

/** Shorthand helpers (optional) */
function outputError(msg)   { output(msg, "error"); }
function outputSuccess(msg) { output(msg, "success"); }

/** Adds a horizontal rule (<hr>) to separate test attempts. */
function rule() {
  document.getElementById("output").appendChild(document.createElement("hr"));
}

/** Removes all child elements from #output. */
function clear() {
  document.getElementById("output").replaceChildren();
}
