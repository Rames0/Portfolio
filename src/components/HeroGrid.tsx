"use client";

import { useTheme } from "@/lib/theme";

/**
 * Architectural Blueprint Canvas:
 * Clean, lightweight, mathematically precise engineering grid.
 * Zero heavy GPU particle loops; loads instantly and stays crisp.
 */
export function HeroGrid() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Precision Engineering Grid */}
      <svg
        className="w-full h-full opacity-40 dark:opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="blueprint-small-grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)"}
              strokeWidth="0.75"
            />
          </pattern>
          <pattern
            id="blueprint-large-grid"
            width="96"
            height="96"
            patternUnits="userSpaceOnUse"
          >
            <rect width="96" height="96" fill="url(#blueprint-small-grid)" />
            <path
              d="M 96 0 L 0 0 0 96"
              fill="none"
              stroke={isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.12)"}
              strokeWidth="1"
            />
            {/* Corner Crosshairs */}
            <path
              d="M 0 6 L 0 0 6 0 M 90 0 L 96 0 96 6 M 96 90 L 96 96 90 96 M 6 96 L 0 96 0 90"
              fill="none"
              stroke={isDark ? "rgba(99,102,241,0.3)" : "rgba(79,70,229,0.3)"}
              strokeWidth="1.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-large-grid)" />
      </svg>

      {/* Subtle Top Ambient Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(99,102,241,0.08), transparent 80%)"
            : "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(79,70,229,0.06), transparent 80%)",
        }}
      />
    </div>
  );
}
