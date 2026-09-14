"use client";

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowUpRight } from "lucide-react";
import { EntranceReadyContext } from "@/lib/entrance";

type Phase =
  | "hidden"
  | "loading"
  | "charging"
  | "windup"
  | "impact"
  | "shatter"
  | "reveal";

/* ─── Fragment geometry ────────────────────────────────────────────────
   24 shards radiating from the centre, each a triangular wedge.
   Adjacent pairs share edges so the full screen is seamlessly tiled. */

const SHARD_COUNT = 24;
const CENTER = 50;

// Outer-edge anchor points around the viewport perimeter (24 points)
const perimeterPoints: [number, number][] = [];
for (let i = 0; i < SHARD_COUNT; i++) {
  const angle = (i / SHARD_COUNT) * Math.PI * 2 - Math.PI / 2;
  // Project onto the viewport bounding box with some overshoot
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const absC = Math.abs(cos);
  const absS = Math.abs(sin);
  const scale = absC > absS ? 55 / absC : 55 / absS;
  perimeterPoints.push([CENTER + cos * scale, CENTER + sin * scale]);
}

// Jag midpoints along each radial seam for organic cracks
const jaggedSeams = perimeterPoints.map(([px, py], i) => {
  const jag1 = 0.28 + (i % 3) * 0.04;
  const jag2 = 0.62 + (i % 2) * 0.06;
  const drift1 = i % 2 ? 2.8 : -2.5;
  const drift2 = i % 2 ? -3.2 : 2.8;
  return [
    [CENTER, CENTER],
    [
      CENTER + (px - CENTER) * jag1 + drift1,
      CENTER + (py - CENTER) * jag1 + drift2 * 0.6,
    ],
    [
      CENTER + (px - CENTER) * jag2 + drift2 * 0.5,
      CENTER + (py - CENTER) * jag2 + drift1 * 0.7,
    ],
    [px, py],
  ];
});

const fragments = jaggedSeams.map((seam, i) => {
  const next = jaggedSeams[(i + 1) % SHARD_COUNT];
  const [ex, ey] = perimeterPoints[i];
  const [nex, ney] = perimeterPoints[(i + 1) % SHARD_COUNT];
  const midX = (ex + nex) / 2 - CENTER;
  const midY = (ey + ney) / 2 - CENTER;
  // Velocity magnitude increases for edge shards
  const dist = Math.sqrt(midX * midX + midY * midY);
  const velScale = 1.6 + dist * 0.04;
  return {
    points: [...seam, ...[...next].reverse()]
      .map((pt) => pt.join(","))
      .join(" "),
    style: {
      "--shard-x": `${midX * velScale}px`,
      "--shard-y": `${midY * velScale}px`,
      "--shard-turn": `${i % 2 ? 18 + (i % 5) * 3 : -(15 + (i % 4) * 4)}deg`,
      "--shard-delay": `${(i % 5) * 30}ms`,
    } as CSSProperties,
  };
});

/* ─── Crack lines ──────────────────────────────────────────────────────
   12 jagged radial cracks from exact centre, rendered as SVG paths.
   They appear on impact via stroke-dashoffset animation. */
const CRACK_COUNT = 12;
const crackPaths: string[] = [];
for (let i = 0; i < CRACK_COUNT; i++) {
  const angle = (i / CRACK_COUNT) * Math.PI * 2 - Math.PI / 2;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  let d = `M ${CENTER} ${CENTER}`;
  const segments = 4 + (i % 3);
  for (let s = 1; s <= segments; s++) {
    const t = s / segments;
    const reach = 58;
    const jx = (i % 2 ? 1.5 : -1.5) * (s % 2 ? 1 : -1);
    const jy = (i % 2 ? -1.2 : 1.8) * (s % 2 ? -1 : 1);
    const x = CENTER + cos * reach * t + jx;
    const y = CENTER + sin * reach * t + jy;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  crackPaths.push(d);
}

/* ─── Components ───────────────────────────────────────────────────── */

export function PortfolioEntrance({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const finish = useCallback(() => setReady(true), []);
  return (
    <EntranceReadyContext.Provider value={ready}>
      <WelcomeLanding onComplete={finish} />
      <noscript>
        <style>{`.impact-entrance { display: none !important; }`}</style>
      </noscript>
      {children}
    </EntranceReadyContext.Provider>
  );
}

export function WelcomeLanding({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const skipRef = useRef<HTMLButtonElement>(null);
  const active = phase !== "hidden";

  const finish = useCallback(() => {
    setPhase("hidden");
    onComplete();
  }, [onComplete]);

  /* Phase state machine — always runs the full cinematic sequence */
  useEffect(() => {
    if (phase === "hidden") return;

    const transitions: Record<Exclude<Phase, "hidden">, [number, () => void]> =
      {
        loading: [3000, () => setPhase("charging")],
        charging: [1200, () => setPhase("windup")],
        windup: [600, () => setPhase("impact")],
        impact: [500, () => setPhase("shatter")],
        shatter: [1800, () => setPhase("reveal")],
        reveal: [1200, finish],
      };

    const [delay, advance] = transitions[phase];
    const timer = window.setTimeout(advance, delay);
    return () => window.clearTimeout(timer);
  }, [phase, finish]);

  /* Accessibility: trap focus, lock scroll, keyboard shortcuts */
  useEffect(() => {
    if (!active) return;
    const content = document.getElementById("portfolio-content");
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    if (content) content.inert = true;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        finish();
      }
      if (event.key === "Tab") {
        event.preventDefault();
        skipRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      if (content) content.inert = false;
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [active, finish]);

  /* Portfolio reveal class management */
  useEffect(() => {
    const content = document.getElementById("portfolio-content");
    if (!content) return;
    if (phase === "reveal") {
      content.classList.add("portfolio-entering");
      const timer = window.setTimeout(() => {
        content.classList.remove("portfolio-entering");
      }, 1300);
      return () => window.clearTimeout(timer);
    }
  }, [phase]);

  if (!active) return null;

  const showSolid = phase === "loading" || phase === "charging" || phase === "windup";

  return (
    <div
      className={`impact-entrance is-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      {/* Dark backdrop — fades out in reveal */}
      <div className="impact-backdrop" aria-hidden="true" />

      {/* Screen surface — solid or shattered fragments */}
      <svg
        className="impact-screen"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient
            id="impact-surface"
            gradientUnits="userSpaceOnUse"
            cx="50"
            cy="50"
            r="70"
          >
            <stop offset="0" stopColor="#18342f" />
            <stop offset=".6" stopColor="#0a151a" />
            <stop offset="1" stopColor="#05090f" />
          </radialGradient>
        </defs>
        {showSolid ? (
          <rect width="100" height="100" fill="url(#impact-surface)" />
        ) : (
          fragments.map((fragment) => (
            <polygon
              key={fragment.points}
              points={fragment.points}
              style={fragment.style}
              className="impact-fragment"
              fill="url(#impact-surface)"
            />
          ))
        )}
      </svg>

      {/* Crack lines — appear on impact, persist into shatter */}
      {(phase === "impact" || phase === "shatter") && (
        <svg
          className="impact-cracks"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {crackPaths.map((d, i) => (
            <path
              key={d}
              d={d}
              className="impact-crack-line"
              style={
                {
                  "--crack-delay": `${i * 15}ms`,
                  "--crack-length": `${140 + i * 8}`,
                } as CSSProperties
              }
            />
          ))}
        </svg>
      )}

      {/* Full-screen flash on impact */}
      <div className="impact-flash" aria-hidden="true" />

      {/* Manga speed lines */}
      <div className="impact-speed-lines" aria-hidden="true" />

      {/* Welcome intro content */}
      <div className="impact-intro">
        <p className="impact-eyebrow">RAMESH MAHARJAN / CREATIVE DEVELOPER</p>
        <div className="impact-emblem" aria-hidden="true">
          <svg viewBox="0 0 120 120" className="impact-loader-ring">
            <circle cx="60" cy="60" r="56" />
            <circle cx="60" cy="60" r="56" className="impact-loader-fill" />
          </svg>
          <span>
            RM<span className="impact-accent">.</span>
          </span>
        </div>
        <h2 id="welcome-title">
          Creative mind.
          <br />
          <span>Serious impact.</span>
        </h2>
        <div className="impact-loading" aria-hidden="true">
          <span />
        </div>
        <p className="impact-caption">
          {phase === "loading"
            ? "Building momentum"
            : phase === "charging"
              ? "Concentrating power"
              : "One idea. Full force."}
          <span className="impact-dots" aria-hidden="true">
            ...
          </span>
        </p>
      </div>

      {/* Energy particles converging during charging phase */}
      {phase === "charging" && (
        <div className="impact-energy-particles" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => (
            <span
              key={i}
              className="impact-particle"
              style={
                {
                  "--p-angle": `${(i / 16) * 360}deg`,
                  "--p-delay": `${i * 60}ms`,
                  "--p-dist": `${38 + (i % 4) * 8}vmin`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Strike zone: Saitama's fist flying from right side */}
      <div className="impact-strike" aria-hidden="true">
        {/* Double shockwave rings */}
        <div className="impact-shockwave" />
        <div className="impact-shockwave impact-shockwave-2" />

        {/* Ghost afterimage trails — 3 fading copies behind the fist */}
        <div className="impact-fist-trail impact-trail-1">
          <svg viewBox="0 0 260 240" fill="none">
            <path d="M195 0 197 80 104 88 80 0" fill="#e7b337" opacity=".5" />
            <path d="M210 92 170 220 44 194Q24 174 26 147L30 87 48 34Q56 14 80 18L96 26Q120 8 138 26L152 35 165 49Q176 31 200 44L210 58Z" fill="#e7b337" opacity=".5" />
          </svg>
        </div>
        <div className="impact-fist-trail impact-trail-2">
          <svg viewBox="0 0 260 240" fill="none">
            <path d="M195 0 197 80 104 88 80 0" fill="#e7b337" opacity=".3" />
            <path d="M210 92 170 220 44 194Q24 174 26 147L30 87 48 34Q56 14 80 18L96 26Q120 8 138 26L152 35 165 49Q176 31 200 44L210 58Z" fill="#e7b337" opacity=".3" />
          </svg>
        </div>
        <div className="impact-fist-trail impact-trail-3">
          <svg viewBox="0 0 260 240" fill="none">
            <path d="M195 0 197 80 104 88 80 0" fill="#e7b337" opacity=".15" />
            <path d="M210 92 170 220 44 194Q24 174 26 147L30 87 48 34Q56 14 80 18L96 26Q120 8 138 26L152 35 165 49Q176 31 200 44L210 58Z" fill="#e7b337" opacity=".15" />
          </svg>
        </div>

        {/* Main fist — Saitama's yellow glove, horizontal punch from right */}
        <svg className="impact-fist" viewBox="0 0 260 240" fill="none">
          {/* Wrist / arm extending to the right */}
          <path
            d="M195 0 197 80 104 88 80 0"
            fill="#e7b337"
            stroke="#111827"
            strokeWidth="6"
          />
          {/* Cuff stripe */}
          <path
            d="M103 88 197 78 194 56 100 66Z"
            fill="#f4f0df"
            stroke="#111827"
            strokeWidth="5"
          />
          {/* Glove body — clenched fist facing left (punching direction) */}
          <path
            d="M210 92 170 220 44 194Q24 174 26 147L30 87 48 34Q56 14 80 18L96 26Q120 8 138 26L152 35 165 49Q176 31 200 44L210 58Z"
            fill="#e7b337"
            stroke="#111827"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          {/* Knuckle definition lines */}
          <path
            d="M62 42 52 100m36-74 6 68m38-60 8 56m33-34 4 32M36 120l54-16 68 10q24 6 14 28l-50 8-22 34"
            stroke="#b8860b"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Knuckle highlights — bright */}
          <path
            d="M72 50 66 84m36-44 4 38m38-30 6 26M50 90l2 18"
            stroke="#fff4c8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Impact starburst at knuckle contact point */}
          <circle cx="46" cy="160" r="22" fill="#fff8" className="impact-knuckle-flash" />
        </svg>

        {/* Impact starburst lines */}
        <div className="impact-starburst" />

        {/* BOOM manga text */}
        <span className="impact-hit-word">
          BOOM<span>!</span>
        </span>
      </div>

      {/* Bottom bar */}
      <div className="impact-bottom">
        <span>KATHMANDU, NP · BUILT WITH INTENT</span>
        <button
          ref={skipRef}
          type="button"
          className="impact-skip"
          onClick={finish}
        >
          Skip intro <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
