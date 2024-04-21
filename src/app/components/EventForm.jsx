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
  };

  const [formData, setFormData] = useState(initialFormData);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(null);

  const generateEventDetails = async (eventType) => {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  
    const prompt = `Generate a 2-4 word event name and a 1-2 sentence description for an outdoor activity related to the category "${eventType}". The description should detail what the event entails and its purpose. Do not enclose the names in quotes. Format it like this: Event Name: Wilderness Hike Description: Hike in etc`;
  
    try {
      const completion = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.6,
      });
      const text = completion.choices[0].text;

        
      const eventNameStart = text.indexOf("Event Name:") + "Event Name:".length;
      const descriptionStart = text.indexOf("Description:") + "Description:".length;
      const rawEventName = text.substring(eventNameStart, text.indexOf("Description:")).trim();
      const rawDescription = text.substring(descriptionStart).trim();

      const eventName1 = rawEventName.replace(/[^a-zA-Z .,'']/g, '');
      const description1 = rawDescription.replace(/[^a-zA-Z .,'']/g, '');

      console.log(eventName1);
      console.log(description1);

      return {
        eventName: eventName1,
        description: description1
      };
    } catch (error) {
      console.error('Error generating event details:', error);
      return {
        eventName: "Default Event Name",
        description: "Default event description detailing what the event entails and its purpose."
      };
    }
  };

  const getRandomDateIn2024 = () => {
    const start = new Date('2024-01-01T00:00:00Z');
    const end = new Date('2024-12-31T23:59:59Z');
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const getRandomStartTimeBefore11 = () => {
    const hour = Math.floor(Math.random() * 11); // 0 to 10
    const minuteOptions = [0, 15, 30, 45];
    const minute = minuteOptions[Math.floor(Math.random() * minuteOptions.length)]; // Choose from 0, 15, 30, 45
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const getItems = async (formData) => {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    const fullPrompt = `Based on the following event details: The event is ${formData.eventName} and its description is ${formData.description}. It is at ${formData.location} and is happening on ${formData.date}. The type of event is ${formData.type}. What are the best items to bring to this event? Please return a numbered list of items, without any explanation about why you chose these items.`;
    // console.log(fullPrompt);
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: fullPrompt,
      max_tokens: 200,
    });
    const newApiResponse = completion.choices[0].text;
    // console.log(newApiResponse);
    return newApiResponse;
  };

  const generateData = async () => {
    const latRange = 0.2;
    const lngRange = 0.4;
    const defaultLat = 34.054934; 
    const defaultLng = -118.242588; 

    // const defaultLat = 34.11228; cl
    // const defaultLat = 33.9030605697786; calt
    // const defaultLng =  -117.71489 cl
    // const defaultLng = -117.70286460460032; cal

    const events = [];
    for (let i = 0; i < 10; i++) {
        const type = faker.helpers.arrayElement([
          "sport",
          "nature",
          "community",
          "sustainability",
          "leadership",
        ]);
        const { eventName, description } = await generateEventDetails(type);

        const eventData = {
            createdAt: getRandomDateIn2024(),
            creatorId: user.uid,
            creatorEmail: user.email,
            description: description,
            endTime: "11:00",
            startTime: getRandomStartTimeBefore11(),
            eventName: eventName,
            leader: user.displayName,
            location: {
              latitude: defaultLat + Math.random() * latRange - latRange / 2,
              longitude: defaultLng + Math.random() * lngRange - lngRange / 2,
            },
            type: type
          }

        const hikeItems = await getItems(formData);

        const allEventData = {
          ...eventData,
          items: hikeItems
        };

        console.log(allEventData);

        events.push(allEventData);
      }
    
    // return events;

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

//   const getItems = async (formData) => {
//     const openai = new OpenAI({
//       apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//       dangerouslyAllowBrowser: true,
//     });
//     const fullPrompt = `Based on the following event details: The event is ${formData.eventName} and its description is ${formData.description}. It is at ${formData.location} and is happening on ${formData.date}. The type of event is ${formData.type}. What are the best items to bring to this event? If you cannot respond within the token limit, please do not cut off mid-sentence.`;
//     console.log(fullPrompt);
//     const completion = await openai.completions.create({
//       model: "gpt-3.5-turbo-instruct",
//       prompt: fullPrompt,
//       max_tokens: 200,
//     });
//     const newApiResponse = completion.choices[0].text;
//     console.log(newApiResponse);
//     return newApiResponse;
//   };

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
      <button className="button" onClick={generateData}>
        Generate data
      </button>
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
