// src/services/firestoreService.js
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// ─────────────────────────────────────────
// USER PROFILE
// ─────────────────────────────────────────

export const upsertUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  await setDoc(
    ref,
    { ...data, uid, updatedAt: serverTimestamp() },
    { merge: true },
  );
};

export const getUserProfile = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// ─────────────────────────────────────────
// SESSIONS  — field name: uid  (not userId)
// ─────────────────────────────────────────

export const saveSession = async (uid, sessionData) => {
  const docRef = await addDoc(collection(db, "sessions"), {
    uid, // ← consistent field name
    ...sessionData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserSessions = async (uid) => {
  const q = query(
    collection(db, "sessions"),
    where("uid", "==", uid), // ← matches the saved field
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteSession = async (sessionId) => {
  await deleteDoc(doc(db, "sessions", sessionId));
};

// ─────────────────────────────────────────
// CUSTOM LEVELS  — field name: uid  (not userId)
// ─────────────────────────────────────────

export const saveCustomLevel = async (uid, levelData) => {
  const docRef = await addDoc(collection(db, "customLevels"), {
    uid, // ← consistent field name
    ...levelData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserCustomLevels = async (uid) => {
  const q = query(
    collection(db, "customLevels"),
    where("uid", "==", uid), // ← matches the saved field
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteCustomLevel = async (levelId) => {
  await deleteDoc(doc(db, "customLevels", levelId));
};
