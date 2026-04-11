// src/App.js
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import HistoryPage from "./pages/HistoryPage";
import AIRecommendModal from "./components/AIRecommendModal";

// Your existing main breathing page — import it here
// import MainPage from "./pages/MainPage";

const NAV_ITEMS = [
  { id: "breathe", label: "Breathe", icon: "🌬" },
  { id: "history", label: "History", icon: "📊" },
];

function AppShell() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState("breathe");
  const [showAI, setShowAI] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleLevelCreated = (level) => {
    showToast(`✨ "${level.name}" saved to My Levels!`);
    // If you want to automatically load the new level into the breathing UI,
    // call your context setter here, e.g.: addCustomLevel(level)
  };

  if (!user) return <AuthPage />;

  return (
    <div style={styles.shell}>
      {/* Top nav */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.navLogo}>
            <svg width="22" height="22" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="var(--teal)"
                strokeWidth="2.5"
                strokeDasharray="87.96"
                strokeDashoffset="22"
                transform="rotate(-90 18 18)"
              />
              <circle cx="18" cy="18" r="7" fill="rgba(29,229,200,0.2)" />
            </svg>
            <span style={styles.navLogoText}>Breathe</span>
          </div>
        </div>

        <div style={styles.navCenter}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                ...styles.navBtn,
                color: page === item.id ? "var(--text1)" : "var(--text3)",
                background:
                  page === item.id ? "var(--surface2)" : "transparent",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div style={styles.navRight}>
          {/* AI Recommend button */}
          <button style={styles.aiBtn} onClick={() => setShowAI(true)}>
            <span>✨</span>
            <span>AI Recommend</span>
          </button>

          {/* User avatar + logout */}
          <div style={styles.avatarWrap}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="avatar" style={styles.avatar} />
            ) : (
              <div style={styles.avatarFallback}>
                {(user.displayName || user.email || "?")[0].toUpperCase()}
              </div>
            )}
            <button style={styles.logoutBtn} onClick={logout} title="Sign out">
              ↩
            </button>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main style={styles.main}>
        <AnimatePresence mode="wait">
          {page === "breathe" && (
            <motion.div
              key="breathe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/*
                👇 Replace this placeholder with your actual breathing UI component.
                   Pass isRunning, onToggle, index etc. as you normally do.
              */}
              <div
                style={{
                  textAlign: "center",
                  color: "var(--text3)",
                  paddingTop: 80,
                }}
              >
                <p style={{ fontSize: 14 }}>
                  Mount your existing breathing UI here.
                </p>
                <p style={{ fontSize: 12, marginTop: 8 }}>
                  Import your MainPage / BreathingCircle and drop it in.
                </p>
              </div>
            </motion.div>
          )}

          {page === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HistoryPage
                onUseLevel={(level) => {
                  // Load this level into your breathing context, then navigate
                  // e.g.: setActiveLevel(level); setPage("breathe");
                  setPage("breathe");
                  showToast(`Loaded "${level.name}"`);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI Modal */}
      <AnimatePresence>
        {showAI && (
          <AIRecommendModal
            onClose={() => setShowAI(false)}
            onLevelCreated={handleLevelCreated}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={styles.toast}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

const styles = {
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
    padding: "0 24px",
    height: 60,
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLeft: { display: "flex", alignItems: "center", minWidth: 120 },
  navLogo: { display: "flex", alignItems: "center", gap: 8 },
  navLogoText: {
    fontSize: 16,
    fontWeight: 800,
    color: "var(--text1)",
    letterSpacing: "-0.5px",
  },
  navCenter: { display: "flex", gap: 4 },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.01em",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 120,
    justifyContent: "flex-end",
  },
  aiBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    background: "rgba(29,229,200,0.12)",
    border: "1px solid rgba(29,229,200,0.3)",
    borderRadius: 8,
    color: "var(--teal)",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "background 0.2s",
  },
  avatarWrap: { display: "flex", alignItems: "center", gap: 6 },
  avatar: { width: 30, height: 30, borderRadius: "50%", objectFit: "cover" },
  avatarFallback: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "var(--teal)",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
  },
  logoutBtn: {
    background: "none",
    border: "none",
    color: "var(--text3)",
    fontSize: 16,
    cursor: "pointer",
    padding: "2px 4px",
  },
  main: {
    flex: 1,
    maxWidth: 800,
    margin: "0 auto",
    width: "100%",
    padding: "32px 24px",
  },
  toast: {
    position: "fixed",
    bottom: 28,
    left: "50%",
    transform: "translateX(-50%)",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "12px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text1)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    whiteSpace: "nowrap",
    zIndex: 2000,
  },
};
