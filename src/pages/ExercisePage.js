// src/pages/ExercisePage.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/context";
import BreathingCircle from "../components/BreathingCircle";
import LevelList       from "../components/LevelList";
import BreathingModal  from "../components/BreathingModal";
import HelpButton      from "../components/HelpButton";

const PhaseTag = ({ label, secs, color, bg, active }) => (
  <div style={{ flex: 1, textAlign: "center" }}>
    <div style={{ height: 3, borderRadius: 2, background: active ? color : bg, marginBottom: 7, transition: "background 0.3s" }} />
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: active ? color : "var(--text3)", transition: "color 0.3s" }}>
      {label}
    </div>
    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{secs}s</div>
  </div>
);

const ExercisePage = ({ onBadgesEarned }) => {
  const { levels, deleteLevel, loadingLevels, lastAddedIndex } = useAppContext();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isRunning,     setIsRunning]     = useState(false);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [currentPhase,  setCurrentPhase]  = useState("Welcome! Press Start");

  useEffect(() => {
    if (lastAddedIndex !== null && lastAddedIndex < levels.length) {
      setIsRunning(false);
      setSelectedIndex(lastAddedIndex);
      setCurrentPhase("Welcome! Press Start");
    }
  }, [lastAddedIndex, levels.length]);

  const level      = levels[selectedIndex];
  const breathIn   = level?.inn   ?? 4;
  const breathHold = level?.hold  ?? 0;
  const breathOut  = level?.out   ?? 4;
  const hold2      = level?.hold2 ?? 0;

  const handleSelect = (i) => {
    setIsRunning(false);
    setSelectedIndex(i);
    setCurrentPhase("Welcome! Press Start");
  };

  const handleDelete = async (id) => {
    const idx = levels.findIndex(l => l.id === id);
    await deleteLevel(id);
    if (idx === selectedIndex) {
      setSelectedIndex(Math.max(0, selectedIndex - 1));
      setCurrentPhase("Welcome! Press Start");
    }
    setIsRunning(false);
  };

  return (
    <div style={S.page}>

      {/* ══ LEFT — wider levels panel ══ */}
      <aside style={S.left}>
        <div style={S.panelHeader}>
          <div>
            <p style={S.eyebrow}>Breathing Levels</p>
            <h2 style={S.panelTitle}>Choose a pattern</h2>
          </div>
          <button
            style={S.addBtn}
            onClick={() => { setIsRunning(false); setModalOpen(true); }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="1" x2="6" y2="11"/>
              <line x1="1" y1="6" x2="11" y2="6"/>
            </svg>
            New
          </button>
        </div>

        <div style={S.divider} />

        {loadingLevels ? (
          <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text3)", fontSize: 13 }}>
            Loading…
          </div>
        ) : (
          <div style={S.listScroll}>
            <LevelList onSelect={handleSelect} selectedIndex={selectedIndex} />
          </div>
        )}
      </aside>

      {/* ══ CENTER — breathing circle ══ */}
      <section style={S.center}>
        <div style={S.glow} />

        {/* title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{ textAlign: "center", marginBottom: 36, zIndex: 1 }}
          >
            <h1 style={S.sessionTitle}>{level?.title ?? "Select a level"}</h1>
            <p style={S.sessionSub}>
              {breathIn}s inhale
              {breathHold > 0 ? ` · ${breathHold}s hold` : ""}
              {` · ${breathOut}s exhale`}
              {hold2 > 0 ? ` · ${hold2}s hold` : ""}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* circle */}
        <div style={{ zIndex: 1 }}>
          <BreathingCircle
            index={selectedIndex}
            isRunning={isRunning}
            onToggle={() => setIsRunning(r => !r)}
            onPhaseChange={setCurrentPhase}
            onBadgesEarned={onBadgesEarned}
          />
        </div>

        {/* phase track */}
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ ...S.phaseTrack, zIndex: 1 }}
          >
            <PhaseTag label="Inhale" secs={breathIn}   color="var(--blue)"   bg="var(--blue2)"   active={currentPhase === "Inhale"}      />
            {breathHold > 0 && (
              <PhaseTag label="Hold" secs={breathHold} color="var(--purple)" bg="var(--purple2)" active={currentPhase === "Hold breath"} />
            )}
            <PhaseTag label="Exhale" secs={breathOut}  color="var(--teal)"   bg="var(--teal2)"   active={currentPhase === "Exhale"}      />
            {hold2 > 0 && (
              <PhaseTag label="Hold" secs={hold2}      color="var(--amber)"  bg="var(--amber2)"  active={currentPhase === "Hold again"}  />
            )}
          </motion.div>
        )}

        {/* controls */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 36, zIndex: 1 }}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsRunning(r => !r)}
            style={isRunning ? S.stopBtn : S.startBtn}
          >
            {isRunning ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="2" y="2" width="4" height="10" rx="1"/>
                  <rect x="8" y="2" width="4" height="10" rx="1"/>
                </svg>
                Stop session
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <polygon points="3,2 12,7 3,12"/>
                </svg>
                Begin session
              </>
            )}
          </motion.button>

          <button
            onClick={() => { setIsRunning(false); setModalOpen(true); }}
            style={S.ghostBtn}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="6" y1="1" x2="6" y2="11"/>
              <line x1="1" y1="6" x2="11" y2="6"/>
            </svg>
            Create custom level
          </button>
        </div>

        {!isRunning && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={S.tip}>
            Sit comfortably, close your eyes, and follow the circle.
          </motion.p>
        )}
      </section>

      <BreathingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <HelpButton />
    </div>
  );
};

export default ExercisePage;

const S = {
  /* 2-column layout: wider left panel + center fills the rest */
  page: {
    display:             "grid",
    gridTemplateColumns: "380px 1fr",
    height:              "calc(100vh - 58px)",   // fixed height — no overflow at page level
    overflow:            "hidden",               // nothing escapes the grid
    background:          "var(--bg)",
  },

  /* LEFT — fixed height column, only the list scrolls */
  left: {
    borderRight:    "0.5px solid var(--border)",
    padding:        "28px 20px 0",               // no bottom padding — list handles its own
    background:     "var(--bg2)",
    display:        "flex",
    flexDirection:  "column",
    height:         "100%",                      // fill the grid row
    overflow:       "hidden",                    // clip the column itself
  },

  /* scrollable list wrapper — sits below header + divider */
  listScroll: {
    flex:       1,
    minHeight:  0,                               // critical: lets flex child shrink & scroll
    overflowY:  "auto",
    paddingBottom: 20,
  },

  panelHeader: {
    display:        "flex",
    alignItems:     "flex-start",
    justifyContent: "space-between",
    marginBottom:   0,
    flexShrink:     0,                           // header never compresses
  },
  addBtn: {
    display:     "flex",
    alignItems:  "center",
    gap:         5,
    padding:     "6px 12px",
    background:  "transparent",
    border:      "0.5px solid var(--border2)",
    borderRadius: 8,
    color:       "var(--text2)",
    fontSize:    12,
    fontWeight:  600,
    cursor:      "pointer",
    whiteSpace:  "nowrap",
  },

  /* CENTER — never scrolls */
  center: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    padding:        "48px 40px",
    position:       "relative",
    overflow:       "hidden",                    // breathing circle stays put
    height:         "100%",
  },
  glow: {
    position:     "absolute",
    top:          "50%",
    left:         "50%",
    transform:    "translate(-50%,-50%)",
    width:        500,
    height:       500,
    borderRadius: "50%",
    background:   "radial-gradient(circle, rgba(29,229,200,0.05) 0%, transparent 65%)",
    pointerEvents:"none",
  },
  sessionTitle: { fontSize: 22, fontWeight: 700, letterSpacing: "-0.6px", color: "var(--text)", margin: 0 },
  sessionSub:   { fontSize: 13, color: "var(--text3)", marginTop: 5, letterSpacing: "0.02em" },
  phaseTrack:   { display: "flex", gap: 10, marginTop: 28, width: 320 },

  startBtn: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "13px 44px", background: "var(--teal)", color: "#07101e",
    border: "none", borderRadius: 32, fontSize: 14, fontWeight: 700,
    cursor: "pointer", letterSpacing: "-0.2px",
    boxShadow: "0 0 28px rgba(29,229,200,0.22)",
  },
  stopBtn: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "13px 44px", background: "rgba(226,75,74,0.12)", color: "#e24b4a",
    border: "0.5px solid rgba(226,75,74,0.3)", borderRadius: 32,
    fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.2px",
  },
  ghostBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "transparent", border: "0.5px solid var(--border2)",
    color: "var(--text2)", padding: "10px 24px", borderRadius: 24,
    fontSize: 12, fontWeight: 500, cursor: "pointer",
  },
  tip: {
    fontSize: 12, color: "var(--text3)", marginTop: 24,
    textAlign: "center", zIndex: 1, maxWidth: 260, lineHeight: 1.6,
  },

  /* shared */
  eyebrow:    { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--teal)", margin: "0 0 5px" },
  panelTitle: { fontSize: 16, fontWeight: 700, letterSpacing: "-0.3px", color: "var(--text)", margin: 0 },
  divider:    { height: "0.5px", background: "var(--border)", margin: "18px 0", flexShrink: 0 },
};