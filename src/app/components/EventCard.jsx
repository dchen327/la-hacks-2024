import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase/config";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { faHeart, faShareNodes } from "@fortawesome/free-solid-svg-icons";

export const EventCard = ({ event, user, refreshKey, setRefreshKey }) => {
  // only display first 200 chars of description
  const description =
    event.description.length > 200
      ? event.description.substring(0, 200) + "..."
      : event.description;
  const weather = event.weather;
  const router = useRouter();

  const [isRegistered, setIsRegistered] = useState(
    event.isRegistered ? event.isRegistered.includes(user.uid) : false
  );

  const LikeButton = () => {
    const [liked, setLiked] = useState(false);
  
    const toggleLike = () => {
      setLiked(!liked); // Toggle liked state
    };
  
    return (
      <button className={`button is-light ${liked ? 'is-danger' : ''}`} onClick={toggleLike}>
        <FontAwesomeIcon icon={faHeart} color={liked ? 'red' : 'black'} />
      </button>
    );
  };

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const Modal = ({ show, onClose, event }) => {
    if (!show) {
      return null;
    }

    return (
      <div className="modal is-active">
        <div className="modal-background" onClick={onClose}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Event Invitation</p>
            <button className="delete" aria-label="close" onClick={onClose}></button>
          </header>
          <section className="modal-card-body">
            <p>Please join me at <strong>{event.eventName}</strong>!</p>
            <p>Time: {new Date(event.createdAt).toLocaleString()}</p>
            <p>Don't forget to bring: {event.items}</p>
          </section>
          <footer className="modal-card-foot">
            <button className="button" onClick={onClose}>Close</button>
          </footer>
        </div>
      </div>
    );
  };

  const toggleRegistration = async () => {
    const eventRef = doc(db, "events", event.id);

    try {
      if (isRegistered) {
        await updateDoc(eventRef, {
          isRegistered: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(eventRef, {
          isRegistered: arrayUnion(user.uid),
        });
      }
      setIsRegistered(!isRegistered); // Toggle the local state
      console.log("refresh");
      setRefreshKey(refreshKey + 1); // Trigger a refresh of the events
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
            <LikeButton />
            <button className="button is-light" onClick={toggleModal}>
              <FontAwesomeIcon icon={faShareNodes} />
            </button>
          </div>
        </div>
        <Modal show={showModal} onClose={toggleModal} event={event} />
      </div>
    );
};
