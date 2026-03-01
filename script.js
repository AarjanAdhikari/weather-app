let weather = {
  getCoordinates: async function (city) {
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        alert("City not found.");
        throw new Error("City not found.");
      }
      const { latitude, longitude, name, country } = geoData.results[0];
      this.fetchWeather(latitude, longitude, name, country);
    } catch (error) {
      console.error(error);
    }
  },

  fetchWeather: async function (lat, lon, cityName, country) {
    try {
      // Fetch current weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=auto`
      );
      const data = await weatherRes.json();
      this.displayWeather(data, cityName, country);
    } catch (error) {
      alert("Could not fetch weather data.");
      console.error(error);
    }
  },

  getWeatherDescription: function (code) {
    const weatherCodes = {
      0: "Clear",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      95: "Thunderstorm",
    };
    return weatherCodes[code] || "Clear";
  },

  getWeatherIcon: function (desc) {
    const icons = {
      "Clear": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-day-sunny.svg",
      "Mainly clear": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-day-sunny-overcast.svg",
      "Partly cloudy": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-day-cloudy.svg",
      "Overcast": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-cloudy.svg",
      "Fog": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-fog.svg",
      "Light drizzle": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-sprinkle.svg",
      "Moderate drizzle": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-sprinkle.svg",
      "Dense drizzle": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-rain.svg",
      "Slight rain": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-rain.svg",
      "Moderate rain": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-rain.svg",
      "Heavy rain": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-rain-wind.svg",
      "Slight snow": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-snow.svg",
      "Moderate snow": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-snow.svg",
      "Heavy snow": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-snow-wind.svg",
      "Thunderstorm": "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-thunderstorm.svg"
    };
    return icons[desc] || icons["Clear"];
  },

  displayWeather: function (data, cityName, country) {
    const current = data.current_weather;
    const temperature = Math.round(current.temperature);
    const wind = Math.round(current.windspeed);
    const weatherCode = current.weathercode;
    const description = this.getWeatherDescription(weatherCode);

    // Fetch current hour humidity from hourly data
    const hourIndex = data.hourly.time.findIndex(t => new Date(t).getHours() === new Date().getHours());
    const humidity = hourIndex !== -1 ? data.hourly.relative_humidity_2m[hourIndex] : "N/A";

    document.querySelector(".city").innerText = cityName + ", " + country;
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temperature + "°";
    document.querySelector(".humidity").innerText = humidity + "%";
    document.querySelector(".wind").innerText = wind + " km/h";

    document.querySelector(".icon").src = this.getWeatherIcon(description);

    document.querySelector(".weather").classList.remove("loading");

    document.getElementById("date").innerText = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    document.body.style.background = "linear-gradient(180deg, #0b0f14 0%, #111827 100%)";
  },

  search: function () {
    const city = document.querySelector(".search-bar").value;
    if (city.trim() !== "") this.getCoordinates(city);
  }
};

document.querySelector(".search-btn").addEventListener("click", () => weather.search());
document.querySelector(".search-bar").addEventListener("keyup", (e) => {
  if (e.key === "Enter") weather.search();
});

// Default load
weather.getCoordinates("Kathmandu");
