// src/services/storageService.js
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";

/**
 * Upload a profile picture.
 * Uses uploadBytes (single-shot) instead of uploadBytesResumable
 * to avoid CORS preflight issues on localhost.
 *
 * @param {string}   uid        — Firebase user ID
 * @param {File}     file       — image File from <input type="file">
 * @param {Function} onProgress — optional (0-100) callback (simulated for UX)
 * @returns {Promise<string>}   — public download URL
 */
export const uploadProfilePic = async (uid, file, onProgress) => {
  // ── Validate ──
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file (JPG, PNG, GIF, WebP).");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be smaller than 5 MB.");
  }

  // Simulate early progress so the UI feels responsive
  onProgress?.(10);

  const ext     = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileRef = ref(storage, `avatars/${uid}/profile.${ext}`);

  onProgress?.(30);

  // uploadBytes — single atomic upload, no resumable session (avoids CORS retry loop)
  const snapshot = await uploadBytes(fileRef, file, {
    contentType: file.type,
    cacheControl: "public, max-age=86400",
  });

  onProgress?.(80);

  const downloadURL = await getDownloadURL(snapshot.ref);

  onProgress?.(100);

  return downloadURL;
};

/**
 * Delete a user's existing profile picture (all common extensions).
 */
export const deleteProfilePic = async (uid) => {
  for (const ext of ["jpg", "jpeg", "png", "gif", "webp"]) {
    try {
      await deleteObject(ref(storage, `avatars/${uid}/profile.${ext}`));
      return; // deleted successfully
    } catch {
      // file didn't exist with this ext — try next
    }
  }
};