"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={`theme-toggle-btn ${className}`}
        aria-hidden="true"
        disabled
      >
        <i className="fa-solid fa-moon" />
      </button>
    );
  }

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
    <button
      type="button"
      onClick={handleToggle}
      className={`theme-toggle-btn ${className}`}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <i
        className={isDark ? "fa-solid fa-sun" : "fa-solid fa-moon"}
        style={{ color: isDark ? "#fbbf24" : "#0284c7" }}
      />
    </button>
  );
}
