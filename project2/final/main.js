"use strict";

/*
  Project 2-4: Collectable Card Ordering System
  Author: Harsh Kumar
  Course: DGM6109 – Northeastern University Vancouver
  Final Version – Week 05
  Description:
  Validates user input for Magic: The Gathering card orders,
  checks CCV rules, applies exceptions, adds shipping, and outputs the total.
  Matches flowchart.pdf (Week 05 Final Version)
*/

// ---------- Global variables ----------
let pack, ccNumber, ccv;

// ---------- Event Listeners ----------
document.getElementById("submit").addEventListener("click", processForm);
document.getElementById("reset").addEventListener("click", function () {
  clear();
  document.getElementById("submit").toggleAttribute("hidden");
  document.getElementById("reset").toggleAttribute("hidden");
});

/**
 * processForm()
 * Reads form values, runs validateData() then evaluateAnswers().
 * On success toggles Submit → Start Over; otherwise inserts a divider line.
 */
function processForm() {
  pack = document.getElementById("pack").value;
  ccNumber = document.getElementById("ccNumber").value.trim();
  ccv = document.getElementById("ccv").value.trim();

  let evaluationCompleted = false;
  if (validateData()) evaluationCompleted = evaluateAnswers();

  if (evaluationCompleted) {
    document.getElementById("submit").toggleAttribute("hidden");
    document.getElementById("reset").toggleAttribute("hidden");
  } else {
    rule();
  }
}

/**
 * validateData()
 * Checks basic input validity:
 *  – A pack is selected
 *  – Credit card number has exactly 6 digits
 *  – CCV has exactly 3 digits
 * Returns: true if all valid; false otherwise.
 */
function validateData() {
  if (!pack) {
    output("Please select a card pack option.");
    return false;
  }
  if (!/^[0-9]{6}$/.test(ccNumber)) {
    output("Credit card number must be exactly 6 digits.");
    return false;
  }
  if (!/^[0-9]{3}$/.test(ccv)) {
    output("CCV code must be exactly 3 digits.");
    return false;
  }
  return true;
}

/**
 * evaluateAnswers()
 * Applies CCV pair-sum rules, credit-limit and shipping rules.
 * Returns: true on success; false on any rule failure.
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

  const [d1, d2, d3, d4, d5, d6] = ccNumber.split("").map(Number);
  const [c1, c2, c3] = ccv.split("").map(Number);

  // CCV rule: each CCV digit = sum of corresponding card digits
  if (c1 !== d1 + d2 || c2 !== d3 + d4 || c3 !== d5 + d6) {
    output("Incorrect credit card information entered (CCV mismatch).");
    return false;
  }

  const price = prices[pack];

  // Credit-limit rule
  if (price > 1000.00) {
    output("Unfortunately, the price of this item exceeds your credit limit.");
    return false;
  }

  // Shipping rule
  let shippingFee = 0.00;
  let shippingNote = "You received FREE shipping on this order.";
  if (price < 50.00) {
    shippingFee = 2.00;
    shippingNote = "This includes a $2.00 shipping fee.";
  }

  const total = price + shippingFee;
  const finalPrice = "$" + total.toFixed(2);

  clear();
  output(`Your card pack type for “Magic: The Gathering” (${packNames[pack]}) will be delivered to you as soon as possible.`);
  output(`Your credit card will be billed a total of ${finalPrice}.`);
  output(shippingNote);
  return true;
}
