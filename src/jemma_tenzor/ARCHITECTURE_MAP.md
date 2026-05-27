# Jemma-Tenzor Subsystem Ingestion Architecture Map (Phase 3)
**Target Repository:** `rodlife1314/tensorrt-edge-llm`  
**Execution Objective:** Safe, incremental integration into the absolute clean runtime.  
**State:** PHASE 3 VALIDATION & CONFIG SCHEMAS LINKED  

---

## 🗺️ Subsystem Ingestion Pipeline

To maintain zero runtime drift and preserve continuous Cloud Run deployability, Phase 3 links crucial validation, templating, and baseline CPU-safe tests into Jemma-Tenzor.

```
/ (Workspace Root)
├── config/                             # 1. Configuration Templates Tier
│   ├── runtime_config_template.json    # Runtime params, engines & safety limits
│   ├── model_profile_template.json    # Hidden layers, heads & vocab size tags
│   └── quantization_profile_template.json # AWQ, int8 & float16 layout maps
│
├── schemas/                            # 2. Structural Schemas Tier
│   ├── model_manifest_schema.json     # Model identity specifications validation
│   ├── deployment_manifest_schema.json # GCP target runtimes mapping validation
│   └── inference_schema.json          # Live prompt & routing parameters constraints
│
├── tests/                              # 3. CPU-safe Sandbox Test Suite
│   ├── test_mock_inference.py         # Mock tokenization testing
│   ├── test_allocator_boundary.py     # CUDA safety envelope checks
│   └── test_gateway_route.py          # FastAPI mock requests parsing checks
│
└── src/jemma_tenzor/
    ├── ARCHITECTURE_MAP.md                 # Master ingestion map and checklist (this file)
    │
    ├── docs/                               # Documentation Tier
    │   └── OFFLINE_CONVERSION.md           # Model weight staging, layer conversion, and layout guide
    │
    ├── examples/                           # Demonstration Tier
    │   └── throughput_bench.py             # CPU-safe evaluation script measuring token throughput
    │
    ├── scripts/                            # Action Tier
    │   └── build_engine.sh                 # Cloud Build orchestration steps wrapping command lines
    │
    ├── python/                             # Core Python Abstractions
    │   └── model_wrapper.py                # Wrapper mapping HF weights to intermediate TensorRT checkpoints
    │
    ├── runtime/                            # Runtime Abstraction Tier
    │   └── allocator.py                    # Advanced CUDA memory allocation profile & context manager
    │
    ├── inference/                          # Inference Orchestration Tier
    │   └── gateway.py                      # FastAPI microservice wrapper delivering real-time tokens
    │
    └── validation/                         # 4. Phase 3 Internal Verification Engine
        ├── __init__.py                     # Package level visibility hooks
        ├── dependency_validation.py        # Validates Python module library baselines
        ├── environment_validation.py       # Validates local processes environments
        ├── gpu_availability_validation.py  # Diagnoses GPU availability
        └── model_manifest_validation.py    # Matches models against manifest schemas
```

---

## 🛡️ Structural Isolation & Dependency Discipline

* **Zero Duplicated Versioning**: We do NOT import loose python binary files into our host workspace. Dependencies are handled inside the Docker stage runner via specific packages to avoid `fsspec` or other libraries collision.
* **No Cache Intrusion**: Model weights are downloaded dynamically inside Google Cloud Build paths (`/model-weights`), keeping our AI Studio repository below 10 KB of text code.
* **CUDA Preservation**: Upstream CUDA kernels (`*.cu`) are kept as an immutable reference sub-layer until compile phase.

---

## 🚦 Ingestion Status Checklist

- [x] **Subsystem 1: docs/** ➔ Mapped and integrated (`docs/OFFLINE_CONVERSION.md`)
- [x] **Subsystem 2: examples/** ➔ Ingested (`examples/throughput_bench.py` simulation)
- [x] **Subsystem 3: scripts/** ➔ Configured (`scripts/build_engine.sh` mapping)
- [x] **Subsystem 4: python/** ➔ Structural Skeletal Integration (`python/model_wrapper.py`)
- [x] **Subsystem 5: runtime/** ➔ Allocation abstraction complete (`runtime/allocator.py`)
- [x] **Subsystem 6: inference/** ➔ Endpoint API layer synchronized (`inference/gateway.py`)
- [x] **Subsystem 7: configs/** ➔ Templates added to `/config/`
- [x] **Subsystem 8: schemas/** ➔ Schema definitions added to `/schemas/`
- [x] **Subsystem 9: tests/** ➔ Unit tests added to `/tests/`
- [x] **Subsystem 10: validation/** ➔ Verification code added to `/src/jemma_tenzor/validation/`

