import React from "react";
import { useAppContext } from "../context/context";

const LEVEL_COLORS = [
  { bg: "var(--teal2)", color: "var(--teal)", badge: "Focus" },
  { bg: "var(--blue2)", color: "var(--blue)", badge: "Sleep" },
  { bg: "var(--amber2)", color: "var(--amber)", badge: "Energy" },
  { bg: "var(--purple2)", color: "var(--purple)", badge: "Calm" },
  { bg: "var(--teal2)", color: "var(--teal)", badge: "Balance" },
];

const TrashIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1.5 3.5h10M4.5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M5.5 6v4M7.5 6v4M2.5 3.5l.75 7a1 1 0 001 .9h4.5a1 1 0 001-.9l.75-7" />
  </svg>
);

const LevelList = ({ onSelect, selectedIndex }) => {
  const { levels, deleteLevel } = useAppContext();

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteLevel(id);
  };

  if (!levels.length) {
    return (
      <div
        style={{
          padding: "20px 0",
          textAlign: "center",
          color: "var(--text3)",
          fontSize: 13,
        }}
      >
        No levels yet. Create one below.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {levels.map((item, index) => {
        const meta = LEVEL_COLORS[index % LEVEL_COLORS.length];
        const selected = index === selectedIndex;
        return (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 10px",
              borderRadius: 10,
              cursor: "pointer",
              background: selected ? "var(--teal2)" : "transparent",
              border: selected
                ? "0.5px solid rgba(29,229,200,0.22)"
                : "0.5px solid transparent",
              transition: "background 0.18s, border-color 0.18s",
            }}
            onClick={() => onSelect(index)}
            onMouseEnter={(e) => {
              if (!selected)
                e.currentTarget.style.background = "var(--surface)";
            }}
            onMouseLeave={(e) => {
              if (!selected) e.currentTarget.style.background = "transparent";
            }}
          >
            {/* icon block */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                flexShrink: 0,
                background: meta.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
              }}
            >
              🌬
            </div>

            {/* text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.title}
              </div>
              <div
                style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}
              >
                {item.inn}-{item.hold}-{item.out}
                {item.hold2 > 0 ? `-${item.hold2}` : ""}
              </div>
            </div>

            {/* badge */}
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 20,
                background: meta.bg,
                color: meta.color,
                flexShrink: 0,
              }}
            >
              {meta.badge}
            </span>

            {/* delete */}
            <button
              onClick={(e) => handleDelete(e, item.id)}
              aria-label="Delete level"
              style={{
                background: "rgba(226,75,74,0.1)",
                border: "0.5px solid rgba(226,75,74,0.2)",
                color: "#e24b4a",
                borderRadius: 6,
                padding: "5px 6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(226,75,74,0.22)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(226,75,74,0.1)")
              }
            >
              <TrashIcon />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default LevelList;
