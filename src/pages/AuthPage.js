// src/pages/AuthPage.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

export default function AuthPage() {
  const { loginWithGoogle, loginWithGithub, loginWithEmail, signupWithEmail, error, clearError } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (mode === "login") {
      await loginWithEmail(email, password);
    } else {
      await signupWithEmail(email, password, name);
    }
    setSubmitting(false);
  };

  const switchMode = () => {
    clearError();
    setMode((m) => (m === "login" ? "signup" : "login"));
  };

  return (
    <div style={styles.page}>
      {/* Background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={styles.card}
      >
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoRing}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="var(--teal)" strokeWidth="2" strokeDasharray="87.96" strokeDashoffset="22" transform="rotate(-90 18 18)" />
              <circle cx="18" cy="18" r="8" fill="rgba(29,229,200,0.15)" />
            </svg>
          </div>
          <h1 style={styles.logoText}>Breathe</h1>
        </div>

        <p style={styles.subtitle}>
          {mode === "login" ? "Welcome back — breathe easy." : "Start your journey."}
        </p>

        {/* OAuth buttons */}
        <div style={styles.oauthRow}>
          <button style={styles.oauthBtn} onClick={loginWithGoogle}>
            <GoogleIcon />
            <span>Google</span>
          </button>
          <button style={styles.oauthBtn} onClick={loginWithGithub}>
            <GithubIcon />
            <span>GitHub</span>
          </button>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or continue with email</span>
          <span style={styles.dividerLine} />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailSubmit} style={styles.form}>
          <AnimatePresence>
            {mode === "signup" && (
              <motion.input
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 44 }}
                exit={{ opacity: 0, height: 0 }}
                style={styles.input}
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
          </AnimatePresence>
          <input
            style={styles.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={styles.errorText}
            >
              {error}
            </motion.p>
          )}

          <button type="submit" style={styles.submitBtn} disabled={submitting}>
            {submitting ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p style={styles.switchText}>
          {mode === "login" ? "Don't have an account? " : "Already have one? "}
          <button style={styles.switchLink} onClick={switchMode}>
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    position: "relative",
    overflow: "hidden",
  },
  orb1: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(29,229,200,0.12) 0%, transparent 70%)",
    top: "-10%",
    left: "-10%",
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
    bottom: "-5%",
    right: "-5%",
    pointerEvents: "none",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 20,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
    zIndex: 1,
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  logoRing: { display: "flex", alignItems: "center" },
  logoText: {
    fontSize: 24,
    fontWeight: 800,
    color: "var(--text1)",
    letterSpacing: "-1px",
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: "var(--text3)",
    marginBottom: 28,
    marginTop: 2,
  },
  oauthRow: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  oauthBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 16px",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text1)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "var(--border)",
  },
  dividerText: {
    fontSize: 11,
    color: "var(--text3)",
    whiteSpace: "nowrap",
    letterSpacing: "0.04em",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  input: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    color: "var(--text1)",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  errorText: {
    fontSize: 12,
    color: "#f87171",
    margin: "2px 0",
  },
  submitBtn: {
    marginTop: 4,
    padding: "13px",
    background: "var(--teal)",
    border: "none",
    borderRadius: 10,
    color: "#000",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "opacity 0.2s",
  },
  switchText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    color: "var(--text3)",
  },
  switchLink: {
    background: "none",
    border: "none",
    color: "var(--teal)",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 13,
    padding: 0,
  },
};
