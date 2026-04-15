// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Your real Firebase config is already here
const firebaseConfig = {
  apiKey: "AIzaSyAM1_Z0JybaEuzIaif54R-Snmjx9Yz5pvU",
  authDomain: "breathing-pattern.firebaseapp.com",
  projectId: "breathing-pattern",
  storageBucket: "breathing-pattern.firebasestorage.app",
  messagingSenderId: "964465825179",
  appId: "1:964465825179:web:3055c27058c0ca57cb3d3e",
};



const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage       = getStorage(app);
export const githubProvider = new GithubAuthProvider();
