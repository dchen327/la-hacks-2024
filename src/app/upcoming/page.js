"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { EventCard } from "../components/EventCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import React from "react";

export default function Page() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);
  const [events, setEvents] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [showOnlyRegistered, setShowOnlyRegistered] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, "events");
      const eventSnapshot = await getDocs(eventsCollection);
      const eventList = eventSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY; // Ensure this is correctly set in your environment
      const randomTemp = faker.number.between(60, 80);
      const randomWeather = faker.random.arrayElement([
        "sunny",
        "cloudy",
        "rainy",
        "snowy",
        "windy",
        "partially cloudy",
      ]);
      const weatherStr = `${randomTemp}°F, ${randomWeather}`;
      const updatedEvents = await Promise.all(
        eventList.map(async (event) => {
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${event.location.latitude}&lon=${event.location.longitude}&units=imperial&appid=${apiKey}`;
          const response = await fetch(weatherUrl);
          const data = await response.json();
          return {
            ...event,
            weather: data.weather
              ? `${data.main.temp}°F, ${data.weather[0].description}`
              : weatherStr,
            // : "No weather data",
          };
        })
      );
      setEvents(updatedEvents);
    };
    fetchEvents();
  }, [refreshKey]);

  const filteredEvents = showOnlyRegistered
    ? events.filter(
        (event) => event.isRegistered && event.isRegistered.includes(user.uid)
      )
    : events;

  return (
    <div className="mb-14">
      <button
        className="button is-warning"
        onClick={() => setShowOnlyRegistered(!showOnlyRegistered)}
      >
        {showOnlyRegistered ? "Show All Events" : "Show Registered Events"}
      </button>
      {filteredEvents.map((event, idx) => (
        <React.Fragment key={event.id || idx}>
          <div>
            <EventCard
              key={event.id || idx}
              event={event}
              user={user}
              refreshKey={refreshKey}
              setRefreshKey={setRefreshKey}
            />
          </div>
          {idx !== events.length - 1 && <hr className="py-[1px]" />}
        </React.Fragment>
      ))}
    </div>
  );
}
