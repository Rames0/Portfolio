"use client";

import { useEffect } from "react";

/**
 * PortfolioMotion:
 * Smooth, hardware-accelerated intersection reveals for content cards and sections as the user scrolls.
 * Creates a slow, luxurious cascading reveal effect as each element scrolls into view.
 */
export function PortfolioMotion() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      ".platform-card, .journey-card, .service-unit, .stat-box, .contact-card-sidebar, .contact-form-box",
    );

    if (
      targets.length === 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const windowHeight = window.innerHeight;

    targets.forEach((el, index) => {
      el.classList.add("scroll-reveal-item");
      const staggerIndex = index % 3;
      el.style.transitionDelay = `${staggerIndex * 110}ms`;

      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight * 0.9) {
        el.classList.add("is-revealed");
      }
    });

    if (typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    targets.forEach((el) => {
      if (!el.classList.contains("is-revealed")) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
