"use strict";

/*
  Project 2-4: Collectable Card Ordering System
  Name: Harsh Kumar
  Project2-final
  Description:
  Validates user input for Magic: The Gathering card orders,
  checks CCV rules, applies shipping or credit-limit rules,
  and displays all messages clearly.
  Matches flowchart.pdf (Final Horizontal Non-Overlapping Version)
*/

// ---------- Global variables ----------
let pack, ccNumber, ccv;

// ---------- Event Listeners ----------
document.getElementById("submit").addEventListener("click", processForm);
document.getElementById("reset").addEventListener("click", resetForm);

/**
 * processForm()
 * Reads user inputs, runs validateData(), then evaluateAnswers().
 * Toggles Submit ↔ Start Over when complete.
 */
function processForm() {
  pack = document.getElementById("pack").value;
  ccNumber = document.getElementById("ccNumber").value.trim();
  ccv = document.getElementById("ccv").value.trim();

  clear(); // clear previous messages

  let valid = validateData();

  if (valid) {
    let done = evaluateAnswers();
    if (done) {
      toggleButtons();
    } else {
      rule(); // horizontal divider after error
    }
  } else {
    rule();
  }
}

/**
 * allDigits(str)
 * Helper that checks every character is a number (0–9).
 */
function allDigits(str) {
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch < "0" || ch > "9") return false;
  }
  return true;
}

/**
 * validateData()
 * Checks three conditions:
 *  – Pack is selected
 *  – Card number = 6 digits
 *  – CCV = 3 digits
 * Bonus: Shows *all* invalid fields before returning false.
 */
function validateData() {
  let isValid = true;

  if (!pack) {
    output("Please select a card pack option.");
    isValid = false;
  }

  if (ccNumber.length !== 6 || !allDigits(ccNumber)) {
    output("Credit card number must be exactly 6 digits.");
    isValid = false;
  }

  if (ccv.length !== 3 || !allDigits(ccv)) {
    output("CCV code must be exactly 3 digits.");
    isValid = false;
  }

  return isValid;
}

/**
 * evaluateAnswers()
 * Applies rules from Project 2-4:
 *  – Each CCV digit = sum of two card digits
 *  – Price > $1000 → credit limit fail
 *  – Price < $50 → add $2 shipping
 * Returns: true on success, false on any failure.
 */
function evaluateAnswers() {
  const prices = {
    retail: 5.00,
    starter: 50.00,
    firstEdition: 5000.00
  };
  const packNames = {
    retail: "Retail booster pack",
    starter: "Collectable starter pack",
    firstEdition: "1st edition complete set"
  };

  // Convert digits to numbers
  const [d1, d2, d3, d4, d5, d6] = ccNumber.split("").map(Number);
  const [c1, c2, c3] = ccv.split("").map(Number);

  // --- CCV validation ---
  if (c1 !== d1 + d2 || c2 !== d3 + d4 || c3 !== d5 + d6) {
    output("Incorrect credit card information entered (CCV mismatch).");
    return false;
  }

  const price = prices[pack];

  // --- Credit limit rule ---
  if (price > 1000.00) {
    output("Unfortunately, the price of this item exceeds your credit limit.");
    return false;
  }

  // --- Shipping rule ---
  let shippingFee = 0.00;
  let shippingNote = "You received FREE shipping on this order.";
  if (price < 50.00) {
    shippingFee = 2.00;
    shippingNote = "This includes a $2.00 shipping fee.";
  }

  const total = price + shippingFee;
  const finalPrice = "$" + total.toFixed(2); // ensure $D.CC format

  // --- Successful order output ---
  output(`Your card pack type for “Magic: The Gathering” (${packNames[pack]}) will be delivered to you as soon as possible.`);
  output(`Your credit card will be billed a total of ${finalPrice}.`);
  output(shippingNote);

  return true;
}

/**
 * clear()
 * Clears the output area.
 */
function clear() {
  document.getElementById("output").innerHTML = "";
}

/**
 * output(msg)
 * Appends a message to the #output div.
 */
function output(msg) {
  const out = document.getElementById("output");
  const p = document.createElement("p");
  p.textContent = msg;
  out.appendChild(p);
}

/**
 * rule()
 * Inserts a horizontal rule (<hr>) after a validation round.
 */
function rule() {
  document.getElementById("output").appendChild(document.createElement("hr"));
}

/**
 * toggleButtons()
 * Switches between Submit and Reset buttons.
 */
function toggleButtons() {
  document.getElementById("submit").toggleAttribute("hidden");
  document.getElementById("reset").toggleAttribute("hidden");
}

/**
 * resetForm()
 * Clears all fields and resets button visibility.
 */
function resetForm() {
  document.getElementById("pack").value = "";
  document.getElementById("ccNumber").value = "";
  document.getElementById("ccv").value = "";
  clear();
  toggleButtons();
}
