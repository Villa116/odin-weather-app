const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

// Optional: Add your free Visual Crossing API key here if keyless requests hit a limit
const API_KEY = "";

export async function fetchRawWeather(location) {
  const encodedLocation = encodeURIComponent(location.trim());
  const keyParam = API_KEY ? `&key=${API_KEY}` : "";
  const url = `${BASE_URL}/${encodedLocation}?unitGroup=metric&contentType=json${keyParam}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Weather lookup failed (${response.status}): Could not find "${location}"`
    );
  }

  const data = await response.json();
  return data;
}

export function processWeatherData(rawData) {
  const current = rawData.currentConditions;

  return {
    location: rawData.resolvedAddress,
    timezone: rawData.timezone,
    description: rawData.description,
    current: {
      tempC: current.temp,
      feelsLikeC: current.feelslike,
      humidity: current.humidity,
      windSpeedKmh: current.windspeed,
      conditions: current.conditions,
      icon: current.icon, // e.g., "partly-cloudy-day", "rain", "clear-day"
      datetime: current.datetime,
    },
    // Grab the next 5 days for a multi-day forecast
    forecast: rawData.days.slice(0, 5).map((day) => ({
      date: day.datetime,
      tempMaxC: day.tempmax,
      tempMinC: day.tempmin,
      conditions: day.conditions,
      icon: day.icon,
      precipProb: day.precipprob,
    })),
  };
}
