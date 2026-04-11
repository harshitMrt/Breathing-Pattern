// src/pages/HistoryPage.js
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  getUserSessions,
  deleteSession,
  getUserCustomLevels,
  deleteCustomLevel,
} from "../services/firestoreService";

const tabs = ["Sessions", "My Levels"];

const formatDate = (ts) => {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StatPill = ({ label, value, color = "var(--teal)" }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
    <div
      style={{
        fontSize: 10,
        color: "var(--text3)",
        letterSpacing: "0.04em",
        marginTop: 2,
      }}
    >
      {label}
    </div>
  </div>
);

export default function HistoryPage({ onUseLevel }) {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [s, l] = await Promise.all([
      getUserSessions(user.uid),
      getUserCustomLevels(user.uid),
    ]);
    setSessions(s);
    setLevels(l);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user.uid]);

  const handleDeleteSession = async (id) => {
    await deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDeleteLevel = async (id) => {
    await deleteCustomLevel(id);
    setLevels((prev) => prev.filter((l) => l.id !== id));
  };

  // Summary stats
  const totalMins = sessions.reduce((a, s) => a + (s.durationMinutes ?? 0), 0);
  const totalCycles = sessions.reduce((a, s) => a + (s.cycles ?? 0), 0);

  return (
    <div style={styles.page}>
      {/* Header stats */}
      <div style={styles.statsRow}>
        <StatPill
          label="SESSIONS"
          value={sessions.length}
          color="var(--blue)"
        />
        <div style={styles.statsDivider} />
        <StatPill
          label="TOTAL MINS"
          value={Math.round(totalMins)}
          color="var(--teal)"
        />
        <div style={styles.statsDivider} />
        <StatPill label="CYCLES" value={totalCycles} color="var(--purple)" />
        <div style={styles.statsDivider} />
        <StatPill
          label="MY LEVELS"
          value={levels.length}
          color="var(--amber)"
        />
      </div>

      {/* Tabs */}
      <div style={styles.tabRow}>
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            style={{
              ...styles.tab,
              color: tab === i ? "var(--text1)" : "var(--text3)",
              borderBottom:
                tab === i ? "2px solid var(--teal)" : "2px solid transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p
          style={{ color: "var(--text3)", textAlign: "center", marginTop: 40 }}
        >
          Loading…
        </p>
      ) : (
        <AnimatePresence mode="wait">
          {tab === 0 ? (
            <motion.div
              key="sessions"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              style={styles.list}
            >
              {sessions.length === 0 && (
                <p style={styles.emptyText}>
                  No sessions yet. Start breathing!
                </p>
              )}
              {sessions.map((s) => (
                <div key={s.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <p style={styles.cardTitle}>{s.levelName ?? "Session"}</p>
                      <p style={styles.cardDate}>{formatDate(s.createdAt)}</p>
                    </div>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDeleteSession(s.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                  <div style={styles.cardStats}>
                    <span style={styles.badge}>🌬 {s.inn}s inhale</span>
                    {s.hold > 0 && (
                      <span style={styles.badge}>⏸ {s.hold}s hold</span>
                    )}
                    <span style={styles.badge}>💨 {s.out}s exhale</span>
                    {s.hold2 > 0 && (
                      <span style={styles.badge}>⏸ {s.hold2}s hold</span>
                    )}
                    <span
                      style={{
                        ...styles.badge,
                        background: "rgba(29,229,200,0.1)",
                        color: "var(--teal)",
                      }}
                    >
                      {s.durationMinutes ?? "?"} min
                    </span>
                    <span
                      style={{
                        ...styles.badge,
                        background: "rgba(139,92,246,0.1)",
                        color: "var(--purple)",
                      }}
                    >
                      {s.cycles ?? "?"} cycles
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="levels"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={styles.list}
            >
              {levels.length === 0 && (
                <p style={styles.emptyText}>
                  No custom levels yet. Use AI Recommend to create one!
                </p>
              )}
              {levels.map((l) => (
                <div key={l.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <p style={styles.cardTitle}>{l.name}</p>
                      {l.technique && (
                        <p style={{ ...styles.cardDate, color: "var(--teal)" }}>
                          {l.technique}
                        </p>
                      )}
                      <p style={styles.cardDate}>{formatDate(l.createdAt)}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {onUseLevel && (
                        <button
                          style={{
                            ...styles.deleteBtn,
                            color: "var(--teal)",
                            borderColor: "var(--teal)",
                          }}
                          onClick={() => onUseLevel(l)}
                          title="Use this level"
                        >
                          ▶
                        </button>
                      )}
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDeleteLevel(l.id)}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  {l.note && <p style={styles.noteText}>"{l.note}"</p>}
                  <div style={styles.cardStats}>
                    <span style={styles.badge}>🌬 {l.inn}s</span>
                    {l.hold > 0 && (
                      <span style={styles.badge}>⏸ {l.hold}s</span>
                    )}
                    <span style={styles.badge}>💨 {l.out}s</span>
                    {l.hold2 > 0 && (
                      <span style={styles.badge}>⏸ {l.hold2}s</span>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "0 0 40px" },
  statsRow: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "16px 0",
    marginBottom: 24,
    justifyContent: "space-around",
  },
  statsDivider: { width: 1, height: 32, background: "var(--border)" },
  tabRow: {
    display: "flex",
    borderBottom: "1px solid var(--border)",
    marginBottom: 20,
  },
  tab: {
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.04em",
    transition: "color 0.2s, border-color 0.2s",
  },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  emptyText: {
    textAlign: "center",
    color: "var(--text3)",
    fontSize: 13,
    marginTop: 40,
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "16px 18px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "var(--text1)",
    margin: 0,
  },
  cardDate: {
    fontSize: 11,
    color: "var(--text3)",
    margin: "3px 0 0",
  },
  deleteBtn: {
    background: "none",
    border: "1px solid var(--border)",
    borderRadius: 6,
    color: "var(--text3)",
    fontSize: 11,
    cursor: "pointer",
    padding: "4px 8px",
    lineHeight: 1,
    transition: "color 0.2s, border-color 0.2s",
  },
  cardStats: { display: "flex", flexWrap: "wrap", gap: 6 },
  badge: {
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 8px",
    background: "var(--surface2)",
    borderRadius: 6,
    color: "var(--text2)",
    letterSpacing: "0.02em",
  },
  noteText: {
    fontSize: 12,
    color: "var(--text3)",
    fontStyle: "italic",
    margin: "0 0 10px",
    lineHeight: 1.5,
  },
};
