const prompt = require("prompt-sync")();


class WeatherData {
  constructor(json) {
    const data = JSON.parse(json);
    this.city = data.city;
    this.temperature = data.temperature;
    this.humidity = data.humidity;
    this.condition = data.condition;
  }

  display() {
    console.log(`Weather in ${this.city}:`);
    console.log(`Temperature: ${this.temperature}°C`);
    console.log(`Humidity: ${this.humidity}%`);
    console.log(`Condition: ${this.condition}`);
  }
}

const mockApiResponse = JSON.stringify({
  city: prompt("Enter city name:"),
  temperature: parseInt(prompt("Enter temperature (°C):"), 10),
  humidity: parseInt(prompt("Enter humidity (%):"), 10),
  condition: prompt("Enter weather condition (e.g., Sunny, Rainy):")
});

const weather = new WeatherData(mockApiResponse);
weather.display();
