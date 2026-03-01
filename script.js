let weather = {
  // Step 1: Convert city name to latitude & longitude
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

  // Step 2: Fetch weather using coordinates
  fetchWeather: async function (lat, lon, cityName, country) {
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,windspeed_10m,weather_code&timezone=auto`
      );

      const data = await weatherRes.json();

      this.displayWeather(data, cityName, country);
    } catch (error) {
      alert("Could not fetch weather data.");
      console.error(error);
    }
  },

  // Step 3: Convert weather code to human readable description
  getWeatherDescription: function (code) {
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
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

    return weatherCodes[code] || "Unknown conditions";
  },

  // Step 4: Display everything
  displayWeather: function (data, cityName, country) {
    const current = data.current;

    const temperature = Math.round(current.temperature_2m);
    const humidity = current.relative_humidity_2m;
    const wind = Math.round(current.windspeed_10m);
    const feelsLike = Math.round(current.apparent_temperature);
    const description = this.getWeatherDescription(current.weather_code);

    document.querySelector(".city").innerText =
      cityName + ", " + country;

    document.querySelector(".description").innerText = description;

    document.querySelector(".temp").innerText = temperature + "°";

    document.querySelector(".humidity").innerText =
      humidity + "%";

    document.querySelector(".wind").innerText =
      wind + " km/h";

    document.querySelector(".weather").classList.remove("loading");

    document.getElementById("date").innerText =
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

    // Premium dark gradient background
    document.body.style.background =
      "linear-gradient(180deg, #0b0f14 0%, #111827 100%)";
  },

  search: function () {
    const city = document.querySelector(".search-bar").value;
    if (city.trim() !== "") {
      this.getCoordinates(city);
    }
  },
};

// Button click
document
  .querySelector(".search-btn")
  .addEventListener("click", function () {
    weather.search();
  });

// Enter key
document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      weather.search();
    }
  });

// Default load
weather.getCoordinates("Kathmandu");
