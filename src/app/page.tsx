"use client";

import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Database,
  Download,
  Github,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Send,
  ServerCog,
  X,
} from "lucide-react";
import Image from "next/image";
import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import profilePic from "../../public/Profile.jpeg";
import { soundEngine } from "@/lib/haptics";
import { ProjectXRayConsole } from "@/components/ProjectXRayConsole";
import { TactileAudioToggle } from "@/components/TactileAudioToggle";
import { ErgonomicMobileDock } from "@/components/ErgonomicMobileDock";
import { AnalogOscilloscope } from "@/components/AnalogOscilloscope";

const navItems = ["About", "Instruments", "Work", "Manifesto", "Capabilities", "Contact"];

const expertise = [
  {
    title: "Frontend Engineering & Motion",
    text: "Sub-20ms interactions, accessible design systems, fluid clamp layouts, and tactile WebGL / canvas integration.",
    tools: "Next.js · React 19 · TypeScript · Tailwind · Framer Motion",
    icon: Layers3,
  },
  {
    title: "Resilient Backend Architecture",
    text: "ACID transactional systems, WebSocket concurrency, REST / GraphQL APIs, and reliable job queuing.",
    tools: "Node.js · Laravel · Django · Grails · Java",
    icon: ServerCog,
  },
  {
    title: "Data Integrity & Delivery",
    text: "Normalized schema modeling, query optimization, indexing, edge CDN routing, and zero-downtime CI/CD deployment.",
    tools: "PostgreSQL · MariaDB · MySQL · Docker · CI/CD",
    icon: Database,
  },
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span />
      {children}
    </div>
  );
}

function createResume() {
  soundEngine.relayClick();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const left = 18;
  const width = 174;
  let y = 22;
  doc.setTextColor(18, 18, 16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  doc.text("RAMESH MAHARJAN", left, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 74);
  doc.text("Full-Stack Engineer & Creative Technologist · Kathmandu, Nepal", left, y);
  y += 6;
  doc.setFontSize(9);
  doc.text(
    "mhrjan0@gmail.com  ·  github.com/Rames0  ·  linkedin.com/in/ramesh-mhr-1b0514337",
    left,
    y
  );
  y += 10;
  doc.setDrawColor(30, 30, 28);
  doc.line(left, y, left + width, y);

  const heading = (label: string) => {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(18, 18, 16);
    doc.text(label.toUpperCase(), left, y);
    y += 6;
  };
  const paragraph = (copy: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(55, 55, 50);
    const lines = doc.splitTextToSize(copy, width);
    doc.text(lines, left, y);
    y += lines.length * 4.7;
  };

  heading("Engineering Profile");
  paragraph(
    "Full-stack engineer and creative technologist focused on dependable web software with tactile interfaces and solid backend systems. Experienced across restaurant point-of-sale platforms, multilingual consultancy directories, enterprise IT solutions, and interactive 3D web applications."
  );

  heading("Experience");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Full-Stack Developer", left, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("2024 - Present", left + width, y, { align: "right" });
  y += 5;
  doc.setTextColor(90, 90, 82);
  doc.text("NIRC Nepal (Nepal Incubation & Research Center)", left, y);
  y += 6;
  paragraph(
    "Develop and deliver production web applications using React, Next.js, Node.js, Laravel, Django, Java, Grails, and relational databases. Responsibilities span high-throughput order dispatch, database transactions, multilingual platforms, and performance tuning."
  );

  heading("Selected Shipped Projects");
  const selected = [
    { title: "Lucazsoft POS", stack: "Laravel · MariaDB · Node.js", desc: "High-throughput restaurant operating system with order dispatch and real-time inventory reconciliation." },
    { title: "Ambience Infosys", stack: "Next.js · Node.js · Tailwind CSS", desc: "Public digital platform for an IT company, organizing complex catalogues into a fast editorial layout." },
    { title: "Kansai Japanese Language", stack: "Laravel · MariaDB · Tailwind CSS", desc: "Education workflow portal structured around intake schedules, course requirements, and student applications." },
    { title: "Rakmina Consultancy", stack: "Laravel · PostgreSQL · Localization", desc: "Multilingual study-abroad advisory directory with instant full-text search." },
  ];

  selected.forEach((p) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(18, 18, 16);
    doc.text(p.title, left, y);
    y += 4.5;
    paragraph(`${p.desc} (${p.stack})`);
    y += 2;
  });

  heading("Education & Credentials");
  paragraph(
    "Bachelor of Computer Applications, Tribhuvan University (2020 - 2025). Core expertise in React, Next.js, TypeScript, Node.js, Laravel, Django, PostgreSQL, MariaDB, MySQL, Git, and CI/CD pipelines."
  );
  doc.save("Ramesh-Maharjan-CV.pdf");
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [ktmTime, setKtmTime] = useState("");
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setKtmTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kathmandu",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  function movePortrait(event: PointerEvent<HTMLDivElement>) {
    if (!portraitRef.current) return;
    const bounds = portraitRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portraitRef.current.style.setProperty("--pointer-x", `${x * 12}px`);
    portraitRef.current.style.setProperty("--pointer-y", `${y * 12}px`);
  }

  function resetPortrait() {
    portraitRef.current?.style.setProperty("--pointer-x", "0px");
    portraitRef.current?.style.setProperty("--pointer-y", "0px");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    soundEngine.relayClick();
    const form = event.currentTarget;
    const data = new FormData(form);
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      window.location.href = `mailto:mhrjan0@gmail.com?subject=${encodeURIComponent(
        String(data.get("subject") || "Engineering Inquiry")
      )}&body=${encodeURIComponent(
        `${data.get("message")}\n\nFrom: ${data.get("name")} (${data.get(
          "email"
        )})`
      )}`;
      return;
    }

    setSending(true);
    setFormStatus("Transmitting payload...");
    try {
      await emailjs.send(
        serviceId,
        templateId,
        Object.fromEntries(data.entries()),
        publicKey
      );
      setFormStatus("Transmission confirmed. I will review and reply shortly.");
      form.reset();
    } catch {
      setFormStatus(
        "Transmission error over socket. Please email directly to mhrjan0@gmail.com"
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="site-shell pb-16 md:pb-0">
      {/* Editorial Top Instrument Bar */}
      <header className="topbar">
        <div className="flex items-center gap-4">
          <a
            className="brand"
            href="#top"
            onClick={() => soundEngine.tick()}
            aria-label="Ramesh Maharjan, home"
          >
            RM<span>.</span>
          </a>
          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-[#cecec6] font-mono text-[10px] text-[#666860]">
            <span>27.7172° N, 85.3240° E</span>
            <span>·</span>
            <span>KTM {ktmTime || "19:45:00"}</span>
          </div>
        </div>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              href={`#${item.toLowerCase()}`}
              key={item}
              onClick={() => soundEngine.tick()}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <TactileAudioToggle />
          <a
            className="availability desktop-only"
            href="mailto:mhrjan0@gmail.com"
            onClick={() => soundEngine.relayClick()}
          >
            <span /> Available for work
          </a>
          <button
            className="menu-button"
            onClick={() => {
              soundEngine.relayClick();
              setMenuOpen(true);
            }}
            aria-label="Open navigation menu"
          >
            <Menu size={21} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <button
          onClick={() => {
            soundEngine.relayClick();
            setMenuOpen(false);
          }}
          aria-label="Close navigation menu"
        >
          <X />
        </button>
        <nav>
          {navItems.map((item) => (
            <a
              href={`#${item.toLowerCase()}`}
              onClick={() => {
                soundEngine.tick();
                setMenuOpen(false);
              }}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="mt-auto space-y-3 font-mono text-xs">
          <p className="text-[#a9aba3]">Direct Dispatch Channel:</p>
          <a href="mailto:mhrjan0@gmail.com" className="text-white font-bold block">
            mhrjan0@gmail.com
          </a>
        </div>
      </div>

      <main>
        {/* ACT I: Asymmetric Hero / Telemetry Monolith */}
        <section className="hero" id="top">
          <div className="hero-index" aria-hidden="true">
            <span>OPERATIONAL</span>
            <span>2026</span>
          </div>

          <div className="hero-copy">
            <motion.div {...reveal}>
              <p className="eyebrow">
                Ramesh Maharjan · Full-Stack Engineer & Creative Technologist
              </p>
              <h1>
                Ramesh
                <br />
                Maharjan<span>.</span>
              </h1>
              <p className="hero-intro">
                I build and maintain resilient web systems for institutions and product teams: from low-latency databases and transactional APIs through to tactile, high-craft user interfaces.
              </p>
              <div className="hero-actions">
                <a
                  className="button button-dark"
                  href="#work"
                  onClick={() => soundEngine.relayClick()}
                >
                  Inspect Selected Work <ArrowDownRight />
                </a>
                <button
                  className="button button-text"
                  onClick={createResume}
                  type="button"
                >
                  <Download /> Download Curriculum Vitae
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            ref={portraitRef}
            onPointerMove={movePortrait}
            onPointerLeave={resetPortrait}
            className="hero-portrait"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
          >
            <div className="portrait-image">
              <Image
                src={profilePic}
                alt="Ramesh Maharjan - Full-Stack Engineer"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 43vw"
              />
            </div>
            <span className="portrait-coordinate coordinate-top">
              27.7172° N
            </span>
            <span className="portrait-coordinate coordinate-bottom">
              85.3240° E
            </span>
            <div className="portrait-note">
              <Code2 /> Currently building at
              <br />
              NIRC Nepal
            </div>
          </motion.div>

          <div className="hero-metrics">
            <div>
              <strong>Based</strong>
              <span>Kathmandu, Nepal</span>
            </div>
            <div>
              <strong>Focus</strong>
              <span>Resilient Web & Tactile Systems</span>
            </div>
            <div>
              <strong>Engagement</strong>
              <span>Full-time Roles & Contracts</span>
            </div>
          </div>
        </section>

        {/* ACT II: Narrative Perspective & Engineering Foundation */}
        <section className="about section" id="about">
          <motion.div {...reveal} className="section-heading">
            <SectionLabel>Philosophy</SectionLabel>
            <h2>Requirements are useless until they become reliable reality.</h2>
          </motion.div>
          <motion.div {...reveal} className="about-copy">
            <p className="lead">
              My engineering approach bridges architecture and human touch: understand the business domain, construct rigorous data schemas, and execute an interface that feels instant and mechanical.
            </p>
            <p>
              At NIRC Nepal, I work across React, Next.js, Node.js, Laravel, Django, Java, and Grails projects. I treat database query plans, network serialization, and 60fps micro-animations with identical mechanical discipline.
            </p>
            <div className="signature-row">
              <div>
                <BriefcaseBusiness />
                <span>
                  <strong>NIRC Nepal</strong>Full-Stack Developer (2024 - Present)
                </span>
              </div>
              <div>
                <MapPin />
                <span>
                  <strong>Kathmandu, Nepal</strong>Available Globally & Remotely
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Kinetic Mechanical Tape */}
        <div className="kinetic-band" aria-hidden="true">
          <div className="kinetic-track">
            <span>AUDIT SCHEMA</span>
            <i>✦</i>
            <span>STREAM RSC WIRES</span>
            <i>✦</i>
            <span>OPTIMIZE QUERY LATENCY</span>
            <i>✦</i>
            <span>DELIVER TACTILE PERFECTION</span>
            <i>✦</i>
            <span>AUDIT SCHEMA</span>
            <i>✦</i>
            <span>STREAM RSC WIRES</span>
            <i>✦</i>
            <span>OPTIMIZE QUERY LATENCY</span>
            <i>✦</i>
            <span>DELIVER TACTILE PERFECTION</span>
            <i>✦</i>
          </div>
        </div>

        {/* ACT II.5: Interactive Hardware Signal Bench (Oscilloscope) */}
        <section className="section bg-[#161714] text-[#F4F3EE] border-b border-[#2C2E29]" id="instruments">
          <motion.div {...reveal} className="section-heading mb-8">
            <div className="section-label text-[#E3C849]">
              <span className="bg-[#E3C849] solid" />
              Field Instrumentation
            </div>
            <h2 className="text-white">
              Signal & Concurrency
              <br />
              Harmonic Bench.
            </h2>
          </motion.div>
          <p className="font-mono text-xs text-[#A6A89F] max-w-2xl mb-8 leading-relaxed">
            Directly test analog frequency response, Lissajous relational convergence, database transaction spikes, and WebSocket socket bursts with interactive hardware dials and real-time audio synthesis.
          </p>

          <AnalogOscilloscope />
        </section>

        {/* ACT III: The Interactive Specimen Matrix & Project X-Ray Console */}
        <section className="work section" id="work">
          <motion.div {...reveal} className="work-header">
            <div>
              <SectionLabel>Selected Work</SectionLabel>
              <h2>
                Shipped Systems,
                <br />
                Audited Live.
              </h2>
            </div>
            <p>
              Switch views between the polished user interface, the live architectural topology flow, and real-time telemetry logs.
            </p>
          </motion.div>

          {/* Integrated Interactive Project X-Ray Console */}
          <ProjectXRayConsole />
        </section>

        {/* ACT IV: Anti-AI Architectural Manifesto */}
        <section className="statement" id="manifesto" aria-label="Development approach">
          <p>[ANTI-AI ARCHITECTURAL AXIOMS]</p>
          <div className="statement-line">
            <span>RESILIENT UNDERNEATH</span>
            <i>and</i>
            <strong>OBVIOUS IN HAND.</strong>
          </div>
          <div className="statement-meta">
            <span>01 / ZERO GENERIC PURPLE GRADIENTS</span>
            <span>02 / STRICT SUB-20MS RESPONSIVENESS</span>
            <span>03 / RELATIONAL NORMALIZATION</span>
            <span>04 / REAL HUMAN CRAFT</span>
          </div>
        </section>

        {/* ACT V: Technical Capabilities & Credentials */}
        <section className="expertise section" id="capabilities">
          <motion.div {...reveal} className="section-heading expertise-heading">
            <SectionLabel>Capabilities</SectionLabel>
            <h2>Comfortable across the entire application stack.</h2>
          </motion.div>
          <div className="expertise-grid">
            {expertise.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title}>
                  <span>0{index + 1}</span>
                  <Icon />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <small>{item.tools}</small>
                </article>
              );
            })}
          </div>

          <motion.div {...reveal} className="experience-row">
            <div>
              <SectionLabel>Experience</SectionLabel>
            </div>
            <div className="experience-main">
              <span>2024 — Present</span>
              <h3>Full-Stack Developer</h3>
              <p>Nepal Incubation & Research Center (NIRC Nepal)</p>
            </div>
            <p>
              Developing production applications including high-throughput restaurant point-of-sale software, multilingual advisory systems, corporate portals, and public-sector tools.
            </p>
          </motion.div>

          <motion.div {...reveal} className="experience-row experience-row-secondary">
            <div>
              <SectionLabel>Education</SectionLabel>
            </div>
            <div className="experience-main">
              <span>2020 — 2025</span>
              <h3>Bachelor of Computer Applications</h3>
              <p>Tribhuvan University</p>
            </div>
            <p>
              In-depth study of computer science foundations, relational database management, data structures, and modern software architectures.
            </p>
          </motion.div>
        </section>

        {/* ACT VI: Dispatch Terminal / Direct Contact Channel */}
        <section className="contact section" id="contact">
          <div className="contact-copy">
            <SectionLabel>Transmission</SectionLabel>
            <h2>
              Need an engineer
              <br />
              <span>who owns the system?</span>
            </h2>
            <p>
              I am open to full-time engineering roles, creative technologist partnerships, and high-impact contract systems. Send your project parameters or challenges.
            </p>
            <a
              href="mailto:mhrjan0@gmail.com"
              onClick={() => soundEngine.relayClick()}
            >
              <Mail /> mhrjan0@gmail.com
            </a>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-grid">
              <label>
                Name
                <input name="name" required placeholder="Jane Doe" />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="jane@company.com"
                />
              </label>
            </div>
            <label>
              Subject
              <input
                name="subject"
                placeholder="What engineering problem are we solving?"
              />
            </label>
            <label>
              Message
              <textarea
                name="message"
                required
                rows={5}
                placeholder="System requirements, scope, architecture constraints, and timeline..."
              />
            </label>
            <div className="form-footer">
              <p aria-live="polite">{formStatus}</p>
              <button
                className="button button-light"
                disabled={sending}
                type="submit"
              >
                {sending ? "Transmitting" : "Dispatch Message"}{" "}
                {sending ? <span className="sending-dot" /> : <Send />}
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Ergonomic Mobile Dock for Thumb Navigation */}
      <ErgonomicMobileDock onDownloadCV={createResume} />

      {/* Analog Colophon / Footer */}
      <footer>
        <a
          className="brand"
          href="#top"
          onClick={() => soundEngine.tick()}
        >
          RM<span>.</span>
        </a>
        <p>
          © {new Date().getFullYear()} Ramesh Maharjan · 27.7172° N, 85.3240° E · Kathmandu
        </p>
        <div>
          <a
            href="https://github.com/Rames0"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            onClick={() => soundEngine.tick()}
          >
            <Github />
          </a>
          <a
            href="https://www.linkedin.com/in/ramesh-mhr-1b0514337"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn Profile"
            onClick={() => soundEngine.tick()}
          >
            <Linkedin />
          </a>
          <a
            href="#top"
            aria-label="Back to top of dossier"
            onClick={() => soundEngine.relayClick()}
          >
            <ArrowUpRight />
          </a>
        </div>
      </footer>
    </div>
  );
}
