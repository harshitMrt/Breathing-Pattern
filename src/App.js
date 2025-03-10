import './App.css';
import React, { useState } from 'react';
import { AppContextProvider } from './context/context';
import AddLevelBtn from './components/button';
import ProgressBar from './components/ProgressBar';
import LevelList from './components/LevelList';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [indexClicked, setIndexClicked] = useState(0);

  return (
    <AppContextProvider>
      <div className="maindiv">
  <div className="sidebar">
    <button onClick={() => setShowForm(prev => !prev)}>
      {showForm ? "Show Progress" : "Add Level"}
    </button>
    <div className="level-list">
      <LevelList 
        showForm={showForm} 
        setShowForm={setShowForm} 
        indexClicked={indexClicked} 
        setIndexClicked={setIndexClicked} 
      />
    </div>
  </div>
    {showForm && <AddLevelBtn />}

    {!showForm && <ProgressBar index={indexClicked} />}
  </div>
</AppContextProvider>
  );
}

export default App;