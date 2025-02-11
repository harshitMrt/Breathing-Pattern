import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [levels, setLevels] = useState([
    {
      id: Date.now(),
      title: "Level 1",
      description: "This is the first level",
      inn: 2,
      hold: 5,
      out: 2,
    },
    {
      id: Date.now() + 1,
      title: "Level 2",
      description: "This is the second level",
      inn: 3,
      hold: 10,
      out: 3,
    },
    {
      id: Date.now() + 2,
      title: "Level 3",
      description: "This is the third level",
      inn: 4,
      hold: 15,
      out: 4,
    },
  ]);

  const addLevel = (title, inn, hold, out) => {
    setLevels((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        description: `This is ${title}`,
        inn,
        hold,
        out,
      },
    ]);
  };

  return (
    <AppContext.Provider value={{ levels, addLevel }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
