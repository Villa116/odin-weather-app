import "./styles.css";
import { fetchRawWeather, processWeatherData } from "./weatherApi.js";
import {
  renderWeather,
  setLoading,
  showError,
  updateUnitToggleUI,
} from "./domController.js";

let currentWeatherData = null;
let isMetric = true;

const searchForm = document.querySelector("#search-form");
const locationInput = document.querySelector("#location-input");
const unitToggleBtn = document.querySelector("#unit-toggle");

async function handleWeatherSearch(location) {
  setLoading(true);
  try {
    const rawData = await fetchRawWeather(location);
    currentWeatherData = processWeatherData(rawData);
    renderWeather(currentWeatherData, isMetric);
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = locationInput.value.trim();
  if (!city) return;
  handleWeatherSearch(city);
  locationInput.value = "";
});

unitToggleBtn.addEventListener("click", () => {
  isMetric = !isMetric;
  updateUnitToggleUI(isMetric);
  if (currentWeatherData) {
    renderWeather(currentWeatherData, isMetric);
  }
});

// Load an initial city on page load
handleWeatherSearch("Johannesburg");
