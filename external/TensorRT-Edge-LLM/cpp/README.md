# C++ Core Inference Loops & Engine Bindings

This subsystem contains native C++ implementations of TensorRT execution contexts and inference loop handlers.

## Reference Blueprint
*   `ContextManager`: Wraps GPU thread execution allocation bindings.
*   `InferenceLoop`: Controls sequential layer ingestion during active model evaluation.
