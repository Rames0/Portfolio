"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { MOTION } from "@/lib/motion";
import { soundEngine } from "@/lib/haptics";

const SESSION_KEY = "rm-entry-v2";

export function PortfolioMotion() {
  const introRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const [showSplash, setShowSplash] = useState(true);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try { seen = sessionStorage.getItem(SESSION_KEY) === "1"; } catch { }
    
    if (media.matches || seen || location.hash || window.scrollY >= 20) {
      setShowSplash(false);
    }
  }, []);

  useLayoutEffect(() => {
    if (!showSplash) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.querySelector<HTMLElement>(".site-shell");
    const intro = introRef.current;
    if (!root || !intro) return;

    let disposed = false;
    let interrupted = false;
    let cleanup = () => {};
    
    const interrupt = () => { if (initializing) { interrupted = true; skipRef.current(); } };
    const removeInterrupts = () => {
      window.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("keydown", interrupt);
    };

    if (!media.matches) {
        import("gsap").then(({ gsap }) => {
          if (disposed) return;
          const context = gsap.context(() => {
            const hero = root.querySelectorAll("[data-hero]");
            gsap.set(hero, { opacity: 0, y: 30 });
            gsap.set(".genjutsu-mask", { scaleY: 0, transformOrigin: "bottom" });
            
            // Just setup the initial state of the animation elements
            gsap.set(".entry-grid-hz", { scaleX: 0 });
            gsap.set(".entry-grid-vt", { scaleY: 0 });
            gsap.set(".entry-name-first, .entry-name-last", { yPercent: 110, skewY: 5 });
            gsap.set(".entry-role", { opacity: 0, letterSpacing: "0.2em", filter: "blur(4px)", y: 15 });
            gsap.set(".entry-status-text", { opacity: 0 });
            
          }, root);

          cleanup = () => {
            context.revert();
            removeInterrupts();
          };
        }).catch(() => {});
    }

    return () => {
      disposed = true;
      cleanup();
    };
  }, [showSplash]);

  // Section Observer Setup (Runs universally outside splash logic)
  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.querySelector<HTMLElement>(".site-shell");
    if (!root || media.matches) return;
    
    let observers: IntersectionObserver[] = [];
    let cleanup = () => {};

    import("gsap").then(({ gsap }) => {
      const context = gsap.context(() => {
        const groups: [string, string, "mask" | "x" | "y" | "opacity"][] = [
          ["#work", ".work-header, .project-console", "mask"],
          ["#about", ".section-heading, .about-copy > p, .signature-row", "y"],
          ["#capabilities", ".section-heading, .expertise-grid article", "y"],
          ["#experience, #education", ".experience-row > *", "x"],
          ["#lab", ".section-heading, .lab-node", "opacity"],
          ["#principles", ".statement-line > *, .statement-meta", "mask"],
          ["#contact", ".contact-copy", "opacity"],
        ];
        
        const mobile = window.matchMedia("(max-width: 900px)").matches;
        groups.forEach(([section, selector, kind]) => {
          root.querySelectorAll<HTMLElement>(section).forEach((element) => {
            const els = element.querySelectorAll(selector);
            const observer = new IntersectionObserver(([entry]) => {
              if (!entry.isIntersecting) return;
              observer.disconnect();
              context.add(() => {
                gsap.fromTo(els, {
                  opacity: 0,
                  x: kind === "x" ? -30 : 0,
                  y: kind === "y" ? 30 : (kind === "mask" ? 30 : 0),
                  clipPath: kind === "mask" && !mobile ? "inset(20% 0 0 0)" : "inset(0)",
                }, {
                  opacity: 1, x: 0, y: 0, clipPath: "inset(0)",
                  duration: mobile ? MOTION.normal : MOTION.section,
                  stagger: mobile ? 0.04 : (kind === "mask" ? 0.1 : 0.08),
                  ease: "expo.out", clearProps: "all",
                });
              });
            }, { threshold: 0.15 });
            observer.observe(element);
            observers.push(observer);
          });
        });
      }, root);
      cleanup = () => {
        observers.forEach((o) => o.disconnect());
        context.revert();
      };
    });

    return () => cleanup();
  }, []);

  const handleInitialize = () => {
    if (initializing) return;
    setInitializing(true);
    soundEngine.relayClick();

    const root = document.querySelector<HTMLElement>(".site-shell");
    const intro = introRef.current;
    if (!root || !intro) {
      setShowSplash(false);
      return;
    }

    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { }

    import("gsap").then(({ gsap }) => {
      const hero = root.querySelectorAll("[data-hero]");
      const timeline = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      
      const finish = () => {
        timeline.kill();
        gsap.set(intro, { display: "none", autoAlpha: 0 });
        gsap.set(hero, { clearProps: "opacity,transform" });
        setShowSplash(false);
      };
      skipRef.current = finish;

      window.addEventListener("pointerdown", () => {
        if(timeline.progress() > 0.4) finish();
      }, { once: true, passive: true });

      // Immediate UI response to click
      timeline.to(".splash-btn-group", { autoAlpha: 0, y: -10, duration: 0.3, ease: "power2.in" }, 0);
      
      // Step 1: System Boot Sequence
      timeline.fromTo(".entry-status-text", { opacity: 0, filter: "blur(2px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2 }, 0.4);
      timeline.to(".entry-status .cursor-block", { opacity: 0, duration: 0.1, repeat: 2, yoyo: true }, 0.4);
      
      // Grid lines
      timeline.to(".entry-grid-hz", { scaleX: 1, duration: 0.6, stagger: 0.1, transformOrigin: "left", ease: "expo.out" }, 0.5);
      timeline.to(".entry-grid-vt", { scaleY: 1, duration: 0.6, stagger: 0.1, transformOrigin: "top", ease: "expo.out" }, 0.7);

      // Step 2: Name Reveal
      timeline.to(".entry-name-first", { yPercent: 0, skewY: 0, duration: 0.7, ease: "expo.out", stagger: 0.04 }, 0.9);
      timeline.to(".entry-name-last", { yPercent: 0, skewY: 0, duration: 0.7, ease: "expo.out", stagger: 0.04 }, 1.0);
      
      // Step 3: Role 
      timeline.to(".entry-role", { opacity: 1, letterSpacing: "0.05em", filter: "blur(0px)", y: 0, duration: 0.6, ease: "power2.out" }, 1.3);

      // Genjutsu Layer Reveal
      timeline.to(".genjutsu-mask.layer-1", { scaleY: 1, duration: 0.6, ease: "expo.inOut" }, 1.9);
      timeline.to(".genjutsu-mask.layer-2", { scaleY: 1, duration: 0.6, ease: "expo.inOut" }, 2.0);
      timeline.to(".genjutsu-mask.layer-3", { scaleY: 1, duration: 0.6, ease: "expo.inOut" }, 2.1);
      timeline.to(intro, { autoAlpha: 0, duration: 0.1 }, 2.7);
      
      // Step 5: Hero Entrance (Staggered continuous flow)
      timeline.to("[data-hero='name']", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.4);
      timeline.to("[data-hero='role']", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 2.5);
      timeline.to("[data-hero='position']", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 2.6);
      timeline.to("[data-hero='actions']", { opacity: 1, y: 0, duration: 0.5 }, 2.7);
      timeline.to("[data-hero='detail']", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, 2.7);
      
      timeline.call(finish, [], "+=0.1");
    });
  };

  if (!showSplash) return null;

  return (
    <div ref={introRef} className="portfolio-entry pointer-events-auto" aria-hidden={initializing ? "true" : "false"} style={{ display: "flex", background: "#0c0d0a", color: "#f4f3ee" }}>
      {/* Genjutsu Transitions */}
      <div className="genjutsu-mask layer-1 absolute inset-0 z-50 bg-[#161714] pointer-events-none" style={{ transform: "scaleY(0)" }} />
      <div className="genjutsu-mask layer-2 absolute inset-0 z-50 bg-[#e3c849] pointer-events-none" style={{ transform: "scaleY(0)" }} />
      <div className="genjutsu-mask layer-3 absolute inset-0 z-50 bg-[#f4f3ee] pointer-events-none" style={{ transform: "scaleY(0)" }} />
      
      {/* Decorative Grid Network */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20 pointer-events-none">
         <div className="entry-grid-hz absolute top-[25%] left-0 w-full h-[1px] bg-[#e3c849]" style={{ transform: "scaleX(0)" }} />
         <div className="entry-grid-hz absolute top-[50%] left-0 w-full h-[1px] bg-[#e3c849]" style={{ transform: "scaleX(0)" }} />
         <div className="entry-grid-hz absolute top-[75%] left-0 w-full h-[1px] bg-[#e3c849]" style={{ transform: "scaleX(0)" }} />
         <div className="entry-grid-vt absolute left-[25%] top-0 h-full w-[1px] bg-[#e3c849]" style={{ transform: "scaleY(0)" }} />
         <div className="entry-grid-vt absolute left-[50%] top-0 h-full w-[1px] bg-[#e3c849]" style={{ transform: "scaleY(0)" }} />
         <div className="entry-grid-vt absolute left-[75%] top-0 h-full w-[1px] bg-[#e3c849]" style={{ transform: "scaleY(0)" }} />
      </div>

      <div className="entry-top relative z-10 font-mono" style={{ color: "#666860" }}>
        <span>OS / SYSTEM_ID 48.02</span>
        <span>27.7172° N, 85.3240° E</span>
      </div>

      <div className="entry-center relative z-10 flex flex-col justify-center items-center h-full w-full max-w-[800px] m-auto overflow-hidden">
        
        {!initializing && (
          <div className="splash-btn-group flex flex-col items-center gap-6 z-20 absolute">
            <p className="font-mono text-[#a8aaa2] text-[10px] tracking-widest uppercase">
              Terminal Readiness Detected
            </p>
            <button 
              onClick={handleInitialize}
              className="premium-hover-card flex items-center justify-center gap-3 px-8 py-4 bg-[#e3c849] text-[#161714] font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-[6px_6px_0px_rgba(255,255,255,0.05)] hover:bg-[#fff]"
            >
              <span className="w-2 h-2 bg-[#161714] animate-pulse rounded-full" />
              Initialize Portfolio
            </button>
            <p className="font-mono text-[#666860] text-[9px] uppercase tracking-wide">
              Audio & WebGL Enabled
            </p>
          </div>
        )}

        <div className="w-full flex flex-col items-start" style={{ opacity: initializing ? 1 : 0, transition: "opacity 0.2s" }}>
            <p className="entry-status flex items-center gap-2 mb-10 font-mono text-xs text-[#e3c849]">
              <span className="cursor-block w-2 h-3.5 bg-[#e3c849] inline-block" />
              <span className="entry-status-text tracking-widest text-[#e3c849] opacity-0">SYSTEM INITIALIZATION STARTING...</span>
            </p>

            <div className="entry-mask overflow-hidden">
              <h2 className="entry-name m-0 font-bold leading-none tracking-tight" style={{ fontSize: "clamp(48px, 8vw, 96px)" }}>
                <div className="overflow-hidden inline-block border-none">
                    <span className="entry-name-first inline-block">RAMESH</span>
                </div>
                <br />
                <div className="overflow-hidden inline-block border-none">
                    <span className="entry-name-last inline-block">MAHARJAN</span><span className="entry-name-last inline-block text-[#c64c32]">.</span>
                </div>
              </h2>
            </div>

            <p className="entry-role tracking-widest mt-8 font-mono text-xs text-[#a8aaa2] opacity-0" style={{ letterSpacing: "0.2em", transform: "translateY(15px)" }}>
                [ FULL-STACK ENGINEER ]
            </p>
        </div>

      </div>

      <div className="entry-bottom relative z-10 font-mono" style={{ color: "#666860", textTransform: "uppercase" }}>
        <span>ARCHITECT / ASSEMBLE / DEPLOY</span>
        <span style={{ color: initializing ? "#e3c849" : "#666860" }}>
          {initializing ? "ENVIRONMENT LOADING" : "STANDBY"}
        </span>
      </div>
    </div>
  );
}
