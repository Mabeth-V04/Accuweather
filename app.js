document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "IN5XC8MAcWhz3aclRHnefXAkeRwTNPAj"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchDailyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const currentConditionsUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(currentConditionsUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const hourlyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(hourlyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML += `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function fetchDailyForecast(locationKey) {
        const dailyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(dailyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML += `<p>No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayHourlyForecast(data) {
        let hourlyForecastContent = `<h2>Hourly Forecast</h2>`;
        data.forEach(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            const temperature = hour.Temperature.Value;
            const weather = hour.IconPhrase;
            hourlyForecastContent += `
                <p>Time: ${time} </p>
                <p>Temp: ${temperature}°C </p>
                <p>Weather: ${weather}</p>
            `;
        });
        weatherDiv.innerHTML += hourlyForecastContent;
    }

    function displayDailyForecast(data) {
        let dailyForecastContent = `<h2>5-Day Forecast</h2>`;
        data.forEach(day => {
            const date = new Date(day.Date).toLocaleDateString();
            const minTemp = day.Temperature.Minimum.Value;
            const maxTemp = day.Temperature.Maximum.Value;
            const dayWeather = day.Day.IconPhrase;
            const nightWeather = day.Night.IconPhrase;
            dailyForecastContent += `
                <p>${date}</p>
                <p>Temp:${maxTemp}°C (Max), ${minTemp}°C (Min)</p>
                <p>Day: ${dayWeather}</p>
                <p>Night: ${nightWeather}</p>
            `;
        });
        weatherDiv.innerHTML += dailyForecastContent;
    }
});
