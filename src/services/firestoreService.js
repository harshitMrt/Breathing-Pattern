// src/services/firestoreService.js
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, setDoc, getDoc, updateDoc,
  query, where, orderBy, serverTimestamp, limit,
} from "firebase/firestore";
import { db } from "../firebase";

/* ═══════════════════════════════════════
   USER PROFILE
═══════════════════════════════════════ */

/**
 * Create or merge a user profile document.
 * Uses { merge: true } so existing fields (bio, goal, etc.) are NOT overwritten.
 */
export const upsertUserProfile = async (uid, data) => {
  await setDoc(
    doc(db, "users", uid),
    { ...data, uid, updatedAt: serverTimestamp() },
    { merge: true }   // ← safe: won't wipe bio/goal on re-login
  );
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/* ─── Search users by display name prefix ─── */
/**
 * Prefix search on the `displayNameLower` field.
 * Requires a Firestore index on `displayNameLower` (single-field, ascending).
 * Firestore creates this automatically on first run and shows a console link.
 */
export const searchUsersByName = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim().length < 2) return [];
  const term    = searchTerm.toLowerCase().trim();
  const termEnd = term + "\uf8ff";
  const q = query(
    collection(db, "users"),
    where("displayNameLower", ">=", term),
    where("displayNameLower", "<=", termEnd),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/* ─── Public users for leaderboard / discover ─── */
/**
 * Returns all users who have isPublic === true, sorted by totalSessions.
 * Requires composite index: isPublic ASC + totalSessions DESC
 */
export const getPublicUsers = async (limitCount = 30) => {
  try {
    const q = query(
      collection(db, "users"),
      where("isPublic", "==", true),
      orderBy("totalSessions", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    // Index may not exist yet — fall back to a simple fetch without ordering
    console.warn("getPublicUsers index missing, falling back:", e.message);
    const q2   = query(collection(db, "users"), where("isPublic", "==", true), limit(limitCount));
    const snap = await getDocs(q2);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
};

/**
 * Fetch ALL registered users (used when isPublic filter doesn't work yet).
 * Only used as emergency fallback in SearchPage.
 */
export const getAllUsers = async (limitCount = 50) => {
  const q    = query(collection(db, "users"), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/* ═══════════════════════════════════════
   BADGES
═══════════════════════════════════════ */

export const saveUserBadges = async (uid, badges) => {
  await updateDoc(doc(db, "users", uid), {
    badges,
    updatedAt: serverTimestamp(),
  });
};

export const getUserBadges = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data().badges ?? []) : [];
};

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