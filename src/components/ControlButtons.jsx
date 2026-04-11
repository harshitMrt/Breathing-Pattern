import React from "react";

const ControlButtons = ({ isRunning, onToggle, onNewLevel }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        marginTop: 32,
      }}
    >
      {/* Start / Reset */}
      <button
        onClick={onToggle}
        style={{
          background: "var(--teal)",
          color: "#07101e",
          border: "none",
          padding: "14px 52px",
          borderRadius: 28,
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "-0.2px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          transition: "opacity 0.2s, transform 0.2s",
          boxShadow: "0 0 20px rgba(29,229,200,0.18)",
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
        {isRunning ? (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="#07101e">
              <rect x="2" y="2" width="4" height="10" rx="1" />
              <rect x="8" y="2" width="4" height="10" rx="1" />
            </svg>
            Reset session
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="#07101e">
              <polygon points="3,2 12,7 3,12" />
            </svg>
            Begin session
          </>
        )}
      </button>

      {/* New Level */}
      <button
        onClick={onNewLevel}
        style={{
          background: "transparent",
          color: "var(--text2)",
          border: "0.5px solid var(--border2)",
          padding: "11px 32px",
          borderRadius: 24,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "background 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface)";
          e.currentTarget.style.color = "var(--text)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--text2)";
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="6" y1="1" x2="6" y2="11" />
          <line x1="1" y1="6" x2="11" y2="6" />
        </svg>
        New level
      </button>
    </div>
  );
};

export default ControlButtons;
