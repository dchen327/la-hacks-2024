"use client";

import { auth, googleProvider } from "../firebase/config";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faShop, faUser } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";

export const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      console.log("signed out");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <nav
        className="navbar is-fixed-top is-hidden-touch flex justify-center items-center"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-menu is-active ">
          <div className="navbar-start">
            <Link href="/" className="navbar-item has-text-centered">
              <p className="text-lg">Market</p>
            </Link>
            <Link href="/listings" className="navbar-item has-text-centered">
              <p className="text-lg">Listings</p>
            </Link>
            <Link href="/insearchof" className="navbar-item has-text-centered">
              <p className="text-lg">ISO</p>
            </Link>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              {user ? (
                <Link
                  href="/profile"
                  className="navbar-item is-block has-text-centered"
                >
                  <FontAwesomeIcon
                    icon={faCircleUser}
                    size="lg"
                    className="text-black"
                  />
                </Link>
              ) : (
                <button
                  className="button is-primary"
                  onClick={signInWithGoogle}
                >
                  <strong>Sign In</strong>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <nav
        className="navbar is-fixed-bottom is-hidden-desktop"
        role="navigation"
      >
        <hr className="my-1" />
        <div className="navbar-brand">
          <Link
            href="/"
            className="navbar-item is-expanded is-block has-text-centered"
          >
            <FontAwesomeIcon icon={faShop} />
            <p className="is-size-7">Market</p>
          </Link>
          <Link
            href="/listings"
            className="navbar-item is-expanded is-block has-text-centered"
          >
            <FontAwesomeIcon icon={faList} />
            <p className="is-size-7">Listings</p>
          </Link>
          <Link
            href="/insearchof"
            className="navbar-item is-expanded is-block has-text-centered"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <p className="is-size-7">ISO</p>
          </Link>
          <Link
            href="/profile"
            className="navbar-item is-expanded is-block has-text-centered"
          >
            <FontAwesomeIcon icon={faUser} />
            <p className="is-size-7">Profile</p>
          </Link>
        </div>
      </nav>
    </>
  );
};
