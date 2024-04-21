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
      console.log("found events");
      console.log(events.length);
      setEvents(eventList);
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

  if (user) {
    return (
      <>
        <div className="title mx-2 mt-2 mb-2">Upcoming Events</div>
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
      </>
    );
  }
}
