import React, { useState } from "react";
import { addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";
import { useMap } from "@vis.gl/react-google-maps";

const MapComponent = ({ handleMapClick }) => {
  const map = useMap();
  const [pickedLoc, setPickedLoc] = useState(null);

  // Rest of your code that uses the map variable...

  return (
    <Map
      style={{ width: "100vw", height: "100vh" }}
      mapId={"bf51a910020fa25a"}
      defaultCenter={{ lat: 34.11228, lng: -117.71489 }}
      defaultZoom={11}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      onClick={handleMapClick}
    ></Map>
  );
};

const EventForm = ({ user }) => {
  const initialFormData = {
    eventName: "",
    eventType: "sport", // default to 'sport'
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(null);

  const handleMapClick = (event) => {
    setPickedLocation({
      lat: event.detail.latLng.lat,
      lng: event.detail.latLng.lng,
    });
    setShowLocationPicker(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const eventData = {
      ...formData,
      creatorId: user.uid,
      creatorEmail: user.email,
      createdAt: new Date(),
    };

    const eventRef = doc(db, "events", "test");
    try {
      await setDoc(eventRef, eventData);
      setIsSubmitted(true);
      console.log("Document written with ID: ", eventRef.id);
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error adding event: ", error);
      setErrorMessage("Failed to submit event: " + error.message); // Sets an error message
      setIsSubmitted(false); // Updates the isSubmitted state to false
    }
  };

  return (
    <>
      <div className="container">
        {isSubmitted && (
          <div className="notification is-success">
            <button
              className="delete"
              onClick={() => setIsSubmitted(false)}
            ></button>
            Event successfully submitted!
          </div>
        )}
        {errorMessage && (
          <div className="notification is-danger">
            <button
              className="delete"
              onClick={() => setErrorMessage("")}
            ></button>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">
              Event Name:
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                />
              </div>
            </label>
          </div>

          <div className="field">
            <label className="label">
              Type:
              <div className="control">
                <div className="select">
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                  >
                    <option value="sport">Sport</option>
                    <option value="nature">Nature</option>
                    <option value="community">Community</option>
                    <option value="sustainability">Sustainability</option>
                    <option value="Leadership">Sustainability</option>
                  </select>
                </div>
              </div>
            </label>
          </div>

          <div className="field">
            <label className="label">
              Description:
              <div className="control">
                <textarea
                  className="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </label>
          </div>

          <div className="field">
            <label className="label">
              Date:
              <div className="control">
                <input
                  className="input"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </label>
          </div>

          <div className="field">
            <label className="label">
              Start Time:
              <div className="control">
                <input
                  className="input"
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </div>
            </label>
          </div>

          <div className="field">
            <label className="label">
              End Time:
              <div className="control">
                <input
                  className="input"
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>
            </label>
          </div>

          <div className="field">
            <label className="label">
              Location:
              <div className="control">
                {pickedLocation && (
                  <div className="notification">
                    <button
                      className="delete"
                      onClick={() => setPickedLocation(null)}
                    ></button>
                    Location picked: {pickedLocation.lat}, {pickedLocation.lng}
                  </div>
                )}
                <button
                  className="button"
                  onClick={() => setShowLocationPicker(true)}
                >
                  Pick Location
                </button>
              </div>
            </label>
          </div>

          <div className="field">
            <div className="control">
              <button type="submit" className="button is-link">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      {showLocationPicker && (
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-content">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <MapComponent handleMapClick={handleMapClick} />
            </APIProvider>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={() => setShowLocationPicker(false)}
          ></button>
        </div>
      )}
    </>
  );
};

export default EventForm;
