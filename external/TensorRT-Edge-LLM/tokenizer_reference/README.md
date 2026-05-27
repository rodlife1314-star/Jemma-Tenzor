# Safe Tokenizer Reference & Ingestion Guide

This subdirectory houses the CPU-bound, safe tokenizer interface and bounding layer reference assets imported from the upstream TensorRT layer. It defines pre-processing constraints, wordpiece/BPE segmentation boundaries, and validation profiles.

## Classification

*   `tokenizer_reference/README.md`: `SAFE_REFERENCE`
*   `tokenizer_reference/tokenizer_boundary_notes.md`: `SAFE_REFERENCE`
*   `tokenizer_reference/tokenizer_profile.schema.json`: `SAFE_REFERENCE`
*   `tests/test_tokenizer_reference.py`: `SAFE_REFERENCE`

---

## Capabilities & Integration Status

This layer operates in high-efficiency standalone mode on standard host CPUs. No CUDA runtime libraries or compiled bindings are required. 

-   **Pre-execution Text Normalization**: Prevents overlong requests from overwhelming memory arrays (enforces hard pre-tokenization length caps).
-   **Safe Sliding-Window Token-Splitting**: Prevents sequence fragments from producing broken Unicode boundaries.
-   **Validation Profile Enforcement**: Asserts that loaded tokenizer JSON configs correspond to expected vocab bounds.
