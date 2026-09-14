"use client";

import { Compass, FileText, Layers, Mail, Moon, Sun } from "lucide-react";
import { soundEngine } from "@/lib/haptics";
import { useTheme } from "@/lib/theme";

interface ErgonomicMobileDockProps {
  onDownloadCV: () => void;
}

export function ErgonomicMobileDock({
  onDownloadCV,
}: ErgonomicMobileDockProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav
      aria-label="Mobile navigation dock"
      className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-4 z-50 bg-[var(--bg-secondary)]/95 backdrop-blur-md border border-[var(--surface-border)] rounded-2xl py-1.5 px-3 flex items-center justify-around shadow-[var(--card-shadow)] text-[var(--text-primary)] font-mono text-[10px]"
    >
      <a
        href="#hero"
        onClick={() => soundEngine.tick()}
        className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 rounded text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
      >
        <Compass size={16} className="text-[var(--accent-primary)]" />
        <span>Top</span>
      </a>

      <a
        href="#work"
        onClick={() => soundEngine.tick()}
        className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 rounded text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
      >
        <Layers size={16} />
        <span>Projects</span>
      </a>

      <button
        type="button"
        onClick={() => {
          soundEngine.tick();
          toggleTheme();
        }}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 rounded text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
        <span>{isDark ? "Light" : "Dark"}</span>
      </button>

      <button
        type="button"
        onClick={() => {
          soundEngine.relayClick();
          onDownloadCV();
        }}
        aria-label="Download Curriculum Vitae"
        className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 rounded text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
      >
        <FileText size={16} />
        <span>CV</span>
      </button>

      <a
        href="#contact"
        onClick={() => soundEngine.relayClick()}
        className="flex flex-col items-center justify-center min-w-[56px] min-h-[42px] gap-1 px-2.5 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold rounded-xl transition-transform active:scale-95"
      >
        <Mail size={14} />
        <span>Contact</span>
      </a>
    </nav>
  );
}
