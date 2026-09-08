"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Droplets,
  Sparkles,
  Zap,
  Square,
  Play,
  RotateCcw,
  Gauge,
  Waves,
  Vibrate,
  AlertTriangle,
  ShieldCheck,
  Flame,
  Info,
} from "lucide-react";
import { soundEngine } from "@/lib/haptics";

export type CleaningMode = "water" | "dirt" | "full_purge";
export type PowerProfile = "standard" | "ultra";

interface ModeConfig {
  id: CleaningMode;
  name: string;
  tag: string;
  desc: string;
  icon: typeof Droplets;
  defaultFreq: number;
}

const CLEANING_MODES: ModeConfig[] = [
  {
    id: "water",
    name: "165Hz Water Ejection",
    tag: "HYDRO_PUMP",
    desc: "165Hz resonant Helmholtz displacement waves tuned to break liquid surface tension and pump water droplets out.",
    icon: Droplets,
    defaultFreq: 165,
  },
  {
    id: "dirt",
    name: "Dust & Dirt Buster",
    tag: "PARTICLE_SHOCK",
    desc: "Dynamic sweep (130Hz – 440Hz) with acoustic shear harmonics to dislodge dried pocket lint, dust, and particulate debris.",
    icon: Sparkles,
    defaultFreq: 240,
  },
  {
    id: "full_purge",
    name: "Full Power Dual Purge",
    tag: "MAX_THRUST",
    desc: "Maximum air velocity hydro-pulse + harmonic agitation sweep + multi-torque vibration for complete restoration.",
    icon: Zap,
    defaultFreq: 165,
  },
];

export function SpeakerCleaner() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mode, setMode] = useState<CleaningMode>("water");
  const [powerProfile, setPowerProfile] = useState<PowerProfile>("ultra");
  const [frequency, setFrequency] = useState<number>(165);
  const [duration, setDuration] = useState<number>(30); // 15, 30, 60, or 0 (continuous)
  const [remainingTime, setRemainingTime] = useState<number>(30);
  const [hasVibration, setHasVibration] = useState<boolean>(false);
  const [vibrationActive, setVibrationActive] = useState<boolean>(false);
  const [audioThrust, setAudioThrust] = useState<number>(0);
  const [showTechSpecs, setShowTechSpecs] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const subOscRef = useRef<OscillatorNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);
  const highPassFilterRef = useRef<BiquadFilterNode | null>(null);
  const peakFilterRef = useRef<BiquadFilterNode | null>(null);
  const lowPassFilterRef = useRef<BiquadFilterNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const vibrationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sweepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Particles for canvas physics
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      type: "water" | "dirt";
    }>
  >([]);

  // Detect vibration support
  useEffect(() => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      setHasVibration(true);
    }
  }, []);

  // Safe Audio Ramp-Down & Hardware Stop
  const stopCleaning = useCallback(() => {
    setIsActive(false);
    setVibrationActive(false);
    setAudioThrust(0);

    // Cancel timers
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (sweepIntervalRef.current) {
      clearInterval(sweepIntervalRef.current);
      sweepIntervalRef.current = null;
    }

    // Stop haptic motors
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current);
      vibrationIntervalRef.current = null;
    }
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(0);
      } catch {}
    }

    // Anti-pop de-clicking soft stop (voice coil protection)
    if (masterGainRef.current && audioCtxRef.current) {
      try {
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
        masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        setTimeout(() => {
          try {
            oscRef.current?.stop();
            oscRef.current?.disconnect();
            subOscRef.current?.stop();
            subOscRef.current?.disconnect();
            lfoRef.current?.stop();
            lfoRef.current?.disconnect();
            lfoGainRef.current?.disconnect();
            highPassFilterRef.current?.disconnect();
            peakFilterRef.current?.disconnect();
            lowPassFilterRef.current?.disconnect();
          } catch {}
          oscRef.current = null;
          subOscRef.current = null;
          lfoRef.current = null;
          lfoGainRef.current = null;
          highPassFilterRef.current = null;
          peakFilterRef.current = null;
          lowPassFilterRef.current = null;
        }, 90);
      } catch {}
    }
  }, []);

  // High-Torque Multi-Cadence Vibration Engine
  const startHardwareVibration = useCallback(() => {
    if (typeof window === "undefined" || !("vibrate" in navigator)) {
      setVibrationActive(true); // simulated visual indicator
      return;
    }

    setVibrationActive(true);
    const triggerPattern = () => {
      try {
        // Multi-cadence micro-shocks designed to loosen capillary adhesion
        if (powerProfile === "ultra") {
          navigator.vibrate([350, 30, 200, 30, 450, 40, 250, 30, 600, 50]);
        } else {
          navigator.vibrate([250, 40, 250, 40, 350, 50]);
        }
      } catch {}
    };

    triggerPattern();
    vibrationIntervalRef.current = setInterval(triggerPattern, 1850);
  }, [powerProfile]);

  // Super Powerful Acoustic Engine With 4-Tier Hardware Protection
  const startAudioEjection = useCallback(() => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // ─────────────────────────────────────────────────────────────
      // SAFETY TIER 1: Studio-Grade Brickwall Dynamics Limiter
      // Protects DAC from digital clipping and voice coil from square-wave heat.
      // ─────────────────────────────────────────────────────────────
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(powerProfile === "ultra" ? -4.5 : -6.0, now);
      compressor.knee.setValueAtTime(10, now); // Soft knee prevents harsh square transitions
      compressor.ratio.setValueAtTime(20, now); // Brickwall limiting
      compressor.attack.setValueAtTime(0.002, now); // Fast 2ms catch
      compressor.release.setValueAtTime(0.06, now); // 60ms release
      compressor.connect(ctx.destination);
      compressorRef.current = compressor;

      // ─────────────────────────────────────────────────────────────
      // SAFETY TIER 2: Sub-Sonic High-Pass Protection Filter (110Hz Butterworth)
      // Completely strips out infrasonic frequencies (<100Hz) that cause physical
      // voice-coil bottoming out / mechanical damage without moving air through grill.
      // ─────────────────────────────────────────────────────────────
      const hpf = ctx.createBiquadFilter();
      hpf.type = "highpass";
      hpf.frequency.setValueAtTime(110, now);
      hpf.Q.setValueAtTime(0.707, now); // Butterworth maximally flat response
      highPassFilterRef.current = hpf;

      // ─────────────────────────────────────────────────────────────
      // SAFETY TIER 3: Ultrasonic Low-Pass Protection Filter (1200Hz)
      // Removes high-order ultrasonic frequencies that only generate coil heat
      // without producing mechanical air displacement.
      // ─────────────────────────────────────────────────────────────
      const lpf = ctx.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.setValueAtTime(1200, now);
      lpf.Q.setValueAtTime(0.707, now);
      lowPassFilterRef.current = lpf;

      // ─────────────────────────────────────────────────────────────
      // POWER ENHANCER: Kinetic Acoustic Jet Peaking Filter
      // Concentrates acoustic kinetic energy at the target cavity resonance (165Hz)
      // turning the speaker into a high-pressure air pump.
      // ─────────────────────────────────────────────────────────────
      const peakFilter = ctx.createBiquadFilter();
      peakFilter.type = "peaking";
      peakFilter.frequency.setValueAtTime(frequency, now);
      peakFilter.gain.setValueAtTime(powerProfile === "ultra" ? 4.5 : 2.5, now);
      peakFilter.Q.setValueAtTime(1.8, now);
      peakFilterRef.current = peakFilter;

      // ─────────────────────────────────────────────────────────────
      // SAFETY TIER 4: Anti-Pop Master Gain with Smooth Soft-Start Envelope
      // ─────────────────────────────────────────────────────────────
      const masterGain = ctx.createGain();
      const targetGain = powerProfile === "ultra" ? 0.98 : 0.85;
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(targetGain, now + 0.05); // 50ms soft ramp
      masterGainRef.current = masterGain;

      // Connect Signal Chain:
      // Sources -> MasterGain -> HPF (Subsonic cut) -> Peak (Resonant jet) -> LPF (Heat cut) -> Brickwall Limiter -> Output
      masterGain.connect(hpf);
      hpf.connect(peakFilter);
      peakFilter.connect(lpf);
      lpf.connect(compressor);

      // ─────────────────────────────────────────────────────────────
      // KINETIC AIR PUMP: Low-Frequency Modulation (LFO)
      // Pulsing air velocity dislodges droplets via acceleration (impulse = F*dt).
      // Micro duty-cycle pauses keep voice coil thermally cool!
      // ─────────────────────────────────────────────────────────────
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const pulseRate = mode === "water" ? 7.2 : mode === "dirt" ? 9.5 : 8.0; // Pulses per second
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(pulseRate, now);

      const lfoDepth = powerProfile === "ultra" ? 0.55 : 0.40;
      lfoGain.gain.setValueAtTime(lfoDepth, now);
      lfo.connect(lfoGain);
      lfoGain.connect(masterGain.gain);
      lfo.start(now);
      lfoRef.current = lfo;
      lfoGainRef.current = lfoGain;

      // ─────────────────────────────────────────────────────────────
      // PRIMARY RESONANT OSCILLATOR (Kinetic Driver)
      // ─────────────────────────────────────────────────────────────
      const primaryOsc = ctx.createOscillator();
      primaryOsc.type = mode === "dirt" ? "triangle" : "sine";
      primaryOsc.frequency.setValueAtTime(frequency, now);
      primaryOsc.connect(masterGain);
      primaryOsc.start(now);
      oscRef.current = primaryOsc;

      // ─────────────────────────────────────────────────────────────
      // HARMONIC AGITATION OSCILLATOR (Shear Wave Dislodgement)
      // ─────────────────────────────────────────────────────────────
      if (mode === "dirt" || mode === "full_purge") {
        const subOsc = ctx.createOscillator();
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(frequency * 1.5, now);
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(powerProfile === "ultra" ? 0.35 : 0.22, now);
        subOsc.connect(subGain);
        subGain.connect(masterGain);
        subOsc.start(now);
        subOscRef.current = subOsc;
      }

      // Dynamic Frequency Sweep for Dirt / Particulate Dislodgement
      if (mode === "dirt" || mode === "full_purge") {
        let currentSweep = frequency;
        let direction = 1;
        sweepIntervalRef.current = setInterval(() => {
          if (!oscRef.current || !audioCtxRef.current) return;
          const currTime = audioCtxRef.current.currentTime;
          currentSweep += direction * 28;
          if (currentSweep >= 440) {
            direction = -1;
          } else if (currentSweep <= 135) {
            direction = 1;
          }
          try {
            oscRef.current.frequency.setTargetAtTime(currentSweep, currTime, 0.07);
            if (subOscRef.current) {
              subOscRef.current.frequency.setTargetAtTime(currentSweep * 1.5, currTime, 0.07);
            }
            if (peakFilterRef.current) {
              peakFilterRef.current.frequency.setTargetAtTime(currentSweep, currTime, 0.07);
            }
          } catch {}
        }, 110);
      }
    } catch {
      // Audio fallback
    }
  }, [mode, frequency, powerProfile]);

  // Start Session
  const startCleaning = () => {
    soundEngine.relayClick();
    stopCleaning();

    setIsActive(true);
    setRemainingTime(duration === 0 ? 999 : duration);

    startAudioEjection();
    startHardwareVibration();

    // Countdown interval
    if (duration > 0) {
      let t = duration;
      timerIntervalRef.current = setInterval(() => {
        t -= 1;
        setRemainingTime(t);
        if (t <= 0) {
          stopCleaning();
          soundEngine.modeSwitch();
        }
      }, 1000);
    }
  };

  // Switch Cleaning Mode
  const handleModeChange = (newMode: CleaningMode) => {
    soundEngine.modeSwitch();
    const config = CLEANING_MODES.find((m) => m.id === newMode);
    setMode(newMode);
    if (config) {
      setFrequency(config.defaultFreq);
    }
    if (isActive) {
      stopCleaning();
    }
  };

  // Switch Power Profile
  const handlePowerChange = (p: PowerProfile) => {
    soundEngine.tick();
    setPowerProfile(p);
    if (isActive) {
      stopCleaning();
    }
  };

  // Manual Frequency Slider
  const handleFrequencyChange = (newFreq: number) => {
    setFrequency(newFreq);
    if (isActive && oscRef.current && audioCtxRef.current) {
      try {
        const t = audioCtxRef.current.currentTime;
        oscRef.current.frequency.setTargetAtTime(newFreq, t, 0.03);
        if (peakFilterRef.current) {
          peakFilterRef.current.frequency.setTargetAtTime(newFreq, t, 0.03);
        }
      } catch {}
    }
  };

  // Teardown
  useEffect(() => {
    return () => {
      stopCleaning();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [stopCleaning]);

  // Visual Speaker Diaphragm & Particle Dispersion Physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      time += 0.08;

      // Diaphragm excursion calculations
      const pulseAmp = isActive
        ? (powerProfile === "ultra" ? 16 : 10) * Math.sin(time * 8) + 6
        : 0;
      setAudioThrust(
        isActive
          ? Math.round((powerProfile === "ultra" ? 94 : 80) + Math.sin(time * 6) * 6)
          : 0
      );

      // Particle physics engine
      if (isActive && Math.random() > 0.25) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (powerProfile === "ultra" ? 3.5 : 2.5) + Math.random() * 6;
        const isWater = mode === "water" || (mode === "full_purge" && Math.random() > 0.45);
        particlesRef.current.push({
          x: cx + Math.cos(angle) * 44,
          y: cy + Math.sin(angle) * 44,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: isWater ? 3 + Math.random() * 4 : 2 + Math.random() * 3,
          alpha: 1,
          color: isWater ? "#38BDF8" : "#E3C849",
          type: isWater ? "water" : "dirt",
        });
      }

      // Outer speaker chassis ring
      ctx.beginPath();
      ctx.arc(cx, cy, 84, 0, Math.PI * 2);
      ctx.fillStyle = "#161714";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#2B2D26";
      ctx.stroke();

      // Flexible roll surround
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.strokeStyle = isActive ? "#E3C849" : "#3A3C34";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Moving speaker cone
      const coneRadius = Math.max(30, 52 + pulseAmp);
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, coneRadius);
      grad.addColorStop(0, isActive ? (powerProfile === "ultra" ? "#FF4400" : "#FF7700") : "#242621");
      grad.addColorStop(0.7, isActive ? "#E3C849" : "#1A1B17");
      grad.addColorStop(1, "#0D0E0C");

      ctx.beginPath();
      ctx.arc(cx, cy, coneRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isActive ? "#FFDD55" : "#3A3C34";
      ctx.stroke();

      // Dust cap with thermal dissipation motif
      ctx.beginPath();
      ctx.arc(cx, cy, 22 + pulseAmp * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? "#161714" : "#121310";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isActive ? (powerProfile === "ultra" ? "#38BDF8" : "#E3C849") : "#444";
      ctx.stroke();

      // Acoustic Pressure Shockwave Rings
      if (isActive) {
        for (let r = 1; r <= 3; r++) {
          const ringRad = 85 + ((time * 32 + r * 35) % 110);
          const ringAlpha = Math.max(0, 1 - (ringRad - 85) / 110);
          ctx.beginPath();
          ctx.arc(cx, cy, ringRad, 0, Math.PI * 2);
          ctx.strokeStyle =
            mode === "water"
              ? `rgba(56, 189, 248, ${ringAlpha * (powerProfile === "ultra" ? 0.85 : 0.6)})`
              : `rgba(227, 200, 73, ${ringAlpha * 0.75})`;
          ctx.lineWidth = powerProfile === "ultra" ? 2.5 : 1.8;
          ctx.stroke();
        }
      }

      // Render ejected particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.022;
        p.size *= 0.98;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.type === "water"
            ? `rgba(56, 189, 248, ${p.alpha})`
            : `rgba(227, 200, 73, ${p.alpha})`;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Filter faded
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.05);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, mode, powerProfile]);

  return (
    <div
      id="speaker-cleaner"
      className="w-full my-8 border border-[#2C2E29] bg-[#121310] text-[#F4F3EE] p-4 sm:p-6 shadow-[6px_6px_0px_#161714]"
    >
      {/* Header Telemetry Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-[#242620] pb-3 mb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isActive ? "bg-[#38BDF8] opacity-75" : "bg-[#E3C849] opacity-35"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isActive ? "bg-[#38BDF8]" : "bg-[#E3C849]"
              }`}
            />
          </div>
          <div>
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#E3C849]">
              UTILITY // ACOUSTIC WATER & DIRT PURGE BENCH
            </span>
          </div>
        </div>

        {/* Hardware Safety Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Safe Guard Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-[9px] uppercase border border-[#10B981]/50 bg-[#10B981]/10 text-[#10B981]">
            <ShieldCheck size={12} className="text-[#10B981]" />
            <span>HARDWARE SAFEGUARD: ACTIVE</span>
          </div>

          {/* Vibration Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 font-mono text-[9px] uppercase border ${
              vibrationActive
                ? "border-[#38BDF8] bg-[#38BDF8]/15 text-[#38BDF8]"
                : "border-[#2C2E29] text-[#777]"
            }`}
          >
            <Vibrate size={11} className={vibrationActive ? "animate-bounce" : ""} />
            <span>
              {hasVibration
                ? vibrationActive
                  ? "VIB: 100% CADENCE"
                  : "VIB: READY"
                : "VIB: SIMULATED"}
            </span>
          </div>

          {/* Acoustic Thrust Gauge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-[9px] uppercase border border-[#2C2E29] text-[#AAA]">
            <Gauge size={11} className="text-[#E3C849]" />
            <span>THRUST: {audioThrust}%</span>
          </div>
        </div>
      </div>

      {/* Operational Procedure + Safe Architecture Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5">
        <div className="md:col-span-8 bg-[#1A1C16] border-l-2 border-[#E3C849] p-3 flex items-start gap-3 text-xs">
          <AlertTriangle size={16} className="text-[#E3C849] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white uppercase text-[11px] font-mono">
              Operating Procedure for Maximum Expulsion:
            </p>
            <p className="text-[#A6A89F] text-[11px] leading-relaxed">
              1. Turn device volume to <strong>100% MAXIMUM</strong>.
              &nbsp;·&nbsp;
              2. <strong>Tilt device facing downward</strong> so gravity evacuates dislodged water droplets and dust.
              &nbsp;·&nbsp;
              3. Resonant sound pulses physically blow through the speaker grill mesh while haptics loosen adhesion.
            </p>
          </div>
        </div>

        {/* Protection Assurance Note */}
        <div className="md:col-span-4 bg-[#141B15] border-l-2 border-[#10B981] p-3 flex items-start gap-2.5 text-xs">
          <ShieldCheck size={16} className="text-[#10B981] shrink-0 mt-0.5" />
          <div className="space-y-1 font-mono">
            <p className="font-bold text-[#10B981] uppercase text-[10px]">
              Zero-Damage Speaker Protocol:
            </p>
            <p className="text-[#89A891] text-[10px] leading-snug">
              110Hz Sub-Sonic High-Pass prevents bottoming out. Soft-knee brickwall limiter eliminates digital clipping and voice coil thermal stress.
            </p>
          </div>
        </div>
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Speaker Cone Canvas & Live Ejection Physics */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-[#0A0B09] border border-[#22241F] relative">
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] block"
          />

          <div className="mt-3 flex items-center justify-between w-full font-mono text-[9px] text-[#777] border-t border-[#1C1E19] pt-2">
            <span className="flex items-center gap-1 text-[#38BDF8]">
              <Droplets size={11} /> WATER DROPLETS
            </span>
            <span className="text-[#E3C849] font-bold">
              {frequency} Hz RESONANCE
            </span>
            <span className="flex items-center gap-1 text-[#E3C849]">
              <Sparkles size={11} /> DUST PARTICLES
            </span>
          </div>

          {/* Live indicator overlay */}
          {isActive && (
            <div className="absolute top-3 right-3 bg-[#FF5500] text-white px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-[0_0_12px_rgba(255,85,0,0.6)]">
              <Zap size={10} /> PURGING ACTIVE
            </div>
          )}
        </div>

        {/* Right: Controls, Modes, Power Profiles and Execution Switches */}
        <div className="lg:col-span-7 space-y-4">
          {/* Power Level Selector: Ultra Thrust vs Safe Balanced */}
          <div className="bg-[#161714] p-3 border border-[#272824] space-y-2">
            <div className="flex justify-between items-center font-mono text-[10px] text-[#888]">
              <span className="flex items-center gap-1.5 text-white font-bold uppercase">
                <Flame size={12} className="text-[#FF5500]" />
                POWER & THRUST CALIBRATION
              </span>
              <span className="text-[9px] text-[#10B981] font-mono">
                [100% SPEAKER SAFE]
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => handlePowerChange("ultra")}
                className={`p-2.5 border text-left transition-all ${
                  powerProfile === "ultra"
                    ? "border-[#FF5500] bg-[#FF5500]/15 text-white shadow-[0_0_12px_rgba(255,85,0,0.2)]"
                    : "border-[#2A2C26] bg-[#121310] text-[#777] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[11px] text-[#FF5500]">
                  <span>ULTRA JET THRUST</span>
                  <span className="text-[8px] bg-[#FF5500] text-white px-1 py-0.2">MAX</span>
                </div>
                <div className="text-[9px] text-[#A6A89F] mt-1 leading-snug">
                  Maximum kinetic air displacement (+4.5dB resonant peak, heavy haptic shock, 110Hz HPF protected).
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePowerChange("standard")}
                className={`p-2.5 border text-left transition-all ${
                  powerProfile === "standard"
                    ? "border-[#E3C849] bg-[#E3C849]/15 text-white shadow-[0_0_12px_rgba(227,200,73,0.2)]"
                    : "border-[#2A2C26] bg-[#121310] text-[#777] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[11px] text-[#E3C849]">
                  <span>BALANCED PURGE</span>
                  <span className="text-[8px] bg-[#E3C849] text-[#121310] px-1 py-0.2">SMOOTH</span>
                </div>
                <div className="text-[9px] text-[#A6A89F] mt-1 leading-snug">
                  Smooth resonant acoustic waves with gentle harmonic agitation. Ideal for sensitive micro-earpieces.
                </div>
              </button>
            </div>
          </div>

          {/* Cleaning Algorithm Selection */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase text-[#888] flex items-center gap-1.5">
              <Waves size={12} className="text-[#E3C849]" />
              <span>SELECT PURGE ALGORITHM</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CLEANING_MODES.map((m) => {
                const isSelected = mode === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleModeChange(m.id)}
                    className={`p-3 text-left border font-mono transition-all relative ${
                      isSelected
                        ? "border-[#E3C849] bg-[#E3C849]/15 text-white shadow-[0_0_12px_rgba(227,200,73,0.15)]"
                        : "border-[#272824] bg-[#161714] text-[#888] hover:text-white hover:border-[#444]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon
                        size={15}
                        className={isSelected ? "text-[#E3C849]" : "text-[#777]"}
                      />
                      <span className="text-[8px] text-[#666]">[{m.tag}]</span>
                    </div>
                    <div className="font-bold text-[11px] text-white leading-tight mb-1">
                      {m.name}
                    </div>
                    <div className="text-[9px] text-[#8F9188] line-clamp-2 leading-relaxed">
                      {m.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Cycle Switcher */}
          <div className="bg-[#161714] p-3 border border-[#272824] space-y-2">
            <div className="flex justify-between items-center font-mono text-[10px] text-[#888]">
              <span>BURST DURATION CYCLE</span>
              <span className="text-[#E3C849] font-bold">
                {isActive ? (
                  duration === 0 ? (
                    "CONTINUOUS (ACTIVE)"
                  ) : (
                    `${remainingTime}s REMAINING`
                  )
                ) : duration === 0 ? (
                  "CONTINUOUS"
                ) : (
                  `${duration} SECONDS`
                )}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 font-mono text-xs">
              {[15, 30, 60, 0].map((d) => (
                <button
                  key={d}
                  type="button"
                  disabled={isActive}
                  onClick={() => {
                    soundEngine.tick();
                    setDuration(d);
                    setRemainingTime(d);
                  }}
                  className={`py-1.5 border text-center font-bold text-[10px] uppercase transition-all ${
                    duration === d
                      ? "border-[#E3C849] bg-[#E3C849] text-[#121310]"
                      : "border-[#333] text-[#888] hover:text-white hover:border-[#555]"
                  } ${isActive ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {d === 0 ? "INFINITE" : `${d}S CYCLE`}
                </button>
              ))}
            </div>

            {/* Countdown Progress Bar */}
            {isActive && duration > 0 && (
              <div className="w-full bg-[#222] h-1.5 overflow-hidden mt-2">
                <div
                  className="bg-[#38BDF8] h-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${((duration - remainingTime) / duration) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Acoustic Frequency Fine Scrubber */}
          <div className="bg-[#161714] p-3 border border-[#272824] space-y-1.5">
            <div className="flex justify-between items-center font-mono text-[10px] text-[#888]">
              <span>ACOUSTIC RESONANT FREQUENCY</span>
              <div className="flex items-center gap-2">
                <span className="text-[#E3C849] font-bold">{frequency} Hz</span>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.tick();
                    handleFrequencyChange(165);
                  }}
                  className="text-[#666] hover:text-[#E3C849] text-[9px] flex items-center gap-0.5"
                >
                  <RotateCcw size={9} />
                  RESET 165Hz
                </button>
              </div>
            </div>
            <input
              type="range"
              min="115"
              max="500"
              step="1"
              value={frequency}
              onChange={(e) => handleFrequencyChange(Number(e.target.value))}
              className="w-full accent-[#E3C849] bg-[#222] h-1.5 rounded-none cursor-pointer"
            />
            <div className="flex justify-between text-[8px] font-mono text-[#555]">
              <span>115 Hz (Safe Cutoff Floor)</span>
              <span className="text-[#38BDF8]">165 Hz (Apple Watch Water Resonance)</span>
              <span>500 Hz (Particle Sweep)</span>
            </div>
          </div>

          {/* Execution Primary Action Button */}
          <div className="pt-2">
            {!isActive ? (
              <button
                type="button"
                onClick={startCleaning}
                className="w-full py-4 px-5 bg-[#E3C849] hover:bg-[#ebd567] text-[#121310] font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-transform active:scale-[0.99] shadow-[0_4px_20px_rgba(227,200,73,0.35)]"
              >
                <Play size={16} fill="currentColor" />
                ENGAGE SUPER POWER PURGE (SOUND + VIBRATION)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundEngine.relayClick();
                  stopCleaning();
                }}
                className="w-full py-4 px-5 bg-[#FF5500] hover:bg-[#ff6a20] text-white font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-transform active:scale-[0.99] shadow-[0_4px_20px_rgba(255,85,0,0.35)] animate-pulse"
              >
                <Square size={16} fill="currentColor" />
                HALT PURGE CYCLE [{remainingTime}s]
              </button>
            )}
          </div>

          {/* Technical Hardware Protection Accordion Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                soundEngine.tick();
                setShowTechSpecs(!showTechSpecs);
              }}
              className="flex items-center gap-1.5 font-mono text-[10px] text-[#888] hover:text-[#E3C849] transition-colors"
            >
              <Info size={11} />
              <span>{showTechSpecs ? "HIDE" : "INSPECT"} ACOUSTIC SAFETY SPECIFICATIONS & SIGNAL ARCHITECTURE</span>
            </button>

            {showTechSpecs && (
              <div className="mt-2.5 p-3 bg-[#0E0F0C] border border-[#242620] font-mono text-[10px] text-[#A6A89F] space-y-2">
                <div className="text-white font-bold text-[11px] border-b border-[#242620] pb-1">
                  ENGINEERING SAFEGUARDS: HOW SUPER POWER WITHOUT DAMAGE IS ACHIEVED
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <span className="text-[#10B981] font-bold">1. Sub-Sonic HPF (110Hz Cutoff):</span>
                    <p className="text-[#888] mt-0.5">
                      Micro-speakers have no air-loading below 100Hz. Infrasonic tones only cause voice-coil collision (mechanical damage). Our Butterworth filter eliminates all frequencies below 110Hz.
                    </p>
                  </div>
                  <div>
                    <span className="text-[#10B981] font-bold">2. Brickwall Studio Limiter (-4.5dB):</span>
                    <p className="text-[#888] mt-0.5">
                      DynamicsCompressorNode enforces a hard peak threshold with a 10dB soft knee, mathematically preventing square-wave distortion and thermal coil burnout.
                    </p>
                  </div>
                  <div>
                    <span className="text-[#10B981] font-bold">3. 165Hz Resonant Kinetic Jet:</span>
                    <p className="text-[#888] mt-0.5">
                      Instead of high generic volume, we target the exact Helmholtz cavity resonance of mobile speaker ports, converting electrical energy directly into physical air velocity.
                    </p>
                  </div>
                  <div>
                    <span className="text-[#10B981] font-bold">4. Anti-Pop Exponential Envelopes:</span>
                    <p className="text-[#888] mt-0.5">
                      Smooth 50ms ramp-in and 80ms ramp-out eliminate DC voltage steps and transient pops when starting or halting the acoustic purge cycle.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
