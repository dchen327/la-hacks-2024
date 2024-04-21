import React, { useState, useEffect } from 'react';

function WeatherForecast() {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const city = "London";
    const apiKey =  process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=16&appid=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setForecast(data);
      })
      .catch(error => console.error("Fetching weather data failed", error));
  }, []);

  if (!forecast) return <div>Loading...</div>;

  return (
    <div>
      <h1>16-Day Weather Forecast for {forecast.city.name}</h1>
      <ul>
        {forecast.list.map((day, index) => (
          <li key={index}>
            <div>Date: {new Date(day.dt * 1000).toLocaleDateString()}</div>
            <div>Temperature: {day.temp.day}°C</div>
            <div>Weather: {day.weather[0].description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeatherForecast;
