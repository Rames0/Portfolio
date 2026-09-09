"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { soundEngine } from "@/lib/haptics";

export function TactileAudioToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(soundEngine.isSoundEnabled());
  }, []);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    soundEngine.setSoundEnabled(next);
    if (next) {
      soundEngine.modeSwitch();
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={enabled ? "Mute physical audio cues" : "Enable physical audio cues"}
      aria-pressed={enabled}
      className={`flex items-center gap-2 px-3 py-1.5 border border-[#161714] font-mono text-[10px] font-bold uppercase transition-all ${
        enabled
          ? "bg-[#E3C849] text-[#161714] shadow-[2px_2px_0px_#161714]"
          : "bg-[#F4F3EE] text-[#555650] hover:bg-[#EAE8DF] hover:text-[#161714]"
      }`}
    >
      {enabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
      <span className="hidden sm:inline">
        {enabled ? "HAPTICS: ON" : "HAPTICS: OFF"}
      </span>
    </button>
  );
}
