import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; 
import { db } from "../firebase/config";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import {
  faHeart,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";

export const EventCard = ({ event, user }) => {
  // only display first 200 chars of description
  const description =
    event.description.length > 200
      ? event.description.substring(0, 200) + "..."
      : event.description;
  const weather = event.weather;
  const router = useRouter();

  const [isRegistered, setIsRegistered] = useState(event.isRegistered ? event.isRegistered.includes(user.uid) : false);

  const toggleRegistration = async () => {
    const eventRef = doc(db, "events", event.id);

    try {
      if (isRegistered) {
        await updateDoc(eventRef, {
          isRegistered: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(eventRef, {
          isRegistered: arrayUnion(user.uid)
        });
      }
      setIsRegistered(!isRegistered);  // Toggle the local state
      router.reload()
    } catch (error) {
      console.error("Error updating registration status:", error);
    }
  };



    return (
      <div className="card is-shadowless">
        <div className="card-content px-4 py-2">
          <div className="media mb-2 flex items-center">
            <div className="media-content">
              <p className="title is-4 mb-2">{event.name}</p>
              <div className="flex flex-row mb-0">
                <p className="is-6">{event.leader}</p>
                <p className="is-6 font-thin">•</p>
                <p className="is-6">Wed</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded">
              <p className="p-1 text-lg text-black is-4">1.3mi</p>
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
