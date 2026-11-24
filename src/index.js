import "./styles.css";

import "./styles.css";
import { fetchRawWeather, processWeatherData } from "./weatherApi.js";

async function testWeather(city) {
  try {
    const rawData = await fetchRawWeather(city);
    console.log("Raw API Data:", rawData);

    const cleanData = processWeatherData(rawData);
    console.log("Processed App Data:", cleanData);
  } catch (error) {
    console.error(error.message);
  }
}

testWeather("Johannesburg");
