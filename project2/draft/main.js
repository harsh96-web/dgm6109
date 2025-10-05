"use strict";

/* 
  Project 2-4: Collectable Card Ordering System
  Harsh – DGM6109 Draft Version
*/

let pack, ccNumber, ccv;

document.getElementById("submit").addEventListener("click", processForm);
document.getElementById("reset").addEventListener("click", function () {
  clear();
  document.getElementById("submit").toggleAttribute("hidden");
  document.getElementById("reset").toggleAttribute("hidden");
});

function processForm() {
  pack = document.getElementById("pack").value;
  ccNumber = document.getElementById("ccNumber").value.trim();
  ccv = document.getElementById("ccv").value.trim();

  let evaluationCompleted = false;

  if (validateData()) {
    evaluationCompleted = evaluateAnswers();
  }

  if (evaluationCompleted) {
    document.getElementById("submit").toggleAttribute("hidden");
    document.getElementById("reset").toggleAttribute("hidden");
  } else {
    rule();
  }
}

/* ========== VALIDATION STEP ========== */
function validateData() {
  let valid = true;

  if (!pack) {
    output("Please select a card pack option.");
    valid = false;
  }

  if (!/^[0-9]{6}$/.test(ccNumber)) {
    output("Credit card number must be exactly 6 digits.");
    valid = false;
  }

  if (!/^[0-9]{3}$/.test(ccv)) {
    output("CCV code must be exactly 3 digits.");
    valid = false;
  }

  return valid;
}

/* ========== PROCESSING STEP ========== */
function evaluateAnswers() {
  const prices = {
    retail: 4.0,
    starter: 8.0,
    firstEdition: 999.99, // exceeds credit limit
  };

  const packNames = {
    retail: "Retail booster pack",
    starter: "Collectable starter pack",
    firstEdition: "1st edition complete set",
  };

  const price = prices[pack];
  const [d1, d2, d3, d4, d5, d6] = ccNumber.split("").map(Number);
  const [c1, c2, c3] = ccv.split("").map(Number);

  /* --- CCV Verification Rules --- */
  if (c1 !== d1 + d2) {
    output("Incorrect credit card information entered (CCV first digit mismatch).");
    return false;
  }
  if (c2 !== d3 + d4) {
    output("Incorrect credit card information entered (CCV second digit mismatch).");
    return false;
  }
  if (c3 !== d5 + d6) {
    output("Incorrect credit card information entered (CCV third digit mismatch).");
    return false;
  }

  /* --- Credit Limit Exception --- */
  if (pack === "firstEdition") {
    output("Unfortunately, the price of this item exceeds your credit limit.");
    return false;
  }

  /* --- Shipping Rule --- */
  let total = price;
  let shippingNote = "You received FREE shipping on this order.";
  if (pack === "retail") {
    total += 2.0;
    shippingNote = "This includes a $2.00 shipping fee.";
  }

  const finalPrice = "$" + total.toFixed(2);

  output(
    `Your card pack type for “Magic: The Gathering” (${packNames[pack]}) will be delivered to you as soon as possible. Your credit card will be billed a total of ${finalPrice}. ${shippingNote}`,
    true
  );

  return true;
}
