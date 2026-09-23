"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { isReducedMotionEnabled } from "@/lib/useReducedMotion";

interface Point {
  x: number;
  y: number;
}

interface Segment {
  p1: Point;
  p2: Point;
  alpha: number;
  width: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface LightningBolt {
  segments: Segment[];
  duration: number;
  maxDuration: number;
  isMain: boolean;
}

export function LightningPortrait({
  image,
  alt,
  name,
  location,
}: {
  image: StaticImageData;
  alt: string;
  name: string;
  location: string;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [thunderActive, setThunderActive] = useState(false);

  const mousePos = useRef<{ x: number; y: number } | null>(null);
  const boltsRef = useRef<LightningBolt[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const lastStrikeTime = useRef(0);
  const rafId = useRef<number | null>(null);

  // Recursive midpoint displacement algorithm for lightning bolts
  const createBoltSegments = useCallback(
    (p1: Point, p2: Point, displace: number, minDisplace: number): Segment[] => {
      const segs: Segment[] = [];

      const subdivide = (a: Point, b: Point, d: number, depth: number) => {
        if (d < minDisplace || depth > 6) {
          segs.push({ p1: a, p2: b, alpha: 1, width: Math.max(1, 3.2 - depth * 0.4) });
          return;
        }

        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;

        // Vector perpendicular to segment
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        const offset = (Math.random() - 0.5) * d * 1.8;
        const displaced: Point = {
          x: midX + nx * offset,
          y: midY + ny * offset,
        };

        subdivide(a, displaced, d * 0.58, depth + 1);
        subdivide(displaced, b, d * 0.58, depth + 1);

        // Random branch fork
        if (Math.random() < 0.32 && depth < 4) {
          const branchAngle = (Math.random() - 0.5) * 1.2;
          const branchLen = d * 1.4;
          const cos = Math.cos(branchAngle);
          const sin = Math.sin(branchAngle);
          const dirX = (dx / len) * cos - (dy / len) * sin;
          const dirY = (dx / len) * sin + (dy / len) * cos;
          const branchEnd: Point = {
            x: displaced.x + dirX * branchLen,
            y: displaced.y + dirY * branchLen,
          };
          subdivide(displaced, branchEnd, d * 0.5, depth + 2);
        }
      };

      subdivide(p1, p2, displace, 0);
      return segs;
    },
    [],
  );

  // Trigger procedural thunder flash
  const triggerThunderFlash = useCallback(() => {
    setThunderActive(true);
    const flashEl = flashRef.current;
    if (flashEl) {
      flashEl.style.opacity = "0.75";
      setTimeout(() => {
        if (flashEl) flashEl.style.opacity = "0.2";
        setTimeout(() => {
          if (flashEl) flashEl.style.opacity = "0.85";
          setTimeout(() => {
            if (flashEl) flashEl.style.opacity = "0";
            setThunderActive(false);
          }, 70);
        }, 40);
      }, 50);
    }
  }, []);

  // Spawn a new lightning strike
  const spawnStrike = useCallback(
    (w: number, h: number, target?: Point) => {
      // Pick start point along top or sides
      const edge = Math.random();
      let start: Point;
      if (edge < 0.6) {
        // Top edge
        start = { x: Math.random() * w, y: Math.random() * 20 };
      } else if (edge < 0.8) {
        // Left edge
        start = { x: 0, y: Math.random() * (h * 0.7) };
      } else {
        // Right edge
        start = { x: w, y: Math.random() * (h * 0.7) };
      }

      // Target cursor if inside, or random bottom point
      const end: Point = target
        ? {
            x: target.x + (Math.random() - 0.5) * 40,
            y: target.y + (Math.random() - 0.5) * 40,
          }
        : {
            x: w * 0.2 + Math.random() * (w * 0.6),
            y: h * 0.4 + Math.random() * (h * 0.55),
          };

      const segs = createBoltSegments(start, end, Math.hypot(end.x - start.x, end.y - start.y) * 0.35, 12);
      const isMain = Math.random() < 0.4;

      boltsRef.current.push({
        segments: segs,
        duration: 0,
        maxDuration: isMain ? 14 : 9,
        isMain,
      });

      // Spawn impact sparks
      const sparkCount = isMain ? 18 : 8;
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        sparksRef.current.push({
          x: end.x,
          y: end.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 15 + Math.random() * 15,
          color: Math.random() < 0.5 ? "#ffffff" : Math.random() < 0.5 ? "#38bdf8" : "#a855f7",
        });
      }

      if (isMain) {
        triggerThunderFlash();
      }
    },
    [createBoltSegments, triggerThunderFlash],
  );

  // Animation loop
  useEffect(() => {
    if (!isHovered || isReducedMotionEnabled()) {
      boltsRef.current = [];
      sparksRef.current = [];
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const render = (now: number) => {
      if (!running) return;

      const w = canvas.width;
      const h = canvas.height;

      // Soft clear with faint persistence for motion blur
      ctx.clearRect(0, 0, w, h);

      // Periodically spawn new bolts
      if (now - lastStrikeTime.current > 110 + Math.random() * 140) {
        spawnStrike(w, h, mousePos.current || undefined);
        lastStrikeTime.current = now;
      }

      // Draw and update bolts
      for (let i = boltsRef.current.length - 1; i >= 0; i--) {
        const bolt = boltsRef.current[i];
        bolt.duration++;
        const lifeProgress = bolt.duration / bolt.maxDuration;
        const alpha = Math.max(0, 1 - lifeProgress);

        if (alpha <= 0) {
          boltsRef.current.splice(i, 1);
          continue;
        }

        // Multi-pass rendering for electric bloom
        // Pass 1: Wide electric cyan glow
        ctx.save();
        ctx.shadowColor = "#06b6d4";
        ctx.shadowBlur = bolt.isMain ? 22 : 12;
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.7})`;
        ctx.lineWidth = bolt.isMain ? 5 : 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        for (const seg of bolt.segments) {
          ctx.moveTo(seg.p1.x, seg.p1.y);
          ctx.lineTo(seg.p2.x, seg.p2.y);
        }
        ctx.stroke();
        ctx.restore();

        // Pass 2: Intense white-hot core
        ctx.save();
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 8;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
        ctx.lineWidth = bolt.isMain ? 2 : 1.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        for (const seg of bolt.segments) {
          ctx.moveTo(seg.p1.x, seg.p1.y);
          ctx.lineTo(seg.p2.x, seg.p2.y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Draw and update sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.94;
        s.vy *= 0.94;
        s.life++;

        const alpha = Math.max(0, 1 - s.life / s.maxLife);
        if (alpha <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isHovered, spawnStrike]);

  // Sync canvas dimensions
  const updateCanvasSize = useCallback(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;
    const rect = card.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  const handlePointerEnter = () => {
    updateCanvasSize();
    setIsHovered(true);
    // Instant initial lightning strike on enter
    if (canvasRef.current) {
      spawnStrike(canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    mousePos.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <article
      ref={cardRef}
      className={`portrait-card lightning-card ${isHovered ? "is-lightning" : ""} ${
        thunderActive ? "is-thunder-clapping" : ""
      }`}
      data-tilt
      data-tilt-max="14"
      data-tilt-glare
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <div className="portrait-frame">
        <Image
          src={image}
          alt={alt}
          width={480}
          height={560}
          priority
          className="portrait-img"
        />
        <div className="portrait-scanline" aria-hidden="true" />

        {/* Dynamic Lightning Canvas */}
        <canvas
          ref={canvasRef}
          className="lightning-canvas"
          aria-hidden="true"
        />

        {/* Thunder Flash Burst Overlay */}
        <div ref={flashRef} className="thunder-flash" aria-hidden="true" />
      </div>

      <footer className="portrait-meta">
        <strong>{name}</strong>
        <span>{location}</span>
      </footer>

      {/* Electric ambient corner arcs */}
      <div className="electric-border-glow" aria-hidden="true" />
    </article>
  );
}
