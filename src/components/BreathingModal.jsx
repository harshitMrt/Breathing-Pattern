import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/context";

/* ── small helpers ── */
const Label = ({ children }) => (
  <label
    style={{
      display: "block",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      color: "var(--text3)",
      marginBottom: 6,
    }}
  >
    {children}
  </label>
);

const Input = ({ type = "text", ...props }) => (
  <input
    type={type}
    style={{
      width: "100%",
      padding: "10px 14px",
      background: "var(--surface2)",
      border: "0.5px solid var(--border2)",
      borderRadius: "var(--r6)",
      color: "var(--text)",
      fontSize: 14,
      outline: "none",
      transition: "border-color 0.2s",
      fontFamily: "inherit",
    }}
    onFocus={(e) => (e.target.style.borderColor = "var(--teal)")}
    onBlur={(e) => (e.target.style.borderColor = "var(--border2)")}
    {...props}
  />
);

const NumInput = ({ label, value, onChange, min = 0, disabled }) => (
  <div>
    <Label>{label}</Label>
    <input
      type="number"
      min={min}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width: "100%",
        padding: "10px 14px",
        background: disabled ? "var(--surface)" : "var(--surface2)",
        border: "0.5px solid var(--border2)",
        borderRadius: "var(--r6)",
        color: disabled ? "var(--text3)" : "var(--text)",
        fontSize: 14,
        outline: "none",
        fontFamily: "inherit",
        cursor: disabled ? "not-allowed" : "text",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => {
        if (!disabled) e.target.style.borderColor = "var(--teal)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "var(--border2)";
      }}
    />
  </div>
);

/* ══ BreathingModal ══ */
const BreathingModal = ({ isOpen, onClose }) => {
  const { addLevel } = useAppContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inhale, setInhale] = useState(4);
  const [hold1, setHold1] = useState(4);
  const [exhale, setExhale] = useState(4);
  const [hold2, setHold2] = useState(4);
  const [includeHold2, setIncludeHold2] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const levelTitle =
      title ||
      `Custom ${inhale}-${hold1}-${exhale}${includeHold2 ? `-${hold2}` : ""}`;
    addLevel(
      levelTitle,
      inhale,
      hold1,
      exhale,
      includeHold2 ? hold2 : 0,
      description,
    );
    onClose();
    setTitle("");
    setDescription("");
    setInhale(4);
    setHold1(4);
    setExhale(4);
    setHold2(4);
    setIncludeHold2(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              type: "spring",
              stiffness: 130,
              damping: 18,
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 480,
              background: "var(--bg2)",
              border: "0.5px solid var(--border2)",
              borderRadius: "var(--r16)",
              padding: 32,
              position: "relative",
            }}
          >
            {/* close */}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--surface)",
                border: "0.5px solid var(--border2)",
                color: "var(--text2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--surface2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--surface)")
              }
            >
              ✕
            </button>

            {/* heading */}
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
              Create level
            </p>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.5px",
                margin: "0 0 24px",
              }}
            >
              Custom breathing pattern
            </h2>

            <form onSubmit={handleSubmit}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* name */}
                <div>
                  <Label>Level name (optional)</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., My Calm Breath"
                  />
                </div>

                {/* description */}
                <div>
                  <Label>Description (optional)</Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A short note about this pattern…"
                    rows={2}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "var(--surface2)",
                      border: "0.5px solid var(--border2)",
                      borderRadius: "var(--r6)",
                      color: "var(--text)",
                      fontSize: 14,
                      resize: "vertical",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--teal)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border2)")
                    }
                  />
                </div>

                {/* timing grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <NumInput
                    label="Inhale (s)"
                    value={inhale}
                    onChange={setInhale}
                    min={1}
                  />
                  <NumInput
                    label="Hold 1 (s)"
                    value={hold1}
                    onChange={setHold1}
                    min={0}
                  />
                  <NumInput
                    label="Exhale (s)"
                    value={exhale}
                    onChange={setExhale}
                    min={1}
                  />
                  <NumInput
                    label="Hold 2 (s)"
                    value={hold2}
                    onChange={setHold2}
                    min={0}
                    disabled={!includeHold2}
                  />
                </div>

                {/* checkbox */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                    color: "var(--text2)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={includeHold2}
                    onChange={(e) => setIncludeHold2(e.target.checked)}
                    style={{
                      accentColor: "var(--teal)",
                      width: 15,
                      height: 15,
                    }}
                  />
                  Include second hold phase (box breathing pattern)
                </label>

                {/* preview */}
                <div
                  style={{
                    background: "var(--surface)",
                    border: "0.5px solid var(--border)",
                    borderRadius: "var(--r10)",
                    padding: "12px 16px",
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    ["Inhale", `${inhale}s`, "var(--blue2)", "var(--blue)"],
                    ["Hold", `${hold1}s`, "var(--purple2)", "var(--purple)"],
                    ["Exhale", `${exhale}s`, "var(--teal2)", "var(--teal)"],
                    ...(includeHold2
                      ? [
                          [
                            "Hold 2",
                            `${hold2}s`,
                            "var(--amber2)",
                            "var(--amber)",
                          ],
                        ]
                      : []),
                  ].map(([label, val, bg, color]) => (
                    <span
                      key={label}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: bg,
                        color,
                      }}
                    >
                      {label} {val}
                    </span>
                  ))}
                </div>

                {/* actions */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "flex-end",
                    marginTop: 4,
                  }}
                >
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      background: "transparent",
                      border: "0.5px solid var(--border2)",
                      color: "var(--text2)",
                      padding: "10px 22px",
                      borderRadius: "var(--r10)",
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--surface)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "var(--teal)",
                      color: "#07101e",
                      border: "none",
                      padding: "10px 24px",
                      borderRadius: "var(--r10)",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.85")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Create level
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BreathingModal;
