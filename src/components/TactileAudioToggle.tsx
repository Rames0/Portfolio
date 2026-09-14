"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { soundEngine } from "@/lib/haptics";

export function TactileAudioToggle({
  className = "",
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
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
      aria-label={
        enabled ? "Mute physical audio cues" : "Enable physical audio cues"
      }
      aria-pressed={enabled}
      title={
        enabled ? "Mute physical audio cues" : "Enable physical audio cues"
      }
      className={`flex items-center gap-2 px-3 py-1.5 border font-mono text-[10px] font-bold uppercase transition-all duration-200 cursor-pointer ${
        enabled
          ? "bg-[var(--accent-gold)] text-[#090a0f] border-[var(--accent-gold)] shadow-[0_2px_10px_rgba(251,191,36,0.25)]"
          : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--surface-border)] hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]"
      } ${className}`}
    >
      {enabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
      {showLabel && (
        <span className="hidden sm:inline tracking-wider">
          {enabled ? "HAPTICS: ON" : "HAPTICS: OFF"}
        </span>
      )}
    </button>
  );
}
