"use strict";

/**
 * output(content, type)
 * Adds a new <p> into #output.
 * type: "error" | "success" | undefined
 */
function output(content, type) {
  const o = document.getElementById("output");
  const p = document.createElement("p");
  p.textContent = content;

  // apply semantic class
  if (type === "error") p.className = "msg-error";
  else if (type === "success") p.className = "msg-success";

  o.appendChild(p);

  // inject minimal styles once
  if (!document.getElementById("msgStyles")) {
    const style = document.createElement("style");
    style.id = "msgStyles";
    style.textContent = `
      .msg-error { color: #b00020; font-weight: 600; }
      .msg-success { color: #0b6b1e; font-weight: 600; }
    `;
    document.head.appendChild(style);
  }
}

/** rule(): insert a horizontal rule */
function rule() {
  document.getElementById("output").appendChild(document.createElement("hr"));
}

/** clear(): remove all child nodes from #output */
function clear() {
  document.getElementById("output").replaceChildren();
}