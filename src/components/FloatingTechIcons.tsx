"use client";

import { useEffect, useRef } from "react";
import { isReducedMotionEnabled } from "@/lib/useReducedMotion";

interface TechItem {
  name: string;
  color: string;
  icon: string;
}

const technologies: TechItem[] = [
  { name: "Next.js", color: "#000000", icon: "fa-solid fa-n" },
  { name: "React 19", color: "#61dafb", icon: "fa-brands fa-react" },
  { name: "TypeScript", color: "#3178c6", icon: "fa-solid fa-t" },
  { name: "JavaScript", color: "#f7df1e", icon: "fa-brands fa-js" },
  { name: "Tailwind", color: "#38bdf8", icon: "fa-solid fa-wind" },
  { name: "Node.js", color: "#83cd29", icon: "fa-brands fa-node-js" },
  { name: "Laravel 11", color: "#ff2d20", icon: "fa-brands fa-laravel" },
  { name: "PHP", color: "#777bb4", icon: "fa-brands fa-php" },
  { name: "Java", color: "#f89820", icon: "fa-brands fa-java" },
  { name: "Grails", color: "#feb672", icon: "fa-solid fa-g" },
  { name: "Python", color: "#4584b6", icon: "fa-brands fa-python" },
  { name: "Django", color: "#0c4b33", icon: "fa-solid fa-d" },
  { name: "PostgreSQL", color: "#336791", icon: "fa-solid fa-database" },
  { name: "MariaDB", color: "#c0765a", icon: "fa-solid fa-server" },
  { name: "Docker", color: "#2496ed", icon: "fa-brands fa-docker" },
  { name: "Git", color: "#f05032", icon: "fa-brands fa-git-alt" },
  { name: "GitHub", color: "#ffffff", icon: "fa-brands fa-github" },
  { name: "Linux", color: "#fcc624", icon: "fa-brands fa-linux" },
  { name: "Figma", color: "#a259ff", icon: "fa-brands fa-figma" },
  { name: "Vercel", color: "#ffffff", icon: "fa-solid fa-caret-up" },
  { name: "Alpine.js", color: "#8bc0d0", icon: "fa-solid fa-mountain" },
  { name: "HTML5", color: "#e34f26", icon: "fa-brands fa-html5" },
  { name: "CSS3", color: "#1572b6", icon: "fa-brands fa-css3-alt" },
  { name: "Three.js", color: "#10b981", icon: "fa-solid fa-cube" },
  { name: "WebSockets", color: "#06b6d4", icon: "fa-solid fa-bolt" },
];

export function FloatingTechIcons() {
  const sphereRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sphere = sphereRef.current;
    if (!sphere) return;
    const tags = Array.from(sphere.querySelectorAll<HTMLElement>(".tech"));
    const n = tags.length;
    if (!n) return;

    tags.forEach((t) => {
      const color = t.dataset.color;
      if (color) t.style.setProperty("--tech-color", color);
    });

    const pts = tags.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i + 1) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      return {
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
      };
    });

    const radiusFor = () =>
      sphere.clientWidth / 2 - (window.innerWidth < 600 ? 70 : 40);
    let radius = radiusFor();
    let rotX = 0.3;
    let rotY = 0;
    const idle = { x: 0.16, y: 0.11 };
    let velX = idle.x;
    let velY = idle.y;
    let targetVelX = idle.x;
    let targetVelY = idle.y;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let dragVX = 0;
    let dragVY = 0;
    let lastScroll = window.scrollY;

    const damp = (c: number, t: number, k: number, dt: number) =>
      c + (t - c) * (1 - Math.exp(-k * dt));

    const rotate = (
      p: { x: number; y: number; z: number },
      ax: number,
      ay: number,
    ) => {
      const y = p.y * Math.cos(ax) - p.z * Math.sin(ax);
      let z = p.y * Math.sin(ax) + p.z * Math.cos(ax);
      const x = p.x * Math.cos(ay) + z * Math.sin(ay);
      z = -p.x * Math.sin(ay) + z * Math.cos(ay);
      return { x, y, z };
    };

    function render() {
      for (let i = 0; i < n; i++) {
        const r = rotate(pts[i], rotX, rotY);
        const depth = (r.z + 1) / 2;
        const el = tags[i];
        el.style.transform = `translate(-50%, -50%) translate3d(${(r.x * radius).toFixed(1)}px, ${(r.y * radius).toFixed(1)}px, ${(r.z * radius).toFixed(1)}px) scale(${(0.55 + depth * 0.65).toFixed(3)})`;
        el.style.opacity = (0.18 + depth * 0.82).toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = `blur(${((1 - depth) * 1.2).toFixed(2)}px)`;
      }
    }

    let frame = 0;
    let last = performance.now();
    function loop(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging) {
        velX = damp(velX, targetVelX, 2.6, dt);
        velY = damp(velY, targetVelY, 2.6, dt);
        rotX += velX * dt;
        rotY += velY * dt;
        const winSmooth = (window as unknown as { Smooth?: { state?: { scroll: number } } }).Smooth;
        const s = winSmooth?.state ? winSmooth.state.scroll : window.scrollY;
        const ds = s - lastScroll;
        lastScroll = s;
        rotY += ds * 0.0012;
      }
      render();
      frame = requestAnimationFrame(loop);
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = sphere.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      if (dragging) {
        const dx = (e.clientX - lastX) * 0.005;
        const dy = -(e.clientY - lastY) * 0.005;
        rotY += dx;
        rotX += dy;
        dragVX = Math.max(-3.5, Math.min(3.5, dy * 45));
        dragVY = Math.max(-3.5, Math.min(3.5, dx * 45));
        lastX = e.clientX;
        lastY = e.clientY;
      } else {
        targetVelY = idle.y + nx * 1.4;
        targetVelX = idle.x - ny * 1.0;
      }
    };

    const onPointerLeave = () => {
      targetVelX = idle.x;
      targetVelY = idle.y;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isReducedMotionEnabled()) return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      sphere.setPointerCapture(e.pointerId);
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      velX = dragVX;
      velY = dragVY;
      targetVelX = idle.x;
      targetVelY = idle.y;
    };

    const onResize = () => {
      radius = radiusFor();
      render();
    };

    sphere.addEventListener("pointermove", onPointerMove, { passive: true });
    sphere.addEventListener("pointerleave", onPointerLeave);
    sphere.addEventListener("pointerdown", onPointerDown);
    sphere.addEventListener("pointerup", endDrag);
    sphere.addEventListener("pointercancel", endDrag);
    window.addEventListener("resize", onResize);

    render();
    if (!isReducedMotionEnabled()) {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      sphere.removeEventListener("pointermove", onPointerMove);
      sphere.removeEventListener("pointerleave", onPointerLeave);
      sphere.removeEventListener("pointerdown", onPointerDown);
      sphere.removeEventListener("pointerup", endDrag);
      sphere.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="stack-layout">
      {/* 3D Fibonacci Word Sphere */}
      <div className="tag-sphere-wrap" data-reveal="up">
        <div
          ref={sphereRef}
          className="tag-sphere"
          id="tag-sphere"
          role="img"
          aria-label="Interactive 3D tag sphere"
        >
          {technologies.map((tech) => (
            <span
              key={tech.name}
              className="tech"
              data-color={tech.color}
            >
              <i className={tech.icon} />
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* Stack Notes */}
      <aside className="stack-notes" data-reveal="right">
        <div className="stack-note glass" data-tilt data-tilt-max="8">
          <i className="fa-solid fa-code" />
          <h3>Frontend</h3>
          <p>
            Next.js 16, React 19, TypeScript, Tailwind CSS, Alpine.js, Framer
            Motion, Three.js / WebGL
          </p>
        </div>
        <div className="stack-note glass" data-tilt data-tilt-max="8">
          <i className="fa-solid fa-server" />
          <h3>Backend</h3>
          <p>
            Node.js, Laravel 11, Java / Grails MVC, Spring Security, Python
            Django, duplex WebSockets
          </p>
        </div>
        <div className="stack-note glass" data-tilt data-tilt-max="8">
          <i className="fa-solid fa-database" />
          <h3>Data &amp; Ops</h3>
          <p>
            PostgreSQL (tsvector, GIN), MariaDB ACID row locks, Docker, Git,
            Linux, Vercel
          </p>
        </div>
      </aside>
    </div>
  );
}
