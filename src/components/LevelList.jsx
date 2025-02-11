import React from "react";
import { useAppContext } from "../context/context";

const LevelList = ({ showForm, setShowForm, setIndexClicked }) => {
  const { levels } = useAppContext();

  const handleClicked = (index) => {
    if (showForm) {
      setShowForm((prevForm) => !prevForm);
    }
    setIndexClicked(index);
  };

  return (
    <div className="levels">
      {levels.map((item, index) => (
        <button
          key={item.id}
          onClick={() => handleClicked(index)}
          className="level-btn"
        >
          {item.title}
        </button>
      ))}
    </div>
  );
};

export default LevelList;
