"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  Download,
  Layers,
  MousePointer,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { SiFigma } from "react-icons/si";
import { useEffect, useState } from "react";
import { WORK_STATUS } from "@/lib/config";
import { soundEngine } from "@/lib/haptics";

interface WelcomeLandingProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadResume: () => void;
}

export function WelcomeLanding({
  isOpen,
  onClose,
  onDownloadResume,
}: WelcomeLandingProps) {
  const [greeting, setGreeting] = useState<string>("Welcome to the Canvas");
  const [ktmTime, setKtmTime] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [statusStage, setStatusStage] = useState<string>(
    "Loading design tokens...",
  );

  // Time & dynamic greeting calculation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 12) setGreeting("Good morning, welcome to the canvas");
      else if (hours < 18) setGreeting("Good afternoon, welcome to the canvas");
      else setGreeting("Good evening, welcome to the canvas");

      setKtmTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kathmandu",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Super animation progress sequence with Figma-style stages
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 12) + 8;
      if (p >= 100) {
        p = 100;
        setProgress(100);
        setStatusStage("Figma Prototype Ready");
        clearInterval(interval);
      } else {
        setProgress(p);
        if (p < 30) setStatusStage("Binding typography & design tokens...");
        else if (p < 65)
          setStatusStage("Compiling auto-layout & prototypes...");
        else if (p < 90) setStatusStage("Optimizing 60fps hardware canvas...");
      }
    }, 40);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Keyboard accessibility: Escape, Enter, or Space to enter
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.code === "Space") {
        e.preventDefault();
        soundEngine.relayClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-950/80 backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-modal-title"
        >
          {/* Subtle Figma Canvas Background Grid with Coordinate Crosshairs */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.4) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Ambient Glowing Orbs */}
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-pink-500/20 blur-[120px] pointer-events-none" />

          {/* Floating Figma Collaborator Cursor with Super Motion Animation */}
          <motion.div
            initial={{ x: -60, y: -40, opacity: 0 }}
            animate={{
              x: [10, 180, 120, 240, 60],
              y: [20, 80, 200, 140, 50],
              opacity: [0, 1, 1, 1, 0.85],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute z-20 pointer-events-none hidden md:flex items-center gap-1.5"
            style={{ top: "12%", left: "18%" }}
          >
            <div className="relative">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_2px_8px_rgba(13,153,255,0.6)]"
              >
                <path
                  d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.88c.45 0 .67-.54.35-.85L5.85 2.85c-.32-.31-.85-.09-.85.36z"
                  fill="#0d99ff"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </svg>
              <div className="absolute left-4 top-3 px-2 py-0.5 rounded-full bg-[#0d99ff] text-white font-mono text-[10px] font-semibold tracking-wide whitespace-nowrap shadow-md">
                Ramesh (Lead Designer)
              </div>
            </div>
          </motion.div>

          {/* Main Figma Canvas Modal Card */}
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 16, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-slate-900/90 text-slate-100 shadow-[0_24px_70px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl"
          >
            {/* Figma-Style Window Chrome Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/60 px-5 py-3.5">
              {/* Traffic Light Dots */}
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/50" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d89e24]/50" />
                <span className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1aab29]/50" />

                <div className="ml-3 hidden sm:flex items-center gap-2 pl-3 border-l border-white/10 font-mono text-[11px] text-slate-400">
                  <SiFigma size={12} className="text-[#a855f7]" />
                  <span>Figma Frame: /Canvas/Welcome_Prototype_v4.2</span>
                </div>
              </div>

              {/* Status & Close */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-emerald-400 font-semibold hidden xs:inline">
                    KTM {ktmTime || "UTC+5:45"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.relayClick();
                    onClose();
                  }}
                  className="rounded-full border border-white/10 p-1.5 text-slate-400 transition-all hover:bg-white/10 hover:text-white hover:rotate-90"
                  aria-label="Close welcome prototype"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Eyebrow Chip & Status Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
                  <Sparkles size={13} className="text-indigo-400" />
                  <span>Interactive Design Experience</span>
                </div>

                <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
                  <span className="text-[var(--accent-primary)] font-bold">
                    {progress}%
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="truncate max-w-[200px]">{statusStage}</span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              {/* Title & Introduction */}
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-slate-400 font-medium">
                  {greeting}
                </p>
                <h2
                  id="welcome-modal-title"
                  className="mt-1.5 text-3xl font-bold sm:text-4xl tracking-tight text-white flex items-center gap-2"
                >
                  Ramesh Maharjan
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">
                    ❖
                  </span>
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                  Senior Product Designer & Full-Stack Developer creating
                  intuitive, human-first Figma design systems, fluid responsive
                  frontends, and resilient sub-second backend architectures.
                </p>
              </div>

              {/* 3-Column Bento Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5 transition-colors hover:bg-white/[0.06]">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                    <Layers size={14} />
                    <span>Figma & UI/UX</span>
                  </div>
                  <p className="text-slate-400 leading-snug">
                    Auto-layout 5.0, design tokens, interactive prototypes, and
                    WCAG accessibility.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5 transition-colors hover:bg-white/[0.06]">
                  <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
                    <Code2 size={14} />
                    <span>Modern Web Core</span>
                  </div>
                  <p className="text-slate-400 leading-snug">
                    Next.js 16, React 19, TypeScript, Tailwind CSS, Node.js,
                    Laravel 11.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5 transition-colors hover:bg-white/[0.06]">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 size={14} />
                    <span>Studio Status</span>
                  </div>
                  <p className="text-slate-300 font-medium leading-snug">
                    {WORK_STATUS.label}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Kathmandu · Global Remote
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.relayClick();
                    onClose();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3.5 font-semibold text-sm text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-95 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Enter Prototype Canvas</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.relayClick();
                    onDownloadResume();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 font-semibold text-sm text-white transition-all hover:bg-white/10 hover:border-white/30 active:scale-[0.99]"
                >
                  <Download size={16} className="text-indigo-400" />
                  <span>Curriculum Vitae</span>
                </button>
              </div>

              {/* Keyboard Navigation Quick Tip */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] text-slate-400">
                <span>
                  Press{" "}
                  <kbd className="rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 text-white">
                    Enter
                  </kbd>{" "}
                  or{" "}
                  <kbd className="rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 text-white">
                    Esc
                  </kbd>{" "}
                  to enter
                </span>
                <span className="hidden sm:inline text-indigo-400">
                  ✦ 100% Canvas Scale
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
