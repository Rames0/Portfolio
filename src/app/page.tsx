"use client";

import emailjs from "@emailjs/browser";
import {MotionConfig, useReducedMotion} from "framer-motion";
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
import {FormEvent, PointerEvent, useEffect, useRef, useState} from "react";
import profilePic from "../../public/Profile.jpeg";
import {soundEngine} from "@/lib/haptics";
import {ProjectXRayConsole} from "@/components/ProjectXRayConsole";
import {TactileAudioToggle} from "@/components/TactileAudioToggle";
import {ErgonomicMobileDock} from "@/components/ErgonomicMobileDock";


import {WORK_STATUS} from "@/lib/config";
import {SystemTelemetryLab} from "@/components/SystemTelemetryLab";
import {PortfolioMotion} from "@/components/PortfolioMotion";
import {HeroGrid} from "@/components/HeroGrid";
import {TechnicalSeparator} from "@/components/TechnicalSeparator";

const navItems = ["Work", "About", "Capabilities", "Experience", "Lab", "Contact"];

const expertise = [
    {
        title: "Frontend Engineering & Motion",
        text: "Responsive interactions, accessible design systems, fluid clamp layouts, and tactile canvas-based visualizers.",
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

function SectionLabel({children}: { children: React.ReactNode }) {
    return (
        <div className="section-label">
            <span/>
            {children}
        </div>
    );
}

async function createResume() {
    soundEngine.relayClick();
    const {default: jsPDF} = await import("jspdf");
    const doc = new jsPDF({unit: "mm", format: "a4"});

    const K = [0, 0, 0] as const; // black
    const GR = [90, 90, 90] as const; // gray
    const LG = [160, 160, 160] as const; // light gray
    const WH = [255, 255, 255] as const; // white

    const PW = 210, PH = 297;
    const SB = 68;
    const ML = SB + 8;
    const MR = 14;
    const MW = PW - ML - MR;
    const SML = 8;
    const SMW = SB - SML - 4;

    // white header with bottom border
    doc.setFillColor(...WH);
    doc.rect(0, 0, PW, 46, "F");
    doc.setDrawColor(...LG);
    doc.setLineWidth(0.4);
    doc.line(0, 46, PW, 46);

    doc.setTextColor(...K);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("RAMESH MAHARJAN", PW / 2, 18, {align: "center"});

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(...GR);
    doc.text("Full-Stack Developer", PW / 2, 26, {align: "center"});

    doc.setFontSize(9.5);
    doc.setTextColor(...GR);
    doc.text("React  Next.js  Node.js  Java  Grails  Django  PostgreSQL", PW / 2, 33, {align: "center"});

    doc.setFontSize(8.5);
    doc.setTextColor(...LG);
    const headerContactText = "mhrjan0@gmail.com   |   Kathmandu, Nepal   |   github.com/Rames0   |   linkedin.com/in/ramesh-mhr";
    doc.text(headerContactText, PW / 2, 40, {align: "center"});
    const hctw = doc.getTextWidth(headerContactText);
    doc.link((PW - hctw) / 2, 40 - 3.5, hctw, 4.5, {url: "mailto:mhrjan0@gmail.com"});

    // sidebar divider (starts after header)
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

    const justifyLine = (line: string, x: number, y: number, w: number) => {
        const words = line.trim().split(" ");
        if (words.length <= 1) {
            doc.text(line, x, y);
            return;
        }
        const totalWordWidth = words.reduce((sum: number, wd: string) => sum + doc.getTextWidth(wd), 0);
        const gap = (w - totalWordWidth) / (words.length - 1);
        let cx = x;
        words.forEach((word: string, wi: number) => {
            doc.text(word, cx, y);
            cx += doc.getTextWidth(word) + (wi < words.length - 1 ? gap : 0);
        });
    };

    const bodyText = (text: string, x: number, y: number, w: number) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...K);
        const lines: string[] = doc.splitTextToSize(text, w);
        lines.forEach((line: string, idx: number) => {
            if (idx === lines.length - 1) doc.text(line, x, y + idx * 4.6);
            else justifyLine(line, x, y + idx * 4.6, w);
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
            if (idx === lines.length - 1) doc.text(line, x + 3.5, y + idx * 4.6);
            else justifyLine(line, x + 3.5, y + idx * 4.6, bw);
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

    // ── SIDEBAR ────────────────────────────────────────────────────────────
    sy = sectionHeading("Contact", SML, sy, SMW);
    ([
        {label: "Email", val: "mhrjan0@gmail.com", url: "mailto:mhrjan0@gmail.com"},
        {label: "Location", val: "Kathmandu, Nepal", url: ""},
        {label: "GitHub", val: "github.com/Rames0", url: "https://github.com/Rames0"},
        {
            label: "LinkedIn",
            val: "linkedin.com/in/ramesh-mhr",
            url: "https://www.linkedin.com/in/ramesh-mhr-1b0514337/"
        },
    ]).forEach(({label, val, url}) => {
        doc.setFontSize(8.5);
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
            doc.link(SML, textY - 3.5, tw, 4.5, {url});
        } else {
            doc.setTextColor(...K);
            doc.text(lines, SML, textY);
        }
        sy += lines.length * 3.8 + 4.5;
    });
    sy += 3;

    sy = sectionHeading("Technical Skills", SML, sy, SMW);
    ([
        {cat: "Frontend", items: "Next.js, React, TypeScript, Tailwind CSS, JavaScript, Html, Css"},
        {cat: "Backend", items: "Node.js, PHP, Laravel, Java, Grails, Django, REST APIs"},
        {cat: "Database", items: "PostgreSQL, MariaDB, MySQL"},
        {cat: "Tools", items: "Git, CI/CD, Linux"},
    ]).forEach((g) => {
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...GR);
        doc.text(g.cat, SML, sy);
        sy += 4;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...K);
        const lines = doc.splitTextToSize(g.items, SMW);
        doc.text(lines, SML, sy);
        sy += lines.length * 4.2 + 2;
    });
    sy += 3;

    sy = sectionHeading("Education", SML, sy, SMW);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...K);
    doc.text("Bachelor of Computer", SML, sy);
    sy += 4.2;
    doc.text("Applications (BCA)", SML, sy);
    sy += 4.2;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GR);
    doc.text("TU University", SML, sy);
    sy += 9;

    sy = sectionHeading("Programming Languages", SML, sy, SMW);
    (["JavaScript", "TypeScript", "Python", "Java", "PHP"] as string[])
        .forEach((lang: string) => {
            doc.setFontSize(8.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...K);
            doc.text(lang, SML, sy);
            sy += 5.5;
        });

    // ── MAIN CONTENT ───────────────────────────────────────────────────────
    my = sectionHeading("Professional Summary", ML, my, MW);
    const summaryText =
        "Full-Stack Developer with 1+ year of hands-on experience building resilient web applications. " +
        "Delivered 6+ production projects spanning government portals, restaurant POS systems, and multi-language " +
        "consultancy platforms. Proficient across the full stack from React and Next.js UIs to Java/Grails and " +
        "Node.js backends with optimised relational databases.";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...K);
    const summaryLines: string[] = doc.splitTextToSize(summaryText, MW);
    summaryLines.forEach((line: string, idx: number) => {
        const isLast = idx === summaryLines.length - 1;
        if (isLast) {
            doc.text(line, ML, my);
        } else {
            const words = line.trim().split(" ");
            if (words.length > 1) {
                const totalWordWidth = words.reduce((sum: number, w: string) => sum + doc.getTextWidth(w), 0);
                const gap = (MW - totalWordWidth) / (words.length - 1);
                let cx = ML;
                words.forEach((word: string, wi: number) => {
                    doc.text(word, cx, my);
                    cx += doc.getTextWidth(word) + (wi < words.length - 1 ? gap : 0);
                });
            } else {
                doc.text(line, ML, my);
            }
        }
        my += 4.6;
    });
    my += 5;

    checkMain(50);
    my = sectionHeading("Professional Experience", ML, my, MW);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...K);
    doc.text("Full-Stack Developer", ML, my);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...GR);
    doc.text("2024 - Present", PW - MR, my, {align: "right"});
    my += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...GR);
    doc.text("NIRC Nepal - Nepal Incubation & Research Center", ML, my);
    my += 6;

    ([
        "Architected and shipped 6+ production applications across diverse industry verticals.",
        "Engineered a real-time restaurant POS ensuring immediate order dispatch routing.",
        "Built a multi-language consultancy platform (8 locales) expanding reach to 10+ countries.",
        "Optimised query paths and frontend bundle sizes, improving client-side render speeds.",
        "Introduced CI/CD pipelines automating testing and deployment workflows.",
        "Developed a government portal digitising 50+ citizen-facing services using Java and Grails.",
    ] as string[]).forEach((a) => {
        checkMain(8);
        my = bullet(a, ML, my, MW) + 1;
    });
    my += 5;

    checkMain(30);
    my = sectionHeading("Key Projects", ML, my, MW);

    ([
        {
            title: "Ambience Infosys - Corporate Website",
            stack: "Next.js  Node.js  Tailwind CSS  MariaDB",
            desc: "Full-featured IT company site with service showcase, testimonials, and CMS. Drove modern brand presence and optimized SEO CMS.",
        },
        {
            title: "Kansai Japanese Language Institute - LMS",
            stack: "Next.js  Node.js  MariaDB",
            desc: "Course management and student-enrollment platform serving 500+ learners with progress analytics.",
        },
        {
            title: "Rakmina Consultancy - Multi-language Platform",
            stack: "Next.js  MariaDB  i18n (8 locales)",
            desc: "Internationalised consultancy portal expanding reach across 10+ countries.",
        },
        {
            title: "Lucazsoft - Restaurant POS System",
            stack: "Next.js  Node.js  MariaDB  WebSockets",
            desc: "End-to-end POS with inventory tracking, live order updates, and financial reporting.",
        },
        {
            title: "GWP - Government Web Portal",
            stack: "Java  Grails  JavaScript  HTML  CSS",
            desc: "Secure, accessible portal consolidating 50+ government services for citizens.",
        },
    ]).forEach((p) => {
        checkMain(22);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...K);
        doc.text(p.title, ML, my);
        my += 4.2;

        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(...GR);
        doc.text(p.stack, ML, my);
        my += 4.5;

        my = bodyText(p.desc, ML, my, MW) + 4;
    });

    const date = new Date().toISOString().split("T")[0];
    doc.save(`Ramesh_Maharjan_CV_${date}.pdf`);
}

export default function Home() {
    const reducedMotion = useReducedMotion();
    const [activeSection, setActiveSection] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [formStatus, setFormStatus] = useState("");
    const [sending, setSending] = useState(false);
    const [ktmTime, setKtmTime] = useState("");

    const portraitRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) setActiveSection(entry.target.id);
            }
        }, {rootMargin: "-15% 0px -65% 0px"});
        document.querySelectorAll("main > section[id]").forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        if (!menuOpen) return;
        const previousFocus = document.activeElement as HTMLElement | null;
        const elements = menuRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
        elements?.[0]?.focus();
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false);
            if (event.key !== "Tab" || !elements?.length) return;
            const first = elements[0];
            const last = elements[elements.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", onKey);
            previousFocus?.focus();
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
        if (!portraitRef.current || reducedMotion || event.pointerType !== "mouse") return;
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
        <MotionConfig reducedMotion="user" transition={{duration: reducedMotion ? 0 : 0.28}}>
            <div className="site-shell pb-16 md:pb-0">
                <PortfolioMotion/>
                <a className="skip-link" href="#work">Skip to selected work</a>
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
                        <div
                            className="hidden lg:flex items-center gap-3 pl-4 border-l border-[#cecec6] font-mono text-[10px] text-[#666860]">
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
                                aria-current={activeSection === item.toLowerCase() ? "location" : undefined}
                                onClick={() => soundEngine.tick()}
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3 justify-self-end">

                        <TactileAudioToggle/>
                        {WORK_STATUS.available && (
                            <a
                                className="availability desktop-only"
                                href="mailto:mhrjan0@gmail.com"
                                onClick={() => soundEngine.relayClick()}
                            >
                                <span style={{
                                    backgroundColor: WORK_STATUS.color,
                                    boxShadow: `0 0 0 4px ${WORK_STATUS.color}22`
                                }}/> {WORK_STATUS.label}
                            </a>
                        )}
                        <button
                            ref={menuButtonRef}
                            className="menu-button"
                            onClick={() => {
                                soundEngine.relayClick();
                                setMenuOpen(true);
                            }}
                            aria-label="Open navigation menu"
                            aria-expanded={menuOpen}
                            aria-controls="mobile-navigation"
                        >
                            <Menu size={21}/>
                        </button>
                    </div>
                </header>

                {/* Mobile Drawer Menu */}
                <div
                    ref={menuRef}
                    id="mobile-navigation"
                    className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
                    aria-hidden={!menuOpen}
                    inert={!menuOpen}
                    role="dialog"
                    aria-modal={menuOpen || undefined}
                    aria-label="Navigation"
                >
                    <button
                        onClick={() => {
                            soundEngine.relayClick();
                            setMenuOpen(false);
                        }}
                        aria-label="Close navigation menu"
                    >
                        <X/>
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

                <main inert={menuOpen}>
                    <section className="hero" id="top">
          <HeroGrid />
                        <div className="hero-index" aria-hidden="true">
                            <span>OPERATIONAL</span>
                            <span>2026</span>
                        </div>

                        <div className="hero-copy">
                            <div>
                                <p className="eyebrow" data-hero="detail">
                                    Kathmandu, Nepal / NIRC Nepal
                                </p>
                                <h1 data-hero="name">
                                    Ramesh
                                    <br/>
                                    Maharjan<span>.</span>
                                </h1>
                                <p className="hero-role" data-hero="role">Full-Stack Engineer <span>/ Creative Technologist</span>
                                </p>
                                <p className="hero-intro" data-hero="position">
                                    I build and maintain resilient web systems for institutions and product teams: from
                                    low-latency databases and transactional APIs through to tactile, high-craft user
                                    interfaces.
                                </p>
                                <div className="hero-actions" data-hero="actions">
                                    <a
                                        className="button button-dark"
                                        href="#work"
                                        onClick={() => soundEngine.relayClick()}
                                    >
                                        Inspect Selected Work <ArrowDownRight/>
                                    </a>
                                    <button
                                        className="button button-text"
                                        onClick={createResume}
                                        type="button"
                                    >
                                        <Download/> Download Curriculum Vitae
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div
                            ref={portraitRef}
                            onPointerMove={movePortrait}
                            onPointerLeave={resetPortrait}
                            className="hero-portrait"
                            data-hero="detail"
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
                                <Code2/> Currently building at
                                <br/>
                                NIRC Nepal
                            </div>
                        </div>

                        <div className="hero-metrics" data-hero="detail">
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
<TechnicalSeparator />

                    <section className="work section" id="work">
                        <div className="work-header">
                            <div>
                                <SectionLabel>Selected Work</SectionLabel>
                                <h2>
                                    Shipped Systems,
                                    <br/>
                                    Inside &amp; Out.
                                </h2>
                            </div>
                            <p>
                                Production work across hospitality, education, public services, and enterprise
                                platforms.
                            </p>
                        </div>

                        {/* Integrated Interactive Project X-Ray Console */}
                        <ProjectXRayConsole/>
                    </section>
<TechnicalSeparator />

                    <section className="about section" id="about">
                        <div className="section-heading">
                            <SectionLabel>Philosophy</SectionLabel>
                            <h2>Requirements matter when they become reliable systems.</h2>
                        </div>
                        <div className="about-copy">
                            <p className="lead">
                                My engineering approach bridges architecture and human touch: understand the business
                                domain, construct rigorous data schemas, and execute an interface that feels instant and
                                mechanical.
                            </p>
                            <p>
                                At NIRC Nepal, I work across React, Next.js, Node.js, Laravel, Django, Java, and Grails
                                projects. I treat database query plans, network latency, and fluid micro-interactions
                                with identical mechanical discipline.
                            </p>
                            <div className="signature-row">
                                <div>
                                    <BriefcaseBusiness/>
                                    <span>
                  <strong>NIRC Nepal</strong>Full-Stack Developer (2024 - Present)
                </span>
                                </div>
                                <div>
                                    <MapPin/>
                                    <span>
                  <strong>Kathmandu, Nepal</strong>Available Globally & Remotely
                </span>
                                </div>
                            </div>
                        </div>
                    </section>
<TechnicalSeparator />

                    <section className="expertise section" id="capabilities" style={{paddingBottom: "40px"}}>
                        <div className="section-heading expertise-heading">
                            <SectionLabel>Capabilities</SectionLabel>
                            <h2>Comfortable across the entire application stack.</h2>
                        </div>
                        <div className="expertise-grid">
                            {expertise.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <article key={item.title}>
                                        <span>0{index + 1}</span>
                                        <Icon/>
                                        <h3>{item.title}</h3>
                                        <p>{item.text}</p>
                                        <small>{item.tools}</small>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
<TechnicalSeparator />

                    <section className="section pt-0" id="experience">

                        <div className="experience-row">
                            <div>
                                <SectionLabel>Experience</SectionLabel>
                            </div>
                            <div className="experience-main">
                                <span>2024 — Present</span>
                                <h3>Full-Stack Developer</h3>
                                <p>Nepal Incubation & Research Center (NIRC Nepal)</p>
                            </div>
                            <p>
                                Developing production applications including real-time restaurant point-of-sale
                                software, multilingual advisory systems, corporate portals, and public-sector tools.
                            </p>
                        </div>

                    </section>
<TechnicalSeparator />


                    <section className="section bg-[#161714] text-[#F4F3EE] border-b border-[#2C2E29]" id="lab">
                        <div className="section-heading mb-8">
                            <div className="section-label text-[#E3C849]">
                                <span className="bg-[#E3C849] solid"/>
                                Simulation Environment
                            </div>
                            <h2 className="text-white">
                                System Telemetry<br/>
                                Lab.
                            </h2>
                        </div>
                        <p className="font-mono text-xs text-[#A6A89F] max-w-2xl mb-8 leading-relaxed">
                            An interactive simulation of how requests, validation, transactions, and real-time events
                            move through a production web system.
                        </p>

                        <SystemTelemetryLab/>
                    </section>

                    <section className="statement" id="principles" aria-label="Development approach">
                        <p>[ENGINEERING AXIOMS]</p>
                        <div className="statement-line">
                            <span>RESILIENT UNDERNEATH</span>
                            <i>and</i>
                            <strong>OBVIOUS IN HAND.</strong>
                        </div>
                        <div className="statement-meta">
                            <span>01 / PURPOSE-DRIVEN ARCHITECTURE</span>
                            <span>02 / RESPONSIVE INTERACTION BY DEFAULT</span>
                            <span>03 / RELATIONAL NORMALIZATION</span>
                            <span>04 / HUMAN-CENTERED INTERFACES</span>
                        </div>
                    </section>

                    <section className="section pt-0" id="education">
                        <div className="experience-row experience-row-secondary">
                            <div>
                                <SectionLabel>Education</SectionLabel>
                            </div>
                            <div className="experience-main">
                                <span>2020 — 2025</span>
                                <h3>Bachelor of Computer Applications</h3>
                                <p>Tribhuvan University</p>
                            </div>
                            <p>
                                In-depth study of computer science foundations, relational database management, data
                                structures, and modern software architectures.
                            </p>
                        </div>
                    </section>

                    <section className="contact section" id="contact">
                        <div className="contact-copy">
                            <SectionLabel>Transmission</SectionLabel>
                            <h2>
                                Need an engineer
                                <br/>
                                <span>who owns the system?</span>
                            </h2>
                            <p>
                                I am open to full-time engineering roles, creative technologist partnerships, and
                                high-impact contract systems. Send your project parameters or challenges.
                            </p>
                            <a
                                href="mailto:mhrjan0@gmail.com"
                                onClick={() => soundEngine.relayClick()}
                            >
                                <Mail/> mhrjan0@gmail.com
                            </a>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="field-grid">
                                <label>
                                    Name
                                    <input name="name" required placeholder="Jane Doe"/>
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
                                    {sending ? <span className="sending-dot"/> : <Send/>}
                                </button>
                            </div>
                        </form>
                    </section>
                </main>

                {/* Ergonomic Mobile Dock for Thumb Navigation */}
                <ErgonomicMobileDock onDownloadCV={createResume}/>

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
                            <Github/>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/ramesh-mhr-1b0514337"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn Profile"
                            onClick={() => soundEngine.tick()}
                        >
                            <Linkedin/>
                        </a>
                        <a
                            href="#top"
                            aria-label="Back to top of dossier"
                            onClick={() => soundEngine.relayClick()}
                        >
                            <ArrowUpRight/>
                        </a>
                    </div>
                </footer>
            </div>
        </MotionConfig>
    );
}
