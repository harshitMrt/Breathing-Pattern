import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/context";

const BreathingModal = ({ isOpen, onClose }) => {
  const { addLevel } = useAppContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inhale, setInhale] = useState(4);
  const [hold1, setHold1] = useState(4);
  const [exhale, setExhale] = useState(4);
  const [hold2, setHold2] = useState(4);
  const [includeHold2, setIncludeHold2] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const levelTitle =
      title ||
      `Custom ${inhale}-${hold1}-${exhale}${includeHold2 ? `-${hold2}` : ""}`;
    addLevel(levelTitle, inhale, hold1, exhale, includeHold2 ? hold2 : 0, description);
    onClose();
    // Reset form
    setTitle("");
    setDescription("");
    setInhale(4);
    setHold1(4);
    setExhale(4);
    setHold2(4);
    setIncludeHold2(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              Create Custom Breathing Level
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Level Name (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., My Breathing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md h-20"
                  placeholder="e.g., A custom breathing pattern for relaxation"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Inhale (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inhale}
                    onChange={(e) => setInhale(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Hold (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hold1}
                    onChange={(e) => setHold1(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Exhale (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={exhale}
                    onChange={(e) => setExhale(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Second Hold (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hold2}
                    onChange={(e) => setHold2(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled={!includeHold2}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeHold2"
                  checked={includeHold2}
                  onChange={(e) => setIncludeHold2(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="includeHold2" className="text-sm">
                  Include second hold phase (for Box breathing pattern)
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Level
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BreathingModal;
