"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border)]" : "bg-transparent border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-20">
        <a href="#top" className="text-[var(--text-primary)] font-semibold tracking-tight text-lg">
          Ramesh<span className="text-[var(--accent)]">.</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
          <a href="#work" className="hover:text-[var(--text-primary)] transition-colors">Work</a>
          <a href="#about" className="hover:text-[var(--text-primary)] transition-colors">About</a>
          <a href="#lab" className="hover:text-[var(--text-primary)] transition-colors">Lab</a>
        </nav>

        <a href="#contact" className="hidden md:inline-flex button-primary py-2 px-5 text-xs">
          Let's Talk
        </a>

        {/* Mobile Menu Toggle placeholder */}
        <button className="md:hidden text-[var(--text-primary)]">
          Menu
        </button>
      </div>
    </motion.header>
  );
}
