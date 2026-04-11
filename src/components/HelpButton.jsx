import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TIPS = [
  {
    title: "Follow the ring",
    body: "Breathe in when the ring fills, out when it drains. Match the visual rhythm.",
  },
  {
    title: "Select a pattern",
    body: "Use the sidebar to switch between breathing levels at any time.",
  },
  {
    title: "Create custom",
    body: "Click New Level to build a pattern with your own inhale, hold, and exhale timing.",
  },
  {
    title: "Best results",
    body: "Practice in a quiet space, seated comfortably. Consistency beats intensity.",
  },
];

const HelpButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* trigger */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 150,
        }}
      >
        <button
          onClick={() => setOpen(true)}
          aria-label="Help"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--surface)",
            border: "0.5px solid var(--border2)",
            color: "var(--text2)",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s, color 0.2s",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--surface2)";
            e.currentTarget.style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--surface)";
            e.currentTarget.style.color = "var(--text2)";
          }}
        >
          ?
        </button>
      </div>

      {/* modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 300,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                type: "spring",
                stiffness: 140,
                damping: 18,
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 420,
                background: "var(--bg2)",
                border: "0.5px solid var(--border2)",
                borderRadius: "var(--r16)",
                padding: 32,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--teal)",
                  margin: "0 0 6px",
                }}
              >
                Guide
              </p>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 24px" }}>
                How to use BreatheFlow
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                {TIPS.map(({ title, body }) => (
                  <div
                    key={title}
                    style={{
                      background: "var(--surface)",
                      border: "0.5px solid var(--border)",
                      borderRadius: "var(--r10)",
                      padding: "14px 16px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text)",
                        margin: "0 0 4px",
                      }}
                    >
                      {title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text2)",
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {body}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setOpen(false)}
                style={{
                  width: "100%",
                  background: "var(--teal)",
                  color: "#07101e",
                  border: "none",
                  padding: "12px",
                  borderRadius: "var(--r10)",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpButton;
