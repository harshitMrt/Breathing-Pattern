// src/pages/BadgesPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { BADGES } from "../hooks/useGamification";
import { getUserBadges, getUserStats } from "../services/firestoreService";

// ─────────────────────────────────────────────────────────
//  Shared icon renderer — used here AND in BadgeToast
// ─────────────────────────────────────────────────────────
export const BadgeIcon = ({ icon, color, size = 18 }) => {
  const s = { width: size, height: size };
  const stroke = color;
  const sw = "1.5";
  const sl = "round";

  switch (icon) {
    case "leaf":
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap={sl}>
          <path d="M3 17C3 17 5 10 12 7C16 5 18 3 18 3C18 3 18 7 15 11C12 15 7 17 3 17Z" />
          <path d="M3 17L10 10" />
        </svg>
      );
    case "fire":
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap={sl} strokeLinejoin="round">
          <path d="M10 2C10 2 6 6 6 10C6 12.8 7.6 14.4 9 15C8.5 13.5 9 12 10 11C11 12 11.5 13.5 11 15C12.4 14.4 14 12.8 14 10C14 6 10 2 10 2Z" fill={color + "33"} />
          <circle cx="10" cy="15.5" r="1.5" fill={color} stroke="none" />
        </svg>
      );
    case "star":
      return (
        <svg {...s} viewBox="0 0 20 20" fill={color + "33"} stroke={stroke} strokeWidth={sw} strokeLinecap={sl} strokeLinejoin="round">
          <path d="M10 2l2.4 5 5.6.8-4 4 .9 5.5L10 14.5l-4.9 2.8.9-5.5-4-4 5.6-.8z" />
        </svg>
      );
    case "crown":
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap={sl} strokeLinejoin="round">
          <path d="M3 15l2-8 5 4 5-4 2 8H3z" fill={color + "22"} />
          <circle cx="3" cy="7" r="1.2" fill={color} stroke="none" />
          <circle cx="10" cy="4" r="1.2" fill={color} stroke="none" />
          <circle cx="17" cy="7" r="1.2" fill={color} stroke="none" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...s} viewBox="0 0 20 20" fill={color + "33"} stroke={stroke} strokeWidth={sw} strokeLinecap={sl} strokeLinejoin="round">
          <path d="M12 2L5 11h7l-3 7 11-11h-7z" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap={sl}>
          <path d="M7 17h6M10 14v3M6 3H3v4c0 2.2 1.8 4 4 4" />
          <path d="M14 3h3v4c0 2.2-1.8 4-4 4" />
          <path d="M6 3h8v6a4 4 0 01-8 0V3z" fill={color + "22"} />
        </svg>
      );
    case "clock":
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap={sl}>
          <circle cx="10" cy="10" r="8" />
          <path d="M10 6v4l3 2.5" />
        </svg>
      );
    case "moon":
      return (
        <svg {...s} viewBox="0 0 20 20" fill={color + "22"} stroke={stroke} strokeWidth={sw} strokeLinecap={sl}>
          <path d="M17 14.5A8 8 0 019.5 3 7 7 0 1017 14.5z" />
        </svg>
      );
    case "owl":
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap={sl}>
          <ellipse cx="10" cy="11" rx="6" ry="7" fill={color + "22"} />
          <circle cx="7.5" cy="10" r="2" />
          <circle cx="12.5" cy="10" r="2" />
          <circle cx="7.5" cy="10" r="0.8" fill={color} stroke="none" />
          <circle cx="12.5" cy="10" r="0.8" fill={color} stroke="none" />
          <path d="M8.5 14.5Q10 15.5 11.5 14.5" />
          <path d="M7 5.5C7 5.5 6 3 4 3M13 5.5C13 5.5 14 3 16 3" />
        </svg>
      );
    case "sun":
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap={sl}>
          <circle cx="10" cy="10" r="3.5" fill={color + "33"} />
          <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.1 4.1l1.4 1.4M14.5 14.5l1.4 1.4M4.1 15.9l1.4-1.4M14.5 5.5l1.4-1.4" />
        </svg>
      );
    case "check":
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap={sl} strokeLinejoin="round">
          <circle cx="10" cy="10" r="8" fill={color + "22"} />
          <path d="M6 10l3 3 5-5" />
        </svg>
      );
    case "medal":
      return (
        <svg {...s} viewBox="0 0 20 20" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap={sl}>
          <circle cx="10" cy="13" r="5" fill={color + "22"} />
          <path d="M7 2l3 5 3-5" />
          <path d="M6.5 7C6.5 7 5 8 5 8.5" />
          <path d="M13.5 7C13.5 7 15 8 15 8.5" />
        </svg>
      );
    default:
      return (
        <svg {...s} viewBox="0 0 20 20" fill={color + "33"} stroke={stroke} strokeWidth={sw}>
          <circle cx="10" cy="10" r="8" />
        </svg>
      );
  }
};

// ─────────────────────────────────────────────────────────
//  STATS ROW
// ─────────────────────────────────────────────────────────
const StatCard = ({ value, label }) => (
  <div
    style={{
      background: "var(--bg2)",
      border: "0.5px solid var(--border)",
      borderRadius: 12,
      padding: "14px 16px",
      textAlign: "center",
      flex: 1,
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--teal)" }}>
      {value}
    </div>
    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>{label}</div>
  </div>
);

// ─────────────────────────────────────────────────────────
//  CHALLENGE TRACKER
// ─────────────────────────────────────────────────────────
const ChallengeCard = ({ stats, onStart }) => {
  const total  = 30;
  const done   = Math.min(stats.challengeDaysDone || 0, total);
  const pct    = Math.round((done / total) * 100);
  const active = !!stats.challengeStartDate;

  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "0.5px solid var(--border2)",
        borderRadius: 16,
        padding: "20px 22px",
        marginBottom: 28,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--teal)", margin: "0 0 3px" }}>
            Active challenge
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.2px" }}>
            30-day calm program
          </p>
        </div>
        {active ? (
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--teal)", background: "rgba(29,229,200,0.10)", border: "0.5px solid rgba(29,229,200,0.25)", borderRadius: 20, padding: "4px 12px" }}>
            Day {done} / {total}
          </span>
        ) : (
          <button
            onClick={onStart}
            style={{
              background: "var(--teal)", color: "#07101e", border: "none",
              borderRadius: 20, padding: "7px 18px", fontSize: 12,
              fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Start challenge
          </button>
        )}
      </div>

      {/* progress bar */}
      <div style={{ height: 6, background: "var(--surface)", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: "100%", background: "var(--teal)", borderRadius: 99 }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", marginBottom: 14 }}>
        <span>{done} days done</span>
        <span>{total - done} remaining</span>
      </div>

      {/* day dots */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {Array.from({ length: total }).map((_, i) => {
          const dayNum  = i + 1;
          const isDone  = dayNum <= done;
          const isToday = dayNum === done + 1 && active;
          return (
            <div
              key={dayNum}
              style={{
                width: 22, height: 22, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 600,
                background: isDone  ? "rgba(29,229,200,0.18)" : isToday ? "var(--teal)" : "var(--surface)",
                color:      isDone  ? "var(--teal)"           : isToday ? "#07101e"     : "var(--text3)",
                border:     isToday ? "none" : isDone ? "0.5px solid rgba(29,229,200,0.3)" : "0.5px solid var(--border)",
              }}
            >
              {dayNum}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
//  BADGE CARD
// ─────────────────────────────────────────────────────────
const BadgeCard = ({ badge, unlocked }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   unlocked ? (hovered ? badge.bg : "var(--bg2)") : "var(--bg2)",
        border:       unlocked ? `0.5px solid ${badge.color}44` : "0.5px solid var(--border)",
        borderRadius: 14,
        padding:      "18px 14px",
        textAlign:    "center",
        opacity:      unlocked ? 1 : 0.35,
        transition:   "all 0.22s",
        cursor:       unlocked ? "default" : "not-allowed",
      }}
    >
      <div
        style={{
          width: 48, height: 48, borderRadius: "50%",
          background: unlocked ? badge.bg : "var(--surface)",
          border:     unlocked ? `0.5px solid ${badge.color}44` : "0.5px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 10px",
        }}
      >
        <BadgeIcon icon={badge.icon} color={unlocked ? badge.color : "var(--text3)"} size={22} />
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: unlocked ? "var(--text)" : "var(--text3)", margin: "0 0 3px", letterSpacing: "-0.1px" }}>
        {badge.name}
      </p>
      <p style={{ fontSize: 11, color: "var(--text3)", margin: 0, lineHeight: 1.45 }}>
        {badge.desc}
      </p>
      {unlocked && (
        <div style={{ marginTop: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: badge.color }}>
          Unlocked
        </div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────────────────
const BadgesPage = ({ onStartChallenge }) => {
  const { user } = useAuth();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStats(null);
    setLoading(true);

    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch everything from Firestore — no localStorage involved
    Promise.all([
      getUserBadges(user.uid),
      getUserStats(user.uid),
    ])
      .then(([firestoreBadges, firestoreStats]) => {
        setStats({
          ...(firestoreStats ?? {}),
          // Support both plain string arrays and {id} object arrays
          unlockedBadges: firestoreBadges.map(b => (typeof b === "string" ? b : b.id)),
        });
      })
      .catch(err => {
        console.error("Failed to load badges from Firestore:", err);
        setStats({ unlockedBadges: [] });
      })
      .finally(() => setLoading(false));
  }, [user]);

  /* ── Guards ── */
  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text3)" }}>
      Loading…
    </div>
  );

  if (!user) return (
    <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text3)" }}>
      Please log in to view your badges.
    </div>
  );

  const unlockedSet   = new Set(stats?.unlockedBadges ?? []);
  const unlockedCount = unlockedSet.size;
  const totalMinStr   = (stats?.totalMinutes ?? 0) >= 60
    ? `${Math.floor(stats.totalMinutes / 60)}h ${Math.round(stats.totalMinutes % 60)}m`
    : `${Math.round(stats?.totalMinutes ?? 0)}m`;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "36px 24px 48px" }}>

      {/* header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--teal)", margin: "0 0 6px" }}>
          Achievements
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 4px" }}>
          Badges & Challenges
        </h1>
        <p style={{ fontSize: 13, color: "var(--text2)", margin: 0 }}>
          {unlockedCount} of {BADGES.length} badges unlocked
        </p>
      </div>

      {/* stats row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        <StatCard value={stats?.currentStreak ?? 0} label="Day streak"     />
        <StatCard value={stats?.totalSessions  ?? 0} label="Sessions"      />
        <StatCard value={totalMinStr}                label="Total breathed" />
        <StatCard value={stats?.longestStreak  ?? 0} label="Best streak"   />
      </div>

      {/* challenge card */}
      <ChallengeCard stats={stats ?? {}} onStart={onStartChallenge} />

      {/* badges */}
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text3)", margin: "0 0 14px" }}>
        Your badges
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
        {BADGES.map(badge => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            unlocked={unlockedSet.has(badge.id)}
          />
        ))}
      </div>

    </div>
  );
};

export default BadgesPage;