"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  ArrowRight, 
  Cpu, 
  Download, 
  Radio, 
  Sparkles, 
  Terminal, 
  X, 
} from "lucide-react";
import { useEffect, useState } from "react";
import { WORK_STATUS } from "@/lib/config";

interface WelcomeLandingProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadResume: () => void;
}

export function WelcomeLanding({ isOpen, onClose, onDownloadResume }: WelcomeLandingProps) {
  const [greeting, setGreeting] = useState<string>("WELCOME, VISITOR");
  const [ktmTime, setKtmTime] = useState<string>("");
  const [bootProgress, setBootProgress] = useState<number>(0);

  // Time & dynamic greeting calculation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 12) setGreeting("GOOD MORNING");
      else if (hours < 18) setGreeting("GOOD AFTERNOON");
      else setGreeting("GOOD EVENING");

      setKtmTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kathmandu",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence animation counter
  useEffect(() => {
    if (!isOpen) {
      setBootProgress(0);
      return;
    }
    let p = 0;
    const timer = setInterval(() => {
      p += Math.floor(Math.random() * 25) + 10;
      if (p >= 100) {
        setBootProgress(100);
        clearInterval(timer);
      } else {
        setBootProgress(p);
      }
    }, 45);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Keyboard accessibility: Escape or Enter to enter
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
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
          exit={{ opacity: 0, transition: { duration: 0.28 } }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#161714]/90 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
        >
          {/* Subtle Ambient Scanline & Grid Effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #e3c849 1px, transparent 0)`,
              backgroundSize: "28px 28px"
            }}
          />

          <motion.div
            initial={{ scale: 0.94, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: 10, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#1a1b18] text-[#f4f3ee] shadow-2xl"
          >
            {/* Top Telemetry Diagnostic Bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#141512] px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3 font-mono text-xs text-[#a9aba3]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e3c849] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#e3c849]" />
                  </span>
                  <span className="font-semibold tracking-wider text-[#e3c849]">GATEWAY ONLINE</span>
                </div>
                <span className="hidden text-white/30 sm:inline">/</span>
                <span className="hidden sm:inline">KTM {ktmTime || "UTC+5:45"}</span>
                <span className="hidden text-white/30 md:inline">/</span>
                <span className="hidden md:inline">27.7172° N, 85.3240° E</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-white/10 p-1.5 text-[#a9aba3] transition-colors hover:border-white/30 hover:text-white"
                  aria-label="Close welcome gateway"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Main Welcome Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Protocol Identifier */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#e3c849]/30 bg-[#e3c849]/10 px-3 py-1 font-mono text-xs font-medium text-[#e3c849]">
                  <Terminal size={13} />
                  <span>PROTOCOL // RAMESH-MAHARJAN-2026</span>
                </div>

                <div className="font-mono text-xs text-white/50">
                  SYSTEM READY: <span className="text-[#e3c849]">{bootProgress}%</span>
                </div>
              </div>

              {/* Title & Greeting */}
              <div>
                <p className="font-mono text-xs tracking-widest text-[#a9aba3]">
                  {greeting} &bull; INITIALIZATION COMPLETE
                </p>
                <h2 id="welcome-title" className="mt-1 text-3xl font-extrabold sm:text-4xl text-white tracking-tight">
                  Ramesh Maharjan<span className="text-[#e3c849]">.</span>
                </h2>
                <p className="mt-2 text-base sm:text-lg text-white/80 font-normal leading-relaxed">
                  Full-Stack Software Engineer & Creative Technologist crafting low-latency backend architectures, resilient database systems, and tactile, high-craft web interfaces.
                </p>
              </div>

              {/* Core Telemetry Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#e3c849]">
                    <Cpu size={14} />
                    <span className="font-semibold uppercase tracking-wider">Core Systems</span>
                  </div>
                  <p className="text-white/80 leading-snug">React 19 &bull; Next.js &bull; TypeScript &bull; Node &bull; Java &bull; Grails</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#e3c849]">
                    <Radio size={14} />
                    <span className="font-semibold uppercase tracking-wider">Active Base</span>
                  </div>
                  <p className="text-white/80 leading-snug">Kathmandu, Nepal &bull; NIRC Nepal &bull; Remote Worldwide</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#e3c849]">
                    <Activity size={14} />
                    <span className="font-semibold uppercase tracking-wider">Availability</span>
                  </div>
                  <p className="text-emerald-400 font-semibold">{WORK_STATUS.label}</p>
                </div>
              </div>

              {/* Action Launchpad Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#e3c849] px-6 py-3.5 font-mono text-sm font-bold text-[#161714] shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>ENTER ARCHIVE / EXPLORE WORK</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={onDownloadResume}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 font-mono text-sm font-semibold text-white transition-all hover:bg-white/15 hover:border-white/40 active:scale-[0.98]"
                >
                  <Download size={16} className="text-[#e3c849]" />
                  <span>GET RESUME (PDF)</span>
                </button>
              </div>

              {/* Bottom Quick Command Bar */}
              <div className="flex flex-wrap items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] text-[#a9aba3]">
                <div className="flex items-center gap-3">
                  <span>TIP: Press <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-white">ENTER</kbd> or <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-white">ESC</kbd> to proceed</span>
                </div>
                <div className="flex items-center gap-1 text-[#e3c849]">
                  <Sparkles size={12} />
                  <span>SYSTEM ARCHIVE READY</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
