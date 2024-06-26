import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";
import { useMap } from "@vis.gl/react-google-maps";
import { faker } from "@faker-js/faker";
import OpenAI from "openai";

const MapComponent = ({ handleMapClick }) => {
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
    type: "sport",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    // isRegistered: [user.uid],
  };

  const [formData, setFormData] = useState(initialFormData);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(null);

  const generateData = () => {
    const latRange = 0.4;
    const lngRange = 1;
    // const defaultLat = 34.11228;
    const defaultLat = 33.9030605697786;
    // const defaultLng =  -117.71489
    const defaultLng = -117.70286460460032;

    const events = [];
    for (let i = 0; i < 50; i++) {
      events.push({
        createdAt: new Date(),
        creatorId: user.uid,
        creatorEmail: user.email,
        description: faker.lorem.paragraph(),
        endTime: "3:00",
        startTime: "12:00",
        eventName: faker.lorem.words(),
        leader: user.displayName,
        location: {
          latitude: defaultLat + Math.random() * latRange - latRange / 2,
          longitude: defaultLng + Math.random() * lngRange - lngRange / 2,
        },
        type: faker.helpers.arrayElement([
          "sport",
          "nature",
          "community",
          "sustainability",
          "leadership",
        ]),
      });
    }
    console.log(events);

    // push to db
    events.forEach(async (event) => {
      try {
        const docRef = await addDoc(collection(db, "events"), event);
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding event: ", error);
      }
    });
  };

  const handleMapClick = (event) => {
    setPickedLocation({
      lat: event.detail.latLng.lat,
      lng: event.detail.latLng.lng,
    });
    // set form data with firebase LatLng object
    setFormData((prevState) => ({
      ...prevState,
      location: {
        latitude: event.detail.latLng.lat,
        longitude: event.detail.latLng.lng,
      },
    }));
    setShowLocationPicker(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getItems = async (formData) => {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    const fullPrompt = `Based on the following event details: The event is ${formData.eventName} and its description is ${formData.description}. It is at ${formData.location} and is happening on ${formData.date}. The type of event is ${formData.type}. What are the best items to bring to this event? Please return a list of items, without any explanation about why you chose these items.`;
    console.log(fullPrompt);
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: fullPrompt,
      max_tokens: 200,
    });
    const newApiResponse = completion.choices[0].text;
    console.log(newApiResponse);
    return newApiResponse;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const hikeItems = await getItems(formData);

    const eventData = {
      ...formData,
      creatorId: user.uid,
      creatorEmail: user.email,
      leader: user.displayName,
      createdAt: new Date(),
      items: hikeItems,
    };

    try {
      const docRef = await addDoc(collection(db, "events"), eventData);
      setIsSubmitted(true);
      console.log("Document written with ID: ", docRef.id);
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
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="sport">Sport</option>
                    <option value="nature">Nature</option>
                    <option value="community">Community</option>
                    <option value="sustainability">Sustainability</option>
                    <option value="leadership">Leadership</option>
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
                  className="textarea font-normal"
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
                  type="button"
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
      {/* <button className="button" onClick={generateData}>
        Generate data
      </button> */}
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
