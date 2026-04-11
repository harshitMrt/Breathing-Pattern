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
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const getUserProfile = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// ─────────────────────────────────────────
// SESSIONS
// ─────────────────────────────────────────

export const saveSession = async (uid, sessionData) => {
  const ref = collection(db, "sessions");
  const docRef = await addDoc(ref, {
    userId: uid,
    ...sessionData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserSessions = async (uid) => {
  const ref = collection(db, "sessions");
  const q = query(
    ref,
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteSession = async (sessionId) => {
  await deleteDoc(doc(db, "sessions", sessionId));
};

// ─────────────────────────────────────────
// CUSTOM LEVELS
// ─────────────────────────────────────────

export const saveCustomLevel = async (uid, levelData) => {
  const ref = collection(db, "customLevels");
  const docRef = await addDoc(ref, {
    userId: uid,
    ...levelData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserCustomLevels = async (uid) => {
  const ref = collection(db, "customLevels");
  const q = query(
    ref,
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteCustomLevel = async (levelId) => {
  await deleteDoc(doc(db, "customLevels", levelId));
};
