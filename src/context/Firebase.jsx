import { createContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAdFW5nc-e8yhQWk6vP8XxYU9pHrc476i4",
  authDomain: "breathing-react-app.firebaseapp.com",
  projectId: "breathing-react-app",
  storageBucket: "breathing-react-app.firebasestorage.app",
  messagingSenderId: "860918869652",
  appId: "1:860918869652:web:8573df6cd753b6f2128e81",
  measurementId: "G-8JNE150JKW",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

const FirebaseContext = createContext(null);

export const FirebaseProvider = (props) => {
  const signUpUserWithEmailAndPassword = (email, password) => {
    return createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed up:", user);
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing up:", errorCode, errorMessage);
      });
  };

  return (
    <FirebaseContext.Provider value={signUpUserWithEmailAndPassword}>
      {props.children}
    </FirebaseContext.Provider>
  );
};
