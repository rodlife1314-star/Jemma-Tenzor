import { useState, useEffect, useRef } from "react";
import { 
  Terminal, 
  Cpu, 
  Settings, 
  GitBranch, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  Copy, 
  Check, 
  RefreshCw, 
  MessageSquare, 
  Send, 
  Layers, 
  FileCode, 
  Sliders, 
  Database,
  ChevronRight,
  Sparkles,
  Info,
  ExternalLink,
  HelpCircle,
  Activity,
  FolderOpen,
  Boxes,
  Lock,
  ArrowRight,
  Flame,
  FileText
} from "lucide-react";

import { PresetConfigs, ChatMessage } from "./types";

// Dynamic classified subsystems for repository ingestion
const INGEST_SUBSYSTEMS = [
  {
    id: "runtime",
    name: "Runtime Core",
    desc: "C++ engine loaders, VRAM allocators, device checks, and capability alignment layers.",
    path: "src/jemma_tenzor/runtime/",
    files: [
      { name: "engine_manager.py", action: "Loads dynamic engine files & validates weights compatibility", size: "12 KB" },
      { name: "vram_allocator.py", action: "Estimates dynamic CUDA cache allocations based on model profiles", size: "8 KB" }
    ],
    status: "PROPOSED",
    metrics: "Optimized for hardware threads execution"
  },
  {
    id: "inference",
    name: "Inference Services",
    desc: "FastAPI production gateway, tokenizer client wrappers, stream response channels.",
    path: "src/jemma_tenzor/inference/",
    files: [
      { name: "server_gateway.py", action: "FastAPI server running endpoints on port 8000 inside Docker", size: "15 KB" },
      { name: "streaming_client.py", action: "Token yield handler converting binary output stream to JSON", size: "9 KB" }
    ],
    status: "PROPOSED",
    metrics: "Asynchronous stream pipeline enabled"
  },
  {
    id: "validation",
    name: "Ingestion Validation",
    desc: "Strict environment parameters validation, dependency isolation trackers and GPU analysis tools.",
    path: "src/jemma_tenzor/validation/",
    files: [
      { name: "dependency_validation.py", action: "Validates python module library baselines offline", size: "2 KB" },
      { name: "environment_validation.py", action: "Checks host execution ports and secret boundaries", size: "2 KB" },
      { name: "gpu_availability_validation.py", action: "Diagnoses GPU limits & configures fallback CPU tiers", size: "2 KB" },
      { name: "model_manifest_validation.py", action: "Compares model parameters against manifest templates", size: "2 KB" }
    ],
    status: "VERIFIED",
    metrics: "CPU-safe Verification Engine online"
  },
  {
    id: "configs",
    name: "Runtime Configuration Workspace",
    desc: "Templated model profiles, precision parameters configurations and memory allocator limits.",
    path: "config/",
    files: [
      { name: "runtime_config_template.json", action: "Specifies default engine paths and threads safety ceilings", size: "1.5 KB" },
      { name: "model_profile_template.json", action: "Houses attention head counts, layer definitions and profiles", size: "1 KB" },
      { name: "quantization_profile_template.json", action: "Sets AWQ layout compression rates and precision parameters", size: "1 KB" }
    ],
    status: "VERIFIED",
    metrics: "Active runtime workspace profiles loaded"
  },
  {
    id: "schemas",
    name: "Structural Schemas",
    desc: "Formal model declarations, target infrastructure specs and requests/responses constraints.",
    path: "schemas/",
    files: [
      { name: "model_manifest_schema.json", action: "Defines requirements for model weights registration", size: "1 KB" },
      { name: "deployment_manifest_schema.json", action: "Establishes cloud configurations specifications constraints", size: "1 KB" },
      { name: "inference_schema.json", action: "Binds active temperature parameters to API gateway endpoints", size: "1 KB" }
    ],
    status: "VERIFIED",
    metrics: "Strict JSON structural validators linked"
  },
  {
    id: "tests",
    name: "Incremental Sandbox Tests",
    desc: "CPU safe regression tests suites validating core runtime modules without hardware constraints.",
    path: "tests/",
    files: [
      { name: "test_mock_inference.py", action: "Performs mock tokenization & baseline latency assertions", size: "1.5 KB" },
      { name: "test_allocator_boundary.py", action: "Verifies VRAM safety multiplier calculation logic", size: "1 KB" },
      { name: "test_gateway_route.py", action: "Ensures FastAPI schema routers map correctly", size: "1 KB" }
    ],
    status: "VERIFIED",
    metrics: "Clean safe unit test coverage verified"
  },
  {
    id: "plugins",
    name: "Custom CUDA Plugins",
    desc: "GEMM tuning lookups, specialized Attention kernels, and custom compilation configurations.",
    path: "src/jemma_tenzor/plugins/",
    files: [
      { name: "attention_kernels.cu", action: "High-performance custom CUDA matrix execution layer", size: "45 KB" },
      { name: "gemm_plugin_config.ini", action: "Tuned gemm-plugin parameters matching model size metrics", size: "3 KB" }
    ],
    status: "PROPOSED",
    metrics: "Leverages float16 precision limits"
  },
  {
    id: "examples",
    name: "Demos & Benchmarks",
    desc: "Performance profile scripts, offline bench loops, and prompt test templates.",
    path: "src/jemma_tenzor/examples/",
    files: [
      { name: "console_demo.py", action: "Simple execution interface for offline evaluation queries", size: "6 KB" },
      { name: "throughput_test.sh", action: "Batch profile testing script outputting tokens per second status", size: "2 KB" }
    ],
    status: "PROPOSED",
    metrics: "Offline diagnostic utilities"
  },
  {
    id: "tooling",
    name: "Compilation Tooling",
    desc: "Weight converter frameworks and vocabulary format conversion utilities.",
    path: "src/jemma_tenzor/tooling/",
    files: [
      { name: "weight_converter.py", action: "Translates standard HF weights into TRT intermediate checkpoints", size: "28 KB" },
      { name: "tokenizer_formatter.py", action: "Binds model vocabulary configurations directly to runtime servers", size: "5 KB" }
    ],
    status: "PROPOSED",
    metrics: "Low footprint CPU-safe execution"
  },
  {
    id: "deployment",
    name: "Orchestration & Deploy",
    desc: "Immutable Cloud Build scripts, Docker triggers, deployment setups, and manuals.",
    path: "/",
    files: [
      { name: "Dockerfile", action: "Multi-stage high efficacy production TensorRT CUDA container", size: "4 KB", immutable: true },
      { name: "Dockerfile.export", action: "CPU safe validator testing environment container", size: "2 KB", immutable: true },
      { name: "cloudbuild.yaml", action: "Heavy cloud compiler with scale-to-GPU deployment blueprints", size: "3 KB", immutable: true },
      { name: "cloudbuild.export.yaml", action: "ライトウェイト validation pipeline executing CPU safe triggers", size: "2 KB", immutable: true },
      { name: "DEPLOYMENT_NOTES.md", action: "Step-by-step master runbook and pipeline guide", size: "5 KB", immutable: true }
    ],
    status: "VERIFIED",
    metrics: "Protected Octagon Orchestration"
  }
];

export default function App() {
  const [activeSubsystem, setActiveSubsystem] = useState("runtime");
  
  // Master config files loaded from dynamic backend
  const [configs, setConfigs] = useState<PresetConfigs>({
    "cloudbuild.export.yaml": "",
    "Dockerfile.gpu": "",
    "deploy_cloudrun.sh": "",
    "inference.py": ""
  });
  const [activeConfigTab, setActiveConfigTab] = useState<keyof PresetConfigs>("cloudbuild.export.yaml");
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  // Ingestion Dry Run state
  const [ingestStatus, setIngestStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [ingestLogs, setIngestLogs] = useState<string[]>([]);
  const [ingestedModules, setIngestedModules] = useState<string[]>(["deployment", "validation", "configs", "schemas", "tests"]);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Dynamic Chat with Jemma-Tenzor copilot
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "assistant",
      text: "System intelligence online. I am optimized for the Jemma-Tenzor Architecture Ingestion Map. I can formulate gcloud CLI flags, explain the 'Selection ➔ Deployment ➔ Action' model, clarify the multi-stage CUDA compilation stages, or answer manual repository push procedures. Type an inquiry below.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load configs dynamically
  const fetchConfigs = async () => {
    try {
      const resp = await fetch("/api/generate-configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3-8b", hardware: "nvidia-l4", quantization: "int8" })
      });
      if (resp.ok) {
        const data = await resp.json();
        setConfigs({
          "cloudbuild.export.yaml": data["cloudbuild.export.yaml"],
          "Dockerfile.gpu": data["Dockerfile.gpu"],
          "deploy_cloudrun.sh": data["deploy_cloudrun.sh"],
          "inference.py": data["inference.py"]
        });
      }
    } catch (e) {
      console.error("Error grabbing preset maps", e);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  // Handle copy command clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setCopiedFile(true);
    setTimeout(() => {
      setCopiedFile(false);
      setCopiedText("");
    }, 2000);
  };

  // Run structured ingestion simulation checks
  const runIngestionSimulation = () => {
    setIngestStatus("running");
    setIngestLogs([]);
    
    const selectedSub = INGEST_SUBSYSTEMS.find(s => s.id === activeSubsystem);
    const subName = selectedSub?.name || "Target Subsystem";

    const logs = [
      `[INFO] [INGESTION STATE] Initiating Incremental validation for ${subName}...`,
      `[CHECK] Source Repo Check: rodlife1314-star/Pathfinder (branch: main)`,
      `[CHECK] Isolation Guard: Ensuring no overwrite of existing Octagon control definitions. Passed.`,
      `[INFO] Target path locked: ${selectedSub?.path || "root"}`,
      `[PACKAGING] Scanning dependencies and modules for packaging anomalies...`,
      ...(selectedSub?.files.map(f => `[STAGE] Classifying structure: /${selectedSub?.path || ""}${f.name} (${f.size}) - OK`) || []),
      `[VERIFY] Zero hardcoded secrets verification: SUCCESS. Custom values parsed strictly from environment hooks.`,
      `[INFO] Trigger verification payload configured: gcloud builds submit --config cloudbuild.export.yaml`,
      `[SUCCESS] Subsystem ${subName} mapped properly! Clean isolation layer validated. Ready for remote origin upload.`
    ];

    let currentLogLine = 0;
    const interval = setInterval(() => {
      if (currentLogLine < logs.length) {
        setIngestLogs(prev => [...prev, logs[currentLogLine]]);
        currentLogLine++;
      } else {
        clearInterval(interval);
        setIngestStatus("success");
        if (!ingestedModules.includes(activeSubsystem)) {
          setIngestedModules(prev => [...prev, activeSubsystem]);
        }
      }
    }, 400);
  };

  // Submit AI message to copilot backend
  const handleSendChat = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsAiTyping(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context: {
            model: "Jemma-Tenzor Core System Ingestion",
            hardware: "Multi-stage Docker validation",
            quantization: activeSubsystem.toUpperCase()
          }
        })
      });

      if (response.ok) {
        const resData = await response.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "assistant",
          text: resData.text,
          timestamp: new Date().toLocaleTimeString()
        };
        setChatMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error();
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "system",
        text: "🚨 Live copilot backend offline. Ensure your GEMINI_API_KEY is configured inside the platform secrets panel.",
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Trigger quick instruction helpers
  const clickShortcut = (text: string) => {
    handleSendChat(text);
  };

  // Auto Scroll logs & chat
  useEffect(() => {
    terminalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ingestLogs]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  const currSubObj = INGEST_SUBSYSTEMS.find(s => s.id === activeSubsystem);

  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 font-sans selection:bg-[#3b82f6]/30 flex flex-col antialiased">
      
      {/* Top Bar Header */}
      <header className="border-b border-slate-900 bg-[#090b10] px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/10">
            <span className="font-mono text-lg font-black text-white">Ω</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-sm sm:text-base font-bold tracking-wider text-slate-100">OCTAGON OS</h1>
              <span className="text-[9px] bg-blue-950/85 text-blue-400 px-1.5 py-0.5 rounded border border-blue-800/20 font-mono">JEMMA-TENZOR INGESTION</span>
            </div>
            <p className="text-xs text-slate-400">TensorRT Edge LLM Control Center & Subsystem Coordinator</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden md:flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-md border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-mono">rodlife1314@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 bg-[#1e2230]/40 px-3 py-1.5 rounded-md border border-blue-900/20 text-blue-300">
            <GitBranch className="h-3.5 w-3.5" />
            <span className="font-mono text-[10px] font-semibold">Pathfinder:main</span>
          </div>
        </div>
      </header>

      {/* Main Container Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-hidden">
        
        {/* Left Interactive Grid: Subsystem Explorer & Verification Engine (Lg: 7 cols) */}
        <section className="col-span-1 lg:col-span-7 space-y-6">
          
          {/* Top Architecture Map State Overview */}
          <div className="bg-[#0b0c10] border border-slate-900 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Boxes className="h-4.5 w-4.5 text-blue-400" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  1. Structured Ingestion Blueprint Map
                </h2>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Classification Stage Active</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              To ingestion the upstream <strong className="text-slate-300">TensorRT-Edge-LLM</strong> source cleanly, we have categorized the codebase into six modular subsystems below. Original Octagon deployment shells and master triggers are protected under standard immutable validation safeguards.
            </p>

            {/* Micro grid of 6 subsystems */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {INGEST_SUBSYSTEMS.map((sub) => {
                const isIngested = ingestedModules.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubsystem(sub.id)}
                    className={`text-left p-3 rounded-lg border text-xs transition-all flex flex-col justify-between relative overflow-hidden group ${
                      activeSubsystem === sub.id
                        ? "bg-blue-950/20 border-blue-500/60 shadow-lg shadow-blue-900/5 col-span-1"
                        : "bg-[#0c0d12] border-slate-900/80 hover:border-slate-800"
                    }`}
                  >
                    {activeSubsystem === sub.id && (
                      <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                    )}
                    
                    <div>
                      <div className="font-mono text-[11px] font-semibold flex items-center justify-between text-slate-200 group-hover:text-white">
                        <span>{sub.name}</span>
                        {sub.id === "deployment" && <Lock className="h-3 w-3 text-amber-500" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {sub.desc}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-2 border-t border-slate-900/50 flex justify-between items-center text-[9px] font-mono">
                      <span className="text-slate-500 italic">/{sub.id}/</span>
                      {isIngested ? (
                        <span className="text-emerald-400 font-semibold uppercase flex items-center gap-0.5">
                          <Check className="h-2.5 w-2.5" /> Mapped
                        </span>
                      ) : (
                        <span className="text-indigo-400/90 font-medium">Proposed</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subsystem Details & Isolation File Ingestion Target */}
          {currSubObj && (
            <div className="bg-[#0b0c10] border border-slate-900 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                    File Target Map: {currSubObj.name}
                  </span>
                </div>
                <span className="text-[10px] bg-slate-900 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-800">
                  {currSubObj.path}
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-slate-400">
                  Expected target files inside this subsystem during incoming merge steps:
                </div>

                {/* Subsystem file stack */}
                <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                  {currSubObj.files.map((file, fIdx) => (
                    <div 
                      key={fIdx}
                      className="bg-[#07080c] border border-slate-900/60 rounded-lg p-2.5 flex items-center justify-between text-xs hover:border-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-mono text-[11px]">→</span>
                        <div>
                          <div className="font-mono text-slate-200 text-[11.5px] font-medium">{file.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{file.action}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono">{file.size}</span>
                        {file.immutable ? (
                          <span className="text-[9px] bg-amber-950/40 text-amber-500 border border-amber-800/20 rounded px-1.5 font-mono">
                            Immutable
                          </span>
                        ) : (
                          <span className="text-[9px] bg-slate-900 text-slate-400 border border-slate-800 rounded px-1.5 font-mono">
                            Clean Stage
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verification Check Simulator Call */}
                <div className="pt-3 border-t border-slate-900/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Run safe local validation checks to confirm no file path conflicts or upstream configuration drift.
                  </div>
                  
                  <button
                    onClick={runIngestionSimulation}
                    disabled={ingestStatus === "running"}
                    className={`shrink-0 px-3.5 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      ingestStatus === "running"
                        ? "bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/10 cursor-pointer"
                    }`}
                  >
                    {ingestStatus === "running" ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" /> Verifying...
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 fill-white" /> Check {currSubObj.name}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Debug validation Terminal logs */}
          <div className="bg-[#0b0c10] border border-slate-900 rounded-xl p-5 shadow-xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  2. Validation Logs & Trace Analyzer
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Dry-run compiler hooks</span>
            </div>

            <div className="bg-[#050608] border border-slate-900/80 rounded-lg p-3.5 h-[160px] overflow-y-auto font-mono text-[11px] space-y-1 text-slate-400 relative">
              {ingestLogs.length === 0 ? (
                <div className="text-slate-600 flex flex-col items-center justify-center h-full text-center space-y-1">
                  <div>--- Ingestion Isolation Analyzer Terminal ---</div>
                  <p className="text-[10px] max-w-sm">Select any subsystem and hit "Check" above to simulate isolated validation without triggering remote cloud build costs.</p>
                </div>
              ) : (
                <>
                  {ingestLogs.map((log, lIdx) => {
                    let textClass = "text-slate-400";
                    if (log && log.includes("[INFO]")) textClass = "text-blue-400";
                    if (log && log.includes("[CHECK]")) textClass = "text-amber-400/90";
                    if (log && log.includes("[SUCCESS]")) textClass = "text-emerald-400";
                    if (log && log.includes("gcloud")) textClass = "text-slate-100 font-semibold";

                    return (
                      <div key={lIdx} className={`${textClass} leading-relaxed flex gap-2`}>
                        <span className="text-slate-600 select-none">[{String(lIdx + 1).padStart(2, "0")}]</span>
                        <span>{log || ""}</span>
                      </div>
                    );
                  })}
                  <div ref={terminalRef} />
                </>
              )}
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3 text-slate-500" /> Sandbox validation endpoint: E2 CPU safe environment.
              </span>
              <span>Buffer: Active</span>
            </div>
          </div>

        </section>

        {/* Right Interactive Grid: Quick Execution Script and Copilot Dialogue Map (Lg: 5 cols) */}
        <section className="col-span-1 lg:col-span-5 flex flex-col gap-6">

          {/* Core Octagon Production Deployment Script Vault */}
          <div className="bg-[#0b0c10] border border-slate-900 rounded-xl flex flex-col shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-900 bg-[#090b10] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold uppercase tracking-wider font-mono">
                <FileCode className="h-4 w-4 text-blue-400" /> Deploy Command Stack
              </div>

              {/* Copy file trigger button */}
              <button
                onClick={() => handleCopy(configs[activeConfigTab], activeConfigTab)}
                disabled={!configs[activeConfigTab]}
                className="text-[11px] bg-[#1a1c24] hover:bg-[#252834] border border-slate-800 text-slate-200 px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-all text-mono cursor-pointer active:scale-95"
              >
                {copiedFile && copiedText === activeConfigTab ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied Command!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400" /> Copy Script
                  </>
                )}
              </button>
            </div>

            {/* Config key tabs */}
            <div className="flex bg-[#07080c] border-b border-slate-900 text-xs overflow-x-auto">
              {(Object.keys(configs) as Array<keyof PresetConfigs>).map((file) => (
                <button
                  key={file}
                  onClick={() => setActiveConfigTab(file)}
                  className={`px-3 py-2.5 font-mono border-b-2 text-[10.5px] whitespace-nowrap transition-colors flex-1 ${
                    activeConfigTab === file
                      ? "border-blue-500 text-slate-100 bg-[#0b0c10]"
                      : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-[#090a0f]"
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>

            {/* Command viewer content context */}
            <div className="p-4 bg-[#050608]">
              <div className="h-[180px] overflow-y-auto leading-relaxed text-slate-300 font-mono text-[10px] whitespace-pre select-all bg-transparent focus:outline-none scrollbar-thin">
                {configs[activeConfigTab] || `// Compiling standard deployment commands dynamically...`}
              </div>
            </div>

            <div className="px-4 py-2 bg-slate-950 text-[10px] text-slate-500 flex justify-between items-center border-t border-slate-900/60 font-mono">
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3" /> Secure gcloud & pipeline specifications configurations.
              </span>
              <span className="text-emerald-400 font-semibold">Protected</span>
            </div>
          </div>

          {/* Advanced Copilot Dialogue Portal */}
          <div className="bg-[#0b0c10] border border-slate-900 rounded-xl flex flex-col overflow-hidden shadow-xl flex-1 max-h-[460px]">
            <div className="p-4 border-b border-slate-900 bg-[#090b10] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  3. Jemma-Tenzor Core Copilot
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>ACTIVE EXPERT</span>
              </div>
            </div>

            {/* Chat dialog messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#07080c] text-[11px] leading-relaxed max-h-[290px]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div className="text-[9px] text-slate-500 mb-0.5 font-mono">
                    {msg.sender === "user" ? "RODLIFE1314" : "COPILOT ASSISTANT"} • {msg.timestamp}
                  </div>
                  <div
                    className={`rounded-lg p-2.5 whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none px-3"
                        : "bg-[#0f111a] text-slate-200 border border-slate-900/50 rounded-tl-none font-mono text-[10px]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex flex-col items-start max-w-[80%] mr-auto">
                  <span className="text-[9px] text-slate-500 mb-0.5 font-mono">Copilot typing...</span>
                  <div className="bg-[#0f111a] border border-slate-900/50 text-slate-500 rounded-lg rounded-tl-none p-2.5 flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-blue-500 animate-bounce" />
                    <span className="h-1 w-1 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1 w-1 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Interactive smart shortcut suggestions triggers */}
            <div className="px-4 py-2 bg-[#090b10] border-t border-slate-900 flex gap-1.5 overflow-x-auto text-[9.5px] whitespace-nowrap scrollbar-none">
              <button
                onClick={() => clickShortcut("Show repository push commands step-by-step")}
                className="bg-[#10121a] hover:bg-[#1a1c29] text-slate-300 border border-slate-800 px-2 py-1 rounded transition-colors font-mono font-semibold cursor-pointer"
              >
                📥 Git Push Checklist
              </button>
              <button
                onClick={() => clickShortcut("Show manual gcloud builds triggers create syntax for main branch")}
                className="bg-[#10121a] hover:bg-[#1a1c29] text-slate-300 border border-slate-800 px-2 py-1 rounded transition-colors font-mono font-semibold cursor-pointer"
              >
                ⚙ Manual Trigger Syntax
              </button>
              <button
                onClick={() => clickShortcut("Explain how the Dockerfile.export protects GPU compilation metrics")}
                className="bg-[#10121a] hover:bg-[#1a1c29] text-slate-300 border border-slate-800 px-2 py-1 rounded transition-colors font-mono font-semibold cursor-pointer"
              >
                🛡 CPU-Safe Sandbox Spec
              </button>
            </div>

            {/* Prompt input field form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat(chatInput);
              }}
              className="p-3 bg-[#0a0c11] border-t border-slate-900 flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about validation, CUDA compile steps, or Triton configuration maps..."
                className="flex-1 bg-[#050608] border border-slate-900 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500/50"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

        </section>

      </main>

      {/* Control Console Footer Banner */}
      <footer className="border-t border-slate-900 bg-[#090b10] px-6 py-3.5 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-5">
          <span className="font-mono text-[10px] uppercase">GCLOUD CI/CD PIPELINE TRIGGER STATUS :</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-[11px]">ACTIVE REPO TRIGGER LINKED</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span>Target repo link:</span>
          <a
            href="https://github.com/rodlife1314-star/Pathfinder"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-blue-400 transition-colors font-mono flex items-center gap-0.5"
            id="footer-repo-link"
          >
            rodlife1314-star/Pathfinder <ExternalLink className="h-3 w-3 inline" />
          </a>
        </div>
      </footer>

    </div>
  );
}
