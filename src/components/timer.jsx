import React, { useState, useRef } from "react";
import { useAppContext } from "../context/context";
import exhale from "../audio.mp3/Exhale.mp3";
import Inhale from "../audio.mp3/start Breathing.mp3";
import HoldBreath from "../audio.mp3/Hold Breath.mp3";

const StartBreathing = new Audio(Inhale);
const Exhale = new Audio(exhale);
const holdBreath = new Audio(HoldBreath);

export default function Progress({ index = 0 }) {
  const [progress, setProgress] = useState(0);
  const [btn, setBtn] = useState(true);
  const [cycle, setCycle] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const { levels } = useAppContext();
  const selectedLEVEL = levels[index];

  const breathIn = selectedLEVEL.inn;
  const breathHold = selectedLEVEL.hold;
  const breathOut = selectedLEVEL.out;

  const interval = useRef(null);
  const intervalSecond = useRef(null);
  const intervalThird = useRef(null);
  const timeout = useRef(null);
  let progressValue = 0;

  let timer = breathIn + breathHold + breathOut;

  function runProgress() {
    if (!btn) return;

    const inTime = 100 / (breathIn * 10);
    const holdTime = breathHold * 1000;
    const outTime = 100 / (breathOut * 10);

    StartBreathing.play();

    interval.current = setInterval(() => {
      if (progressValue >= 100) {
        holdBreath.play();
        clearInterval(interval.current);

        timeout.current = setTimeout(() => {
          Exhale.play();
          intervalSecond.current = setInterval(() => {
            if (progressValue <= 0) {
              clearInterval(intervalSecond.current);
            } else {
              progressValue -= outTime;
              setProgress(Math.max(0, Math.round(progressValue)));
            }
          }, 100);
        }, holdTime);
      } else {
        progressValue += inTime;
        setProgress(Math.min(100, Math.round(progressValue)));
      }
    }, 100);
  }

  const handleProgress = () => {
    setBtn((prev) => !prev);
    setIsRunning((prev) => !prev);

    if (btn) {
      runProgress();

      intervalThird.current = setInterval(() => {
        runProgress();
      }, timer * 1000 + cycle * 1000);
    } else {
      clearInterval(intervalThird.current);
      clearInterval(interval.current);
      clearTimeout(timeout.current);
      clearInterval(intervalSecond.current);

      progressValue = 0;
      setProgress(0);
      setBtn(false);
      setBtn((prev) => !prev);
    }
  };

  return (
    <>
      <div className="timer-div">
        <h2>Progress Bar</h2>
        <label>Every Cycle is played after a delay of (sec)</label>
        <input
          placeholder="Default value set to 1 sec"
          type="number"
          value={cycle}
          min={0}
          onChange={(e) => setCycle(e.target.value)}
        />
      </div>
      <div className="button-container">
        <ProgressBar progress={progress} isRunning={isRunning} />
        <button onClick={handleProgress}>{!btn ? "Reset" : "Start"}</button>
      </div>
    </>
  );
}

const ProgressBar = ({ progress, isRunning }) => {
  // Track if the timer is running

  return (
    <div className="progress-container">
      <div className="progress-fill" style={{ height: `${progress}%` }}></div>
      <div className="progress-text">
        {!isRunning ? "Welcome! Press Start Button" : ""}
        {isRunning && progress > 0 && progress !== 100 ? "Inhale/Exhale" : ""}
        {isRunning && progress === 100 ? "Hold Breath" : ""}
      </div>
    </div>
  );
};
