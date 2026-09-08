"use client";

import { Compass, FileText, Mail, Volume2, VolumeX, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { soundEngine } from "@/lib/haptics";

interface ErgonomicMobileDockProps {
  onDownloadCV: () => void;
}

export function ErgonomicMobileDock({ onDownloadCV }: ErgonomicMobileDockProps) {
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    setSoundOn(soundEngine.isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundEngine.setSoundEnabled(next);
    if (next) soundEngine.relayClick();
  };

  return (
    <nav
      aria-label="Mobile thumb navigation"
      className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-3 z-50 bg-[#161714]/95 backdrop-blur-md border border-[#3C3E37] py-2 px-1 flex items-center justify-around shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-[#F4F3EE] font-mono text-[9px]"
    >
      <a
        href="#top"
        onClick={() => soundEngine.tick()}
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] gap-1 rounded text-[#CCC] active:text-[#E3C849] active:scale-95 transition-transform"
      >
        <Compass size={16} />
        <span>TOP</span>
      </a>

      <a
        href="#instruments"
        onClick={() => soundEngine.tick()}
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] gap-1 rounded text-[#CCC] active:text-[#E3C849] active:scale-95 transition-transform"
      >
        <Wrench size={16} />
        <span>BENCH</span>
      </a>

      <button
        type="button"
        onClick={() => {
          soundEngine.relayClick();
          onDownloadCV();
        }}
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] gap-1 rounded text-[#CCC] active:text-[#E3C849] active:scale-95 transition-transform"
      >
        <FileText size={16} />
        <span>CV PDF</span>
      </button>

      <button
        type="button"
        onClick={toggleSound}
        className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] gap-1 rounded active:scale-95 transition-all ${
          soundOn ? "text-[#E3C849]" : "text-[#888]"
        }`}
      >
        {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span>{soundOn ? "AUDIO ON" : "MUTED"}</span>
      </button>

      <a
        href="#contact"
        onClick={() => soundEngine.relayClick()}
        className="flex flex-col items-center justify-center min-w-[58px] min-h-[44px] gap-1 px-2 bg-[#E3C849] text-[#161714] font-bold active:scale-95 transition-transform"
      >
        <Mail size={16} />
        <span>DISPATCH</span>
      </a>
    </nav>
  );
}
