// src/App.js
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppContextProvider } from "./context/context";
import PublicHome from "./components/PublicHome";
import AuthPage from "./pages/AuthPage";
import ExercisePage from "./pages/ExercisePage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./components/LandingPage";
import AIRecommendModal from "./components/AIRecommendModal";

const NAV = [
  { id: "home", label: "Home" },
  { id: "breathe", label: "Breathe" },
  { id: "history", label: "History" },
];

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

// ── Avatar dropdown ──────────────────────────────────────
function AvatarMenu({ user, onProfile, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = (user.displayName || user.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const name = user.displayName || user.email?.split("@")[0] || "User";
  const email = user.email || "";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={S.avatarTrigger}
        title={name}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt={name} style={S.avatarImg} />
        ) : (
          <div style={S.avatarFallback}>{initials}</div>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="var(--text3)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={S.dropdown}
          >
            {/* User info header */}
            <div style={S.dropdownHeader}>
              {user.photoURL ? (
                <img src={user.photoURL} alt={name} style={S.dropdownAvatar} />
              ) : (
                <div
                  style={{
                    ...S.avatarFallback,
                    width: 36,
                    height: 36,
                    fontSize: 13,
                  }}
                >
                  {initials}
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text3)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {email}
                </div>
              </div>
            </div>

            <div style={S.dropdownDivider} />

            <button
              style={S.dropdownItem}
              onClick={() => {
                onProfile();
                setOpen(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--surface)";
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "var(--text2)";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              >
                <circle cx="7" cy="4.5" r="2.5" />
                <path d="M1.5 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
              </svg>
              View profile
            </button>

            <div style={S.dropdownDivider} />

            <button
              style={{ ...S.dropdownItem, color: "#f87171" }}
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(248,113,113,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              >
                <path d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2M9 10l3-3-3-3M12 7H5" />
              </svg>
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Authenticated app shell ──────────────────────────────
function AppShell() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState("home");
  const [showAI, setShowAI] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <AppContextProvider uid={user.uid}>
      <div style={S.shell}>
        {/* ── NAV ── */}
        <nav style={S.nav}>
          <div style={S.logo} onClick={() => setPage("home")}>
            <div style={S.logoMark}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2C5 2 3 4.5 3 8C3 11.5 5 14 8 14"
                  stroke="#07101e"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 2C11 2 13 4.5 13 8C13 11.5 11 14 8 14"
                  stroke="#07101e"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeOpacity="0.5"
                />
                <circle cx="8" cy="8" r="2" fill="#07101e" />
              </svg>
            </div>
            <span style={S.logoText}>
              Breathe<span style={S.logoAccent}>Flow</span>
            </span>
          </div>

          <div style={S.navLinks}>
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                style={{ ...S.navBtn, ...(page === id ? S.navBtnActive : {}) }}
              >
                {label}
                {page === id && <div style={S.navIndicator} />}
              </button>
            ))}
          </div>

          <div style={S.navRight}>
            <button style={S.aiChip} onClick={() => setShowAI(true)}>
              <span>✨</span>
              <span>AI Recommend</span>
            </button>
            <AvatarMenu
              user={user}
              onProfile={() => setPage("profile")}
              onLogout={logout}
            />
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
                    showToast(`Loaded "${level.name || level.title}"`);
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

        <AnimatePresence>
          {showAI && (
            <AIRecommendModal
              onClose={() => setShowAI(false)}
              onLevelCreated={(level) => showToast(`✨ "${level.name}" saved!`)}
              onPlayLevel={() => {
                setPage("breathe");
                showToast("Level loaded — press Begin!");
              }}
            />
          )}
        </AnimatePresence>

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

// ── Root router ──────────────────────────────────────────
function Root() {
  const { user, loading } = useAuth();
  const [publicView, setPublicView] = useState("public"); // "public" | "signin" | "signup"

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          style={{
            width: 36,
            height: 36,
            border: "3px solid var(--border)",
            borderTop: "3px solid var(--teal)",
            borderRadius: "50%",
          }}
        />
      </div>
    );
  }

  if (user) return <AppShell />;

  if (publicView === "public") {
    return (
      <PublicHome
        onSignIn={() => setPublicView("signin")}
        onSignUp={() => setPublicView("signup")}
      />
    );
  }

  return (
    <AuthPage
      initialMode={publicView === "signup" ? "signup" : "login"}
      onBack={() => setPublicView("public")}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
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
    background: "rgba(7,16,30,0.92)",
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
    flexShrink: 0,
  },
  logoMark: {
    width: 28,
    height: 28,
    borderRadius: 7,
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
  navRight: { display: "flex", alignItems: "center", gap: 12 },
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
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
  },
  avatarTrigger: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "var(--surface)",
    border: "0.5px solid var(--border2)",
    borderRadius: 24,
    padding: "4px 10px 4px 4px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  avatarImg: { width: 28, height: 28, borderRadius: "50%", objectFit: "cover" },
  avatarFallback: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "var(--teal)",
    color: "#07101e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 800,
    flexShrink: 0,
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "var(--bg2)",
    border: "0.5px solid var(--border2)",
    borderRadius: 12,
    minWidth: 220,
    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
    overflow: "hidden",
    zIndex: 500,
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 16px",
  },
  dropdownAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  dropdownDivider: { height: "0.5px", background: "var(--border)" },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "11px 16px",
    background: "none",
    border: "none",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text2)",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.15s, color 0.15s",
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
