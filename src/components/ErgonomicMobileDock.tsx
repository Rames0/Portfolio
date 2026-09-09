"use client";

import { Compass, FileText, Mail, Wrench } from "lucide-react";

interface ErgonomicMobileDockProps {
  onDownloadCV: () => void;
}

export function ErgonomicMobileDock({ onDownloadCV }: ErgonomicMobileDockProps) {
  return (
    <nav
      aria-label="Mobile thumb navigation"
      className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-3 z-50 bg-[#161714]/95 backdrop-blur-md border border-[#3C3E37] py-2 px-1 flex items-center justify-around shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-[#F4F3EE] font-mono text-[9px]"
    >
      <a
        href="#top"
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] gap-1 rounded text-[#CCC] active:text-[#E3C849] active:scale-95 transition-transform"
      >
        <Compass size={16} />
        <span>TOP</span>
      </a>

      <a
        href="#lab"
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] gap-1 rounded text-[#CCC] active:text-[#E3C849] active:scale-95 transition-transform"
      >
        <Wrench size={16} />
        <span>BENCH</span>
      </a>

      <button
        type="button"
        onClick={() => {
          onDownloadCV();
        }}
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] gap-1 rounded text-[#CCC] active:text-[#E3C849] active:scale-95 transition-transform"
      >
        <FileText size={16} />
        <span>CV PDF</span>
      </button>

      <a
        href="#contact"
        className="flex flex-col items-center justify-center min-w-[58px] min-h-[44px] gap-1 px-2 bg-[#E3C849] text-[#161714] font-bold active:scale-95 transition-transform"
      >
        <Mail size={16} />
        <span>DISPATCH</span>
      </a>
    </nav>
  );
}
