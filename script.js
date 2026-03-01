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
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
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

  // Step 4: Map weather description to premium online images
  getWeatherImage: function (desc) {
    const weatherImages = {
      "Clear sky": "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=400&q=80",
      "Mainly clear": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      "Partly cloudy": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
      "Overcast": "https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&fit=crop&w=400&q=80",
      "Fog": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
      "Depositing rime fog": "https://images.unsplash.com/photo-1549887535-9c2dc43f3e8b?auto=format&fit=crop&w=400&q=80",
      "Light drizzle": "https://images.unsplash.com/photo-1501621965065-c6e1cf6b53e2?auto=format&fit=crop&w=400&q=80",
      "Moderate drizzle": "https://images.unsplash.com/photo-1524646439999-6b9723f9f2e0?auto=format&fit=crop&w=400&q=80",
      "Dense drizzle": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
      "Slight rain": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80",
      "Moderate rain": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80",
      "Heavy rain": "https://images.unsplash.com/photo-1500674425229-f692875b0ab7?auto=format&fit=crop&w=400&q=80",
      "Slight snow": "https://images.unsplash.com/photo-1516205651411-aef33a44f6b4?auto=format&fit=crop&w=400&q=80",
      "Moderate snow": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
      "Heavy snow": "https://images.unsplash.com/photo-1542260549-90cecf4cf6b4?auto=format&fit=crop&w=400&q=80",
      "Thunderstorm": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80"
    };

    return weatherImages[desc] || weatherImages["Clear sky"];
  },

  // Step 5: Display everything
  displayWeather: function (data, cityName, country) {
    const current = data.current_weather;

    const temperature = Math.round(current.temperature);
    const wind = Math.round(current.windspeed);
    const weatherCode = current.weathercode;
    const description = this.getWeatherDescription(weatherCode);

    document.querySelector(".city").innerText = cityName + ", " + country;
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temperature + "°";
    document.querySelector(".humidity").innerText = ""; // Open-Meteo free current_weather doesn't provide humidity
    document.querySelector(".wind").innerText = wind + " km/h";

    document.querySelector(".icon").src = this.getWeatherImage(description);

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
document.querySelector(".search-btn").addEventListener("click", function () {
  weather.search();
});

// Enter key
document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    weather.search();
  }
});

// Default load
weather.getCoordinates("Kathmandu");
