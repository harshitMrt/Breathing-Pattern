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
        <motion.div
          className="absolute bottom-16 right-0 bg-white text-black p-4 rounded-lg shadow-lg max-w-xs"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm">Follow the breathing pattern for best results. Create custom levels to match your needs.</p>
        </motion.div>
      )}
    </div>
  );
};

export default HelpButton;
