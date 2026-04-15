// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";
import {
  upsertUserProfile,
  getUserProfile,
} from "../services/firestoreService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,        setUser]        = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");

  // Called after every successful login — creates/updates the Firestore user doc
  const syncProfile = async (firebaseUser) => {
    if (!firebaseUser) return;
    try {
      await upsertUserProfile(firebaseUser.uid, {
        uid:              firebaseUser.uid,
        displayName:      firebaseUser.displayName  || "",
        // lowercase field powers the prefix search in Firestore
        displayNameLower: (firebaseUser.displayName || firebaseUser.email || "").toLowerCase(),
        email:            firebaseUser.email        || "",
        photoURL:         firebaseUser.photoURL     || "",
        // default public — users can toggle off in Profile page
        isPublic:         true,
      });
      const profile = await getUserProfile(firebaseUser.uid);
      setUserProfile(profile);
    } catch (e) {
      console.error("Failed to sync user profile:", e);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await syncProfile(u);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const clearError = () => setError("");

  const loginWithGoogle = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncProfile(result.user);
    } catch (e) {
      setError(e.message);
    }
  };

  const loginWithGithub = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await syncProfile(result.user);
    } catch (e) {
      setError(e.message);
    }
  };

  const loginWithEmail = async (email, password) => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged fires automatically and calls syncProfile
    } catch (e) {
      setError(e.message);
    }
  };

  const signupWithEmail = async (email, password, displayName) => {
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      // Manually sync because displayName wasn't set when onAuthStateChanged fired
      await syncProfile({ ...cred.user, displayName });
    } catch (e) {
      setError(e.message);
    }
  };

  // Call this from ProfilePage when user edits their profile
  const updateUserProfileData = async (data) => {
    if (!user) return;
    await upsertUserProfile(user.uid, {
      ...data,
      // keep search field in sync whenever displayName changes
      ...(data.displayName !== undefined
        ? { displayNameLower: data.displayName.toLowerCase() }
        : {}),
    });
    const updated = await getUserProfile(user.uid);
    setUserProfile(updated);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        clearError,
        loginWithGoogle,
        loginWithGithub,
        loginWithEmail,
        signupWithEmail,
        updateUserProfileData,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);