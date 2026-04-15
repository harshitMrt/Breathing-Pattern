# 🌬️ BreatheFlow

> A science-backed, AI-powered breathing wellness app built with React, Firebase & Groq AI

---

## What is BreatheFlow?

BreatheFlow is a calming web app that teaches breathing exercises. Think of it like a yoga guide, but for your breath. The app shows a beautiful animated circle that expands and contracts, telling you exactly when to breathe in, hold, and breathe out.

It tracks your sessions, awards you badges as you progress, and even has an AI assistant that creates a personalized breathing plan based on how you're feeling.

| 🧘 Reduce Stress | 😴 Better Sleep | 🎯 Improve Focus | ⚡ Boost Energy |
|---|---|---|---|

> No equipment needed · Works in any browser · Free to use

---

## Why BreatheFlow?

- 😰 77% of people regularly experience physical stress symptoms
- 😶 Most people don't know HOW to breathe correctly under stress
- 💊 Existing solutions rely on medication or expensive therapy sessions
- 📱 Apps are complicated — people need something dead-simple and visual

✅ BreatheFlow solves this with a free, beautiful, guided breathing experience — no sign-up needed to try it.

---

## User Journey

1. **Sign Up / Log In** — Create a free account with email or Google. Firebase handles all the secure login magic behind the scenes.
2. **Choose a Pattern** — Pick from 4 built-in techniques (Box Breathing, 4-7-8, Coherent Breathing) or ask the AI to create one for you.
3. **Follow the Circle** — Press Start. A ring fills up = inhale. Ring drains = exhale. Just follow the visual — no counting required.
4. **Earn Badges & Streaks** — Every session is tracked. Complete milestones to unlock badges. Keep a daily streak to become a 'Month Master'!

> The entire cycle takes as little as 2 minutes and can be done anywhere — at your desk, in bed, or before a presentation.

---

## Built-in Breathing Patterns

| Pattern | Technique | Best For |
|---|---|---|
| **4-4-4-4** — Box Breathing | Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Used by Navy SEALs. | High stress, panic, anxiety |
| **4-7-8** — 4-7-8 Breathing | Inhale 4s → Hold 7s → Exhale 8s. Activates your body's rest mode. | Poor sleep, winding down |
| **5-0-5** — 5-5 Coherent | Inhale 5s → Exhale 5s. Balances your nervous system and heart rate. | Emotional regulation, focus |
| **6-0-6** — Resonance | Slow, rhythmic breathing at exactly 5 breaths/min for HRV improvement. | Deep relaxation, stability |

Users can also create fully custom patterns via the 'New Level' button, or let the AI generate one based on their needs.

---

## ✨ AI-Powered Recommendations

1. You tell the app your goals (reduce stress, sleep better, boost energy…)
2. You pick your experience level (beginner, intermediate, advanced)
3. The app sends this info to Groq AI (a fast, free AI service)
4. AI designs a custom breathing pattern — just for you — in under 3 seconds
5. The new level is saved to your account and ready to use immediately

**Example AI-Generated Level:**
Name:      "Deep Focus Flow"
Inhale:    5 seconds
Hold:      3 seconds
Exhale:    7 seconds
Technique: Modified 5-3-7
Note:      "Exhale longer to calm the nervous system"




> Powered by Groq (llama-3.1-8b-instant) — free & blazing fast

---

## 🏅 Badges & Streaks

People forget to practice breathing. Badges and streaks give them a reason to return every day — just like Duolingo does for language learning.

| Category | Range |
|---|---|
| Session Count | First Breath 🌱 → Centurion 👑 (100 sessions) |
| Daily Streaks | 3-Day Streak 🔥 → Month Master 🌙 (30 days) |
| Total Time | 10 Minutes ⏱ → 10 Hours Zen 🌟 (600 min) |
| Explorer | Try 4 different breathing patterns 🗺 |

**Sample Badges:** 🌱 First Breath · 🔥 3-Day Streak · 🏆 Half Century · 👑 Centurion · 🌙 Month Master · 🤖 AI Pioneer · 🌅 Morning Bird · 🌟 10 Hours Zen

> 19 total badges to unlock — stored in Firestore so they persist across devices

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| ⚛️ **React** | The visual interface — every button, the breathing circle, nav bar — all reusable components |
| 🔥 **Firebase** | Database & login — stores all user data, sessions, badges, custom levels; handles auth |
| 🎬 **Framer Motion** | Animations — makes the breathing circle expand smoothly with buttery transitions |
| 🤖 **Groq AI** | The AI brain — receives user needs, responds with a custom JSON breathing pattern in < 1 second |

> All services have generous free tiers — this entire app costs $0 to run at small scale

---

## 🏗️ Architecture
👤 User (Browser)
↓
⚛️ React App
• Pages & Navigation
• Breathing Circle
• Badge System
• AI Modal
↓                    ↓
🔥 Firebase          🤖 Groq AI API
• Auth (login)       • Receives user needs
• Firestore DB       • Returns JSON level
• Sessions/Badges    • llama-3.1-8b model
• Custom Levels
↕
💾 localStorage
Fast local badge/stats cache (synced to Firestore)


**Data Flow:** User action → React updates state → Firebase stores permanently → Gamification checks badges → Toast notification shown

---

## Features

- 🔐 **Multi-Method Auth** — Login with Email, Google, or GitHub via Firebase Authentication
- 🌬️ **Live Breathing Guide** — Animated SVG circle with phase transitions and audio cues
- ✨ **AI Level Creator** — Groq AI generates a custom breathing pattern as JSON, saved instantly
- 📊 **Session History** — Every session saved to Firestore with duration, cycle count, and level used
- 🏅 **19 Unlock Badges** — From 'First Breath' to 'Centurion' — badges sync to the cloud across all devices
- 🔍 **User Search** — Find and view other users' public profiles, streaks, and badges

> All 6 features work together seamlessly in a single-page application (no page reloads)

---

## 📁 Project Structure
```
src/
├── components/
│   ├── BreathingCircle.jsx     ← The main exercise widget
│   ├── AIRecommendModal.jsx    ← AI interface
│   └── BadgeToast.jsx          ← Badge popup notification
├── context/
│   ├── AuthContext.js          ← Login state (global)
│   └── context.jsx             ← Level list state (global)
├── services/
│   ├── firestoreService.js     ← All database operations
│   ├── gamification.js         ← Badge + streak logic
│   └── aiRecommendation.js     ← Groq API calls
└── App.js                      ← Root: nav + routing
```

---

## Challenges & Solutions

| Challenge | Solution |
|---|---|
| Breathing timer drifts after 10+ cycles | Used `setInterval` with a progress `useRef` instead of `useState` to avoid stale closures. Updates every 100ms without re-renders. |
| AI returned invalid JSON (with markdown fences) | Added `.replace(/\`\`\`json\|\`\`\`/g, '').trim()` cleanup before `JSON.parse()`. Also added value clamping for out-of-range numbers. |
| Badges not persisting across browser refreshes | Built a two-layer system: `localStorage` for instant reads + Firestore for cloud backup. Both sync on every session end. |
| Session save was blocking the UI | Made `saveSession` + `processSession` calls async/non-blocking using `Promise.all()` and fire-and-forget patterns. |

---

## 🗺️ Roadmap

| Version | Feature |
|---|---|
| V2 | 🔔 Push Notifications via Firebase Cloud Messaging |
| V2 | 🏆 Social Leaderboard — weekly rankings by streak and total minutes |
| V3 | 💓 Heart Rate Integration with Apple Watch / Fitbit |
| V3 | 📚 Guided Programs — 7-day or 30-day structured courses |
| V3 | 📱 Mobile App via React Native (core logic needs zero rewrite) |
| V4 | 🧠 AI Personalization — learns which patterns each user finds most effective |

> The foundation is solid — Firebase + React scales to millions of users with minimal code changes.

---

*Breathe · Track · Grow*
