// src/pages/SearchPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  searchUsersByName,
  getPublicUsers,
  getAllUsers,
} from "../services/firestoreService";
import { useAuth } from "../context/AuthContext";
import PublicProfilePage from "./PublicProfilePage";

/* ── Single user card ── */
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={S.userName}>{user.displayName || user.email?.split("@")[0] || "Anonymous"}</span>
          {(user.currentStreak ?? 0) > 0 && (
            <span style={S.streakBadge}>🔥 {user.currentStreak}d</span>
          )}
          {user.isPublic === false && (
            <span style={{ ...S.streakBadge, background: "rgba(255,255,255,0.06)", color: "var(--text3)", borderColor: "var(--border)" }}>🔒 Private</span>
          )}
        </div>
        {user.bio && (
          <p style={S.userBio}>{user.bio}</p>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
          {(user.totalSessions ?? 0) > 0 && (
            <span style={S.statPill}>{user.totalSessions} sessions</span>
          )}
          {(user.totalMinutes ?? 0) > 0 && (
            <span style={S.statPill}>{Math.round(user.totalMinutes)} min</span>
          )}
          {user.goal && (
            <span style={{ ...S.statPill, color: "var(--teal)", background: "rgba(29,229,200,0.08)", borderColor: "rgba(29,229,200,0.2)" }}>
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

/* ══ SearchPage ══ */
export default function SearchPage() {
  const { user }     = useAuth();
  const [query,      setQuery]      = useState("");
  const [results,    setResults]    = useState([]);
  const [allUsers,   setAllUsers]   = useState([]);  // everyone who logged in with isPublic:true
  const [loading,    setLoading]    = useState(false);
  const [listLoading,setListLoading]= useState(true);
  const [viewUid,    setViewUid]    = useState(null);
  const debounceRef  = useRef(null);

  // Load public users on mount — with fallback to getAllUsers if index missing
  useEffect(() => {
    const load = async () => {
      setListLoading(true);
      try {
        let users = await getPublicUsers(50);

        // If no results (empty collection or index not ready), fall back
        if (users.length === 0) {
          users = await getAllUsers(50);
        }

        // Exclude self
        setAllUsers(users.filter(u => (u.uid || u.id) !== user?.uid));
      } catch (e) {
        console.error("Failed to load users:", e);
      }
      setListLoading(false);
    };
    load();
  }, [user?.uid]);

  // Debounced name search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length < 2) { setResults([]); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchUsersByName(query);
        setResults(res.filter(u => (u.uid || u.id) !== user?.uid));
      } catch (e) {
        // Index not ready yet — filter the already-loaded list client-side
        const term = query.toLowerCase().trim();
        setResults(
          allUsers.filter(u =>
            (u.displayName || "").toLowerCase().includes(term) ||
            (u.email || "").toLowerCase().includes(term)
          )
        );
      }
      setLoading(false);
    }, 350);
  }, [query, user?.uid, allUsers]);

  // Show public profile
  if (viewUid) {
    return <PublicProfilePage uid={viewUid} onBack={() => setViewUid(null)} />;
  }

  const showSearch  = query.trim().length >= 2;
  const displayList = showSearch ? results : allUsers;

  return (
    <div style={S.page}>
      <div style={S.inner}>

        {/* Header */}
        <div style={{ marginBottom: 4 }}>
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
            placeholder="Search by name or email…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button style={S.clearBtn} onClick={() => setQuery("")}>✕</button>
          )}
        </div>

        {/* Section label */}
        <p style={S.sectionLabel}>
          {listLoading || loading
            ? "Loading…"
            : showSearch
              ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
              : `${allUsers.length} member${allUsers.length !== 1 ? "s" : ""}`
          }
        </p>

        {/* User list */}
        {(listLoading && !showSearch) ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)", fontSize: 13 }}>
            Loading members…
          </div>
        ) : displayList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 0", color: "var(--text3)", fontSize: 14 }}>
            {showSearch
              ? `No users found for "${query}"`
              : "No public members yet — log in and your profile will appear here!"
            }
          </div>
        ) : (
          <AnimatePresence>
            {displayList.map(u => (
              <UserCard key={u.uid || u.id} user={u} onClick={setViewUid} />
            ))}
          </AnimatePresence>
        )}

        {/* Tip */}
        <div style={S.tipCard}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--teal)", margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Your profile
          </p>
          <p style={{ fontSize: 12, color: "var(--text3)", margin: 0, lineHeight: 1.65 }}>
            Your profile is public by default. To make it private, go to the Profile page and toggle "Public profile" off.
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
  heading: { fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", color: "var(--text)", margin: "0 0 22px" },

  searchWrap:  { display: "flex", alignItems: "center", gap: 10, background: "var(--bg2)", border: "0.5px solid var(--border2)", borderRadius: 12, padding: "0 14px", marginBottom: 16, height: 48 },
  searchInput: { flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: "var(--text)", fontFamily: "inherit" },
  clearBtn:    { background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 13, padding: "2px 4px" },

  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text3)", margin: "0 0 14px" },

  userCard: {
    display: "flex", alignItems: "center", gap: 14,
    background: "var(--bg2)", border: "0.5px solid var(--border)",
    borderRadius: 14, padding: "16px 18px", marginBottom: 10,
    cursor: "pointer", transition: "border-color 0.2s, transform 0.15s",
  },
  avatar:         { width: 46, height: 46, borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--border2)" },
  avatarFallback: { width: 46, height: 46, borderRadius: "50%", background: "var(--teal)", color: "#07101e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 },
  userName:    { fontSize: 14, fontWeight: 700, color: "var(--text)" },
  userBio:     { fontSize: 12, color: "var(--text3)", margin: 0, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 320 },
  streakBadge: { fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: "rgba(245,158,11,0.12)", color: "var(--amber)", border: "0.5px solid rgba(245,158,11,0.25)" },
  statPill:    { fontSize: 11, color: "var(--text3)", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: 8, padding: "2px 8px" },
  badgePip:    { width: 28, height: 28, borderRadius: 8, background: "var(--surface)", border: "0.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 },

  tipCard: { marginTop: 20, background: "rgba(29,229,200,0.04)", border: "0.5px solid rgba(29,229,200,0.15)", borderRadius: 12, padding: "14px 16px" },
};