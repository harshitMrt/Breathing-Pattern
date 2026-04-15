// src/components/AvatarUpload.jsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadProfilePic } from "../services/storageService";
import { updateProfile }    from "firebase/auth";
import { auth }             from "../firebase";
import { upsertUserProfile } from "../services/firestoreService";

/**
 * Props:
 *   uid          — user's Firebase UID
 *   currentURL   — current photoURL (string or null)
 *   displayName  — shown as fallback initials
 *   onSuccess    — (newURL: string) => void  — called after upload finishes
 */
export default function AvatarUpload({ uid, currentURL, displayName, onSuccess }) {
  const [preview,    setPreview]    = useState(currentURL || null);
  const [uploading,  setUploading]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [error,      setError]      = useState("");
  const [dragOver,   setDragOver]   = useState(false);
  const [success,    setSuccess]    = useState(false);
  const inputRef = useRef(null);

  const initials = (displayName || "?").slice(0, 2).toUpperCase();

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setSuccess(false);

    // Show local preview immediately
    const localURL = URL.createObjectURL(file);
    setPreview(localURL);
    setUploading(true);
    setProgress(0);

    try {
      const downloadURL = await uploadProfilePic(uid, file, setProgress);

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { photoURL: downloadURL });

      // Update Firestore user doc
      await upsertUserProfile(uid, { photoURL: downloadURL });

      setPreview(downloadURL);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSuccess?.(downloadURL);
    } catch (e) {
      setError(e.message);
      setPreview(currentURL || null); // revert preview
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div style={S.wrap}>
      {/* ── Avatar circle (click or drag to upload) ── */}
      <div
        style={{
          ...S.avatarWrap,
          borderColor: dragOver ? "var(--teal)" : uploading ? "var(--teal)" : "var(--border2)",
          boxShadow:   dragOver ? "0 0 0 3px rgba(29,229,200,0.18)" : "none",
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {/* Avatar image or initials */}
        {preview ? (
          <img src={preview} alt="avatar" style={S.avatarImg} />
        ) : (
          <div style={S.avatarFallback}>{initials}</div>
        )}

        {/* Upload overlay */}
        <div style={{ ...S.overlay, opacity: dragOver || !uploading ? undefined : 0 }}>
          {uploading ? (
            <div style={S.progressRing}>
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4"/>
                <circle
                  cx="28" cy="28" r="24" fill="none"
                  stroke="var(--teal)" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                  transform="rotate(-90 28 28)"
                  style={{ transition: "stroke-dashoffset 0.2s" }}
                />
              </svg>
              <span style={S.progressText}>{progress}%</span>
            </div>
          ) : (
            <div style={S.uploadIcon}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 15V3M7 7l4-4 4 4"/>
                <path d="M3 15v3a1 1 0 001 1h14a1 1 0 001-1v-3"/>
              </svg>
              <span style={{ fontSize: 11, fontWeight: 600, marginTop: 4, color: "white" }}>
                {dragOver ? "Drop here" : "Upload"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: "none" }}
        onChange={onInputChange}
      />

      {/* Caption */}
      <div style={{ flex: 1 }}>
        <p style={S.label}>Profile picture</p>
        <p style={S.hint}>
          Click the avatar or drag & drop an image.<br/>
          JPG, PNG, GIF, WebP — max 5 MB.
        </p>

        <button
          style={S.btn}
          onClick={() => !uploading && inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? `Uploading… ${progress}%` : "Choose image"}
        </button>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={S.errorText}
            >
              ⚠️ {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Success */}
        <AnimatePresence>
          {success && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={S.successText}
            >
              ✅ Profile picture updated!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const S = {
  wrap: {
    display:    "flex",
    alignItems: "flex-start",
    gap:        20,
  },
  avatarWrap: {
    position:     "relative",
    width:         90,
    height:        90,
    borderRadius:  "50%",
    border:        "2px solid var(--border2)",
    cursor:        "pointer",
    flexShrink:    0,
    overflow:      "hidden",
    transition:    "border-color 0.2s, box-shadow 0.2s",
  },
  avatarImg: {
    width:      "100%",
    height:     "100%",
    objectFit:  "cover",
    display:    "block",
  },
  avatarFallback: {
    width:          "100%",
    height:         "100%",
    background:     "var(--teal)",
    color:          "#07101e",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       28,
    fontWeight:     800,
  },
  overlay: {
    position:       "absolute",
    inset:          0,
    background:     "rgba(0,0,0,0.52)",
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    opacity:        0,
    transition:     "opacity 0.2s",
    // show on hover via CSS — we use onMouseEnter/Leave below
  },
  uploadIcon: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    gap:            2,
  },
  progressRing: {
    position:  "relative",
    width:     56,
    height:    56,
    display:   "flex",
    alignItems:"center",
    justifyContent:"center",
  },
  progressText: {
    position:  "absolute",
    fontSize:  11,
    fontWeight:700,
    color:     "white",
  },
  label: {
    fontSize:   13,
    fontWeight: 700,
    color:      "var(--text)",
    margin:     "0 0 4px",
  },
  hint: {
    fontSize:   12,
    color:      "var(--text3)",
    lineHeight: 1.6,
    margin:     "0 0 12px",
  },
  btn: {
    padding:      "8px 18px",
    background:   "var(--surface)",
    border:       "0.5px solid var(--border2)",
    borderRadius: 8,
    color:        "var(--text2)",
    fontSize:     12,
    fontWeight:   600,
    cursor:       "pointer",
    transition:   "background 0.2s",
  },
  errorText:   { fontSize: 12, color: "#f87171",  margin: "8px 0 0", lineHeight: 1.5 },
  successText: { fontSize: 12, color: "#4ade80",  margin: "8px 0 0", lineHeight: 1.5 },
};