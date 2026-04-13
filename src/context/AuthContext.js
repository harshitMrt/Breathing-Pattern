// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged, signInWithPopup,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, updateProfile,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";
import { upsertUserProfile, getUserProfile } from "../services/firestoreService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,        setUser]        = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");

  // Sync / create the Firestore user doc on every login
  const syncProfile = async (firebaseUser) => {
    if (!firebaseUser) return;
    await upsertUserProfile(firebaseUser.uid, {
      displayName:      firebaseUser.displayName  || "",
      // lowercase version enables prefix search in Firestore
      displayNameLower: (firebaseUser.displayName || firebaseUser.email || "").toLowerCase(),
      email:            firebaseUser.email        || "",
      photoURL:         firebaseUser.photoURL     || "",
      isPublic:         true, // default public — user can toggle in Profile page
    });
    const profile = await getUserProfile(firebaseUser.uid);
    setUserProfile(profile);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await syncProfile(u).catch(console.error);
      else setUserProfile(null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const clearError = () => setError("");

  const loginWithGoogle = async () => {
    setError("");
    try {
      const r = await signInWithPopup(auth, googleProvider);
      await syncProfile(r.user);
    } catch (e) { setError(e.message); }
  };

  const loginWithGithub = async () => {
    setError("");
    try {
      const r = await signInWithPopup(auth, githubProvider);
      await syncProfile(r.user);
    } catch (e) { setError(e.message); }
  };

  const loginWithEmail = async (email, password) => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) { setError(e.message); }
  };

  const signupWithEmail = async (email, password, displayName) => {
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      await syncProfile({ ...cred.user, displayName });
    } catch (e) { setError(e.message); }
  };

  const updateUserProfileData = async (data) => {
    if (!user) return;
    await upsertUserProfile(user.uid, {
      ...data,
      // keep lowercase search field in sync
      ...(data.displayName !== undefined
        ? { displayNameLower: data.displayName.toLowerCase() }
        : {}),
    });
    const updated = await getUserProfile(user.uid);
    setUserProfile(updated);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{
      user, userProfile, loading, error, clearError,
      loginWithGoogle, loginWithGithub, loginWithEmail,
      signupWithEmail, updateUserProfileData, logout,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);