import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const CARDS = [
  {
    color: "var(--teal2)",
    stroke: "var(--teal)",
    title: "Science-backed",
    body: "Every technique is grounded in peer-reviewed research on respiratory physiology and stress neuroscience.",
  },
  {
    color: "var(--blue2)",
    stroke: "var(--blue)",
    title: "Just minutes a day",
    body: "Short, focused sessions that integrate into any schedule — morning, lunch break, or before sleep.",
  },
  {
    color: "var(--purple2)",
    stroke: "var(--purple)",
    title: "Natural & accessible",
    body: "No equipment, no experience required. Your breath is always with you.",
  },
  {
    color: "var(--amber2)",
    stroke: "var(--amber)",
    title: "Built for everyone",
    body: "Students, professionals, athletes, caregivers — anyone seeking more calm and clarity.",
  },
];

const About = ({ onHomeClick }) => (
  <div
    style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Header onHomeClick={onHomeClick} />

    <main
      style={{
        flex: 1,
        maxWidth: 1100,
        margin: "0 auto",
        padding: "72px 32px",
      }}
    >
      {/* heading */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
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
          About us
        </p>
        <h1
          style={{
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: "-1.5px",
            margin: "0 0 14px",
          }}
        >
          About BreatheFlow
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--text2)",
            maxWidth: 540,
            margin: "0 auto",
            lineHeight: 1.75,
          }}
        >
          A mindful wellness platform designed to help you breathe better, feel
          calmer, and live with balance.
        </p>
      </div>

      {/* two-column */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 52,
          marginBottom: 64,
        }}
      >
        {/* prose */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <p
            style={{
              fontSize: 15,
              color: "var(--text2)",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            <strong style={{ color: "var(--text)" }}>BreatheFlow</strong> is
            built to help you manage stress, anxiety, poor sleep, and mental
            fatigue using scientifically structured breathing patterns. In a
            fast-paced world, controlled breathing offers a natural and
            effective way to calm the nervous system without medication or
            equipment.
          </p>
          <p
            style={{
              fontSize: 15,
              color: "var(--text2)",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Each exercise is visually guided and precisely timed, making it easy
            for complete beginners and experienced practitioners alike to build
            a consistent, meaningful practice.
          </p>
          <p
            style={{
              fontSize: 15,
              color: "var(--text2)",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            We believe that the breath is one of the most underused tools
            available to every human being. Our mission is to make that tool
            simple, beautiful, and accessible.
          </p>
        </div>

        {/* cards */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {CARDS.map(({ color, title, body }) => (
            <div
              key={title}
              style={{
                background: "var(--bg3)",
                border: "0.5px solid var(--border)",
                borderRadius: "var(--r16)",
                padding: "20px 18px",
                transition: "border-color 0.2s, transform 0.22s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border2)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: color,
                  marginBottom: 12,
                }}
              />
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text)",
                  margin: "0 0 6px",
                }}
              >
                {title}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text2)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* mission */}
      <div
        style={{
          background: "var(--teal2)",
          border: "0.5px solid rgba(29,229,200,0.22)",
          borderRadius: "var(--r16)",
          padding: "48px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--teal)",
            margin: "0 0 10px",
          }}
        >
          Our mission
        </p>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.6px",
            margin: "0 0 14px",
          }}
        >
          Breathing, simplified
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--text2)",
            maxWidth: 560,
            margin: "0 auto",
            lineHeight: 1.8,
          }}
        >
          Our mission is to make effective breathing practices simple, guided,
          and accessible to everyone — helping people feel calmer, more focused,
          and emotionally balanced through the power of breath.
        </p>
      </div>
    </main>

    <Footer />
  </div>
);

export default About;
