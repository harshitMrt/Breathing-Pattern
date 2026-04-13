// src/pages/MyBadgesPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { BADGES } from "../services/gamification";
import { getUserBadges, getUserProfile } from "../services/firestoreService";

export default function MyBadgesPage() {
  const { user }  = useAuth();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStats(null);
    setLoading(true);

    if (!user) {
      setLoading(false);
      return;
    }

    // Load both badges and stats from Firestore in parallel
    Promise.all([
      getUserBadges(user.uid),
      getUserProfile(user.uid),
    ])
      .then(([firestoreBadges, firestoreStats]) => {
        setStats({
          ...(firestoreStats ?? {}),
          // Support both {id: "..."} objects and plain string arrays
          unlockedBadgeIds: firestoreBadges.map(b => (typeof b === "string" ? b : b.id)),
        });
      })
      .catch(err => {
        console.error("Failed to load badges from Firestore:", err);
        setStats({ unlockedBadgeIds: [] });
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

  const unlocked      = stats?.unlockedBadgeIds ?? [];
  const unlockedCount = unlocked.length;
  const totalCount    = BADGES.length;
  const pct           = Math.round((unlockedCount / totalCount) * 100);

  const streakText = stats?.currentStreak > 0
    ? `${stats.currentStreak}-day streak 🔥`
    : "No active streak";

  return (
    <div style={S.page}>
      <div style={S.inner}>

        {/* Header */}
        <div style={{ marginBottom: 4 }}>
          <p style={S.eyebrow}>Achievement system</p>
          <h1 style={S.heading}>My Badges</h1>
        </div>

        {/* Progress overview */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          style={S.overviewCard}
        >
          <div style={S.overviewLeft}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "var(--teal)", letterSpacing: "-1px" }}>
              {unlockedCount}
              <span style={{ fontSize: 18, color: "var(--text3)", fontWeight: 400 }}>
                /{totalCount}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>badges earned</div>
          </div>

          <div style={{ flex: 1 }}>
            {/* Progress bar */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>Progress</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--teal)" }}>{pct}%</span>
            </div>
            <div style={{ height: 6, background: "var(--surface)", borderRadius: 3, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ height: "100%", background: "var(--teal)", borderRadius: 3 }}
              />
            </div>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
              {[
                { label: "Sessions", val: stats?.totalSessions ?? 0 },
                { label: "Minutes",  val: Math.round(stats?.totalMinutes ?? 0) },
                { label: "Streak",   val: streakText },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{val}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Badge grid */}
        <div style={S.badgeGrid}>
          {BADGES.map((badge, i) => {
            const earned = unlocked.includes(badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  ...S.badgeCard,
                  opacity:    earned ? 1 : 0.4,
                  background: earned ? "var(--bg2)" : "var(--surface)",
                  border:     earned
                    ? "0.5px solid rgba(29,229,200,0.25)"
                    : "0.5px solid var(--border)",
                }}
              >
                {!earned && (
                  <div style={S.lockOverlay}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                      stroke="var(--text3)" strokeWidth="1.4" strokeLinecap="round">
                      <rect x="2" y="6" width="10" height="7" rx="2" />
                      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" />
                    </svg>
                  </div>
                )}

                <div style={{ fontSize: earned ? 28 : 22, marginBottom: 8, filter: earned ? "none" : "grayscale(1)" }}>
                  {badge.emoji}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: earned ? "var(--text)" : "var(--text3)", marginBottom: 4, textAlign: "center" }}>
                  {badge.name}
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)", lineHeight: 1.55, textAlign: "center" }}>
                  {badge.desc}
                </div>
                {earned && <div style={S.earnedDot} />}
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

const S = {
  page:    { background: "var(--bg)", minHeight: "calc(100vh - 58px)", padding: "36px 0 60px" },
  inner:   { maxWidth: 860, margin: "0 auto", padding: "0 28px" },
  eyebrow: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--teal)", margin: "0 0 5px" },
  heading: { fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", color: "var(--text)", margin: "0 0 22px" },

  overviewCard: {
    background:   "var(--bg2)",
    border:       "0.5px solid var(--border)",
    borderRadius: 16,
    padding:      "24px 24px",
    display:      "flex",
    gap:          28,
    alignItems:   "flex-start",
    marginBottom: 24,
  },
  overviewLeft: { minWidth: 80, textAlign: "center" },

  badgeGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap:                 12,
  },
  badgeCard: {
    borderRadius:  14,
    padding:       "20px 14px 16px",
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    position:      "relative",
    transition:    "all 0.2s",
    overflow:      "hidden",
  },
  lockOverlay: {
    position:       "absolute",
    top:            8,
    right:          8,
    width:          22,
    height:         22,
    borderRadius:   6,
    background:     "var(--surface)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
  },
  earnedDot: {
    position:     "absolute",
    top:          8,
    right:        8,
    width:        8,
    height:       8,
    borderRadius: "50%",
    background:   "var(--teal)",
    boxShadow:    "0 0 6px rgba(29,229,200,0.5)",
  },
};