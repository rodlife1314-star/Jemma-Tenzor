# Jemma-Tenzor Ingestion Architecture Map (Octagon OS)
**Target:** Ingestion of `rodlife1314-star/Pathfinder` into Octagon OS  
**Status:** PROPOSED BLUEPRINT (Classification Phase)  
**Security Level:** Standard (Zero Hardcoded Secrets Enforced)

This blueprint establishes a pristine, clean-room isolation boundary for standard TensorRT-LLM source files while integrating them directly into the **Selection ➔ Deployment ➔ Action** control loop.

---

## 🗺️ Subsystem Classification Matrix

We organize the incoming codebase into six distinct functional subsystems. Upstream TensorRT source files are treated as immutable reference layers under `/src/tensorrt_upstream/` to avoid polluting the host application logic.

```
/ (Workspace Root)
├── Dockerfile                  # [DEPLOYMENT] Multi-stage GPU Runner (Octagon Core)
├── Dockerfile.export           # [DEPLOYMENT] CPU-safe model validation
├── cloudbuild.yaml             # [DEPLOYMENT] Heavy production pipeline 
├── cloudbuild.export.yaml      # [DEPLOYMENT] Safe pipeline dry-run trigger
├── DEPLOYMENT_NOTES.md         # [DEPLOYMENT] Deployment runbook
├── STRUCTURED_INGESTION.md     # Ingestion blueprint (this file)
│
├── deploy/                     # [DEPLOYMENT] Production Shell scripts
│   ├── entrypoint.sh
│   └── github_and_cloudrun_commands.sh
│
└── src/
    ├── App.tsx                 # Octagon Control Console UI
    ├── types.ts                # TypeScript definition schemas
    │
    └── jemma_tenzor/           # Integrated Orchestrated Layers
        ├── runtime/            # [RUNTIME] Memory, CUDA contexts, TRT model managers
        │   ├── engine_manager.py
        │   └── vram_allocator.py
        │
        ├── inference/          # [INFERENCE] Generation pipelines & server endpoints
        │   ├── server_gateway.py
        │   └── streaming_client.py
        │
        ├── plugins/            # [PLUGINS] Custom CUDA kernels & GEMM plug configurations
        │   ├── attention_kernels.cu
        │   └── gemm_plugin_config.ini
        │
        ├── examples/           # [EXAMPLES] Client demos and benchmark setups
        │   ├── console_demo.py
        │   └── throughput_test.sh
        │
        └── tooling/            # [TOOLING] Conversion tools and tokenization helpers
            ├── weight_converter.py
            └── tokenizer_formatter.py
```

---

## 📂 Subsystem Specifics & Path Mapping

### 1. Runtime Subsystem (`/src/jemma_tenzor/runtime/`)
* **Objective:** Handles TensorRT dynamic engine model loaders, CUDA runtime parameters, VRAM allocation profiling, and hardware capability alignment loops.
* **Key Ingest Target:** Core C++ runtime loaders and Python abstraction wrappers.
* **Integrity Guard**: Direct link to the `nvidia-l4` capability checks.

### 2. Inference Subsystem (`/src/jemma_tenzor/inference/`)
* **Objective:** Houses the FastAPI generation services, token routing endpoints, and streaming handlers.
* **Key Ingest Target:** Inference wrapper classes, local endpoint interfaces.
* **Integrity Guard**: Exposes port `8000` inside production Docker layers without altering base libraries.

### 3. Plugins Subsystem (`/src/jemma_tenzor/plugins/`)
* **Objective:** Holds specialized GEMM (General Matrix Multiply) execution rules and custom FlashAttention engine optimizations.
* **Key Ingest Target:** Custom CUDA kernels and model-specific execution graphs.
* **Integrity Guard**: Isolated compilation layers called in `cloudbuild.yaml` build stages.

### 4. Examples Subsystem (`/src/jemma_tenzor/examples/`)
* **Objective:** Provides standard local prompt testers, offline benchmark loops, and configuration snapshots for team execution.
* **Key Ingest Target:** Sample python scripts, client curl triggers.
* **Integrity Guard**: Run locally or in validation sandboxes without pulling active weights.

### 5. Tooling Subsystem (`/src/jemma_tenzor/tooling/`)
* **Objective:** Conversions (`weight_converter.py` wrapping TRT conversion wrappers) translating HF raw safeTensors into optimized TRT-LLM engine architectures.
* **Key Ingest Target:** Weights formatting scripts and vocab mapping utilities.
* **Integrity Guard**: Operates within low-tier standard CPU workspaces (`Dockerfile.export`).

### 6. Deployment Subsystem (`/deploy/` & Root Files)
* **Objective:** Houses Cloud Build configs, Docker definitions, permissions guides, and automation scripts.
* **Key Ingest Target:** Immutable Octagon orchestration rules.
* **Integrity Guard**: Handled in absolute clean states with zero secret leakage.

---

## 🚦 Integration Safety Rules
1. **Immutable Reference Files**: Original repository code must reside under subdirectories to prevent file contamination.
2. **Duplicate Check**: Guard against declaring multiple incompatible packages in standard `requirements.txt` tiers. Depend strictly on the container definitions.
3. **Trigger Continuity**: The existing trigger (`pathfinder-trigger`) is protected and remains configured pointing to our main orchestrations.
