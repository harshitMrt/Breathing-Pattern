// src/components/BreathingCircle.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/context";
import { useAuth } from "../context/AuthContext";
import { saveSession } from "../services/firestoreService";

import exhaleAudio from "../audio.mp3/Exhale.mp3";
import inhaleAudio from "../audio.mp3/start Breathing.mp3";
import holdAudio from "../audio.mp3/Hold Breath.mp3";

const SoundInhale = new Audio(inhaleAudio);
const SoundExhale = new Audio(exhaleAudio);
const SoundHold = new Audio(holdAudio);

const PHASE_META = {
  "Welcome! Press Start": {
    color: "var(--text3)",
    ring: "rgba(255,255,255,0.08)",
  },
  Inhale: { color: "var(--blue)", ring: "var(--blue)" },
  "Hold breath": { color: "var(--purple)", ring: "var(--purple)" },
  Exhale: { color: "var(--teal)", ring: "var(--teal)" },
  "Hold again": { color: "var(--amber)", ring: "var(--amber)" },
};

const CIRCUMFERENCE = 2 * Math.PI * 68;

// ─── onPhaseChange is new — ExercisePage passes setCurrentPhase here
const BreathingCircle = ({ index, isRunning, onToggle, onPhaseChange }) => {
  const { levels } = useAppContext();
  const { user } = useAuth();
  const level = levels[index];

  const breathIn = level?.inn ?? 4;
  const breathHold = level?.hold ?? 4;
  const breathOut = level?.out ?? 4;
  const hold2 = level?.hold2 ?? 0;
  const totalTimer = breathIn + breathHold + breathOut + hold2;

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("Welcome! Press Start");

  const progRef = useRef(0);
  const ivIn = useRef(null);
  const ivOut = useRef(null);
  const ivCycle = useRef(null);
  const toHold = useRef(null);
  const toHold2 = useRef(null);

  const sessionStartRef = useRef(null);
  const cycleCountRef = useRef(0);

  // Wrapper so phase changes also bubble up to ExercisePage
  const changePhase = useCallback(
    (p) => {
      setPhase(p);
      onPhaseChange?.(p);
    },
    [onPhaseChange],
  );

  const clearAll = () => {
    [ivIn, ivOut, ivCycle].forEach((r) => {
      clearInterval(r.current);
      r.current = null;
    });
    [toHold, toHold2].forEach((r) => {
      clearTimeout(r.current);
      r.current = null;
    });
  };

  const persistSession = useCallback(async () => {
    if (!user || !sessionStartRef.current || cycleCountRef.current === 0)
      return;
    const durationMs = Date.now() - sessionStartRef.current;
    const durationMinutes = parseFloat((durationMs / 60000).toFixed(2));
    try {
      await saveSession(user.uid, {
        levelName: level?.name ?? level?.title ?? `Level ${index + 1}`,
        inn: breathIn,
        hold: breathHold,
        out: breathOut,
        hold2,
        durationMinutes,
        cycles: cycleCountRef.current,
      });
    } catch (e) {
      console.error("Failed to save session:", e);
    }
  }, [user, level, index, breathIn, breathHold, breathOut, hold2]);

  const runOneCycle = useCallback(() => {
    const inStep = 100 / (breathIn * 10);
    const outStep = 100 / (breathOut * 10);

    SoundInhale.play();
    changePhase("Inhale");

    ivIn.current = setInterval(() => {
      progRef.current += inStep;
      if (progRef.current >= 100) {
        progRef.current = 100;
        setProgress(100);
        clearInterval(ivIn.current);

        if (breathHold > 0) SoundHold.play();
        changePhase("Hold breath");

        toHold.current = setTimeout(() => {
          SoundExhale.play();
          changePhase("Exhale");

          ivOut.current = setInterval(() => {
            progRef.current -= outStep;
            if (progRef.current <= 0) {
              progRef.current = 0;
              setProgress(0);
              clearInterval(ivOut.current);
              cycleCountRef.current += 1;
              if (hold2 > 0) {
                SoundHold.play();
                changePhase("Hold again");
              }
            } else {
              setProgress(Math.round(progRef.current));
            }
          }, 100);
        }, breathHold * 1000);
      } else {
        setProgress(Math.round(progRef.current));
      }
    }, 100);
  }, [breathIn, breathHold, breathOut, hold2, changePhase]);

  useEffect(() => {
    if (isRunning) {
      progRef.current = 0;
      cycleCountRef.current = 0;
      sessionStartRef.current = Date.now();
      runOneCycle();
      ivCycle.current = setInterval(runOneCycle, totalTimer * 1000);
    } else {
      clearAll();
      persistSession();
      progRef.current = 0;
      setProgress(0);
      changePhase("Welcome! Press Start");
    }
    return clearAll;
  }, [isRunning, runOneCycle, totalTimer, changePhase, persistSession]);

  if (!level) return <p style={{ color: "var(--text2)" }}>Select a level</p>;

  const meta = PHASE_META[phase] ?? PHASE_META["Welcome! Press Start"];
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
  const scale = 1 + (progress / 100) * 0.08;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}
    >
      <motion.div
        animate={{ scale }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        style={{ position: "relative", width: 200, height: 200 }}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          style={{ display: "block" }}
        >
          {/* track */}
          <circle
            cx="100"
            cy="100"
            r="68"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          {/* progress ring — no static pre-filled arc */}
          <circle
            cx="100"
            cy="100"
            r="68"
            fill="none"
            stroke={meta.ring}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
            style={{
              transition: "stroke-dashoffset 0.12s linear, stroke 0.6s ease",
            }}
          />
          {/* inner circle */}
          <circle
            cx="100"
            cy="100"
            r="54"
            fill="rgba(29,229,200,0.04)"
            stroke="rgba(29,229,200,0.10)"
            strokeWidth="0.5"
          />
        </svg>

        {/* centre number */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={progress}
              initial={{ opacity: 0.6, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{
                fontSize: 44,
                fontWeight: 800,
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              {progress}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* phase label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: meta.color,
            marginTop: 18,
            transition: "color 0.4s ease",
          }}
        >
          {phase}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default BreathingCircle;
