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
  const [user, setUser] = useState(null);
  const [_userProfile, setUserProfile] = useState(null); // Firestore profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Called after any successful login to sync/create the Firestore profile
  const syncProfile = async (firebaseUser) => {
    if (!firebaseUser) return;
    await upsertUserProfile(firebaseUser.uid, {
      displayName: firebaseUser.displayName || "",
      email: firebaseUser.email || "",
      photoURL: firebaseUser.photoURL || "",
    });
    const profile = await getUserProfile(firebaseUser.uid);
    setUserProfile(profile);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await syncProfile(u);
      else setUserProfile(null);
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
    } catch (e) {
      setError(e.message);
    }
  };

  const signupWithEmail = async (email, password, displayName) => {
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      await syncProfile({ ...cred.user, displayName });
    } catch (e) {
      setError(e.message);
    }
  };

  const updateUserProfile = async (data) => {
    if (!user) return;
    await upsertUserProfile(user.uid, data);
    const updated = await getUserProfile(user.uid);
    setUserProfile(updated);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        _userProfile,
        loading,
        error,
        clearError,
        loginWithGoogle,
        loginWithGithub,
        loginWithEmail,
        signupWithEmail,
        updateUserProfile,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
