"use client";

import { useLayoutEffect } from "react";
import { MOTION } from "@/lib/motion";

/**
 * PortfolioMotion:
 * Instantaneous initial render with zero artificial blocking loaders or fake boot screens.
 * Provides subtle, hardware-accelerated intersection reveals for sections as the user scrolls.
 */
export function PortfolioMotion() {
  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const root = document.querySelector<HTMLElement>(".site-shell");
    if (!root) return;

    let cleanup = () => {};

    import("gsap")
      .then(({ gsap }) => {
        if (media.matches) return;

        const observers: IntersectionObserver[] = [];
        const context = gsap.context(() => {
          const groups: [string, string][] = [
            ["#work", ".section-heading, .case-study-showcase"],
            ["#philosophy", ".section-heading, .philosophy-card"],
            ["#stack", ".section-heading, .stack-category-card"],
            ["#experience", ".section-heading, .timeline-card"],
            ["#systems-lab", ".section-heading, .lab-container"],
            ["#contact", ".contact-info, .contact-form-card"],
          ];

          groups.forEach(([section, selector]) => {
            root.querySelectorAll<HTMLElement>(section).forEach((element) => {
              const targets = element.querySelectorAll(selector);
              if (targets.length === 0) return;

              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (!entry.isIntersecting) return;
                  observer.disconnect();
                  context.add(() => {
                    gsap.fromTo(
                      targets,
                      { opacity: 0, y: 16 },
                      {
                        opacity: 1,
                        y: 0,
                        duration: MOTION.normal,
                        stagger: 0.08,
                        ease: "power2.out",
                        clearProps: "all",
                      },
                    );
                  });
                },
                { threshold: 0.08 },
              );
              observer.observe(element);
              observers.push(observer);
            });
          });
        }, root);

        cleanup = () => {
          observers.forEach((obs) => obs.disconnect());
          context.revert();
        };
      })
      .catch(() => {});

    return () => {
      cleanup();
    };
  }, []);

  // No blocking overlay: renders null for instant first paint
  return null;
}
