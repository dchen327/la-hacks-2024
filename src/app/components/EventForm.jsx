import React, { useState } from "react";
import { addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const EventForm = ({ user }) => {

  const initialFormData = {
    eventName: '',
    eventType: 'sport', // default to 'sport'
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        createdAt: new Date()
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
          <label className="label">Event Name:
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
          <label className="label">Type:
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
          <label className="label">Description:
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
          <label className="label">Date:
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
          <label className="label">Start Time:
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
          <label className="label">End Time:
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
          <label className="label">Location:
          <div className="control">
            <input
              className="input"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Placeholder for location"
            />
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
  );
};

export default EventForm;
