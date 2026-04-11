import React from "react";
import { motion } from "framer-motion";
import Footer from "./Footer";

/* ── animation presets ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut", delay },
  }),
};

/* ── data ── */
const BENEFITS = [
  {
    color: "var(--teal2)",
    stroke: "var(--teal)",
    title: "Reduces stress instantly",
    desc: "Activates the vagus nerve and lowers cortisol within 2 minutes of controlled breathing.",
    icon: (c) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4l3 3" />
      </svg>
    ),
  },
  {
    color: "var(--blue2)",
    stroke: "var(--blue)",
    title: "Sharpens focus",
    desc: "Increases prefrontal cortex oxygenation, improving concentration and cognitive clarity.",
    icon: (c) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <circle cx="10" cy="10" r="3" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" />
      </svg>
    ),
  },
  {
    color: "var(--purple2)",
    stroke: "var(--purple)",
    title: "Deeper sleep",
    desc: "4-7-8 breathing slows the heart rate and prepares the body for restorative sleep cycles.",
    icon: (c) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M17 14.5A8 8 0 019.5 3 7 7 0 1017 14.5z" />
      </svg>
    ),
  },
  {
    color: "var(--amber2)",
    stroke: "var(--amber)",
    title: "Boosts immunity",
    desc: "Improves oxygenation and reduces systemic inflammation through rhythmic breathing.",
    icon: (c) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 2l2 5h5l-4 3 1.5 5L10 12l-4.5 3L7 10 3 7h5z" />
      </svg>
    ),
  },
  {
    color: "var(--teal2)",
    stroke: "var(--teal)",
    title: "Manages pain",
    desc: "Reduces muscle tension and activates natural pain-relief pathways in the nervous system.",
    icon: (c) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M10 2C6.7 2 4 4.7 4 8c0 5 6 10 6 10s6-5 6-10c0-3.3-2.7-6-6-6z" />
        <circle cx="10" cy="8" r="2" />
      </svg>
    ),
  },
  {
    color: "var(--blue2)",
    stroke: "var(--blue)",
    title: "Emotional balance",
    desc: "Promotes calm, reduces reactivity, and builds resilience through consistent practice.",
    icon: (c) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M10 18s-8-4.5-8-10a8 8 0 0116 0c0 5.5-8 10-8 10z" />
      </svg>
    ),
  },
];

const PATTERNS = [
  {
    dot: "var(--teal)",
    name: "Box breathing (4-4-4-4)",
    use: "Focus · Stress",
    how: "Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Used by Navy SEALs.",
    tag: { bg: "var(--teal2)", color: "var(--teal)" },
  },
  {
    dot: "var(--blue)",
    name: "4-7-8 breathing",
    use: "Sleep · Anxiety",
    how: "Inhale 4s → Hold 7s → Exhale 8s. Activates rest mode.",
    tag: { bg: "var(--blue2)", color: "var(--blue)" },
  },
  {
    dot: "var(--amber)",
    name: "Wim Hof method",
    use: "Energy · Performance",
    how: "30 power breaths + breath hold. Boosts energy and alkalinity.",
    tag: { bg: "var(--amber2)", color: "var(--amber)" },
  },
  {
    dot: "var(--purple)",
    name: "5-5 coherent breathing",
    use: "Calm · HRV",
    how: "Inhale 5s → Exhale 5s. Synchronises heart rate and brain rhythms.",
    tag: { bg: "var(--purple2)", color: "var(--purple)" },
  },
  {
    dot: "var(--teal)",
    name: "Resonance breathing (6-6)",
    use: "Balance · Therapy",
    how: "Inhale 6s → Exhale 6s. Aligns breathing with natural body rhythms.",
    tag: { bg: "var(--teal2)", color: "var(--teal)" },
  },
  {
    dot: "var(--blue)",
    name: "Diaphragmatic breathing",
    use: "Posture · Focus",
    how: "Slow, deep belly breathing. Strengthens the diaphragm naturally.",
    tag: { bg: "var(--blue2)", color: "var(--blue)" },
  },
];

const STEPS = [
  {
    num: "01",
    title: "Choose a pattern",
    desc: "Pick a technique based on your goal — sleep, focus, or stress relief.",
  },
  {
    num: "02",
    title: "Follow the guide",
    desc: "Visual and audio cues walk you through each inhale, hold, and exhale.",
  },
  {
    num: "03",
    title: "Feel the calm",
    desc: "Your nervous system resets within minutes of consistent practice.",
  },
];

const STATS = [
  { val: "50K+", label: "Active users" },
  { val: "4.9★", label: "Average rating" },
  { val: "7", label: "Breathing patterns" },
  { val: "2 min", label: "To feel the effect" },
];

/* ── helpers ── */
const Card = ({ style, children, hover = true }) => {
  const ref = React.useRef(null);
  const handleEnter = () => {
    if (!hover || !ref.current) return;
    ref.current.style.borderColor = "var(--border2)";
    ref.current.style.transform = "translateY(-4px)";
  };
  const handleLeave = () => {
    if (!hover || !ref.current) return;
    ref.current.style.borderColor = "var(--border)";
    ref.current.style.transform = "translateY(0)";
  };
  return (
    <div
      ref={ref}
      style={{
        background: "var(--bg3)",
        border: "0.5px solid var(--border)",
        borderRadius: "var(--r16)",
        transition: "border-color 0.2s, transform 0.25s",
        ...style,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
};

const SectionEyebrow = ({ children }) => (
  <p
    style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.09em",
      textTransform: "uppercase",
      color: "var(--teal)",
      margin: "0 0 10px",
    }}
  >
    {children}
  </p>
);

const SectionHeading = ({ children, center }) => (
  <h2
    style={{
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: "-0.8px",
      margin: "0 0 10px",
      textAlign: center ? "center" : "left",
    }}
  >
    {children}
  </h2>
);

/* ── AdBanner ── */
const AdBanner = ({
  accent = "var(--blue2)",
  accentBorder = "rgba(91,156,246,0.2)",
  buttonColor = "var(--blue)",
  title,
  sub,
  cta,
}) => (
  <div
    style={{
      background: accent,
      border: `0.5px solid ${accentBorder}`,
      borderRadius: "var(--r10)",
      padding: "16px 22px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
    }}
  >
    <div>
      <p
        style={{
          fontSize: 9,
          color: "var(--text3)",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          margin: "0 0 3px",
        }}
      >
        Sponsored
      </p>
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text)",
          margin: "0 0 2px",
        }}
      >
        {title}
      </p>
      <p style={{ fontSize: 12, color: "var(--text2)", margin: 0 }}>{sub}</p>
    </div>
    <button
      style={{
        background: "transparent",
        border: `0.5px solid ${accentBorder}`,
        color: buttonColor,
        padding: "8px 18px",
        borderRadius: "var(--r24)",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "opacity 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {cta}
    </button>
  </div>
);

/* ══ LandingPage ══ */
const LandingPage = ({ onStart }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <main style={{ flex: 1 }}>
        {/* ── HERO ── */}
        <section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "88px 32px 64px",
            position: "relative",
          }}
        >
          {/* background glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 700,
              height: 420,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at center,rgba(29,229,200,0.06) 0%,transparent 65%)",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              alignItems: "center",
            }}
          >
            {/* left */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
              }}
            >
              <motion.div
                variants={fadeUp}
                custom={0}
                style={{
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
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--teal)",
                  }}
                />
                Backed by neuroscience
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={0.05}
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  letterSpacing: "-2.5px",
                  lineHeight: 1.06,
                  margin: "0 0 20px",
                }}
              >
                Breathe with
                <br />
                <span style={{ color: "var(--teal)" }}>intention.</span>
                <br />
                Live better.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={0.1}
                style={{
                  fontSize: 15,
                  lineHeight: 1.75,
                  marginBottom: 36,
                  maxWidth: 440,
                }}
              >
                Guided breathing exercises proven to reduce cortisol, improve
                focus, and help you sleep deeper — in under 5 minutes.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={0.15}
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 40,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={onStart}
                  style={{
                    background: "var(--teal)",
                    color: "#07101e",
                    border: "none",
                    padding: "13px 28px",
                    borderRadius: 28,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "-0.2px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "opacity 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.88";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="#07101e"
                  >
                    <polygon points="3,2 12,7 3,12" />
                  </svg>
                  Start breathing free
                </button>
                <button
                  style={{
                    background: "transparent",
                    color: "var(--text)",
                    border: "0.5px solid var(--border2)",
                    padding: "13px 24px",
                    borderRadius: 28,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  Watch demo
                </button>
              </motion.div>

              {/* trust row */}
              <motion.div
                variants={fadeUp}
                custom={0.2}
                style={{ display: "flex", alignItems: "center", gap: 14 }}
              >
                <div style={{ display: "flex" }}>
                  {[
                    ["PS", "var(--teal2)", "var(--teal)"],
                    ["MT", "var(--blue2)", "var(--blue)"],
                    ["AK", "var(--purple2)", "var(--purple)"],
                    ["RJ", "var(--amber2)", "var(--amber)"],
                  ].map(([init, bg, color], i) => (
                    <div
                      key={init}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: bg,
                        color,
                        fontSize: 10,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid var(--bg)",
                        marginLeft: i === 0 ? 0 : -8,
                      }}
                    >
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div
                    style={{
                      color: "var(--amber)",
                      fontSize: 12,
                      letterSpacing: 1,
                    }}
                  >
                    ★★★★★
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>
                    Trusted by{" "}
                    <strong style={{ color: "var(--text2)" }}>50,000+</strong>{" "}
                    people worldwide
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* right — decorative visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div
                style={{
                  background: "var(--bg2)",
                  border: "0.5px solid var(--border2)",
                  borderRadius: "var(--r16)",
                  padding: 40,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                {/* mini ring */}
                <div style={{ position: "relative", width: 160, height: 160 }}>
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r="68"
                      fill="none"
                      stroke="rgba(29,229,200,0.08)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="68"
                      fill="none"
                      stroke="var(--teal)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="427"
                      strokeDashoffset="214"
                      transform="rotate(-90 80 80)"
                      style={{ animation: "ringPulse 4s ease-in-out infinite" }}
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      fill="rgba(29,229,200,0.04)"
                      stroke="rgba(29,229,200,0.1)"
                      strokeWidth="0.5"
                    />
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 36,
                        fontWeight: 800,
                        letterSpacing: "-1px",
                        lineHeight: 1,
                      }}
                    >
                      4
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text3)",
                        marginTop: 4,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      Inhale
                    </div>
                  </div>
                </div>
                {/* phase pills */}
                <div style={{ display: "flex", gap: 8, width: "100%" }}>
                  {[
                    ["Inhale", "var(--blue2)", "var(--blue)", "4s"],
                    ["Hold", "var(--purple2)", "var(--purple)", "4s"],
                    ["Exhale", "var(--teal2)", "var(--teal)", "4s"],
                    ["Hold", "var(--purple2)", "var(--purple)", "4s"],
                  ].map(([label, bg, color, secs]) => (
                    <div
                      key={label + secs}
                      style={{ flex: 1, textAlign: "center" }}
                    >
                      <div
                        style={{
                          height: 3,
                          borderRadius: 2,
                          background: bg,
                          marginBottom: 6,
                        }}
                      />
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {label}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text3)" }}>
                        {secs}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onStart}
                  style={{
                    background: "var(--teal)",
                    color: "#07101e",
                    border: "none",
                    padding: "12px 40px",
                    borderRadius: 28,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "-0.2px",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  ▶ Begin session
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div
          style={{
            borderTop: "0.5px solid var(--border)",
            borderBottom: "0.5px solid var(--border)",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
            }}
          >
            {STATS.map(({ val, label }, i) => (
              <div
                key={label}
                style={{
                  padding: "24px 32px",
                  borderRight: i < 3 ? "0.5px solid var(--border)" : "none",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    letterSpacing: "-1px",
                    color: "var(--teal)",
                  }}
                >
                  {val}
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOP AD ── */}
        <div
          style={{ maxWidth: 1200, margin: "28px auto 0", padding: "0 32px" }}
        >
          <AdBanner
            accent="var(--blue2)"
            accentBorder="rgba(91,156,246,0.2)"
            buttonColor="var(--blue)"
            title="Calm Premium — unlock sleep stories, masterclasses & unlimited guided sessions"
            sub="First 30 days free. Cancel anytime."
            cta="Try free →"
          />
        </div>

        {/* ── BENEFITS ── */}
        <section
          style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 32px" }}
        >
          <SectionEyebrow>Why it works</SectionEyebrow>
          <SectionHeading>Science-backed benefits</SectionHeading>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.75,
              marginBottom: 36,
              maxWidth: 480,
              color: "var(--text2)",
            }}
          >
            Controlled breathing directly influences your autonomic nervous
            system — shifting you from fight-or-flight into rest-and-digest.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 16,
            }}
          >
            {BENEFITS.map(({ color, stroke, title, desc, icon }) => (
              <Card key={title} style={{ padding: 22 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  {icon(stroke)}
                </div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 6,
                    letterSpacing: "-0.2px",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text2)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── PATTERNS ── */}
        <section
          style={{
            background: "var(--bg2)",
            borderTop: "0.5px solid var(--border)",
            borderBottom: "0.5px solid var(--border)",
            padding: "64px 0",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
            <SectionEyebrow>Techniques</SectionEyebrow>
            <SectionHeading>All breathing patterns</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 12,
                marginTop: 32,
              }}
            >
              {PATTERNS.map(({ dot, name, use, how, tag }) => (
                <Card
                  key={name}
                  style={{ padding: "20px 22px", display: "flex", gap: 16 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: dot,
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  />
                  <div>
                    <h3
                      style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}
                    >
                      {name}
                    </h3>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text2)",
                        lineHeight: 1.55,
                        margin: "0 0 10px",
                      }}
                    >
                      {how}
                    </p>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: tag.bg,
                        color: tag.color,
                      }}
                    >
                      {use}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section
          style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 32px" }}
        >
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <SectionEyebrow>Process</SectionEyebrow>
            <SectionHeading center>How guided breathing works</SectionHeading>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 20,
            }}
          >
            {STEPS.map(({ num, title, desc }) => (
              <Card key={num} style={{ padding: 28, textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--teal)",
                    letterSpacing: "0.08em",
                    marginBottom: 14,
                  }}
                >
                  {num}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
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
              </Card>
            ))}
          </div>
        </section>

        {/* ── MID AD ── */}
        <div
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 64px" }}
        >
          <AdBanner
            accent="var(--purple2)"
            accentBorder="rgba(159,122,234,0.2)"
            buttonColor="var(--purple)"
            title="InsideTracker — measure how breathing affects your biomarkers"
            sub="Blood & DNA analysis to personalise your wellness. Get 20% off with code BREATHE."
            cta="Claim 20% off →"
          />
        </div>

        {/* ── TESTIMONIALS ── */}
        <section
          style={{
            background: "var(--bg2)",
            borderTop: "0.5px solid var(--border)",
            padding: "64px 0",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
            <SectionEyebrow>Community</SectionEyebrow>
            <SectionHeading>People who breathe better</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 16,
                marginTop: 32,
              }}
            >
              {[
                {
                  init: "PS",
                  bg: "var(--teal2)",
                  color: "var(--teal)",
                  name: "Priya S.",
                  role: "Yoga instructor, Mumbai",
                  stars: 5,
                  text: "Went from daily panic attacks to sleeping soundly. The 4-7-8 method genuinely changed my life within two weeks.",
                },
                {
                  init: "MT",
                  bg: "var(--blue2)",
                  color: "var(--blue)",
                  name: "Marcus T.",
                  role: "Product lead, Berlin",
                  stars: 5,
                  text: "I use box breathing before every board meeting. It's my secret weapon for staying calm and articulate under pressure.",
                },
                {
                  init: "AK",
                  bg: "var(--purple2)",
                  color: "var(--purple)",
                  name: "Ayesha K.",
                  role: "Designer, London",
                  stars: 5,
                  text: "Finally an app that's clean and simple. No clutter, just breathing. The phase tracker is satisfying to follow.",
                },
              ].map(({ init, bg, color, name, role, text }) => (
                <Card key={name} style={{ padding: 22 }}>
                  <div
                    style={{
                      color: "var(--amber)",
                      fontSize: 13,
                      letterSpacing: 2,
                      marginBottom: 12,
                    }}
                  >
                    ★★★★★
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text2)",
                      lineHeight: 1.65,
                      marginBottom: 18,
                    }}
                  >
                    "{text}"
                  </p>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: bg,
                        color,
                        fontSize: 12,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {init}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>
                        {role}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section
          style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 32px" }}
        >
          <div
            style={{
              background: "var(--teal2)",
              border: "0.5px solid rgba(29,229,200,0.25)",
              borderRadius: "var(--r16)",
              padding: "52px 40px",
              textAlign: "center",
            }}
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
                maxWidth: 420,
                margin: "0 auto 32px",
              }}
            >
              Join 50,000+ people who use BreatheFlow daily to calm their mind
              and sharpen their focus.
            </p>
            <button
              onClick={onStart}
              style={{
                background: "var(--teal)",
                color: "#07101e",
                border: "none",
                padding: "14px 36px",
                borderRadius: 28,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "-0.2px",
                transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Start free — no account needed
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
