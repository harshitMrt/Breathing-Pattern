// src/pages/ProfilePage.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getUserSessions, getUserCustomLevels } from "../services/firestoreService";
import AvatarUpload from "../components/AvatarUpload";

const Field = ({ label, value, editing, onChange, type = "text", placeholder }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={S.fieldLabel}>{label}</label>
    {editing ? (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={S.input}
        onFocus={e  => (e.target.style.borderColor = "var(--teal)")}
        onBlur={e   => (e.target.style.borderColor = "var(--border2)")}
      />
    ) : (
      <div style={S.fieldValue}>
        {value || <span style={{ color: "var(--text3)" }}>Not set</span>}
      </div>
    )}
  </div>
);

const GOALS = [
  "Reduce stress", "Better sleep", "More focus",
  "Boost energy",  "Manage anxiety", "Athletic performance",
];

export default function ProfilePage() {
  const { user, userProfile, updateUserProfileData, logout } = useAuth();

  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [sessions, setSessions] = useState([]);
  const [levels,   setLevels]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Editable fields
  const [displayName, setDisplayName] = useState("");
  const [bio,         setBio]         = useState("");
  const [location,    setLocation]    = useState("");
  const [goal,        setGoal]        = useState("");
  const [isPublic,    setIsPublic]    = useState(true);

  // Current photo URL (may update after upload)
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || user?.displayName || "");
      setBio(userProfile.bio       || "");
      setLocation(userProfile.location  || "");
      setGoal(userProfile.goal      || "");
      setIsPublic(userProfile.isPublic  !== false); // default true
      setPhotoURL(userProfile.photoURL  || user?.photoURL || "");
    }
  }, [userProfile, user]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [s, l] = await Promise.all([
          getUserSessions(user.uid),
          getUserCustomLevels(user.uid),
        ]);
        setSessions(s);
        setLevels(l);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    await updateUserProfileData({ displayName, bio, location, goal, isPublic });
    setSaving(false);
    setEditing(false);
  };

  const handleAvatarSuccess = (newURL) => {
    setPhotoURL(newURL);
    // Also update Firestore via AuthContext so other pages refresh
    updateUserProfileData?.({ photoURL: newURL });
  };

  const totalMins   = sessions.reduce((a, s) => a + (s.durationMinutes ?? 0), 0);
  const totalCycles = sessions.reduce((a, s) => a + (s.cycles        ?? 0), 0);

  const joinedDate = userProfile?.joinedAt?.toDate
    ? userProfile.joinedAt.toDate().toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <div style={S.page}>
      <div style={S.inner}>

        {/* ── Hero card ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={S.heroCard}>
          {/* Avatar upload */}
          <AvatarUpload
            uid={user?.uid}
            currentURL={photoURL}
            displayName={displayName || user?.displayName}
            onSuccess={handleAvatarSuccess}
          />

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={S.heroName}>{displayName || user?.email}</h1>
            <p style={S.heroEmail}>{user?.email}</p>
            {userProfile?.bio && <p style={S.heroBio}>{userProfile.bio}</p>}

            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              {userProfile?.location && (
                <span style={S.heroTag}>📍 {userProfile.location}</span>
              )}
              <span style={S.heroTag}>📅 Joined {joinedDate}</span>
              {userProfile?.goal && (
                <span style={{ ...S.heroTag, background: "rgba(29,229,200,0.1)", color: "var(--teal)", borderColor: "rgba(29,229,200,0.2)" }}>
                  🎯 {userProfile.goal}
                </span>
              )}
              <span style={{
                ...S.heroTag,
                background: isPublic ? "rgba(29,229,200,0.08)" : "rgba(255,255,255,0.04)",
                color:      isPublic ? "var(--teal)" : "var(--text3)",
                borderColor:isPublic ? "rgba(29,229,200,0.2)" : "var(--border)",
              }}>
                {isPublic ? "🌐 Public" : "🔒 Private"}
              </span>
            </div>
          </div>

          {/* Edit / Save button */}
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            style={editing ? S.saveBtn : S.editBtn}
            disabled={saving}
          >
            {saving ? "Saving…" : editing ? "Save changes" : "Edit profile"}
          </button>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} style={S.statsRow}>
          {[
            { label: "Total sessions",  value: loading ? "—" : sessions.length,       color: "var(--blue)"   },
            { label: "Minutes breathed",value: loading ? "—" : Math.round(totalMins), color: "var(--teal)"   },
            { label: "Total cycles",    value: loading ? "—" : totalCycles,            color: "var(--purple)" },
            { label: "Custom levels",   value: loading ? "—" : levels.length,          color: "var(--amber)"  },
          ].map(({ label, value, color }) => (
            <div key={label} style={S.statCard}>
              <div style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: "-0.8px" }}>{value}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 5, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Two columns ── */}
        <div style={S.twoCol}>

          {/* Profile details */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} style={S.card}>
            <h2 style={S.cardTitle}>Profile details</h2>
            <div style={S.divider} />

            <Field label="Display name" value={displayName} editing={editing} onChange={setDisplayName} placeholder="Your name" />
            <Field label="Bio"          value={bio}         editing={editing} onChange={setBio}         placeholder="Tell us a bit about yourself…" />
            <Field label="Location"     value={location}    editing={editing} onChange={setLocation}    placeholder="City, Country" />

            {/* Goal picker */}
            {editing ? (
              <div style={{ marginBottom: 18 }}>
                <label style={S.fieldLabel}>Primary goal</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                  {GOALS.map(g => (
                    <button key={g} onClick={() => setGoal(g)} style={{
                      padding: "6px 13px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                      fontWeight:  goal === g ? 700 : 400,
                      background:  goal === g ? "rgba(29,229,200,0.12)" : "var(--surface)",
                      border:      goal === g ? "0.5px solid var(--teal)"   : "0.5px solid var(--border2)",
                      color:       goal === g ? "var(--teal)"               : "var(--text2)",
                    }}>{g}</button>
                  ))}
                </div>
              </div>
            ) : (
              <Field label="Primary goal" value={goal} editing={false} onChange={() => {}} />
            )}

            {/* Public toggle */}
            {editing && (
              <div style={{ marginBottom: 18 }}>
                <label style={S.fieldLabel}>Profile visibility</label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginTop: 6 }}>
                  <div
                    onClick={() => setIsPublic(p => !p)}
                    style={{
                      width:        42,
                      height:       24,
                      borderRadius: 12,
                      background:   isPublic ? "var(--teal)" : "var(--surface)",
                      border:       "0.5px solid var(--border2)",
                      position:     "relative",
                      cursor:       "pointer",
                      transition:   "background 0.2s",
                    }}
                  >
                    <div style={{
                      position:   "absolute",
                      top:        3,
                      left:       isPublic ? 20 : 3,
                      width:      16,
                      height:     16,
                      borderRadius:"50%",
                      background: isPublic ? "#07101e" : "var(--text3)",
                      transition: "left 0.2s",
                    }} />
                  </div>
                  <span style={{ fontSize: 13, color: "var(--text2)" }}>
                    {isPublic ? "Public — visible in Search" : "Private — hidden from Search"}
                  </span>
                </label>
              </div>
            )}

            {editing && (
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={handleSave}          style={S.saveBtn} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
                <button onClick={() => setEditing(false)} style={S.cancelBtn}>Cancel</button>
              </div>
            )}
          </motion.div>

          {/* Account info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} style={S.card}>
            <h2 style={S.cardTitle}>Account</h2>
            <div style={S.divider} />

            {[
              { label: "Email",         value: user?.email || "—"                                                                   },
              { label: "Auth provider", value: user?.providerData?.[0]?.providerId === "google.com" ? "Google" : user?.providerData?.[0]?.providerId === "github.com" ? "GitHub" : "Email / Password" },
              { label: "Member since",  value: joinedDate                                                                            },
              { label: "User ID",       value: user?.uid?.slice(0, 16) + "…", mono: true                                            },
            ].map(({ label, value, mono }) => (
              <div key={label} style={S.accountRow}>
                <span style={S.accountLabel}>{label}</span>
                <span style={{ ...S.accountValue, ...(mono ? { fontFamily: "monospace", fontSize: 11 } : {}) }}>{value}</span>
              </div>
            ))}

            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 10 }}>
                Danger zone
              </p>
              <button onClick={logout} style={S.signOutBtn}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"/>
                </svg>
                Sign out
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Recent sessions ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={S.card}>
          <h2 style={S.cardTitle}>Recent sessions</h2>
          <div style={S.divider} />
          {loading ? (
            <p style={{ color: "var(--text3)", fontSize: 13 }}>Loading…</p>
          ) : sessions.length === 0 ? (
            <p style={{ color: "var(--text3)", fontSize: 13 }}>No sessions yet. Go breathe!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {sessions.slice(0, 5).map(s => (
                <div key={s.id} style={S.sessionRow}>
                  <div style={S.sessionDot} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{s.levelName ?? "Session"}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                      {s.inn}s · {s.hold > 0 ? s.hold + "s hold · " : ""}{s.out}s exhale
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)" }}>{s.durationMinutes ?? "?"} min</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{s.cycles ?? "?"} cycles</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}

const S = {
  page:    { background: "var(--bg)", minHeight: "calc(100vh - 58px)", padding: "36px 0 60px" },
  inner:   { maxWidth: 900, margin: "0 auto", padding: "0 28px", display: "flex", flexDirection: "column", gap: 20 },

  heroCard: { background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: 18, padding: "28px 28px", display: "flex", alignItems: "flex-start", gap: 28, flexWrap: "wrap" },
  heroName:  { fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text)",  margin: 0 },
  heroEmail: { fontSize: 13, color: "var(--text3)", margin: "4px 0 0" },
  heroBio:   { fontSize: 13, color: "var(--text2)", margin: "8px 0 0", lineHeight: 1.65 },
  heroTag:   { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 500, color: "var(--text2)", background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: 20, padding: "4px 10px" },

  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 },
  statCard: { background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: 14, padding: "20px 18px", textAlign: "center" },

  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  card:      { background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: 16, padding: "24px 24px" },
  cardTitle: { fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px", color: "var(--text)", margin: 0 },
  divider:   { height: "0.5px", background: "var(--border)", margin: "16px 0" },

  fieldLabel: { display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 },
  fieldValue: { fontSize: 14, color: "var(--text)", padding: "2px 0" },
  input: { width: "100%", padding: "10px 14px", background: "var(--surface)", border: "0.5px solid var(--border2)", borderRadius: 10, color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" },

  accountRow:   { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid var(--border)" },
  accountLabel: { fontSize: 12, color: "var(--text3)" },
  accountValue: { fontSize: 13, color: "var(--text)", fontWeight: 500 },

  sessionRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "0.5px solid var(--border)" },
  sessionDot: { width: 8, height: 8, borderRadius: "50%", background: "var(--teal)", flexShrink: 0 },

  editBtn:    { padding: "9px 20px", background: "var(--surface)", border: "0.5px solid var(--border2)", borderRadius: 10, color: "var(--text)", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 },
  saveBtn:    { padding: "9px 20px", background: "var(--teal)",    border: "none",                        borderRadius: 10, color: "#07101e",  fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 },
  cancelBtn:  { padding: "9px 20px", background: "transparent",    border: "0.5px solid var(--border2)",  borderRadius: 10, color: "var(--text2)", fontSize: 13, cursor: "pointer" },
  signOutBtn: { display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "rgba(226,75,74,0.08)", border: "0.5px solid rgba(226,75,74,0.25)", borderRadius: 10, color: "#e24b4a", fontSize: 13, fontWeight: 600, cursor: "pointer" },
};