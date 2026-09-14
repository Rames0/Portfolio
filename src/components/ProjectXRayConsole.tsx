"use client";

import { useAnimate, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  Cpu,
  Database,
  Layers,
  Server,
  Terminal,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { soundEngine } from "@/lib/haptics";
import { MOTION } from "@/lib/motion";

export type ProjectViewMode = "surface" | "architecture" | "kernel";

export interface ArchitectureNode {
  id: string;
  label: string;
  type: "client" | "edge" | "service" | "db";
  detail: string;
  protocol: string;
  latency: string;
}

export interface TelemetryLog {
  timestamp: string;
  channel: string;
  message: string;
  latency: string;
  level: "info" | "ok" | "warn";
}

export interface SpecimenProject {
  id: string;
  number: string;
  title: string;
  type: string;
  client: string;
  stack: string[];
  description: string;
  role?: string;
  image: string;
  url: string;
  metrics: { label: string; value: string }[];
  architecture: {
    overview: string;
    nodes: ArchitectureNode[];
    dataFlow: string[];
  };
  telemetryLogs: TelemetryLog[];
}

export const ALL_SPECIMENS: SpecimenProject[] = [
  {
    id: "lucazsoft-pos",
    number: "01",
    title: "Lucazsoft POS",
    type: "Restaurant Operating Engine",
    client: "Active Commercial Deployment",
    stack: ["Laravel 11", "MariaDB ACID", "Node.js", "WebSockets"],
    description:
      "Engineered point-of-sale operational architecture covering real-time kitchen display synchronization, touch-ergonomic billing counter, and local-first offline order buffering to survive network drops.",
    role: "Full-stack architecture, transactional workflows, KDS duplex streams, inventory reconciliation, and deployment.",
    image: "/Lucaz.png",
    url: "https://lucazsoft.com/login",
    metrics: [
      { label: "Dispatch Stream", value: "Sub-5ms Duplex Sync" },
      { label: "Architecture", value: "Local-First WebSocket Mesh" },
      { label: "Database Lock", value: "MariaDB ACID Row Locks" },
    ],
    architecture: {
      overview:
        "Local-first client queue synchronized with Node.js WebSocket broker and Laravel transactional ledger.",
      nodes: [
        {
          id: "pos-terminal",
          label: "Counter Terminal",
          type: "client",
          detail: "Optimistic offline action buffer with atomic local commit",
          protocol: "IndexedDB / Web Worker",
          latency: "0.8ms",
        },
        {
          id: "socket-relay",
          label: "Live Pub/Sub Relay",
          type: "edge",
          detail: "Node.js WebSocket cluster managing duplex terminal mesh",
          protocol: "WSS / TCP Frame",
          latency: "4.2ms",
        },
        {
          id: "core-pipeline",
          label: "Transactional API",
          type: "service",
          detail: "Laravel 11 kernel handling tax rules, splits, and role auth",
          protocol: "HTTP/2 REST + Job Queue",
          latency: "14ms",
        },
        {
          id: "db-ledger",
          label: "MariaDB Cluster",
          type: "db",
          detail: "Row-locked transactional tables for stock deduction",
          protocol: "InnoDB Row Locks",
          latency: "2.1ms",
        },
      ],
      dataFlow: [
        "Order input recorded on POS Terminal ➔ Local buffer state updated",
        "WSS stream emits order payload to Live Pub/Sub Relay",
        "Transactional API validates inventory bounds & commits invoice",
        "Kitchen display and cash drawer receive instant push ack",
      ],
    },
    telemetryLogs: [
      {
        timestamp: "19:30:11.002",
        channel: "POS_INTAKE",
        message: "Terminal [T-04] staged 6 items (Table 12)",
        latency: "0.9ms",
        level: "info",
      },
      {
        timestamp: "19:30:11.012",
        channel: "SOCKET_BROKER",
        message: "Dispatched frame to kitchen station #2",
        latency: "3.8ms",
        level: "ok",
      },
      {
        timestamp: "19:30:11.028",
        channel: "DB_TRANSACTION",
        message: "MariaDB COMMIT transaction #82914 with lock release",
        latency: "11.2ms",
        level: "ok",
      },
      {
        timestamp: "19:30:11.034",
        channel: "STOCK_AUDIT",
        message: "Inventory balances reconciled across ingredients",
        latency: "4.1ms",
        level: "info",
      },
    ],
  },
  {
    id: "ambience-infosys",
    number: "02",
    title: "Ambience Infosys",
    type: "Enterprise Corporate Platform",
    client: "Nepali IT Enterprise",
    stack: ["Next.js 16", "React 19", "Tailwind CSS", "TypeScript"],
    description:
      "Architected and deployed the public platform for an established IT firm, transforming a dense services catalogue into an effortless, ultra-responsive editorial experience with sub-second page delivery.",
    role: "Designed and implemented the corporate framework, SEO-optimized content workflows, and reliable server-side data fetching.",
    image: "/Ambience.png",
    url: "https://ambienceinfosys.com.np/",
    metrics: [
      { label: "Lighthouse Score", value: "100 Performance Score" },
      { label: "Layout Shift", value: "0.00 CLS (Zero Shift)" },
      { label: "Rendering", value: "React 19 Server Components" },
    ],
    architecture: {
      overview:
        "Next.js App Router with React Server Component boundaries and edge caching.",
      nodes: [
        {
          id: "edge-edge",
          label: "Vercel Edge Network",
          type: "edge",
          detail:
            "Geo-routed static bundles with stale-while-revalidate headers",
          protocol: "HTTP/3 QUIC",
          latency: "12ms",
        },
        {
          id: "rsc-layer",
          label: "Next.js Core Engine",
          type: "service",
          detail: "Server components streaming zero-runtime client chunks",
          protocol: "React Server Wire Protocol",
          latency: "8ms",
        },
        {
          id: "node-inquiry",
          label: "Node.js Gateway",
          type: "service",
          detail: "Inquiry rate-limiting and enterprise dispatch broker",
          protocol: "TLS 1.3 REST",
          latency: "18ms",
        },
      ],
      dataFlow: [
        "Edge routing checks edge cache and delivers pre-rendered HTML",
        "Interactive islands hydrate progressively with zero layout shift",
        "Inquiry form streams via secure Node backend endpoint",
      ],
    },
    telemetryLogs: [
      {
        timestamp: "12:14:02.108",
        channel: "EDGE_CDN",
        message: "Cache HIT on primary service catalogue",
        latency: "2.1ms",
        level: "ok",
      },
      {
        timestamp: "12:14:02.119",
        channel: "RSC_STREAM",
        message: "Streaming UI chunks to client without hydration stalls",
        latency: "9.0ms",
        level: "ok",
      },
      {
        timestamp: "12:14:02.140",
        channel: "PERF_AUDIT",
        message: "LCP rendering successful; FID in safe threshold",
        latency: "0.2ms",
        level: "info",
      },
    ],
  },
  {
    id: "rakmina-consultancy",
    number: "03",
    title: "Rakmina Consultancy",
    type: "Multilingual Global Academic Directory",
    client: "Global Study Advisory",
    stack: ["Laravel", "PostgreSQL", "tsvector", "Tailwind CSS"],
    description:
      "Constructed a high-performance multilingual directory for students researching international universities, visa pathways, and country-specific scholarship qualification criteria.",
    role: "Engineered the multi-language localization system and deployment pipelining across 8 targeted international regions.",
    image: "/Rakmina.png",
    url: "https://rakmina.nirc.com.np/",
    metrics: [
      { label: "Search Indexing", value: "Sub-15ms tsvector Match" },
      { label: "Localization", value: "8 International Locales" },
      { label: "Query Engine", value: "PostgreSQL GIN Indexed" },
    ],
    architecture: {
      overview:
        "PostgreSQL tsvector indexing combined with dynamic locale routing and cache warming.",
      nodes: [
        {
          id: "lang-router",
          label: "Locale Middleware",
          type: "edge",
          detail:
            "Header and route-based language negotiation with cookie persistence",
          protocol: "HTTP Header Parser",
          latency: "1.5ms",
        },
        {
          id: "search-service",
          label: "Search & Query Core",
          type: "service",
          detail: "University filter service leveraging PostgreSQL GIN indexes",
          protocol: "PDO Query",
          latency: "11ms",
        },
        {
          id: "pg-cluster",
          label: "PostgreSQL Database",
          type: "db",
          detail:
            "Foreign key relational integrity with localized country content",
          protocol: "PostgreSQL Wire v3",
          latency: "2.4ms",
        },
      ],
      dataFlow: [
        "User selects destination or switches interface language",
        "Middleware resolves locale context and fetches localized dataset",
        "GIN-indexed search returns filtered institutions in under 15ms",
      ],
    },
    telemetryLogs: [
      {
        timestamp: "10:19:55.004",
        channel: "LOCALE_RESOLV",
        message: "Resolved language context: [en_US ➔ ja_JP]",
        latency: "1.2ms",
        level: "info",
      },
      {
        timestamp: "10:19:55.018",
        channel: "PG_TSVECTOR",
        message: "Query executed on university catalog index",
        latency: "9.5ms",
        level: "ok",
      },
      {
        timestamp: "10:19:55.022",
        channel: "RENDER_OK",
        message: "Catalog view rendered with 48 matched courses",
        latency: "3.1ms",
        level: "ok",
      },
    ],
  },
  {
    id: "gwp-portal",
    number: "04",
    title: "GWP - Government Web Portal",
    type: "Civic Public Infrastructure",
    client: "Public Municipal Administration",
    stack: ["Java", "Grails MVC", "Spring Security", "MariaDB"],
    description:
      "Secure, accessible portal consolidating 50+ government services for citizens. Features role-based access control, document verification pipelines, and high-availability public record queries.",
    role: "Full-stack development of administrative workflows, document processing modules, reporting interfaces, and production integrations.",
    image: "/GWP.png",
    url: "https://github.com/Rames0",
    metrics: [
      { label: "Municipal Scope", value: "50+ Public Services" },
      { label: "Security Kernel", value: "Spring Security RBAC" },
      { label: "Accessibility", value: "WCAG 2.1 AA Compliant" },
    ],
    architecture: {
      overview:
        "Enterprise Grails MVC runtime with Spring Security RBAC, Hibernate/GORM ORM abstraction, and accessible multi-tenant citizen services.",
      nodes: [
        {
          id: "citizen-portal-ui",
          label: "Citizen Web Interface",
          type: "client",
          detail:
            "WCAG 2.1 AA accessible semantic forms with client-side verification and multi-device usability",
          protocol: "HTTPS / TLS 1.3",
          latency: "1.2ms",
        },
        {
          id: "security-guard",
          label: "Spring Security & RBAC",
          type: "edge",
          detail:
            "Role-based access filter chain with CSRF prevention and departmental authorization checks",
          protocol: "Spring Filter Chain",
          latency: "2.8ms",
        },
        {
          id: "grails-kernel",
          label: "Grails MVC Engine",
          type: "service",
          detail:
            "Java/Groovy application service orchestrating workflow lifecycles and document status tracking",
          protocol: "JVM Execution / REST",
          latency: "16ms",
        },
        {
          id: "gorm-ledger",
          label: "MariaDB Relational Store",
          type: "db",
          detail:
            "ACID compliant relational schema with automated audit stamps and partitioned record tables",
          protocol: "GORM / JDBC",
          latency: "2.4ms",
        },
      ],
      dataFlow: [
        "Citizen inputs application or checks service docket status",
        "Spring Security verifies role authorization and CSRF token integrity",
        "Grails controllers execute business logic and validate document payloads",
        "GORM commits state change to MariaDB and issues tamper-proof receipt",
      ],
    },
    telemetryLogs: [
      {
        timestamp: "14:32:01.002",
        channel: "ROUTER_INLET",
        message: "Citizen portal dispatch verified: [SRV-CIVIC-48]",
        latency: "1.2ms",
        level: "ok",
      },
      {
        timestamp: "14:32:01.018",
        channel: "SPRING_RBAC",
        message: "Role authorization cleared for administrative auditor",
        latency: "2.8ms",
        level: "ok",
      },
      {
        timestamp: "14:32:01.034",
        channel: "GORM_HIBERNATE",
        message: "ACID transaction committed with immutable audit stamp",
        latency: "14.5ms",
        level: "ok",
      },
      {
        timestamp: "14:32:01.050",
        channel: "RECEIPT_ENGINE",
        message: "Tamper-proof tracking docket generated for citizen",
        latency: "1.9ms",
        level: "info",
      },
    ],
  },
  {
    id: "kansai-institute",
    number: "05",
    title: "Kansai Japanese Language",
    type: "Education & Admissions Portal",
    client: "Language & Education Institute",
    stack: ["Laravel", "MariaDB", "Tailwind CSS", "Alpine.js"],
    description:
      "Engineered prospective student workflows around the critical path: course curriculum discovery, intake exam schedules, and a streamlined multi-stage admission application engine.",
    image: "/Kansai.png",
    url: "https://kansaijapaneselanguage.com.np/",
    metrics: [
      { label: "Intake Funnel", value: "Multi-Step Verification" },
      { label: "Database", value: "MariaDB Cohort Store" },
      { label: "Ergonomics", value: "Thumb-Zone Flow" },
    ],
    architecture: {
      overview:
        "Multi-step applicant validation pipeline with document storage and automated email triggers.",
      nodes: [
        {
          id: "client-applicant",
          label: "Mobile Applicant UI",
          type: "client",
          detail: "Stepwise form progression with client-side field validation",
          protocol: "Mobile WebKit / Chromium",
          latency: "1.2ms",
        },
        {
          id: "laravel-intake",
          label: "Intake Controller",
          type: "service",
          detail:
            "Laravel pipeline executing CSRF, MIME check, and student ID generation",
          protocol: "HTTPS / REST",
          latency: "22ms",
        },
        {
          id: "db-student",
          label: "MariaDB Student Store",
          type: "db",
          detail:
            "Normalized relational tables for enrollments and intake cohorts",
          protocol: "Prepared SQL",
          latency: "3.5ms",
        },
      ],
      dataFlow: [
        "Prospective student inputs course preference and documentation",
        "Laravel backend parses file attachments and commits student profile",
        "Automated confirmation email scheduled via asynchronous worker queue",
      ],
    },
    telemetryLogs: [
      {
        timestamp: "16:04:40.210",
        channel: "INTAKE_REQ",
        message: "New enrollment submission initiated for JLPT N4 cohort",
        latency: "1.1ms",
        level: "info",
      },
      {
        timestamp: "16:04:40.235",
        channel: "VALIDATOR",
        message: "Passed MIME integrity and contact format verification",
        latency: "14.2ms",
        level: "ok",
      },
      {
        timestamp: "16:04:40.244",
        channel: "QUEUE_WORKER",
        message: "Enqueued student orientation notification email",
        latency: "4.8ms",
        level: "ok",
      },
    ],
  },
  {
    id: "sam-maharjan",
    number: "06",
    title: "Sam Maharjan Creative Folio",
    type: "Experimental 3D Shader Folio",
    client: "Personal Portfolio",
    stack: ["Next.js 16", "Three.js", "WebGL Shaders", "Framer Motion"],
    description:
      "Architected an avant-garde personal digital presence merging real-time 3D shaders and kinetic typography without degrading mobile battery performance or baseline frame rates.",
    image: "/Sam.png",
    url: "https://sammaharjan.com.np/home/",
    metrics: [
      { label: "Rendering Core", value: "WebGL 2.0 Shaders" },
      { label: "Frame Budget", value: "Stable 60.0 fps" },
      { label: "Bundle Delivery", value: "Dynamic Import ()" },
    ],
    architecture: {
      overview:
        "Offscreen canvas rendering and hardware-accelerated transforms with strict fallback pathways.",
      nodes: [
        {
          id: "r3f-canvas",
          label: "Three.js Viewport",
          type: "client",
          detail:
            "Low-overhead mesh geometry with custom GLSL vertex distortion",
          protocol: "WebGL 2.0 Context",
          latency: "16.6ms (60fps)",
        },
        {
          id: "motion-engine",
          label: "Framer Motion Spring",
          type: "client",
          detail:
            "Hardware-accelerated transform interpolation running on compositor thread",
          protocol: "requestAnimationFrame",
          latency: "0.2ms",
        },
        {
          id: "next-bundle",
          label: "Code Splitting Layer",
          type: "edge",
          detail: "Three.js runtime loaded on demand via dynamic import()",
          protocol: "Dynamic ES Module",
          latency: "0.0ms",
        },
      ],
      dataFlow: [
        "Pointer coordinates calculate normalised spring velocities",
        "WebGL uniforms update smoothly on compositor animation ticks",
        "Fallback gracefully disables post-processing on mobile low-power mode",
      ],
    },
    telemetryLogs: [
      {
        timestamp: "21:40:02.802",
        channel: "GL_CONTEXT",
        message: "WebGL2 hardware rendering context initialized",
        latency: "14ms",
        level: "ok",
      },
      {
        timestamp: "21:40:02.818",
        channel: "SHADER_COMPILE",
        message: "Custom GLSL noise shader program linked successfully",
        latency: "6ms",
        level: "ok",
      },
      {
        timestamp: "21:40:02.822",
        channel: "FPS_MONITOR",
        message: "Compositor thread holding stable 60.0 fps",
        latency: "16.6ms",
        level: "ok",
      },
    ],
  },
];

export function ProjectXRayConsole() {
  const reducedMotion = useReducedMotion();
  const [scope, animate] = useAnimate();
  const revision = useRef(0);
  useEffect(
    () => () => {
      revision.current += 1;
    },
    [],
  );
  useEffect(() => {
    if (reducedMotion) {
      revision.current += 1;
      void animate(".project-stage", { opacity: 1 }, { duration: 0 });
    }
  }, [reducedMotion, animate]);

  const transitionTo = async (commit: () => void) => {
    const current = ++revision.current;
    if (reducedMotion) {
      commit();
      return;
    }
    await animate(".project-stage", { opacity: 0.55 }, { duration: 0.1 });
    if (current !== revision.current) return;
    flushSync(commit);
    await animate(
      ".project-stage",
      { opacity: 1 },
      { duration: MOTION.normal, ease: MOTION.curve },
    );
  };
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [mode, setMode] = useState<ProjectViewMode>("surface");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const project = ALL_SPECIMENS[activeProjectIdx];

  const handleSelectProject = (idx: number) => {
    soundEngine.relayClick();
    void transitionTo(() => {
      setActiveProjectIdx(idx);
      setSelectedNodeId(null);
    });
  };

  const handleModeChange = (nextMode: ProjectViewMode) => {
    soundEngine.modeSwitch();
    void transitionTo(() => setMode(nextMode));
  };

  const selectedNode =
    project.architecture.nodes.find((n) => n.id === selectedNodeId) ||
    project.architecture.nodes[0];

  return (
    <div
      ref={scope}
      className="project-console w-full my-6 border border-[var(--surface-border)] bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Top Console Instrument Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-[var(--surface-border)] bg-[var(--bg-card)] px-4 sm:px-6 py-3 gap-2">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[var(--text-primary)]">
          <span className="flex h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-pulse shrink-0" />
          <strong className="font-bold text-[var(--accent-primary)]">
            SYSTEM CONSOLE // ARCHITECTURE AUDIT
          </strong>
          <span className="hidden md:inline text-[var(--text-muted)]">
            [{project.number}: {project.title}]
          </span>
        </div>

        {/* Tactile Tri-Mode Switch */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-[var(--bg-primary)] p-1 border border-[var(--surface-border)] rounded-xl">
          <button
            type="button"
            onClick={() => handleModeChange("surface")}
            aria-pressed={mode === "surface"}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase transition-all rounded-lg ${
              mode === "surface"
                ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Layers size={12} className="shrink-0" />
            <span>01 Surface</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("architecture")}
            aria-pressed={mode === "architecture"}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase transition-all rounded-lg ${
              mode === "architecture"
                ? "bg-[var(--accent-secondary)] text-[var(--bg-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Cpu size={12} className="shrink-0" />
            <span>02 Topology</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("kernel")}
            aria-pressed={mode === "kernel"}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase transition-all rounded-lg ${
              mode === "kernel"
                ? "bg-[var(--accent-tertiary)] text-[var(--bg-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Terminal size={12} className="shrink-0" />
            <span>03 Telemetry</span>
          </button>
        </div>
      </div>

      {/* Project Selector Ribbon */}
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 overflow-x-auto no-scrollbar border-b border-[var(--surface-border)] bg-[var(--bg-secondary)]">
        {ALL_SPECIMENS.map((specimen, idx) => {
          const isActive = idx === activeProjectIdx;
          return (
            <button
              key={specimen.id}
              type="button"
              onClick={() => handleSelectProject(idx)}
              aria-pressed={isActive}
              className={`p-3 text-left border-r last:border-r-0 border-[var(--surface-border)] min-w-[140px] sm:min-w-0 shrink-0 transition-all font-mono ${
                isActive
                  ? "bg-[var(--bg-card)] text-[var(--accent-primary)] border-b-2 border-b-[var(--accent-primary)]"
                  : "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <div className="flex items-center justify-between text-[9px] mb-1 opacity-70">
                <span>{`// ${specimen.number}`}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                )}
              </div>
              <div className="font-bold text-xs truncate">{specimen.title}</div>
            </button>
          );
        })}
      </div>

      {/* Stage Layout */}
      <div className="project-stage grid grid-cols-1 lg:grid-cols-12 bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {/* The Viewport Stage */}
        <div className="relative lg:col-span-8 min-h-[360px] sm:min-h-[480px] border-b lg:border-b-0 lg:border-r border-[var(--surface-border)] flex flex-col justify-between overflow-hidden">
          {/* LENS 1: SURFACE MODE */}
          {mode === "surface" && (
            <div className="relative w-full h-full min-h-[360px] sm:min-h-[480px] flex flex-col justify-between group">
              <div className="absolute inset-0">
                <Image
                  src={project.image}
                  alt={`${project.title} Interface`}
                  fill
                  sizes="(max-width: 900px) 100vw, 60vw"
                  className="object-cover object-top group-hover:scale-[1.015]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-90" />
              </div>

              {/* Top Coordinates */}
              <div className="relative z-10 p-4 sm:p-6 flex justify-between items-start pointer-events-none">
                <span className="font-mono text-[9px] bg-[var(--bg-primary)]/90 px-2.5 py-1 border border-[var(--surface-border)] text-[var(--accent-primary)] rounded-lg">
                  SPECIMEN // {project.number}
                </span>
                <span className="font-mono text-[9px] bg-[var(--bg-primary)]/90 px-2.5 py-1 border border-[var(--surface-border)] text-[var(--text-secondary)] rounded-lg">
                  LIVE INTERFACE
                </span>
              </div>

              {/* Bottom Callout & Live Target Link */}
              <div className="relative z-10 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-3 sm:gap-4">
                <div className="bg-[var(--bg-secondary)]/95 backdrop-blur-md p-4 border border-[var(--surface-border)] rounded-xl max-w-lg">
                  <p className="font-mono text-[10px] text-[var(--accent-primary)] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Zap size={11} />
                    Production Target
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                    {project.description}
                  </p>
                  {project.role && (
                    <div className="mt-3 border-t border-[var(--surface-border)] pt-2">
                      <span className="block font-bold text-[10px] uppercase text-[var(--accent-secondary)] mb-0.5">
                        Architect Role
                      </span>
                      <p className="m-0 text-xs text-[var(--text-secondary)]">
                        {project.role}
                      </p>
                    </div>
                  )}
                </div>

                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-2.5 font-mono text-xs font-bold uppercase hover:opacity-90 transition-all rounded-xl shadow-lg"
                >
                  <span>Launch Live</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          )}

          {/* LENS 2: X-RAY ARCHITECTURE TOPOLOGY */}
          {mode === "architecture" && (
            <div className="relative w-full h-full min-h-[360px] sm:min-h-[480px] p-4 sm:p-8 flex flex-col justify-between bg-[var(--bg-secondary)] font-mono">
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--accent-primary) 1px, transparent 1px), linear-gradient(90deg, var(--accent-primary) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="relative z-10 flex flex-wrap justify-between items-center text-[9px] sm:text-[10px] text-[var(--text-secondary)] border-b border-[var(--surface-border)] pb-2 sm:pb-3 gap-1">
                <span>SYSTEM TOPOLOGY // SERVICE NODES</span>
                <span className="text-[var(--accent-primary)]">
                  SELECT NODE TO AUDIT
                </span>
              </div>

              {/* Node Grid Map */}
              <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 my-4 sm:my-6">
                {project.architecture.nodes.map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  const Icon =
                    node.type === "client"
                      ? Layers
                      : node.type === "edge"
                        ? Zap
                        : node.type === "db"
                          ? Database
                          : Server;

                  return (
                    <button
                      key={node.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        soundEngine.relayClick();
                        setSelectedNodeId(node.id);
                      }}
                      className={`p-3 border text-left transition-all relative rounded-xl ${
                        isSelected
                          ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-[0_0_20px_var(--accent-glow)]"
                          : "border-[var(--surface-border)] bg-[var(--bg-card)] hover:border-[var(--surface-border-strong)]"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1 sm:mb-2">
                        <span className="text-[8px] sm:text-[9px] text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1">
                          <Icon
                            size={10}
                            className="text-[var(--accent-primary)]"
                          />
                          {node.type}
                        </span>
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSelected
                              ? "bg-[var(--accent-primary)]"
                              : "bg-white/20"
                          }`}
                        />
                      </div>
                      <div className="font-bold text-[11px] sm:text-xs text-[var(--text-primary)] mb-0.5 sm:mb-1 truncate">
                        {node.label}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] truncate">
                        {node.protocol}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Node Detail Card */}
              <div className="relative z-10 bg-[var(--bg-card)] border border-[var(--surface-border)] p-4 text-xs rounded-xl">
                <div className="flex flex-wrap justify-between items-center pb-2 mb-2 border-b border-[var(--surface-border)] gap-1">
                  <div className="font-bold text-[var(--accent-primary)] flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <ChevronRight size={12} />
                    AUDIT NODE: {selectedNode.label}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-[var(--accent-secondary)]">
                    LATENCY: {selectedNode.latency}
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] text-[11px] sm:text-xs leading-relaxed mb-3">
                  {selectedNode.detail}
                </p>
                <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] flex flex-wrap gap-1.5">
                  <span className="text-[var(--accent-primary)]">FLOW:</span>
                  {project.architecture.dataFlow.slice(0, 2).map((flow, i) => (
                    <span key={i} className="text-[var(--text-secondary)]">
                      • {flow}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LENS 3: KERNEL TRACE STREAM */}
          {mode === "kernel" && (
            <div className="relative w-full h-full min-h-[360px] sm:min-h-[480px] p-4 sm:p-6 bg-[var(--bg-primary)] font-mono text-[10px] sm:text-[11px] flex flex-col justify-between overflow-y-auto">
              <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-[var(--surface-border)] text-[var(--text-secondary)]">
                <span className="flex items-center gap-2 text-[10px] sm:text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-ping" />
                  REQUEST TELEMETRY TRACE
                </span>
                <span className="text-[var(--accent-primary)] flex items-center gap-1 text-[9px] sm:text-[10px]">
                  <Activity size={11} /> LIVE METRICS
                </span>
              </div>

              <div className="space-y-2.5 my-3 sm:my-4">
                {project.telemetryLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 p-2.5 bg-[var(--bg-card)] border-l-2 border-[var(--accent-primary)] font-mono rounded"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[var(--text-muted)] text-[9px]">
                        0{idx + 1}
                      </span>
                      <span className="text-[var(--accent-primary)] font-bold">
                        [{log.channel}]
                      </span>
                    </div>
                    <span className="text-[var(--text-secondary)] flex-1 text-[10px] sm:text-[11px]">
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--surface-border)] text-[var(--text-muted)] flex flex-wrap justify-between items-center text-[9px] sm:text-[10px] gap-1 rounded-xl">
                <span>Verified high-concurrency production pipeline.</span>
                <span className="text-[var(--accent-primary)] font-bold">
                  ACTIVE SYSTEM SLA
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Specimen Metadata Panel */}
        <div className="project-metadata lg:col-span-4 p-5 sm:p-8 flex flex-col justify-between bg-[var(--bg-card)] text-[var(--text-primary)]">
          <div>
            <div className="font-mono text-[9px] sm:text-[10px] text-[var(--text-muted)] tracking-widest uppercase mb-1.5 flex items-center gap-2">
              <span>PROJECT SPECIFICATIONS</span>
              <span className="h-px bg-[var(--surface-border)] flex-1" />
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-1">
              {project.title}
            </h3>
            <p className="font-mono text-[11px] sm:text-xs text-[var(--accent-primary)] uppercase mb-4 sm:mb-6">
              {project.type} · {project.client}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-6">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 text-[9px] sm:text-[10px] font-mono bg-[var(--bg-secondary)] border border-[var(--surface-border)] text-[var(--text-secondary)] rounded-md"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Performance & Architecture Metrics */}
            <div className="space-y-2.5 sm:space-y-3.5 border-t border-[var(--surface-border)] pt-4 sm:pt-5 mb-5 sm:mb-6">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="project-specification flex justify-between items-baseline"
                >
                  <span className="font-mono text-[10px] sm:text-xs text-[var(--text-muted)] uppercase">
                    {m.label}
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-[var(--text-primary)]">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--surface-border)] pt-4 sm:pt-6">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-xs font-bold uppercase hover:opacity-90 transition-opacity rounded-xl shadow-lg"
            >
              <span>Inspect Live Deployment</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
