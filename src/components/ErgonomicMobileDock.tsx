"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";

export function ErgonomicMobileDock() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  const handleToggle = () => {
    toggleTheme();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("theme:change", {
          detail: { theme: isDark ? "light" : "dark" },
        }),
      );
    }
  };

  return (
    <nav className="mobile-dock" aria-label="Mobile navigation dock">
      <a href="#hero">
        <i className="fa-solid fa-compass" />
        <span>Top</span>
      </a>
      <a href="#work">
        <i className="fa-solid fa-layer-group" />
        <span>Work</span>
      </a>
      <a href="#stack">
        <i className="fa-solid fa-cube" />
        <span>Stack</span>
      </a>
      {mounted && (
        <button
          type="button"
          onClick={handleToggle}
          className="dock-theme-btn"
          aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <i
            className={isDark ? "fa-solid fa-sun" : "fa-solid fa-moon"}
            style={{ color: isDark ? "#fbbf24" : "#0284c7" }}
          />
          <span>{isDark ? "Light" : "Dark"}</span>
        </button>
      )}
      <a href="#contact" className="dock-cta">
        <i className="fa-solid fa-envelope" />
        <span>Contact</span>
      </a>
    </nav>
  );
}
