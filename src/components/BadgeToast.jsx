// src/components/BadgeToast.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Shows a slide-in toast for each newly unlocked badge.
 * Props:
 *   badges  — array of { id, name, emoji, desc }
 *   onClear — callback to clear the queue
 */
export default function BadgeToast({ badges = [], onClear }) {
  const badge = badges[0]; // show one at a time

  useEffect(() => {
    if (!badge) return;
    const t = setTimeout(onClear, 4000);
    return () => clearTimeout(t);
  }, [badge, onClear]);

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0,  scale: 1   }}
          exit={{   opacity: 0, x: 80,  scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          style={S.wrap}
          onClick={onClear}
        >
          {/* glow pulse */}
          <div style={S.glow} />

          <div style={S.emojiWrap}>{badge.emoji}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={S.label}>Badge unlocked!</p>
            <p style={S.name}>{badge.name}</p>
            <p style={S.desc}>{badge.desc}</p>
          </div>

          <button style={S.close} onClick={onClear}>✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const S = {
  wrap: {
    position:   "fixed",
    bottom:     24,
    right:      24,
    zIndex:     9999,
    display:    "flex",
    alignItems: "center",
    gap:        14,
    padding:    "14px 16px",
    borderRadius: 16,
    background: "var(--bg2)",
    border:     "0.5px solid rgba(29,229,200,0.35)",
    boxShadow:  "0 8px 40px rgba(0,0,0,0.5), 0 0 24px rgba(29,229,200,0.12)",
    maxWidth:   320,
    cursor:     "pointer",
    overflow:   "hidden",
  },
  glow: {
    position:     "absolute",
    inset:        0,
    background:   "radial-gradient(circle at 0% 50%, rgba(29,229,200,0.08) 0%, transparent 60%)",
    pointerEvents:"none",
  },
  emojiWrap: {
    width:       48,
    height:      48,
    borderRadius: 12,
    background:  "rgba(29,229,200,0.12)",
    border:      "0.5px solid rgba(29,229,200,0.25)",
    display:     "flex",
    alignItems:  "center",
    justifyContent: "center",
    fontSize:    26,
    flexShrink:  0,
  },
  label: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--teal)", margin: "0 0 2px" },
  name:  { fontSize: 14, fontWeight: 800, color: "var(--text)",  margin: "0 0 2px", letterSpacing: "-0.3px" },
  desc:  { fontSize: 11, color: "var(--text3)", margin: 0, lineHeight: 1.5 },
  close: { background: "none", border: "none", color: "var(--text3)", fontSize: 13, cursor: "pointer", padding: "2px 4px", flexShrink: 0 },
};