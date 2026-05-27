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
  TrendingUp, 
  Gauge, 
  Sliders, 
  Database,
  ChevronRight,
  Sparkles,
  Info,
  ExternalLink,
  HelpCircle,
  Activity
} from "lucide-react";

import { PresetConfigs, ChatMessage } from "./types";

// Static Options
const MODEL_OPTIONS = [
  { id: "llama3-8b", name: "Llama-3 8B Instruct", repo: "meta-llama/Meta-Llama-3-8B-Instruct", size: "8.0B parameters", type: "General Instruct", format: "HF Weights" },
  { id: "mistral-7b", name: "Mistral 7B Instruct v0.3", repo: "mistralai/Mistral-7B-Instruct-v0.3", size: "7.2B parameters", type: "Highly Efficient MoE/Dense", format: "SafeTensors" },
  { id: "gemma2-9b", name: "Gemma-2 9B It", repo: "google/gemma-2-9b-it", size: "9.2B parameters", type: "High Reasoning Depth", format: "HF Weights" },
  { id: "phi3-medium", name: "Phi-3 Medium (128k)", repo: "microsoft/Phi-3-medium-128k-instruct", size: "14B parameters", type: "Long Window Instruction", format: "SafeTensors" },
];

const HARDWARE_OPTIONS = [
  { id: "nvidia-l4", name: "NVIDIA L4 Tensor Core", vram: "24 GB GDDR6", cores: "7,424 CUDA Cores", gcloudType: "nvidia-l4", bandwidth: "300 GB/s", score: 85, cost: "$0.0004/s" },
  { id: "nvidia-t4", name: "NVIDIA T4 Tensor Core", vram: "16 GB GDDR6", cores: "2,560 CUDA Cores", gcloudType: "nvidia-t4", bandwidth: "320 GB/s", score: 50, cost: "$0.00025/s" },
  { id: "nvidia-a100", name: "NVIDIA A100 Tensor Core", vram: "40 GB HBM2e", cores: "6,912 CUDA Cores", gcloudType: "nvidia-a100", bandwidth: "1555 GB/s", score: 100, cost: "$0.0012/s" },
];

const QUANT_OPTIONS = [
  { id: "fp16", name: "Unquantized FP16", precision: "Float16 (Full Accuracy)", compression: "1.0x (No overhead)", diskSize: "16.0 GB", accuracy: "100%", latency: "1.0x baseline" },
  { id: "int8", name: "INT8 Weight-Only", precision: "8-bit Integer representation", compression: "0.50x disk VRAM profile", diskSize: "8.1 GB", accuracy: "99.4%", latency: "0.45x (Ultra Fast)" },
  { id: "int4", name: "INT4 AWQ Profile", precision: "4-bit Activation-aware", compression: "0.27x highly optimized profile", diskSize: "4.3 GB", accuracy: "97.8%", latency: "0.30x (Maximum Output)" },
];

export default function App() {
  const [selectedModel, setSelectedModel] = useState("llama3-8b");
  const [selectedHardware, setSelectedHardware] = useState("nvidia-l4");
  const [selectedQuant, setSelectedQuant] = useState("int8");

  // Config Files state loaded from backend dynamically
  const [configs, setConfigs] = useState<PresetConfigs>({
    "cloudbuild.export.yaml": "",
    "Dockerfile.gpu": "",
    "deploy_cloudrun.sh": "",
    "inference.py": ""
  });
  
  const [activeTab, setActiveTab] = useState<keyof PresetConfigs>("cloudbuild.export.yaml");
  const [loadingConfigs, setLoadingConfigs] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);

  // Simulation execution state
  const [simStatus, setSimStatus] = useState<"idle" | "running" | "success" | "failed">("idle");
  const [simStepIdx, setSimStepIdx] = useState(0);
  const [simLog, setSimLog] = useState<string[]>([]);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  // Copilot chatbot state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "system",
      text: "System Core Initialized. Active digital bridge routed to rodlife1314/tensorrt-edge-llm repo. Select your presets and type gcloud deploy instructions or tuning inquiries below.",
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Calculate current dynamic vram estimates
  const currentModelObj = MODEL_OPTIONS.find(m => m.id === selectedModel);
  const currentHardwareObj = HARDWARE_OPTIONS.find(h => h.id === selectedHardware);
  const currentQuantObj = QUANT_OPTIONS.find(q => q.id === selectedQuant);

  // Fetch configs from backend
  const fetchConfigs = async () => {
    setLoadingConfigs(true);
    try {
      const response = await fetch("/api/generate-configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          hardware: selectedHardware,
          quantization: selectedQuant
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setConfigs(data);
      }
    } catch (e) {
      console.error("Error loading configs", e);
    } finally {
      setLoadingConfigs(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, [selectedModel, selectedHardware, selectedQuant]);

  // Handle Dynamic Copilot submit
  const handleChatSubmit = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsAiTyping(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          context: {
            model: currentModelObj?.name,
            hardware: currentHardwareObj?.name,
            quantization: currentQuantObj?.name,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "assistant",
          text: data.text,
          timestamp: new Date().toLocaleTimeString()
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error();
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "system",
        text: "🚨 Connectivity to dynamic AI Core is offline. Please ensure your GEMINI_API_KEY environment variable is configured in the Settings menu.",
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  // Auto scroll console logs
  useEffect(() => {
    consoleBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [simLog]);

  // Trigger copy to clipboard
  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(configs[activeTab]);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  // Run a interactive mocked build pipeline simulation based on active inputs
  const startBuildSimulation = () => {
    setSimStatus("running");
    setSimStepIdx(0);
    setSimLog([]);

    const steps = [
      `[INFO] [SELECTION STATE] Deploy Request Initiated by rodlife1314@gmail.com`,
      `[INFO] Target Repository: github.com/rodlife1314/tensorrt-edge-llm (branch: main)`,
      `[INFO] Active Google Trigger: tensorrt-edge-llm-trigger [us-central1]`,
      `[INFO] === [1/5: CACHING BLOCK] Checking storage buckets for pre-compiled structures...`,
      `[CACHE MISS] No compiled engine cache found for ${currentModelObj?.name} on ${currentHardwareObj?.name}`,
      `[INFO] Initiating HuggingFace weights repository pull stream: ${currentModelObj?.repo}`,
      `[HF PULL] Snapping weights snapshot from serverless Hub registry ...`,
      `[HF PULL] Successfully saved 24 weight shards. Download compression factor: ${currentQuantObj?.compression}`,
      `[INFO] === [2/5: TENSORRT CONVERSION] Parsing model architecture layer definitions...`,
      `[CONVERT] Initiating convert.py commands on Python 3.10 framework core: output_dir=./trt-checkpoint`,
      `[CONVERT] Exporting key projection biases and tensor execution map. Dimension validation passed.`,
      `[INFO] === [3/5: COMPILER ENGINE] Invoking NVIDIA TensorRT trtllm-build toolchain...`,
      `[COMPILER] Target Hardware: ${currentHardwareObj?.name} [Target GPU: ${currentHardwareObj?.gcloudType}]`,
      `[COMPILER] Quantization Level: ${currentQuantObj?.name} (Precision constraints specified: ${currentQuantObj?.precision})`,
      `[COMPILER] Building CUDA Engine binary with Gemini Fast Tensor kernels...`,
      `[COMPILER] VRAM optimization footprint assigned successfully. Expected live allocation: ~${selectedQuant === "fp16" ? "14.8" : selectedQuant === "int8" ? "7.8" : "4.1"} GB`,
      `[INFO] === [4/5: CONTAINERIZATION] Assembling target GPU core environment...`,
      `[DOCKER] Building Docker Image path: us-central1-docker.pkg.dev/octagon-enterprise/tensorrt-edge/engine:${selectedModel}-${selectedQuant}`,
      `[DOCKER] Standard base layering complete (Target OS: Ubuntu 22.04 LTS + CUDA Runtime)`,
      `[INFO] Copying compiled binary weights artifact (trt-engine) into application workspace...`,
      `[DOCKER] Compressing container file table. Success. Uploading 6.8 GB Docker bundle...`,
      `[INFO] === [5/5: SERVERLESS ACTION STATE] Deploying Cloud Run serverless engine...`,
      `[DEPLOY] Invoking beta GPU runtime deployment service on Google Cloud Engine...`,
      `[DEPLOY] Configuring Accelerator to ${currentHardwareObj?.name} (Region: us-central1-a)`,
      `[DEPLOY] Verification checklist: Minimum VRAM requirements matched to hardware config limit.`,
      `[DEPLOY] URL location generated: https://octagon-engine-${selectedModel}-${selectedQuant}-uztiasigi.europe-west1.run.app`,
      `[HEALTH OK] FastAPI server successfully registered health ping! Status: ONLINE`,
      `[ACCELERATOR OK] Connected to TensorRT Pipeline! Digital Runtime Action State Executed. 🎉`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSimLog((prev) => [...prev, steps[currentStep]]);
        setSimStepIdx(currentStep + 1);
        currentStep++;
      } else {
        clearInterval(interval);
        setSimStatus("success");
      }
    }, 450);
  };

  // Shortcut inquiries triggers
  const executeCopilotShortcut = (text: string) => {
    handleChatSubmit(text);
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 font-sans selection:bg-[#3b82f6]/30Selection flex flex-col antialiased">
      
      {/* Upper Navigation Banner */}
      <header className="border-b border-slate-900 bg-[#090b10] px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/10">
            <span className="font-mono text-lg font-extrabold text-white">8</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base font-bold tracking-wider text-slate-100">OCTAGON OS</h1>
              <span className="text-[10px] bg-emerald-950/50 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/20 font-mono">v1.1.4</span>
            </div>
            <p className="text-xs text-slate-400">TensorRT Edge LLM Engine Control Station</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-md border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-mono">rodlife1314@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 bg-[#1e2230]/40 px-3 py-1.5 rounded-md border border-blue-900/20 text-blue-300">
            <GitBranch className="h-3.5 w-3.5" />
            <span className="font-mono text-[11px] font-semibold">tensorrt-edge-llm:main</span>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Left Interactive Configuration Panels (Lg: 7 cols) */}
        <section className="lg:col-span-7 space-y-6 flex flex-col justify-start">
          
          {/* Welcome Info Box */}
          <div className="bg-gradient-to-r from-blue-950/20 to-indigo-950/15 border border-blue-900/20 rounded-xl p-4 flex gap-4">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/15">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-300 font-medium">Automatic Trigger Setup Activated</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your workspace to <span className="font-mono text-slate-300">rodlife1314/tensorrt-edge-llm:main</span>. Changing values instantly compiles optimize configurations, build scripts, and local web hosts inside the workspace.
              </p>
            </div>
          </div>

          {/* Interactive LAB Parameters */}
          <div className="bg-[#0b0c10] border border-slate-900 rounded-xl p-5 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Sliders className="h-4 w-4 text-blue-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">1. Select Digital Runtime Parameters</h2>
            </div>

            {/* Parameter Grid */}
            <div className="space-y-5">
              
              {/* Parameter A: Models */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-blue-400" /> LLM Weights Repository
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">HF Model Snapshot</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MODEL_OPTIONS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`text-left p-3 rounded-lg border transition-all relative overflow-hidden group ${
                        selectedModel === m.id
                          ? "bg-blue-950/30 border-blue-500/60 shadow-lg shadow-blue-950/20"
                          : "bg-[#0d0f14] border-slate-900 hover:border-slate-800"
                      }`}
                    >
                      {/* Glow selection accent */}
                      {selectedModel === m.id && (
                        <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                      )}
                      <div className="font-medium text-xs text-slate-200 group-hover:text-white transition-colors">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1 break-all truncate">
                        {m.repo}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[9px] font-mono text-blue-400 bg-blue-950/50 px-1 rounded">
                          {m.size}
                        </span>
                        <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/30 px-1 rounded">
                          {m.format}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameter B: Hardware Targets */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-blue-400" /> Target GPU Hardware Accelerator
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">CUDA Hardware Stack</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {HARDWARE_OPTIONS.map((h) => (
                    <button
                      key={h.id}
                      className={`text-left p-2.5 rounded-lg border transition-all relative ${
                        selectedHardware === h.id
                          ? "bg-blue-950/30 border-blue-500/60 shadow-lg font-medium"
                          : "bg-[#0d0f14] border-slate-900 hover:border-slate-800"
                      }`}
                      onClick={() => setSelectedHardware(h.id)}
                    >
                      {selectedHardware === h.id && (
                        <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                      )}
                      <div className="text-xs text-slate-200">{h.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{h.vram} VRAM</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{h.cores}</div>
                      <div className="mt-2 pt-2 border-t border-slate-900 flex justify-between items-center">
                        <span className="text-[9px] font-mono text-slate-400">{h.cost}</span>
                        <span className="text-[9px] font-mono text-slate-500">GCP Profile</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameter C: Quantization Profile */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-blue-400" /> Quantization & VRAM Footprint Optimization
                  </label>
                  <span className="text-[10px] font-mono text-semibold text-emerald-400">Reduce Footprint</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {QUANT_OPTIONS.map((q) => (
                    <button
                      key={q.id}
                      className={`text-left p-2.5 rounded-lg border transition-all relative ${
                        selectedQuant === q.id
                          ? "bg-blue-950/30 border-blue-500/60 shadow-lg"
                          : "bg-[#0d0f14] border-slate-900 hover:border-slate-800"
                      }`}
                      onClick={() => setSelectedQuant(q.id)}
                    >
                      {selectedQuant === q.id && (
                        <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                      )}
                      <div className="text-xs text-slate-200">{q.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{q.precision}</div>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">{q.compression}</div>
                      <div className="mt-2 pt-2 border-t border-slate-900 flex justify-between items-center text-[10px]">
                        <span className="font-mono text-emerald-400 font-semibold">{q.diskSize}</span>
                        <span className="text-slate-500">{q.accuracy} Acc</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Live Model Footprint Estimation Graph (Replaces recharts with handcrafted pure CSS micro-graphs to avoid dynamic bundler flaws) */}
            <div className="pt-4 border-t border-slate-900/60">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-blue-400" /> VRAM Memory Allocation Simulation Engine
                </span>
                <span className="font-mono text-slate-300">Target Level Metrics</span>
              </div>
              <div className="bg-[#08090d] rounded-lg p-3.5 border border-slate-900 space-y-3">
                <div className="grid grid-cols-12 gap-3 items-center text-xs">
                  <span className="col-span-3 text-slate-400 font-mono text-[11px]">VRAM Margin</span>
                  <div className="col-span-6 bg-slate-900 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        selectedQuant === "fp16" ? "bg-red-500 w-[95%]" : selectedQuant === "int8" ? "bg-amber-500 w-[45%]" : "bg-emerald-500 w-[24%]"
                      }`}
                    />
                  </div>
                  <span className="col-span-3 text-right font-mono text-[11px] font-semibold text-slate-300">
                    {selectedQuant === "fp16" ? "40+ GB Req" : selectedQuant === "int8" ? "18.4 GB Max" : "9.8 GB Min"}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-3 items-center text-xs">
                  <span className="col-span-3 text-slate-400 font-mono text-[11px]">Latency Speed</span>
                  <div className="col-span-6 bg-slate-900 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        selectedQuant === "fp16" ? "bg-blue-400 w-[30%]" : selectedQuant === "int8" ? "bg-blue-400 w-[78%]" : "bg-cyan-400 w-[98%]"
                      }`}
                    />
                  </div>
                  <span className="col-span-3 text-right font-mono text-[11px] font-semibold text-slate-300">
                    {selectedQuant === "fp16" ? "45 tokens/s" : selectedQuant === "int8" ? "124 tokens/s" : "210 tokens/s"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-1.5 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Info className="h-3 w-3" /> Minimum GPU recommendation: {selectedQuant === "fp16" ? "NVIDIA A100 is highly recommended." : "NVIDIA T4 or L4 can host run cleanly."}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Core Run & Export Simulator Panel */}
          <div className="bg-[#0b0c10] border border-slate-900 rounded-xl p-5 space-y-4 shadow-xl flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">2. Simulate Cloud Build Export Pipeline</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Build status: {simStatus.toUpperCase()}</span>
            </div>

            {/* Run button trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={startBuildSimulation}
                disabled={simStatus === "running"}
                className={`px-4 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  simStatus === "running"
                    ? "bg-slate-900 text-slate-500 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10"
                }`}
              >
                {simStatus === "running" ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" /> Compiling TensorRT Engine...
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-slate-950" /> Run Edge Compile Simulation
                  </>
                )}
              </button>
              
              <div className="text-[11px] text-slate-400 leading-normal">
                {simStatus === "idle" && "Simulates full Cloud Build compiler step inside container logs."}
                {simStatus === "running" && <span className="text-amber-400 animate-pulse font-mono">Running compiler: Step {simStepIdx}/28...</span>}
                {simStatus === "success" && <span className="text-emerald-400 font-mono flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Pipeline compiled successfully! Web server alive.</span>}
              </div>
            </div>

            {/* Standard Terminal Output Log */}
            <div className="bg-[#050608] border border-slate-900 rounded-lg p-3.5 h-[190px] overflow-y-auto font-mono text-[11px] space-y-1.5 text-slate-400 relative">
              {simLog.length === 0 ? (
                <div className="text-slate-600 flex flex-col items-center justify-center h-full space-y-1 text-center">
                  <div className="text-xs">--- Live TensorRT Container Terminal Log ---</div>
                  <div>Press the button above to test compile weights parsing and Cloud Run GPU assembly.</div>
                </div>
              ) : (
                <>
                  {simLog.map((log, idx) => {
                    let textClass = "text-slate-400";
                    if (log.includes("[INFO]")) textClass = "text-blue-400";
                    if (log.includes("[CACHE MISS]")) textClass = "text-amber-400/90";
                    if (log.includes("[COMPILER]")) textClass = "text-indigo-300";
                    if (log.includes("Success") || log.includes("OK") || log.includes("[HEALTH OK]")) textClass = "text-emerald-400";
                    if (log.includes("=== [")) textClass = "text-slate-200 border-b border-slate-900/80 pb-1 font-bold mt-2 first:mt-0";

                    return (
                      <div key={idx} className={`${textClass} leading-relaxed flex gap-2`}>
                        <span className="text-slate-600 select-none">[{String(idx + 1).padStart(2, "0")}]</span>
                        <span>{log}</span>
                      </div>
                    );
                  })}
                  <div ref={consoleBottomRef} />
                </>
              )}
            </div>
            
          </div>

        </section>

        {/* Right Tabbed Dynamic Manifest Config File Viewer & Copilot AI (Lg: 5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6">

          {/* Dynamic Code Manifest Tab Panel */}
          <div className="bg-[#0b0c10] border border-slate-900 rounded-xl flex flex-col shadow-xl overflow-hidden h-fit">
            <div className="p-4 border-b border-slate-900 bg-[#090b10] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold uppercase tracking-wider font-mono">
                <FileCode className="h-4 w-4 text-blue-400" /> Compiled Config Core
              </div>

              {/* Copy manifest button */}
              <button
                onClick={handleCopyClipboard}
                disabled={loadingConfigs}
                className="text-[11px] bg-[#1a1c24] hover:bg-[#252834] border border-slate-800 text-slate-300 px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-all text-mono active:scale-95 cursor-pointer"
              >
                {copiedFile ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400" /> Copy Manifest
                  </>
                )}
              </button>
            </div>

            {/* Dynamic tabs list */}
            <div className="flex bg-[#07080c] border-b border-slate-900 text-xs overflow-x-auto">
              {(Object.keys(configs) as Array<keyof PresetConfigs>).map((file) => (
                <button
                  key={file}
                  onClick={() => setActiveTab(file)}
                  className={`px-3 py-2.5 font-mono border-b-2 text-[11px] whitespace-nowrap transition-colors flex-1 ${
                    activeTab === file
                      ? "border-blue-500 text-slate-100 bg-[#0b0c10]"
                      : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-[#090a0f]"
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>

            {/* Config Script Display Container */}
            <div className="p-4 bg-[#050608] relative">
              {loadingConfigs ? (
                <div className="h-[220px] flex flex-col items-center justify-center space-y-2 text-slate-500">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
                  <span className="font-mono text-xs">Re-compiling script manifest...</span>
                </div>
              ) : (
                <div className="h-[220px] overflow-y-auto leading-relaxed text-slate-300 font-mono text-[10.5px] whitespace-pre select-all bg-transparent focus:outline-none">
                  {configs[activeTab] || `// Selection configuration values changed. Recompiling script presets...`}
                </div>
              )}
            </div>
            
            <div className="p-3 bg-slate-950 text-[10px] text-slate-500 flex justify-between items-center border-t border-slate-900/60 font-mono">
              <span>Artifact Location: src/{activeTab}</span>
              <span className="text-blue-400/80">Sync Enabled</span>
            </div>
          </div>

          {/* Interactive Core AI Copilot Control Engine */}
          <div className="bg-[#0b0c10] border border-slate-900 rounded-xl flex flex-col overflow-hidden shadow-xl flex-1 max-h-[460px]">
            <div className="p-4 border-b border-slate-900 bg-[#090b10] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  3. Octagon Intelligence Copilot
                </h3>
              </div>
              
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>NVIDIA TRT Copilot Agent (Flash 3.5)</span>
              </div>
            </div>

            {/* AI Dialog Log Scroll Space */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#07080c] text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div className="text-[9px] text-slate-500 mb-1 font-mono">
                    {msg.sender === "user" ? "RODLIFE1314" : msg.sender === "system" ? "SYSTEM CORE" : "OCTAGON CORE"} • {msg.timestamp}
                  </div>
                  <div
                    className={`rounded-lg p-3 leading-relaxed whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : msg.sender === "system"
                        ? "bg-slate-950 text-slate-400 border border-slate-900/60 rounded-tl-none font-mono text-[11px]"
                        : "bg-[#0f111a] text-slate-200 border border-slate-900/50 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex flex-col items-start max-w-[80%] mr-auto">
                  <span className="text-[9px] text-slate-500 mb-1 font-mono">OCTAGON CORE is thinking...</span>
                  <div className="bg-[#0f111a] border border-slate-900/50 text-slate-500 rounded-lg rounded-tl-none p-3.5 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Shortcut prompt commands triggers helper */}
            <div className="px-4 py-2 bg-[#090b10] border-t border-slate-900 flex gap-1.5 overflow-x-auto text-[10px] whitespace-nowrap scrollbar-none">
              <button
                onClick={() => executeCopilotShortcut("Generate GPU Deployment commands")}
                className="bg-[#10121a] hover:bg-[#1a1c29] text-slate-300 border border-slate-850 px-2.5 py-1 rounded transition-colors font-mono font-semibold"
              >
                ⚡ Get GPU Deploy CLI
              </button>
              <button
                onClick={() => executeCopilotShortcut("Analyze Triton multi-instance schema")}
                className="bg-[#10121a] hover:bg-[#1a1c29] text-slate-300 border border-slate-850 px-2.5 py-1 rounded transition-colors font-mono font-semibold"
              >
                🔬 Triton Optimizer
              </button>
              <button
                onClick={() => executeCopilotShortcut("Explain Llama 3 Int8 VRAM limits")}
                className="bg-[#10121a] hover:bg-[#1a1c29] text-slate-300 border border-slate-850 px-2.5 py-1 rounded transition-colors font-mono font-semibold"
              >
                📊 Int8 Specs
              </button>
            </div>

            {/* Input Form Fields */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleChatSubmit(userInput);
              }}
              className="p-3 bg-[#0a0c11] border-t border-slate-900 flex gap-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask model compiling or custom Cloud Run deployments strategies..."
                className="flex-1 bg-[#050608] border border-slate-900 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500/50"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </section>

      </main>

      {/* Control Console Status Footer */}
      <footer className="border-t border-slate-900/60 bg-[#090b10] px-6 py-3.5 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-5">
          <span className="font-mono text-[10px] uppercase">GCLOUD CI/CD PIPELINE TRIGGER STATUS :</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-[11px]">ACTIVE DIRECT LINK</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span>Target repo link:</span>
          <a
            href="https://github.com/rodlife1314/tensorrt-edge-llm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-blue-400 transition-colors font-mono flex items-center gap-0.5"
            id="footer-repo-link"
          >
            rodlife1314/tensorrt-edge-llm <ExternalLink className="h-3 w-3 inline" />
          </a>
        </div>
      </footer>

    </div>
  );
}
