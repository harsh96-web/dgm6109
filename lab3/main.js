"use strict";

document.getElementById("submit").addEventListener("click", function () {
  // Get Fahrenheit input value

  
  let fahrenheit = document.getElementById("inputF").value;
  fahrenheit = Number(fahrenheit); // convert string → number

  // conversion user picked
  let conversionType = document.getElementById("conversionChoice").value;

  // Calculate conversions
  let celsius = (fahrenheit - 32) * (5 / 9);
  let kelvin = celsius + 273.15; // fixed Kelvin bug

  // Always show original Fahrenheit
  output("Original temperature (F): " + fahrenheit);

  // Show only one conversion depending on choice
  if (conversionType === "c") {
    output("Converted to Celsius: " + celsius.toFixed(2));
  } else if (conversionType === "k") {
    output("Converted to Kelvin: " + kelvin.toFixed(2));
  }
});
