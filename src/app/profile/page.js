"use client";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ChatBot from "../components/ChatBot.js";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from "../firebase/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'

import {
  faEnvelope,
  faGlobe,
  faCar
} from "@fortawesome/free-solid-svg-icons";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [isDriver, setIsDriver] = useState(false);
  const [seatLimit, setSeatLimit] = useState(0);
  const [distanceLimit, setDistanceLimit] = useState(0);
  const router = useRouter();

  const [isUpdated, setIsUpdated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDriverChange = (event) => {
    setIsDriver(event.target.value === 'yes');
  };

  const radardata = [
    {
      data: {
        sports: 0.6,
        nature: 0.8,
        community: 0.9,
        co2: 0.7,
        lead: 0.3,
      },
      meta: { color: 'green' }
    }
  ];
  
  const captions = {
    // Captions and axis properties correspond to the data keys
    sports: 'Sports',
    nature: 'Nature',
    community: 'Community',
    co2: 'CO2 Saved',
    lead: 'Lead Events',
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadUserProfile(currentUser.uid);
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();  // Cleanup on unmount
  }, [router]);

  const loadUserProfile = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setName(data.name);
      setAge(data.age);
      setEmail(data.email);
      setCountry(data.country);
      setState(data.state);
      setIsDriver(data.isDriver);
      setSeatLimit(data.seatLimit);
      setDistanceLimit(data.distanceLimit)
    } else {
      console.log("No such document!");
    }
  };

  const updateUserProfile = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    try {
      await setDoc(userRef, { name, age, email, country, state, isDriver, seatLimit, distanceLimit }, { merge: true });
      setIsUpdated(true);
    } catch (error) {
      console.error("Error updating profile: ", error);
      setErrorMessage(error.message); 
      setIsUpdated(false);
    }
  };
  
  return (
    <div className="container">
      {isUpdated && (
        <div className="notification is-success">
          <button
            className="delete"
            onClick={() => setIsUpdated(false)}
          ></button>
          Profile successfully updated!
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

    <h1 className="title">My Profile</h1>
    
    <div className="field">
      <label className="label">Name</label>
      <div className="control">
        <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
      </div>
    </div>

    <div className="field">
      <label className="label">Age</label>
      <div className="control">
        <input className="input" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter your age" />
      </div>
    </div>

    <div className="field">
      <label className="label">Country</label>
      <p class="control has-icons-left">
        <span class="select">
          <select onChange={(e) => setCountry(e.target.value)} value={country}>
            <option selected>Country</option>
            <option>United States</option>
            <option>Other</option>
          </select>
        </span>
        <span className="icon is-small is-left">
          <FontAwesomeIcon icon={faGlobe} />
        </span>
      </p>
    </div>

    <div className="field">
      <label className="label">State</label>
      <div className="control">
        <div className="select">
          <select onChange={(e) => setState(e.target.value)} value={state}>
            <option>Select a state</option> {/* Removed the 'selected' attribute for accessibility */}
            <option>Alabama</option>
            <option>Alaska</option>
            <option>Arizona</option>
            <option>Arkansas</option>
            <option>California</option>
            <option>Colorado</option>
            <option>Connecticut</option>
            <option>Delaware</option>
            <option>Florida</option>
            <option>Georgia</option>
            <option>Hawaii</option>
            <option>Idaho</option>
            <option>Illinois</option>
            <option>Indiana</option>
            <option>Iowa</option>
            <option>Kansas</option>
            <option>Kentucky</option>
            <option>Louisiana</option>
            <option>Maine</option>
            <option>Maryland</option>
            <option>Massachusetts</option>
            <option>Michigan</option>
            <option>Minnesota</option>
            <option>Mississippi</option>
            <option>Missouri</option>
            <option>Montana</option>
            <option>Nebraska</option>
            <option>Nevada</option>
            <option>New Hampshire</option>
            <option>New Jersey</option>
            <option>New Mexico</option>
            <option>New York</option>
            <option>North Carolina</option>
            <option>North Dakota</option>
            <option>Ohio</option>
            <option>Oklahoma</option>
            <option>Oregon</option>
            <option>Pennsylvania</option>
            <option>Rhode Island</option>
            <option>South Carolina</option>
            <option>South Dakota</option>
            <option>Tennessee</option>
            <option>Texas</option>
            <option>Utah</option>
            <option>Vermont</option>
            <option>Virginia</option>
            <option>Washington</option>
            <option>West Virginia</option>
            <option>Wisconsin</option>
            <option>Wyoming</option>
            <option>Other</option>
          </select>
        </div>
      </div>
    </div>

    <div className="field">
      <label className="label">Email</label>
      <div className="control has-icons-left has-icons-right">
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
        <span className="icon is-left">
          <FontAwesomeIcon icon={faEnvelope} />
        </span>
        <span className="icon is-right">
          <FontAwesomeIcon icon={faEnvelope} />
        </span>
      </div>
    </div>

    <div className="field">
      <label className="label">Are you a driver?</label>
        <div className="control">
            <label className="radio">
                <input 
                    type="radio" 
                    name="driver" 
                    value="yes" 
                    onChange={handleDriverChange}
                    checked={isDriver === true} /> Yes
            </label>
            <label className="radio">
                <input 
                    type="radio" 
                    name="driver" 
                    value="no" 
                    onChange={handleDriverChange}
                    checked={isDriver === false} /> No
            </label>
        </div>
    </div>

    {isDriver && (
        <>
            <div className="field">
                <label className="label">Seat Limit</label>
                <div className="control">
                    <input 
                        className="input" 
                        type="number" 
                        value={seatLimit} 
                        onChange={(e) => setSeatLimit(e.target.value)} 
                        placeholder="Enter seat limit" />
                </div>
            </div>
            <div className="field">
                <label className="label">Distance Limit (miles)</label>
                <div className="control">
                    <input 
                        className="input" 
                        type="number" 
                        value={distanceLimit} 
                        onChange={(e) => setDistanceLimit(e.target.value)} 
                        placeholder="Enter distance limit" />
                </div>
            </div>
        </>
    )}

    <h1 className="title">About Me</h1>
    <div>
        <RadarChart
          captions={captions}
          data={radardata}
          size={450}
        />
      </div>
    
    <h1 className="title">Questions?</h1>
    <div><ChatBot /></div>
    <div className="field is-grouped mb-20">

        <div className="control">
          <button className="button is-primary" onClick={updateUserProfile}>Update Profile</button>
        </div>
        <div className="control">
          <button className="button is-light" onClick={() => logOut()}>Sign Out</button>
        </div>
    </div>
  </div>

  );
  
}