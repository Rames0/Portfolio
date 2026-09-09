"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
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
              gsap.set(hero, { opacity: 0, y: 16 });
              
              const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
              const finish = () => {
                timeline.kill();
                gsap.set(intro, { display: "none", autoAlpha: 0 });
                gsap.set(hero, { clearProps: "opacity,transform" });
                removeInterrupts();
              };
              skipRef.current = finish;

              // Step 1: System Boot Text
              timeline.to(".entry-status .cursor-block", { opacity: 0, duration: 0.1, repeat: 3, yoyo: true }, 0);
              timeline.fromTo(".entry-status-text", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.4);
              
              // Step 2: Diagnostic Lines / Terminal Rule
              timeline.fromTo(".entry-rule-top", { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 0.6, ease: "expo.inOut" }, 0.6);
              timeline.fromTo(".entry-rule-bottom", { scaleX: 0 }, { scaleX: 1, transformOrigin: "right", duration: 0.6, ease: "expo.inOut" }, 0.7);
              
              // Step 3: Name Reveal
              timeline.fromTo(".entry-name span, .entry-name-first", { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.05 }, 1.1);
              
              // Step 4: Role 
              timeline.fromTo(".entry-role", { opacity: 0, filter: "blur(4px)", y: 10 }, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.6, ease: "power1.out" }, 1.5);
              
              // Step 5: Screen Wipe
              timeline.to(intro, { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "expo.inOut" }, 2.4);
              
              // Step 6: Hero Entrance
              timeline.to("[data-hero='name']", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 2.9);
              timeline.to("[data-hero='role']", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 3.1);
              timeline.to("[data-hero='position']", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 3.2);
              timeline.to("[data-hero='actions']", { opacity: 1, y: 0, duration: 0.5 }, 3.4);
              timeline.to("[data-hero='detail']", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, 3.2);
              
              timeline.call(finish);
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
                const targets = element.querySelectorAll(selector);
                const observer = new IntersectionObserver(([entry]) => {
                  if (!entry.isIntersecting) return;
                  observer.disconnect();
                  context.add(() => {
                    gsap.fromTo(targets, {
                      opacity: 0,
                      x: kind === "x" ? -16 : 0,
                      y: kind === "y" ? 20 : (kind === "mask" ? 20 : 0),
                      clipPath: kind === "mask" && !mobile ? "inset(0 0 20% 0)" : "inset(0)",
                    }, {
                      opacity: 1, x: 0, y: 0, clipPath: "inset(0)",
                      duration: mobile ? MOTION.normal : MOTION.section,
                      stagger: mobile ? 0.04 : (kind === "mask" ? 0.1 : 0.08),
                      ease: "power2.out", clearProps: "all",
                    });
                  });
                }, { threshold: 0.1 });
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
    <div ref={introRef} className="portfolio-entry" aria-hidden="true" style={{ background: "#0c0d0a", color: "#f4f3ee" }}>
      <div className="entry-top" style={{ color: "#666860" }}>
        <span>OS / SYSTEM CORE INIT</span>
        <span>27.7172° N, 85.3240° E</span>
      </div>
      <div className="entry-center" style={{ position: "relative", width: "min(800px, 100%)", margin: "auto", overflow: "hidden" }}>
        
        <p className="entry-status" style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 40px", font: "500 12px var(--font-geist-mono)", color: "#e3c849" }}>
          <span className="cursor-block" style={{ width: "8px", height: "14px", backgroundColor: "#e3c849", display: "inline-block" }}></span>
          <span className="entry-status-text">SYSTEM INITIALIZATION STARTED...</span>
        </p>

        <div className="entry-rule-top" style={{ height: "1px", background: "rgba(255,255,255,0.1)", marginBottom: "32px", width: "100%" }} />

        <div className="entry-mask" style={{ overflow: "hidden" }}>
          <h2 className="entry-name" style={{ margin: "0", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: "800", lineHeight: "1", letterSpacing: "-0.02em" }}>
            <div style={{ overflow: "hidden", display: "inline-block" }}>
                <span className="entry-name-first" style={{ display: "inline-block" }}>RAMESH</span>
            </div>
            <br />
            <div style={{ overflow: "hidden", display: "inline-block" }}>
                <span style={{ display: "inline-block" }}>MAHARJAN</span><span style={{ color: "#c64c32", display: "inline-block" }}>.</span>
            </div>
          </h2>
        </div>

        <p className="entry-role" style={{ margin: "32px 0 0", font: "600 14px var(--font-geist-mono)", color: "#a8aaa2" }}>
            [ FULL-STACK ENGINEER ] / HYBRID TECHNOLOGIST
        </p>

        <div className="entry-rule-bottom" style={{ height: "1px", background: "rgba(255,255,255,0.1)", marginTop: "32px", width: "100%" }} />

      </div>
      <div className="entry-bottom" style={{ color: "#666860", textTransform: "uppercase" }}>
        <span>ARCHITECT / ASSEMBLE / DEPLOY</span>
        <span style={{ color: "#e3c849" }}>ENVIRONMENT LOADED</span>
      </div>
    </div>
  );
}
