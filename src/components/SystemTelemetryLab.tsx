"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import { soundEngine } from "@/lib/haptics";
import { Terminal, Database, Webhook, ShieldAlert, Cpu, Server, Activity, Users, Rss } from "lucide-react";

type NodeId =
  | "client"
  | "api"
  | "validation"
  | "service"
  | "db"
  | "event"
  | "socket"
  | "client_sync";

interface ArchNode {
  id: NodeId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  purpose: string;
  x: number;
  y: number;
}

const NODES: ArchNode[] = [
  { id: "client", label: "CLIENT", icon: Terminal, purpose: "Initiates request and consumes UI state.", x: 0, y: 0 },
  { id: "api", label: "API GATEWAY", icon: Webhook, purpose: "Ingresses traffic, terminates SSL, rate-limits.", x: 1, y: 0 },
  { id: "validation", label: "VALIDATION", icon: ShieldAlert, purpose: "Sanitizes payloads and verifies auth JWTs.", x: 2, y: 0 },
  { id: "service", label: "SERVICE CORE", icon: Cpu, purpose: "Business logic and transaction orchestration.", x: 3, y: 0 },
  { id: "db", label: "DATABASE", icon: Database, purpose: "ACID transactions & relational persistence.", x: 4, y: 0 },
  { id: "event", label: "EVENT BUS", icon: Rss, purpose: "Decouples async state mutations (Pub/Sub).", x: 4, y: 1 },
  { id: "socket", label: "WEBSOCKET", icon: Server, purpose: "Maintains full-duplex client connections.", x: 2, y: 1 },
  { id: "client_sync", label: "CLIENT POOL", icon: Users, purpose: "Multiple consumers receive live broadcast.", x: 0, y: 1 },
];

type SimMode = "REQUEST" | "TRANSACTION" | "REAL-TIME" | "FAILURE";

interface SimStep {
  nodeId: NodeId;
  status: "idle" | "running" | "success" | "error";
  log: string;
  durationMs: number;
}

const FLOWS: Record<SimMode, SimStep[]> = {
  REQUEST: [
    { nodeId: "client", status: "running", log: "REQUEST_INITIATED", durationMs: 400 },
    { nodeId: "api", status: "running", log: "PAYLOAD_RECEIVED", durationMs: 400 },
    { nodeId: "validation", status: "success", log: "AUTH_VALIDATED", durationMs: 400 },
    { nodeId: "service", status: "running", log: "SERVICE_ROUTED", durationMs: 400 },
    { nodeId: "db", status: "success", log: "QUERY_RESOLVED", durationMs: 600 },
    { nodeId: "service", status: "success", log: "DATA_FORMATTED", durationMs: 400 },
    { nodeId: "api", status: "success", log: "RESPONSE_SENT", durationMs: 300 },
    { nodeId: "client", status: "success", log: "STATE_UPDATED", durationMs: 600 },
  ],
  TRANSACTION: [
    { nodeId: "client", status: "running", log: "MUTATION_REQUESTED", durationMs: 300 },
    { nodeId: "api", status: "running", log: "TRAFFIC_ROUTED", durationMs: 300 },
    { nodeId: "service", status: "running", log: "TRANSACTION_BEGIN", durationMs: 400 },
    { nodeId: "db", status: "running", log: "ROW_LOCKED", durationMs: 500 },
    { nodeId: "db", status: "success", log: "COMMIT_SUCCESS", durationMs: 500 },
    { nodeId: "service", status: "success", log: "TRANSACTION_CLOSED", durationMs: 300 },
    { nodeId: "client", status: "success", log: "UI_OPTIMISTIC_CONFIRM", durationMs: 600 },
  ],
  "REAL-TIME": [
    { nodeId: "db", status: "success", log: "MUTATION_COMMITTED", durationMs: 500 },
    { nodeId: "event", status: "running", log: "TOPIC_PUBLISHED", durationMs: 400 },
    { nodeId: "socket", status: "running", log: "BROADCAST_FANOUT", durationMs: 400 },
    { nodeId: "client_sync", status: "success", log: "CLIENTS_SYNCHRONIZED", durationMs: 800 },
  ],
  FAILURE: [
    { nodeId: "client", status: "running", log: "MUTATION_REQUESTED", durationMs: 400 },
    { nodeId: "api", status: "running", log: "TRAFFIC_ROUTED", durationMs: 300 },
    { nodeId: "service", status: "running", log: "TRANSACTION_BEGIN", durationMs: 400 },
    { nodeId: "db", status: "error", log: "DEADLOCK_DETECTED", durationMs: 700 },
    { nodeId: "service", status: "error", log: "ROLLBACK_EXECUTED", durationMs: 500 },
    { nodeId: "api", status: "error", log: "503_ERROR_THROWN", durationMs: 300 },
    { nodeId: "client", status: "error", log: "RECOVERY_STATE_LOADED", durationMs: 800 },
  ],
};

export function SystemTelemetryLab() {
  const reducedMotion = useReducedMotion();
  const labRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<SimMode>("REQUEST");
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [logs, setLogs] = useState<{ time: string; msg: string; type: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [inspectedNode, setInspectedNode] = useState<NodeId | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    const stop = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsRunning(false);
      setActiveStep(-1);
    };
    if (reducedMotion) { stop(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop();
    });
    if (labRef.current) observer.observe(labRef.current);
    const onVisibility = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isRunning, reducedMotion]);

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  // Clean up
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const addLog = (msg: string, type: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now.getMilliseconds().toString().padStart(3, "0")}`;
    setLogs((prev) => [...prev.slice(-12), { time, msg, type }]);
  };

  const startSimulation = (selectedMode: SimMode = mode) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMode(selectedMode);
    if (reducedMotion) {
      setLogs(FLOWS[selectedMode].map((step, index) => ({ time: `STEP ${index + 1}`, msg: step.log, type: step.status })));
      setActiveStep(-1);
      setIsRunning(false);
      return;
    }
    setLogs([]);
    setActiveStep(0);
    setIsRunning(true);
    processStep(selectedMode, 0);
    soundEngine.modeSwitch();
    addLog(`INITIALIZING [${selectedMode}] FLOW =========`, "info");
  };

  const processStep = (currentMode: SimMode, stepIndex: number) => {
    const flow = FLOWS[currentMode];
    if (stepIndex >= flow.length) {
      setIsRunning(false);
      setActiveStep(-1);
      addLog("SIMULATION IDLE", "info");
      return;
    }

    const step = flow[stepIndex];
    setActiveStep(stepIndex);
    
    if (step.status === "error") {
      soundEngine.modeSwitch();
    } else {
      soundEngine.tick();
    }

    addLog(step.log, step.status);

    timerRef.current = setTimeout(() => {
      processStep(currentMode, stepIndex + 1);
    }, step.durationMs);
  };

  const handleModeSelect = (m: SimMode) => {
    if (isRunning) {
      if (timerRef.current) clearTimeout(timerRef.current);
      addLog("SIMULATION ABORTED", "error");
    }
    startSimulation(m);
  };

  const currentFlow = FLOWS[mode];
  const currentNodeId = activeStep >= 0 ? currentFlow[activeStep].nodeId : null;
  const currentStatus = activeStep >= 0 ? currentFlow[activeStep].status : "idle";

  return (
    <div ref={labRef} className="w-full bg-[#121310] font-mono text-[#F4F3EE] border border-[#2C2E29]">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-stretch justify-between border-b border-[#2C2E29] bg-[#161714]">
        <div className="px-4 py-3 flex items-center justify-between sm:justify-start gap-4 border-b sm:border-b-0 border-[#2C2E29]">
          <div className="flex items-center gap-3">
            <Activity size={16} className="text-[#38BDF8]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E3C849]">
              Architecture Simulation
            </span>
          </div>
          <span className="px-1.5 py-0.5 bg-[#1A1C16] text-[9px] uppercase border border-[#3C3E37] text-white">
            {isRunning ? "ACTIVE" : "READY"}
          </span>
        </div>
        
        <div className="flex items-center overflow-x-auto no-scrollbar border-l border-[#2C2E29]">
          {(Object.keys(FLOWS) as SimMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeSelect(m)}
              className={`px-4 py-3 text-[10px] sm:text-xs font-bold uppercase whitespace-nowrap transition-colors border-r border-[#2C2E29] ${
                mode === m && isRunning
                  ? "bg-[#E3C849] text-[#121310]"
                  : "text-[#888] hover:text-[#F4F3EE] hover:bg-[#1A1C16]"
              }`}
            >
              {m}
            </button>
          ))}
          {!isRunning && (
            <button
              onClick={() => startSimulation(mode)}
              className="px-4 py-3 text-[10px] sm:text-xs font-bold uppercase whitespace-nowrap text-[#10B981] hover:bg-[#10B981]/10 transition-colors"
            >
              RUN DEFAULT
            </button>
          )}
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="relative p-6 sm:p-12 min-h-[440px] flex items-center justify-center overflow-hidden z-0">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#F4F3EE 1px, transparent 1px), linear-gradient(90deg, #F4F3EE 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />

        {/* Nodes Grid Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8 relative w-full max-w-5xl z-10">
          
          {NODES.map((node) => {
            const isActive = currentNodeId === node.id;
            const isError = isActive && currentStatus === "error";
            const isSuccess = isActive && currentStatus === "success";
            
            let colorCls = "border-[#2C2E29] text-[#888] bg-[#161714]";
            let glow = "0px 0px 0px 0px rgba(0,0,0,0)";
            
            if (isActive) {
              if (isError) {
                colorCls = "border-[#FF5500] text-[#FF5500] bg-[#FF5500]/10";
                glow = "0px 0px 30px 2px rgba(255,85,0,0.35)";
              } else if (isSuccess) {
                colorCls = "border-[#10B981] text-[#10B981] bg-[#10B981]/10";
                glow = "0px 0px 30px 2px rgba(16,185,129,0.35)";
              } else {
                colorCls = "border-[#38BDF8] text-[#38BDF8] bg-[#38BDF8]/10";
                glow = "0px 0px 30px 2px rgba(56,189,248,0.35)";
              }
            }

            return (
              <motion.button
                key={node.id}
                aria-label={`${node.label}: ${node.purpose}`}
                onFocus={() => setInspectedNode(node.id)}
                onBlur={() => setInspectedNode(null)}
                onClick={() => setInspectedNode(inspectedNode === node.id ? null : node.id)}
                onMouseEnter={() => {
                  soundEngine.tick();
                  setInspectedNode(node.id);
                }}
                onMouseLeave={() => setInspectedNode(null)}
                style={{ 
                  '--lg-col': node.x + 1,
                  '--lg-row': node.y + 1
                } as React.CSSProperties}
                className={`lab-node relative flex flex-col items-center justify-center gap-3 p-4 sm:p-5 border min-w-0 lg:[grid-column:var(--lg-col)] lg:[grid-row:var(--lg-row)] ${colorCls} cursor-pointer group`}
                animate={{
                  scale: !reducedMotion && isActive ? 1.015 : 1,
                  boxShadow: reducedMotion ? "none" : glow
                }}
                transition={{ duration: reducedMotion ? 0 : MOTION.fast, ease: MOTION.curve }}
              >
                <node.icon size={28} className="opacity-80" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center">
                  {node.label}
                </span>

                {/* Node Inspector Tooltip */}
                <AnimatePresence>
                  {inspectedNode === node.id && (
                    <motion.div
                      initial={reducedMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0 : MOTION.fast }}
                      className="absolute bottom-[115%] left-1/2 -translate-x-1/2 w-48 sm:w-56 p-3 bg-[#EAE8DF] border border-[#161714] z-50 shadow-[6px_6px_0_#161714] text-[#161714] text-left pointer-events-none"
                    >
                      <strong className="block text-[10px] sm:text-xs mb-1.5 font-bold text-[#E3C849] bg-[#161714] px-1.5 py-0.5 inline-block">{node.label}</strong>
                      <p className="text-[10px] sm:text-xs m-0 leading-snug font-sans font-medium text-[#444] mix-blend-multiply">{node.purpose}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-t border-[#2C2E29] bg-[#0C0D0A]">
        
        {/* State Panel */}
        <div className="md:col-span-4 p-4 sm:p-5 border-b md:border-b-0 md:border-r border-[#2C2E29]">
          <div className="text-[10px] sm:text-xs text-[#666] font-bold uppercase tracking-widest mb-4">Core Telemetry</div>
          <div className="font-mono space-y-3">
            {currentNodeId ? (
              <>
                <div className="flex justify-between text-[11px] sm:text-xs items-center">
                  <span className="text-[#888]">NODE_ID</span>
                  <span className="text-[#E3C849] font-bold bg-[#E3C849]/10 px-1.5 py-0.5">{currentNodeId}</span>
                </div>
                <div className="flex justify-between text-[11px] sm:text-xs items-center">
                  <span className="text-[#888]">STATUS</span>
                  <span className={currentStatus === "error" ? "text-[#FF5500] font-bold uppercase" : currentStatus === "success" ? "text-[#10B981] font-bold uppercase" : "text-[#38BDF8] font-bold uppercase"}>
                    {currentStatus}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] sm:text-xs items-center">
                  <span className="text-[#888]">PAYLOAD_TRK</span>
                  <span className="text-[#F4F3EE] tabular-nums">{currentFlow[activeStep].durationMs}ms</span>
                </div>
              </>
            ) : (
              <div className="text-xs text-[#555] italic h-[76px] flex items-center justify-center border border-dashed border-[#2C2E29]">
                Awaiting packet injection...
              </div>
            )}
          </div>
        </div>

        {/* Console Log */}
        <div className="md:col-span-8 p-4 sm:p-5 bg-[#121310] h-[160px] overflow-y-auto" ref={logRef}>
          {logs.length === 0 ? (
            <div className="text-xs text-[#444] italic">Booting architecture metrics...</div>
          ) : (
            logs.map((L, i) => {
              let color = "text-[#A6A89F]";
              if (L.type === "error") color = "text-[#FF5500] font-bold";
              else if (L.type === "success") color = "text-[#10B981]";
              else if (L.type === "running") color = "text-[#38BDF8]";
              else if (L.type === "info") color = "text-[#E3C849]";
              
              return (
                <div key={i} className={`text-[10px] sm:text-[11px] mb-2 flex gap-3 ${color} font-mono mix-blend-screen leading-tight`}>
                  <span className="opacity-60 shrink-0 tabular-nums">[{L.time}]</span>
                  <span className="break-all">{L.msg}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
