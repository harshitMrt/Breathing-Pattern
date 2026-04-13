// src/pages/SearchPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchUsersByName, getPublicUsers } from "../services/firestoreService";
import { useAuth } from "../context/AuthContext";
import PublicProfilePage from "./PublicProfilePage";

const UserCard = ({ user, onClick }) => {
  const initials = (user.displayName || user.email || "?").slice(0, 2).toUpperCase();
  const badges   = user.badges ?? [];
  const top3     = badges.slice(0, 3);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.012 }}
      onClick={() => onClick(user.uid || user.id)}
      style={S.userCard}
    >
      {/* Avatar */}
      <div style={{ flexShrink: 0 }}>
        {user.photoURL
          ? <img src={user.photoURL} alt="avatar" style={S.avatar} />
          : <div style={S.avatarFallback}>{initials}</div>
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={S.userName}>{user.displayName || "Anonymous"}</span>
          {user.currentStreak > 0 && (
            <span style={S.streakBadge}>🔥 {user.currentStreak}d</span>
          )}
        </div>
        {user.bio && <p style={S.userBio}>{user.bio}</p>}
        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
          {user.totalSessions > 0 && (
            <span style={S.statPill}>{user.totalSessions} sessions</span>
          )}
          {user.totalMinutes > 0 && (
            <span style={S.statPill}>{Math.round(user.totalMinutes)} min</span>
          )}
          {user.goal && (
            <span style={{ ...S.statPill, color: "var(--teal)", background: "rgba(29,229,200,0.08)", border: "0.5px solid rgba(29,229,200,0.2)" }}>
              🎯 {user.goal}
            </span>
          )}
        </div>
      </div>

      {/* Top badges */}
      {top3.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {top3.map(b => (
            <div key={b.id} title={b.name} style={S.badgePip}>{b.emoji}</div>
          ))}
        </div>
      )}

      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <path d="M5 2l5 5-5 5"/>
      </svg>
    </motion.div>
  );
};

export default function SearchPage() {
  const { user }  = useAuth();
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewUid, setViewUid] = useState(null); // when set, show public profile
  const debounceRef = useRef(null);

  // Load popular users on mount
  useEffect(() => {
    getPublicUsers(12)
      .then(users => setPopular(users.filter(u => (u.uid || u.id) !== user?.uid)))
      .catch(console.error);
  }, [user?.uid]);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchUsersByName(query);
        setResults(res.filter(u => (u.uid || u.id) !== user?.uid));
      } catch (e) { console.error(e); }
      setLoading(false);
    }, 350);
  }, [query, user?.uid]);

  // Viewing a public profile
  if (viewUid) {
    return <PublicProfilePage uid={viewUid} onBack={() => setViewUid(null)} />;
  }

  const showResults = query.trim().length >= 2;

  return (
    <div style={S.page}>
      <div style={S.inner}>

        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <p style={S.eyebrow}>Community</p>
          <h1 style={S.heading}>Find breathers</h1>
        </div>

        {/* Search bar */}
        <div style={S.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/>
          </svg>
          <input
            style={S.searchInput}
            placeholder="Search by name…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button style={S.clearBtn} onClick={() => setQuery("")}>✕</button>
          )}
        </div>

        {/* Search results */}
        {showResults && (
          <div>
            <p style={S.sectionLabel}>
              {loading ? "Searching…" : `${results.length} result${results.length !== 1 ? "s" : ""}`}
            </p>
            <AnimatePresence>
              {!loading && results.length === 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "var(--text3)", fontSize: 14, textAlign: "center", padding: "40px 0" }}>
                  No users found for "{query}"
                </motion.p>
              )}
              {results.map(u => (
                <UserCard key={u.uid || u.id} user={u} onClick={setViewUid} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Popular / active users */}
        {!showResults && (
          <div>
            <p style={S.sectionLabel}>Most active breathers</p>
            {popular.length === 0 ? (
              <p style={{ color: "var(--text3)", fontSize: 13, textAlign: "center", padding: "40px 0" }}>
                No public profiles yet. Be the first!
              </p>
            ) : (
              <AnimatePresence>
                {popular.map(u => (
                  <UserCard key={u.uid || u.id} user={u} onClick={setViewUid} />
                ))}
              </AnimatePresence>
            )}
          </div>
        )}

        {/* Make profile public tip */}
        <div style={S.tipCard}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--teal)", margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Appear in search
          </p>
          <p style={{ fontSize: 12, color: "var(--text3)", margin: 0, lineHeight: 1.65 }}>
            Go to your Profile page and enable "Public profile" to appear in search results and the leaderboard.
          </p>
        </div>

      </div>
    </div>
  );
}

const S = {
  page:    { background: "var(--bg)", minHeight: "calc(100vh - 58px)", padding: "36px 0 60px" },
  inner:   { maxWidth: 700, margin: "0 auto", padding: "0 28px" },
  eyebrow: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--teal)", margin: "0 0 5px" },
  heading: { fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", color: "var(--text)", margin: "0 0 24px" },

  searchWrap:  { display: "flex", alignItems: "center", gap: 10, background: "var(--bg2)", border: "0.5px solid var(--border2)", borderRadius: 12, padding: "0 14px", marginBottom: 24, height: 48 },
  searchInput: { flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: "var(--text)", fontFamily: "inherit" },
  clearBtn:    { background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 13, padding: "2px 4px" },

  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text3)", margin: "0 0 14px" },

  userCard: {
    display: "flex", alignItems: "center", gap: 14,
    background: "var(--bg2)", border: "0.5px solid var(--border)",
    borderRadius: 14, padding: "16px 18px", marginBottom: 10,
    cursor: "pointer", transition: "border-color 0.2s",
  },
  avatar:         { width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--border2)" },
  avatarFallback: { width: 44, height: 44, borderRadius: "50%", background: "var(--teal)", color: "#07101e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 },
  userName:    { fontSize: 14, fontWeight: 700, color: "var(--text)" },
  userBio:     { fontSize: 12, color: "var(--text3)", margin: 0, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 320 },
  streakBadge: { fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: "rgba(245,158,11,0.12)", color: "var(--amber)", border: "0.5px solid rgba(245,158,11,0.25)" },
  statPill:    { fontSize: 11, color: "var(--text3)", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: 8, padding: "2px 8px" },
  badgePip:    { width: 28, height: 28, borderRadius: 8, background: "var(--surface)", border: "0.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 },

  tipCard: { marginTop: 16, background: "rgba(29,229,200,0.04)", border: "0.5px solid rgba(29,229,200,0.15)", borderRadius: 12, padding: "14px 16px" },
};