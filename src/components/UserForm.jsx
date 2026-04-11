import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STRESS = ["Low", "Medium", "High"];
const SLEEP = ["Poor", "Average", "Good"];
const GOALS = [
  "Reduce stress",
  "Better sleep",
  "Improve focus",
  "Boost energy",
  "Emotional balance",
];

const ChipGroup = ({
  options,
  value,
  onChange,
  colorActive = "var(--teal)",
  bgActive = "var(--teal2)",
}) => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    {options.map((opt) => {
      const active = value === opt;
      return (
        <motion.button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "8px 16px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            border: active
              ? `0.5px solid ${colorActive}`
              : "0.5px solid var(--border2)",
            background: active ? bgActive : "var(--surface)",
            color: active ? colorActive : "var(--text2)",
            transition: "all 0.18s",
          }}
        >
          {opt}
        </motion.button>
      );
    })}
  </div>
);

const UserForm = () => {
  const [stress, setStress] = useState("");
  const [sleep, setSleep] = useState("");
  const [goal, setGoal] = useState("");
  const [custom, setCustom] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = stress && sleep;

  const getRecommendation = () => {
    if (!canSubmit) return;
    setLoading(true);
    // Simulate AI (replace with real Anthropic API call if desired)
    setTimeout(() => {
      let pattern = "Box Breathing (4-4-4-4)";
      let reason =
        "Balances the nervous system and improves focus for your current state.";

      if (sleep === "Poor" || goal === "Better sleep") {
        pattern = "4-7-8 Breathing";
        reason =
          "The long exhale activates your parasympathetic system, helping you fall asleep faster.";
      }
      if (stress === "High" && goal !== "Better sleep") {
        pattern = "Box Breathing (4-4-4-4)";
        reason =
          "Equal-phase breathing brings the nervous system into balance quickly under high stress.";
      }
      if (goal === "Boost energy") {
        pattern = "Wim Hof Method";
        reason =
          "Power breathing raises oxygen levels and boosts alertness within minutes.";
      }
      if (goal === "Emotional balance") {
        pattern = "5-5 Coherent Breathing";
        reason =
          "Synchronises heart rate variability for lasting emotional regulation.";
      }

      setResult({ pattern, reason });
      setLoading(false);
    }, 1100);
  };

  return (
    <div>
      {/* header */}
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
        AI Guide
      </p>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-0.4px",
          margin: "0 0 4px",
        }}
      >
        Personalised recommendation
      </h2>
      <p
        style={{
          fontSize: 13,
          color: "var(--text2)",
          margin: "0 0 24px",
          lineHeight: 1.6,
        }}
      >
        Tell us how you're feeling and we'll pick the best pattern for you.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* stress */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text3)",
              margin: "0 0 10px",
            }}
          >
            Stress level
          </p>
          <ChipGroup
            options={STRESS}
            value={stress}
            onChange={setStress}
            colorActive="var(--blue)"
            bgActive="var(--blue2)"
          />
        </div>

        {/* sleep */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text3)",
              margin: "0 0 10px",
            }}
          >
            Sleep quality
          </p>
          <ChipGroup
            options={SLEEP}
            value={sleep}
            onChange={setSleep}
            colorActive="var(--purple)"
            bgActive="var(--purple2)"
          />
        </div>

        {/* goal */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text3)",
              margin: "0 0 10px",
            }}
          >
            Goal (optional)
          </p>
          <ChipGroup options={GOALS} value={goal} onChange={setGoal} />
        </div>

        {/* free text */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text3)",
              margin: "0 0 8px",
            }}
          >
            Anything else?
          </p>
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="e.g., racing thoughts before a presentation…"
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "var(--surface2)",
              border: "0.5px solid var(--border2)",
              borderRadius: "var(--r6)",
              color: "var(--text)",
              fontSize: 13,
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--teal)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border2)")}
          />
        </div>

        {/* submit */}
        <motion.button
          type="button"
          disabled={!canSubmit || loading}
          onClick={getRecommendation}
          whileHover={{ scale: canSubmit && !loading ? 1.02 : 1 }}
          whileTap={{ scale: canSubmit && !loading ? 0.98 : 1 }}
          style={{
            background: canSubmit ? "var(--teal)" : "var(--surface)",
            color: canSubmit ? "#07101e" : "var(--text3)",
            border: "none",
            width: "100%",
            padding: "13px",
            borderRadius: "var(--r10)",
            fontSize: 14,
            fontWeight: 700,
            cursor: canSubmit ? "pointer" : "not-allowed",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          {loading ? "Analysing…" : "Get my breathing plan"}
        </motion.button>

        {/* result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                background: "var(--teal2)",
                border: "0.5px solid rgba(29,229,200,0.25)",
                borderRadius: "var(--r10)",
                padding: "16px 18px",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "var(--teal)",
                  margin: "0 0 6px",
                }}
              >
                Recommended
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text)",
                  margin: "0 0 6px",
                }}
              >
                {result.pattern}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text2)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {result.reason}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <p
          style={{
            fontSize: 11,
            color: "var(--text3)",
            textAlign: "center",
            margin: 0,
          }}
        >
          AI-powered recommendations · Takes less than 5 seconds
        </p>
      </div>
    </div>
  );
};

export default UserForm;
