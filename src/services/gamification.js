// src/services/gamification.js
// Badge definitions + engine that checks and awards badges after each session.
// Stats are stored both in localStorage (fast) and Firestore (persistent/social).

import { saveUserBadges, updateUserStats } from "./firestoreService";

/* ═══════════════════════════════════════
   BADGE DEFINITIONS
═══════════════════════════════════════ */
export const BADGES = [
  // ── First steps ──
  { id: "first_breath",   name: "First Breath",     emoji: "🌱", desc: "Complete your very first session",          condition: s => s.totalSessions >= 1   },
  { id: "sessions_5",     name: "Getting Started",  emoji: "✨", desc: "Complete 5 sessions",                      condition: s => s.totalSessions >= 5   },
  { id: "sessions_10",    name: "Committed",        emoji: "🎯", desc: "Complete 10 sessions",                     condition: s => s.totalSessions >= 10  },
  { id: "sessions_25",    name: "Dedicated",        emoji: "💪", desc: "Complete 25 sessions",                     condition: s => s.totalSessions >= 25  },
  { id: "sessions_50",    name: "Half Century",     emoji: "🏆", desc: "Complete 50 sessions",                     condition: s => s.totalSessions >= 50  },
  { id: "sessions_100",   name: "Centurion",        emoji: "👑", desc: "Complete 100 sessions",                    condition: s => s.totalSessions >= 100 },

  // ── Streaks ──
  { id: "streak_3",       name: "3-Day Streak",     emoji: "🔥", desc: "Practice 3 days in a row",                condition: s => s.currentStreak >= 3   },
  { id: "streak_7",       name: "Week Warrior",     emoji: "⚡", desc: "Practice 7 days in a row",                condition: s => s.currentStreak >= 7   },
  { id: "streak_14",      name: "Fortnight Flow",   emoji: "🌊", desc: "Practice 14 days in a row",               condition: s => s.currentStreak >= 14  },
  { id: "streak_30",      name: "Month Master",     emoji: "🌙", desc: "Practice 30 days in a row",               condition: s => s.currentStreak >= 30  },

  // ── Time ──
  { id: "min_10",         name: "10 Minutes",       emoji: "⏱", desc: "Breathe for a total of 10 minutes",        condition: s => s.totalMinutes >= 10   },
  { id: "min_60",         name: "One Hour",         emoji: "⌛", desc: "Breathe for a total of 60 minutes",       condition: s => s.totalMinutes >= 60   },
  { id: "min_300",        name: "5 Hours Calm",     emoji: "🧘", desc: "Breathe for a total of 5 hours",          condition: s => s.totalMinutes >= 300  },
  { id: "min_600",        name: "10 Hours Zen",     emoji: "🌟", desc: "Breathe for a total of 10 hours",         condition: s => s.totalMinutes >= 600  },

  // ── Time of day ──
  { id: "morning_bird",   name: "Morning Bird",     emoji: "🌅", desc: "Complete 5 sessions before 8 AM",         condition: s => (s.morningSessions  || 0) >= 5 },
  { id: "night_owl",      name: "Night Owl",        emoji: "🦉", desc: "Complete 5 sessions after 10 PM",         condition: s => (s.nightSessions    || 0) >= 5 },

  // ── Diversity ──
  { id: "explorer",       name: "Explorer",         emoji: "🗺", desc: "Try 4 different breathing patterns",      condition: s => (s.uniquePatterns   || 0) >= 4 },
  { id: "ai_user",        name: "AI Pioneer",       emoji: "🤖", desc: "Use AI Recommend to create a level",     condition: s => (s.aiLevelsCreated  || 0) >= 1 },
];

/* ═══════════════════════════════════════
   LOAD / SAVE STATS (localStorage)
═══════════════════════════════════════ */
const STATS_KEY = "bf_gamification_stats";

export const loadStats = () => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : getDefaultStats();
  } catch {
    return getDefaultStats();
  }
};

export const saveStats = (stats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

const getDefaultStats = () => ({
  totalSessions:    0,
  totalMinutes:     0,
  currentStreak:    0,
  longestStreak:    0,
  lastSessionDate:  null,
  unlockedBadgeIds: [],
  morningSessions:  0,
  nightSessions:    0,
  uniquePatterns:   0,
  patternsUsed:     [],
  aiLevelsCreated:  0,
});

/* ═══════════════════════════════════════
   STREAK UPDATE
═══════════════════════════════════════ */
export const updateStreak = (stats) => {
  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86_400_000).toDateString();
  const last      = stats.lastSessionDate
    ? new Date(stats.lastSessionDate).toDateString()
    : null;

  if (last === today) return stats; // already logged today
  stats.currentStreak    = last === yesterday ? stats.currentStreak + 1 : 1;
  stats.longestStreak    = Math.max(stats.longestStreak, stats.currentStreak);
  stats.lastSessionDate  = Date.now();
  return stats;
};

/* ═══════════════════════════════════════
   MAIN ENGINE — call after every session
═══════════════════════════════════════ */
/**
 * @param {string}  uid
 * @param {object}  sessionData  — { durationMinutes, levelName, inn, hold, out, hold2 }
 * @returns {Array} newly unlocked badges (to show in toast)
 */
export const processSession = async (uid, sessionData) => {
  const { durationMinutes = 0, levelName = "", isAIGenerated = false } = sessionData;

  // Load stats
  let stats = loadStats();

  // Update counters
  stats.totalSessions += 1;
  stats.totalMinutes  += durationMinutes;

  // Time-of-day tracking
  const hour = new Date().getHours();
  if (hour < 8)  stats.morningSessions = (stats.morningSessions || 0) + 1;
  if (hour >= 22) stats.nightSessions  = (stats.nightSessions   || 0) + 1;

  // Pattern diversity
  if (levelName && !stats.patternsUsed.includes(levelName)) {
    stats.patternsUsed  = [...(stats.patternsUsed || []), levelName];
    stats.uniquePatterns = stats.patternsUsed.length;
  }

  // AI level tracking
  if (isAIGenerated) stats.aiLevelsCreated = (stats.aiLevelsCreated || 0) + 1;

  // Streak
  stats = updateStreak(stats);

  // Check badges
  const newlyUnlocked = [];
  BADGES.forEach(badge => {
    if (!stats.unlockedBadgeIds.includes(badge.id) && badge.condition(stats)) {
      stats.unlockedBadgeIds.push(badge.id);
      newlyUnlocked.push({ ...badge, unlockedAt: new Date().toISOString() });
    }
  });

  // Persist locally
  saveStats(stats);

  // Sync to Firestore (non-blocking)
  if (uid) {
    const allUnlocked = BADGES
      .filter(b => stats.unlockedBadgeIds.includes(b.id))
      .map(b => ({ id: b.id, name: b.name, emoji: b.emoji, unlockedAt: new Date().toISOString() }));

    Promise.all([
      saveUserBadges(uid, allUnlocked),
      updateUserStats(uid, {
        totalSessions:  stats.totalSessions,
        totalMinutes:   Math.round(stats.totalMinutes),
        currentStreak:  stats.currentStreak,
        longestStreak:  stats.longestStreak,
      }),
    ]).catch(e => console.error("Failed to sync gamification to Firestore:", e));
  }

  return newlyUnlocked;
};

/**
 * Call this when a user creates an AI level, to award the ai_user badge.
 */
export const trackAILevelCreated = async (uid) => {
  const stats = loadStats();
  stats.aiLevelsCreated = (stats.aiLevelsCreated || 0) + 1;
  const newlyUnlocked = [];
  BADGES.forEach(badge => {
    if (!stats.unlockedBadgeIds.includes(badge.id) && badge.condition(stats)) {
      stats.unlockedBadgeIds.push(badge.id);
      newlyUnlocked.push(badge);
    }
  });
  saveStats(stats);
  return newlyUnlocked;
};