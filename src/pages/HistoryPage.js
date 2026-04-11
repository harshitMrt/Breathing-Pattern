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

const fmt = (ts) => {
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

const Stat = ({ label, value, color }) => (
  <div style={{ textAlign: "center" }}>
    <div
      style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: "-0.5px" }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: 10,
        color: "var(--text3)",
        marginTop: 4,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, l] = await Promise.all([
          getUserSessions(user.uid),
          getUserCustomLevels(user.uid),
        ]);
        setSessions(s);
        setLevels(l);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load(); // ← was missing before
  }, [user.uid]);

  const totalMins = sessions.reduce((a, s) => a + (s.durationMinutes ?? 0), 0);
  const totalCycles = sessions.reduce((a, s) => a + (s.cycles ?? 0), 0);

  return (
    <div style={S.page}>
      <div style={S.inner}>
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <p style={S.eyebrow}>Your progress</p>
          <h1 style={S.heading}>Breathing history</h1>
        </div>

        {/* Stats */}
        <div style={S.statsCard}>
          <Stat label="Sessions" value={sessions.length} color="var(--blue)" />
          <div style={S.div} />
          <Stat
            label="Total mins"
            value={Math.round(totalMins)}
            color="var(--teal)"
          />
          <div style={S.div} />
          <Stat label="Cycles" value={totalCycles} color="var(--purple)" />
          <div style={S.div} />
          <Stat label="My levels" value={levels.length} color="var(--amber)" />
        </div>

        {/* Tabs */}
        <div style={S.tabRow}>
          {["Sessions", "My Levels"].map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              style={{
                ...S.tab,
                color: tab === i ? "var(--text)" : "var(--text3)",
                borderBottom:
                  tab === i ? "2px solid var(--teal)" : "2px solid transparent",
              }}
            >
              {t}
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 11,
                  padding: "1px 7px",
                  borderRadius: 10,
                  background:
                    tab === i ? "rgba(29,229,200,0.12)" : "var(--surface)",
                  color: tab === i ? "var(--teal)" : "var(--text3)",
                }}
              >
                {i === 0 ? sessions.length : levels.length}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "var(--text3)",
            }}
          >
            Loading…
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {tab === 0 ? (
              <motion.div
                key="s"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {sessions.length === 0 ? (
                  <div style={S.empty}>No sessions yet — go breathe! 🌬</div>
                ) : (
                  sessions.map((s) => (
                    <div key={s.id} style={S.card}>
                      <div style={S.cardLeft}>
                        <div style={S.cardDot} />
                        <div>
                          <p style={S.cardTitle}>{s.levelName ?? "Session"}</p>
                          <p style={S.cardMeta}>{fmt(s.createdAt)}</p>
                        </div>
                      </div>
                      <div style={S.badgeRow}>
                        <span style={S.badge}>↑ {s.inn}s</span>
                        {s.hold > 0 && <span style={S.badge}>◆ {s.hold}s</span>}
                        <span style={S.badge}>↓ {s.out}s</span>
                        {s.hold2 > 0 && (
                          <span style={S.badge}>◆ {s.hold2}s</span>
                        )}
                        <span
                          style={{
                            ...S.badge,
                            background: "rgba(29,229,200,0.1)",
                            color: "var(--teal)",
                          }}
                        >
                          {s.durationMinutes ?? "?"} min
                        </span>
                        <span
                          style={{
                            ...S.badge,
                            background: "rgba(139,92,246,0.1)",
                            color: "var(--purple)",
                          }}
                        >
                          {s.cycles ?? "?"} cycles
                        </span>
                      </div>
                      <button
                        style={S.delBtn}
                        onClick={async () => {
                          await deleteSession(s.id);
                          setSessions((p) => p.filter((x) => x.id !== s.id));
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="l"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {levels.length === 0 ? (
                  <div style={S.empty}>
                    No custom levels yet — use AI Recommend ✨
                  </div>
                ) : (
                  levels.map((l) => (
                    <div key={l.id} style={S.card}>
                      <div style={S.cardLeft}>
                        <div
                          style={{ ...S.cardDot, background: "var(--teal)" }}
                        />
                        <div>
                          <p style={S.cardTitle}>{l.name || l.title}</p>
                          {l.technique && (
                            <p style={{ ...S.cardMeta, color: "var(--teal)" }}>
                              {l.technique}
                            </p>
                          )}
                          <p style={S.cardMeta}>{fmt(l.createdAt)}</p>
                        </div>
                      </div>
                      <div style={S.badgeRow}>
                        <span style={S.badge}>↑ {l.inn}s</span>
                        {l.hold > 0 && <span style={S.badge}>◆ {l.hold}s</span>}
                        <span style={S.badge}>↓ {l.out}s</span>
                        {l.hold2 > 0 && (
                          <span style={S.badge}>◆ {l.hold2}s</span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        {onUseLevel && (
                          <button
                            style={{
                              ...S.delBtn,
                              color: "var(--teal)",
                              borderColor: "var(--teal)",
                            }}
                            onClick={() => onUseLevel(l)}
                          >
                            ▶
                          </button>
                        )}
                        <button
                          style={S.delBtn}
                          onClick={async () => {
                            await deleteCustomLevel(l.id);
                            setLevels((p) => p.filter((x) => x.id !== l.id));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

const S = {
  page: {
    background: "var(--bg)",
    minHeight: "calc(100vh - 58px)",
    padding: "36px 0 60px",
  },
  inner: { maxWidth: 800, margin: "0 auto", padding: "0 28px" },
  eyebrow: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--teal)",
    margin: "0 0 5px",
  },
  heading: {
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: "-0.8px",
    margin: "0 0 24px",
    color: "var(--text)",
  },
  statsCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    background: "var(--bg2)",
    border: "0.5px solid var(--border)",
    borderRadius: 16,
    padding: "20px 0",
    marginBottom: 28,
  },
  div: { width: 1, height: 36, background: "var(--border)" },
  tabRow: {
    display: "flex",
    borderBottom: "0.5px solid var(--border)",
    marginBottom: 20,
    gap: 4,
  },
  tab: {
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "10px 4px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.02em",
    marginRight: 20,
    transition: "color 0.2s",
  },
  empty: {
    textAlign: "center",
    color: "var(--text3)",
    fontSize: 14,
    padding: "60px 0",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    background: "var(--bg2)",
    border: "0.5px solid var(--border)",
    borderRadius: 14,
    padding: "16px 18px",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  cardLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 160,
  },
  cardDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "var(--blue)",
    flexShrink: 0,
  },
  cardTitle: { fontSize: 14, fontWeight: 600, color: "var(--text)", margin: 0 },
  cardMeta: { fontSize: 11, color: "var(--text3)", margin: "3px 0 0" },
  badgeRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  badge: {
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 9px",
    background: "var(--surface)",
    borderRadius: 6,
    color: "var(--text2)",
  },
  delBtn: {
    background: "none",
    border: "0.5px solid var(--border)",
    borderRadius: 6,
    color: "var(--text3)",
    fontSize: 11,
    cursor: "pointer",
    padding: "5px 9px",
    flexShrink: 0,
  },
};
