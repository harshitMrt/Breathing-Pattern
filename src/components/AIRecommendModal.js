// src/components/AIRecommendModal.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAIRecommendation,
  NEED_OPTIONS,
  EXPERIENCE_LEVELS,
  SESSION_DURATIONS,
} from "../services/aiRecommendation";
import { saveCustomLevel } from "../services/firestoreService";
import { useAuth } from "../context/AuthContext";

export default function AIRecommendModal({ onClose, onLevelCreated }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0); // 0 = form, 1 = loading, 2 = result
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
      setError(e.message);
      setStep(0);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await saveCustomLevel(user.uid, result);
      onLevelCreated?.(result);
      onClose();
    } catch (e) {
      setError(e.message);
    }
    setSaving(false);
  };

  const breathTotal = result
    ? result.inn + result.hold + result.out + result.hold2
    : 0;

  return (
    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={styles.modal}
      >
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>✨ AI Recommendation</h2>
            <p style={styles.subtitle}>
              Tell us your needs — we'll design your perfect breathing level.
            </p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 0: Form ── */}
          {step === 0 && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Goals */}
              <p style={styles.sectionLabel}>What are your goals?</p>
              <div style={styles.needsGrid}>
                {NEED_OPTIONS.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => toggleNeed(n.id)}
                    style={{
                      ...styles.needChip,
                      background: needs.includes(n.id)
                        ? "rgba(29,229,200,0.15)"
                        : "var(--surface2)",
                      border: needs.includes(n.id)
                        ? "1px solid var(--teal)"
                        : "1px solid var(--border)",
                      color: needs.includes(n.id)
                        ? "var(--teal)"
                        : "var(--text2)",
                    }}
                  >
                    <span>{n.emoji}</span>
                    <span>{n.label}</span>
                  </button>
                ))}
              </div>

              {/* Experience */}
              <p style={styles.sectionLabel}>Your experience level</p>
              <div style={styles.pillRow}>
                {EXPERIENCE_LEVELS.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setExperience(e.id)}
                    style={{
                      ...styles.pill,
                      background:
                        experience === e.id ? "var(--teal)" : "var(--surface2)",
                      color: experience === e.id ? "#000" : "var(--text2)",
                      border:
                        experience === e.id
                          ? "1px solid var(--teal)"
                          : "1px solid var(--border)",
                    }}
                  >
                    {e.label}
                  </button>
                ))}
              </div>

              {/* Duration */}
              <p style={styles.sectionLabel}>Preferred session duration</p>
              <div style={styles.pillRow}>
                {SESSION_DURATIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDuration(d.id)}
                    style={{
                      ...styles.pill,
                      background:
                        duration === d.id ? "var(--purple)" : "var(--surface2)",
                      color: duration === d.id ? "#fff" : "var(--text2)",
                      border:
                        duration === d.id
                          ? "1px solid var(--purple)"
                          : "1px solid var(--border)",
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Extra context */}
              <p style={styles.sectionLabel}>Anything else? (optional)</p>
              <textarea
                style={styles.textarea}
                placeholder="e.g. I have a big presentation tomorrow, I struggle with falling asleep, I feel overwhelmed at work…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
              />

              {error && <p style={styles.errorText}>{error}</p>}

              <button style={styles.generateBtn} onClick={handleGenerate}>
                ✨ Generate My Level
              </button>
            </motion.div>
          )}

          {/* ── Step 1: Loading ── */}
          {step === 1 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={styles.loadingWrap}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={styles.spinner}
              />
              <p style={styles.loadingText}>
                Designing your perfect breathing pattern…
              </p>
              <p style={styles.loadingSubtext}>
                Consulting breathwork science & your needs
              </p>
            </motion.div>
          )}

          {/* ── Step 2: Result ── */}
          {step === 2 && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div style={styles.resultCard}>
                <p style={styles.techniqueBadge}>{result.technique}</p>
                <h3 style={styles.resultName}>{result.name}</h3>
                {result.note && (
                  <p style={styles.resultNote}>"{result.note}"</p>
                )}

                {/* Visual pattern */}
                <div style={styles.patternRow}>
                  {[
                    { label: "Inhale", val: result.inn, color: "var(--blue)" },
                    ...(result.hold > 0
                      ? [
                          {
                            label: "Hold",
                            val: result.hold,
                            color: "var(--purple)",
                          },
                        ]
                      : []),
                    { label: "Exhale", val: result.out, color: "var(--teal)" },
                    ...(result.hold2 > 0
                      ? [
                          {
                            label: "Hold",
                            val: result.hold2,
                            color: "var(--amber)",
                          },
                        ]
                      : []),
                  ].map(({ label, val, color }, i) => (
                    <div key={i} style={{ flex: val, textAlign: "center" }}>
                      <div
                        style={{
                          height: 4,
                          borderRadius: 2,
                          background: color,
                          marginBottom: 6,
                        }}
                      />
                      <div style={{ fontSize: 11, fontWeight: 700, color }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>
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
                    marginTop: 8,
                  }}
                >
                  Cycle: {breathTotal}s total
                </p>
              </div>

              {error && <p style={styles.errorText}>{error}</p>}

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button
                  style={{
                    ...styles.generateBtn,
                    background: "var(--surface2)",
                    color: "var(--text1)",
                    border: "1px solid var(--border)",
                    flex: 1,
                  }}
                  onClick={() => {
                    setStep(0);
                    setResult(null);
                  }}
                >
                  ← Try Again
                </button>
                <button
                  style={{ ...styles.generateBtn, flex: 2 }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "💾 Save & Use This Level"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 20,
    padding: "28px 28px 24px",
    width: "100%",
    maxWidth: 520,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 32px 100px rgba(0,0,0,0.5)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: { fontSize: 18, fontWeight: 800, color: "var(--text1)", margin: 0 },
  subtitle: { fontSize: 12, color: "var(--text3)", margin: "4px 0 0" },
  closeBtn: {
    background: "none",
    border: "none",
    color: "var(--text3)",
    fontSize: 16,
    cursor: "pointer",
    padding: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text3)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 20,
  },
  needsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 8,
  },
  needChip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
  },
  pillRow: { display: "flex", gap: 8 },
  pill: {
    flex: 1,
    padding: "9px 12px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "all 0.2s",
  },
  textarea: {
    width: "100%",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 13,
    color: "var(--text1)",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    lineHeight: 1.5,
  },
  generateBtn: {
    width: "100%",
    marginTop: 20,
    padding: "14px",
    background: "var(--teal)",
    border: "none",
    borderRadius: 10,
    color: "#000",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "opacity 0.2s",
    boxSizing: "border-box",
  },
  errorText: { fontSize: 12, color: "#f87171", margin: "8px 0 0" },
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 0",
    gap: 16,
  },
  spinner: {
    width: 48,
    height: 48,
    border: "3px solid var(--border)",
    borderTop: "3px solid var(--teal)",
    borderRadius: "50%",
  },
  loadingText: { fontSize: 15, fontWeight: 700, color: "var(--text1)" },
  loadingSubtext: { fontSize: 12, color: "var(--text3)" },
  resultCard: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "20px 20px 16px",
  },
  techniqueBadge: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--teal)",
    background: "rgba(29,229,200,0.1)",
    padding: "3px 8px",
    borderRadius: 4,
    margin: "0 0 8px",
  },
  resultName: {
    fontSize: 20,
    fontWeight: 800,
    color: "var(--text1)",
    margin: "0 0 8px",
    letterSpacing: "-0.5px",
  },
  resultNote: {
    fontSize: 12,
    color: "var(--text3)",
    fontStyle: "italic",
    margin: "0 0 16px",
    lineHeight: 1.5,
  },
  patternRow: {
    display: "flex",
    gap: 6,
    alignItems: "flex-end",
  },
};
