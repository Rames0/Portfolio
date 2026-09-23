"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import profilePic from "../../public/Profile.jpeg";
import ambienceImg from "../../public/Ambience.png";
import gwpImg from "../../public/GWP.png";
import kansaiImg from "../../public/Kansai.png";
import lucazImg from "../../public/Lucaz.png";
import rakminaImg from "../../public/Rakmina.png";
import samImg from "../../public/Sam.png";
import faviconSvg from "../../public/favicon.svg";

import { AntigravityBackground } from "@/components/AntigravityBackground";
import { ErgonomicMobileDock } from "@/components/ErgonomicMobileDock";
import { FloatingTechIcons } from "@/components/FloatingTechIcons";
import { PortfolioEntrance } from "@/components/WelcomeLanding";
import { LightningPortrait } from "@/components/LightningPortrait";
import { PortfolioMotion } from "@/components/PortfolioMotion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrollTypewriter } from "@/components/ScrollTypewriter";

const featuredPlatforms = [
  {
    category: "HOSPITALITY & REAL-TIME CONCURRENCY",
    title: "Lucazsoft POS",
    subtitle: "High-Pressure Restaurant Operating Engine",
    image: lucazImg,
    tags: [
      "Laravel 11",
      "MariaDB ACID",
      "Node.js WebSockets",
      "Local-First Queue",
    ],
    desc: "Engineered high-concurrency restaurant point-of-sale architecture with sub-5ms duplex WebSocket kitchen dispatch synchronization, touch-optimized ergonomics, and atomic offline write buffers to withstand intermittent network drops.",
    link: "https://lucazsoft.com/login",
  },
  {
    category: "ENTERPRISE CORPORATE PLATFORM",
    title: "Ambience Infosys",
    subtitle: "Corporate Software & Engineering Solutions Portal",
    image: ambienceImg,
    tags: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "RSC Streaming",
    ],
    desc: "Designed and engineered enterprise services showcase with server components streaming, zero runtime layout shift (0.00 CLS), and 100 Lighthouse performance scores under heavy corporate traffic.",
    link: "https://ambienceinfosys.com.np/",
  },
  {
    category: "MULTILINGUAL ACADEMIC DIRECTORY",
    title: "Rakmina Consultancy",
    subtitle: "Multilingual Global Academic Directory",
    image: rakminaImg,
    tags: [
      "Laravel",
      "PostgreSQL tsvector",
      "GIN Search Index",
      "i18n (8 Locales)",
    ],
    desc: "Constructed an 8-locale international study advisory directory with dynamic header-negotiated translation routes and deep parametric full-text search indexing powered by PostgreSQL tsvector (sub-15ms resolution).",
    link: "https://rakmina.nirc.com.np/",
  },
  {
    category: "CIVIC PUBLIC INFRASTRUCTURE",
    title: "GWP (Government Web Portal)",
    subtitle: "Consolidated Municipal Digital Administration",
    image: gwpImg,
    tags: [
      "Java",
      "Grails MVC",
      "Spring Security RBAC",
      "WCAG 2.1 AA",
      "MariaDB",
    ],
    desc: "Constructed accessible, high-trust digital portal uniting 50+ municipal public services for citizens, featuring Spring Security RBAC authorization filters, document intake state machines, and tamper-evident receipt logging.",
    link: "https://github.com/Rames0",
  },
  {
    category: "EDUCATION & ADMISSIONS PORTAL",
    title: "Kansai Japanese Language School",
    subtitle: "Academic Advisory & Course Enrollment Portal",
    image: kansaiImg,
    tags: ["Laravel", "MariaDB", "Tailwind CSS", "Alpine.js"],
    desc: "Architected frictionless multi-step admissions funnel with client-side field validation, asynchronous document verification, and transactional student intake cohorts.",
    link: "https://kansaijapaneselanguage.com.np/",
  },
  {
    category: "EXPERIMENTAL 3D & KINETIC WEB",
    title: "Sam Maharjan Creative Folio",
    subtitle: "Experimental Creative Technologist Folio",
    image: samImg,
    tags: ["Next.js 16", "Three.js", "WebGL Shaders", "Framer Motion"],
    desc: "Engineered an interactive digital portfolio featuring real-time 3D vertex displacement shaders, compositor-thread motion physics, and strict low-power fallbacks maintaining stable 60fps.",
    link: "https://sammaharjan.com.np/home/",
  },
];

const capabilities = [
  {
    index: "01",
    icon: "fa-solid fa-code",
    title: "Modern Web Engineering",
    desc: "Architecting high-performance web applications using Next.js 16, React 19, TypeScript, and modern Tailwind design systems. Built to endure high traffic with zero layout shifts.",
  },
  {
    index: "02",
    icon: "fa-solid fa-microchip",
    title: "Systems & API Architecture",
    desc: "Engineering scalable application backends with Node.js, Laravel 11, and Java/Grails MVC. Designing duplex WebSockets and resilient offline-first write queues.",
  },
  {
    index: "03",
    icon: "fa-solid fa-database",
    title: "Relational Schemas & ACID Locks",
    desc: "Structuring relational databases with PostgreSQL and MariaDB. Implementing tsvector full-text search, GIN indexes, and row-level locking for zero transaction corruption.",
  },
  {
    index: "04",
    icon: "fa-solid fa-layer-group",
    title: "UI/UX Design Systems",
    desc: "Creating systematic design languages in Figma. Translating tokens into pixel-accurate code with strict adherence to human ergonomics and WCAG 2.1 AA accessibility.",
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const header = document.getElementById("site-header");
    const progress = document.getElementById("scroll-progress");
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav-link"));

    let shownProgress = 0;
    let rafId = 0;

    const onScroll = () => {
      const winSmooth = (window as unknown as { Smooth?: { state?: { scroll: number; progress: number } } }).Smooth;
      const S = winSmooth?.state;
      const y = S ? S.scroll : window.scrollY;
      if (header) {
        header.classList.toggle("is-scrolled", y > 10);
      }
      const target = S
        ? S.progress
        : (() => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            return max > 0 ? Math.min(1, y / max) : 0;
          })();
      shownProgress += (target - shownProgress) * 0.15;
      if (progress) {
        progress.style.transform = `scaleX(${shownProgress.toFixed(4)})`;
      }
      rafId = requestAnimationFrame(onScroll);
    };
    rafId = requestAnimationFrame(onScroll);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    // Active nav link highlight
    const sections = navLinks
      .map((a) => {
        const href = a.getAttribute("href");
        return href ? document.querySelector<HTMLElement>(href) : null;
      })
      .filter(Boolean) as HTMLElement[];

    const updateActiveNav = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      if (scrollY + winHeight >= docHeight - 70) {
        navLinks.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === "#contact")
        );
        return;
      }

      if (scrollY < 180) {
        navLinks.forEach((a) => a.classList.remove("is-active"));
        return;
      }

      let currentId = "";
      for (const sec of sections) {
        const top = sec.getBoundingClientRect().top;
        if (top <= 140) {
          currentId = sec.id;
        }
      }

      if (currentId) {
        navLinks.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === `#${currentId}`)
        );
      }
    };

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", updateActiveNav);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const winSmooth = (window as unknown as { Smooth?: { scrollTo: (target: string) => void } }).Smooth;
    if (winSmooth?.scrollTo) {
      winSmooth.scrollTo(href);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    history.replaceState(null, "", href);
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav-link"));
    navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === href));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("mhrjan0@gmail.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1800);
    } catch {
      window.location.href = "mailto:mhrjan0@gmail.com";
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
      setFormStatus("Please fill in your name, a valid email, and a message.");
      return;
    }

    setIsSubmitting(true);
    setFormStatus("Transmitting…");

    try {
      window.location.href = `mailto:mhrjan0@gmail.com?subject=${encodeURIComponent(
        subject || "Portfolio Inquiry",
      )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      setFormStatus("✓ Prepared draft in your email client. Send to complete!");
      form.reset();
    } catch {
      setFormStatus("Could not open email client. Please email mhrjan0@gmail.com directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortfolioEntrance>
      {/* 3D WebGL Background Canvas & Glow */}
      <AntigravityBackground />
      <div id="scroll-progress" className="scroll-progress" aria-hidden="true" />
      <div id="cursor-glow" className="cursor-glow" aria-hidden="true" />

      {/* Tilt, Skew, GSAP Scroll Scenes */}
      <PortfolioMotion />

      {/* Main Site Container */}
      <div id="site" className="site">
        {/* Header */}
        <header className="site-header" id="site-header">
          <div className="container header-inner">
            <a
              href="#hero"
              className="brand"
              aria-label="Ramesh Maharjan — Home"
              onClick={(e) => handleNavClick(e, "#hero")}
            >
              <span className="brand-logo tilt-3d" data-tilt>
                <Image src={faviconSvg} alt="" width={38} height={38} priority />
              </span>
              <span className="brand-text">
                <strong>Ramesh Maharjan</strong>
                <small>Full-Stack Developer</small>
              </span>
            </a>

            <nav
              className={`site-nav ${mobileMenuOpen ? "is-open" : ""}`}
              id="site-nav"
              aria-label="Main navigation"
            >
              <a href="#work" className="nav-link" onClick={(e) => handleNavClick(e, "#work")}>
                <span data-text="Work">Work</span>
              </a>
              <a href="#experience" className="nav-link" onClick={(e) => handleNavClick(e, "#experience")}>
                <span data-text="Experience">Experience</span>
              </a>
              <a href="#capabilities" className="nav-link" onClick={(e) => handleNavClick(e, "#capabilities")}>
                <span data-text="Capabilities">Capabilities</span>
              </a>
              <a href="#stack" className="nav-link" onClick={(e) => handleNavClick(e, "#stack")}>
                <span data-text="Stack">Stack</span>
              </a>
              <a href="#contact" className="nav-link" onClick={(e) => handleNavClick(e, "#contact")}>
                <span data-text="Contact">Contact</span>
              </a>
            </nav>

            <div className="header-actions">
              <ThemeToggle />
              <a
                href="#contact"
                className="btn btn-outline btn-sm hide-mobile"
                onClick={(e) => handleNavClick(e, "#contact")}
              >
                <i className="fa-solid fa-paper-plane" />
                <span>Hire Me</span>
              </a>
              <button
                type="button"
                className="menu-toggle"
                id="menu-toggle"
                aria-expanded={mobileMenuOpen}
                aria-controls="site-nav"
                aria-label="Toggle navigation menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div
            className="nav-backdrop"
            aria-hidden="true"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main id="main">
          {/* ============ HERO ============ */}
          <section className="hero" id="hero">
            <div className="container hero-grid">
              <div className="hero-copy" data-reveal="left">
                <div className="status-pill">
                  <span className="status-dot" />
                  <span>AVAILABLE FOR COMMISSIONS · KATHMANDU, NEPAL</span>
                </div>

                <h1 className="hero-title">
                  <span className="title-3d" data-depth>
                    Architecting
                  </span>
                  <span className="title-3d gradient-text" data-depth>
                    resilient web systems
                  </span>
                  <span className="title-3d" data-depth>
                    with modern craft.
                  </span>
                </h1>

                <ScrollTypewriter
                  as="p"
                  className="hero-sub"
                  text="I'm Ramesh Maharjan — Full-Stack Developer & UI/UX Designer at NIRC Nepal. I specialize in building high-performance web applications, combining transactional relational data integrity (PostgreSQL & MariaDB ACID row locks) with fluid, human-centered interfaces (Next.js 16, React 19, TypeScript, Tailwind CSS)."
                  speed={16}
                  delay={180}
                />

                <div className="hero-actions">
                  <a href="#work" className="btn btn-primary btn-3d">
                    <i className="fa-solid fa-layer-group" />
                    <span>Explore Selected Work</span>
                  </a>
                  <a href="#contact" className="btn btn-outline btn-3d">
                    <i className="fa-solid fa-envelope" />
                    <span>Get in Touch</span>
                  </a>
                  <a
                    href="https://github.com/Rames0"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-3d"
                  >
                    <i className="fa-brands fa-github" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>

              <div className="hero-visual" data-reveal="right">
                <div className="portrait-scene" id="portrait-scene">
                  <LightningPortrait
                    image={profilePic}
                    alt="Ramesh Maharjan — Full-Stack Developer"
                    name="RAMESH MAHARJAN"
                    location="KATHMANDU, NEPAL"
                  />
                  <div className="portrait-orbit orbit-a" aria-hidden="true" />
                  <div className="portrait-orbit orbit-b" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="container">
              <ul className="stats-strip" aria-label="Key statistics">
                <li className="stat-cube" data-reveal="up">
                  <div className="stat-cube-inner">
                    <div className="stat-face stat-front">
                      <span className="val">06+</span>
                      <span className="desc">Shipped Production Web Applications</span>
                    </div>
                    <div className="stat-face stat-back">
                      <i className="fa-solid fa-rocket" />
                      <span className="desc">From POS engines to civic portals</span>
                    </div>
                  </div>
                </li>
                <li className="stat-cube" data-reveal="up">
                  <div className="stat-cube-inner">
                    <div className="stat-face stat-front">
                      <span className="val">BCA</span>
                      <span className="desc">Tribhuvan University Graduate (2020–2025)</span>
                    </div>
                    <div className="stat-face stat-back">
                      <i className="fa-solid fa-graduation-cap" />
                      <span className="desc">Bachelor of Computer Applications</span>
                    </div>
                  </div>
                </li>
                <li className="stat-cube" data-reveal="up">
                  <div className="stat-cube-inner">
                    <div className="stat-face stat-front">
                      <span className="val">2024–</span>
                      <span className="desc">NIRC Nepal Full-Stack &amp; UI/UX Leadership</span>
                    </div>
                    <div className="stat-face stat-back">
                      <i className="fa-solid fa-briefcase" />
                      <span className="desc">Nepal Incubation &amp; Research Center</span>
                    </div>
                  </div>
                </li>
                <li className="stat-cube" data-reveal="up">
                  <div className="stat-cube-inner">
                    <div className="stat-face stat-front">
                      <span className="val">100%</span>
                      <span className="desc">High-Reliability SLAs &amp; ACID Data Integrity</span>
                    </div>
                    <div className="stat-face stat-back">
                      <i className="fa-solid fa-shield-halved" />
                      <span className="desc">Zero transaction corruption</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <a href="#work" className="scroll-hint" aria-label="Scroll to selected work">
              <span className="mouse">
                <span />
              </span>
            </a>
          </section>

          {/* ============ WORK ============ */}
          <section className="section" id="work">
            <div className="container">
              <header className="section-head" data-reveal="up">
                <p className="section-tag">
                  <span className="line" />01 · SELECTED WORK
                </p>
                <h2 className="section-title">Production Platforms &amp; Systems</h2>
                <ScrollTypewriter
                  as="p"
                  className="section-lead"
                  text="Mission-critical applications engineered for sub-second delivery, relational data integrity, and high-concurrency environments. Hover a card to move it in 3D."
                  speed={18}
                  delay={100}
                />
              </header>

              <div className="projects-grid">
                {featuredPlatforms.map((project, idx) => (
                  <article
                    key={project.title}
                    className="project-card"
                    data-tilt
                    data-tilt-max="10"
                    data-tilt-glare
                    data-reveal="up"
                  >
                    <div className="project-thumb" data-layer="30">
                      <Image
                        src={project.image}
                        alt={`${project.title} screenshot`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
                        className="object-cover"
                        priority={idx === 0}
                      />
                    </div>
                    <div className="project-body">
                      <span className="project-kicker">{project.category}</span>
                      <div className="tag-row">
                        {project.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <h3 data-layer="20">{project.title}</h3>
                      <p className="project-sub">{project.subtitle}</p>
                      <p className="project-desc">{project.desc}</p>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link"
                      >
                        View Project <i className="fa-solid fa-arrow-up-right" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ============ EXPERIENCE ============ */}
          <section className="section" id="experience">
            <div className="container">
              <header className="section-head" data-reveal="up">
                <p className="section-tag">
                  <span className="line" />02 · CAREER TIMELINE
                </p>
                <h2 className="section-title">Professional Experience &amp; Education</h2>
                <ScrollTypewriter
                  as="p"
                  className="section-lead"
                  text="Engineering leadership, design craftsmanship, and rigorous theoretical foundations in computer applications."
                  speed={20}
                  delay={100}
                />
              </header>

              <div className="timeline">
                <div className="timeline-spine" aria-hidden="true" />

                <article className="journey-card" data-tilt data-tilt-max="6" data-reveal="left">
                  <span className="journey-node" aria-hidden="true" />
                  <span className="journey-badge">
                    <i className="fa-solid fa-briefcase" /> 2024 — PRESENT · ACTIVE EMPLOYMENT
                  </span>
                  <h3>Full-Stack Developer</h3>
                  <p className="journey-org">Nepal Incubation &amp; Research Center (NIRC Nepal)</p>
                  <ul className="journey-bullets">
                    <li>
                      Leading full-stack architecture and UI/UX design across 6+ production web
                      systems and enterprise client platforms.
                    </li>
                    <li>
                      Architected local-first restaurant POS with sub-5ms duplex WebSocket sync and
                      zero-loss offline order queues.
                    </li>
                    <li>
                      Engineered multi-locale study advisory directory with PostgreSQL GIN/tsvector
                      search and sub-15ms query resolution.
                    </li>
                    <li>
                      Designed accessible civic portal unifying 50+ municipal public services using
                      Java / Grails MVC.
                    </li>
                    <li>
                      Created design tokens and interactive Figma components, translating design
                      systems into pixel-accurate code.
                    </li>
                  </ul>
                </article>

                <article className="journey-card" data-tilt data-tilt-max="6" data-reveal="right">
                  <span className="journey-node" aria-hidden="true" />
                  <span className="journey-badge">
                    <i className="fa-solid fa-graduation-cap" /> 2020 — 2025 · ACADEMIC FOUNDATION
                  </span>
                  <h3>Bachelor of Computer Applications (BCA)</h3>
                  <p className="journey-org">Tribhuvan University, Nepal</p>
                  <ul className="journey-bullets">
                    <li>
                      Comprehensive graduation curriculum covering Relational Database Management
                      Systems, normalization, and ACID concurrency.
                    </li>
                    <li>
                      Advanced coursework in Data Structures, Algorithms, Software Engineering
                      methodologies, and Unix/Linux OS concepts.
                    </li>
                    <li>
                      Engineered practical academic web systems emphasizing W3C standards compliance
                      and modular software architecture.
                    </li>
                    <li>
                      Solidified theoretical foundations in computer networking, cryptography
                      protocols, and systems analysis.
                    </li>
                  </ul>
                </article>
              </div>
            </div>
          </section>

          {/* ============ CAPABILITIES ============ */}
          <section className="section" id="capabilities">
            <div className="container">
              <header className="section-head" data-reveal="up">
                <p className="section-tag">
                  <span className="line" />03 · CORE DISCIPLINES
                </p>
                <h2 className="section-title">Engineering Pillars &amp; Capabilities</h2>
                <ScrollTypewriter
                  as="p"
                  className="section-lead"
                  text="The foundational disciplines I bring to architecting, designing, and scaling digital products. Hover (or tap) a card to flip it."
                  speed={18}
                  delay={100}
                />
              </header>

              <div className="flip-grid">
                {capabilities.map((cap) => (
                  <article key={cap.index} className="flip-card" data-reveal="up" tabIndex={0}>
                    <div className="flip-inner">
                      <div className="flip-face flip-front">
                        <span className="flip-index">{cap.index}</span>
                        <span className="flip-icon">
                          <i className={cap.icon} />
                        </span>
                        <h3>{cap.title}</h3>
                        <span className="flip-hint">
                          Flip <i className="fa-solid fa-rotate" />
                        </span>
                      </div>
                      <div className="flip-face flip-back">
                        <p>{cap.desc}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ============ STACK ============ */}
          <section className="section" id="stack">
            <div className="container">
              <header className="section-head" data-reveal="up">
                <p className="section-tag">
                  <span className="line" />04 · PRODUCTION TOOLCHAIN
                </p>
                <h2 className="section-title">Battle-Tested Technologies &amp; Tools</h2>
                <ScrollTypewriter
                  as="p"
                  className="section-lead"
                  text="The production stack I leverage daily to design, build, test, and ship resilient digital systems. Drag or move your cursor to spin the 3D sphere."
                  speed={18}
                  delay={100}
                />
              </header>

              <FloatingTechIcons />
            </div>
          </section>

          {/* ============ CONTACT ============ */}
          <section className="section" id="contact">
            <div className="container contact-grid">
              <aside className="contact-side" data-reveal="left">
                <p className="section-tag">
                  <span className="line" />05 · DIRECT CONTACT
                </p>
                <h2 className="section-title">
                  Let&apos;s build something <span className="gradient-text">exceptional</span>{" "}
                  together.
                </h2>
                <ScrollTypewriter
                  as="p"
                  className="section-lead"
                  text="Have a mission-critical platform to architect, an engineering opportunity, or a complex UI/UX challenge? Reach out directly below."
                  speed={18}
                  delay={100}
                />

                <button
                  type="button"
                  className="email-copy glass"
                  id="copy-email"
                  aria-label="Copy email address"
                  onClick={copyEmail}
                >
                  <span>
                    <i className="fa-solid fa-envelope" /> mhrjan0@gmail.com
                  </span>
                  <i
                    className={copiedEmail ? "fa-solid fa-check" : "fa-regular fa-copy"}
                    id="copy-icon"
                    style={copiedEmail ? { color: "#10b981" } : undefined}
                  />
                </button>

                <div className="social-row">
                  <a
                    href="https://github.com/Rames0"
                    target="_blank"
                    rel="noreferrer"
                    className="social-cube"
                    aria-label="GitHub"
                    data-tilt
                    data-tilt-max="20"
                  >
                    <i className="fa-brands fa-github" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ramesh-mhr-1b0514337"
                    target="_blank"
                    rel="noreferrer"
                    className="social-cube"
                    aria-label="LinkedIn"
                    data-tilt
                    data-tilt-max="20"
                  >
                    <i className="fa-brands fa-linkedin-in" />
                  </a>
                  <a
                    href="https://twitter.com/rameshdev"
                    target="_blank"
                    rel="noreferrer"
                    className="social-cube"
                    aria-label="Twitter / X"
                    data-tilt
                    data-tilt-max="20"
                  >
                    <i className="fa-brands fa-x-twitter" />
                  </a>
                  <a
                    href="mailto:mhrjan0@gmail.com"
                    className="social-cube"
                    aria-label="Email"
                    data-tilt
                    data-tilt-max="20"
                  >
                    <i className="fa-solid fa-at" />
                  </a>
                </div>
              </aside>

              <form
                className="contact-form glass"
                id="contact-form"
                data-tilt
                data-tilt-max="4"
                data-reveal="right"
                noValidate
                onSubmit={handleFormSubmit}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="user-name">Your Name *</label>
                    <input
                      id="user-name"
                      name="name"
                      autoComplete="name"
                      maxLength={100}
                      required
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="user-email">Email Address *</label>
                    <input
                      id="user-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      required
                      placeholder="jane@organization.com"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="user-subject">Subject</label>
                  <input
                    id="user-subject"
                    name="subject"
                    maxLength={200}
                    placeholder="Platform inquiry, systems consultation, or project scope"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="user-message">Message / Project Scope *</label>
                  <textarea
                    id="user-message"
                    name="message"
                    rows={5}
                    maxLength={5000}
                    required
                    placeholder="Describe your project requirements, timeline, and architectural targets..."
                  />
                </div>
                <div className="form-submit-row">
                  <p className="form-status" id="form-status" aria-live="polite">
                    {formStatus}
                  </p>
                  <button
                    type="submit"
                    className="btn btn-primary btn-3d"
                    id="form-submit"
                    disabled={isSubmitting}
                  >
                    <i className="fa-solid fa-paper-plane" />
                    <span>{isSubmitting ? "Sending…" : "Send Message"}</span>
                  </button>
                </div>
              </form>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="container footer-inner">
            <p>© {new Date().getFullYear()} Ramesh Maharjan · Full-Stack Developer.</p>
          </div>
        </footer>

        {/* Mobile dock */}
        <ErgonomicMobileDock />
      </div>
    </PortfolioEntrance>
  );
}
