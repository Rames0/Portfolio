"use client";

import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#121310] text-[#F4F3EE] flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono site-shell">
      {/* Background terminal grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#2C2E29 1px, transparent 1px), linear-gradient(90deg, #2C2E29 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-xl w-full border-2 border-[#E3C849] bg-[#161714] p-8 shadow-[8px_8px_0px_#10110E]">
        
        <div className="flex items-center gap-3 border-b-2 border-[#2C2E29] pb-4 mb-6">
          <AlertTriangle className="text-[#FF5500]" size={28} />
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-[#E3C849] m-0">
            System Fault: 404
          </h1>
        </div>

        <div className="space-y-4 text-xs md:text-sm text-[#A6A89F] leading-relaxed">
          <p>
            <span className="text-[#38BDF8] font-bold">ERROR:</span> The requested resource payload could not be located in the current origin network.
          </p>
          <p>
            The node you are attempting to address has either been deprecated, moved, or never existed in the routing table.
          </p>
        </div>

        <div className="mt-8 bg-[#0A0B09] p-4 border border-[#2C2E29] flex items-center justify-between text-[10px] text-[#666]">
          <span>ATTEMPTING RECOVERY{dots}</span>
          <span className="text-[#FF5500] animate-pulse">FAILED</span>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#E3C849] hover:bg-[#ebd567] text-[#121310] font-black uppercase text-xs transition-transform active:scale-[0.99] shadow-[0_4px_20px_rgba(227,200,73,0.2)]"
          >
            <ArrowLeft size={16} />
            Return to Operational Interface
          </Link>
        </div>
      </div>
    </div>
  );
}
