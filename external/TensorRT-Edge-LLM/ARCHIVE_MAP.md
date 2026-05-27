# Upstream Ingestion Archive Map

This document establishes the official taxonomy of all imported upstream files within the `external/TensorRT-Edge-LLM/` reference tier. Each subsystem has been meticulously cataloged and assigned a strict classification to direct future integration efforts while ensuring immediate stability of the active Octagon OS runtime.

---

## 1. Subsystem Classification Matrix

| Subsystem Path | Primary Designation | Risk Level | Runtime Requirement | Compile Requirement | CUDA Capability |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cpp/` | `GPU_REQUIRED`, `NOT_YET_INTEGRATED` | **High** | NVIDIA GPU (L4/T4) | GCC >= 11, CMake >= 3.22 | CUDA >= 12.0 |
| `examples/` | `SAFE_REFERENCE` | **Negligible** | CPU / Standard Python | None | None |
| `benchmarks/` | `EXPERIMENTAL` | **Low** | Standard Python | CPU-bound benchmarks | None |
| `docs/` | `SAFE_REFERENCE` | **None** | None | None | None |
| `plugins/` | `FUTURE_PLUGIN`, `DO_NOT_EXECUTE` | **Critical** | Serverless GPU Instance | NVCC, TensorRT build-toolchain | CUDA >= 12.2, compute sm_89+ |
| `cmake/` | `NOT_YET_INTEGRATED` | **Medium** | Build Host | CMake Build Toolchain | None |
| `templates/` | `SAFE_REFERENCE` | **Negligible** | Python Runtime | None | None |
| `runtime_reference/` | `FUTURE_RUNTIME` | **Medium** | Python 3.10+ | None | None |
| `tokenizer_reference/`| `SAFE_REFERENCE` | **Low** | Python 3.10+, HF Tokenizers| None | None |
| `builder_reference/` | `FUTURE_RUNTIME`, `GPU_REQUIRED`| **High** | NVCC, CUDA Drivers | TensorRT-LLM Compiler Setup | CUDA >= 12.0 |
| `orchestration_reference/`| `FUTURE_RUNTIME` | **Medium** | FastAPI + Python 3.10 | None | None |

---

## 2. Detailed Subsystem Specifications & Dependencies

### C++ Source Layer (`cpp/`)
*   **Description**: Core C++ execution loops, customized inference kernels, and tensor execution pipelines designed for custom low-latency operation.
*   **Classification**: `GPU_REQUIRED`, `NOT_YET_INTEGRATED`
*   **Dependency Relationships**: Depends heavily on target Shared Libraries (`libtensorrt_llm.so`, `libcudart.so`).
*   **Runtime Requirements**: Pre-allocated host page-locked memory, local CUDA context.
*   **Compile Requirements**: Modern host compiler suite supporting C++20 standards, specific linkage pathways.
*   **CUDA Requirements**: Native CUDA runtime integration targeting Ampere / Ada Lovelace architecture profiles.
*   **Integration Risk Level**: **High**. Direct linkage risks compilation incompatibilities across environments.

### Customized C++/CUDA Operators (`plugins/`)
*   **Description**: High-performance Attention kernels, custom GEMM operators, and Flash Attention custom wrappers.
*   **Classification**: `FUTURE_PLUGIN`, `DO_NOT_EXECUTE`
*   **Dependency Relationships**: Requires upstream compile headers (`tensorrt_llm/common`, `cutlass`).
*   **Runtime Requirements**: High-density serverless GPU instances with high VRAM allocations.
*   **Compile Requirements**: NVCC compiler matching exact target hardware optimization presets.
*   **CUDA Requirements**: Strictly restricted to target architectures (compute capability 8.0, 8.9, 9.0).
*   **Integration Risk Level**: **Critical**. Potential memory access faults (segmentation violations, bounds violations) if initialized incorrectly.

### Engine Synthesis & Compilation (`builder_reference/`)
*   **Description**: Python wrappers targeting TensorRT-LLM model compiler directives to generate static hardware execution engines.
*   **Classification**: `FUTURE_RUNTIME`, `GPU_REQUIRED`
*   **Dependency Relationships**: Heavily depends on the `tensorrt_llm` Python API compiler classes.
*   **Runtime Requirements**: High VRAM system during compiling phase (requires substantial RAM/VRAM to stage layers).
*   **Compile Requirements**: Build script invocation targeting the local system dependencies.
*   **CUDA Requirements**: CUDA-capable device present during compile phase to run auto-tuning passes.
*   **Integration Risk Level**: **High**. High system memory constraints can trigger out-of-memory (OOM) build failures.

### Context Allocations & Managed Runtime (`runtime_reference/`)
*   **Description**: Intermediate-tier reference schemas mapping input and output tensors to allocated hardware addresses.
*   **Classification**: `FUTURE_RUNTIME`
*   **Dependency Relationships**: Standardizes communications between orchestrators (`inference/`) and accelerators (`runtime/`).
*   **Runtime Requirements**: Python 3.10+ execution environment, NumPy library.
*   **Compile Requirements**: None (Pure Python references).
*   **CUDA Requirements**: None for skeletal code; will require GPU linkage in development streams.
*   **Integration Risk Level**: **Medium**. Requires strict verification of memory layout sizes.

### Token Processing & Parsing (`tokenizer_reference/`)
*   **Description**: Highly optimized vocabulary loading, processing, and multi-threaded sentence boundaries decoding.
*   **Classification**: `SAFE_REFERENCE` (Fully Populated)
*   **Populated Assets**:
    *   `tokenizer_reference/README.md` (Design guidelines and classification)
    *   `tokenizer_reference/tokenizer_boundary_notes.md` (Detailed boundary limits, UTF-8 continuity protocols, splitter algorithms)
    *   `tokenizer_reference/tokenizer_profile.schema.json` (Structured schema map validating parameters, vocab sizes, and token identifiers)
    *   `tests/test_tokenizer_reference.py` (Local unit tests validating UTF-8 window adjustments, chunk boundary calculation algorithms, and schema adherence)
*   **Dependency Relationships**: Interacts with local JSON validators and `transformers` tokenizers.
*   **Runtime Requirements**: Pure CPU local python environments.
*   **Compile Requirements**: None.
*   **CUDA Requirements**: None.
*   **Integration Risk Level**: **None**. Clean, verified CPU reference layers.

### Core Execution Orchestration (`orchestration_reference/`)
*   **Description**: Process managers, queue controllers, and asynchrony stream handlers managing outstanding live requests.
*   **Classification**: `FUTURE_RUNTIME`
*   **Dependency Relationships**: Direct mapping interface to the FastAPI application layer.
*   **Runtime Requirements**: Multiprocessing-safe host, standard asyncio task loops.
*   **Compile Requirements**: None.
*   **CUDA Requirements**: None.
*   **Integration Risk Level**: **Medium**. Stream safety must be extensively tested to prevent deadlocks under high-concurrency loads.
