import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [levels, setLevels] = useState([
    {
      id: Date.now(),
      title: "Box Breathing (4-4-4-4)",
      description: "Used by Navy SEALs to reduce stress and improve focus",
      inn: 4,
      hold: 4,
      out: 4,
      hold2: 4,
    },
    {
      id: Date.now() + 1,
      title: "4-7-8 Breathing",
      description: "Promotes relaxation and helps you fall asleep faster",
      inn: 4,
      hold: 7,
      out: 8,
      hold2: 0,
    },
    {
      id: Date.now() + 2,
      title: "5-5 Coherent Breathing",
      description: "Balances your heart rate and calms the nervous system",
      inn: 5,
      hold: 0,
      out: 5,
      hold2: 0,
    },
    {
      id: Date.now() + 3,
      title: "Resonance Breathing (6-6)",
      description: "Optimizes relaxation and emotional stability",
      inn: 6,
      hold: 0,
      out: 6,
      hold2: 0,
    },
  ]);

  const addLevel = (title, inn, hold, out, hold2 = 0, description = "") => {
    setLevels((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        description: description || `This is ${title}`,
        inn,
        hold,
        out,
        hold2,
      },
    ]);
  };

  const deleteLevel = (id) => {
    setLevels((prev) => prev.filter((level) => level.id !== id));
  };

  const phaseInstructions = [
    "Breathe in slowly",
    "Hold your breath",
    "Exhale slowly",
    "Hold again",
  ];

  return (
    <AppContext.Provider
      value={{ levels, addLevel, deleteLevel, phaseInstructions }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
