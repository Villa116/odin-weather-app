const weatherDisplay = document.querySelector("#weather-display");
const loadingEl = document.querySelector("#loading");
const errorEl = document.querySelector("#error-message");
const unitToggleBtn = document.querySelector("#unit-toggle");

function formatTemp(tempC, isMetric) {
  if (isMetric) {
    return `${Math.round(tempC)}°C`;
  }
  const tempF = (tempC * 9) / 5 + 32;
  return `${Math.round(tempF)}°F`;
}

function formatWind(speedKmh, isMetric) {
  if (isMetric) {
    return `${Math.round(speedKmh)} km/h`;
  }
  const speedMph = speedKmh * 0.621371;
  return `${Math.round(speedMph)} mph`;
}

function formatDayName(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function setLoading(isLoading) {
  loadingEl.classList.toggle("hidden", !isLoading);
  if (isLoading) {
    errorEl.classList.add("hidden");
    weatherDisplay.classList.add("hidden");
  }
}

export function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
  weatherDisplay.classList.add("hidden");
}

export function updateUnitToggleUI(isMetric) {
  unitToggleBtn.innerHTML = isMetric
    ? `<strong>°C</strong> / <span class="inactive">°F</span>`
    : `<span class="inactive">°C</span> / <strong>°F</strong>`;
}

export function applyWeatherTheme(iconCode) {
  // Visual Crossing icon codes: clear-day, clear-night, rain, snow, fog, wind, cloudy, partly-cloudy-day, partly-cloudy-night
  document.body.className = "";
  if (iconCode.includes("rain") || iconCode.includes("thunder")) {
    document.body.classList.add("theme-rain");
  } else if (iconCode.includes("snow")) {
    document.body.classList.add("theme-snow");
  } else if (iconCode.includes("night")) {
    document.body.classList.add("theme-night");
  } else if (iconCode.includes("cloud") || iconCode.includes("fog")) {
    document.body.classList.add("theme-cloudy");
  } else {
    document.body.classList.add("theme-clear");
  }
}

export function renderWeather(data, isMetric) {
  const { location, description, current, forecast } = data;

  applyWeatherTheme(current.icon);

  const forecastHTML = forecast
    .map(
      (day) => `
      <div class="forecast-card">
        <p class="forecast-date">${formatDayName(day.date)}</p>
        <p class="forecast-cond">${day.conditions}</p>
        <p class="forecast-temps">
          <span class="temp-max">${formatTemp(day.tempMaxC, isMetric)}</span>
          <span class="temp-min">${formatTemp(day.tempMinC, isMetric)}</span>
        </p>
        <p class="forecast-precip">Rain: ${Math.round(day.precipProb)}%</p>
      </div>
    `
    )
    .join("");

  weatherDisplay.innerHTML = `
    <div class="current-card">
      <div class="current-main">
        <h2>${location}</h2>
        <p class="current-conditions">${current.conditions}</p>
        <p class="current-temp">${formatTemp(current.tempC, isMetric)}</p>
        <p class="current-summary">${description}</p>
      </div>
      <div class="current-details">
        <div class="detail-item">
          <span>Feels Like</span>
          <strong>${formatTemp(current.feelsLikeC, isMetric)}</strong>
        </div>
        <div class="detail-item">
          <span>Humidity</span>
          <strong>${Math.round(current.humidity)}%</strong>
        </div>
        <div class="detail-item">
          <span>Wind</span>
          <strong>${formatWind(current.windSpeedKmh, isMetric)}</strong>
        </div>
      </div>
    </div>

    <h3>5-Day Forecast</h3>
    <div class="forecast-grid">
      ${forecastHTML}
    </div>
  `;

  weatherDisplay.classList.remove("hidden");
}