"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { EventCard } from "../components/EventCard";
import React from 'react';

export default function Page() {
  const [user, loading, error] = useAuthState(auth);

  // list of event data
  const events = [
    {
      name: "Football Match",
      type: "sport",
      description: "A friendly football match between local teams.",
      leader: "John Doe",
      startTime: new Date("2022-04-01T10:00:00Z"),
      endTime: new Date("2022-04-01T12:00:00Z"),
      location: "Local Stadium",
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
      location: "Local Nature Reserve",
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
      location: "Local Park",
      usersAttending: ["user7", "user8", "user9"],
      pictures: ["pic7.jpg", "pic8.jpg", "pic9.jpg"],
    },
  ];

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

  if (user) {
    return (
      <div className="mb-14">
        {events.map((event, idx) => (
          // TBD change the key to event id
          <React.Fragment key={idx}>
            <div>
              <EventCard key={idx} event={event} />
            </div>
            {idx !== events.length - 1 && <hr className="py-[1px]" />}
          </React.Fragment>
        ))}
      </div>
    );
  }

}
