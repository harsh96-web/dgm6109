"use strict";

/*
  Project 2-4: Collectable Card Ordering System
  Author: Harsh Kumar
  Course: DGM6109 – Northeastern University Vancouver
  Final Version (Week 05 Submission)
  Description:
  Validates user input for Magic: The Gathering orders,
  checks CCV rules, applies shipping or credit-limit rules,
  and displays all relevant messages clearly.
  Matches flowchart.pdf (Final Horizontal Non-Overlapping Version)
*/

// ---------- Global variables ----------
let pack, ccNumber, ccv;

// ---------- Event Listeners ----------
document.getElementById("submit").addEventListener("click", processForm);
document.getElementById("reset").addEventListener("click", resetForm);

/**
 * processForm()
 * Reads form values, runs validateData(), then evaluateAnswers().
 * Toggles Submit ↔ Start Over when complete.
 */
function processForm() {
  pack = document.getElementById("pack").value;
  ccNumber = document.getElementById("ccNumber").value.trim();
  ccv = document.getElementById("ccv").value.trim();

  clear(); // clear previous messages
  let valid = validateData();

  // If validation passes, run evaluation
  if (valid) {
    let done = evaluateAnswers();
    if (done) {
      toggleButtons();
    } else {
      output("----------------------------------------");
    }
  } else {
    output("----------------------------------------");
  }
}

/**
 * validateData()
 * Checks:
 *  – A pack is selected
 *  – Card number = 6 digits
 *  – CCV = 3 digits
 *  Bonus: shows *all* invalid fields before stopping.
 * Returns: true if all valid; false otherwise.
 */
function validateData() {
  let isValid = true; // assume valid until proven false

  // 1️⃣ Check for pack selection
  if (!pack) {
    output("Please select a card pack option.");
    isValid = false;
  }

  // 2️⃣ Check card number length (exactly 6 digits)
  if (!/^[0-9]{6}$/.test(ccNumber)) {
  output("Credit card number must be exactly 6 digits.");
  isValid = false;
}


  // 3️⃣ Check CCV length (exactly 3 digits)
  if (ccv.length !== 3 || isNaN(ccv)) {
    output("CCV code must be exactly 3 digits.");
    isValid = false;
  }

  return isValid;
}

/**
 * evaluateAnswers()
 * Applies rules from Project 2-4:
 *  – CCV digits = pair sums of card digits  
 *  – Price > 1000 → credit limit fail  
 *  – Price < 50 → add $2 shipping  
 * Returns: true on success, false on any error.
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

  // Split digits into arrays
  const [d1, d2, d3, d4, d5, d6] = ccNumber.split("").map(Number);
  const [c1, c2, c3] = ccv.split("").map(Number);

  // --- CCV pair-sum check ---
  if (c1 !== d1 + d2 || c2 !== d3 + d4 || c3 !== d5 + d6) {
    output("Incorrect credit card information entered (CCV mismatch).");
    return false;
  }

  const price = prices[pack];

  // --- Credit limit check ---
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

  // --- Success message ---
  output(`Your card pack type for “Magic: The Gathering” (${packNames[pack]}) will be delivered to you as soon as possible.`);
  output(`Your credit card will be billed a total of ${finalPrice}.`);
  output(shippingNote);
  return true;
}

/**
 * Helper: clear()
 * Clears output area before new run.
 */
function clear() {
  document.getElementById("output").innerHTML = "";
}

/**
 * Helper: output(msg)
 * Displays message in output area.
 */
function output(msg) {
  let out = document.getElementById("output");
  let p = document.createElement("p");
  p.textContent = msg;
  out.appendChild(p);
}

/**
 * Helper: toggleButtons()
 * Hides Submit button and shows Reset button.
 */
function toggleButtons() {
  document.getElementById("submit").toggleAttribute("hidden");
  document.getElementById("reset").toggleAttribute("hidden");
}

/**
 * resetForm()
 * Clears all inputs and toggles buttons back.
 */
function resetForm() {
  document.getElementById("pack").value = "";
  document.getElementById("ccNumber").value = "";
  document.getElementById("ccv").value = "";
  clear();
  toggleButtons();
}
