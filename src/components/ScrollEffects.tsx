"use client";

import { useEffect, useState } from "react";

export function ScrollEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Card interactive spotlight glow on mousemove
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(
      ".platform-card, .journey-card, .service-unit, .skill-cluster-box, .stat-box, .contact-card-sidebar, .contact-form-box",
    );

    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const onMouseMove = (event: MouseEvent) => {
      const card = event.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    };
    cards.forEach((card) =>
      card.addEventListener("mousemove", onMouseMove, { passive: true }),
    );
    return () =>
      cards.forEach((card) =>
        card.removeEventListener("mousemove", onMouseMove),
      );
  }, []);

  return (
    <>
      {/* Scroll Progress Bar at the top of the viewport */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[100] pointer-events-none origin-left"
        style={{
          transform: `scaleX(${scrollProgress})`,
          background:
            "linear-gradient(90deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)",
          boxShadow: "0 0 10px rgba(16, 185, 129, 0.6)",
          transition: "transform 0.08s linear",
        }}
        aria-hidden="true"
      />
    </>
  );
}
