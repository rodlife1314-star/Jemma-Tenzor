import { useState, useEffect, useRef } from "react";
import { 
  Plane, 
  Sliders, 
  Activity, 
  Lock, 
  Unlock, 
  Play, 
  Terminal, 
  Database, 
  Send, 
  AlertTriangle, 
  Cpu, 
  RefreshCw, 
  Sparkles, 
  Server, 
  Info, 
  ExternalLink, 
  Check, 
  FileText, 
  Zap, 
  Compass, 
  ShieldCheck, 
  Layers, 
  ChevronRight, 
  Search, 
  HelpCircle,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Link
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PresetConfigs, ChatMessage, CustodyPacket } from "./types";

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
  }
];

const sampleChallenges = [
  {
    challenge: "Why is US inflation falling while employment remains resilient?",
    dataset_recommendations: ["CPIAUCSL", "PAYEMS", "UNRATE", "OPHNFB"],
    authority_chain: ["FRED", "BLS"]
  },
  {
    challenge: "What is the structural correlation between US Treasury 10Y-2Y yield curves and commercial defaults?",
    dataset_recommendations: ["T10Y2Y", "CRE_INDEX", "DEFAULT_COMMERCIAL"],
    authority_chain: ["FRED", "FED_BOARD"]
  },
  {
    challenge: "Analyze the elasticity of domestic energy supply lines against rising heavy industrial demands.",
    dataset_recommendations: ["AEO_ENERGY_PROD", "IP_UTILITIES", "PPI_ENERGY_INDEX"],
    authority_chain: ["EIA", "FRED"]
  },
  {
    challenge: "Compare persistent service sector wage pressure against general consumer pricing indices.",
    dataset_recommendations: ["ECI_SERVICES", "CPI_SERVICES_LESS_ENERGY", "WAGES_AVERAGE_HOURLY"],
    authority_chain: ["BLS", "FRED"]
  }
];

export default function App() {
  const [activeSubsystem, setActiveSubsystem] = useState("runtime");
  
  // Custom states for cockpit simulation and active selections
  const [activeTab, setActiveTab] = useState<"dashboard" | "custody" | "roadmap">("dashboard");
  const [currentTime, setCurrentTime] = useState("");
  const [alignmentRate, setAlignmentRate] = useState(88.4);
  const [sysLogCount, setSysLogCount] = useState(412);
  const [selectedSubsystem, setSelectedSubsystem] = useState("runtime");

  // Initial Custody Packets for Chain-of-Custody (synchronized with Firestore cloud ledger)
  const [packets, setPackets] = useState<CustodyPacket[]>([]);
  const [selectedPacketId, setSelectedPacketId] = useState("");
  const [datasetUrlInput, setDatasetUrlInput] = useState("");

  // Ingestion dry run simulation state
  const [ingestStatus, setIngestStatus] = useState<"idle" | "running" | "success" | "error" | "query" | "deploying">("idle");
  const [ingestLogs, setIngestLogs] = useState<string[]>([
    "[SYSTEM INITIALIZED] Cockpit Avionics Online. Systems aligned.",
    "[STATUS] Pathfinder Route active on branch: main.",
    "[INFO] Ready to load synchronized Chain-of-Custody documents catalog."
  ]);
  const [ingestedModules, setIngestedModules] = useState<string[]>(["configs", "schemas", "tests"]);
  const [searchQueryInput, setSearchQueryInput] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Jemma-Tenzor dialogue copilot state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "assistant",
      text: "Aviation intelligence console online. I am Jemma, your cockpit co-navigator. I manage structure enforcement, ingestion verification channels, and Chain-of-Custody audits before live builds occur under Octagon OS rules.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const terminalLogsEndRef = useRef<HTMLDivElement>(null);

  // Master generated configurations (loaded lazily)
  const [configs, setConfigs] = useState<PresetConfigs>({
    "cloudbuild.export.yaml": "",
    "Dockerfile.gpu": "",
    "deploy_cloudrun.sh": "",
    "inference.py": ""
  });
  const [activeConfigTab, setActiveConfigTab] = useState<keyof PresetConfigs>("cloudbuild.export.yaml");
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const selectedPacket = packets.find(p => p.packet_id === selectedPacketId) || packets[0] || {
    packet_id: "LOADING",
    source_agent: "System",
    challenge: "Synchronizing with persistent clouds document-ledger store...",
    dataset_recommendations: [],
    authority_chain: [],
    jemma_verdict: "PENDING",
    red_team_verdict: "PENDING",
    operator_gate: "LOCKED",
    current_status: "RECOMMENDATION_CREATED",
    next_allowed_action: "Initial calibration"
  };

  const loadPacketsFromDatabase = async (selectFirst = false) => {
    try {
      const res = await fetch("/api/packets");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setPackets(data);
          if (selectFirst) {
            setSelectedPacketId(data[0].packet_id);
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch custody packets from ledger:", e);
    }
  };

  const getSubsystemStatus = (subId: string, packetStatus: string, jemma: string, red: string) => {
    if (packetStatus === "DEPLOYED" || packetStatus === "Deployed (Demo)") {
      return { label: "ACTIVE", color: "bg-emerald-500 shadow-[0_0_8px_#10b981] text-emerald-400" };
    }

    if (jemma === "REVISION_REQUIRED" || red === "VULNERABLE") {
      if (subId === "validation" || subId === "runtime") {
        return { label: "FAILED", color: "bg-red-500 shadow-[0_0_8px_#ef4444] text-red-400" };
      }
      return { label: "ISOLATED", color: "bg-blue-400 text-blue-400" };
    }

    switch (packetStatus) {
      case "RECOMMENDATION_CREATED":
        if (subId === "runtime") return { label: "VERIFYING", color: "bg-amber-400 shadow-[0_0_6px_#fbbf24] text-amber-400 animate-pulse" };
        if (subId === "inference") return { label: "ISOLATED", color: "bg-blue-400 text-blue-400" };
        return { label: "READY", color: "bg-emerald-500 text-emerald-400" };

      case "DATASET_CANDIDATE_REGISTERED":
        if (subId === "validation") return { label: "VERIFYING", color: "bg-amber-400 shadow-[0_0_6px_#fbbf24] text-amber-400 animate-pulse" };
        if (subId === "inference") return { label: "READY", color: "bg-emerald-500 text-emerald-400" };
        return { label: "READY", color: "bg-emerald-500 text-emerald-400" };

      case "AWAITING_VALIDATION":
      case "JEMMA_APPROVED":
      case "RED_TEAM_CLEARED":
      case "FULLY_VERIFIED":
        if (subId === "validation" || subId === "tests") {
          return { label: "VERIFYING", color: "bg-amber-400 shadow-[0_0_6px_#fbbf24] text-amber-400 animate-pulse" };
        }
        return { label: "READY", color: "bg-emerald-500 text-emerald-400" };

      case "OPERATOR_APPROVED":
      case "INGESTION_AUTHORIZED":
      case "INGESTED":
      case "DEPLOY_AUTHORIZED":
        return { label: "READY", color: "bg-emerald-500 shadow-[0_0_6px_#10b981] text-emerald-400" };

      default:
        return { label: "READY", color: "bg-emerald-500 text-emerald-400" };
    }
  };

  useEffect(() => {
    loadPacketsFromDatabase(true);
  }, []);

  // Auto real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch preset maps on mount
  useEffect(() => {
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
        console.error("Error fetching configs:", e);
      }
    };
    fetchConfigs();
  }, []);

  // Handle copying files
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setCopiedFile(true);
    setTimeout(() => {
      setCopiedFile(false);
      setCopiedText("");
    }, 2000);
  };

  // 1. INGEST Simulation Trigger
  const handleIngestAction = () => {
    setIngestStatus("running");
    setIngestLogs(prev => [
      ...prev,
      `[INGEST] [${new Date().toLocaleTimeString()}] Triggering scan of airframe subsystem files...`,
      `[INGEST] Location Path Target: src/jemma_tenzor/`
    ]);

    let step = 0;
    const items = INGEST_SUBSYSTEMS;
    
    const interval = setInterval(() => {
      if (step < items.length) {
        const sub = items[step];
        setIngestLogs(prev => [
          ...prev,
          `[STAGE] Mapped [${sub.name}] at /${sub.path} (${sub.files.length} files classified successfully)`
        ]);
        if (!ingestedModules.includes(sub.id)) {
          setIngestedModules(prev => [...prev, sub.id]);
        }
        // Micro adjustment to metrics
        setAlignmentRate(prev => Math.min(99.6, Number((prev + 1.2).toFixed(1))));
        setSysLogCount(prev => prev + 8);
        step++;
      } else {
        clearInterval(interval);
        setIngestStatus("success");
        setIngestLogs(prev => [
          ...prev,
          `[SUCCESS] 100% Core system modules cataloged under CPU-safe standard isolation constraints.`,
          `[STATUS] Code structure safe. All proposed states transformed to VERIFIED.`
        ]);
      }
    }, 500);
  };

  // 2. QUERY Simulation Trigger
  const handleQuerySearch = (val?: string) => {
    const q = val || searchQueryInput || "inflation indices";
    setIngestStatus("query");
    setIngestLogs(prev => [
      ...prev,
      `[QUERY] [${new Date().toLocaleTimeString()}] Querying Pathfinder Intelligence for: "${q}"`,
      `[QUERY] Searching credential authorities [FRED, BLS, SEC]...`
    ]);

    setTimeout(() => {
      const mockResult = [
        { key: "CPIAUCSL", name: "Consumer Price Index for All Urban Consumers", rate: "Base Level (MoM)", authority: "BLS" },
        { key: "PAYEMS", name: "All Employees, Total Nonfarm Payrolls", rate: "Monthly Aggregate", authority: "BLS" },
        { key: "T10Y2Y", name: "10-Year Treasury Constant Maturity Minus 2-Year", rate: "Yield spread metrics", authority: "FRED" }
      ].filter(r => r.key.toLowerCase().includes(q.toLowerCase()) || r.name.toLowerCase().includes(q.toLowerCase()) || q.length > 1);

      setSearchResults(mockResult);
      setIngestLogs(prev => [
        ...prev,
        `[SUCCESS] Found ${mockResult.length} authority dataset recommend categories. Matching keys output to Search Terminal.`
      ]);
    }, 600);
  };

  // 3. PATHFIND Intelligence Trigger (Generates custom custody packet in persistent Firestore store)
  const handlePathfindTrigger = async () => {
    setIngestStatus("running");
    setIngestLogs(prev => [
      ...prev,
      `[PATHFIND] [${new Date().toLocaleTimeString()}] Invoking Pathfinder intelligence engines...`,
      `[PATHFIND] Sourcing evidentiary chains & writing structural challenge record to ledger...`
    ]);

    try {
      const choice = sampleChallenges[Math.floor(Math.random() * sampleChallenges.length)];
      const res = await fetch("/api/packets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge: choice.challenge,
          dataset_recommendations: choice.dataset_recommendations,
          authority_chain: choice.authority_chain,
          confidence: Math.floor(Math.random() * 20 + 80)
        })
      });
      if (res.ok) {
        const createdPkt = await res.json();
        setIngestStatus("success");
        setIngestLogs(prev => [
          ...prev,
          `[SUCCESS] Persistent Record formulated for custody packet ${createdPkt.packet_id}!`,
          `[LEDGER] Log status updated: RECOMMENDATION_CREATED.`
        ]);
        await loadPacketsFromDatabase();
        setSelectedPacketId(createdPkt.packet_id);
      }
    } catch (e: any) {
      setIngestStatus("error");
      setIngestLogs(prev => [...prev, `[ERROR] Failed to write custody packet to ledger: ${e.message}`]);
    }
  };

  // 3B. REGISTER CANDIDATE URL (metadata-only URL registration under v0.3A rules)
  const handleRegisterCandidateUrl = async () => {
    if (!datasetUrlInput.trim()) return;
    setIngestStatus("running");
    setIngestLogs(prev => [
      ...prev,
      `[LEDGER] Registering dataset candidate URL for packet ${selectedPacket.packet_id}:`,
      `[URL] ${datasetUrlInput}`
    ]);

    try {
      const res = await fetch("/api/candidates/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packet_id: selectedPacket.packet_id,
          url: datasetUrlInput
        })
      });

      if (res.ok) {
        setIngestStatus("success");
        setIngestLogs(prev => [
          ...prev,
          `[SUCCESS] Datasetcandidate URL logged inside Firestore. Status advanced: DATASET_CANDIDATE_REGISTERED.`,
          `[GOVERNANCE] Metadata-only record saved. No live downloads were triggered on the server.`
        ]);
        setDatasetUrlInput("");
        await loadPacketsFromDatabase();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Registry write rejected by server rules");
      }
    } catch (e: any) {
      setIngestStatus("error");
      setIngestLogs(prev => [...prev, `[ERROR] URL Registration failed: ${e.message}`]);
    }
  };

  // 4. VALIDATE Persistent Verdicts Trigger
  const handleVerdictValidation = async () => {
    if (selectedPacket.current_status === "DEPLOYED" || selectedPacket.current_status === "Deployed (Demo)") {
      setIngestLogs(prev => [
        ...prev,
        `[BLOCKED] Packet ${selectedPacket.packet_id} has been deployed. Airframe state closed.`
      ]);
      return;
    }

    setIngestStatus("running");
    setIngestLogs(prev => [
      ...prev,
      `[VALIDATE] Commencing double-signature validation write for ${selectedPacket.packet_id}...`,
      `[VALIDATE] [JEMMA-VERDICT] Analyzing file dependency specifications & logging approved verdict...`
    ]);

    try {
      const jemmaRes = await fetch("/api/packets/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packet_id: selectedPacket.packet_id,
          reviewer: "Jemma Tenzor Engine v0.3A",
          reviewType: "JEMMA",
          verdict: "APPROVED",
          reason: "Schema structure matched. Parameter ranges strictly aligned."
        })
      });

      if (!jemmaRes.ok) throw new Error("Server rejected Jemma review write");

      setIngestLogs(prev => [
        ...prev,
        `[SUCCESS] Jemma Verdict signature logged to persistent validation review registry!`,
        `[VALIDATE] [RED-TEAM-VERDICT] Screening payload input parameters safety & logging cleared verdict...`
      ]);

      const redRes = await fetch("/api/packets/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packet_id: selectedPacket.packet_id,
          reviewer: "Operator Red Team Core",
          reviewType: "RED_TEAM",
          verdict: "CLEARED",
          reason: "Vetting completed. Zero parameter injection or overflow vulnerabilities."
        })
      });

      if (!redRes.ok) throw new Error("Server rejected Red Team review write");

      setIngestStatus("success");
      setIngestLogs(prev => [
        ...prev,
        `[SUCCESS] Red Team Verdict signature logged safely. both validation routes connected!`,
        `[LEDGER] Advanced state: FULLY_VERIFIED. Operator lock gate is now ready for sign-off.`
      ]);

      await loadPacketsFromDatabase();
      setAlignmentRate(prev => Math.min(100.0, Number((prev + 5.0).toFixed(1))));
    } catch (e: any) {
      setIngestStatus("error");
      setIngestLogs(prev => [...prev, `[ERROR] Validation review transaction failed: ${e.message}`]);
    }
  };

  // 4B. Operator Seal Gate Toggle (writes seal action to Firestore approvals database)
  const toggleOperatorSeal = async () => {
    if (selectedPacket.current_status === "DEPLOYED" || selectedPacket.current_status === "Deployed (Demo)") return;
    if (selectedPacket.jemma_verdict !== "APPROVED" || selectedPacket.red_team_verdict !== "CLEARED") {
      setIngestLogs(prev => [
        ...prev,
        `[BLOCKED] Cannot toggle Operator seal. Jemma and Red Team reviews must both sign off on ${selectedPacket.packet_id} first.`
      ]);
      return;
    }

    const nextSeal = selectedPacket.operator_gate === "APPROVED" ? "LOCKED" : "APPROVED";
    setIngestLogs(prev => [
      ...prev,
      `[OPERATOR] Syncing digital signature gate [${nextSeal}] on persistent ledger...`
    ]);

    try {
      const res = await fetch("/api/packets/seal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packet_id: selectedPacket.packet_id,
          operatorId: "operator-rodlife1314",
          sealStatus: nextSeal
        })
      });

      if (res.ok) {
        setIngestLogs(prev => [
          ...prev,
          `[SUCCESS] Registered Operator digital seal signature directly in secure ledger!`,
          `[LEDGER] Advanced state to: ${nextSeal === "APPROVED" ? "OPERATOR_APPROVED" : "RECOMMENDATION_CREATED"}.`
        ]);
        await loadPacketsFromDatabase();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Seal signature rejected by server auth");
      }
    } catch (e: any) {
      setIngestLogs(prev => [...prev, `[ERROR] Operator ledger transaction failed: ${e.message}`]);
    }
  };

  // 5. DEPLOY Simulation Trigger (Cloud Run Release Dry-Run Build)
  const handleDeployReleaseDryRun = () => {
    if (selectedPacket.jemma_verdict !== "APPROVED" || selectedPacket.red_team_verdict !== "CLEARED") {
      setIngestLogs(prev => [
        ...prev,
        `[ABORT] Deploy blocked. Custody Packet ${selectedPacket.packet_id} fails Double Security validation checklist!`
      ]);
      return;
    }
    if (selectedPacket.operator_gate !== "APPROVED") {
      setIngestLogs(prev => [
        ...prev,
        `[ABORT] Deploy blocked. Operator Approval stamp missing from packet ${selectedPacket.packet_id}!`
      ]);
      return;
    }

    setIngestStatus("deploying");
    setIngestLogs(prev => [
      ...prev,
      `[DEPLOY] Initializing Pathfinder v0.1 Production CPU deployment pipeline...`,
      `[DEPLOY] Fetching cloud build targets: us-central1-docker.pkg.dev/.../app:v0.1`,
      `[DOCKER] Building lightweight CPU-safe production container...`
    ]);

    let step = 0;
    const deploySteps = [
      "[DOCKER] Step 1/3: FROM python:3.10-slim-bookworm... OK (2.3s)",
      "[DOCKER] Step 2/3: COPY requirements.txt /app && RUN pip install... OK (8.4s)",
      "[DOCKER] Step 3/3: EXPOSE 8080 && ENTRYPOINT ['uvicorn']... SUCCESS",
      "[DOCKER] Pushed image us-central1-docker.pkg.dev/Project-ID/pathfinder/app:v0.1 to Artifact Registry",
      "[GCLOUD] Deploying service [pathfinder-service] to region [us-central1]...",
      "[GCLOUD] Service port configured: 8080. Ingress: ALL. Platform: Managed CPU.",
      "[GCLOUD] Routing traffic parameters: 100% allocated to new revision."
    ];

    const pipeline = setInterval(() => {
      if (step < deploySteps.length) {
        const stepLog = deploySteps[step];
        setIngestLogs(prev => [...prev, stepLog]);
        step++;
      } else {
        clearInterval(pipeline);
        fetch("/api/packets/deploy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packet_id: selectedPacket.packet_id })
        })
        .then(async (res) => {
          if (res.ok) {
            await loadPacketsFromDatabase();
            setIngestStatus("success");
            setIngestLogs(prev => [
              ...prev,
              `[SUCCESS] Live Cloud Run CPU deployment simulation complete! Spine is up and responsive.`,
              `[ENDPOINT] Health status verified at GET /healthz and /pathfinder/demo (200 OK)`,
              `[LEDGER] Status recorded permanently on the ledger: DEPLOYED.`
            ]);
            setAlignmentRate(100.0);
          } else {
            const data = await res.json();
            throw new Error(data.error || "Deployment transition rejected by ledger guard.");
          }
        })
        .catch(err => {
          setIngestStatus("error");
          setIngestLogs(prev => [...prev, `[ERROR] Deployment rejected by boundary guard: ${err.message}`]);
        });
      }
    }, 700);
  };

  // Copilot Assistant Chat Trigger
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
            model: "Jemma-Tenzor Cockpit OS v0.2",
            hardware: "Learjet Executive Interface",
            quantization: selectedPacket.packet_id
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
        setSelectedPacketId(prev => prev); // keep selection
      } else {
        throw new Error();
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "system",
        text: "🚨 Executive copilot system offline. Please ensure standard GEMINI_API_KEY environment variables are registered.",
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Keyboard shortcut assistant clicker
  const clickShortcut = (text: string) => {
    handleSendChat(text);
  };

  // Auto Scroll log terminals
  useEffect(() => {
    terminalLogsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ingestLogs]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-slate-100 font-sans selection:bg-[#3182ce]/40 flex flex-col antialiased">
      
      {/* 1. TACTICAL EXECUTIVE HEADER BAR */}
      <header className="border-b border-[#252a32] bg-[#111417] px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-lg gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="h-10 w-10 bg-gradient-to-tr from-slate-700 via-slate-800 to-indigo-950 rounded-xl flex items-center justify-center border border-slate-700/50 shadow-[0_0_15px_rgba(255,255,255,0.05)] text-indigo-400">
            <Plane className="h-5 w-5 rotate-45 transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base font-extrabold tracking-widest text-[#ececf1]">OCTAGON OS</h1>
              <span className="text-[9px] bg-sky-950/40 text-sky-400 px-2 py-0.5 rounded border border-sky-800/30 font-semibold uppercase tracking-wider">
                Cockpit v0.2
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Pathfinder Executive Flight Surface & Chain-of-Custody Command Center</p>
          </div>
        </div>

        {/* Dashboard instrumentation overview indicators */}
        <div className="flex flex-wrap items-center gap-3.5 text-xs w-full md:w-auto justify-start md:justify-end">
          <div className="flex items-center gap-2 bg-[#171a1f] px-3 py-1.5 rounded-lg border border-[#232932] text-slate-300">
            <Activity className="h-4 w-4 text-sky-400" />
            <span className="font-mono text-[10px] text-slate-400">ALIGNMENT:</span>
            <span className="font-mono font-bold text-sky-300">{alignmentRate}%</span>
          </div>

          <div className="flex items-center gap-2 bg-[#171a1f] px-3 py-1.5 rounded-lg border border-[#232932] text-slate-300">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="font-mono text-[10px] text-slate-400">TRACE CACHE:</span>
            <span className="font-mono font-bold text-emerald-300">{sysLogCount} logs</span>
          </div>

          <div className="flex items-center gap-2 bg-[#171a1f]/80 px-3 py-1.5 rounded-lg border border-[#232932] text-slate-300">
            <span className="font-mono text-[10px] text-slate-400">UTC CLOCK:</span>
            <span className="font-mono text-[11px] text-slate-200 tracking-wider font-semibold">{currentTime || "Loading..."}</span>
          </div>
        </div>
      </header>

      {/* 2. FIVE LARGE COCKPIT MAIN SELECTORS ROW */}
      <div className="bg-[#12161b] border-b border-[#222831] px-6 py-4 grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0 shadow-lg">
        <button
          onClick={handleIngestAction}
          disabled={ingestStatus === "running" || ingestStatus === "deploying"}
          className="bg-gradient-to-b from-[#1c222b] to-[#151a21] hover:from-[#252e3b] hover:to-[#1b222b] text-[#cbd5e1] border border-[#2d3748] px-4 py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all outline-none focus:border-sky-500 active:scale-98 relative overflow-hidden text-center cursor-pointer shadow-sm group"
        >
          <div className="absolute top-1 left-2 flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${ingestedModules.length >= INGEST_SUBSYSTEMS.length ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-amber-400 animate-pulse'}`} />
            <span className="text-[7.5px] font-mono text-slate-500 uppercase">INGEST STATE</span>
          </div>
          <Database className="h-4 w-4 text-sky-400 mt-2 block group-hover:scale-110 transition-transform" />
          <span className="font-mono text-[11.5px] font-bold tracking-widest text-[#f1f5f9]">[ INGEST ]</span>
          <span className="text-[9px] text-[#94a3b8] font-medium leading-tight">Scan Subsystems Core</span>
        </button>

        <button
          onClick={() => handleQuerySearch()}
          className="bg-gradient-to-b from-[#1c222b] to-[#151a21] hover:from-[#252e3b] hover:to-[#1b222b] text-[#cbd5e1] border border-[#2d3748] px-4 py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all outline-none focus:border-sky-500 active:scale-98 relative overflow-hidden text-center cursor-pointer shadow-sm group"
        >
          <div className="absolute top-1 left-2 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="text-[7.5px] font-mono text-slate-500 uppercase">SEARCH ENGINE</span>
          </div>
          <Search className="h-4 w-4 text-emerald-400 mt-2 block group-hover:scale-110 transition-transform" />
          <span className="font-mono text-[11.5px] font-bold tracking-widest text-[#f1f5f9]">[ QUERY ]</span>
          <span className="text-[9px] text-[#94a3b8] font-medium leading-tight">Query FRED/BLS Data</span>
        </button>

        <button
          onClick={handlePathfindTrigger}
          disabled={ingestStatus === "running" || ingestStatus === "deploying"}
          className="bg-gradient-to-b from-[#1c222b] to-[#151a21] hover:from-[#252e3b] hover:to-[#1b222b] text-[#cbd5e1] border border-[#2d3748] px-4 py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all outline-none focus:border-sky-500 active:scale-98 relative overflow-hidden text-center cursor-pointer shadow-sm group"
        >
          <div className="absolute top-1 left-2 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" />
            <span className="text-[7.5px] font-mono text-slate-500 uppercase">RECOMMENDER</span>
          </div>
          <Compass className="h-4 w-4 text-violet-400 mt-2 block group-hover:scale-110 transition-transform" />
          <span className="font-mono text-[11.5px] font-bold tracking-widest text-[#f1f5f9]">[ PATHFIND ]</span>
          <span className="text-[9px] text-[#94a3b8] font-medium leading-tight">Formulate Recommend</span>
        </button>

        <button
          onClick={handleVerdictValidation}
          disabled={
            ingestStatus === "running" || 
            selectedPacket.current_status === "Deployed (Demo)" ||
            selectedPacket.current_status === "DEPLOYED" ||
            selectedPacket.current_status === "RECOMMENDATION_CREATED"
          }
          className={`bg-gradient-to-b from-[#1c222b] to-[#151a21] text-[#cbd5e1] border px-4 py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all outline-none active:scale-98 relative overflow-hidden text-center shadow-sm group ${
            selectedPacket.current_status === "RECOMMENDATION_CREATED"
              ? "opacity-40 cursor-not-allowed border-slate-800"
              : selectedPacket.jemma_verdict === "APPROVED" && selectedPacket.red_team_verdict === "CLEARED"
              ? "border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.1)] hover:from-[#252e3b] hover:to-[#1b222b] cursor-pointer"
              : "border-[#2d3748] hover:from-[#252e3b] hover:to-[#1b222b] cursor-pointer"
          }`}
        >
          <div className="absolute top-1 left-2 flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${
              selectedPacket.current_status === "RECOMMENDATION_CREATED"
                ? "bg-amber-500/60"
                : selectedPacket.jemma_verdict === "APPROVED"
                ? 'bg-emerald-400'
                : 'bg-amber-400 animate-pulse'
            }`} />
            <span className="text-[7.5px] font-mono text-slate-500 uppercase">
              {selectedPacket.current_status === "RECOMMENDATION_CREATED" ? "VALIDATION LOCKED" : "VERDICT AUDIT"}
            </span>
          </div>
          {selectedPacket.current_status === "RECOMMENDATION_CREATED" ? (
            <Lock className="h-4 w-4 text-slate-500 mt-2 block" />
          ) : (
            <ShieldCheck className="h-4 w-4 text-amber-400 mt-2 block group-hover:scale-110 transition-transform" />
          )}
          <span className="font-mono text-[11.5px] font-bold tracking-widest text-[#f1f5f9]">[ VALIDATE ]</span>
          <span className="text-[9px] text-[#94a3b8] font-medium leading-tight">
            {selectedPacket.current_status === "RECOMMENDATION_CREATED" ? "Submit URL to Unlock" : "Evaluate Veracity"}
          </span>
        </button>

        <button
          onClick={handleDeployReleaseDryRun}
          disabled={ingestStatus === "running" || selectedPacket.operator_gate !== "APPROVED" || selectedPacket.current_status === "Deployed (Demo)"}
          className={`col-span-2 md:col-span-1 px-4 py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all outline-none focus:ring-1 active:scale-98 relative overflow-hidden text-center cursor-pointer shadow-md group ${
            selectedPacket.operator_gate === "APPROVED" && selectedPacket.current_status !== "Deployed (Demo)"
              ? "bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
              : "bg-gradient-to-b from-[#1b2027] to-[#12161c] text-slate-500 border border-[#2b3543] cursor-not-allowed"
          }`}
        >
          <div className="absolute top-1 left-2 flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${selectedPacket.current_status === "Deployed (Demo)" ? 'bg-emerald-300' : 'bg-amber-500'}`} />
            <span className="text-[7.5px] font-mono text-slate-400 uppercase">LAUNCH GATE</span>
          </div>
          <Server className={`h-4 w-4 mt-2 block group-hover:scale-110 transition-transform ${selectedPacket.operator_gate === "APPROVED" ? 'text-white' : 'text-slate-600'}`} />
          <span className="font-mono text-[11.5px] font-bold tracking-widest">[ DEPLOY ]</span>
          <span className="text-[9px] font-medium leading-tight">CPU Cloud Run Release</span>
        </button>
      </div>

      {/* 3. TACTICAL GRID AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: ACTIVE CHAIN OF CUSTODY AUDIT & CHANNELS (Lg: 7 cols) */}
        <section className="col-span-1 lg:col-span-7 flex flex-col gap-6">

          {/* CHAIN-OF-CUSTODY OVERVIEW & PIPELINE FLOW */}
          <div className="bg-[#14181d] border border-[#232932] rounded-xl p-5 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#232a35] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-sky-400" />
                <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#e2e8f0]">
                  I. Intelligence Custody Chain Pipeline
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-[#94a3b8] font-mono">
                <span className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_6px_#0ea5e9]" />
                <span>FLIGHT PROGRESS TRACKER</span>
              </div>
            </div>

            {/* PIPELINE STAGES VISUAL GRAPH */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 bg-[#0f1217] p-3 rounded-xl border border-[#1e232c]">
              
              <div className="flex flex-col p-2 bg-[#161a22] border border-[#232a34] rounded-lg items-center text-center">
                <span className="text-[8px] font-mono text-slate-500 uppercase">STAGE 1</span>
                <span className="text-[10px] font-bold text-slate-300 font-mono mt-1">Pathfinder Out</span>
                <div className="mt-2 text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5 font-mono">
                  <Check className="h-3 w-3" /> Gen Active
                </div>
              </div>

              <div className="flex flex-col p-2 bg-[#161a22] border border-[#232a34] rounded-lg items-center text-center relative">
                <span className="text-[8px] font-mono text-slate-500 uppercase">STAGE 2</span>
                <span className="text-[10px] font-bold text-slate-300 font-mono mt-1">Packet Custody</span>
                <div className="mt-2 text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5 font-mono">
                  <Check className="h-3 w-3" /> Assembled
                </div>
              </div>

              <div className={`flex flex-col p-2 border rounded-lg items-center text-center transition-colors ${
                selectedPacket.jemma_verdict === "APPROVED" 
                  ? "bg-[#101b15] border-emerald-800/60" 
                  : "bg-[#1a1510] border-amber-800/40"
              }`}>
                <span className="text-[8px] font-mono text-slate-500 uppercase">STAGE 3</span>
                <span className="text-[10px] font-bold text-slate-300 font-mono mt-1">Jemma Sign-off</span>
                {selectedPacket.jemma_verdict === "APPROVED" ? (
                  <div className="mt-2 text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5 font-mono">
                    <Check className="h-3 w-3" /> Approved
                  </div>
                ) : (
                  <div className="mt-2 text-[10px] font-semibold text-amber-500 flex items-center gap-0.5 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" /> Pending
                  </div>
                )}
              </div>

              <div className={`flex flex-col p-2 border rounded-lg items-center text-center transition-colors ${
                selectedPacket.red_team_verdict === "CLEARED" 
                  ? "bg-[#101b15] border-emerald-800/60" 
                  : "bg-[#1a1510] border-amber-800/40"
              }`}>
                <span className="text-[8px] font-mono text-slate-500 uppercase">STAGE 4</span>
                <span className="text-[10px] font-bold text-slate-300 font-mono mt-1">Red Team Clearance</span>
                {selectedPacket.red_team_verdict === "CLEARED" ? (
                  <div className="mt-2 text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5 font-mono">
                    <Check className="h-3 w-3" /> Cleared
                  </div>
                ) : (
                  <div className="mt-2 text-[10px] font-semibold text-amber-500 flex items-center gap-0.5 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" /> Pending
                  </div>
                )}
              </div>

              <div className={`col-span-2 sm:col-span-1 flex flex-col p-2 border rounded-lg items-center text-center transition-all ${
                selectedPacket.current_status === "Deployed (Demo)"
                  ? "bg-[#101b15] border-emerald-700 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                  : selectedPacket.operator_gate === "APPROVED"
                  ? "bg-[#122030] border-sky-800"
                  : "bg-[#161a22] border-[#232a34]"
              }`}>
                <span className="text-[8px] font-mono text-slate-500 uppercase">STAGE 5</span>
                <span className="text-[10px] font-bold text-slate-300 font-mono mt-1">Deploy Run</span>
                {selectedPacket.current_status === "Deployed (Demo)" ? (
                  <div className="mt-2 text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 font-mono">
                    <Zap className="h-2.5 w-2.5 text-emerald-400" /> Active
                  </div>
                ) : selectedPacket.operator_gate === "APPROVED" ? (
                  <div className="mt-2 text-[10px] font-semibold text-sky-400 flex items-center gap-0.5 font-mono">
                    <Unlock className="h-2.5 w-2.5" /> Ready
                  </div>
                ) : (
                  <div className="mt-2 text-[10px] font-semibold text-slate-500 flex items-center gap-0.5 font-mono">
                    <Lock className="h-2.5 w-2.5" /> Locked
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ACTIVE PACKET CONSOLE VIEW */}
          <div className="bg-[#14181d] border border-[#232932] rounded-xl p-5 shadow-lg flex-1 flex flex-col justify-between gap-5 relative">
            
            {/* Header and Packet Selector dropdown */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#232a35] pb-3 gap-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#e2e8f0]">
                  II. Custody Packet Ledger & Inspector
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Select Packet:</span>
                <select
                  value={selectedPacketId}
                  onChange={(e) => setSelectedPacketId(e.target.value)}
                  className="bg-[#0f1217] border border-[#27303d] text-slate-200 text-xs font-mono rounded px-2.5 py-1 outline-none focus:border-sky-500"
                >
                  {packets.map((p) => (
                    <option key={p.packet_id} value={p.packet_id}>
                      {p.packet_id} - {p.challenge.substring(0, 20)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ACTIVE PACKET INSTRUMENTATION DISPLAY */}
            <div className="bg-[#0f1217] p-4 rounded-xl border border-[#1d232c] space-y-4 font-mono text-xs text-[#cad4e0]">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-[#1e2531]">
                <div>
                  <div className="text-[9px] text-[#718096] uppercase font-bold">Packet ID</div>
                  <div className="text-slate-100 font-extrabold text-[13px] tracking-wide pt-1">{selectedPacket.packet_id}</div>
                </div>
                <div>
                  <div className="text-[9px] text-[#718096] uppercase font-bold">Source Agent</div>
                  <div className="text-slate-100 font-bold pt-1 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-violet-400" />
                    {selectedPacket.source_agent}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-[#718096] uppercase font-bold">Current status</div>
                  <div className="text-slate-200 pt-1 flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      selectedPacket.current_status === "Deployed (Demo)"
                        ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                        : selectedPacket.current_status === "Fully Verified"
                        ? "bg-sky-500 shadow-[0_0_8px_#0ea5e9]"
                        : "bg-amber-400 animate-pulse"
                    }`} />
                    <span className="font-semibold">{selectedPacket.current_status}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-[#718096] uppercase font-bold">Operator Gate Seal</div>
                  <div className="pt-1">
                    {selectedPacket.operator_gate === "APPROVED" ? (
                      <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded font-extrabold tracking-wide uppercase text-[10px]">
                        ✓ SIGNED
                      </span>
                    ) : (
                      <span className="text-slate-400 bg-slate-900 border border-slate-700/40 px-2 py-0.5 rounded uppercase text-[10px] font-bold">
                        🔒 LOCKED
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Challenge summary */}
              <div>
                <span className="text-[9px] text-[#718096] uppercase font-bold block pb-1">Pathfinder Analytical Challenge Statement:</span>
                <p className="text-slate-200 leading-relaxed text-xs bg-[#151922] p-3 rounded-lg border border-[#222a36] font-sans">
                  {selectedPacket.challenge}
                </p>
              </div>

              {/* Recommendations & Authorities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="bg-[#151922]/50 p-2.5 rounded-lg border border-[#1e2531]">
                  <span className="text-[9px] text-[#718096] uppercase font-bold block pb-1">Recommended authority datasets (Fred/BLS)</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedPacket.dataset_recommendations && selectedPacket.dataset_recommendations.map((d, dIdx) => (
                      <span key={dIdx} className="bg-sky-950/50 text-sky-300 text-[10px] px-2 py-0.5 rounded border border-sky-800/30 font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#151922]/50 p-2.5 rounded-lg border border-[#1e2531]">
                  <span className="text-[9px] text-[#718096] uppercase font-bold block pb-1">Credible Verification Chain of Authority</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedPacket.authority_chain && selectedPacket.authority_chain.map((a, aIdx) => (
                      <span key={aIdx} className="bg-indigo-950/40 text-indigo-300 text-[10px] px-2 py-0.5 rounded border border-indigo-800/20 font-medium">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* v0.3A COCKPIT INPUT: Candidate Dataset URL Registration Panel */}
              <div className="bg-[#111419] p-4 rounded-xl border border-[#232934] space-y-3 shadow-inner">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-sky-400 font-mono font-bold uppercase tracking-wider block">Candidate Dataset URL Registration</span>
                    <span className="text-[10px] text-slate-400 font-sans">Submit metadata-only URL path candidate to begin validation routing.</span>
                  </div>
                  {selectedPacket.url_candidate && (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded uppercase font-bold">
                      ✓ Registered
                    </span>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <input
                    type="text"
                    placeholder="e.g. https://db.economicdata.example/v1/CPI.csv"
                    value={datasetUrlInput}
                    onChange={(e) => setDatasetUrlInput(e.target.value)}
                    disabled={selectedPacket.current_status !== "RECOMMENDATION_CREATED"}
                    className="flex-1 bg-[#090b0e] border border-[#252e3c] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-600/50 font-mono disabled:opacity-60 placeholder-slate-600"
                  />
                  <button
                    onClick={handleRegisterCandidateUrl}
                    disabled={!datasetUrlInput.trim() || selectedPacket.current_status !== "RECOMMENDATION_CREATED"}
                    className={`px-4 py-2 rounded-lg text-xs font-mono font-extrabold uppercase transition-all flex items-center gap-1.5 cursor-pointer select-none border ${
                      datasetUrlInput.trim() && selectedPacket.current_status === "RECOMMENDATION_CREATED"
                        ? "bg-sky-950 hover:bg-sky-900 text-sky-300 border-sky-800/40 shadow"
                        : "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    <Link className="h-3 w-3" /> Register URL
                  </button>
                </div>

                {selectedPacket.url_candidate && (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono bg-[#0c0f14] p-2.5 rounded-lg border border-[#1b212a] truncate">
                    <span className="text-amber-500 font-bold uppercase text-[9px]">URI ID:</span>
                    <span className="truncate text-slate-400">{selectedPacket.url_candidate}</span>
                  </div>
                )}
              </div>

              {/* Security Review Double Verdict state lights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                
                <div className="bg-[#111419] p-3 rounded-xl border border-[#242b36] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Jemma Ingestion review</span>
                    <div className="text-[11px] font-bold text-slate-300">File & Schema alignment</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      selectedPacket.jemma_verdict === "APPROVED" 
                        ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" 
                        : "bg-amber-400 animate-pulse"
                    }`} />
                    <span className={`font-mono text-[10.5px] font-extrabold ${selectedPacket.jemma_verdict === "APPROVED" ? 'text-emerald-400' : 'text-amber-500'}`}>
                      {selectedPacket.jemma_verdict}
                    </span>
                  </div>
                </div>

                <div className="bg-[#111419] p-3 rounded-xl border border-[#242b36] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Red team security validation</span>
                    <div className="text-[11px] font-bold text-slate-300">Payload sanitization</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      selectedPacket.red_team_verdict === "CLEARED" 
                        ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" 
                        : "bg-amber-400 animate-pulse"
                    }`} />
                    <span className={`font-mono text-[10.5px] font-extrabold ${selectedPacket.red_team_verdict === "CLEARED" ? 'text-emerald-400' : 'text-amber-500'}`}>
                      {selectedPacket.red_team_verdict}
                    </span>
                  </div>
                </div>

              </div>

              {/* Procedural Next Allowed Action descriptor */}
              <div className="bg-[#191e24] p-3 rounded-xl border border-sky-900/30">
                <span className="text-[9px] text-sky-400 font-bold uppercase tracking-wider block">Avionics System Directive:</span>
                <p className="text-[11px] text-slate-200 mt-0.5 font-sans italic font-medium leading-relaxed">
                  " {selectedPacket.next_allowed_action} "
                </p>
              </div>

              {/* v0.3A.1 Transition Historical Audit Log */}
              <div className="bg-[#0b0e12] p-3.5 rounded-xl border border-[#232a35] space-y-2.5">
                <div className="flex justify-between items-center border-b border-[#232a35]/60 pb-1.5">
                  <span className="text-[9.5px] text-indigo-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-indigo-400" /> IV. Immutable Transition History Audit Ledger
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono font-bold uppercase">v0.3A.1 State-Guard</span>
                </div>
                {selectedPacket.history && selectedPacket.history.length > 0 ? (
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {selectedPacket.history.map((h, hIdx) => (
                      <div key={hIdx} className="bg-[#12161e]/80 p-2 text-xs rounded border border-[#1b212c] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[9px] text-slate-500">{new Date(h.timestamp).toLocaleString()}</span>
                          <span className="font-mono bg-sky-950/40 text-sky-400 border border-sky-900/30 px-1.5 py-0.5 rounded text-[8.5px] uppercase font-bold">
                            {h.actor}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[10.5px]">
                          <span className="text-slate-500 font-bold text-[9.5px] line-through decoration-[#ef4444]/20">{h.old_status}</span>
                          <span className="text-indigo-400 text-xs">➔</span>
                          <span className="text-emerald-400 font-bold">{h.new_status}</span>
                        </div>
                        {h.comment && (
                          <p className="text-[10px] text-slate-300 font-sans italic pt-0.5">
                            "{h.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10.5px] text-slate-500 font-sans italic">
                    No state history entry of custody transitions currently logged for this packet.
                  </p>
                )}
              </div>

            </div>

            {/* Interactive cockpit control selectors */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-[#232a35] items-center justify-between font-mono text-xs">
              <div className="text-slate-400 text-[11px] font-sans">
                Manage custody approvals and signatures for the active packet.
              </div>
              <div className="flex gap-2.5 w-full sm:w-auto">
                
                <button
                  onClick={toggleOperatorSeal}
                  disabled={selectedPacket.jemma_verdict !== "APPROVED" || selectedPacket.red_team_verdict !== "CLEARED" || selectedPacket.current_status === "Deployed (Demo)"}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg font-mono text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer select-none border ${
                    selectedPacket.operator_gate === "APPROVED"
                      ? "bg-slate-900 border-[#2b3543] text-indigo-400 hover:text-white"
                      : selectedPacket.jemma_verdict === "APPROVED" && selectedPacket.red_team_verdict === "CLEARED"
                      ? "bg-sky-950 text-sky-300 border-sky-700/60 hover:bg-sky-900 shadow-md shadow-sky-950/20"
                      : "bg-[#14181d] border-transparent text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {selectedPacket.operator_gate === "APPROVED" ? (
                    <>
                      <Lock className="h-3 w-3" /> Lift Operator Seal
                    </>
                  ) : (
                    <>
                      <Unlock className="h-3 w-3" /> Seal Operator Gate
                    </>
                  )}
                </button>

                {selectedPacket.current_status !== "Deployed (Demo)" && (
                  <button
                    onClick={handleDeployReleaseDryRun}
                    disabled={selectedPacket.operator_gate !== "APPROVED" || ingestStatus === "deploying"}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-mono text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all text-white shadow-md border ${
                      selectedPacket.operator_gate === "APPROVED"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 border-emerald-500/40 cursor-pointer"
                        : "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {ingestStatus === "deploying" ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" /> Deploying...
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 fill-white" /> Trigger Build Run
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* FLIGHT RECORDER / SIMULATOR LOGS (Terminal style but refined) */}
          <div className="bg-[#14181d] border border-[#232932] rounded-xl p-5 shadow-lg space-y-3.5">
            <div className="flex justify-between items-center border-b border-[#232a35] pb-2.5">
              <div className="flex items-center gap-2">
                <Terminal className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
                <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-300 font-mono">
                  III. Avionics Telemetry & Activity Feed
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Dry-run simulation signals</span>
            </div>

            {/* Simulated Live logs stack */}
            <div className="bg-[#0b0d10] border border-[#1c222b] rounded-xl p-4 h-[180px] overflow-y-auto font-mono text-[11px] space-y-1.5 text-slate-300 relative">
              {ingestLogs.map((log, index) => {
                if (!log || typeof log !== "string") return null;
                let statusClass = "text-slate-400";
                if (log.includes("[INFO]")) statusClass = "text-sky-400 font-medium";
                if (log.includes("[SUCCESS]")) statusClass = "text-emerald-400 font-bold";
                if (log.includes("[STAGE]")) statusClass = "text-slate-300";
                if (log.includes("[ABORT]") || log.includes("[BLOCKED]")) statusClass = "text-rose-400 font-bold";
                if (log.includes("[OPERATOR]")) statusClass = "text-sky-300 font-bold";
                if (log.includes("[QUERY]")) statusClass = "text-yellow-400/90 font-medium";

                return (
                  <div key={index} className={`${statusClass} flex items-start gap-2.5 leading-relaxed`}>
                    <span className="text-[#3b4b5e] select-none">[{String(index + 1).padStart(2, "0")}]</span>
                    <span>{log}</span>
                  </div>
                );
              })}
              <div ref={terminalLogsEndRef} />
            </div>

            {/* Query / Search results container if available */}
            {ingestStatus === "query" && searchResults.length > 0 && (
              <div className="p-3 bg-[#11141a] border border-[#242b36] rounded-xl space-y-2">
                <span className="text-[9px] font-mono text-sky-400 uppercase font-bold block border-b border-[#1e2531] pb-1">Recommended Authority Keys Found:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {searchResults.map((res, rIdx) => (
                    <div key={rIdx} className="bg-[#0f1217] p-2 rounded border border-[#222934] font-mono text-xs">
                      <div className="flex items-center justify-between text-slate-200">
                        <span className="font-extrabold text-[#3182ce]">{res.key}</span>
                        <span className="text-[9px] bg-slate-900 px-1 py-0.5 rounded text-slate-400 border border-slate-700/30">{res.authority}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 leading-normal line-clamp-1">{res.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-[10px] text-[#4a5568] font-mono pt-1">
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3" /> Sandbox environment: strictly CPU-safe simulation nodes.
              </span>
              <span>BUFFER: ACTIVE</span>
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: REPOSITORY MAPS, COPILOT CHAT, AND LOCKED V0.3 PLAN (Lg: 5 cols) */}
        <section className="col-span-1 lg:col-span-5 flex flex-col gap-6">

          {/* ACTIVE WORKSPACE / PIPELINE CONFIG FILE VIEWER */}
          <div className="bg-[#14181d] border border-[#232932] rounded-xl flex flex-col shadow-lg overflow-hidden shrink-0">
            <div className="p-4 border-b border-[#232a35] bg-[#111417] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#ececf1] font-bold uppercase tracking-wider font-mono">
                <FileCode className="h-4 w-4 text-sky-400" /> Pipeline Config Files
              </div>

              {/* Copy action trigger */}
              <button
                onClick={() => handleCopy(configs[activeConfigTab], activeConfigTab)}
                disabled={!configs[activeConfigTab]}
                className="text-[10.5px] bg-[#1d232c] hover:bg-[#252d3a] border border-[#2b3543] text-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-mono cursor-pointer active:scale-95"
              >
                {copiedFile && copiedText === activeConfigTab ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied Specifications!
                  </>
                ) : (
                  <>
                    <FileCode className="h-3.5 w-3.5 text-slate-400" /> Copy Specifications
                  </>
                )}
              </button>
            </div>

            {/* Config file workspace tab indices */}
            <div className="flex bg-[#0f1217] border-b border-[#1e2531] text-xs overflow-x-auto select-none">
              {(Object.keys(configs) as Array<keyof PresetConfigs>).map((file) => (
                <button
                  key={file}
                  onClick={() => setActiveConfigTab(file)}
                  className={`px-3 py-2.5 font-mono border-b-2 text-[10.5px] whitespace-nowrap transition-colors flex-1 ${
                    activeConfigTab === file
                      ? "border-sky-500 text-slate-100 bg-[#14181d] font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-[#12151b]"
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>

            {/* Dynamic script text content */}
            <div className="p-4 bg-[#0a0d10]">
              <div className="h-[120px] overflow-y-auto leading-relaxed text-[#cad3e0] font-mono text-[9.5px] whitespace-pre select-all bg-transparent focus:outline-none scrollbar-thin">
                {configs[activeConfigTab] || `// Compiling standard release configuration maps dynamically...`}
              </div>
            </div>

            <div className="px-4 py-2 bg-[#090b0e] text-[9.5px] text-[#4a5568] flex justify-between items-center border-t border-[#1d232c] font-mono">
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3" /> Static build definitions. Protected assets.
              </span>
              <span className="text-emerald-500 font-semibold uppercase text-[8.5px] tracking-wider">ReadOnly</span>
            </div>
          </div>

          {/* SUBSYSTEM MAP MODULE (Compact & with status lights) */}
          <div className="bg-[#14181d] border border-[#232932] rounded-xl p-4 shadow-lg space-y-3 shrink-0">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block border-b border-[#212833] pb-1.5">
              IV. Aircraft Airframe Subsystem Maps
            </span>
            <div className="grid grid-cols-2 gap-2">
              {INGEST_SUBSYSTEMS.map((sub) => {
                const currentSubState = getSubsystemStatus(
                  sub.id,
                  selectedPacket.current_status,
                  selectedPacket.jemma_verdict,
                  selectedPacket.red_team_verdict
                );
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubsystem(sub.id);
                      setIngestLogs(prev => [
                        ...prev,
                        `[WORKSPACE] Focused workspace on subsystem path: /${sub.path}`
                      ]);
                    }}
                    className={`text-left p-2.5 rounded-lg border text-xs transition-all flex justify-between items-center ${
                      selectedSubsystem === sub.id
                        ? "bg-[#182029] border-sky-600/60 text-white"
                        : "bg-[#0f1217] border-[#1f252f] text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="font-mono text-[10.5px] font-bold leading-tight flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${currentSubState.color}`} />
                        <span>{sub.name}</span>
                      </div>
                      <div className="text-[9px] text-[#718096] font-mono pt-1 flex items-center gap-1 leading-none">
                        <span>/{sub.id}/</span> • <span className="font-extrabold text-[8.5px] uppercase opacity-75">{currentSubState.label}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-3 text-slate-600 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* EXPERT COPILOT TACTICAL TERMINAL */}
          <div className="bg-[#14181d] border border-[#232932] rounded-xl flex flex-col shadow-lg overflow-hidden flex-1 min-h-[290px] max-h-[380px]">
            <div className="p-4 border-b border-[#232a35] bg-[#111417] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#ececf1]">
                  V. Co-Pilot Executive Dialog
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-[#48bb78] font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>FLIGHT INTENT COGNITIVE LAYER</span>
              </div>
            </div>

            {/* Dialogue stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0c0f12] text-[11px] leading-relaxed scrollbar-thin">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div className="text-[8px] text-slate-500 mb-0.5 font-mono">
                    {msg.sender === "user" ? "OPERATOR (ROD)" : "TACTICAL COPILOT"} • {msg.timestamp}
                  </div>
                  <div
                    className={`rounded-xl p-2.5 whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-sky-600 text-white rounded-tr-none px-3 border border-sky-500/30"
                        : "bg-[#151922] text-slate-200 border border-[#212936] rounded-tl-none font-mono text-[10px]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex flex-col items-start max-w-[80%] mr-auto">
                  <span className="text-[8px] text-slate-500 mb-0.5 font-mono">Formulating flight guidelines...</span>
                  <div className="bg-[#151922] border border-[#212936] text-slate-400 rounded-xl rounded-tl-none p-2.5 flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-sky-500 animate-bounce" />
                    <span className="h-1 w-1 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1 w-1 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Smart shortcut buttons in pilot header */}
            <div className="px-3 py-1.5 bg-[#0f1217] border-t border-[#1d232c] flex gap-1.5 overflow-x-auto text-[9px] whitespace-nowrap scrollbar-none">
              <button
                onClick={() => clickShortcut("Show step-by-step verification checklist for CPU Cloud Run deployment")}
                className="bg-[#161a22] hover:bg-[#202734] text-[#cbd5e1] border border-[#252e3e] px-2 py-1 rounded transition-colors font-mono font-semibold cursor-pointer"
              >
                📥 Deployment Checklist
              </button>
              <button
                onClick={() => clickShortcut("Explain how the double-signature custody architecture acts as an operator lock")}
                className="bg-[#161a22] hover:bg-[#202734] text-[#cbd5e1] border border-[#252e3e] px-2 py-1 rounded transition-colors font-mono font-semibold cursor-pointer"
              >
                🛡 Dual-Verdicts Lock Explain
              </button>
            </div>

            {/* Search/Query dialog query input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat(chatInput);
              }}
              className="p-3 bg-[#111417] border-t border-[#232a35] flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Submit inquiry or query flight patterns..."
                className="flex-1 bg-[#090b0e] border border-[#252a32] rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-500 text-white p-2 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          {/* VI. LOCKED v0.3 ROADMAP PANEL */}
          <div className="bg-[#1b1c1e] border border-[#3e4249] rounded-xl p-4 shadow-lg space-y-3 relative overflow-hidden shrink-0">
            {/* Locked screen glass effect */}
            <div className="absolute inset-0 bg-[#0c0d0f]/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-center space-y-2 p-4 select-none">
              <Lock className="h-5 w-5 text-amber-500 shadow-sm" />
              <div className="font-mono text-[10.5px] font-extrabold text-[#b8c2cc] tracking-widest uppercase">
                VERSION 0.3 TARGET ROADMAP [PROTOCOL RESTRICTED]
              </div>
              <p className="text-[9.5px] text-slate-400 max-w-sm leading-relaxed">
                Actions are locked behind structural version checks. Complete local verification, validation cycles, and CPU sandbox tests inside v0.2.
              </p>
            </div>

            <div className="opacity-15 font-mono text-xs text-[#a0aec0] space-y-2">
              <span className="font-bold uppercase tracking-wider block border-b border-slate-700 pb-1">Planned Ecosystem Expansion Items:</span>
              <ul className="space-y-1 text-[11px] leading-normal list-disc list-inside">
                <li>Production Integration of live FRED and BLS HTTP APIs.</li>
                <li>Automated repository ingestion pipeline triggers with dynamic file hash validation.</li>
                <li>Live deployment hooks mapping container setups directly to production Cloud Run clusters.</li>
                <li>CUDA compilation and TensorRT optimization target (NVIDIA L4 branch).</li>
              </ul>
            </div>
          </div>

        </section>

      </main>

      {/* 4. FOOTER FLIGHT STATUS BAR */}
      <footer className="border-t border-[#232932] bg-[#111417] px-6 py-3 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] uppercase tracking-wider">COCKPIT PROTOCOL ACTIVE STATUS :</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
            <span className="font-extrabold text-[10px] tracking-widest uppercase">Sectors Aligned. Ready for Seal Auth.</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span>Target repository linkage:</span>
          <a
            href="https://github.com/rodlife1314-star/Pathfinder"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-sky-400 transition-colors font-mono flex items-center gap-1 font-bold"
            id="footer-repo-link"
          >
            rodlife1314-star/Pathfinder <ExternalLink className="h-3 w-3 inline" />
          </a>
        </div>
      </footer>

    </div>
  );
}
