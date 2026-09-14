"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";

export function TactileThemeToggle({
  className = "",
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`h-8 w-8 rounded-full border border-[var(--surface-border)] bg-[var(--bg-secondary)] ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`theme-toggle inline-flex items-center justify-center gap-1.5 h-8 w-8 sm:h-8 sm:w-auto sm:px-2.5 rounded-full font-mono text-[11px] font-medium transition-colors cursor-pointer border border-[var(--surface-border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--surface-border-strong)] ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Sun size={14} className="text-[var(--accent-amber)]" />
        ) : (
          <Moon size={14} className="text-[var(--text-primary)]" />
        )}
      </div>
      {showLabel && (
        <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
      )}
    </button>
  );
}
