import React, { useState } from "react";
import { motion } from "framer-motion";

const HelpButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="w-12 h-12 bg-white bg-opacity-20 text-white rounded-full shadow-lg hover:bg-opacity-30 transition flex items-center justify-center text-xl font-bold"
      >
        ?
      </button>
      {showTooltip && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowTooltip(false)}
        >
          <motion.div
            className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl"
            initial={{ opacity: 0, scale: 1.6, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.6, y: 50 }}
            transition={{ duration: 0.6 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                How to Use the Breathing App
              </h3>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>Follow the breathing pattern:</strong> Inhale, Hold,
                  Exhale, Hold
                </p>
                <p>
                  <strong>Create custom levels:</strong> Click "Create Level" to
                  add your own breathing patterns
                </p>
                <p>
                  <strong>Select different patterns:</strong> Use the "Levels"
                  button to choose from available patterns
                </p>
                <p>
                  <strong>Best results:</strong> Practice consistently in a
                  quiet environment
                </p>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HelpButton;
