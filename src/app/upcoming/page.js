"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation"; // Correct import for Next.js router
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { EventCard } from "../components/EventCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import React from "react";

export default function Page() {
  const [user, loading, error] = useAuthState(auth);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, "events");
      const eventSnapshot = await getDocs(eventsCollection);
      const eventList = eventSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // setEvents(eventList);
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY; // Ensure this is correctly set in your environment
      const updatedEvents = await Promise.all(
        eventList.map(async (event) => {
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${event.location.latitude}&lon=${event.location.longitude}&units=metric&appid=${apiKey}`;
          const response = await fetch(weatherUrl);
          const data = await response.json();
          return {
            ...event,
            weather: data.weather
              ? `${data.main.temp}°C, ${data.weather[0].description}`
              : "No weather data",
          };
        })
      );
      setEvents(updatedEvents);
      // setEvents(eventList);
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen mx-10">
        <progress
          className="progress is-small is-primary max-w-[500px]"
          max="100"
        ></progress>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!user) return <p>Please log in to view events</p>;

  return (
    <div className="mb-14">
      {events.map((event, idx) => (
        <React.Fragment key={event.id || idx}>
          <div>
            <EventCard key={event.id || idx} event={event} />
          </div>
          {idx !== events.length - 1 && <hr className="py-[1px]" />}
        </React.Fragment>
      ))}
    </div>
  );
}
