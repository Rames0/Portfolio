"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotionEnabled } from "@/lib/useReducedMotion";

export function PortfolioMotion() {
  useEffect(() => {
    const motionOff = isReducedMotionEnabled();
    const hasGsap = typeof gsap !== "undefined";
    if (hasGsap) gsap.registerPlugin(ScrollTrigger);

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      ("ontouchstart" in window && window.innerWidth < 1024);
    const isMobile = () => window.innerWidth < 860;

    const damp = (current: number, target: number, smoothing: number, dt: number) =>
      current + (target - current) * (1 - Math.exp(-smoothing * dt));
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

    const state = {
      scroll: window.scrollY,
      progress: 0,
      velocity: 0,
      lenis: null as Lenis | null,
      locked: true,
      isTouch,
    };

    const updateProgress = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      state.progress = clamp(state.scroll / max, 0, 1);
    };

    const easeOutExpo = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    let lenisInstance: Lenis | null = null;
    let cleanupTicker: (() => void) | null = null;

    if (!motionOff && !isTouch) {
      const lenis = new Lenis({
        duration: 1.25,
        easing: easeOutExpo,
        smoothWheel: true,
        wheelMultiplier: 1.0,
      });
      lenisInstance = lenis;
      state.lenis = lenis;

      if (!document.documentElement.dataset.portfolioEntered) {
        lenis.stop();
      } else {
        state.locked = false;
      }

      lenis.on("scroll", (e: { scroll: number; velocity: number }) => {
        state.scroll = e.scroll;
        state.velocity = e.velocity;
        updateProgress();
        if (hasGsap) ScrollTrigger.update();
      });

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(500, 33);
      cleanupTicker = () => gsap.ticker.remove(tick);
    } else {
      let lastY = window.scrollY;
      let lastT = performance.now();
      const onScroll = () => {
        const now = performance.now();
        const dt = Math.max(1, now - lastT);
        state.velocity = (((window.scrollY - lastY) / dt) * 16);
        lastY = window.scrollY;
        lastT = now;
        state.scroll = window.scrollY;
        updateProgress();
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      let decayRaf = 0;
      const decay = () => {
        state.velocity *= 0.9;
        decayRaf = requestAnimationFrame(decay);
      };
      decayRaf = requestAnimationFrame(decay);
    }

    const scrollTo = (target: string | number | HTMLElement, opts: { offset?: number; duration?: number; immediate?: boolean } = {}) => {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : (target instanceof HTMLElement ? target : null);
      const offset = opts.offset ?? -72;
      const y = typeof target === "number" ? target : (el ? el.getBoundingClientRect().top + window.scrollY + offset : 0);
      if (state.lenis) {
        state.lenis.scrollTo(y, {
          duration: opts.duration ?? 1.6,
          easing: easeOutQuart,
          immediate: !!opts.immediate,
        });
        return;
      }
      if (opts.immediate || !hasGsap) {
        window.scrollTo(0, y);
        return;
      }
      const from = window.scrollY;
      gsap.to(
        { v: from },
        {
          v: y,
          duration: opts.duration ?? 1.2,
          ease: "power4.out",
          onUpdate: function () {
            const targets = this.targets() as { v: number }[];
            if (targets && targets[0]) window.scrollTo(0, targets[0].v);
          },
        },
      );
    };

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id.length < 2 || !document.querySelector(id)) return;
      e.preventDefault();
      scrollTo(id);
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onAnchorClick);

    // Expose global window.Smooth
    (window as unknown as {
      Smooth?: {
        state: typeof state;
        damp: typeof damp;
        clamp: typeof clamp;
        scrollTo: typeof scrollTo;
        unlock: () => void;
        lock: () => void;
        refresh: () => void;
      };
    }).Smooth = {
      state,
      damp,
      clamp,
      scrollTo,
      unlock() {
        state.locked = false;
        if (state.lenis) state.lenis.start();
        document.documentElement.classList.remove("scroll-locked");
        if (hasGsap) ScrollTrigger.refresh();
      },
      lock() {
        state.locked = true;
        if (state.lenis) state.lenis.stop();
        document.documentElement.classList.add("scroll-locked");
      },
      refresh() {
        if (hasGsap) ScrollTrigger.refresh();
      },
    };

    /* ------------------------------------------------------------------ */
    /* TILT ENGINE                                                         */
    /* ------------------------------------------------------------------ */
    interface TiltItem {
      el: HTMLElement;
      inner: HTMLElement;
      max: number;
      layers: HTMLElement[];
      glare: HTMLElement | null;
      tx: number;
      ty: number;
      cx: number;
      cy: number;
      hover: number;
      hoverT: number;
      rect: DOMRect | null;
      active: boolean;
    }
    const tilts: TiltItem[] = [];
    let tiltRaf = 0;

    if (!motionOff) {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        if (el.classList.contains("has-tilt")) return;
        const max = parseFloat(el.dataset.tiltMax || "10");
        const inner = document.createElement("div");
        inner.className = "tilt-inner";
        while (el.firstChild) {
          inner.appendChild(el.firstChild);
        }
        el.appendChild(inner);
        el.classList.add("has-tilt");

        const layers = Array.from(inner.querySelectorAll<HTMLElement>("[data-layer]"));
        let glare: HTMLElement | null = null;
        if (el.hasAttribute("data-tilt-glare")) {
          glare = document.createElement("div");
          glare.className = "tilt-glare";
          inner.appendChild(glare);
        }

        const t: TiltItem = {
          el,
          inner,
          max,
          layers,
          glare,
          tx: 0.5,
          ty: 0.5,
          cx: 0.5,
          cy: 0.5,
          hover: 0,
          hoverT: 0,
          rect: null,
          active: false,
        };

        el.addEventListener("pointerenter", () => {
          t.rect = el.getBoundingClientRect();
          t.hoverT = 1;
        });
        el.addEventListener(
          "pointermove",
          (e) => {
            if (!t.rect) t.rect = el.getBoundingClientRect();
            t.tx = Math.min(1, Math.max(0, (e.clientX - t.rect.left) / t.rect.width));
            t.ty = Math.min(1, Math.max(0, (e.clientY - t.rect.top) / t.rect.height));
          },
          { passive: true },
        );
        el.addEventListener("pointerleave", () => {
          t.rect = null;
          t.hoverT = 0;
          t.tx = 0.5;
          t.ty = 0.5;
        });
        tilts.push(t);
      });

      let lastTilt = performance.now();
      const tiltLoop = (now: number) => {
        const dt = Math.min(0.05, (now - lastTilt) / 1000);
        lastTilt = now;
        for (const t of tilts) {
          t.cx = damp(t.cx, t.tx, t.hoverT ? 7.5 : 4, dt);
          t.cy = damp(t.cy, t.ty, t.hoverT ? 7.5 : 4, dt);
          t.hover = damp(t.hover, t.hoverT, 5, dt);
          if (t.hover < 0.002 && !t.hoverT) {
            if (t.active) {
              t.active = false;
              t.inner.style.transform = "";
              t.layers.forEach((l) => {
                l.style.transform = "";
              });
              if (t.glare) t.glare.style.opacity = "0";
            }
            continue;
          }
          t.active = true;
          const rx = (0.5 - t.cy) * t.max * 2 * t.hover;
          const ry = (t.cx - 0.5) * t.max * 2 * t.hover;
          t.inner.style.transform = `perspective(1000px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) translateZ(${(14 * t.hover).toFixed(2)}px)`;
          t.layers.forEach((l) => {
            const z = parseFloat(l.dataset.layer || "30") * t.hover;
            l.style.transform = `translateZ(${z.toFixed(1)}px) translate(${((t.cx - 0.5) * z * 0.25).toFixed(2)}px, ${((t.cy - 0.5) * z * 0.25).toFixed(2)}px)`;
          });
          if (t.glare) {
            t.glare.style.setProperty("--gx", `${(t.cx * 100).toFixed(1)}%`);
            t.glare.style.setProperty("--gy", `${(t.cy * 100).toFixed(1)}%`);
            t.glare.style.opacity = t.hover.toFixed(3);
          }
        }
        tiltRaf = requestAnimationFrame(tiltLoop);
      };
      tiltRaf = requestAnimationFrame(tiltLoop);
    }

    /* ------------------------------------------------------------------ */
    /* SCROLL CHOREOGRAPHY (GSAP ScrollTrigger)                           */
    /* ------------------------------------------------------------------ */
    const ctx = gsap.context(() => {
      const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
      if (motionOff || !hasGsap) {
        items.forEach((el) => el.classList.add("is-revealed"));
        return;
      }

      const m = isMobile() || isTouch;
      const SCRUB = m ? 0.35 : 0.85;
      ScrollTrigger.config({ ignoreMobileResize: true });

      // A. Sections as 3D pages
      document.querySelectorAll<HTMLElement>("main > .section").forEach((section) => {
        const inner = section.querySelector<HTMLElement>(".container");
        if (!inner) return;
        gsap.set(section, { perspective: m ? 1100 : 1500 });
        gsap.set(inner, { transformStyle: "preserve-3d", force3D: true });

        // ENTER: hinged at TOP edge
        gsap.fromTo(
          inner,
          {
            rotateX: m ? -16 : -26,
            z: m ? -120 : -240,
            y: m ? 30 : 50,
            scale: m ? 0.96 : 0.93,
            opacity: 0.7,
            transformOrigin: "50% 0%",
          },
          {
            rotateX: 0,
            z: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "none",
            transformOrigin: "50% 0%",
            scrollTrigger: {
              trigger: section,
              start: "top 100%",
              end: "top 55%",
              scrub: SCRUB,
            },
          },
        );

        // EXIT: hinged at BOTTOM edge
        gsap.fromTo(
          inner,
          {
            rotateX: 0,
            z: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            transformOrigin: "50% 100%",
          },
          {
            rotateX: m ? 10 : 18,
            z: m ? -160 : -360,
            y: m ? -60 : -120,
            scale: m ? 0.96 : 0.92,
            opacity: 0.5,
            ease: "none",
            immediateRender: false,
            transformOrigin: "50% 100%",
            scrollTrigger: {
              trigger: section,
              start: "bottom 40%",
              end: "bottom -20%",
              scrub: SCRUB,
            },
          },
        );
      });

      // D. Hero timeline
      const hero = document.getElementById("hero");
      if (hero) {
        gsap.set(hero, { perspective: 1500 });
        gsap.set(".hero-grid, .stats-strip", { transformStyle: "preserve-3d", force3D: true });
        const heroTl = gsap.timeline({
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom 20%", scrub: 0.8 },
        });
        heroTl
          .to(".hero-copy", { rotateX: 26, z: -420, y: -160, opacity: 0.1, transformOrigin: "50% 0%", ease: "none" }, 0)
          .to(".portrait-scene", { rotateY: -50, rotateX: 10, z: -420, x: m ? 0 : 220, y: -60, opacity: 0.1, ease: "none" }, 0)
          .to(".stats-strip", { rotateX: 35, z: -300, y: -120, opacity: 0.15, transformOrigin: "50% 0%", ease: "none" }, 0.25)
          .to(".title-3d", { z: (i: number) => -160 - i * 100, x: (i: number) => (i - 1) * 110, ease: "none" }, 0);
      }

      // Section headers
      document.querySelectorAll<HTMLElement>(".section-head").forEach((head) => {
        const title = head.querySelector<HTMLElement>(".section-title");
        const lead = head.querySelector<HTMLElement>(".section-lead");
        const tag = head.querySelector<HTMLElement>(".section-tag");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: head, start: "top 100%", end: "top 65%", scrub: 0.5 },
        });
        if (tag) tl.fromTo(tag, { x: -80 }, { x: 0, ease: "none" }, 0);
        if (title) {
          tl.fromTo(
            title,
            { rotateX: -55, y: 80, z: -160, transformOrigin: "50% 100%", transformPerspective: 900 },
            { rotateX: 0, y: 0, z: 0, ease: "none" },
            0.05,
          );
        }
        if (lead) tl.fromTo(lead, { y: 60, z: -80 }, { y: 0, z: 0, ease: "none" }, 0.2);
      });

      // C. Item fly-ins
      const dir: Record<string, { y: number; z: number; rotateX: number; rotateY: number; x: number }> = {
        up: { y: 40, z: -220, rotateX: -32, rotateY: 0, x: 0 },
        left: { x: -120, z: -220, rotateY: 28, rotateX: -10, y: 30 },
        right: { x: 120, z: -220, rotateY: -28, rotateX: -10, y: 30 },
      };
      let idx = 0;
      items.forEach((el) => {
        if (el.closest("#hero") || el.classList.contains("section-head")) {
          el.classList.add("is-revealed");
          return;
        }
        const d = dir[el.dataset.reveal || "up"] || dir.up;
        el.classList.add("is-gsap");
        gsap.set(el, { transformPerspective: 1200, transformOrigin: "50% 0%", force3D: true });
        gsap.fromTo(
          el,
          { ...d, scale: 0.94, opacity: 0.6 },
          {
            x: 0,
            y: 0,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 100%",
              end: "top 72%",
              scrub: m ? 0.3 : 0.5,
            },
          },
        );

        // B. Continuous drift
        const speeds = [-7, 4, -5, 6, -3, 5];
        const speed = m ? 0 : speeds[idx++ % speeds.length];
        if (speed) {
          gsap.fromTo(
            el,
            { yPercent: 0 },
            {
              yPercent: speed,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: el,
                start: "top 72%",
                end: "bottom -20%",
                scrub: 1.4,
              },
            },
          );
        }
      });

      // Project thumbnails parallax
      document.querySelectorAll<HTMLElement>(".project-thumb img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.18 },
          {
            yPercent: 8,
            scale: 1.18,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest(".project-card"),
              start: "top bottom",
              end: "bottom top",
              scrub: 0.85,
            },
          },
        );
      });

      // Timeline spine growth
      const spine = document.querySelector<HTMLElement>(".timeline-spine");
      if (spine) {
        gsap.fromTo(
          spine,
          { scaleY: 0, transformOrigin: "50% 0%" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".timeline",
              start: "top 85%",
              end: "bottom 60%",
              scrub: 0.8,
            },
          },
        );
      }

      // Tag sphere container swing
      const sphereWrap = document.querySelector<HTMLElement>(".tag-sphere-wrap");
      if (sphereWrap) {
        gsap.fromTo(
          sphereWrap,
          { scale: 0.55, rotateY: -90, z: -300, opacity: 0.6, transformPerspective: 1200 },
          {
            scale: 1,
            rotateY: 0,
            z: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sphereWrap,
              start: "top 100%",
              end: "top 55%",
              scrub: 0.85,
            },
          },
        );
      }

      // Footer float
      const footer = document.querySelector<HTMLElement>(".site-footer");
      if (footer) {
        gsap.fromTo(
          footer,
          { y: 60, opacity: 0.3 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: footer,
              start: "top 100%",
              end: "top 90%",
              scrub: 0.5,
            },
          },
        );
      }
    });

    // Velocity skew on main
    let skewRaf = 0;
    if (!motionOff && state.lenis) {
      const main = document.querySelector<HTMLElement>("main");
      if (main) {
        let skew = 0;
        let lastSkew = performance.now();
        const skewLoop = (now: number) => {
          const dt = Math.min(0.05, (now - lastSkew) / 1000);
          lastSkew = now;
          const target = Math.max(-1.8, Math.min(1.8, state.velocity * 0.025));
          skew = damp(skew, target, 6, dt);
          main.style.transform = Math.abs(skew) < 0.001 ? "" : `skewY(${skew.toFixed(3)}deg)`;
          skewRaf = requestAnimationFrame(skewLoop);
        };
        skewRaf = requestAnimationFrame(skewLoop);
      }
    }

    // Hero depth
    let heroRaf = 0;
    if (!motionOff && finePointer) {
      const hero = document.getElementById("hero");
      const chips = Array.from(document.querySelectorAll<HTMLElement>(".float-chip"));
      if (hero) {
        let tx = 0;
        let ty = 0;
        let cx = 0;
        let cy = 0;
        let lastHero = performance.now();
        const onHeroPointer = (e: PointerEvent) => {
          tx = (e.clientX / window.innerWidth - 0.5) * 2;
          ty = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        const onHeroLeave = () => {
          tx = 0;
          ty = 0;
        };
        hero.addEventListener("pointermove", onHeroPointer, { passive: true });
        hero.addEventListener("pointerleave", onHeroLeave);

        const heroLoop = (now: number) => {
          const dt = Math.min(0.05, (now - lastHero) / 1000);
          lastHero = now;
          cx = damp(cx, tx, 3.8, dt);
          cy = damp(cy, ty, 3.8, dt);
          hero.style.setProperty("--px", cx.toFixed(4));
          hero.style.setProperty("--py", cy.toFixed(4));
          chips.forEach((c) => {
            const z = parseFloat(c.dataset.layer || "60");
            c.style.translate = `${(cx * z * 0.35).toFixed(2)}px ${(cy * z * 0.3).toFixed(2)}px`;
          });
          heroRaf = requestAnimationFrame(heroLoop);
        };
        heroRaf = requestAnimationFrame(heroLoop);
      }
    }

    // Cursor glow
    let glowRaf = 0;
    if (!motionOff && finePointer) {
      const glow = document.getElementById("cursor-glow");
      if (glow) {
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let tx = x;
        let ty = y;
        let lastGlow = performance.now();
        const onPointer = (e: PointerEvent) => {
          tx = e.clientX;
          ty = e.clientY;
          glow.style.opacity = "1";
        };
        const onMouseLeave = () => {
          glow.style.opacity = "0";
        };
        window.addEventListener("pointermove", onPointer, { passive: true });
        document.addEventListener("mouseleave", onMouseLeave);

        const glowLoop = (now: number) => {
          const dt = Math.min(0.05, (now - lastGlow) / 1000);
          lastGlow = now;
          x = damp(x, tx, 10, dt);
          y = damp(y, ty, 10, dt);
          glow.style.transform = `translate3d(${(x - 210).toFixed(1)}px, ${(y - 210).toFixed(1)}px, 0)`;
          glowRaf = requestAnimationFrame(glowLoop);
        };
        glowRaf = requestAnimationFrame(glowLoop);
      }
    }

    // Flip cards
    document.querySelectorAll<HTMLElement>(".flip-card").forEach((card) => {
      const toggle = () => card.classList.toggle("is-flipped");
      card.addEventListener("click", toggle);
      card.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });

    // Global refresh triggers
    const triggerRefresh = () => {
      if (hasGsap) ScrollTrigger.refresh();
    };
    window.addEventListener("intro:done", () => {
      triggerRefresh();
      setTimeout(triggerRefresh, 150);
      setTimeout(triggerRefresh, 700);
      setTimeout(triggerRefresh, 1500);
    });
    window.addEventListener("resize", triggerRefresh);

    return () => {
      ctx.revert();
      if (cleanupTicker) cleanupTicker();
      if (lenisInstance) lenisInstance.destroy();
      cancelAnimationFrame(tiltRaf);
      cancelAnimationFrame(skewRaf);
      cancelAnimationFrame(heroRaf);
      cancelAnimationFrame(glowRaf);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("resize", triggerRefresh);
    };
  }, []);

  return null;
}
