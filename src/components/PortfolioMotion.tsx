"use client";

import { useLayoutEffect, useRef } from "react";
import { MOTION } from "@/lib/motion";

const SESSION_KEY = "rm-entry-v1";

export function PortfolioMotion() {
  const introRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.querySelector<HTMLElement>(".site-shell");
    const intro = introRef.current;
    if (!root || !intro) return;
    let disposed = false;
    let interrupted = false;
    let cleanup = () => {};
    const interrupt = () => { interrupted = true; skipRef.current(); };
    const removeInterrupts = () => {
      window.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("keydown", interrupt);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
    };
    window.addEventListener("pointerdown", interrupt, { passive: true });
    window.addEventListener("keydown", interrupt);
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });

    if (!media.matches) {
        import("gsap").then(({ gsap }) => {
          if (disposed || media.matches) return;
          let seen = false;
          try { seen = sessionStorage.getItem(SESSION_KEY) === "1"; } catch { }
          const playIntro = !seen && !interrupted && !location.hash && window.scrollY < 20;
          const observers: IntersectionObserver[] = [];
          const context = gsap.context(() => {
            if (playIntro) {
              try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { }
              const hero = root.querySelectorAll("[data-hero]");
              gsap.set(intro, { display: "flex", autoAlpha: 1 });
              gsap.set(".genjutsu-mask", { scaleY: 0, transformOrigin: "bottom" });
              gsap.set(hero, { opacity: 0, y: 30 });
              
              const timeline = gsap.timeline({ defaults: { ease: "power3.inOut" } });
              const finish = () => {
                timeline.kill();
                gsap.set(intro, { display: "none", autoAlpha: 0 });
                gsap.set(hero, { clearProps: "opacity,transform" });
                removeInterrupts();
              };
              skipRef.current = finish;

              // Grid initialization lines
              timeline.fromTo(".entry-grid-hz", { scaleX: 0 }, { scaleX: 1, duration: 0.6, stagger: 0.1, transformOrigin: "left", ease: "expo.out" }, 0);
              timeline.fromTo(".entry-grid-vt", { scaleY: 0 }, { scaleY: 1, duration: 0.6, stagger: 0.1, transformOrigin: "top", ease: "expo.out" }, 0.2);

              // Step 1: System Boot Text
              timeline.to(".entry-status .cursor-block", { opacity: 0, duration: 0.1, repeat: 2, yoyo: true }, 0.4);
              timeline.fromTo(".entry-status-text", { opacity: 0, filter: "blur(2px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2 }, 0.6);
              
              // Step 2: Name Reveal (Controlled mask reveal)
              timeline.fromTo(".entry-name-first", { yPercent: 110, skewY: 5 }, { yPercent: 0, skewY: 0, duration: 0.7, ease: "expo.out", stagger: 0.04 }, 0.9);
              timeline.fromTo(".entry-name-last", { yPercent: 110, skewY: 5 }, { yPercent: 0, skewY: 0, duration: 0.7, ease: "expo.out", stagger: 0.04 }, 1.0);
              
              // Step 3: Role 
              timeline.fromTo(".entry-role", { opacity: 0, letterSpacing: "0.2em", filter: "blur(4px)", y: 15 }, { opacity: 1, letterSpacing: "0.05em", filter: "blur(0px)", y: 0, duration: 0.6, ease: "power2.out" }, 1.3);

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
            } else {
              removeInterrupts();
            }

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
            observers.forEach((observer) => observer.disconnect());
            context.revert();
            intro.style.display = "none";
            skipRef.current = () => {};
          };
        }).catch(() => {});
    }

    const reduce = () => { if (media.matches) cleanup(); };
    media.addEventListener("change", reduce);
    return () => {
      disposed = true;
      cleanup();
      media.removeEventListener("change", reduce);
      removeInterrupts();
    };
  }, []);

  return (
    <div ref={introRef} className="portfolio-entry pointer-events-auto" aria-hidden="true" style={{ background: "#0c0d0a", color: "#f4f3ee" }}>
      {/* Genjutsu Transitions */}
      <div className="genjutsu-mask layer-1 absolute inset-0 z-50 bg-[#161714] pointer-events-none" />
      <div className="genjutsu-mask layer-2 absolute inset-0 z-50 bg-[#e3c849] pointer-events-none" />
      <div className="genjutsu-mask layer-3 absolute inset-0 z-50 bg-[#f4f3ee] pointer-events-none" />
      
      {/* Decorative Grid Network */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20 pointer-events-none">
         <div className="entry-grid-hz absolute top-[25%] left-0 w-full h-[1px] bg-[#e3c849]" />
         <div className="entry-grid-hz absolute top-[50%] left-0 w-full h-[1px] bg-[#e3c849]" />
         <div className="entry-grid-hz absolute top-[75%] left-0 w-full h-[1px] bg-[#e3c849]" />
         <div className="entry-grid-vt absolute left-[25%] top-0 h-full w-[1px] bg-[#e3c849]" />
         <div className="entry-grid-vt absolute left-[50%] top-0 h-full w-[1px] bg-[#e3c849]" />
         <div className="entry-grid-vt absolute left-[75%] top-0 h-full w-[1px] bg-[#e3c849]" />
      </div>

      <div className="entry-top relative z-10" style={{ color: "#666860" }}>
        <span>OS / SYSTEM CORE INIT</span>
        <span>27.7172° N, 85.3240° E</span>
      </div>
      <div className="entry-center relative z-10" style={{ position: "relative", width: "min(800px, 100%)", margin: "auto", overflow: "hidden" }}>
        
        <p className="entry-status" style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 40px", font: "500 12px var(--font-geist-mono)", color: "#e3c849" }}>
          <span className="cursor-block" style={{ width: "8px", height: "14px", backgroundColor: "#e3c849", display: "inline-block" }}></span>
          <span className="entry-status-text tracking-widest text-[#e3c849]">INITIALIZING PORTFOLIO</span>
        </p>

        <div className="entry-mask" style={{ overflow: "hidden" }}>
          <h2 className="entry-name" style={{ margin: "0", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: "800", lineHeight: "1", letterSpacing: "-0.02em" }}>
            <div style={{ overflow: "hidden", display: "inline-block" }}>
                <span className="entry-name-first" style={{ display: "inline-block" }}>RAMESH</span>
            </div>
            <br />
            <div style={{ overflow: "hidden", display: "inline-block" }}>
                <span className="entry-name-last" style={{ display: "inline-block" }}>MAHARJAN</span><span className="entry-name-last" style={{ color: "#c64c32", display: "inline-block" }}>.</span>
            </div>
          </h2>
        </div>

        <p className="entry-role tracking-widest" style={{ margin: "32px 0 0", font: "600 12px var(--font-geist-mono)", color: "#a8aaa2" }}>
            [ FULL-STACK ENGINEER ]
        </p>

      </div>
      <div className="entry-bottom relative z-10" style={{ color: "#666860", textTransform: "uppercase" }}>
        <span>ARCHITECT / ASSEMBLE / DEPLOY</span>
        <span style={{ color: "#e3c849" }}>ENVIRONMENT LOADED</span>
      </div>
    </div>
  );
}
