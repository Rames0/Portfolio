"use client";

import { useEffect, useRef, useState } from "react";
import { isReducedMotionEnabled } from "@/lib/useReducedMotion";

export function ScrollEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = cursorGlowRef.current;
    if (
      !glow ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      isReducedMotionEnabled()
    )
      return;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame = 0;
    let last = performance.now();
    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      glow.style.opacity = "1";
    };
    const onLeave = () => {
      glow.style.opacity = "0";
    };
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const blend = 1 - Math.exp(-14 * dt);
      x += (targetX - x) * blend;
      y += (targetY - y) * blend;
      glow.style.transform = `translate3d(${(x - 210).toFixed(1)}px, ${(y - 210).toFixed(1)}px, 0)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

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
      ".project-card, .platform-card, .journey-card, .flip-card, .stat-cube, .contact-side, .contact-form",
    );

    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      isReducedMotionEnabled()
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
      <div
        ref={cursorGlowRef}
        className="cursor-glow portfolio-cursor-glow"
        aria-hidden="true"
      />
      {/* Scroll Progress Bar at the top of the viewport */}
      <div
        className="scroll-progress portfolio-scroll-progress"
        style={{
          transform: `scaleX(${scrollProgress})`,
        }}
        aria-hidden="true"
      />
    </>
  );
}
