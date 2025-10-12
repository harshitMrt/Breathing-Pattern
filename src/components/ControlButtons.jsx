import React from "react";

const ControlButtons = ({ isRunning, onToggle, onNewLevel }) => {
  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      <button
        onClick={onToggle}
        className="px-6 py-3 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition"
      >
        {isRunning ? "Reset" : "Start"}
      </button>
      <button
        onClick={onNewLevel}
        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        + New Level
      </button>
    </div>
  );
};

export default ControlButtons;
