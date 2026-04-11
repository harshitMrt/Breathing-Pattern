// src/context/context.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  saveCustomLevel,
  getUserCustomLevels,
  deleteCustomLevel,
} from "../services/firestoreService";

export const AppContext = createContext();

const DEFAULT_LEVELS = [
  {
    id: "default-1",
    title: "Box Breathing (4-4-4-4)",
    description: "Used by Navy SEALs to reduce stress and improve focus",
    inn: 4,
    hold: 4,
    out: 4,
    hold2: 4,
    isDefault: true,
  },
  {
    id: "default-2",
    title: "4-7-8 Breathing",
    description: "Promotes relaxation and helps you fall asleep faster",
    inn: 4,
    hold: 7,
    out: 8,
    hold2: 0,
    isDefault: true,
  },
  {
    id: "default-3",
    title: "5-5 Coherent Breathing",
    description: "Balances your heart rate and calms the nervous system",
    inn: 5,
    hold: 0,
    out: 5,
    hold2: 0,
    isDefault: true,
  },
  {
    id: "default-4",
    title: "Resonance Breathing (6-6)",
    description: "Optimizes relaxation and emotional stability",
    inn: 6,
    hold: 0,
    out: 6,
    hold2: 0,
    isDefault: true,
  },
];

export const AppContextProvider = ({ children, uid }) => {
  const [levels, setLevels] = useState(DEFAULT_LEVELS);
  const [loadingLevels, setLoadingLevels] = useState(false);
  // lastAddedIndex: set whenever a new level is added so ExercisePage can auto-select it
  const [lastAddedIndex, setLastAddedIndex] = useState(null);

  // Load user's custom levels from Firestore on login
  useEffect(() => {
    if (!uid) {
      setLevels(DEFAULT_LEVELS);
      return;
    }
    const load = async () => {
      setLoadingLevels(true);
      try {
        const saved = await getUserCustomLevels(uid);
        const custom = saved.map((l) => ({
          id: l.id,
          firestoreId: l.id,
          title: l.name || l.title || "Custom Level",
          description: l.note || l.description || "",
          inn: l.inn,
          hold: l.hold,
          out: l.out,
          hold2: l.hold2,
          technique: l.technique || "",
          isCustom: true,
        }));
        setLevels([...DEFAULT_LEVELS, ...custom]);
      } catch (e) {
        console.error("Failed to load custom levels:", e);
      } finally {
        setLoadingLevels(false);
      }
    };
    load();
  }, [uid]);

  // Add a new level — saves to Firestore if logged in, then auto-selects it
  const addLevel = useCallback(
    async (title, inn, hold, out, hold2 = 0, description = "") => {
      const levelData = {
        name: title,
        title,
        description,
        inn,
        hold,
        out,
        hold2,
        note: description,
        technique: "Custom",
      };

      if (uid) {
        try {
          const firestoreId = await saveCustomLevel(uid, levelData);
          const newLevel = {
            id: firestoreId,
            firestoreId,
            ...levelData,
            isCustom: true,
          };
          setLevels((prev) => {
            const next = [...prev, newLevel];
            setLastAddedIndex(next.length - 1); // ← point to the new level
            return next;
          });
          return newLevel;
        } catch (e) {
          console.error("Failed to save level to Firestore:", e);
        }
      } else {
        // Offline fallback
        const newLevel = {
          id: Date.now().toString(),
          ...levelData,
          isCustom: true,
        };
        setLevels((prev) => {
          const next = [...prev, newLevel];
          setLastAddedIndex(next.length - 1);
          return next;
        });
      }
    },
    [uid],
  );

  // Delete a level — removes from Firestore if custom
  const deleteLevel = useCallback(
    async (id) => {
      const level = levels.find((l) => l.id === id);
      if (level?.isDefault) return; // built-in levels can't be deleted
      if (level?.firestoreId && uid) {
        try {
          await deleteCustomLevel(level.firestoreId);
        } catch (e) {
          console.error(e);
        }
      }
      setLevels((prev) => prev.filter((l) => l.id !== id));
      // Reset lastAddedIndex so it doesn't interfere after deletion
      setLastAddedIndex(null);
    },
    [levels, uid],
  );

  const phaseInstructions = [
    "Breathe in slowly",
    "Hold your breath",
    "Exhale slowly",
    "Hold again",
  ];

  return (
    <AppContext.Provider
      value={{
        levels,
        loadingLevels,
        lastAddedIndex,
        addLevel,
        deleteLevel,
        phaseInstructions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
