import React from "react";
import { useAppContext } from "../context/context";
import { FaTrash } from "react-icons/fa";

const LevelList = ({ onSelect }) => {
  const { levels, deleteLevel } = useAppContext();

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteLevel(id);
  };

  return (
    <div className="space-y-2">
      {levels.map((item, index) => (
        <div key={item.id} className="flex items-center">
          <button
            onClick={() => onSelect(index)}
            className="flex-1 text-left p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition"
          >
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-gray-600">{item.description}</div>
          </button>
          <button
            onClick={(e) => handleDelete(e, item.id)}
            className="ml-2 p-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition"
          >
            <FaTrash size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default LevelList;
