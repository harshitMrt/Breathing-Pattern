import React, { useState, useEffect } from "react";

const Header = ({ onHomeClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled ? "rgba(7,16,30,0.97)" : "rgba(7,16,30,0.90)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        transition: "background 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          onClick={onHomeClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--teal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
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
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "-0.4px",
              color: "var(--text)",
            }}
          >
            Breathe<span style={{ color: "var(--teal)" }}>Flow</span>
          </span>
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", gap: 4 }}>
          {["Home", "About", "Contact"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              onClick={label === "Home" ? onHomeClick : undefined}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                fontSize: 13,
                color: "var(--text2)",
                transition: "color 0.2s, background 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text)";
                e.currentTarget.style.background = "var(--surface)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text2)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <button
          onClick={onHomeClick}
          style={{
            background: "var(--teal)",
            color: "#07101e",
            border: "none",
            padding: "8px 20px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "-0.2px",
            transition: "opacity 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Start free
        </button>
      </div>
    </header>
  );
};

export default Header;
