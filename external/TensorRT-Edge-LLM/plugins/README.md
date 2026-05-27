# Custom GPU Operators & Plugins

This directory houses performance-oriented CUDA kernels, including specialized Attention, scaling elements, and rotary embedding multipliers.

## CUDA Manifest
- `custom_attention.cu`: Scaled dot-product operations optimized for low latency.
- `gemm_tuning.cu`: Lookup matrix optimizations mapping input parameters to core capabilities.
