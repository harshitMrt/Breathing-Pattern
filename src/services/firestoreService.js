// src/services/firestoreService.js
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, setDoc, getDoc, updateDoc,
  query, where, orderBy, serverTimestamp,
  limit
} from "firebase/firestore";
import { db } from "../firebase";

/* ═══════════════════════════════════════
   USER PROFILE  (public + private data)
═══════════════════════════════════════ */

/**
 * Create or update a user's profile.
 * Called automatically on every login.
 */
export const upsertUserProfile = async (uid, data) => {
  await setDoc(
    doc(db, "users", uid),
    { ...data, uid, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * Update specific profile fields (bio, location, goal, etc.)
 */
export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Search users by displayName prefix (case-insensitive via lowercase field).
 * Stores displayNameLower automatically on upsert.
 */
export const searchUsersByName = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim().length < 2) return [];
  const term  = searchTerm.toLowerCase().trim();
  const termEnd = term + "\uf8ff"; // Firestore range trick for prefix search

  const q = query(
    collection(db, "users"),
    where("displayNameLower", ">=", term),
    where("displayNameLower", "<=", termEnd),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/**
 * Get all public users (for discover / leaderboard).
 */
export const getPublicUsers = async (limitCount = 20) => {
  const q = query(
    collection(db, "users"),
    where("isPublic", "==", true),
    orderBy("totalSessions", "desc"),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/* ═══════════════════════════════════════
   BADGES
═══════════════════════════════════════ */

/**
 * Save the full badges array for a user.
 * badges = [{ id, name, icon, unlockedAt }]
 */
export const saveUserBadges = async (uid, badges) => {
  await updateDoc(doc(db, "users", uid), {
    badges,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Get badges for any user (public read).
 */
export const getUserBadges = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data().badges ?? []) : [];
};

/**
 * Update aggregate stats on the user doc so leaderboard/search works.
 * Called after every session.
 */
export const updateUserStats = async (uid, { totalSessions, totalMinutes, currentStreak, longestStreak }) => {
  await updateDoc(doc(db, "users", uid), {
    totalSessions,
    totalMinutes,
    currentStreak,
    longestStreak,
    updatedAt: serverTimestamp(),
  });
};

/* ═══════════════════════════════════════
   SESSIONS
═══════════════════════════════════════ */

export const saveSession = async (uid, data) => {
  await addDoc(collection(db, "sessions"), {
    uid,
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getUserSessions = async (uid) => {
  const q = query(
    collection(db, "sessions"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const deleteSession = async (sessionId) => {
  await deleteDoc(doc(db, "sessions", sessionId));
};

/* ═══════════════════════════════════════
   CUSTOM LEVELS
═══════════════════════════════════════ */

export const saveCustomLevel = async (uid, levelData) => {
  const ref = await addDoc(collection(db, "customLevels"), {
    uid,
    ...levelData,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getUserCustomLevels = async (uid) => {
  const q = query(
    collection(db, "customLevels"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateCustomLevel = async (levelId, data) => {
  await updateDoc(doc(db, "customLevels", levelId), data);
};

export const deleteCustomLevel = async (levelId) => {
  await deleteDoc(doc(db, "customLevels", levelId));
};