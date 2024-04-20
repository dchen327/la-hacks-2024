"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen mx-10">
        <progress
          className="progress is-small is-primary max-w-[500px]"
          max="100"
        ></progress>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (user) {
    return (
      <div>
        <div className="title">Hello {user.displayName.split(" ")[0]}</div>
      </div>
    );
  }
}
