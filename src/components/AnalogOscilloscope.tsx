"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  Volume2,
  VolumeX,
} from "lucide-react";
import { soundEngine } from "@/lib/haptics";

export type WaveformPreset = "sine" | "lissajous" | "db_spike" | "ws_packets";
export type PhosphorColor = "amber" | "green" | "coral";

interface PresetConfig {
  id: WaveformPreset;
  label: string;
  tag: string;
  defaultFreq: number;
  description: string;
}

const PRESETS: PresetConfig[] = [
  {
    id: "sine",
    label: "Harmonic Baseline",
    tag: "SYS_FREQ",
    defaultFreq: 110,
    description: "Pure harmonic sinusoidal baseline representing core runtime stability.",
  },
  {
    id: "lissajous",
    label: "Lissajous Resonance",
    tag: "MESH_3D",
    defaultFreq: 220,
    description: "Multi-axis phase trajectory mapping relational data convergence.",
  },
  {
    id: "db_spike",
    label: "MariaDB ACID Burst",
    tag: "TX_LATENCY",
    defaultFreq: 75,
    description: "Transaction commitment spikes with exponential recovery damping.",
  },
  {
    id: "ws_packets",
    label: "WebSocket Stream",
    tag: "IO_CONCURRENCY",
    defaultFreq: 160,
    description: "Packet burst frames simulating live POS kitchen sync telemetry.",
  },
];

const COLOR_MAP: Record<
  PhosphorColor,
  { stroke: string; glow: string; label: string }
> = {
  amber: { stroke: "#E3C849", glow: "rgba(227, 200, 73, 0.45)", label: "Ochre 580nm" },
  green: { stroke: "#2BA84A", glow: "rgba(43, 168, 74, 0.55)", label: "P31 Green" },
  coral: { stroke: "#FF5500", glow: "rgba(255, 85, 0, 0.5)", label: "Signal Orange" },
};

export function AnalogOscilloscope() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [preset, setPreset] = useState<WaveformPreset>("sine");
  const [frequency, setFrequency] = useState<number>(110);
  const [amplitude, setAmplitude] = useState<number>(0.75);
  const [phosphor, setPhosphor] = useState<PhosphorColor>("amber");
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isAudioLive, setIsAudioLive] = useState<boolean>(false);
  const [metrics, setMetrics] = useState({ vpp: "3.24V", freq: "110Hz", phase: "0.0°" });

  const stateRef = useRef({
    preset,
    frequency,
    amplitude,
    phosphor,
    isFrozen,
    phase: 0,
    isVisible: true,
  });

  // Keep stateRef in sync for 60fps render loop
  useEffect(() => {
    stateRef.current = {
      preset,
      frequency,
      amplitude,
      phosphor,
      isFrozen,
      phase: stateRef.current.phase,
      isVisible: stateRef.current.isVisible,
    };
  }, [preset, frequency, amplitude, phosphor, isFrozen]);

  // Audio synchronization with frequency scrubber
  const handleFreqChange = (newFreq: number) => {
    setFrequency(newFreq);
    if (isAudioLive && soundEngine.isSoundEnabled()) {
      soundEngine.updateToneFrequency(newFreq);
    }
  };

  const toggleOscillatorAudio = () => {
    soundEngine.modeSwitch();
    if (!isAudioLive) {
      soundEngine.setSoundEnabled(true);
      soundEngine.startContinuousTone(frequency, "sine");
      setIsAudioLive(true);
    } else {
      soundEngine.stopContinuousTone();
      setIsAudioLive(false);
    }
  };

  useEffect(() => {
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, []);

  // IntersectionObserver to pause rendering when offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          stateRef.current.isVisible = entries[0].isIntersecting;
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // 60fps Phosphor Oscilloscope Render Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (!stateRef.current.isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const { width, height } = canvas;
      const { preset, frequency, amplitude, phosphor, isFrozen } = stateRef.current;
      const colorConfig = COLOR_MAP[phosphor];

      // CRT Phosphor persistence decay
      ctx.fillStyle = "rgba(18, 19, 16, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // Graticule Screen Markings (Subtle grid)
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      const gridStep = 40;

      ctx.beginPath();
      for (let x = 0; x <= width; x += gridStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Major Crosshairs
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Time advance
      if (!isFrozen) {
        stateRef.current.phase += (frequency / 60) * 0.12;
      }
      const t = stateRef.current.phase;

      // Draw Waveform Trace
      ctx.save();
      ctx.strokeStyle = colorConfig.stroke;
      ctx.shadowColor = colorConfig.glow;
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2.2;
      ctx.beginPath();

      const centerY = height / 2;
      const maxAmp = (height / 2 - 24) * amplitude;

      if (preset === "sine") {
        for (let x = 0; x < width; x++) {
          const normX = (x / width) * 4 * Math.PI;
          const y = centerY + Math.sin(normX * (frequency / 60) + t) * maxAmp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      } else if (preset === "lissajous") {
        const points = 360;
        const radiusX = (width / 2.8) * amplitude;
        const radiusY = maxAmp;
        const centerX = width / 2;
        const a = 3;
        const b = 2;
        const delta = t * 0.8;

        for (let i = 0; i <= points; i++) {
          const theta = (i / points) * 2 * Math.PI;
          const x = centerX + Math.sin(a * theta + delta) * radiusX;
          const y = centerY + Math.sin(b * theta) * radiusY;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      } else if (preset === "db_spike") {
        for (let x = 0; x < width; x++) {
          const cycle = (x / 140 + t * 0.5) % 3;
          let yOffset = 0;
          if (cycle < 0.2) {
            yOffset = -Math.sin(cycle * 5 * Math.PI) * maxAmp;
          } else {
            yOffset = Math.exp(-cycle * 3) * Math.sin(cycle * 20) * (maxAmp * 0.4);
          }
          const y = centerY + yOffset;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      } else if (preset === "ws_packets") {
        for (let x = 0; x < width; x++) {
          const step = Math.floor((x / 24 + t * 2) % 4);
          const val = step === 1 ? 0.9 : step === 3 ? -0.8 : 0.05;
          const y = centerY + val * maxAmp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const resizeObserver = new ResizeObserver(() => {
      if (canvas && containerRef.current) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * (window.devicePixelRatio || 1);
        canvas.height = rect.height * (window.devicePixelRatio || 1);
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      }
    });

    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      resizeObserver.observe(canvas);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const calculatedVpp = (amplitude * 4.8).toFixed(2) + "Vpp";
    const phaseDeg = ((stateRef.current.phase * 57.2958) % 360).toFixed(1) + "°";
    setMetrics({
      vpp: calculatedVpp,
      freq: `${frequency}Hz`,
      phase: phaseDeg,
    });
  }, [frequency, amplitude]);

  return (
    <div
      ref={containerRef}
      className={`w-full my-8 sm:my-12 border border-[#161714] bg-[#121310] text-[#F4F3EE] shadow-[4px_4px_0px_#161714] sm:shadow-[8px_8px_0px_#161714] transition-all duration-300 ${
        isExpanded ? "p-3 sm:p-8" : "p-3 sm:p-5"
      }`}
    >
      {/* Scope Header Console Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-[#2C2E29] pb-3 mb-3 sm:mb-4 gap-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#E3C849] animate-pulse shrink-0" />
          <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#E3C849] truncate">
            INSTRUMENT // HARMONIC ANALYZER
          </span>
        </div>

        <div className="flex items-center gap-2 justify-end">
          {/* Audio Output Monitored Switch */}
          <button
            type="button"
            onClick={toggleOscillatorAudio}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase border transition-all ${
              isAudioLive
                ? "bg-[#E3C849] text-[#161714] border-[#E3C849]"
                : "border-[#3A3C35] text-[#888] hover:text-white"
            }`}
          >
            {isAudioLive ? <Volume2 size={11} /> : <VolumeX size={11} />}
            <span>{isAudioLive ? "STREAMING" : "MONITOR AUDIO"}</span>
          </button>

          {/* Freeze Trigger */}
          <button
            type="button"
            onClick={() => {
              soundEngine.relayClick();
              setIsFrozen(!isFrozen);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase border transition-all ${
              isFrozen
                ? "bg-[#FF5500] text-white border-[#FF5500]"
                : "border-[#3A3C35] text-[#888] hover:text-white"
            }`}
          >
            {isFrozen ? <Play size={11} /> : <Pause size={11} />}
            <span>{isFrozen ? "HOLD" : "FREEZE"}</span>
          </button>

          {/* Fullscreen Expand */}
          <button
            type="button"
            onClick={() => {
              soundEngine.relayClick();
              setIsExpanded(!isExpanded);
            }}
            className="hidden sm:flex items-center p-1.5 border border-[#3A3C35] text-[#888] hover:text-white hover:border-[#666]"
            aria-label="Toggle full stage expand"
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Main CRT Scope Canvas Screen */}
      <div
        className={`relative w-full rounded-none overflow-hidden bg-[#0A0B09] border border-[#272824] ${
          isExpanded ? "h-[360px] sm:h-[480px]" : "h-[220px] sm:h-[320px]"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
          title="Interactive analog cathode-ray signal"
        />

        {/* HUD Telemetry Overlays */}
        <div className="absolute top-2.5 left-2.5 pointer-events-none font-mono text-[9px] sm:text-[10px] text-[#A6A89F] bg-[#121310]/85 backdrop-blur-sm border border-[#2C2E29] p-1.5 sm:p-2 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[#E3C849]">CH1:</span>
            <span>{metrics.vpp}</span>
            <span className="text-[#666]">·</span>
            <span>{metrics.freq}</span>
          </div>
          <div className="text-[8px] sm:text-[9px] text-[#666]">
            5.0ms/DIV · 1.0V/DIV
          </div>
        </div>

        <div className="absolute top-2.5 right-2.5 pointer-events-none font-mono text-[9px] sm:text-[10px] text-[#A6A89F] bg-[#121310]/85 backdrop-blur-sm border border-[#2C2E29] p-1.5 sm:p-2 text-right">
          <div className="text-[#E3C849] font-bold">
            [{PRESETS.find((p) => p.id === preset)?.tag}]
          </div>
          <div className="text-[8px] sm:text-[9px] text-[#666]">60.0 FPS</div>
        </div>

        <div className="absolute bottom-2 inset-x-2.5 pointer-events-none flex justify-between items-center font-mono text-[8px] sm:text-[9px] text-[#555]">
          <span>SIGNAL CALIBRATED</span>
          <span className="hidden sm:inline">KATHMANDU LABORATORY SPECIMEN</span>
        </div>
      </div>

      {/* Switchboard */}
      <div className="mt-3 sm:mt-4 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 pt-3 border-t border-[#22241F]">
        {/* Presets */}
        <div className="lg:col-span-6 space-y-2">
          <div className="font-mono text-[9px] sm:text-[10px] uppercase text-[#888] flex items-center gap-1.5">
            <Activity size={11} className="text-[#E3C849]" />
            <span>CHANNEL SIGNAL PRESETS</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => {
              const isActive = p.id === preset;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    soundEngine.modeSwitch();
                    setPreset(p.id);
                    setFrequency(p.defaultFreq);
                    if (isAudioLive && soundEngine.isSoundEnabled()) {
                      soundEngine.updateToneFrequency(p.defaultFreq);
                    }
                  }}
                  className={`p-2 sm:p-2.5 text-left border font-mono text-xs transition-all ${
                    isActive
                      ? "border-[#E3C849] bg-[#E3C849]/15 text-white shadow-[0_0_12px_rgba(227,200,73,0.15)]"
                      : "border-[#272824] bg-[#161714] text-[#888] hover:text-white hover:border-[#444]"
                  }`}
                >
                  <div className="flex justify-between items-center text-[8px] sm:text-[9px] text-[#888] mb-0.5">
                    <span>{p.tag}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E3C849]" />
                    )}
                  </div>
                  <div className="font-bold text-[10px] sm:text-[11px] truncate">{p.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modulation Dials */}
        <div className="lg:col-span-6 space-y-2.5 sm:space-y-3 bg-[#161714] p-3 border border-[#272824]">
          <div className="flex justify-between items-center font-mono text-[9px] sm:text-[10px] text-[#888]">
            <span className="flex items-center gap-1.5">
              <Sliders size={11} className="text-[#E3C849]" />
              MODULATION CALIBRATION
            </span>
            <button
              type="button"
              onClick={() => {
                soundEngine.tick();
                setFrequency(110);
                setAmplitude(0.75);
              }}
              className="text-[#666] hover:text-[#E3C849] flex items-center gap-1"
            >
              <RotateCcw size={10} />
              RESET
            </button>
          </div>

          <div>
            <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-[#AAA] mb-1">
              <span>FREQUENCY HARMONIC</span>
              <span className="text-[#E3C849] font-bold">{frequency} Hz</span>
            </div>
            <input
              type="range"
              min="20"
              max="440"
              step="1"
              value={frequency}
              onChange={(e) => handleFreqChange(Number(e.target.value))}
              className="w-full accent-[#E3C849] bg-[#222] h-1.5 rounded-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-[#AAA] mb-1">
              <span>ATTENUATION GAIN</span>
              <span className="text-[#E3C849] font-bold">
                {Math.round(amplitude * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={amplitude}
              onChange={(e) => {
                soundEngine.tick();
                setAmplitude(Number(e.target.value));
              }}
              className="w-full accent-[#E3C849] bg-[#222] h-1.5 rounded-none cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#222] font-mono text-[9px] sm:text-[10px]">
            <span className="text-[#888]">PHOSPHOR:</span>
            <div className="flex gap-1.5">
              {(["amber", "green", "coral"] as PhosphorColor[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    soundEngine.relayClick();
                    setPhosphor(c);
                  }}
                  className={`px-2 py-0.5 border uppercase text-[8px] sm:text-[9px] font-bold transition-all ${
                    phosphor === c
                      ? "border-[#E3C849] bg-[#E3C849] text-[#121310]"
                      : "border-[#333] text-[#777] hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
