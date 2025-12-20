import React, { useState } from "react";
import { AppContextProvider, useAppContext } from "./context/context";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BreathingCircle from "./components/BreathingCircle";
import ControlButtons from "./components/ControlButtons";
import HelpButton from "./components/HelpButton";
import BreathingModal from "./components/BreathingModal";
import LevelList from "./components/LevelList";
import LandingPage from "./components/LandingPage";
import UserForm from "./components/UserForm.jsx";

function App() {
  return (
    <AppContextProvider>
      <AppInner />
    </AppContextProvider>
  );
}

function AppInner() {
  const { levels } = useAppContext();
  const [screen, setScreen] = useState("landing");
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleNewLevel = () => {
    setShowModal(true);
  };

  const handleLevelsClick = () => {
    setShowLevels(!showLevels);
  };

  const handleUserFormClick = () => {
    setShowUserForm(!showUserForm);
  };

  const handleLevelSelect = (index) => {
    setCurrentIndex(index);
    setShowLevels(false);
  };

  const currentLevel = levels[currentIndex];

  if (screen === "landing") {
    return <LandingPage onStart={() => setScreen("breathing")} />;
  }

  if (!levels.length) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-400 to-teal-500 relative flex flex-col overflow-hidden">
        <Header onHomeClick={() => setScreen("landing")} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold">No Levels Available</h1>
            <p>Please create a level to start breathing.</p>
            <button
              onClick={handleNewLevel}
              className="mt-4 bg-white text-blue-600 px-4 py-2 rounded"
            >
              Create Level
            </button>
          </div>
        </div>
        <Footer />
        <BreathingModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-400 to-teal-500 relative flex flex-col overflow-hidden">
      <Header onHomeClick={() => setScreen("landing")} />
      <button
        onClick={() => setScreen("landing")}
        className="absolute top-20 right-4 bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg hover:bg-opacity-30 transition z-10"
      >
        Back
      </button>
      <button
        onClick={handleLevelsClick}
        className="absolute top-20 left-4 bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg hover:bg-opacity-30 transition z-10"
      >
        Levels
      </button>
      <button
        onClick={handleUserFormClick}
        className="absolute top-20 left-24 bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg hover:bg-opacity-30 transition z-10"
      >
        Ask AI
      </button>
      <div className="p-4 text-white text-center pt-24">
        <h1 className="text-2xl font-bold">{currentLevel.title}</h1>
        <p className="text-sm opacity-80">{currentLevel.description}</p>
      </div>
      {showLevels && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Select Level
            </h2>
            <LevelList
              onSelect={(index) => {
                handleLevelSelect(index);
                setShowLevels(false);
              }}
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowLevels(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4 text-center">UserForm</h2>
            <UserForm />
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowUserForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center">
        <BreathingCircle
          index={currentIndex}
          isRunning={isRunning}
          onToggle={handleToggle}
        />
      </div>
      <ControlButtons
        isRunning={isRunning}
        onToggle={handleToggle}
        onNewLevel={handleNewLevel}
      />
      <div className="text-center mt-8 text-white opacity-80 px-4">
        Follow the breathing pattern for best results. Create custom levels to
        match your needs.
      </div>

      <HelpButton />
      <Footer />
      <BreathingModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

export default App;
