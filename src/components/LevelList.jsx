// src/components/LevelList.jsx
import React, { useState } from "react";
import { useAppContext } from "../context/context";

/* ─────────────────────────────────────────
   Visual identity per breathing level
   ───────────────────────────────────────── */
const META = [
  {
    badge: "Focus",
    color: "#1de5c8",
    bg: "rgba(29,229,200,0.10)",
    border: "rgba(29,229,200,0.28)",
    glow: "rgba(29,229,200,0.22)",
    badgeBg: "rgba(29,229,200,0.12)",
    pill: {
      inhale: { bg: "rgba(91,156,246,0.12)", color: "#5b9cf6" },
      hold: { bg: "rgba(159,122,234,0.12)", color: "#9f7aea" },
      exhale: { bg: "rgba(29,229,200,0.12)", color: "#1de5c8" },
      hold2: { bg: "rgba(159,122,234,0.12)", color: "#9f7aea" },
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle
          cx="10"
          cy="10"
          r="3.5"
          stroke="#1de5c8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10 2v2M10 16v2M2 10h2M16 10h2M4.1 4.1l1.4 1.4M14.5 14.5l1.4 1.4M4.1 15.9l1.4-1.4M14.5 5.5l1.4-1.4"
          stroke="#1de5c8"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
    fallbackDesc:
      "Eliminates stress and sharpens focus under pressure. Trusted by Navy SEALs and first responders worldwide.",
  },
  {
    badge: "Sleep",
    color: "#5b9cf6",
    bg: "rgba(91,156,246,0.10)",
    border: "rgba(91,156,246,0.28)",
    glow: "rgba(91,156,246,0.22)",
    badgeBg: "rgba(91,156,246,0.12)",
    pill: {
      inhale: { bg: "rgba(91,156,246,0.12)", color: "#5b9cf6" },
      hold: { bg: "rgba(159,122,234,0.12)", color: "#9f7aea" },
      exhale: { bg: "rgba(29,229,200,0.12)", color: "#1de5c8" },
      hold2: { bg: "rgba(91,156,246,0.10)", color: "#5b9cf6" },
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M16 11.5A7.5 7.5 0 018.5 3 6.5 6.5 0 1016 11.5z"
          stroke="#5b9cf6"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M11 6l1.5 1.5M13.5 9h1"
          stroke="#5b9cf6"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    ),
    fallbackDesc:
      "Activates the parasympathetic nervous system to dissolve anxiety and guide the body into deep, restorative sleep.",
  },
  {
    badge: "Energy",
    color: "#f6ad55",
    bg: "rgba(246,173,85,0.10)",
    border: "rgba(246,173,85,0.28)",
    glow: "rgba(246,173,85,0.20)",
    badgeBg: "rgba(246,173,85,0.12)",
    pill: {
      inhale: { bg: "rgba(246,173,85,0.12)", color: "#f6ad55" },
      hold: { bg: "rgba(246,173,85,0.08)", color: "#f6ad55" },
      exhale: { bg: "rgba(29,229,200,0.12)", color: "#1de5c8" },
      hold2: { bg: "rgba(246,173,85,0.08)", color: "#f6ad55" },
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M11 2L5 11h7l-3 7 11-11h-7l3-5z"
          fill="rgba(246,173,85,0.15)"
          stroke="#f6ad55"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    fallbackDesc:
      "30 power breaths plus a breath hold. Raises oxygen levels, boosts alkalinity, and supercharges physical performance.",
  },
  {
    badge: "Calm",
    color: "#9f7aea",
    bg: "rgba(159,122,234,0.10)",
    border: "rgba(159,122,234,0.28)",
    glow: "rgba(159,122,234,0.20)",
    badgeBg: "rgba(159,122,234,0.12)",
    pill: {
      inhale: { bg: "rgba(159,122,234,0.12)", color: "#9f7aea" },
      hold: { bg: "rgba(91,156,246,0.12)", color: "#5b9cf6" },
      exhale: { bg: "rgba(29,229,200,0.12)", color: "#1de5c8" },
      hold2: { bg: "rgba(159,122,234,0.10)", color: "#9f7aea" },
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2C6.7 2 4 4.7 4 8.5c0 4.8 6 9.5 6 9.5s6-4.7 6-9.5C16 4.7 13.3 2 10 2z"
          fill="rgba(159,122,234,0.15)"
          stroke="#9f7aea"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="10" cy="8.5" r="2.5" fill="#9f7aea" />
      </svg>
    ),
    fallbackDesc:
      "Synchronises heart rate variability with brain rhythms, building lasting emotional resilience and inner stillness.",
  },
  {
    badge: "Balance",
    color: "#1de5c8",
    bg: "rgba(29,229,200,0.08)",
    border: "rgba(29,229,200,0.22)",
    glow: "rgba(29,229,200,0.15)",
    badgeBg: "rgba(29,229,200,0.10)",
    pill: {
      inhale: { bg: "rgba(29,229,200,0.12)", color: "#1de5c8" },
      hold: { bg: "rgba(91,156,246,0.10)", color: "#5b9cf6" },
      exhale: { bg: "rgba(29,229,200,0.08)", color: "#1de5c8" },
      hold2: { bg: "rgba(29,229,200,0.06)", color: "#1de5c8" },
    },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="#1de5c8" strokeWidth="1.3" />
        <path
          d="M10 2v16M2 10h16"
          stroke="#1de5c8"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle
          cx="10"
          cy="10"
          r="3"
          fill="rgba(29,229,200,0.20)"
          stroke="#1de5c8"
          strokeWidth="1.2"
        />
      </svg>
    ),
    fallbackDesc:
      "Aligns breathing with the body's natural resonance frequency for maximum therapeutic benefit and emotional stability.",
  },
];

/* ─── helpers ─── */
const TrashIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 3h10M4 3V2a1 1 0 011-1h2a1 1 0 011 1v1M5 5.5v3M7 5.5v3M2 3l.7 6.5a1 1 0 001 .9h4.6a1 1 0 001-.9L10 3" />
  </svg>
);

const Pill = ({ label, secs, bg, color }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 9px",
      borderRadius: 20,
      background: bg,
      color,
      letterSpacing: "0.02em",
      transition: "background 0.2s, color 0.2s",
    }}
  >
    {label}
    <span style={{ opacity: 0.6, fontWeight: 400, fontSize: 10 }}>{secs}s</span>
  </span>
);

/* ══ LevelList ══ */
const LevelList = ({ onSelect, selectedIndex }) => {
  const { levels, deleteLevel } = useAppContext();
  const [hovered, setHovered] = useState(null);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteLevel(id);
  };

  if (!levels.length) {
    return (
      <div
        style={{
          padding: "28px 16px",
          textAlign: "center",
          background: "rgba(255,255,255,0.02)",
          borderRadius: 12,
          border: "0.5px dashed rgba(255,255,255,0.12)",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            style={{ opacity: 0.4 }}
          >
            <circle
              cx="14"
              cy="14"
              r="12"
              stroke="rgba(29,229,200,0.8)"
              strokeWidth="1.2"
            />
            <path
              d="M14 8v6M14 18v1"
              stroke="rgba(29,229,200,0.8)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p
          style={{
            fontSize: 13,
            color: "rgba(240,244,248,0.5)",
            margin: "0 0 5px",
            fontWeight: 600,
          }}
        >
          No levels yet
        </p>
        <p
          style={{
            fontSize: 11,
            color: "rgba(240,244,248,0.28)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Tap <strong style={{ color: "#1de5c8" }}>New level</strong> to create
          your first breathing pattern.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {levels.map((item, index) => {
        const m = META[index % META.length];
        const selected = index === selectedIndex;
        const isHov = hovered === index && !selected;
        const totalSec =
          item.inn + (item.hold || 0) + item.out + (item.hold2 || 0);

        const pc = (which) =>
          selected
            ? { bg: "rgba(255,255,255,0.10)", color: m.color }
            : { bg: m.pill[which].bg, color: m.pill[which].color };

        return (
          <div
            key={item.id}
            onClick={() => onSelect(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "relative",
              borderRadius: 13,
              cursor: "pointer",
              overflow: "hidden",
              border: selected
                ? `0.5px solid ${m.border}`
                : isHov
                  ? "0.5px solid rgba(255,255,255,0.13)"
                  : "0.5px solid transparent",
              background: selected
                ? m.bg
                : isHov
                  ? "rgba(255,255,255,0.03)"
                  : "transparent",
              transition: "all 0.22s ease",
            }}
          >
            {/* left accent bar */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                borderRadius: "13px 0 0 13px",
                background: m.color,
                opacity: selected ? 1 : 0,
                transition: "opacity 0.22s",
                boxShadow: `0 0 10px ${m.glow}`,
              }}
            />

            {/* top row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: selected ? "13px 11px 7px 16px" : "13px 11px 7px 13px",
                transition: "padding 0.22s",
              }}
            >
              {/* icon */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: selected ? "rgba(255,255,255,0.08)" : m.bg,
                  border: selected
                    ? "0.5px solid rgba(255,255,255,0.10)"
                    : "0.5px solid transparent",
                  boxShadow: selected ? `0 0 16px ${m.glow}` : "none",
                  transition: "all 0.22s",
                }}
              >
                {m.icon}
              </div>

              {/* name */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "wrap",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "-0.25px",
                      color: selected ? m.color : "rgba(240,244,248,0.95)",
                      transition: "color 0.22s",
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: selected
                        ? "rgba(255,255,255,0.12)"
                        : m.badgeBg,
                      color: m.color,
                      transition: "background 0.22s",
                    }}
                  >
                    {m.badge}
                  </span>
                  {selected && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: m.color,
                        boxShadow: `0 0 6px ${m.glow}`,
                        display: "inline-block",
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: selected ? m.color : "rgba(240,244,248,0.30)",
                    opacity: selected ? 0.65 : 1,
                    letterSpacing: "0.02em",
                    transition: "color 0.22s",
                  }}
                >
                  {totalSec}s per cycle
                </span>
              </div>

              {/* delete - disabled for predefined levels */}
              <button
                onClick={(e) => {
                  if (index >= 4) handleDelete(e, item.id);
                }}
                aria-label="Delete level"
                disabled={index < 4}
                style={{
                  flexShrink: 0,
                  marginTop: 1,
                  background:
                    index < 4
                      ? "rgba(120,120,120,0.20)"
                      : "rgba(226,75,74,0.08)",
                  border:
                    index < 4
                      ? "0.5px solid rgba(120,120,120,0.30)"
                      : "0.5px solid rgba(226,75,74,0.18)",
                  color: index < 4 ? "#888" : "#e24b4a",
                  borderRadius: 7,
                  padding: "5px 7px",
                  cursor: index < 4 ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: index < 4 ? 0.5 : 1,
                }}
              >
                <TrashIcon />
              </button>
            </div>

            {/* description */}
            <div
              style={{
                padding: "0 11px 9px 63px",
                fontSize: 11,
                lineHeight: 1.65,
                color: selected
                  ? m.color
                  : isHov
                    ? "rgba(240,244,248,0.55)"
                    : "rgba(240,244,248,0.35)",
                opacity: selected ? 0.82 : 1,
                transition: "color 0.22s",
              }}
            >
              {item.description || m.fallbackDesc}
            </div>

            {/* timing pills */}
            <div
              style={{
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
                padding: "0 11px 13px 63px",
              }}
            >
              <Pill label="Inhale" secs={item.inn} {...pc("inhale")} />
              {(item.hold || 0) > 0 && (
                <Pill label="Hold" secs={item.hold} {...pc("hold")} />
              )}
              <Pill label="Exhale" secs={item.out} {...pc("exhale")} />
              {(item.hold2 || 0) > 0 && (
                <Pill label="Hold" secs={item.hold2} {...pc("hold2")} />
              )}
            </div>

            {/* bottom gradient bar when selected */}
            <div
              style={{
                height: 2,
                background: `linear-gradient(90deg, ${m.color} 0%, transparent 100%)`,
                opacity: selected ? 1 : 0,
                transition: "opacity 0.22s",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LevelList;
