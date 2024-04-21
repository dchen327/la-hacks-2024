import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; 
import React, { useState } from 'react';
import { faHeart, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { getDistance } from "geolib";

export const EventCard = ({ event }) => {
  // only display first 200 chars of description
  const description =
    event.description.length > 200
      ? event.description.substring(0, 200) + "..."
      : event.description;
  const weather = event.weather;

  const [isRegistered, setIsRegistered] = useState(false);
  // const toggleRegistration = () => {
  //   setIsRegistered(!isRegistered);
  // };

  const toggleRegistration = async (eventId, userId) => {
    const eventRef = doc(db, "events", eventId);

    if (isRegistered) {
      // If the user is currently registered, remove them from the registered list
      await updateDoc(eventRef, {
        isRegistered: arrayRemove(user.Id)
      });
    } else {
      await updateDoc(eventRef, {
        isRegistered: arrayUnion(user.Id)
      });
    }

    // Toggle the local state to reflect the change
    setIsRegistered(!isRegistered);
  };


  const claremont = { latitude: 34.11228, longitude: -117.71489 };
  let distance = getDistance(claremont, event.location);
  // convert distance (in meters) to miles, with 1 decimal point
  distance = Math.round((distance / 1609.344) * 10) / 10;

  const createdAt = event.createdAt.toDate();
  const createdDate = createdAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="card is-shadowless">
      <div className="card-content px-4 py-2">
        <div className="media mb-2 flex items-center">
          <div className="media-content">
            <p className="title is-4 mb-2">{event.eventName}</p>
            <div className="flex flex-row mb-0">
              <p className="is-6">{event.leader}</p>
              <p className="is-6 font-thin">•</p>
              <p className="is-6">{createdDate}</p>
            </div>
          </div>
          <div className="bg-gray-100 rounded">
            <p className="p-1 text-lg text-black is-4">{distance}mi</p>
          </div>
        </div>
        <div className="content">{description}</div>
          <div className="content">{weather}</div>
        <div className="buttons are-small mt-2">
          <button className={`button ${isRegistered ? 'is-success' : 'is-info'}`} onClick={toggleRegistration}>
              {isRegistered ? 'Registered' : 'Register'}
            </button>
          <button className="button is-light">
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <button className="button is-light">
            <FontAwesomeIcon icon={faShareNodes} />
          </button>
        </div>
      </div>
    </div>
  );
};
