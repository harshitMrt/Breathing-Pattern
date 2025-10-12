import React from "react";
import { useAppContext } from "../context/context";

const LevelList = ({ onSelect }) => {
  const { levels } = useAppContext();

  return (
    <div className="space-y-2">
      {levels.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onSelect(index)}
          className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition"
        >
          <div className="font-medium">{item.title}</div>
          <div className="text-sm text-gray-600">{item.description}</div>
        </button>
      ))}
    </div>
  );
};

export default LevelList;
