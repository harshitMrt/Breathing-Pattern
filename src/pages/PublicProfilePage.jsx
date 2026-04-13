// src/pages/PublicProfilePage.jsx
// Shows a single user's public profile — their badges, stats, and custom levels.
// Reached from the Search page when clicking a user card.

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserProfile, getUserBadges, getUserCustomLevels } from "../services/firestoreService";
import { BADGES } from "../services/gamification";

const fmt = (ts) => {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const StatCard = ({ label, value, color }) => (
  <div style={S.statCard}>
    <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: "-0.5px" }}>{value ?? "—"}</div>
    <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
  </div>
);

export default function PublicProfilePage({ uid, onBack }) {
  const [profile,  setProfile]  = useState(null);
  const [badges,   setBadges]   = useState([]);
  const [levels,   setLevels]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!uid) return;
    const load = async () => {
      setLoading(true);
      try {
        const [p, b, l] = await Promise.all([
          getUserProfile(uid),
          getUserBadges(uid),
          getUserCustomLevels(uid),
        ]);
        setProfile(p);
        setBadges(b);
        setLevels(l);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [uid]);

  // Match badge metadata (emoji, desc) from local BADGES list
  const enrichedBadges = badges.map(b => {
    const meta = BADGES.find(x => x.id === b.id) ?? {};
    return { ...meta, ...b };
  });

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text3)" }}>Loading profile…</div>
  );

  if (!profile) return (
    <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text3)" }}>User not found.</div>
  );

  const initials = (profile.displayName || profile.email || "?").slice(0, 2).toUpperCase();

  return (
    <div style={S.page}>
      <div style={S.inner}>

        {/* Back */}
        <button style={S.backBtn} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 2L4 7l5 5"/></svg>
          Back to search
        </button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={S.heroCard}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            {profile.photoURL
              ? <img src={profile.photoURL} alt="avatar" style={S.avatar} />
              : <div style={S.avatarFallback}>{initials}</div>
            }
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={S.heroName}>{profile.displayName || "Anonymous"}</h1>
            {profile.bio && <p style={S.heroBio}>{profile.bio}</p>}
            <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
              {profile.location && (
                <span style={S.heroTag}>📍 {profile.location}</span>
              )}
              <span style={S.heroTag}>📅 Joined {fmt(profile.joinedAt)}</span>
              {profile.goal && (
                <span style={{ ...S.heroTag, background: "rgba(29,229,200,0.1)", color: "var(--teal)", borderColor: "rgba(29,229,200,0.2)" }}>
                  🎯 {profile.goal}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} style={S.statsRow}>
          <StatCard label="Sessions"    value={profile.totalSessions}                   color="var(--blue)"   />
          <div style={S.div} />
          <StatCard label="Minutes"     value={Math.round(profile.totalMinutes ?? 0)}   color="var(--teal)"   />
          <div style={S.div} />
          <StatCard label="Best streak" value={`${profile.longestStreak ?? 0}d`}        color="var(--amber)"  />
          <div style={S.div} />
          <StatCard label="Badges"      value={badges.length}                           color="var(--purple)" />
        </motion.div>

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} style={S.card}>
          <h2 style={S.cardTitle}>Badges earned</h2>
          <div style={S.divider} />
          {enrichedBadges.length === 0 ? (
            <p style={{ color: "var(--text3)", fontSize: 13 }}>No badges yet.</p>
          ) : (
            <div style={S.badgeGrid}>
              {enrichedBadges.map(b => (
                <div key={b.id} style={S.badgeCard}>
                  <div style={S.badgeEmoji}>{b.emoji ?? "🏅"}</div>
                  <div style={S.badgeName}>{b.name}</div>
                  <div style={S.badgeDesc}>{b.desc ?? ""}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Public custom levels */}
        {levels.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} style={S.card}>
            <h2 style={S.cardTitle}>Custom levels ({levels.length})</h2>
            <div style={S.divider} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {levels.map(l => (
                <div key={l.id} style={S.levelRow}>
                  <div style={S.levelDot} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{l.name || l.title}</div>
                    {l.technique && <div style={{ fontSize: 11, color: "var(--teal)", marginTop: 2 }}>{l.technique}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {[["↑", l.inn], l.hold > 0 && ["◆", l.hold], ["↓", l.out], l.hold2 > 0 && ["◆", l.hold2]]
                      .filter(Boolean)
                      .map(([sym, val], i) => (
                        <span key={i} style={S.badge}>{sym} {val}s</span>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

const S = {
  page:    { background: "var(--bg)", minHeight: "calc(100vh - 58px)", padding: "32px 0 60px" },
  inner:   { maxWidth: 800, margin: "0 auto", padding: "0 28px", display: "flex", flexDirection: "column", gap: 18 },
  backBtn: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--text3)", fontSize: 13, cursor: "pointer", padding: "4px 0", marginBottom: 4, fontWeight: 500 },

  heroCard:       { background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: 18, padding: "28px", display: "flex", alignItems: "flex-start", gap: 22 },
  avatar:         { width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border2)" },
  avatarFallback: { width: 64, height: 64, borderRadius: "50%", background: "var(--teal)", color: "#07101e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800 },
  heroName: { fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text)", margin: 0 },
  heroBio:  { fontSize: 13, color: "var(--text2)", margin: "6px 0 0", lineHeight: 1.65 },
  heroTag:  { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 500, color: "var(--text2)", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: 20, padding: "4px 10px" },

  statsRow: { display: "flex", alignItems: "center", justifyContent: "space-around", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: 14, padding: "18px 0" },
  statCard: { textAlign: "center", padding: "0 16px" },
  div:      { width: 1, height: 32, background: "var(--border)" },

  card:      { background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: 16, padding: "22px 24px" },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0 },
  divider:   { height: "0.5px", background: "var(--border)", margin: "14px 0" },

  badgeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 },
  badgeCard: { background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "16px 12px", textAlign: "center" },
  badgeEmoji:{ fontSize: 28, marginBottom: 8 },
  badgeName: { fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  badgeDesc: { fontSize: 10, color: "var(--text3)", lineHeight: 1.5 },

  levelRow:  { display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "0.5px solid var(--border)" },
  levelDot:  { width: 8, height: 8, borderRadius: "50%", background: "var(--teal)", flexShrink: 0 },
  badge:     { fontSize: 10, fontWeight: 600, padding: "3px 8px", background: "var(--surface)", borderRadius: 6, color: "var(--text2)" },
};