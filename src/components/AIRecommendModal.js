// src/components/AIRecommendModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/context";
import { getAIRecommendation } from "../services/aiRecommendation";

const NEED_OPTIONS = [
  { id: "stress", emoji: "😰", label: "Reduce stress" },
  { id: "sleep", emoji: "😴", label: "Better sleep" },
  { id: "focus", emoji: "🎯", label: "Improve focus" },
  { id: "energy", emoji: "⚡", label: "Boost energy" },
  { id: "anxiety", emoji: "💭", label: "Calm anxiety" },
  { id: "balance", emoji: "⚖️", label: "Emotional balance" },
  { id: "performance", emoji: "🏃", label: "Athletic performance" },
  { id: "panic", emoji: "🧘", label: "Panic relief" },
];

const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const SESSION_DURATIONS = [
  { id: "short", label: "Short (2–5 min)" },
  { id: "medium", label: "Medium (5–10 min)" },
  { id: "long", label: "Long (10–20 min)" },
];

/* ── small shared primitives ── */
const Divider = () => (
  <div
    style={{ height: "0.5px", background: "var(--border)", margin: "20px 0" }}
  />
);

const SectionLabel = ({ children }) => (
  <p
    style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--teal)",
      margin: "0 0 10px",
    }}
  >
    {children}
  </p>
);

/* ══ AIRecommendModal ══ */
export default function AIRecommendModal({
  onClose,
  onLevelCreated,
  onPlayLevel,
}) {
  const { addLevel } = useAppContext();

  const [step, setStep] = useState(0); // 0=form 1=loading 2=result
  const [needs, setNeeds] = useState([]);
  const [experience, setExperience] = useState("beginner");
  const [duration, setDuration] = useState("medium");
  const [context, setContext] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleNeed = (id) =>
    setNeeds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id],
    );

  /* ── generate ── */
  const handleGenerate = async () => {
    if (needs.length === 0) {
      setError("Please select at least one goal.");
      return;
    }
    setError("");
    setStep(1);
    try {
      const level = await getAIRecommendation({
        needs,
        experience,
        duration,
        additionalContext: context,
      });
      setResult(level);
      setStep(2);
    } catch (e) {
      setError(e.message || "Could not reach Groq API. Check your API key.");
      setStep(0);
    }
  };

  /* ── save to context ── */
  const doSave = async () => {
    if (!result) return false;
    setSaving(true);
    try {
      await addLevel(
        result.name,
        result.inn,
        result.hold,
        result.out,
        result.hold2,
        result.note,
        result.technique,
      );
      onLevelCreated?.(result);
      setSaving(false);
      return true;
    } catch {
      setError("Failed to save. Please try again.");
      setSaving(false);
      return false;
    }
  };

  const handleSave = async () => {
    const ok = await doSave();
    if (ok) onClose();
  };
  const handlePlay = async () => {
    const ok = await doSave();
    if (ok) {
      onPlayLevel?.();
      onClose();
    }
  };

  const breathTotal = result
    ? result.inn + (result.hold || 0) + result.out + (result.hold2 || 0)
    : 0;

  return (
    <div
      style={S.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        style={S.modal}
      >
        {/* ── header ── */}
        <div style={S.header}>
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--teal)",
                margin: "0 0 4px",
              }}
            >
              AI Powered
            </p>
            <h2 style={S.title}>Breathing Recommendation</h2>
            <p style={S.subtitle}>
              Tell us your needs — we'll design your perfect level.
            </p>
          </div>
          <button
            style={S.closeBtn}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--surface2)";
              e.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--surface)";
              e.currentTarget.style.color = "var(--text3)";
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="11" y1="1" x2="1" y2="11" />
            </svg>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* ══ STEP 0 — Form ══ */}
          {step === 0 && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SectionLabel>What are your goals?</SectionLabel>
              <div style={S.needsGrid}>
                {NEED_OPTIONS.map((n) => {
                  const active = needs.includes(n.id);
                  return (
                    <button
                      key={n.id}
                      onClick={() => toggleNeed(n.id)}
                      style={{
                        ...S.needChip,
                        background: active
                          ? "rgba(29,229,200,0.12)"
                          : "var(--surface2)",
                        border: active
                          ? "0.5px solid var(--teal)"
                          : "0.5px solid var(--border2)",
                        color: active ? "var(--teal)" : "var(--text2)",
                        boxShadow: active
                          ? "0 0 12px rgba(29,229,200,0.15)"
                          : "none",
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{n.emoji}</span>
                      <span>{n.label}</span>
                    </button>
                  );
                })}
              </div>

              <Divider />

              <SectionLabel>Experience level</SectionLabel>
              <div style={S.pillRow}>
                {EXPERIENCE_LEVELS.map((e) => {
                  const active = experience === e.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => setExperience(e.id)}
                      style={{
                        ...S.pill,
                        background: active ? "var(--teal)" : "var(--surface2)",
                        color: active ? "#07101e" : "var(--text2)",
                        border: active
                          ? "0.5px solid var(--teal)"
                          : "0.5px solid var(--border2)",
                        fontWeight: active ? 700 : 500,
                      }}
                    >
                      {e.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ height: 16 }} />

              <SectionLabel>Session duration</SectionLabel>
              <div style={S.pillRow}>
                {SESSION_DURATIONS.map((d) => {
                  const active = duration === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDuration(d.id)}
                      style={{
                        ...S.pill,
                        background: active
                          ? "var(--purple2)"
                          : "var(--surface2)",
                        color: active ? "var(--purple)" : "var(--text2)",
                        border: active
                          ? "0.5px solid var(--purple)"
                          : "0.5px solid var(--border2)",
                        fontWeight: active ? 700 : 500,
                      }}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>

              <Divider />

              <SectionLabel>Anything else? (optional)</SectionLabel>
              <textarea
                style={S.textarea}
                placeholder="e.g. I have a big presentation tomorrow, I struggle falling asleep…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
                onFocus={(e) => (e.target.style.borderColor = "var(--teal)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border2)")}
              />

              {error && (
                <div style={S.errorBox}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <circle cx="7" cy="7" r="6" />
                    <path d="M7 4v3M7 9.5v.5" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                style={S.generateBtn}
                onClick={handleGenerate}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="#07101e"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polygon points="2,2 12,7 2,12" fill="#07101e" />
                </svg>
                Generate my level
              </button>
            </motion.div>
          )}

          {/* ══ STEP 1 — Loading ══ */}
          {step === 1 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={S.loadingWrap}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                style={S.spinner}
              />
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Designing your pattern…
              </p>
              <p style={{ fontSize: 12, color: "var(--text3)", margin: 0 }}>
                Groq AI is consulting breathwork science
              </p>
            </motion.div>
          )}

          {/* ══ STEP 2 — Result ══ */}
          {step === 2 && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* result card */}
              <div style={S.resultCard}>
                {/* technique badge */}
                <span style={S.techniqueBadge}>{result.technique}</span>

                <h3 style={S.resultName}>{result.name}</h3>

                {result.note && <p style={S.resultNote}>"{result.note}"</p>}

                {/* pattern visual */}
                <div style={S.patternRow}>
                  {[
                    {
                      label: "Inhale",
                      val: result.inn,
                      color: "#5b9cf6",
                      bg: "rgba(91,156,246,0.12)",
                    },
                    ...(result.hold > 0
                      ? [
                          {
                            label: "Hold",
                            val: result.hold,
                            color: "#9f7aea",
                            bg: "rgba(159,122,234,0.12)",
                          },
                        ]
                      : []),
                    {
                      label: "Exhale",
                      val: result.out,
                      color: "#1de5c8",
                      bg: "rgba(29,229,200,0.12)",
                    },
                    ...(result.hold2 > 0
                      ? [
                          {
                            label: "Hold",
                            val: result.hold2,
                            color: "#f6ad55",
                            bg: "rgba(246,173,85,0.12)",
                          },
                        ]
                      : []),
                  ].map(({ label, val, color, bg }, i) => (
                    <div key={i} style={{ flex: val, textAlign: "center" }}>
                      <div
                        style={{
                          height: 4,
                          borderRadius: 2,
                          background: color,
                          marginBottom: 7,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: bg,
                          color,
                        }}
                      >
                        {label}
                      </span>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color,
                          marginTop: 5,
                        }}
                      >
                        {val}s
                      </div>
                    </div>
                  ))}
                </div>

                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text3)",
                    textAlign: "center",
                    margin: "12px 0 0",
                  }}
                >
                  {breathTotal}s per cycle
                </p>
              </div>

              {error && (
                <div style={{ ...S.errorBox, marginTop: 12 }}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <circle cx="7" cy="7" r="6" />
                    <path d="M7 4v3M7 9.5v.5" />
                  </svg>
                  {error}
                </div>
              )}

              {/* actions */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginTop: 18,
                }}
              >
                <button
                  style={S.playBtn}
                  onClick={handlePlay}
                  disabled={saving}
                  onMouseEnter={(e) => {
                    if (!saving) e.currentTarget.style.opacity = "0.88";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {saving ? (
                    "Saving…"
                  ) : (
                    <>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 14 14"
                        fill="#07101e"
                      >
                        <polygon points="3,2 12,7 3,12" />
                      </svg>
                      Play this level
                    </>
                  )}
                </button>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    style={{ ...S.ghostBtn, flex: 1 }}
                    onClick={() => {
                      setStep(0);
                      setResult(null);
                      setError("");
                    }}
                  >
                    ← Try again
                  </button>
                  <button
                    style={{ ...S.ghostBtn, flex: 1 }}
                    onClick={handleSave}
                    disabled={saving}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--surface2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {saving ? "Saving…" : "Save only"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ── Styles ── */
const S = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    background: "var(--bg2)",
    border: "0.5px solid var(--border2)",
    borderRadius: 18,
    padding: "28px 26px 24px",
    width: "100%",
    maxWidth: 500,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 32px 100px rgba(0,0,0,0.6)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: "var(--text)",
    margin: "0 0 3px",
    letterSpacing: "-0.4px",
  },
  subtitle: { fontSize: 12, color: "var(--text3)", margin: 0 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "var(--surface)",
    border: "0.5px solid var(--border2)",
    color: "var(--text3)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.2s, color 0.2s",
  },
  needsGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 },
  needChip: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.18s",
  },
  pillRow: { display: "flex", gap: 8 },
  pill: {
    flex: 1,
    padding: "9px 12px",
    borderRadius: 8,
    fontSize: 12,
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "all 0.18s",
  },
  textarea: {
    width: "100%",
    background: "var(--surface)",
    border: "0.5px solid var(--border2)",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 13,
    color: "var(--text)",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    lineHeight: 1.6,
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  generateBtn: {
    width: "100%",
    marginTop: 18,
    padding: "13px",
    background: "var(--teal)",
    border: "none",
    borderRadius: 10,
    color: "#07101e",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.01em",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "opacity 0.2s",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "#f87171",
    background: "rgba(248,113,113,0.08)",
    border: "0.5px solid rgba(248,113,113,0.2)",
    borderRadius: 8,
    padding: "10px 12px",
    marginTop: 12,
    lineHeight: 1.5,
  },
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "56px 0",
    gap: 14,
  },
  spinner: {
    width: 44,
    height: 44,
    border: "3px solid var(--border)",
    borderTop: "3px solid var(--teal)",
    borderRadius: "50%",
  },
  resultCard: {
    background: "var(--surface)",
    border: "0.5px solid var(--border2)",
    borderRadius: 14,
    padding: "20px 20px 16px",
  },
  techniqueBadge: {
    display: "inline-block",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--teal)",
    background: "rgba(29,229,200,0.10)",
    border: "0.5px solid rgba(29,229,200,0.25)",
    padding: "3px 9px",
    borderRadius: 20,
    marginBottom: 10,
  },
  resultName: {
    fontSize: 20,
    fontWeight: 800,
    color: "var(--text)",
    margin: "0 0 8px",
    letterSpacing: "-0.5px",
  },
  resultNote: {
    fontSize: 12,
    color: "var(--text2)",
    fontStyle: "italic",
    margin: "0 0 18px",
    lineHeight: 1.6,
  },
  patternRow: { display: "flex", gap: 8, alignItems: "flex-end" },
  playBtn: {
    width: "100%",
    padding: "13px",
    background: "var(--teal)",
    border: "none",
    borderRadius: 10,
    color: "#07101e",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "opacity 0.2s",
  },
  ghostBtn: {
    padding: "11px",
    background: "transparent",
    border: "0.5px solid var(--border2)",
    borderRadius: 10,
    color: "var(--text2)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxSizing: "border-box",
    textAlign: "center",
    transition: "background 0.2s",
  },
};
