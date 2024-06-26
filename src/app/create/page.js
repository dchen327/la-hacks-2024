"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import EventForm from "../components/EventForm";

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

  return (
    <>
      <div className="title mx-2 mt-2 mb-2">Create Event</div>
      <div className="mb-14 mx-3">
        <EventForm user={user} />
      </div>
    </>
  );
}
