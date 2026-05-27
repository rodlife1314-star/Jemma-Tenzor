# Offline TRT-LLM Engine Conversion & Quantization Guide
**System Framework:** Octagon OS / Jemma-Tenzor Core  

This runbook outlines the steps to build high-efficiency TensorRT engine files from raw SafeTensors model checkpoints offline.

---

## 🛠️ Step 1: Weight Preparation
Ensure weights are structured in a local staging directory before compiling. This avoids high networking overhead:
```bash
# Structure inside staging bucket
/gcs-weights-bucket/
└── Gemma-2b-IT/
    ├── config.json
    ├── model.safetensors
    └── tokenizer.json
```

---

## ⚙️ Step 2: Intermediate Checkpoint Creation
Use the `model_wrapper.py` wrapper to convert weights into optimized intermediate layouts:
```bash
python3 src/jemma_tenzor/python/model_wrapper.py \
    --model_dir /gcs-weights-bucket/Gemma-2b-IT \
    --output_dir /tmp/jemma_checkpoint \
    --quantization int8
```

---

## 🏁 Step 3: Compile TensorRT-LLM Engine
Compile the engine specifically generated for your target GPU device (such as the NVIDIA L4):
```bash
# Execute local optimization passes
trtllm-build \
    --checkpoint_dir /tmp/jemma_checkpoint \
    --output_dir /octagon-app/engine \
    --gemm_plugin float16 \
    --max_batch_size 8 \
    --max_input_len 2048 \
    --max_output_len 1024
```

---

## 📌 Best Practices
1. **Never Quantize on CPU**: INT8/INT4 calibration is CUDA-dependent; execute compilation strictly inside the container using Cloud Build GPU layers.
2. **VRAM Constraints**: On an NVIDIA L4 GPU with 24GB of memory, limit max cache allocation to `0.85` of available capacity to leave overhead for active inference buffers.
