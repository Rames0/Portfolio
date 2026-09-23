"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { EntranceReadyContext } from "@/lib/entrance";
import { isReducedMotionEnabled } from "@/lib/useReducedMotion";

export function PortfolioEntrance({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const complete = useCallback(() => setReady(true), []);
  return (
    <EntranceReadyContext.Provider value={ready}>
      <WelcomeLanding onComplete={complete} />
      {children}
    </EntranceReadyContext.Provider>
  );
}

const statusSteps: [number, string][] = [
  [0, "Initializing 3D engine"],
  [22, "Compiling shaders"],
  [48, "Spawning particle field"],
  [70, "Loading production systems"],
  [88, "Calibrating camera"],
  [100, "Ready"],
];

export function WelcomeLanding({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"active" | "hidden">("active");
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cubeWrapRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const completed = useRef(false);

  const finish = useCallback(() => {
    if (completed.current) return;
    completed.current = true;

    const overlay = overlayRef.current;
    const stage = stageRef.current;
    const cube = cubeRef.current;
    const grid = gridRef.current;
    const flash = flashRef.current;
    const site = document.getElementById("site") || document.getElementById("portfolio-content");
    const body = document.body;

    body.classList.remove("is-intro");
    if (site) site.classList.add("is-visible");
    document.documentElement.dataset.portfolioEntered = "true";
    window.dispatchEvent(new Event("portfolio:entered"));

    const reduceMotion = isReducedMotionEnabled();

    if (reduceMotion || !overlay || !stage || !cube || !site) {
      if (overlay) overlay.style.display = "none";
      if (site) gsap.set(site, { clearProps: "all" });
      const win = window as unknown as {
        Smooth?: { unlock: () => void };
        Scene3D?: { warpIn: () => void };
      };
      if (win.Smooth?.unlock) win.Smooth.unlock();
      if (win.Scene3D?.warpIn) win.Scene3D.warpIn();
      window.dispatchEvent(new CustomEvent("intro:done"));
      setPhase("hidden");
      onComplete();
      return;
    }

    overlay.classList.add("is-done");

    // Prepare site in 3D depth behind overlay
    gsap.set(site, {
      transformPerspective: 1400,
      transformOrigin: "50% 30%",
      z: -260,
      rotateX: 6,
      y: 50,
      opacity: 0,
    });
    gsap.set(".hero-copy > *", {
      y: 50,
      rotateX: -20,
      opacity: 0,
      transformOrigin: "50% 100%",
    });
    gsap.set(".portrait-card", { rotateY: -35, z: -260, opacity: 0 });
    gsap.set(".stat-cube", { y: 60, rotateX: -25, opacity: 0 });
    gsap.set(".site-header", { y: -50, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // 1. Stage dives into camera with super smooth glide
    tl.to(stage, { z: 450, scale: 1.08, opacity: 0, duration: 0.75, ease: "power2.in" }, 0)
      .to(cube, { rotateY: "+=540", rotateX: "+=180", scale: 0.7, duration: 0.75, ease: "power2.in" }, 0)
      .to(grid, { opacity: 0, duration: 0.45 }, 0.1)
      // 2. Soft radial energy bloom + warp stars
      .to(flash, { opacity: 0.7, duration: 0.3, ease: "power2.in" }, 0.35)
      .add(() => {
        const win = window as unknown as { Scene3D?: { warpIn: () => void } };
        if (win.Scene3D?.warpIn) win.Scene3D.warpIn();
      }, 0.45)
      .to(flash, { opacity: 0, duration: 0.55, ease: "power2.out" }, 0.55)
      // 3. Overlay dissolves smoothly
      .to(
        overlay,
        {
          opacity: 0,
          scale: 1.03,
          duration: 0.65,
          ease: "power2.inOut",
        },
        0.45,
      )
      // 4. Site rises effortlessly from depth
      .to(
        site,
        {
          z: 0,
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
        },
        0.55,
      )
      .to(".site-header", { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" }, 0.7)
      .to(
        ".hero-copy > *",
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.06,
          ease: "power4.out",
        },
        0.75,
      )
      .to(".portrait-card", { rotateY: 0, z: 0, opacity: 1, duration: 1.0, ease: "power4.out" }, 0.8)
      .to(
        ".stat-cube",
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: "power4.out",
        },
        0.95,
      )

      .add(() => {
        overlay.style.display = "none";
        gsap.set(site, { clearProps: "transform,filter,opacity" });
        gsap.set(
          ".hero-copy > *, .portrait-card, .stat-cube, .site-header",
          { clearProps: "transform,opacity" },
        );
        const win = window as unknown as { Smooth?: { unlock: () => void } };
        if (win.Smooth?.unlock) win.Smooth.unlock();
        window.dispatchEvent(new CustomEvent("intro:done"));
        setPhase("hidden");
        onComplete();
      }, 1.5);
  }, [onComplete]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const stage = stageRef.current;
    const cubeWrap = cubeWrapRef.current;
    const cube = cubeRef.current;
    const grid = gridRef.current;
    const bar = barRef.current;
    const statusEl = statusRef.current;
    const percentEl = percentRef.current;

    if (!overlay || !stage || !cubeWrap || !cube || !grid || !bar || !statusEl || !percentEl) {
      return;
    }

    const setProgress = (p: number) => {
      const v = Math.round(p);
      bar.style.width = `${v}%`;
      percentEl.textContent = `${v}%`;
      for (let i = statusSteps.length - 1; i >= 0; i--) {
        if (v >= statusSteps[i][0]) {
          statusEl.textContent = statusSteps[i][1];
          break;
        }
      }
    };

    const params = new URLSearchParams(window.location.search);
    const staticMode =
      params.has("static") ||
      params.has("skip") ||
      (window as unknown as { __STATIC_PREVIEW__?: boolean }).__STATIC_PREVIEW__ === true;

    if (staticMode) {
      finish();
      return;
    }

    if (isReducedMotionEnabled()) {
      overlay.querySelectorAll<HTMLElement>(
        ".intro-eyebrow, .intro-cube, .intro-ring, .intro-progress, .char",
      ).forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      setProgress(100);
      finish();
      return;
    }

    gsap.set(stage, { transformPerspective: 1400, transformStyle: "preserve-3d" });
    gsap.set(cubeWrap, { z: -300, opacity: 0 });
    gsap.set(grid, { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to(grid, { opacity: 1, duration: 1.0, ease: "power2.out" }, 0)
      .to(".intro-eyebrow", { opacity: 1, y: 0, duration: 0.8 }, 0.1)
      .to(cubeWrap, { z: 0, opacity: 1, duration: 1.0, ease: "expo.out" }, 0.15)
      .fromTo(
        cube,
        { opacity: 0, scale: 0.2, rotateX: 120, rotateY: -90 },
        {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.75)",
          clearProps: "transform",
        },
        0.2,
      )
      .fromTo(
        ".intro-ring",
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.9, stagger: 0.08, ease: "expo.out" },
        0.4,
      )
      .to(
        ".char",
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: { each: 0.02, ease: "power1.in" },
          ease: "back.out(1.4)",
        },
        0.45,
      )
      .fromTo(".intro-progress", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, 0.6)
      .to(
        { p: 0 },
        {
          p: 100,
          duration: 1.3,
          ease: "power2.inOut",
          onUpdate: function () {
            const targets = this.targets() as { p: number }[];
            if (targets && targets[0]) setProgress(targets[0].p);
          },
          onComplete: () => {
            setProgress(100);
            finish();
          },
        },
        0.7,
      );

    // Damped pointer tilt for the whole stage
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    overlay.addEventListener("pointermove", onPointerMove, { passive: true });

    let rafId: number;
    let last = performance.now();
    const tilt = (now: number) => {
      if (completed.current) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = 1 - Math.exp(-6 * dt);
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      gsap.set(stage, { rotateY: cur.x * 9, rotateX: -cur.y * 9, x: cur.x * 14, y: cur.y * 10 });
      cubeWrap.style.transform = `translate3d(${(cur.x * 22).toFixed(1)}px, ${(cur.y * 16).toFixed(1)}px, 0)`;
      rafId = requestAnimationFrame(tilt);
    };
    rafId = requestAnimationFrame(tilt);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        finish();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      overlay.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [finish]);

  if (phase === "hidden") return null;

  const line1 = "Creative mind.".split("");
  const line2 = "Serious impact.".split("");

  return (
    <div
      id="intro-overlay"
      className="intro-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      onClick={finish}
      style={{ cursor: "pointer" }}
    >
      <div className="intro-grid" ref={gridRef} aria-hidden="true" />
      <div className="intro-vignette" aria-hidden="true" />

      <div className="intro-stage" ref={stageRef}>
        <p className="intro-eyebrow">
          RAMESH MAHARJAN &middot; FULL-STACK DEVELOPER &middot; 3D EXPERIMENTAL
        </p>

        <div className="intro-cube-wrap" ref={cubeWrapRef} aria-hidden="true">
          <div className="intro-cube" id="intro-cube" ref={cubeRef}>
            <div className="cube-face cube-front">RM<span>.</span></div>
            <div className="cube-face cube-back">3D</div>
            <div className="cube-face cube-right">&lt;/&gt;</div>
            <div className="cube-face cube-left">&#123; &#125;</div>
            <div className="cube-face cube-top">NP</div>
            <div className="cube-face cube-bottom">UX</div>
          </div>
          <div className="intro-ring ring-1" />
          <div className="intro-ring ring-2" />
          <div className="intro-ring ring-3" />
        </div>

        <h1 id="intro-title" className="intro-title">
          <span className="intro-line" data-split>
            {line1.map((ch, i) => (
              <span key={`l1-${i}-${ch}`} className="char">
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </span>
          <span className="intro-line intro-line-accent" data-split>
            {line2.map((ch, i) => (
              <span key={`l2-${i}-${ch}`} className="char">
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </span>
        </h1>

        <div className="intro-progress" aria-hidden="true">
          <div className="intro-progress-track">
            <div className="intro-progress-bar" id="intro-bar" ref={barRef} />
          </div>
          <div className="intro-progress-meta">
            <span id="intro-status" ref={statusRef}>
              Initializing 3D engine
            </span>
            <span id="intro-percent" ref={percentRef}>
              0%
            </span>
          </div>
        </div>
      </div>

      <div className="intro-flash" id="intro-flash" ref={flashRef} aria-hidden="true" />
    </div>
  );
}
