"use client";

import { useEffect, useRef, useState } from "react";
import { FaCss3Alt, FaJava } from "react-icons/fa";
import {
  SiDocker,
  SiFigma,
  SiFramer,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiLinux,
  SiMariadb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

export interface TechIconItem {
  id: string;
  name: string;
  category: string;
  color: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
}

const TECH_ICONS: TechIconItem[] = [
  {
    id: "nextjs",
    name: "Next.js 16",
    category: "Frontend",
    color: "#ffffff",
    icon: SiNextdotjs,
  },
  {
    id: "react",
    name: "React 19",
    category: "Frontend",
    color: "#61dafb",
    icon: SiReact,
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Language",
    color: "#3178c6",
    icon: SiTypescript,
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Language",
    color: "#f7df1e",
    icon: SiJavascript,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Styles",
    color: "#06b6d4",
    icon: SiTailwindcss,
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend",
    color: "#5fa04e",
    icon: SiNodedotjs,
  },
  {
    id: "laravel",
    name: "Laravel 11",
    category: "Backend",
    color: "#ff2d20",
    icon: SiLaravel,
  },
  {
    id: "php",
    name: "PHP 8.x",
    category: "Language",
    color: "#777bb4",
    icon: SiPhp,
  },
  {
    id: "java",
    name: "Java / Grails",
    category: "Backend",
    color: "#ea2d2e",
    icon: FaJava,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Database",
    color: "#4169e1",
    icon: SiPostgresql,
  },
  {
    id: "mariadb",
    name: "MariaDB",
    category: "Database",
    color: "#003545",
    icon: SiMariadb,
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "Database",
    color: "#00758f",
    icon: SiMysql,
  },
  {
    id: "docker",
    name: "Docker",
    category: "DevOps",
    color: "#2496ed",
    icon: SiDocker,
  },
  { id: "git", name: "Git", category: "DevOps", color: "#f05032", icon: SiGit },
  {
    id: "github",
    name: "GitHub",
    category: "DevOps",
    color: "#ffffff",
    icon: SiGithub,
  },
  {
    id: "figma",
    name: "Figma",
    category: "Design",
    color: "#f24e1e",
    icon: SiFigma,
  },
  {
    id: "linux",
    name: "Linux",
    category: "OS",
    color: "#fcc624",
    icon: SiLinux,
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "Cloud",
    color: "#ffffff",
    icon: SiVercel,
  },
  {
    id: "threejs",
    name: "Three.js",
    category: "3D",
    color: "#ffffff",
    icon: SiThreedotjs,
  },
  {
    id: "framer",
    name: "Framer Motion",
    category: "Motion",
    color: "#0055ff",
    icon: SiFramer,
  },
  {
    id: "html5",
    name: "HTML5",
    category: "Frontend",
    color: "#e34f26",
    icon: SiHtml5,
  },
  {
    id: "css3",
    name: "CSS3",
    category: "Frontend",
    color: "#1572b6",
    icon: FaCss3Alt,
  },
];

interface ParticleState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseVx: number;
  baseVy: number;
  phase: number;
  rotation: number;
  vRot: number;
}

export function FloatingTechIcons() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    if (width <= 0 || height <= 0) {
      width = 800;
      height = 500;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.innerWidth < 768;
    const iconSize = isMobile ? 50 : 60;

    // Initialize particles state with calm, slow velocity
    const particles: ParticleState[] = TECH_ICONS.map((_, i) => {
      // Distribute evenly in a grid with randomized offsets to avoid starting clump
      const cols = Math.max(
        3,
        Math.floor(
          Math.sqrt(TECH_ICONS.length * (width / Math.max(height, 1))),
        ),
      );
      const rows = Math.ceil(TECH_ICONS.length / cols);
      const col = i % cols;
      const row = Math.floor(i / cols);

      const cellW = (width - iconSize - 20) / Math.max(cols - 1, 1);
      const cellH = (height - iconSize - 20) / Math.max(rows - 1, 1);

      const initialX =
        10 + col * cellW + (Math.random() - 0.5) * (cellW * 0.45);
      const initialY =
        10 + row * cellH + (Math.random() - 0.5) * (cellH * 0.45);

      const angle = Math.random() * Math.PI * 2;
      // Gentle, slow cruise speed
      const speed = prefersReducedMotion
        ? 0.04
        : (isMobile ? 0.12 : 0.16) + Math.random() * 0.06;

      return {
        x: Math.max(0, Math.min(width - iconSize, initialX)),
        y: Math.max(0, Math.min(height - iconSize, initialY)),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        size: iconSize,
        phase: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 14,
        vRot: (Math.random() - 0.5) * 0.03, // slow gentle rotation
      };
    });

    // Pointer tracking for interactive antigravity cursor repulsion
    const pointer = { x: -9999, y: -9999, active: false };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    let animId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const dt = Math.min((now - lastTime) / 16.666, 2.0);
      lastTime = now;
      const t = now * 0.001;

      const repelRadius = isMobile ? 80 : 120;
      const repelForce = isMobile ? 0.6 : 0.9;
      const maxSpeed = isMobile ? 0.45 : 0.65;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Soft, slow harmonic organic turbulence wave
        const waveX = Math.sin(t * 0.35 + p.phase) * 0.015;
        const waveY = Math.cos(t * 0.3 + p.phase * 1.3) * 0.015;

        p.vx += waveX;
        p.vy += waveY;

        // Smooth return damping towards base slow velocity
        p.vx = p.vx * 0.97 + p.baseVx * 0.03;
        p.vy = p.vy * 0.97 + p.baseVy * 0.03;

        // Gentle Cursor Antigravity Repulsion
        if (pointer.active) {
          const centerX = p.x + p.size / 2;
          const centerY = p.y + p.size / 2;
          const dx = centerX - pointer.x;
          const dy = centerY - pointer.y;
          const dist = Math.hypot(dx, dy);

          if (dist < repelRadius && dist > 1) {
            const factor = (1 - dist / repelRadius) ** 1.5 * repelForce;
            const nx = dx / dist;
            const ny = dy / dist;
            p.vx += nx * factor;
            p.vy += ny * factor;
          }
        }

        // Clamp speed to guarantee slow, graceful movement
        const currentSpeed = Math.hypot(p.vx, p.vy);
        if (currentSpeed > maxSpeed) {
          p.vx = (p.vx / currentSpeed) * maxSpeed;
          p.vy = (p.vy / currentSpeed) * maxSpeed;
        }

        // Apply velocities
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.vRot * dt;

        // Soft bounce against boundaries
        const minX = 6;
        const maxX = width - p.size - 6;
        const minY = 6;
        const maxY = height - p.size - 6;

        if (p.x < minX) {
          p.x = minX;
          p.vx = Math.abs(p.baseVx);
          p.baseVx = Math.abs(p.baseVx);
        } else if (p.x > maxX) {
          p.x = maxX;
          p.vx = -Math.abs(p.baseVx);
          p.baseVx = -Math.abs(p.baseVx);
        }

        if (p.y < minY) {
          p.y = minY;
          p.vy = Math.abs(p.baseVy);
          p.baseVy = Math.abs(p.baseVy);
        } else if (p.y > maxY) {
          p.y = maxY;
          p.vy = -Math.abs(p.baseVy);
          p.baseVy = -Math.abs(p.baseVy);
        }

        // Soft, slow inter-particle separation to prevent overlap
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const c1X = p.x + p.size / 2;
          const c1Y = p.y + p.size / 2;
          const c2X = p2.x + p2.size / 2;
          const c2Y = p2.y + p2.size / 2;
          const diffX = c1X - c2X;
          const diffY = c1Y - c2Y;
          const d = Math.hypot(diffX, diffY);
          const minSep = p.size * 0.95;

          if (d < minSep && d > 0.1) {
            const push = ((minSep - d) / minSep) * 0.08;
            const pushX = (diffX / d) * push;
            const pushY = (diffY / d) * push;
            p.vx += pushX;
            p.vy += pushY;
            p2.vx -= pushX;
            p2.vy -= pushY;
          }
        }

        // Direct DOM write for 60fps performance without React re-renders
        const el = elementsRef.current[i];
        if (el) {
          el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0px) rotate(${p.rotation.toFixed(1)}deg)`;
        }
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted]);

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Interactive Physics Arena (clean, no square box in background) */}
      <div
        ref={containerRef}
        className="relative w-full h-[380px] sm:h-[480px] md:h-[520px] overflow-hidden select-none touch-none cursor-crosshair"
      >
        {TECH_ICONS.map((tech, idx) => {
          const IconComponent = tech.icon;
          const isHovered = activeTooltip === tech.id;

          return (
            <div
              key={tech.id}
              ref={(el) => {
                elementsRef.current[idx] = el;
              }}
              onPointerEnter={() => setActiveTooltip(tech.id)}
              onPointerLeave={() => setActiveTooltip(null)}
              className="absolute top-0 left-0 will-change-transform group cursor-pointer"
            >
              {/* Circular Soft Glassmorphic Tech Icon Badge */}
              <div
                className={`relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border transition-all duration-200 backdrop-blur-sm ${
                  isHovered
                    ? "scale-125 border-[var(--accent-primary)] bg-[var(--bg-card)] shadow-[0_0_24px_var(--accent-glow)] z-30"
                    : "border-[var(--surface-border)] bg-[var(--bg-card)]/50 hover:border-[var(--surface-border-strong)] shadow-sm z-10"
                }`}
                style={{
                  color: isHovered ? tech.color : "var(--text-primary)",
                }}
              >
                <IconComponent
                  size={24}
                  className="transition-transform duration-200 group-hover:scale-110 shrink-0"
                />

                {/* Subtle Glow on Hover */}
                {isHovered && (
                  <span
                    className="absolute inset-0 rounded-full pointer-events-none opacity-25"
                    style={{
                      boxShadow: `inset 0 0 16px ${tech.color}`,
                    }}
                  />
                )}
              </div>

              {/* Responsive Floating Tooltip Badge */}
              {isHovered && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap z-40 bg-[var(--bg-primary)] border border-[var(--accent-primary)] text-[var(--text-primary)] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-lg">
                  {tech.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
