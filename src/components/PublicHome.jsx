// src/components/PublicHome.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

const FEATURES = [
  {
    color: "var(--teal)",
    bg: "rgba(29,229,200,0.1)",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="var(--teal)"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4l3 3" />
      </svg>
    ),
    title: "Reduces stress instantly",
    desc: "Activates the vagus nerve and lowers cortisol within 2 minutes.",
  },
  {
    color: "var(--blue)",
    bg: "rgba(91,156,246,0.1)",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="var(--blue)"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <circle cx="10" cy="10" r="3" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" />
      </svg>
    ),
    title: "Sharpens focus",
    desc: "Increases prefrontal cortex oxygenation for cognitive clarity.",
  },
  {
    color: "var(--purple)",
    bg: "rgba(139,92,246,0.1)",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="var(--purple)"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M17 14.5A8 8 0 019.5 3 7 7 0 1017 14.5z" />
      </svg>
    ),
    title: "Deeper sleep",
    desc: "4-7-8 breathing slows the heart rate for restorative sleep.",
  },
  {
    color: "var(--amber)",
    bg: "rgba(245,158,11,0.1)",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="var(--amber)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 2l2 5h5l-4 3 1.5 5L10 12l-4.5 3L7 10 3 7h5z" />
      </svg>
    ),
    title: "AI-personalised",
    desc: "Claude AI designs the perfect breathing pattern for your needs.",
  },
];

const PATTERNS = [
  {
    name: "Box Breathing",
    ratio: "4-4-4-4",
    use: "Focus · Stress",
    color: "var(--teal)",
  },
  {
    name: "4-7-8 Breathing",
    ratio: "4-7-8",
    use: "Sleep · Anxiety",
    color: "var(--blue)",
  },
  {
    name: "Coherent Breathing",
    ratio: "5-5",
    use: "Calm · HRV",
    color: "var(--purple)",
  },
  {
    name: "Resonance Breathing",
    ratio: "6-6",
    use: "Balance · Therapy",
    color: "var(--amber)",
  },
];

export default function PublicHome({ onSignIn, onSignUp }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* ── HERO ── */}
      <section style={S.hero}>
        {/* background glow */}
        <div style={S.heroGlow} />
        <div style={S.heroGlow2} />

        <div style={S.heroContent}>
          <motion.div {...fadeUp(0)} style={S.badge}>
            <span style={S.badgeDot} />
            Backed by neuroscience · Free to use
          </motion.div>

          <motion.h1 {...fadeUp(0.08)} style={S.heroTitle}>
            Breathe with{" "}
            <span style={{ color: "var(--teal)" }}>intention.</span>
            <br />
            Live better.
          </motion.h1>

          <motion.p {...fadeUp(0.16)} style={S.heroSub}>
            Guided breathing exercises proven to reduce cortisol, improve focus,
            and help you sleep deeper — in under 5 minutes a day.
          </motion.p>

          <motion.div
            {...fadeUp(0.22)}
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button style={S.heroCta} onClick={onSignUp}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="#07101e">
                <polygon points="3,2 12,7 3,12" />
              </svg>
              Start breathing free
            </button>
            <button style={S.heroCtaGhost} onClick={onSignIn}>
              Sign in to your account
            </button>
          </motion.div>

          <motion.div {...fadeUp(0.3)} style={S.statsRow}>
            {[
              { val: "50K+", label: "Users" },
              { val: "4.9★", label: "Rating" },
              { val: "7", label: "Techniques" },
              { val: "2 min", label: "To feel calm" },
            ].map(({ val, label }) => (
              <div key={label} style={S.stat}>
                <div style={S.statVal}>{val}</div>
                <div style={S.statLabel}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          style={S.heroVisual}
        >
          {/* Breathing circle demo */}
          <div style={S.circleWrap}>
            <motion.div
              animate={{
                scale: [1, 1.12, 1.12, 1, 1],
                opacity: [1, 1, 1, 1, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={S.circleOuter}
            />
            <motion.div
              animate={{ scale: [1, 1.08, 1.08, 1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={S.circleInner}
            >
              <motion.div
                animate={{ opacity: [0, 1, 1, 0, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  times: [0, 0.1, 0.4, 0.5, 1],
                }}
                style={S.phaseLabel}
              >
                Inhale
              </motion.div>
              <motion.div
                animate={{ opacity: [0, 0, 0, 1, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  times: [0, 0.4, 0.5, 0.6, 1],
                }}
                style={{ ...S.phaseLabel, color: "var(--teal)" }}
              >
                Exhale
              </motion.div>
            </motion.div>
            {/* ring */}
            <svg style={S.circleSvg} viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(29,229,200,0.08)"
                strokeWidth="8"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="var(--teal)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 80}`}
                animate={{
                  strokeDashoffset: [
                    2 * Math.PI * 80,
                    0,
                    0,
                    2 * Math.PI * 80,
                    2 * Math.PI * 80,
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.4, 0.5, 0.9, 1],
                }}
                transform="rotate(-90 100 100)"
                style={{ transition: "stroke 0.4s" }}
              />
            </svg>
          </div>

          {/* Pattern cards */}
          <div style={S.patternCards}>
            {PATTERNS.map(({ name, ratio, use, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                style={{
                  ...S.patternCard,
                  borderColor: hovered === i ? color + "60" : "var(--border)",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
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
                      fontSize: 10,
                      color: "var(--text3)",
                      marginTop: 1,
                    }}
                  >
                    {ratio} · {use}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section style={S.section}>
        <div style={S.sectionInner}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={S.eyebrow}>Why BreatheFlow</p>
            <h2 style={S.sectionTitle}>
              Everything you need to breathe better
            </h2>
          </div>
          <div style={S.featuresGrid}>
            {FEATURES.map(({ color, bg, icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={S.featureCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color + "50";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  {icon}
                </div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text)",
                    margin: "0 0 6px",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text2)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={S.ctaSection}>
        <div style={S.sectionInner}>
          <div style={S.ctaCard}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: "center" }}
            >
              <h2
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: "-1px",
                  marginBottom: 12,
                }}
              >
                Ready to breathe better?
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text2)",
                  marginBottom: 32,
                  maxWidth: 400,
                  margin: "0 auto 32px",
                }}
              >
                Join 50,000+ people who use BreatheFlow daily to calm their mind
                and sharpen their focus.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button style={S.heroCta} onClick={onSignUp}>
                  Create free account
                </button>
                <button style={S.heroCtaGhost} onClick={onSignIn}>
                  I already have an account
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={S.footer}>
        <div style={S.sectionInner}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={S.logo}>
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
                Breathe<span style={{ color: "var(--teal)" }}>Flow</span>
              </span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text3)", margin: 0 }}>
              © 2025 BreatheFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const S = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(7,16,30,0.92)",
    backdropFilter: "blur(16px)",
    borderBottom: "0.5px solid var(--border)",
  },
  headerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 32px",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    userSelect: "none",
    flexShrink: 0,
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
  navLink: {
    background: "none",
    border: "none",
    color: "var(--text2)",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    padding: "6px 14px",
    borderRadius: 6,
    transition: "color 0.2s",
  },
  signInBtn: {
    background: "none",
    border: "0.5px solid var(--border2)",
    color: "var(--text2)",
    fontSize: 13,
    fontWeight: 600,
    padding: "7px 18px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  signUpBtn: {
    background: "var(--teal)",
    border: "none",
    color: "#07101e",
    fontSize: 13,
    fontWeight: 700,
    padding: "8px 20px",
    borderRadius: 20,
    cursor: "pointer",
    letterSpacing: "-0.2px",
    transition: "opacity 0.2s",
  },
  hero: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "80px 32px 64px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 64,
    alignItems: "center",
    position: "relative",
  },
  heroGlow: {
    position: "absolute",
    top: 0,
    left: "20%",
    width: 600,
    height: 400,
    pointerEvents: "none",
    background:
      "radial-gradient(ellipse,rgba(29,229,200,0.07) 0%,transparent 65%)",
  },
  heroGlow2: {
    position: "absolute",
    bottom: 0,
    right: "10%",
    width: 400,
    height: 300,
    pointerEvents: "none",
    background:
      "radial-gradient(ellipse,rgba(139,92,246,0.06) 0%,transparent 65%)",
  },
  heroContent: { position: "relative", zIndex: 1 },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "5px 14px",
    borderRadius: 24,
    border: "0.5px solid rgba(29,229,200,0.28)",
    background: "rgba(29,229,200,0.07)",
    fontSize: 12,
    color: "var(--teal)",
    fontWeight: 500,
    marginBottom: 22,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--teal)",
    display: "inline-block",
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: 800,
    letterSpacing: "-2.5px",
    lineHeight: 1.06,
    margin: "0 0 20px",
    color: "var(--text)",
  },
  heroSub: {
    fontSize: 16,
    lineHeight: 1.75,
    color: "var(--text2)",
    marginBottom: 36,
    maxWidth: 460,
  },
  heroCta: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "var(--teal)",
    color: "#07101e",
    border: "none",
    padding: "13px 28px",
    borderRadius: 28,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "-0.2px",
    transition: "opacity 0.2s, transform 0.2s",
  },
  heroCtaGhost: {
    display: "inline-flex",
    alignItems: "center",
    background: "transparent",
    color: "var(--text2)",
    border: "0.5px solid var(--border2)",
    padding: "13px 24px",
    borderRadius: 28,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  statsRow: { display: "flex", gap: 28, marginTop: 40, flexWrap: "wrap" },
  stat: {},
  statVal: {
    fontSize: 20,
    fontWeight: 800,
    color: "var(--text)",
    letterSpacing: "-0.5px",
  },
  statLabel: {
    fontSize: 11,
    color: "var(--text3)",
    marginTop: 2,
    letterSpacing: "0.04em",
  },
  heroVisual: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  circleWrap: {
    position: "relative",
    width: 220,
    height: 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  circleSvg: { position: "absolute", inset: 0, width: "100%", height: "100%" },
  circleOuter: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(29,229,200,0.08) 0%, transparent 70%)",
  },
  circleInner: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: "rgba(29,229,200,0.06)",
    border: "0.5px solid rgba(29,229,200,0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
  },
  phaseLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: "var(--blue)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    position: "absolute",
  },
  patternCards: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
    maxWidth: 280,
  },
  patternCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 10,
    background: "var(--bg2)",
    border: "0.5px solid var(--border)",
    transition: "border-color 0.2s, transform 0.2s",
    cursor: "default",
  },
  section: { padding: "72px 0" },
  sectionInner: { maxWidth: 1200, margin: "0 auto", padding: "0 32px" },
  eyebrow: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "var(--teal)",
    margin: "0 0 10px",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: "-0.8px",
    margin: "0 0 10px",
    color: "var(--text)",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
  },
  featureCard: {
    background: "var(--bg2)",
    border: "0.5px solid var(--border)",
    borderRadius: 16,
    padding: "22px 20px",
    transition: "border-color 0.2s, transform 0.25s",
  },
  ctaSection: { padding: "64px 0 80px" },
  ctaCard: {
    background: "rgba(29,229,200,0.05)",
    border: "0.5px solid rgba(29,229,200,0.2)",
    borderRadius: 20,
    padding: "60px 40px",
  },
  footer: { borderTop: "0.5px solid var(--border)", padding: "24px 0" },
};
