// src/services/firestoreService.js
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

/* ─── Sessions ─── */

/**
 * Save a completed breathing session.
 * @param {string} uid
 * @param {{ levelName: string, inn: number, hold: number, out: number, hold2: number, durationMinutes: number, cycles: number }} data
 */
export const saveSession = async (uid, data) => {
  await addDoc(collection(db, "sessions"), {
    uid,
    ...data,
    createdAt: serverTimestamp(),
  });
};

/**
 * Fetch all sessions for a user, newest first.
 * @param {string} uid
 * @returns {Promise<Array>}
 */
export const getUserSessions = async (uid) => {
  const q = query(
    collection(db, "sessions"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Delete a session by its Firestore doc ID.
 */
export const deleteSession = async (sessionId) => {
  await deleteDoc(doc(db, "sessions", sessionId));
};

/* ─── Custom Levels ─── */

/**
 * Save a custom breathing level.
 * @param {string} uid
 * @param {{ name: string, inn: number, hold: number, out: number, hold2: number, note?: string }} levelData
 */
export const saveCustomLevel = async (uid, levelData) => {
  const ref = await addDoc(collection(db, "customLevels"), {
    uid,
    ...levelData,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

/**
 * Fetch all custom levels for a user.
 */
export const getUserCustomLevels = async (uid) => {
  const q = query(
    collection(db, "customLevels"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Update a custom level.
 */
export const updateCustomLevel = async (levelId, data) => {
  await updateDoc(doc(db, "customLevels", levelId), data);
};

/**
 * Delete a custom level.
 */
export const deleteCustomLevel = async (levelId) => {
  await deleteDoc(doc(db, "customLevels", levelId));
};
