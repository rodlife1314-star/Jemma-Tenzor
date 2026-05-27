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
