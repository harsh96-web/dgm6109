// Temperature Converter Project - Lab #1

// Amritsar, India - June average temperature ≈ 94°F (avg high ~105°F / avg low ~83°F)
// Source: AccuWeather (recent climate data)
let fahrenheit = 94; // June average temp, Amritsar, India

let celsius = (fahrenheit - 32) * 5 / 9;
let kelvin = celsius + 273.15;

console.log("Temperature (fahrenheit): " + fahrenheit);
console.log("Temperature (celsius): " + celsius);
console.log("Temperature (kelvin): " + kelvin);
