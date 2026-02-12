/* ============================
   PROJECT DROPDOWN LOGIC
============================ */
const dropdownButtons = document.querySelectorAll(".dropdown-btn");

dropdownButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const content = btn.nextElementSibling;
        const isOpen = content.classList.toggle("open");

        const openLabel = btn.dataset.open;
        const closedLabel = btn.dataset.closed;

        btn.textContent = isOpen ? openLabel : closedLabel;
    });
});


/* ============================
   WEATHER APP (OPEN-METEO)
============================ */

// Weather code descriptions (Open-Meteo standard)
const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Freezing drizzle (light)",
    57: "Freezing drizzle (dense)",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Freezing rain (light)",
    67: "Freezing rain (heavy)",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Rain showers (slight)",
    81: "Rain showers (moderate)",
    82: "Rain showers (violent)",
    85: "Snow showers (slight)",
    86: "Snow showers (heavy)",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

document.getElementById("searchBtn").addEventListener("click", async () => {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) return;

    try {
        /* 1. Get coordinates from Open-Meteo geocoding API */
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            alert("City not found");
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        /* 2. Get weather data */
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();

        const weather = weatherData.current_weather;

        /* 3. Translate weather code */
        const code = weather.weathercode;
        const description = weatherDescriptions[code] || "Unknown condition";

        /* 4. Update UI */
        document.getElementById("cityName").textContent = name;
        document.getElementById("temp").textContent = `Temperature: ${weather.temperature}°C`;
        document.getElementById("condition").textContent = `Condition: ${description}`;
        
        // Extra data
        if (!document.getElementById("extraWeather")) {
            const extra = document.createElement("div");
            extra.id = "extraWeather";
            extra.style.marginTop = "10px";
            extra.style.opacity = "0.9";
            document.querySelector(".weather-result").appendChild(extra);
        }

        document.getElementById("extraWeather").innerHTML = `
            <p>Wind Speed: ${weather.windspeed} km/h</p>
            <p>Wind Direction: ${weather.winddirection}°</p>
            <p>Observation Time: ${weather.time}</p>
            <p>Weather Code: ${code}</p>
        `;

    } catch (err) {
        console.error(err);
        alert("Error fetching weather data");
    }
});
