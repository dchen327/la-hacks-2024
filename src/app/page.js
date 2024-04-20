"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useMap } from "@vis.gl/react-google-maps";
import { EventMapModal } from "./components/EventMapModal";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const eventEmojis = {
  sport: "⚽",
  nature: "🌳",
  community: "🏘️",
  leadership: "👑",
  sustainability: "♻️",
};

const Markers = ({ events, setClickedEvent, setShowEventMapModal }) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  const handleMarkerClick = (event) => {
    map.setZoom(14);
    map.panTo(event.location);
    setClickedEvent(event);

    const listener = map.addListener("idle", () => {
      setShowEventMapModal(true);
      google.maps.event.removeListener(listener);
    });
  };

  return (
    <>
      {events.map((event) => (
        <AdvancedMarker
          position={event.location}
          key={event.key}
          ref={(marker) => setMarkerRef(marker, event.key)}
          onClick={() => handleMarkerClick(event)}
        >
          <span className="text-2xl">{eventEmojis[event.type]}</span>
        </AdvancedMarker>
      ))}
    </>
  );
};

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const [showEventMapModal, setShowEventMapModal] = useState(false);
  const [clickedEvent, setClickedEvent] = useState({});
  const [searchValue, setSearchValue] = useState(null);

  const events = [
    {
      name: "Football Match",
      type: "sport",
      description: "A friendly football match between local teams.",
      leader: "John Doe",
      startTime: new Date("2022-04-01T10:00:00Z"),
      endTime: new Date("2022-04-01T12:00:00Z"),
      location: { lat: 34.11228, lng: -117.71489 },
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
      location: { lat: 34.21228, lng: -117.71489 },
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
      location: { lat: 34.11228, lng: -117.81489 },
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
      <div>
        <div className="title mx-2 mt-2 mb-0">
          Hello {user.displayName.split(" ")[0]}
        </div>
        <div>
          <h1 className="subtitle mt-1 mx-2 mt-2 mb-0">Search </h1>
          <GooglePlacesAutocomplete
            selectProps={(searchValue, setSearchValue)}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          />
        </div>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <Map
            style={{ width: "100vw", height: "100vh" }}
            mapId={"bf51a910020fa25a"}
            defaultCenter={{ lat: 34.11228, lng: -117.71489 }}
            defaultZoom={11}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          >
            <Markers
              events={events}
              setClickedEvent={setClickedEvent}
              setShowEventMapModal={setShowEventMapModal}
            />
          </Map>
        </APIProvider>
        {showEventMapModal && (
          <EventMapModal
            event={clickedEvent}
            onClose={() => setShowEventMapModal(false)}
          />
        )}
      </div>
    );
  }

}
