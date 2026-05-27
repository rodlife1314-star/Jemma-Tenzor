# TensorRT-Edge-LLM Upstream Reference Archive

This directory serves as the isolated, immutable upstream reference layer for the Jemma-Tenzor / Octagon OS runtime. It acts as an architectural design anchor, a source of truth for downstream compiler definitions, and a safe repository of custom CUDA plugins, C++ layers, example benchmarks, and model-building orchestration code.

## ⚠️ Governance Notice

To ensure zero drift, preserve absolute reproducible system constraints, and maintain continuous deployability of the live serverless GPU container, the contents of this folder are **FOR STUDY AND REFERENCE ONLY**. 

1. **Isolation Boundary**: No code inside this directory is imported, invoked, or linked by any active execution code inside `src/`.
2. **Immutable Runtime**: The core Python package (`src/jemma_tenzor`), the standard FastAPI router gateways, the memory allocation constraints, and the dependency requirements are strictly maintained separately to maintain stability.
3. **No CUDA Builds**: Under no circumstances should compilation of custom CUDA plugins in this directory be executed inside the sandbox development stream or standard Continuous Integration (CI) test workflows.

---

## Directory Organization

The directory maps the upstream layout into architectural components categorized by integration feasibility:

*   **`cpp/` & `plugins/`**: Custom TensorRT custom operators, memory layout abstractions, and optimized Attention scaling kernels. (Classification: `GPU_REQUIRED`, `FUTURE_PLUGIN`)
*   **`cmake/` & `builder_reference/`**: System configuration, build parameters, and compilation procedures mapping local checkpoint files to optimized GPU execution binaries. (Classification: `GPU_REQUIRED`, `NOT_YET_INTEGRATED`)
*   **`runtime_reference/` & `orchestration_reference/`**: Detailed reference structures illustrating context managers, key-value caches, and prompt orchestration. (Classification: `SAFE_REFERENCE`, `FUTURE_RUNTIME`)
*   **`tokenizer_reference/` & `templates/`**: Reference text processing helpers and serialization profiles mapping raw layers to quantization envelopes. (Classification: `SAFE_REFERENCE`)
*   **`docs/` & `examples/`**: Theoretical designs, conversion walkthroughs, and CPU-safe evaluation metrics. (Classification: `SAFE_REFERENCE`)
