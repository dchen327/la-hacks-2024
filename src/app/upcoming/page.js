"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";  // Correct import for Next.js router
import { useState, useEffect } from "react";

export default function Page() {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchWeatherData();  // Call the weather data fetch function
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();  // Cleanup on unmount
  }, [router]);

  // Function to fetch weather data
  const fetchWeatherData = () => {
    const apiKey =  process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const city = 'London';  // Example city, can be dynamic
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error));
  

  return (
    <div>
      {user ? (
        <div>
          <h1>Hello, {user.displayName || 'User'}!</h1>
          <p>Email: {user.email}</p>
          {weather ? (
            <div>
              <h2>Weather in {weather.name}</h2>
              <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)}°C</p>
              <p>Condition: {weather.weather[0].description}</p>
            </div>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}
}

// "use client";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase/config";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";

// export default function Page() {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//       } else {
//         router.push("/");
//       }
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, [router]);

//   return <div>hello world</div>;
// }
