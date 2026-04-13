// src/App.js
import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppContextProvider } from "./context/context";
import AuthPage     from "./pages/AuthPage";
import ExercisePage from "./pages/ExercisePage";
import HistoryPage  from "./pages/HistoryPage";
import ProfilePage  from "./pages/ProfilePage";
import SearchPage   from "./pages/SearchPage";
import MyBadgesPage from "./pages/MyBadgesPage";
import LandingPage  from "./components/LandingPage";
import AIRecommendModal from "./components/AIRecommendModal";
import BadgeToast   from "./components/BadgeToast";

const NAV = [
  { id: "home",    label: "Home",    emoji: "🏠" },
  { id: "breathe", label: "Breathe", emoji: "🌬" },
  { id: "history", label: "History", emoji: "📊" },
  { id: "badges",  label: "Badges",  emoji: "🏅" },
  { id: "search",  label: "Search",  emoji: "🔍" },
  { id: "profile", label: "Profile", emoji: "👤" },
];

function AppShell() {
  const { user, logout } = useAuth();
  const [page,         setPage]         = useState("home");
  const [showAI,       setShowAI]       = useState(false);
  const [toast,        setToast]        = useState("");
  const [newBadges,    setNewBadges]    = useState([]); // badge unlock queue

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  // Called by BreathingCircle when badges are unlocked
  const handleBadgesEarned = useCallback((badges) => {
    setNewBadges(badges);
  }, []);

  const clearBadgeToast = useCallback(() => {
    setNewBadges(prev => prev.slice(1));
  }, []);

  if (!user) return <AuthPage />;

  const initials = (user.displayName || user.email || "?").slice(0, 2).toUpperCase();

  return (
    <AppContextProvider uid={user.uid}>
      <div style={S.shell}>

        {/* ── Nav ── */}
        <nav style={S.nav}>
          <div style={S.logo} onClick={() => setPage("home")}>
            <div style={S.logoMark}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#07101e" strokeWidth="2" strokeDasharray="44" strokeDashoffset="11" transform="rotate(-90 9 9)"/>
                <circle cx="9" cy="9" r="3.5" fill="#07101e"/>
              </svg>
            </div>
            <span style={S.logoText}>Breathe<span style={S.acc}>Flow</span></span>
          </div>

          <div style={S.navLinks}>
            {NAV.map(({ id, label, emoji }) => (
              <button key={id} onClick={() => setPage(id)} style={{ ...S.navBtn, ...(page === id ? S.navActive : {}) }}>
                <span style={{ fontSize: 13 }}>{emoji}</span>
                <span>{label}</span>
                {page === id && <div style={S.dot} />}
              </button>
            ))}
          </div>

          <div style={S.navRight}>
            <button style={S.aiChip} onClick={() => setShowAI(true)}>
              <span>✨</span><span>AI Recommend</span>
            </button>
            <button style={S.avatarBtn} onClick={() => setPage("profile")}>
              {user.photoURL
                ? <img src={user.photoURL} alt="avatar" style={S.avatarImg} />
                : <div style={S.avatarFallback}>{initials}</div>
              }
            </button>
            <button style={S.logoutBtn} onClick={logout} title="Sign out">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"/>
              </svg>
            </button>
          </div>
        </nav>

        {/* ── Pages ── */}
        <main style={S.main}>
          <AnimatePresence mode="wait">
            {page === "home" && (
              <motion.div key="home" {...fade} style={{ width: "100%" }}>
                <LandingPage onStart={() => setPage("breathe")} />
              </motion.div>
            )}
            {page === "breathe" && (
              <motion.div key="breathe" {...fade} style={{ width: "100%", height: "100%" }}>
                <ExercisePage onBadgesEarned={handleBadgesEarned} />
              </motion.div>
            )}
            {page === "history" && (
              <motion.div key="history" {...fade} style={{ width: "100%" }}>
                <HistoryPage onUseLevel={level => { setPage("breathe"); showToast(`Loaded "${level.name}"`); }} />
              </motion.div>
            )}
            {page === "badges" && (
              <motion.div key="badges" {...fade} style={{ width: "100%" }}>
                <MyBadgesPage />
              </motion.div>
            )}
            {page === "search" && (
              <motion.div key="search" {...fade} style={{ width: "100%" }}>
                <SearchPage />
              </motion.div>
            )}
            {page === "profile" && (
              <motion.div key="profile" {...fade} style={{ width: "100%" }}>
                <ProfilePage />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* AI Modal */}
        <AnimatePresence>
          {showAI && (
            <AIRecommendModal
              onClose={() => setShowAI(false)}
              onLevelCreated={level => showToast(`✨ "${level.name}" saved!`)}
              onPlayLevel={() => setPage("breathe")}
            />
          )}
        </AnimatePresence>

        {/* Text toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} style={S.toast}>
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge unlock toast */}
        <BadgeToast badges={newBadges} onClear={clearBadgeToast} />

      </div>
    </AppContextProvider>
  );
}

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.18 } };

export default function App() {
  return <AuthProvider><AppShell /></AuthProvider>;
}

const S = {
  shell:    { minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 24px", height: 58, background: "var(--bg2)",
    borderBottom: "0.5px solid var(--border)", position: "sticky", top: 0, zIndex: 200,
  },
  logo:       { display: "flex", alignItems: "center", gap: 9, cursor: "pointer", userSelect: "none" },
  logoMark:   { width: 30, height: 30, borderRadius: 8, background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText:   { fontSize: 15, fontWeight: 800, letterSpacing: "-0.4px", color: "var(--text)" },
  acc:        { color: "var(--teal)" },
  navLinks:   { display: "flex", gap: 2, alignItems: "center" },
  navBtn:     { position: "relative", display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", background: "transparent", fontSize: 12, fontWeight: 500, color: "var(--text2)", cursor: "pointer", transition: "color 0.15s, background 0.15s" },
  navActive:  { color: "var(--text)", background: "var(--surface)" },
  dot:        { position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)", width: 14, height: 2, borderRadius: 2, background: "var(--teal)" },
  navRight:   { display: "flex", alignItems: "center", gap: 8 },
  aiChip:     { display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", background: "rgba(29,229,200,0.1)", border: "0.5px solid rgba(29,229,200,0.25)", borderRadius: 20, color: "var(--teal)", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em" },
  avatarBtn:  { background: "none", border: "none", cursor: "pointer", padding: 0, borderRadius: "50%" },
  avatarImg:  { width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border2)" },
  avatarFallback: { width: 32, height: 32, borderRadius: "50%", background: "var(--teal)", color: "#07101e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 },
  logoutBtn:  { background: "none", border: "none", color: "var(--text3)", cursor: "pointer", padding: "6px", borderRadius: 6, display: "flex", alignItems: "center" },
  main:       { flex: 1, display: "flex", flexDirection: "column" },
  toast:      { position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "var(--bg2)", border: "0.5px solid var(--border2)", borderRadius: 12, padding: "11px 20px", fontSize: 13, fontWeight: 600, color: "var(--text)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)", zIndex: 9998, whiteSpace: "nowrap" },
};