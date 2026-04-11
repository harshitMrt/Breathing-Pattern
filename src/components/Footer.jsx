import React from "react";

const LINKS = {
  Product: ["Exercises", "Pricing", "Changelog", "API"],
  Learn: ["Blog", "Research", "FAQ", "Community"],
  Company: ["About", "Contact", "Privacy", "Terms"],
};

const SOCIALS = [
  {
    label: "Email",
    href: "mailto:harshitc153@gmail.com",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="3" width="12" height="9" rx="1.5" />
        <path d="M1 4.5l6 4.5 6-4.5" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com/hritikgulia",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M11.8 1H9.9L7 5.1 4.4 1H1l4.2 6L1 13h1.9l3.1-4.4L8.9 13H13L8.6 6.8 11.8 1z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/harshit-chaudhary-992971286/",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M1.5 4h2v8.5h-2zM2.5 3a1.25 1.25 0 110-2.5A1.25 1.25 0 012.5 3zM5.5 4h1.9v1.2h.1C7.8 4.5 8.8 4 9.9 4c2.1 0 2.6 1.4 2.6 3.2V12.5h-2V7.7c0-.7 0-1.7-1-1.7s-1.2.8-1.2 1.7v4.8h-2V4z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/youraccount",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="1" width="12" height="12" rx="3" />
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="10.2" cy="3.8" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const Footer = () => (
  <footer
    style={{
      background: "var(--bg2)",
      borderTop: "0.5px solid var(--border)",
      marginTop: "auto",
    }}
  >
    <div
      style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 28px" }}
    >
      {/* Top grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40,
          marginBottom: 40,
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "var(--teal)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
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
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "-0.3px",
                color: "var(--text)",
              }}
            >
              Breathe<span style={{ color: "var(--teal)" }}>Flow</span>
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--text3)",
              lineHeight: 1.65,
              maxWidth: 200,
            }}
          >
            Science-backed breathing tools for a calmer, more focused life.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([col, items]) => (
          <div key={col}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text3)",
                marginBottom: 14,
              }}
            >
              {col}
            </p>
            {items.map((item) => (
              <button
                key={item}
                onClick={() => {}}
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "var(--text2)",
                  marginBottom: 9,
                  transition: "color 0.2s",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text2)")
                }
              >
                {item}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "0.5px solid var(--border)",
          paddingTop: 20,
        }}
      >
        <p style={{ fontSize: 12, color: "var(--text3)", margin: 0 }}>
          © 2025 BreatheFlow Inc. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {SOCIALS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "var(--surface)",
                border: "0.5px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text2)",
                transition: "background 0.2s, color 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--surface2)";
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--surface)";
                e.currentTarget.style.color = "var(--text2)";
              }}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
