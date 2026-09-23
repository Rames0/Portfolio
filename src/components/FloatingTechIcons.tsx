"use client";

import { useEffect, useRef } from "react";
import { isReducedMotionEnabled } from "@/lib/useReducedMotion";

const technologies = [
  { name: "React 19", color: "#61dafb", icon: "fa-brands fa-react" },
  { name: "Next.js 15", color: "#ffffff", icon: "fa-solid fa-n" },
  { name: "TypeScript", color: "#3178c6", icon: "fa-solid fa-code" },
  { name: "Tailwind CSS", color: "#38bdf8", icon: "fa-solid fa-wind" },
  { name: "JavaScript", color: "#f7df1e", icon: "fa-brands fa-js" },
  { name: "Node.js", color: "#68a063", icon: "fa-brands fa-node-js" },
  { name: "Express", color: "#ffffff", icon: "fa-solid fa-server" },
  { name: "Laravel 11", color: "#ff2d20", icon: "fa-brands fa-laravel" },
  { name: "PHP", color: "#777bb4", icon: "fa-brands fa-php" },
  { name: "PostgreSQL", color: "#4169e1", icon: "fa-solid fa-database" },
  { name: "MySQL", color: "#00758f", icon: "fa-solid fa-database" },
  { name: "Prisma ORM", color: "#2d3748", icon: "fa-solid fa-layer-group" },
  { name: "Docker", color: "#2496ed", icon: "fa-brands fa-docker" },
  { name: "Git", color: "#f05032", icon: "fa-brands fa-git-alt" },
  { name: "REST APIs", color: "#10b981", icon: "fa-solid fa-network-wired" },
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
      sphere.clientWidth / 2 - (window.innerWidth < 600 ? 50 : 25);
    let radius = radiusFor();
    let rotX = 0.25;
    let rotY = 0;

    // Responsive, vibrant base rotation speeds
    const idle = { x: 0.38, y: 0.32 };
    let velX = idle.x;
    let velY = idle.y;
    let targetVelX = idle.x;
    let targetVelY = idle.y;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let dragVX = 0;
    let dragVY = 0;
    let isVisible = true;

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
        const depth = (r.z + 1) * 0.5; // 0 (back) to 1 (front)
        const el = tags[i];

        // Hardware-accelerated GPU 3D transform without expensive filter:blur
        const px = (r.x * radius).toFixed(1);
        const py = (r.y * radius).toFixed(1);
        const pz = (r.z * radius).toFixed(1);
        const scale = (0.68 + depth * 0.45).toFixed(3);

        el.style.transform = `translate3d(calc(-50% + ${px}px), calc(-50% + ${py}px), ${pz}px) scale(${scale})`;
        el.style.opacity = (0.35 + depth * 0.65).toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
      }
    }

    let frame = 0;
    let last = performance.now();

    function loop(now: number) {
      if (!isVisible) {
        frame = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;

      if (!dragging) {
        velX = damp(velX, targetVelX, 4.0, dt);
        velY = damp(velY, targetVelY, 4.0, dt);
        rotX += velX * dt;
        rotY += velY * dt;
      }

      render();
      frame = requestAnimationFrame(loop);
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = sphere.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      if (dragging) {
        const dx = (e.clientX - lastX) * 0.007;
        const dy = -(e.clientY - lastY) * 0.007;
        rotY += dx;
        rotX += dy;
        dragVX = Math.max(-5, Math.min(5, dy * 60));
        dragVY = Math.max(-5, Math.min(5, dx * 60));
        lastX = e.clientX;
        lastY = e.clientY;
      } else {
        // Dynamic reactive acceleration when hovering
        targetVelY = idle.y + nx * 2.5;
        targetVelX = idle.x - ny * 2.0;
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

    // IntersectionObserver to pause when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: "150px" }
    );
    observer.observe(sphere);

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
      observer.disconnect();
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
              title={tech.name}
            >
              <i className={tech.icon} aria-hidden="true" />
              <span>{tech.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Narrative Stack Breakdown */}
      <div className="stack-notes" data-reveal="right">
        <article
          className="stack-note"
          data-tilt
          data-tilt-max="12"
          data-tilt-glare
        >
          <i className="fa-solid fa-layer-group" />
          <h3>Modern Full-Stack Architecture</h3>
          <p>
            React 19 and Next.js 15 App Router on the client, orchestrated with
            Laravel 11, Node.js, and type-safe REST/WebSocket APIs for reactive
            client-server communication.
          </p>
        </article>

        <article
          className="stack-note"
          data-tilt
          data-tilt-max="12"
          data-tilt-glare
        >
          <i className="fa-solid fa-server" />
          <h3>Relational Systems & Scale</h3>
          <p>
            PostgreSQL and MySQL database modeling with strict indexing,
            connection pooling, Redis caching, and automated Dockerized CI/CD
            pipelines for zero-downtime shipping.
          </p>
        </article>

        <article
          className="stack-note"
          data-tilt
          data-tilt-max="12"
          data-tilt-glare
        >
          <i className="fa-solid fa-wand-magic-sparkles" />
          <h3>Spatial 3D & Micro-Interactions</h3>
          <p>
            WebGL particle simulations, Three.js shaders, GSAP timelines, and
            device-adaptive 60/120 FPS rendering engineered for cinematic web
            experiences.
          </p>
        </article>
      </div>
    </div>
  );
}
