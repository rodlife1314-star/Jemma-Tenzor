// Model options
export interface ModelOption {
  id: string;
  name: string;
  repo: string;
  size: string;
}

// Accelerator hardware targets
export interface HardwareOption {
  id: string;
  name: string;
  vram: string;
  cores: string;
  gcloudType: string;
}

// Quantization schemas
export interface QuantOption {
  id: string;
  name: string;
  precision: string;
  compression: string;
}

export interface PresetConfigs {
  "cloudbuild.export.yaml": string;
  "Dockerfile.gpu": string;
  "deploy_cloudrun.sh": string;
  "inference.py": string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
}

export interface TransitionLog {
  event_id: string;
  timestamp: string;
  old_status: string;
  new_status: string;
  actor: string;
  comment?: string;
}

export interface CustodyPacket {
  packet_id: string;
  source_agent: string;
  challenge: string;
  dataset_recommendations: string[];
  authority_chain: string[];
  jemma_verdict: "PENDING" | "APPROVED" | "REVISION_REQUIRED";
  red_team_verdict: "PENDING" | "CLEARED" | "VULNERABLE";
  operator_gate: "LOCKED" | "APPROVED";
  current_status: 
    | "RECOMMENDATION_CREATED"
    | "DATASET_CANDIDATE_REGISTERED"
    | "AWAITING_VALIDATION"
    | "JEMMA_APPROVED"
    | "RED_TEAM_CLEARED"
    | "FULLY_VERIFIED"
    | "OPERATOR_APPROVED"
    | "INGESTION_AUTHORIZED"
    | "INGESTED"
    | "DEPLOY_AUTHORIZED"
    | "DEPLOYED"
    | string;
  next_allowed_action: string;
  confidence?: number;
  url_candidate?: string;
  history?: TransitionLog[];
}

export interface DatasetCandidate {
  id: string;
  packetId: string;
  url: string;
  datasetId?: string;
  name?: string;
  status: string;
  createdAt: string;
}

export interface ValidationReview {
  id: string;
  packetId: string;
  reviewType: "JEMMA" | "RED_TEAM";
  verdict: string;
  reason: string;
  reviewer: string;
  createdAt: string;
}

export interface OperatorApproval {
  id: string;
  packetId: string;
  operatorId: string;
  sealStatus: "LOCKED" | "APPROVED";
  timestamp: string;
}

