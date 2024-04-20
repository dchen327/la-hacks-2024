"use client";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ChatBot from "../components/ChatBot.js";

export default function Page() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const logOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <div>
      <button onClick={() => logOut()} className="button is-primary">
        Sign Out
      </button>

      <ChatBot />
    </div>
  );
  
}
