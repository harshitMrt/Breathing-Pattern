// src/hooks/useGamification.js
import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────
//  BADGE DEFINITIONS
// ─────────────────────────────────────────────────────────
export const BADGES = [
  {
    id: "first_breath",
    name: "First breath",
    desc: "Complete your very first session",
    color: "#1de5c8",
    bg: "rgba(29,229,200,0.12)",
    icon: "leaf",
    condition: (s) => s.totalSessions >= 1,
  },
  {
    id: "streak_3",
    name: "3-day streak",
    desc: "Practice 3 days in a row",
    color: "#5b9cf6",
    bg: "rgba(91,156,246,0.12)",
    icon: "fire",
    condition: (s) => s.currentStreak >= 3,
  },
  {
    id: "streak_7",
    name: "Week warrior",
    desc: "Practice 7 days in a row",
    color: "#f6ad55",
    bg: "rgba(246,173,85,0.12)",
    icon: "star",
    condition: (s) => s.currentStreak >= 7,
  },
  {
    id: "streak_30",
    name: "Month master",
    desc: "Practice 30 days in a row",
    color: "#9f7aea",
    bg: "rgba(159,122,234,0.12)",
    icon: "crown",
    condition: (s) => s.currentStreak >= 30,
  },
  {
    id: "sessions_10",
    name: "10 sessions",
    desc: "Complete 10 breathing sessions",
    color: "#1de5c8",
    bg: "rgba(29,229,200,0.12)",
    icon: "bolt",
    condition: (s) => s.totalSessions >= 10,
  },
  {
    id: "sessions_50",
    name: "Breath master",
    desc: "Complete 50 sessions",
    color: "#f6ad55",
    bg: "rgba(246,173,85,0.12)",
    icon: "trophy",
    condition: (s) => s.totalSessions >= 50,
  },
  {
    id: "min_60",
    name: "1 hour breathed",
    desc: "Breathe for a total of 60 minutes",
    color: "#5b9cf6",
    bg: "rgba(91,156,246,0.12)",
    icon: "clock",
    condition: (s) => s.totalMinutes >= 60,
  },
  {
    id: "min_300",
    name: "5 hours of calm",
    desc: "Breathe for a total of 5 hours",
    color: "#9f7aea",
    bg: "rgba(159,122,234,0.12)",
    icon: "moon",
    condition: (s) => s.totalMinutes >= 300,
  },
  {
    id: "night_owl",
    name: "Night owl",
    desc: "Complete 3 sessions after 9 PM",
    color: "#9f7aea",
    bg: "rgba(159,122,234,0.12)",
    icon: "owl",
    condition: (s) => s.lateNightSessions >= 3,
  },
  {
    id: "early_bird",
    name: "Early bird",
    desc: "Complete 3 sessions before 8 AM",
    color: "#f6ad55",
    bg: "rgba(246,173,85,0.12)",
    icon: "sun",
    condition: (s) => s.earlyMorningSessions >= 3,
  },
  {
    id: "challenge_7",
    name: "7-day challenge",
    desc: "Finish the 7-day calm challenge",
    color: "#1de5c8",
    bg: "rgba(29,229,200,0.12)",
    icon: "check",
    condition: (s) => s.challengeDaysDone >= 7,
  },
  {
    id: "challenge_30",
    name: "30-day champion",
    desc: "Finish the 30-day calm program",
    color: "#f6ad55",
    bg: "rgba(246,173,85,0.12)",
    icon: "medal",
    condition: (s) => s.challengeDaysDone >= 30,
  },
];

// ─────────────────────────────────────────────────────────
//  DEFAULT STATS
// ─────────────────────────────────────────────────────────
const defaultStats = () => ({
  totalSessions: 0,
  totalMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
  lateNightSessions: 0,
  earlyMorningSessions: 0,
  challengeDaysDone: 0,
  challengeStartDate: null,
  unlockedBadges: [],
});

const STORAGE_KEY = "breatheflow_gamification";

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStats();
    return { ...defaultStats(), ...JSON.parse(raw) };
  } catch {
    return defaultStats();
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {}
}

// ─────────────────────────────────────────────────────────
//  STREAK UPDATER
// ─────────────────────────────────────────────────────────
function updateStreak(stats) {
  const todayStr = new Date().toDateString();
  const lastStr = stats.lastSessionDate
    ? new Date(stats.lastSessionDate).toDateString()
    : null;
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();

  if (lastStr === todayStr) return stats; // already counted today

  const newStreak =
    lastStr === yesterdayStr ? stats.currentStreak + 1 : 1;

  return {
    ...stats,
    currentStreak: newStreak,
    longestStreak: Math.max(stats.longestStreak, newStreak),
    lastSessionDate: Date.now(),
  };
}

// ─────────────────────────────────────────────────────────
//  BADGE CHECKER
// ─────────────────────────────────────────────────────────
function checkBadges(stats) {
  const newlyUnlocked = [];
  const unlocked = [...stats.unlockedBadges];

  BADGES.forEach((badge) => {
    if (!unlocked.includes(badge.id) && badge.condition(stats)) {
      unlocked.push(badge.id);
      newlyUnlocked.push(badge);
    }
  });

  return { updatedUnlocked: unlocked, newlyUnlocked };
}

// ─────────────────────────────────────────────────────────
//  HOOK
// ─────────────────────────────────────────────────────────
export function useGamification() {
  const [stats, setStats] = useState(loadStats);
  const [newBadges, setNewBadges] = useState([]); // queue for toast

  // persist on every change
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  /**
   * Call this at the end of every breathing session.
   * @param {number} durationMinutes - How long the session lasted
   */
  const recordSession = useCallback((durationMinutes = 0) => {
    setStats((prev) => {
      const hour = new Date().getHours();
      let updated = updateStreak(prev);

      updated = {
        ...updated,
        totalSessions: updated.totalSessions + 1,
        totalMinutes: updated.totalMinutes + durationMinutes,
        lateNightSessions:
          hour >= 21 ? updated.lateNightSessions + 1 : updated.lateNightSessions,
        earlyMorningSessions:
          hour < 8
            ? updated.earlyMorningSessions + 1
            : updated.earlyMorningSessions,
      };

      // advance challenge if active
      if (updated.challengeStartDate) {
        const today = new Date().toDateString();
        const lastChallengeDate = updated._lastChallengeDate;
        if (lastChallengeDate !== today) {
          updated = {
            ...updated,
            challengeDaysDone: updated.challengeDaysDone + 1,
            _lastChallengeDate: today,
          };
        }
      }

      const { updatedUnlocked, newlyUnlocked } = checkBadges(updated);
      updated = { ...updated, unlockedBadges: updatedUnlocked };

      if (newlyUnlocked.length > 0) {
        setNewBadges((q) => [...q, ...newlyUnlocked]);
      }

      return updated;
    });
  }, []);

  /** Start the 30-day challenge */
  const startChallenge = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      challengeStartDate: Date.now(),
      challengeDaysDone: 0,
      _lastChallengeDate: null,
    }));
  }, []);

  /** Dismiss the first queued badge toast */
  const dismissBadge = useCallback(() => {
    setNewBadges((q) => q.slice(1));
  }, []);

  return {
    stats,
    newBadges,
    recordSession,
    startChallenge,
    dismissBadge,
  };
}