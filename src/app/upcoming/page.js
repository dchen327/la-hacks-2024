"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";  // Correct import for Next.js router
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { EventCard } from "../components/EventCard";
import React from 'react';

export default function Page() {
  const [user, loading, error] = useAuthState(auth);
  const [events, setEvents] = useState([]);
  // list of event data
  const initialEvents = [
    {
      name: "Football Match",
      type: "sport",
      description: "A friendly football match between local teams.",
      leader: "John Doe",
      startTime: new Date("2022-04-01T10:00:00Z"),
      endTime: new Date("2022-04-01T12:00:00Z"),
      location: { lat: 34.11228, lng: -117.81489 },
      usersAttending: ["user1", "user2", "user3"],
      pictures: ["pic1.jpg", "pic2.jpg", "pic3.jpg"],
    },
    {
      name: "Nature Walk",
      type: "nature",
      description: "A guided walk through the local nature reserve.",
      leader: "Jane Smith",
      startTime: new Date("2022-04-02T09:00:00Z"),
      endTime: new Date("2022-04-02T11:00:00Z"),
      location: { lat: 34.11228, lng: -117.81489 },
      usersAttending: ["user4", "user5", "user6"],
      pictures: ["pic4.jpg", "pic5.jpg", "pic6.jpg"],
    },
    {
      name: "Community Cleanup",
      type: "community",
      description: "A community event to clean up the local park.",
      leader: "Bob Johnson",
      startTime: new Date("2022-04-03T13:00:00Z"),
      endTime: new Date("2022-04-03T15:00:00Z"),
      location:{ lat: 34.11228, lng: -117.81489 },
      usersAttending: ["user7", "user8", "user9"],
      pictures: ["pic7.jpg", "pic8.jpg", "pic9.jpg"],
    },
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY; // Ensure this is correctly set in your environment
      const updatedEvents = await Promise.all(
        initialEvents.map(async event => {
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${event.location.lat}&lon=${event.location.lng}&units=metric&appid=${apiKey}`;
          const response = await fetch(weatherUrl);
          const data = await response.json();
          return { 
            ...event, 
            weather: data.weather ? `${data.main.temp}°C, ${data.weather[0].description}` : 'No weather data'
          };
        })
      );
      setEvents(updatedEvents);
    };

    if (user) fetchWeather();
  }, [user]);

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