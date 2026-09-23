"use client";

import { useEntranceReady } from "@/lib/entrance";

const description =
  "I'm Ramesh Maharjan — Full-Stack Developer & UI/UX Designer at NIRC Nepal. I specialize in building high-performance web applications, combining transactional relational data integrity (PostgreSQL & MariaDB ACID row locks) with fluid, human-centered interfaces (Next.js 16, React 19, TypeScript, Tailwind CSS).";

/** Hero copy follows the three depth layers of the 3D prototype. */
export function HeroTypingIntro() {
  const ready = useEntranceReady();
  return (
    <div className={`hero-copy-3d ${ready ? "is-ready" : ""}`}>
      <h1 className="hero-main-heading hero-title-3d">
        <span>Architecting</span>
        <span className="gradient-text">resilient web systems</span>
        <span>with modern craft.</span>
      </h1>
      <p className="hero-sub-statement">{description}</p>
    </div>
  );
}
