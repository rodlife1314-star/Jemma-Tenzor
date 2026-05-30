# Octagon OS Deployment Architecture Runbook
**Operator:** rodlife1314-star (rodlife1314@gmail.com)  
**Target Git Repo:** `rodlife1314-star/Pathfinder`  
**Deployment Model:** Selection ➔ Deployment ➔ Action Loop  

---

## 🧭 Pipeline Architectural Philosophy
The digital runtime handles intensive compiling tasks inside safe, temporary workloads rather than slowing down high-performance local inference gateways.
We utilize **Google Cloud Build** to handle model conversion (`convert.py`) and execution orchestration (`trtllm-build`), producing fully containerized web APIs that automatically deploy onto **Cloud Run GPU instances**.

### 📦 Core Integrated Control Files
1. **`Dockerfile.export`**: CPU-safe container utilized for environment verification, model checking, and basic script structural parsing. 
2. **`Dockerfile`**: Advanced CUDA 12.4 container that imports compiled TensorRT engines inside an optimized FastAPI wrapper for execution.
3. **`cloudbuild.export.yaml`**: Automated step-by-step CPU pipeline verifying Docker file schemas and conversion hooks.
4. **`cloudbuild.yaml`**: The heavyweight action pipeline executing parallel weight parsing, GEMM optimizing, assembly, and secure scale-to-GPU serverless launches.
5. **`deploy/entrypoint.sh`**: Robust orchestration shell handling validation testing, file layout inspections, and runtime deployment commands.
6. **`deploy/github_and_cloudrun_commands.sh`**: Pre-formatted, secure automation wrapper helping establish Cloud Build trigger setups in a single tap.

---

## 🛠️ Execution Manual

### Step 1: Initialize Local Workspace 
Ensure your workspace includes our configuration layer without disrupting upstream codebases:
```bash
# Add newly engineered control layers
git add Dockerfile Dockerfile.export cloudbuild.yaml cloudbuild.export.yaml DEPLOYMENT_NOTES.md deploy/
```

### Step 2: Test Safe Export Pipeline First (No GPU Quotas Required)
Initiate a standard verification step against Google Artifact Registry:
```bash
gcloud builds submit --config cloudbuild.export.yaml
```
*This step builds the validator container, pushes the artifacts securely, and outputs diagnostic flags.*

### Step 3: Trigger Automated Build Deployment Pipeline
Once validated, push configuration files directly to your main repository branch:
```bash
git commit -m "Add TensorRT Edge-LLM container deployment layer"
git push origin main
```
*The `pathfinder-trigger` automatically initiates the compiler execution cascade.*

### Step 4: Scale-to-GPU Live Monitoring
Upon a successful build process, retrieve service URL pings:
```bash
gcloud run services describe octagon-engine-llama3-8b --region=us-central1 --format="value(status.url)"
```

---

## 🛡️ Best Practice & Sandbox Guidelines
* **Secrets Policy**: NEVER hardcode API keys or HuggingFace (`_HF_TOKEN`) credentials inside configuration files. They are dynamically parsed during trigger substitution.
* **Quota Management**: CPU verification compiles safely within standard tier machine specs (`E2_HIGHCPU_8`). Ensure you request L4 GPU tier allocations inside `us-central1` prior to executing step 4.
