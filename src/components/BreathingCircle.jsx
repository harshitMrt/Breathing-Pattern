import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/context";
import exhale from "../audio.mp3/Exhale.mp3";
import Inhale from "../audio.mp3/start Breathing.mp3";
import HoldBreath from "../audio.mp3/Hold Breath.mp3";

const StartBreathing = new Audio(Inhale);
const Exhale = new Audio(exhale);
const holdBreath = new Audio(HoldBreath);

const BreathingCircle = ({ index, isRunning, onToggle }) => {
  const [progress, setProgress] = useState(0);
  const [instruction, setInstruction] = useState("Welcome! Press Start Button");
  const [phase, setPhase] = useState("welcome");
  const [remainingTime, setRemainingTime] = useState(0);
  const cycle = 1;

  const { levels } = useAppContext();

  const selectedLEVEL = levels[index];

  const breathIn = selectedLEVEL.inn;
  const breathHold = selectedLEVEL.hold;
  const breathOut = selectedLEVEL.out;

  const interval = useRef(null);
  const intervalSecond = useRef(null);
  const intervalThird = useRef(null);
  const timeout = useRef(null);
  const timeoutSecond = useRef(null);
  const progressValueRef = useRef(0);

  const hold2 = selectedLEVEL.hold2 || 0;

  let timer = breathIn + breathHold + breathOut + hold2;

  const runProgress = useCallback(() => {
    const inTime = 100 / (breathIn * 10);
    const holdTime = breathHold * 1000;
    const outTime = 100 / (breathOut * 10);
    let totalElapsed = 0;

    StartBreathing.play();
    setInstruction("Inhale/Exhale");
    setPhase("inhale");
    setRemainingTime(breathIn);

    interval.current = setInterval(() => {
      totalElapsed += 0.1;
      if (totalElapsed < breathIn) {
        setPhase("inhale");
        setRemainingTime(Math.ceil(breathIn - totalElapsed));
      } else if (totalElapsed < breathIn + breathHold) {
        setPhase("hold");
        setRemainingTime(Math.ceil(breathIn + breathHold - totalElapsed));
        if (totalElapsed >= breathIn && progressValueRef.current >= 100) {
          if (breathHold > 0) {
            holdBreath.play();
          }
          setInstruction("Hold Breath");
        }
      } else if (totalElapsed < breathIn + breathHold + breathOut) {
        setPhase("exhale");
        setRemainingTime(
          Math.ceil(breathIn + breathHold + breathOut - totalElapsed)
        );
        if (
          totalElapsed >= breathIn + breathHold &&
          progressValueRef.current <= 100
        ) {
          Exhale.play();
          setInstruction("Inhale/Exhale");
        }
      } else {
        setPhase("hold2");
        setRemainingTime(
          Math.ceil(breathIn + breathHold + breathOut + hold2 - totalElapsed)
        );
        if (totalElapsed >= breathIn + breathHold + breathOut && hold2 > 0) {
          setInstruction("Hold again");
          holdBreath.play();
        }
      }

      if (
        progressValueRef.current >= 100 &&
        totalElapsed < breathIn + breathHold
      ) {
        // hold phase
      } else if (
        progressValueRef.current <= 0 &&
        totalElapsed >= breathIn + breathHold + breathOut
      ) {
        // end
        clearInterval(interval.current);
        // end of cycle
      } else if (totalElapsed < breathIn) {
        progressValueRef.current += inTime;
        setProgress(Math.min(100, Math.round(progressValueRef.current)));
      } else if (
        totalElapsed >= breathIn + breathHold &&
        totalElapsed < breathIn + breathHold + breathOut
      ) {
        progressValueRef.current -= outTime;
        setProgress(Math.max(0, Math.round(progressValueRef.current)));
      }
    }, 100);
  }, [breathIn, breathHold, breathOut]);

  useEffect(() => {
    if (isRunning) {
      runProgress();

      intervalThird.current = setInterval(() => {
        runProgress();
      }, timer * 1000 + cycle * 1000);
    } else {
      clearInterval(intervalThird.current);
      clearInterval(interval.current);
      clearTimeout(timeout.current);
      clearInterval(intervalSecond.current);

      progressValueRef.current = 0;
      setProgress(0);
      setInstruction("Welcome! Press Start Button");
      setPhase("welcome");
      setRemainingTime(0);
    }
    return () => {
      clearInterval(intervalThird.current);
      clearInterval(interval.current);
      clearTimeout(timeout.current);
      clearInterval(intervalSecond.current);
    };
  }, [isRunning, timer, runProgress]);

  if (!selectedLEVEL) return <p>Select Level</p>;

  const scale = progress === 100 ? 1.1 : (progress / 100) * 0.1 + 1;

  return (
    <div className="flex flex-col items-center justify-center p-1">
      <motion.div
        className="w-40 h-40 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg"
        animate={{ scale }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
      >
        <div className="text-3xl font-bold text-white">{progress}</div>
      </motion.div>
      <p className="mt-2 text-base text-white text-center">{instruction}</p>
    </div>
  );
};

export default BreathingCircle;
