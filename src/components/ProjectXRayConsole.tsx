"use client";

import { AnimatePresence, motion } from "framer-motion";
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
import { useState } from "react";

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
    client: "Hospitality Industry",
    stack: ["Laravel", "MariaDB", "Node.js", "WebSockets"],
    description:
      "Engineered point-of-sale operational architecture covering real-time order flow, split-second kitchen display syncing, and real-time inventory reconciliation under peak dining pressure.",
    role: "Full-stack architecture, transactional workflows, KDS synchronization, inventory logic, and deployment.",
    image: "/Lucaz.png",
    url: "https://lucazsoft.com/login",
    metrics: [
      { label: "Dispatch Latency", value: "Low-Latency Sync" },
      { label: "Architecture", value: "Event-Driven Sockets" },
      { label: "Database Isolation", value: "ACID Transactions" },
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
    type: "Company Public Infrastructure",
    client: "Nepali IT Enterprise",
    stack: ["Next.js", "Node.js", "Tailwind CSS", "TypeScript"],
    description:
      "Architected and deployed the public platform for an established IT firm, transforming a dense services catalogue into an effortless, ultra-responsive editorial experience with sub-second page delivery.",
    role: "Designed and implemented the corporate framework, SEO-optimized content workflows, and reliable server-side data fetching.",
    image: "/Ambience.png",
    url: "https://ambienceinfosys.com.np/",
    metrics: [
      { label: "Lighthouse Score", value: "Optimized Core Vitals" },
      { label: "Hydration Cost", value: "Zero Layout Shift" },
      { label: "Rendering", value: "RSC Streaming" },
    ],
    architecture: {
      overview:
        "Next.js App Router with React Server Component boundaries and edge caching.",
      nodes: [
        {
          id: "edge-edge",
          label: "Vercel Edge Network",
          type: "edge",
          detail: "Geo-routed static bundles with stale-while-revalidate headers",
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
    id: "kansai-institute",
    number: "03",
    title: "Kansai Japanese Language",
    type: "Education & Intake Portal",
    client: "Language & Education Institute",
    stack: ["Laravel", "MariaDB", "Tailwind CSS", "Alpine.js"],
    description:
      "Engineered prospective student workflows around the critical path: course curriculum discovery, intake exam schedules, and a streamlined multi-stage admission application engine.",
    image: "/Kansai.png",
    url: "https://kansaijapaneselanguage.com.np/",
    metrics: [
      { label: "Intake Throughput", value: "Streamlined Lead Intake" },
      { label: "Stack", value: "Laravel / MariaDB" },
      { label: "Mobile Usability", value: "Thumb-Zone Ergonomics" },
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
          detail: "Laravel pipeline executing CSRF, MIME check, and student ID generation",
          protocol: "HTTPS / REST",
          latency: "22ms",
        },
        {
          id: "db-student",
          label: "MariaDB Student Store",
          type: "db",
          detail: "Normalized relational tables for enrollments and intake cohorts",
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
    id: "rakmina-consultancy",
    number: "04",
    title: "Rakmina Consultancy",
    type: "Multilingual Abroad Advisory",
    client: "Global Study Platform",
    stack: ["Laravel", "PostgreSQL", "Localization", "Tailwind CSS"],
    description:
      "Constructed a high-performance multilingual directory for students researching international universities, visa pathways, and country-specific scholarship qualification criteria.",
    role: "Engineered the multi-language localization system and deployment pipelining across 8 targeted international regions.",
    image: "/Rakmina.png",
    url: "https://rakmina.nirc.com.np/",
    metrics: [
      { label: "Localization", value: "Instant Translation" },
      { label: "Database", value: "PostgreSQL Full-Text" },
      { label: "Indexing", value: "Full Destination Schema" },
    ],
    architecture: {
      overview:
        "PostgreSQL tsvector indexing combined with dynamic locale routing and cache warming.",
      nodes: [
        {
          id: "lang-router",
          label: "Locale Middleware",
          type: "edge",
          detail: "Header and route-based language negotiation with cookie persistence",
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
          detail: "Foreign key relational integrity with localized country content",
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
    number: "05",
    title: "GWP - Government Web Portal",
    type: "Citizen Public Infrastructure",
    client: "Public Administration",
    stack: ["Java", "Grails", "JavaScript", "HTML", "CSS", "MariaDB"],
    description:
      "Secure, accessible portal consolidating 50+ government services for citizens. Features role-based access control, document verification pipelines, and high-availability public record queries.",
    role: "Full-stack development of administrative workflows, document processing modules, reporting interfaces, and production integrations.",
    image: "/GWP.png",
    url: "https://github.com/Rames0",
    metrics: [
      { label: "Consolidated Services", value: "50+ Government Portals" },
      { label: "Backend Core", value: "Java / Grails GORM" },
      { label: "Compliance", value: "WCAG & Strict RBAC" },
    ],
    architecture: {
      overview:
        "Enterprise Grails MVC runtime with Spring Security RBAC, Hibernate/GORM ORM abstraction, and accessible multi-tenant citizen services.",
      nodes: [
        {
          id: "citizen-portal-ui",
          label: "Citizen Web Interface",
          type: "client",
          detail: "WCAG 2.1 AA accessible semantic forms with client-side verification and multi-device usability",
          protocol: "HTTPS / TLS 1.3",
          latency: "1.2ms",
        },
        {
          id: "security-guard",
          label: "Spring Security & RBAC",
          type: "edge",
          detail: "Role-based access filter chain with CSRF prevention and departmental authorization checks",
          protocol: "Spring Filter Chain",
          latency: "2.8ms",
        },
        {
          id: "grails-kernel",
          label: "Grails MVC Engine",
          type: "service",
          detail: "Java/Groovy application service orchestrating workflow lifecycles and document status tracking",
          protocol: "JVM Execution / REST",
          latency: "16ms",
        },
        {
          id: "gorm-ledger",
          label: "MariaDB Relational Store",
          type: "db",
          detail: "ACID compliant relational schema with automated audit stamps and partitioned record tables",
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
    id: "sam-maharjan",
    number: "06",
    title: "Sam Maharjan Portfolio",
    type: "Creative Technologist Folio",
    client: "Personal Portfolio",
    stack: ["Next.js", "Framer Motion", "Three.js", "WebGL"],
    description:
      "Architected an avant-garde personal digital presence merging real-time 3D shaders and kinetic typography without degrading mobile battery performance or baseline frame rates.",
    image: "/Sam.png",
    url: "https://sammaharjan.com.np/home/",
    metrics: [
      { label: "Frame Rate", value: "Strict 60fps WebGL" },
      { label: "Bundle Impact", value: "Dynamic Shader Loading" },
      { label: "WebGL Footprint", value: "<18MB GPU Memory" },
    ],
    architecture: {
      overview:
        "Offscreen canvas rendering and hardware-accelerated transforms with strict fallback pathways.",
      nodes: [
        {
          id: "r3f-canvas",
          label: "Three.js Viewport",
          type: "client",
          detail: "Low-overhead mesh geometry with custom GLSL vertex distortion",
          protocol: "WebGL 2.0 Context",
          latency: "16.6ms (60fps)",
        },
        {
          id: "motion-engine",
          label: "Framer Motion Spring",
          type: "client",
          detail: "Hardware-accelerated transform interpolation running on compositor thread",
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
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [mode, setMode] = useState<ProjectViewMode>("surface");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const project = ALL_SPECIMENS[activeProjectIdx];

  const handleSelectProject = (idx: number) => {
    setActiveProjectIdx(idx);
    setSelectedNodeId(null);
  };

  const handleModeChange = (nextMode: ProjectViewMode) => {
    setMode(nextMode);
  };

  const selectedNode =
    project.architecture.nodes.find((n) => n.id === selectedNodeId) ||
    project.architecture.nodes[0];

  return (
    <div className="w-full my-8 sm:my-12 border border-[#161714] bg-[#F4F3EE] shadow-[4px_4px_0px_#161714] sm:shadow-[8px_8px_0px_#161714]">
      {/* Top Console Instrument Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-[#161714] bg-[#EAE8DF] px-3 sm:px-4 py-2.5 sm:py-3 gap-2">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#161714]">
          <span className="flex h-2 w-2 rounded-full bg-[#E3C849] border border-[#161714] animate-pulse shrink-0" />
          <strong className="font-bold">SPECIMEN CONSOLE // X-RAY</strong>
          <span className="hidden md:inline text-[#666860]">
            [{project.number}: {project.title}]
          </span>
        </div>

        {/* Tactile Tri-Mode Switch */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-[#DEDCD2] p-1 border border-[#161714]">
          <button
            type="button"
            onClick={() => handleModeChange("surface")}
            aria-pressed={mode === "surface"}
            className={`flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-1 font-mono text-[9px] sm:text-[10px] font-bold uppercase transition-all ${
              mode === "surface"
                ? "bg-[#161714] text-[#F4F3EE] shadow-sm"
                : "text-[#555650] hover:text-[#161714]"
            }`}
          >
            <Layers size={12} className="shrink-0" />
            <span>01 Surface</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("architecture")}
            aria-pressed={mode === "architecture"}
            className={`flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-1 font-mono text-[9px] sm:text-[10px] font-bold uppercase transition-all ${
              mode === "architecture"
                ? "bg-[#161714] text-[#E3C849] shadow-sm"
                : "text-[#555650] hover:text-[#161714]"
            }`}
          >
            <Cpu size={12} className="shrink-0" />
            <span>02 Arch</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("kernel")}
            aria-pressed={mode === "kernel"}
            className={`flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-1 font-mono text-[9px] sm:text-[10px] font-bold uppercase transition-all ${
              mode === "kernel"
                ? "bg-[#161714] text-[#2BA84A] shadow-sm"
                : "text-[#555650] hover:text-[#161714]"
            }`}
          >
            <Terminal size={12} className="shrink-0" />
            <span>03 Trace</span>
          </button>
        </div>
      </div>

      {/* Project Selector Ribbon (Horizontal scroll on mobile, grid on desktop) */}
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 overflow-x-auto no-scrollbar border-b border-[#161714] bg-[#F4F3EE]">
        {ALL_SPECIMENS.map((specimen, idx) => {
          const isActive = idx === activeProjectIdx;
          return (
            <button
              key={specimen.id}
              type="button"
              onClick={() => handleSelectProject(idx)}
              className={`premium-hover-card p-2.5 sm:p-3 text-left border-r last:border-r-0 border-[#161714] min-w-[140px] sm:min-w-0 shrink-0 transition-all font-mono ${
                isActive
                  ? "bg-[#161714] text-[#F4F3EE]"
                  : "bg-transparent text-[#161714] hover:bg-[#EAE8DF]"
              }`}
            >
              <div className="flex items-center justify-between text-[9px] mb-1 opacity-70">
                <span>// {specimen.number}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E3C849]" />
                )}
              </div>
              <div className="font-bold text-xs truncate">{specimen.title}</div>
            </button>
          );
        })}
      </div>

      {/* Stage Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#121310] text-[#F4F3EE]">
        {/* The Viewport Stage */}
        <div className="relative lg:col-span-8 min-h-[360px] sm:min-h-[480px] border-b lg:border-b-0 lg:border-r border-[#2C2E29] flex flex-col justify-between overflow-hidden">
          <AnimatePresence mode="wait">
            {/* LENS 1: SURFACE MODE */}
            {mode === "surface" && (
              <motion.div
                key={`surface-${project.id}`}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full min-h-[360px] sm:min-h-[480px] flex flex-col justify-between group"
              >
                <div className="absolute inset-0">
                  <Image
                    src={project.image}
                    alt={`${project.title} Interface`}
                    fill
                    sizes="(max-width: 900px) 100vw, 60vw"
                    className="object-cover object-top filter grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121310] via-transparent to-transparent opacity-90" />
                </div>

                {/* Top Coordinates */}
                <div className="relative z-10 p-3 sm:p-5 flex justify-between items-start pointer-events-none">
                  <span className="font-mono text-[9px] bg-[#121310]/85 px-2 py-1 border border-[#3C3E37] text-[#E3C849]">
                    UI-SPECIMEN // {project.number}
                  </span>
                  <span className="font-mono text-[9px] bg-[#121310]/85 px-2 py-1 border border-[#3C3E37] text-[#A6A89F]">
                    CLS: 0.00
                  </span>
                </div>

                {/* Bottom Callout & Live Target Link */}
                <div className="relative z-10 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-3 sm:gap-4">
                  <div className="bg-[#121310]/95 backdrop-blur-sm p-3 sm:p-4 border border-[#3C3E37] max-w-lg">
                    <p className="font-mono text-[10px] text-[#E3C849] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Zap size={11} />
                      Production Intent
                    </p>
                    <p className="text-white text-xs sm:text-sm leading-relaxed">
                      {project.description}
                    </p>
                    {project.role && (
                      <div className="mt-4 border-t border-[#161714]/20 pt-3">
                        <span className="block font-bold text-[10px] uppercase text-[#666860] mb-1">My Role</span>
                        <p className="m-0 text-sm text-white">{project.role}</p>
                      </div>
                    )}
                  </div>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#E3C849] text-[#121310] px-4 py-2.5 font-mono text-xs font-bold uppercase hover:bg-white transition-all shadow-[3px_3px_0px_#000]"
                  >
                    <span>Launch Live</span>
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </motion.div>
            )}

            {/* LENS 2: X-RAY ARCHITECTURE TOPOLOGY */}
            {mode === "architecture" && (
              <motion.div
                key={`arch-${project.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full min-h-[360px] sm:min-h-[480px] p-4 sm:p-8 flex flex-col justify-between bg-[#0F100D] font-mono"
              >
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(#E3C849 1px, transparent 1px), linear-gradient(90deg, #E3C849 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                <div className="relative z-10 flex flex-wrap justify-between items-center text-[9px] sm:text-[10px] text-[#8C8E86] border-b border-[#242621] pb-2 sm:pb-3 gap-1">
                  <span>TOPOLOGY // SERVICE NODES</span>
                  <span className="text-[#E3C849]">TAP NODE TO AUDIT</span>
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
                        onClick={() => {
                          setSelectedNodeId(node.id);
                        }}
                        className={`p-2.5 sm:p-3.5 border text-left transition-all relative ${
                          isSelected
                            ? "border-[#E3C849] bg-[#E3C849]/15 shadow-[0_0_15px_rgba(227,200,73,0.15)]"
                            : "border-[#282A25] bg-[#161714]/80 hover:border-[#666860]"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1 sm:mb-2">
                          <span className="text-[8px] sm:text-[9px] text-[#A6A89F] uppercase tracking-wider flex items-center gap-1">
                            <Icon size={10} className="text-[#E3C849]" />
                            {node.type}
                          </span>
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isSelected ? "bg-[#E3C849]" : "bg-[#444]"
                            }`}
                          />
                        </div>
                        <div className="font-bold text-[11px] sm:text-xs text-white mb-0.5 sm:mb-1 truncate">
                          {node.label}
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-[#8C8E86] truncate">
                          {node.protocol}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Node Detail Card */}
                <div className="relative z-10 bg-[#161714] border border-[#2E3029] p-3 sm:p-4 text-xs">
                  <div className="flex flex-wrap justify-between items-center pb-1.5 sm:pb-2 mb-2 border-b border-[#242621] gap-1">
                    <div className="font-bold text-[#E3C849] flex items-center gap-1.5 text-[11px] sm:text-xs">
                      <ChevronRight size={12} />
                      AUDIT: {selectedNode.label}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-[#8C8E86]">
                      LAT: {selectedNode.latency}
                    </div>
                  </div>
                  <p className="text-[#CCC] text-[11px] sm:text-xs leading-relaxed mb-2 sm:mb-3">
                    {selectedNode.detail}
                  </p>
                  <div className="text-[9px] sm:text-[10px] text-[#8C8E86] flex flex-wrap gap-1.5">
                    <span className="text-[#E3C849]">FLOW:</span>
                    {project.architecture.dataFlow.slice(0, 2).map((flow, i) => (
                      <span key={i} className="text-[#999]">
                        • {flow}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* LENS 3: KERNEL TRACE STREAM */}
            {mode === "kernel" && (
              <motion.div
                key={`kernel-${project.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative w-full h-full min-h-[360px] sm:min-h-[480px] p-4 sm:p-6 bg-black font-mono text-[10px] sm:text-[11px] flex flex-col justify-between overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-[#222] text-[#666]">
                  <span className="flex items-center gap-2 text-[10px] sm:text-[11px]">
                    <span className="h-2 w-2 rounded-full bg-[#2BA84A] animate-ping" />
                    LIVE RUNTIME TELEMETRY
                  </span>
                  <span className="text-[#2BA84A] flex items-center gap-1 text-[9px] sm:text-[10px]">
                    <Activity size={11} /> CONNECTED
                  </span>
                </div>

                <div className="space-y-2.5 my-3 sm:my-4">
                  {project.telemetryLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 p-2 bg-[#0A0A0A] border-l-2 border-[#E3C849] font-mono"
                    >
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[#555] text-[9px]">{log.timestamp}</span>
                        <span className="text-[#E3C849] font-bold">[{log.channel}]</span>
                      </div>
                      <span className="text-[#BBB] flex-1 text-[10px] sm:text-[11px]">{log.message}</span>
                      <span className="text-[#2BA84A] shrink-0 font-semibold text-[9px] sm:text-[10px]">
                        {log.latency}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 sm:p-3 bg-[#111] border border-[#222] text-[#888] flex flex-wrap justify-between items-center text-[9px] sm:text-[10px] gap-1">
                  <span>SYS_MEM: 18.4MB // NODE LTS</span>
                  <span className="text-[#E3C849]">STATUS: 100% HEALTHY</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Specimen Metadata Panel */}
        <div className="lg:col-span-4 p-5 sm:p-8 flex flex-col justify-between bg-[#161714] text-[#F4F3EE]">
          <div>
            <div className="font-mono text-[9px] sm:text-[10px] text-[#8C8E86] tracking-widest uppercase mb-1.5 flex items-center gap-2">
              <span>METRICS & SPECIFICATIONS</span>
              <span className="h-px bg-[#2E3029] flex-1" />
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white mb-1">
              {project.title}
            </h3>
            <p className="font-mono text-[11px] sm:text-xs text-[#E3C849] uppercase mb-4 sm:mb-6">
              {project.type} · {project.client}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-6">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-mono bg-[#21231E] border border-[#383A33] text-[#CCC]"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Performance & Architecture Metrics */}
            <div className="space-y-2.5 sm:space-y-3.5 border-t border-[#2C2E29] pt-4 sm:pt-5 mb-5 sm:mb-6">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="flex justify-between items-baseline"
                >
                  <span className="font-mono text-[10px] sm:text-xs text-[#8C8E86] uppercase">
                    {m.label}
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-white">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#2C2E29] pt-4 sm:pt-6">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-[#F4F3EE] text-[#161714] font-mono text-xs font-bold uppercase hover:bg-[#E3C849] transition-colors"
            >
              <span>Audit Shipped Deployment</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
