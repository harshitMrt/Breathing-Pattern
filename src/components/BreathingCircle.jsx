// src/components/BreathingCircle.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/context";
import { useAuth }       from "../context/AuthContext";
import { saveSession }   from "../services/firestoreService";
import { processSession } from "../services/gamification";

import exhaleAudio from "../audio.mp3/Exhale.mp3";
import inhaleAudio from "../audio.mp3/start Breathing.mp3";
import holdAudio   from "../audio.mp3/Hold Breath.mp3";
// comment
const SoundInhale = new Audio(inhaleAudio);
const SoundExhale = new Audio(exhaleAudio);
const SoundHold   = new Audio(holdAudio);

const PHASE_META = {
  "Welcome! Press Start": { color: "var(--text3)",  ring: "rgba(255,255,255,0.08)" },
  "Inhale":               { color: "var(--blue)",   ring: "var(--blue)"            },
  "Hold breath":          { color: "var(--purple)", ring: "var(--purple)"          },
  "Exhale":               { color: "var(--teal)",   ring: "var(--teal)"            },
  "Hold again":           { color: "var(--amber)",  ring: "var(--amber)"           },
};

// Hue targets per phase for smooth colour blending
const PHASE_HUES = {
  "Welcome! Press Start": { h1: 220, h2: 240 },
  "Inhale":               { h1: 210, h2: 190 },
  "Hold breath":          { h1: 270, h2: 290 },
  "Exhale":               { h1: 168, h2: 150 },
  "Hold again":           { h1: 38,  h2: 22  },
};

const CIRCUMFERENCE = 2 * Math.PI * 68;

// Particle + wisp pools — created once at module level
const PARTICLES = Array.from({ length: 60 }, () => ({
  angle:   Math.random() * Math.PI * 2,
  dist:    55 + Math.random() * 35,
  size:    0.6 + Math.random() * 1.8,
  speed:   0.0002 + Math.random() * 0.0004,
  phase:   Math.random() * Math.PI * 2,
  opacity: 0.2 + Math.random() * 0.5,
  hOff:    (Math.random() - 0.5) * 40,
}));

const WISPS = Array.from({ length: 8 }, (_, i) => ({
  angle: (i / 8) * Math.PI * 2,
  len:   30 + Math.random() * 25,
  width: 2  + Math.random() * 3,
  speed: 0.00015 + Math.random() * 0.0002,
  phase: Math.random() * Math.PI * 2,
  hOff:  (Math.random() - 0.5) * 30,
}));

/**
 * Props:
 *   index          — selected level index
 *   isRunning      — controlled by parent
 *   onToggle       — parent toggle callback
 *   onPhaseChange  — (phase: string) => void
 *   onBadgesEarned — (badges: array) => void
 */
const BreathingCircle = ({ index, isRunning, onToggle, onPhaseChange, onBadgesEarned }) => {
  const { levels } = useAppContext();
  const { user }   = useAuth();
  const level      = levels[index];

  const breathIn   = level?.inn   ?? 4;
  const breathHold = level?.hold  ?? 4;
  const breathOut  = level?.out   ?? 4;
  const hold2      = level?.hold2 ?? 0;
  const totalTimer = breathIn + breathHold + breathOut + hold2;

  const [progress, setProgress] = useState(0);
  const [phase,    setPhase]    = useState("Welcome! Press Start");

  const progRef  = useRef(0);
  const ivIn     = useRef(null);
  const ivOut    = useRef(null);
  const ivCycle  = useRef(null);
  const toHold   = useRef(null);

  const sessionStartRef = useRef(null);
  const cycleCountRef   = useRef(0);

  // ── Canvas refs ────────────────────────────────────────────────────────────
  const bgRef      = useRef(null);
  const fxRef      = useRef(null);
  const animRef    = useRef(null);
  const clockRef   = useRef(0);
  const lastTsRef  = useRef(null);
  const phaseRef   = useRef("Welcome! Press Start");
  const smoothHRef = useRef(220);

  // ── Main canvas render loop ────────────────────────────────────────────────
  useEffect(() => {
    const bgC = bgRef.current;
    const fxC = fxRef.current;
    if (!bgC || !fxC) return;
    const bg = bgC.getContext("2d");
    const fx = fxC.getContext("2d");
    const W = 240, H = 240, CX = W / 2, CY = H / 2;

    const lerp   = (a, b, t) => a + (b - a) * t;
    const easeIO = (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    const hsla   = (h, s, l, a) => `hsla(${h},${s}%,${l}%,${a})`;

    function drawBgGlow(hue, ease) {
      const g = bg.createRadialGradient(CX, CY, 0, CX, CY, 115);
      g.addColorStop(0,    hsla(hue, 55, 18, 0.95));
      g.addColorStop(0.45, hsla(hue, 45, 12, 0.8));
      g.addColorStop(0.75, hsla(hue, 35,  8, 0.4));
      g.addColorStop(1,    hsla(hue, 25,  5, 0));
      bg.beginPath(); bg.arc(CX, CY, 115, 0, Math.PI * 2);
      bg.fillStyle = g; bg.fill();
    }

    function drawRipples(hue, ease, t) {
      for (let i = 0; i < 3; i++) {
        const frac = ((t * 0.00025 + i / 3) % 1);
        const r    = 20 + frac * 80;
        const a    = (1 - frac) * 0.18 * ease;
        if (a < 0.005) continue;
        bg.beginPath(); bg.arc(CX, CY, r, 0, Math.PI * 2);
        bg.strokeStyle = hsla(hue, 70, 65, a);
        bg.lineWidth = 1.5; bg.stroke();
      }
    }

    function drawOuterRing(hue, ease, t) {
      const R = 108;
      bg.save(); bg.translate(CX, CY); bg.rotate(-Math.PI / 2 + t * 0.00022);

      bg.beginPath(); bg.arc(0, 0, R, 0, Math.PI * 2);
      bg.strokeStyle = hsla(hue, 40, 55, 0.08); bg.lineWidth = 2.5; bg.stroke();

      const filled = ease * Math.PI * 2;
      const segs   = Math.max(1, Math.round((filled / (Math.PI * 2)) * 80));
      const segA   = filled / segs;
      bg.lineCap = "round";
      for (let s = 0; s < segs; s++) {
        const a0    = s * segA;
        const a1    = a0 + segA - 0.018;
        if (a1 <= a0) continue;
        const alpha = 0.18 + 0.65 * (s / segs) * ease;
        bg.beginPath(); bg.arc(0, 0, R, a0, a1);
        bg.strokeStyle = hsla(hue, 75, 68, alpha); bg.lineWidth = 2.5; bg.stroke();
      }

      if (ease > 0.01) {
        const da = ease * Math.PI * 2;
        const dx = Math.cos(da) * R, dy = Math.sin(da) * R;
        const gd = bg.createRadialGradient(dx, dy, 0, dx, dy, 7);
        gd.addColorStop(0, hsla(hue, 90, 85, 0.95));
        gd.addColorStop(1, hsla(hue, 70, 70, 0));
        bg.beginPath(); bg.arc(dx, dy, 5, 0, Math.PI * 2);
        bg.fillStyle = gd; bg.fill();
      }
      bg.restore();
    }

    function drawOrb(hue, ease, t) {
      const wobble = 1 + 0.04 * Math.sin(t * 0.0018);
      const R      = (22 + ease * 34) * wobble;
      const g      = bg.createRadialGradient(CX, CY - R * 0.15, R * 0.1, CX, CY, R);
      g.addColorStop(0,    hsla(hue + 10, 60, 88, 0.9));
      g.addColorStop(0.35, hsla(hue,      70, 70, 0.7));
      g.addColorStop(0.7,  hsla(hue - 10, 65, 50, 0.35));
      g.addColorStop(1,    hsla(hue,      50, 35, 0));
      bg.beginPath(); bg.arc(CX, CY, R, 0, Math.PI * 2);
      bg.fillStyle = g; bg.fill();
    }

    function drawMandala(hue, ease, t) {
      const layers = [
        { n: 6,  R: 10 + ease * 28, speed: 0.00055, rev: false, pLen: 0.6,  alpha: 0.55 },
        { n: 9,  R: 18 + ease * 42, speed: 0.00035, rev: true,  pLen: 0.5,  alpha: 0.35 },
        { n: 12, R: 28 + ease * 56, speed: 0.0002,  rev: false, pLen: 0.45, alpha: 0.22 },
      ];
      for (const { n, R, speed, rev, pLen, alpha } of layers) {
        const spin = t * speed * (rev ? -1 : 1);
        fx.save(); fx.translate(CX, CY); fx.rotate(spin);
        for (let p = 0; p < n; p++) {
          const a  = (p / n) * Math.PI * 2;
          const px = Math.cos(a) * R, py = Math.sin(a) * R;
          const pl = R * pLen, pw = pl * 0.32;
          const aa = alpha * ease * (0.7 + 0.3 * Math.sin(t * 0.0012 + p));
          fx.save(); fx.translate(px, py); fx.rotate(a + Math.PI / 2);
          fx.beginPath();
          fx.moveTo(0, 0);
          fx.bezierCurveTo( pw, -pl * 0.35,  pw, -pl * 0.75, 0, -pl);
          fx.bezierCurveTo(-pw, -pl * 0.75, -pw, -pl * 0.35, 0,  0);
          fx.fillStyle = hsla(hue + p * 3, 72, 66, aa);
          fx.fill(); fx.restore();
        }
        fx.restore();
      }
    }

    function drawWisps(hue, ease, t) {
      if (ease < 0.03) return;
      fx.save(); fx.translate(CX, CY);
      for (const w of WISPS) {
        const pulse  = 0.6 + 0.4 * Math.sin(t * 0.0015 + w.phase);
        const a      = w.angle + t * w.speed;
        const innerR = 18 + ease * 20;
        const outerR = innerR + w.len * ease * pulse;
        const x0 = Math.cos(a) * innerR, y0 = Math.sin(a) * innerR;
        const x1 = Math.cos(a) * outerR, y1 = Math.sin(a) * outerR;
        const gd = fx.createLinearGradient(x0, y0, x1, y1);
        gd.addColorStop(0, hsla(hue + w.hOff, 75, 72, 0.55 * ease * pulse));
        gd.addColorStop(1, hsla(hue + w.hOff, 60, 60, 0));
        const cx = Math.cos(a + 0.18) * ((innerR + outerR) * 0.5);
        const cy = Math.sin(a + 0.18) * ((innerR + outerR) * 0.5);
        fx.beginPath(); fx.moveTo(x0, y0); fx.quadraticCurveTo(cx, cy, x1, y1);
        fx.strokeStyle = gd;
        fx.lineWidth   = w.width * ease * pulse;
        fx.lineCap     = "round";
        fx.stroke();
      }
      fx.restore();
    }

    function drawParticles(hue, ease, t) {
      for (const p of PARTICLES) {
        p.angle += p.speed;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.0013 + p.phase);
        const dist  = p.dist * (0.75 + 0.25 * ease) * (0.92 + 0.08 * pulse);
        const x = CX + Math.cos(p.angle) * dist;
        const y = CY + Math.sin(p.angle) * dist;
        const a = p.opacity * ease * pulse;
        if (a < 0.01) continue;
        const sz = p.size * (0.5 + 0.5 * ease) * pulse;
        const gd = fx.createRadialGradient(x, y, 0, x, y, sz * 2.5);
        gd.addColorStop(0, hsla(hue + p.hOff, 80, 78, a));
        gd.addColorStop(1, hsla(hue + p.hOff, 60, 60, 0));
        fx.beginPath(); fx.arc(x, y, sz * 2.5, 0, Math.PI * 2);
        fx.fillStyle = gd; fx.fill();
      }
    }

    function drawGeometry(hue, ease, t) {
      for (let pass = 0; pass < 2; pass++) {
        const sides = pass === 0 ? 6 : 3;
        const R     = (8 + ease * 16) * (pass === 0 ? 1 : 0.6);
        const spin  = t * (pass === 0 ? 0.00065 : -0.0009);
        fx.save(); fx.translate(CX, CY); fx.rotate(spin);
        fx.beginPath();
        for (let i = 0; i <= sides; i++) {
          const a = (i / sides) * Math.PI * 2;
          const r = R * (1 + 0.06 * Math.sin(t * 0.002 + i * 1.3));
          i === 0
            ? fx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
            : fx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        fx.strokeStyle = hsla(hue + pass * 20, 65, 70, (pass === 0 ? 0.5 : 0.28) * ease);
        fx.lineWidth   = 0.8; fx.stroke();
        fx.restore();
      }
    }

    function render(ts) {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min(ts - lastTsRef.current, 40);
      lastTsRef.current  = ts;
      clockRef.current  += dt;
      const T = clockRef.current;

      const targetH  = PHASE_HUES[phaseRef.current]?.h1 ?? 220;
      const ls       = 1 - Math.pow(0.001, dt / 1000);
      smoothHRef.current = lerp(smoothHRef.current, targetH, ls * 3);

      const ease = easeIO(progRef.current / 100);
      const hue  = smoothHRef.current;

      bg.clearRect(0, 0, W, H);
      fx.clearRect(0, 0, W, H);

      drawBgGlow(hue, ease);
      drawRipples(hue, ease, T);
      drawOuterRing(hue, ease, T);
      drawOrb(hue, ease, T);
      drawMandala(hue, ease, T);
      drawWisps(hue, ease, T);
      drawParticles(hue, ease, T);
      drawGeometry(hue, ease, T);

      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animRef.current);
      lastTsRef.current = null;
    };
  }, []); // runs once — all values read via refs

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // ── Breathing logic (completely unchanged) ─────────────────────────────────
  const changePhase = useCallback((p) => {
    setPhase(p);
    onPhaseChange?.(p);
  }, [onPhaseChange]);

  const clearAll = () => {
    [ivIn, ivOut, ivCycle].forEach(r => { clearInterval(r.current); r.current = null; });
    [toHold].forEach(r => { clearTimeout(r.current); r.current = null; });
  };

  const persistSession = useCallback(async () => {
    if (!sessionStartRef.current || cycleCountRef.current === 0) return;
    const durationMs      = Date.now() - sessionStartRef.current;
    const durationMinutes = parseFloat((durationMs / 60000).toFixed(2));
    try {
      if (user) {
        await saveSession(user.uid, {
          levelName: level?.name ?? level?.title ?? `Level ${index + 1}`,
          inn: breathIn, hold: breathHold, out: breathOut, hold2,
          durationMinutes, cycles: cycleCountRef.current,
        });
      }
      const newBadges = await processSession(user?.uid ?? null, {
        durationMinutes,
        levelName:     level?.name ?? level?.title ?? "",
        isAIGenerated: level?.isCustom ?? false,
      });
      if (newBadges.length > 0) onBadgesEarned?.(newBadges);
    } catch (e) {
      console.error("Failed to save session:", e);
    }
  }, [user, level, index, breathIn, breathHold, breathOut, hold2, onBadgesEarned]);

  const runOneCycle = useCallback(() => {
    const inStep  = 100 / (breathIn  * 10);
    const outStep = 100 / (breathOut * 10);

    SoundInhale.play();
    changePhase("Inhale");

    ivIn.current = setInterval(() => {
      progRef.current += inStep;
      if (progRef.current >= 100) {
        progRef.current = 100;
        setProgress(100);
        clearInterval(ivIn.current);
        if (breathHold > 0) SoundHold.play();
        changePhase("Hold breath");
        toHold.current = setTimeout(() => {
          SoundExhale.play();
          changePhase("Exhale");
          ivOut.current = setInterval(() => {
            progRef.current -= outStep;
            if (progRef.current <= 0) {
              progRef.current = 0;
              setProgress(0);
              clearInterval(ivOut.current);
              cycleCountRef.current += 1;
              if (hold2 > 0) { SoundHold.play(); changePhase("Hold again"); }
            } else {
              setProgress(Math.round(progRef.current));
            }
          }, 100);
        }, breathHold * 1000);
      } else {
        setProgress(Math.round(progRef.current));
      }
    }, 100);
  }, [breathIn, breathHold, breathOut, hold2, changePhase]);

  useEffect(() => {
    if (isRunning) {
      progRef.current         = 0;
      cycleCountRef.current   = 0;
      sessionStartRef.current = Date.now();
      runOneCycle();
      ivCycle.current = setInterval(runOneCycle, totalTimer * 1000);
    } else {
      clearAll();
      persistSession();
      progRef.current = 0;
      setProgress(0);
      changePhase("Welcome! Press Start");
    }
    return clearAll;
  }, [isRunning, runOneCycle, totalTimer, changePhase, persistSession]);

  if (!level) return <p style={{ color: "var(--text2)" }}>Select a level</p>;

  const meta   = PHASE_META[phase] ?? PHASE_META["Welcome! Press Start"];
  
  const scale  = 1 + (progress / 100) * 0.08;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <motion.div
        animate={{ scale }}
        transition={{ duration: 0.3, ease: "easeOut", type: "spring", stiffness: 100, damping: 15 }}
        style={{ position: "relative", width: 240, height: 240 }}
      >
        {/* ── bg canvas: glow, ripples, outer ring, orb ── */}
        <canvas
          ref={bgRef}
          width={240}
          height={240}
          style={{
            position: "absolute", top: 0, left: 0,
            borderRadius: "50%", zIndex: 1,
          }}
        />

        {/* ── fx canvas: mandala, wisps, particles, geometry ── */}
        <canvas
          ref={fxRef}
          width={240}
          height={240}
          style={{
            position: "absolute", top: 0, left: 0,
            borderRadius: "50%", zIndex: 2,
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* ── Phase label (unchanged) ── */}
      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 6  }}
          animate={{ opacity: 1, y: 0  }}
          exit={{   opacity: 0, y: -4  }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            fontSize: 13, fontWeight: 600, letterSpacing: "0.06em",
            textTransform: "uppercase", color: meta.color,
            marginTop: 18, transition: "color 0.4s ease",
          }}
        >
          {phase}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default BreathingCircle;