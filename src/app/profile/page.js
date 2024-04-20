"use client";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider, firestore } from "../firebase/config";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

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
    const docRef = doc(firestore, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setName(data.name);
      setAge(data.age);
      setEmail(data.email);
    } else {
      console.log("No such document!");
    }
  };

  const updateUserProfile = async () => {
    if (!user) return;
    const userRef = doc(firestore, "users", user.uid);
    try {
      await setDoc(userRef, { name, age, email }, { merge: true });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div>
      <h1>My Profile</h1>
      <text>Name: </text> <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <text>Age: </text> <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
      <text>Email: </text> <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <div>
        <button onClick={updateUserProfile} className="button is-primary">Update Profile</button>
        <button onClick={() => logOut()} className="button is-primary">Sign Out</button>
      </div>
    </div>
  );
}