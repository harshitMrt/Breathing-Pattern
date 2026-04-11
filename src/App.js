// src/App.js
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppContextProvider } from "./context/context";
import AuthPage from "./pages/AuthPage";
import ExercisePage from "./pages/ExercisePage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./components/LandingPage";
import AIRecommendModal from "./components/AIRecommendModal";

const NAV = [
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "breathe", label: "Breathe", emoji: "🌬" },
  { id: "history", label: "History", emoji: "📊" },
  { id: "profile", label: "Profile", emoji: "👤" },
];

function AppShell() {
  const { user, userProfile, logout } = useAuth();
  const [page, setPage] = useState("home");
  const [showAI, setShowAI] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  if (!user) return <AuthPage />;

  const avatar = user.photoURL;
  const initials = (user.displayName || user.email || "?")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppContextProvider uid={user.uid}>
      <div style={S.shell}>
        {/* ── NAV ── */}
        <nav style={S.nav}>
          {/* Logo */}
          <div style={S.logo} onClick={() => setPage("home")}>
            <div style={S.logoMark}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle
                  cx="9"
                  cy="9"
                  r="7"
                  stroke="#07101e"
                  strokeWidth="2"
                  strokeDasharray="44"
                  strokeDashoffset="11"
                  transform="rotate(-90 9 9)"
                />
                <circle cx="9" cy="9" r="3.5" fill="#07101e" />
              </svg>
            </div>
            <span style={S.logoText}>
              Breathe<span style={S.logoAccent}>Flow</span>
            </span>
          </div>

          {/* Nav links */}
          <div style={S.navLinks}>
            {NAV.map(({ id, label, emoji }) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                style={{ ...S.navBtn, ...(page === id ? S.navBtnActive : {}) }}
              >
                <span style={{ fontSize: 13 }}>{emoji}</span>
                <span>{label}</span>
                {page === id && <div style={S.navIndicator} />}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div style={S.navRight}>
            <button style={S.aiChip} onClick={() => setShowAI(true)}>
              <span style={{ fontSize: 13 }}>✨</span>
              <span>AI Recommend</span>
            </button>
            <button style={S.avatarBtn} onClick={() => setPage("profile")}>
              {avatar ? (
                <img src={avatar} alt="avatar" style={S.avatarImg} />
              ) : (
                <div style={S.avatarFallback}>{initials}</div>
              )}
            </button>
            <button style={S.logoutBtn} onClick={logout} title="Sign out">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" />
              </svg>
            </button>
          </div>
        </nav>

        {/* ── PAGES ── */}
        <main style={S.main}>
          <AnimatePresence mode="wait">
            {page === "home" && (
              <motion.div key="home" {...fade} style={{ width: "100%" }}>
                <LandingPage onStart={() => setPage("breathe")} />
              </motion.div>
            )}
            {page === "breathe" && (
              <motion.div
                key="breathe"
                {...fade}
                style={{ width: "100%", height: "100%" }}
              >
                <ExercisePage />
              </motion.div>
            )}
            {page === "history" && (
              <motion.div key="history" {...fade} style={{ width: "100%" }}>
                <HistoryPage
                  onUseLevel={(level) => {
                    setPage("breathe");
                    showToast(`Loaded "${level.name}"`);
                  }}
                />
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
              onLevelCreated={(level) => showToast(`✨ "${level.name}" saved!`)}
              onPlayLevel={() => setPage("breathe")}
            />
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={S.toast}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppContextProvider>
  );
}

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

const S = {
  shell: {
    minHeight: "100vh",
    background: "var(--bg)",
    display: "flex",
    flexDirection: "column",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    height: 58,
    background: "var(--bg2)",
    borderBottom: "0.5px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 200,
    backdropFilter: "blur(12px)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    cursor: "pointer",
    userSelect: "none",
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "var(--teal)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 15,
    fontWeight: 800,
    letterSpacing: "-0.4px",
    color: "var(--text)",
  },
  logoAccent: { color: "var(--teal)" },
  navLinks: { display: "flex", gap: 2, alignItems: "center" },
  navBtn: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text2)",
    cursor: "pointer",
    transition: "color 0.15s, background 0.15s",
  },
  navBtnActive: { color: "var(--text)", background: "var(--surface)" },
  navIndicator: {
    position: "absolute",
    bottom: -1,
    left: "50%",
    transform: "translateX(-50%)",
    width: 16,
    height: 2,
    borderRadius: 2,
    background: "var(--teal)",
  },
  navRight: { display: "flex", alignItems: "center", gap: 10 },
  aiChip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    background: "rgba(29,229,200,0.1)",
    border: "0.5px solid rgba(29,229,200,0.25)",
    borderRadius: 20,
    color: "var(--teal)",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.2s",
    letterSpacing: "0.01em",
  },
  avatarBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    borderRadius: "50%",
  },
  avatarImg: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid var(--border2)",
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "var(--teal)",
    color: "#07101e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 800,
  },
  logoutBtn: {
    background: "none",
    border: "none",
    color: "var(--text3)",
    cursor: "pointer",
    padding: "6px",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    transition: "color 0.2s",
  },
  main: { flex: 1, display: "flex", flexDirection: "column" },
  toast: {
    position: "fixed",
    bottom: 28,
    left: "50%",
    transform: "translateX(-50%)",
    background: "var(--bg2)",
    border: "0.5px solid var(--border2)",
    borderRadius: 12,
    padding: "12px 22px",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
    zIndex: 9999,
    whiteSpace: "nowrap",
  },
};
