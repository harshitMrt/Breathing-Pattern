// src/services/firestoreService.js
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

/* ═══════════════════════════════════════
   USER PROFILE
═══════════════════════════════════════ */

/**
 * Create or update the user's profile document in Firestore.
 * Called once on first login, and whenever profile info changes.
 */
export const upsertUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    // First time — create with joinedAt
    await setDoc(ref, {
      ...data,
      joinedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    // Already exists — only update what was passed
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }
};

/**
 * Get the user's full profile from Firestore.
 */
export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/* ═══════════════════════════════════════
   CUSTOM LEVELS
═══════════════════════════════════════ */

/**
 * Save a new custom breathing level for a user.
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
 * Get all custom levels for a user, newest first.
 */
export const getUserCustomLevels = async (uid) => {
  const q = query(
    collection(db, "customLevels"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Delete a custom level by Firestore doc ID.
 */
export const deleteCustomLevel = async (levelId) => {
  await deleteDoc(doc(db, "customLevels", levelId));
};

/* ═══════════════════════════════════════
   SESSIONS
═══════════════════════════════════════ */

/**
 * Save a completed breathing session.
 */
export const saveSession = async (uid, data) => {
  await addDoc(collection(db, "sessions"), {
    uid,
    ...data,
    createdAt: serverTimestamp(),
  });
};

/**
 * Get all sessions for a user, newest first.
 */
export const getUserSessions = async (uid) => {
  const q = query(
    collection(db, "sessions"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Delete a session by Firestore doc ID.
 */
export const deleteSession = async (sessionId) => {
  await deleteDoc(doc(db, "sessions", sessionId));
};
