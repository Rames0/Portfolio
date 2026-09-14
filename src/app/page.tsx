"use client";

import emailjs from "@emailjs/browser";
import { MotionConfig } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Check,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  GraduationCap,
  Layers,
  Mail,
  Menu,
  Send,
  Sparkles,
  Terminal,
  User,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { FiGithub as Github, FiLinkedin as Linkedin } from "react-icons/fi";
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
import { PortfolioMotion } from "@/components/PortfolioMotion";
import { ProjectXRayConsole } from "@/components/ProjectXRayConsole";
import { ScrollEffects } from "@/components/ScrollEffects";
import { TactileThemeToggle } from "@/components/TactileThemeToggle";
import { soundEngine } from "@/lib/haptics";

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
    number: "01",
    title: "Modern Web Engineering",
    desc: "Architecting high-performance web applications using Next.js 16, React 19, TypeScript, and modern Tailwind design systems. Built to endure high traffic with zero layout shifts.",
    icon: Code2,
  },
  {
    number: "02",
    title: "Systems & API Architecture",
    desc: "Engineering scalable application backends with Node.js, Laravel 11, and Java/Grails MVC. Designing duplex WebSockets and resilient offline-first write queues.",
    icon: Cpu,
  },
  {
    number: "03",
    title: "Relational Schemas & ACID Locks",
    desc: "Structuring relational databases with PostgreSQL and MariaDB. Implementing tsvector full-text search, GIN indexes, and row-level locking for zero transaction corruption.",
    icon: Database,
  },
  {
    number: "04",
    title: "UI/UX Design Systems",
    desc: "Creating systematic design languages in Figma. Translating tokens into pixel-accurate code with strict adherence to human ergonomics and WCAG 2.1 AA accessibility.",
    icon: Layers,
  },
];

async function createResume() {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const K = [15, 23, 42] as const;
  const GR = [71, 85, 105] as const;
  const LG = [148, 163, 184] as const;
  const WH = [255, 255, 255] as const;

  const PW = 210,
    PH = 297;
  const SB = 68;
  const ML = SB + 8;
  const MR = 14;
  const MW = PW - ML - MR;
  const SML = 8;
  const SMW = SB - SML - 4;

  doc.setFillColor(...WH);
  doc.rect(0, 0, PW, 46, "F");
  doc.setDrawColor(...LG);
  doc.setLineWidth(0.4);
  doc.line(0, 46, PW, 46);

  doc.setTextColor(...K);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("RAMESH MAHARJAN", PW / 2, 17, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...GR);
  doc.text("Full-Stack Developer", PW / 2, 25, {
    align: "center",
  });

  doc.setFontSize(9);
  doc.setTextColor(...GR);
  doc.text(
    "Full-Stack Web Systems · UI/UX Design Systems · Resilient Web Architecture",
    PW / 2,
    32,
    { align: "center" },
  );

  doc.setFontSize(8.5);
  doc.setTextColor(...LG);
  const headerContactText =
    "mhrjan0@gmail.com   |   Kathmandu, Nepal   |   github.com/Rames0   |   linkedin.com/in/ramesh-mhr";
  doc.text(headerContactText, PW / 2, 39, { align: "center" });
  const hctw = doc.getTextWidth(headerContactText);
  doc.link((PW - hctw) / 2, 39 - 3.5, hctw, 4.5, {
    url: "mailto:mhrjan0@gmail.com",
  });

  doc.setFillColor(...LG);
  doc.rect(SB - 0.5, 46, 0.5, PH - 46, "F");

  let sy = 52;
  let my = 52;

  const sectionHeading = (label: string, x: number, y: number, w: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...K);
    doc.text(label.toUpperCase(), x, y);
    doc.setDrawColor(...K);
    doc.setLineWidth(0.4);
    doc.line(x, y + 1.2, x + w, y + 1.2);
    return y + 5;
  };

  const bodyText = (text: string, x: number, y: number, w: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...K);
    const lines: string[] = doc.splitTextToSize(text, w);
    lines.forEach((line: string, idx: number) => {
      doc.text(line, x, y + idx * 4.6);
    });
    return y + lines.length * 4.6;
  };

  const bullet = (text: string, x: number, y: number, w: number) => {
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...K);
    doc.text("-", x + 0.5, y);
    const bw = w - 4;
    const lines: string[] = doc.splitTextToSize(text, bw);
    lines.forEach((line: string, idx: number) => {
      doc.text(line, x + 3.5, y + idx * 4.6);
    });
    return y + lines.length * 4.6;
  };

  const checkMain = (need: number) => {
    if (my + need > PH - 10) {
      doc.addPage();
      doc.setFillColor(...LG);
      doc.rect(SB - 0.5, 0, 0.5, PH, "F");
      my = 14;
    }
  };

  // SIDEBAR
  sy = sectionHeading("Contact & Links", SML, sy, SMW);
  [
    {
      label: "Email",
      val: "mhrjan0@gmail.com",
      url: "mailto:mhrjan0@gmail.com",
    },
    { label: "Location", val: "Kathmandu, Nepal", url: "" },
    {
      label: "GitHub",
      val: "github.com/Rames0",
      url: "https://github.com/Rames0",
    },
    {
      label: "LinkedIn",
      val: "linkedin.com/in/ramesh-mhr",
      url: "https://www.linkedin.com/in/ramesh-mhr-1b0514337/",
    },
  ].forEach(({ label, val, url }) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GR);
    doc.text(label, SML, sy);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(val, SMW);
    const textY = sy + 3.8;
    if (url) {
      doc.setTextColor(0, 0, 200);
      doc.text(lines, SML, textY);
      const tw = doc.getTextWidth(lines[0]);
      doc.link(SML, textY - 3.5, tw, 4.5, { url });
    } else {
      doc.setTextColor(...K);
      doc.text(lines, SML, textY);
    }
    sy += lines.length * 3.8 + 4;
  });
  sy += 2;

  sy = sectionHeading("Technical Stack", SML, sy, SMW);
  [
    {
      cat: "Frontend",
      items: "Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion",
    },
    {
      cat: "Backend",
      items: "Node.js, Laravel 11, PHP 8.x, Java/Grails MVC, REST, WebSockets",
    },
    {
      cat: "Databases",
      items: "PostgreSQL (GIN/tsvector), MariaDB, MySQL, ACID Row Locks",
    },
    {
      cat: "Design & UX",
      items: "Figma Design Systems, Wireframing, Prototyping, WCAG 2.1 AA",
    },
    {
      cat: "Tools & DevOps",
      items: "Git, GitHub, Docker, Linux, CI/CD, Performance Profiling",
    },
  ].forEach((g) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GR);
    doc.text(g.cat, SML, sy);
    sy += 3.8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...K);
    const lines = doc.splitTextToSize(g.items, SMW);
    doc.text(lines, SML, sy);
    sy += lines.length * 4 + 2;
  });
  sy += 2;

  sy = sectionHeading("Education", SML, sy, SMW);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...K);
  doc.text("Bachelor of Computer", SML, sy);
  sy += 4;
  doc.text("Applications (BCA)", SML, sy);
  sy += 4;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GR);
  doc.text("Tribhuvan University, Nepal", SML, sy);
  sy += 4;
  doc.text("2020 — 2025", SML, sy);
  sy += 8;

  // MAIN CONTENT
  my = sectionHeading("Profile Summary", ML, my, MW);
  const summaryText =
    "Versatile Full-Stack Developer dedicated to engineering resilient web applications " +
    "and thoughtfully crafted human experiences. Experienced in shipping production-grade platforms including real-time " +
    "restaurant POS engines with local-first offline synchronization, multi-locale directories powered by PostgreSQL " +
    "tsvector search, corporate enterprise platforms, and accessible civic governance systems. Combines strong relational " +
    "database fundamentals with contemporary design system expertise.";
  my = bodyText(summaryText, ML, my, MW) + 6;

  checkMain(50);
  my = sectionHeading("Professional Experience", ML, my, MW);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...K);
  doc.text("Full-Stack Developer", ML, my);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GR);
  doc.text("2024 - Present", PW - MR, my, { align: "right" });
  my += 4.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GR);
  doc.text("Nepal Incubation & Research Center (NIRC Nepal)", ML, my);
  my += 6;

  [
    "Architected and deployed 6+ production web systems spanning hospitality POS, civic governance, and global consulting.",
    "Engineered local-first restaurant POS system with sub-5ms WebSocket synchronization and zero-loss offline order queuing.",
    "Built an 8-locale study advisory directory leveraging PostgreSQL tsvector full-text search with sub-15ms query resolution.",
    "Designed accessible civic public portal unifying 50+ administrative services using Java and Grails MVC with Spring Security RBAC.",
    "Created design systems and interactive UI prototypes in Figma, translating concepts into responsive, pixel-perfect production code.",
  ].forEach((point) => {
    checkMain(8);
    my = bullet(point, ML, my, MW) + 1.2;
  });
  my += 5;

  checkMain(40);
  my = sectionHeading("Key Production Systems", ML, my, MW);

  [
    {
      title: "Lucazsoft POS — High-Pressure Hospitality Engine",
      stack:
        "Laravel 11 · MariaDB (ACID Row Locks) · Node.js WebSockets · Local-First Queue",
      desc: "Engineered operational point-of-sale platform featuring instant kitchen dispatch synchronization, atomic offline order buffering, and touch-ergonomic counter UI.",
    },
    {
      title: "Ambience Infosys — Enterprise Digital Platform",
      stack: "Next.js 16 (App Router / RSC) · React 19 · Node.js · TypeScript",
      desc: "Architected enterprise services showcase engineered for sub-second page delivery, zero runtime layout shift, and 100 Lighthouse performance metrics.",
    },
    {
      title: "Rakmina Consultancy — Multilingual Academic Directory",
      stack:
        "Laravel · PostgreSQL (GIN & tsvector Full-Text Search) · i18n (8 Locales)",
      desc: "Delivered global scholarship portal with deep parametric search indexing and instantaneous locale switching across European and Asian language pairs.",
    },
    {
      title: "GWP — Government Web Portal",
      stack:
        "Java · Grails MVC · Spring Security RBAC · MariaDB Relational Store",
      desc: "Constructed accessible, high-trust civic portal consolidating 50+ municipal administrative services with strict role-based authorization and tamper-evident audit logs.",
    },
  ].forEach((p) => {
    checkMain(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...K);
    doc.text(p.title, ML, my);
    my += 4;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(...GR);
    doc.text(p.stack, ML, my);
    my += 4.2;

    my = bodyText(p.desc, ML, my, MW) + 4;
  });

  const date = new Date().toISOString().split("T")[0];
  doc.save(`Ramesh_Maharjan_CV_${date}.pdf`);
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inspectingConsole, setInspectingConsole] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [timeKTM, setTimeKTM] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kathmandu",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setTimeKTM(new Intl.DateTimeFormat("en-US", options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyEmail = () => {
    soundEngine.relayClick();
    navigator.clipboard.writeText("mhrjan0@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      window.location.href = `mailto:mhrjan0@gmail.com?subject=${encodeURIComponent(
        String(data.get("subject") || "Inquiry from Portfolio"),
      )}&body=${encodeURIComponent(
        `${data.get("message")}\n\nFrom: ${data.get("name")} (${data.get("email")})`,
      )}`;
      return;
    }

    setSending(true);
    setFormStatus("Transmitting your message...");
    try {
      const templateParams = {
        ...Object.fromEntries(data.entries()),
        from_name: data.get("name"),
        from_email: data.get("email"),
        reply_to: data.get("email"),
      };
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      soundEngine.modeSwitch();
      setFormStatus(
        "Message sent successfully. I will get back to you shortly.",
      );
      form.reset();
    } catch {
      setFormStatus(
        "Delivery issue. Please email directly to mhrjan0@gmail.com",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-wrapper">
        {/* Antigravity WebGL Canvas: Luminous Particles */}
        <AntigravityBackground />

        {/* Scroll Progress & Spotlight Effects */}
        <ScrollEffects />

        {/* Motion Reveals */}
        <PortfolioMotion />

        <a className="skip-link" href="#work">
          Skip to main content
        </a>

        {/* ============================================================
            FULL-WIDTH STICKY TOPBAR
            ============================================================ */}
        <header className="site-header">
          <div className="full-container site-header-inner">
            <a
              href="#hero"
              className="brand-identity group"
              aria-label="Ramesh Maharjan Home"
            >
              <div className="brand-logo-badge group-hover:scale-105 transition-transform overflow-hidden !bg-transparent !border-0 !p-0">
                <Image
                  src={faviconSvg}
                  alt="Ramesh Maharjan Logo"
                  width={38}
                  height={38}
                  className="w-full h-full object-contain rounded-[10px]"
                  priority
                />
              </div>
              <div className="brand-text">
                <h1>Ramesh Maharjan</h1>
                <p>Full-Stack Developer</p>
              </div>
            </a>

            <nav className="site-nav-links" aria-label="Main Navigation">
              <a href="#work">
                <span>Work</span>
              </a>
              <a href="#experience">
                <span>Experience</span>
              </a>
              <a href="#capabilities">
                <span>Capabilities</span>
              </a>
              <a href="#stack">
                <span>Stack</span>
              </a>
              <a href="#contact">
                <span>Contact</span>
              </a>
            </nav>

            <div className="header-right-cluster">
              {timeKTM && (
                <div className="time-pill">
                  <span className="time-dot" />
                  <span>{timeKTM} KTM · UTC+5:45</span>
                </div>
              )}

              <TactileThemeToggle />

              <button
                onClick={createResume}
                type="button"
                className="btn btn-outline text-xs hidden sm:inline-flex !h-9 !px-3.5"
              >
                <Download size={13} />
                <span>Resume (PDF)</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg border border-[var(--surface-border)] text-[var(--text-primary)] md:hidden"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-[68px] z-50 bg-[var(--bg-secondary)] border-b border-[var(--surface-border)] p-6 shadow-2xl md:hidden max-h-[calc(100vh-68px)] overflow-y-auto">
            <nav className="flex flex-col gap-2 font-mono">
              <a
                href="#work"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              >
                Selected Work
              </a>
              <a
                href="#experience"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              >
                Experience &amp; Education
              </a>
              <a
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              >
                Capabilities &amp; Services
              </a>
              <a
                href="#stack"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              >
                Technology Stack
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              >
                Contact
              </a>
            </nav>
            <button
              onClick={() => {
                createResume();
                setMobileMenuOpen(false);
              }}
              type="button"
              className="btn btn-primary w-full mt-4 font-mono text-xs uppercase tracking-wider"
            >
              <Download size={15} />
              <span>Download Resume (PDF)</span>
            </button>
          </div>
        )}

        {/* ============================================================
            HERO SECTION
            ============================================================ */}
        <section className="hero-section" id="hero">
          <div className="full-container">
            <div className="hero-grid-layout">
              <div>
                <div className="status-pill">
                  <span className="status-dot" />
                  <span className="truncate">
                    AVAILABLE FOR COMMISSIONS · KATHMANDU, NEPAL
                  </span>
                </div>

                <h1 className="hero-main-heading">
                  Architecting{" "}
                  <span className="gradient-text">resilient web systems</span>{" "}
                  with modern craft.
                </h1>

                <p className="hero-sub-statement">
                  I&apos;m Ramesh Maharjan — Full-Stack Developer &amp; UI/UX
                  Designer at NIRC Nepal. I specialize in building
                  high-performance web applications, combining transactional
                  relational data integrity (PostgreSQL &amp; MariaDB ACID row
                  locks) with fluid, human-centered interfaces (Next.js 16,
                  React 19, TypeScript, Tailwind CSS).
                </p>

                <div className="hero-actions-row">
                  <a href="#work" className="btn btn-primary">
                    <Layers size={15} />
                    <span>Explore Selected Work</span>
                  </a>

                  <button
                    onClick={createResume}
                    type="button"
                    className="btn btn-outline"
                  >
                    <Download size={15} />
                    <span>Download Resume (PDF)</span>
                  </button>

                  <a href="#contact" className="btn btn-ghost">
                    <Mail size={15} />
                    <span>Get in Touch</span>
                  </a>
                </div>
              </div>

              {/* Editorial Portrait Card */}
              <div className="hero-portrait-card">
                <div className="portrait-container">
                  <Image
                    src={profilePic}
                    alt="Ramesh Maharjan — Full-Stack Developer"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                </div>
                <div className="portrait-details">
                  <span className="text-[var(--text-primary)] font-bold">
                    RAMESH MAHARJAN
                  </span>
                  <span className="text-[var(--accent-primary)]">
                    KATHMANDU, NEPAL
                  </span>
                </div>
              </div>
            </div>

            {/* Milestones Strip */}
            <div className="stats-strip">
              <div className="stat-box">
                <span className="val">06+</span>
                <span className="desc">
                  Shipped Production Web Applications
                </span>
              </div>
              <div className="stat-box">
                <span className="val">BCA</span>
                <span className="desc">
                  Tribhuvan University Graduate (2020–2025)
                </span>
              </div>
              <div className="stat-box">
                <span className="val">2024–</span>
                <span className="desc">
                  NIRC Nepal Full-Stack &amp; UI/UX Leadership
                </span>
              </div>
              <div className="stat-box">
                <span className="val">100%</span>
                <span className="desc">
                  High-Reliability SLAs &amp; ACID Data Integrity
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            FEATURED WORK
            ============================================================ */}
        <section className="section-wrapper" id="work">
          <div className="full-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
              <div className="section-header-block mb-0">
                <div className="section-tag">
                  <span className="line" />
                  <span>SELECTED WORK</span>
                </div>
                <h2 className="section-title">
                  Production Platforms &amp; Systems
                </h2>
                <p className="section-lead">
                  Mission-critical applications engineered for sub-second
                  delivery, relational data integrity, and high-concurrency
                  environments.
                </p>
              </div>

              <button
                onClick={() => {
                  soundEngine.modeSwitch();
                  setInspectingConsole(!inspectingConsole);
                }}
                className="btn btn-outline text-xs self-start md:self-auto shrink-0 font-mono"
                type="button"
              >
                <Terminal size={14} className="text-[var(--accent-primary)]" />
                <span>
                  {inspectingConsole
                    ? "Close Architecture Console"
                    : "Open Architecture X-Ray Console"}
                </span>
              </button>
            </div>

            {/* Architecture Console Drawer */}
            {inspectingConsole && (
              <div className="mb-8 sm:mb-12 p-3 sm:p-6 border border-[var(--surface-border)] rounded-2xl bg-[var(--bg-card)] overflow-x-auto shadow-2xl">
                <ProjectXRayConsole />
              </div>
            )}

            {/* Responsive Full-Width Grid of Platforms */}
            <div className="projects-responsive-grid">
              {featuredPlatforms.map((platform) => (
                <article key={platform.title} className="platform-card">
                  <div className="platform-thumbnail">
                    <Image
                      src={platform.image}
                      alt={platform.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  </div>
                  <div className="platform-content">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)] mb-2 block">
                      {platform.category}
                    </span>

                    <div className="platform-tags-row">
                      {platform.tags.map((tag) => (
                        <span key={tag} className="platform-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3>
                      <span>{platform.title}</span>
                      {platform.link !== "#" && (
                        <a
                          href={platform.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] shrink-0"
                          aria-label={`Open ${platform.title}`}
                        >
                          <ArrowUpRight size={18} />
                        </a>
                      )}
                    </h3>

                    <p className="sub">{platform.subtitle}</p>
                    <p className="description">{platform.desc}</p>

                    {platform.link !== "#" && (
                      <a
                        href={platform.link}
                        target="_blank"
                        rel="noreferrer"
                        className="platform-action-link"
                      >
                        <span>View Live Deployment</span>
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            EXPERIENCE & EDUCATION
            ============================================================ */}
        <section className="section-wrapper" id="experience">
          <div className="full-container">
            <div className="section-header-block">
              <div className="section-tag">
                <span className="line" />
                <span>CAREER TIMELINE</span>
              </div>
              <h2 className="section-title">
                Professional Experience &amp; Education
              </h2>
              <p className="section-lead">
                Engineering leadership, design craftsmanship, and rigorous
                theoretical foundations in computer applications.
              </p>
            </div>

            <div className="timeline-two-col">
              <div className="journey-card">
                <span className="journey-badge">
                  <Briefcase size={13} />
                  <span>2024 — PRESENT ACTIVE EMPLOYMENT</span>
                </span>
                <div>
                  <h3>Full-Stack Developer</h3>
                  <div className="journey-org text-[var(--accent-primary)]">
                    Nepal Incubation &amp; Research Center (NIRC Nepal)
                  </div>
                </div>
                <ul className="journey-bullets">
                  <li>
                    Leading full-stack architecture and UI/UX design across 6+
                    production web systems and enterprise client platforms.
                  </li>
                  <li>
                    Architected local-first restaurant POS with sub-5ms duplex
                    WebSocket sync and zero-loss offline order queues.
                  </li>
                  <li>
                    Engineered multi-locale study advisory directory with
                    PostgreSQL GIN/tsvector search and sub-15ms query
                    resolution.
                  </li>
                  <li>
                    Designed accessible civic portal unifying 50+ municipal
                    public services using Java / Grails MVC.
                  </li>
                  <li>
                    Created design tokens and interactive Figma components,
                    translating design systems into pixel-accurate code.
                  </li>
                </ul>
              </div>

              <div className="journey-card">
                <span className="journey-badge">
                  <GraduationCap size={13} />
                  <span>2020 — 2025 ACADEMIC FOUNDATION</span>
                </span>
                <div>
                  <h3>Bachelor of Computer Applications (BCA)</h3>
                  <div className="journey-org text-[var(--accent-primary)]">
                    Tribhuvan University, Nepal
                  </div>
                </div>
                <ul className="journey-bullets">
                  <li>
                    Comprehensive graduation curriculum covering Relational
                    Database Management Systems, normalization, and ACID
                    concurrency.
                  </li>
                  <li>
                    Advanced coursework in Data Structures, Algorithms, Software
                    Engineering methodologies, and Unix/Linux OS concepts.
                  </li>
                  <li>
                    Engineered practical academic web systems emphasizing W3C
                    standards compliance and modular software architecture.
                  </li>
                  <li>
                    Solidified theoretical foundations in computer networking,
                    cryptography protocols, and systems analysis.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CAPABILITIES & SERVICES
            ============================================================ */}
        <section className="section-wrapper" id="capabilities">
          <div className="full-container">
            <div className="section-header-block">
              <div className="section-tag">
                <span className="line" />
                <span>03 CORE DISCIPLINES</span>
              </div>
              <h2 className="section-title">
                Engineering Pillars &amp; Capabilities
              </h2>
              <p className="section-lead">
                The foundational disciplines I bring to architecting, designing,
                and scaling digital products.
              </p>
            </div>

            <div className="services-quad-grid">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div key={cap.title} className="service-unit">
                    <div className="flex items-center justify-between">
                      <div className="service-unit-icon">
                        <Icon size={22} />
                      </div>
                      <span className="font-mono text-[11px] font-bold text-[var(--text-muted)]">
                        {cap.number}
                      </span>
                    </div>
                    <h3>{cap.title}</h3>
                    <p>{cap.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            TECHNOLOGY STACK
            ============================================================ */}
        <section className="section-wrapper" id="stack">
          <div className="full-container">
            <div className="section-header-block">
              <div className="section-tag">
                <span className="line" />
                <span>04 PRODUCTION TOOLCHAIN</span>
              </div>
              <h2 className="section-title">
                Battle-Tested Technologies &amp; Tools
              </h2>
              <p className="section-lead">
                The production stack I leverage daily to design, build, test,
                and ship resilient digital systems. Hover or touch to interact
                with the kinetic floating tool field.
              </p>
            </div>

            {/* Kinetic Randomly Moving Tech Icons Field */}
            <FloatingTechIcons />
          </div>
        </section>

        {/* ============================================================
            CONTACT SECTION
            ============================================================ */}
        <section className="section-wrapper" id="contact">
          <div className="full-container">
            <div className="contact-split-grid">
              <div className="contact-card-sidebar">
                <div className="section-tag">
                  <span className="line" />
                  <span>05 DIRECT CONTACT</span>
                </div>
                <h2>Let&apos;s build something exceptional together.</h2>
                <p>
                  Have a mission-critical platform to architect, an engineering
                  opportunity, or a complex UI/UX challenge? Reach out directly
                  below.
                </p>

                <button
                  onClick={copyEmail}
                  type="button"
                  className="contact-email-btn"
                  aria-label="Copy direct email"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Mail
                      size={16}
                      className="text-[var(--accent-primary)] shrink-0"
                    />
                    <span className="truncate">mhrjan0@gmail.com</span>
                  </div>
                  {copiedEmail ? (
                    <Check
                      size={16}
                      className="text-[var(--accent-primary)] shrink-0"
                    />
                  ) : (
                    <Copy size={16} className="shrink-0" />
                  )}
                </button>
                {copiedEmail && (
                  <p className="text-xs text-[var(--accent-primary)] mt-2 font-mono">
                    Email copied to clipboard (mhrjan0@gmail.com)!
                  </p>
                )}

                <div className="contact-social-cluster">
                  <a
                    href="https://github.com/Rames0"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-social-btn"
                    aria-label="GitHub Profile"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ramesh-mhr-1b0514337"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-social-btn"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>

              {/* Form */}
              <div className="contact-form-box">
                <form onSubmit={handleSubmit}>
                  <div className="form-two-fields">
                    <div className="form-group-item">
                      <label htmlFor="user-name">Your Name *</label>
                      <input
                        id="user-name"
                        name="name"
                        required
                        placeholder="Jane Doe"
                      />
                    </div>

                    <div className="form-group-item">
                      <label htmlFor="user-email">Email Address *</label>
                      <input
                        id="user-email"
                        name="email"
                        type="email"
                        required
                        placeholder="jane@organization.com"
                      />
                    </div>
                  </div>

                  <div className="form-group-item">
                    <label htmlFor="user-subject">Subject</label>
                    <input
                      id="user-subject"
                      name="subject"
                      placeholder="Platform inquiry, systems consultation, or project scope"
                    />
                  </div>

                  <div className="form-group-item">
                    <label htmlFor="user-message">
                      Message / Project Scope *
                    </label>
                    <textarea
                      id="user-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Describe your project requirements, timeline, and architectural targets..."
                    />
                  </div>

                  <div className="form-submit-row">
                    <p
                      aria-live="polite"
                      className="text-xs text-[var(--accent-primary)] m-0 font-mono"
                    >
                      {formStatus}
                    </p>

                    <button
                      className="btn btn-primary"
                      disabled={sending}
                      type="submit"
                    >
                      <Send size={15} />
                      <span>
                        {sending ? "Transmitting..." : "Send Message"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            FULL-WIDTH FOOTER
            ============================================================ */}
        <footer className="site-footer">
          <div className="full-container site-footer-inner">
            <p>
              © {new Date().getFullYear()} Ramesh Maharjan · Full-Stack
              Developer.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[var(--text-muted)]">
              <span className="text-[var(--accent-primary)]">Next.js 16</span>
              <span>•</span>
              <span>React 19</span>
              <span>•</span>
              <span>TypeScript</span>
              <span>•</span>
              <span>PostgreSQL</span>
              <span>•</span>
              <span>MariaDB</span>
              <span>•</span>
              <span className="text-[var(--accent-secondary)]">
                Tailwind CSS
              </span>
            </div>
          </div>
        </footer>

        {/* Mobile Ergonomic Dock */}
        <ErgonomicMobileDock onDownloadCV={createResume} />
      </div>
    </MotionConfig>
  );
}
