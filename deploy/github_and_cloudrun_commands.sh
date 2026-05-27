#!/bin/bash
# ==============================================================================
# OCTAGON OS - INTERACTIVE DEPLOYMENT AUTOMATOR
# Automated script helper specifically optimized for rodlife1314
# Target Project: tensorrt-edge-llm
# ==============================================================================

set -eo pipefail

REGION="us-central1"
TRIGGER_NAME="tensorrt-edge-llm-trigger"
REPO_OWNER="rodlife1314"
REPO_NAME="tensorrt-edge-llm"
BRANCH_PATTERN="main"

echo "=========================================================="
echo "🛰️  OCTAGON OS AUTOMATOR: DEPLOYMENT STAGE INITIATED"
echo "=========================================================="

echo "🔷 Step 1: Establishing the CI/CD Pipeline Loop on Google Cloud..."
gcloud builds triggers create github \
  --repo-owner="$REPO_OWNER" \
  --repo-name="$REPO_NAME" \
  --branch-pattern="$BRANCH_PATTERN" \
  --build-config="cloudbuild.export.yaml" \
  --name="$TRIGGER_NAME" \
  --region="$REGION" || {
    echo "ℹ️  Trigger already registered or manual cloud setup required. Skipping trigger create..."
  }

echo ""
echo "🔷 Step 2: Testing CPU-Safe Export Build Process..."
echo "To test your verification builder manually, run:"
echo "  gcloud builds submit --config cloudbuild.export.yaml"

echo ""
echo "🔷 Step 3: Git Packaging Commands Helper..."
echo "Execute these commands inside your local command line terminal to push safely:"
echo "----------------------------------------------------------"
echo "  git add Dockerfile Dockerfile.export cloudbuild.yaml cloudbuild.export.yaml DEPLOYMENT_NOTES.md deploy/"
echo "  git commit -m \"Add TensorRT Edge-LLM container deployment layer\""
echo "  git push origin main"
echo "----------------------------------------------------------"

echo ""
echo "🔷 Step 4: Scale-to-GPU Deployment Command Helper..."
echo "Once verified, deploy the full TensorRT container to Google Cloud Run V2 with:"
echo "----------------------------------------------------------"
echo "  gcloud beta run deploy octagon-engine-llama3-8b \\"
echo "    --image=\"us-central1-docker.pkg.dev/[PROJECT_ID]/tensorrt-edge/engine:llama3-8b-int8\" \\"
echo "    --region=\"us-central1\" \\"
echo "    --no-cpu-throttling \\"
echo "    --cpu=4 \\"
echo "    --memory=16Gi \\"
echo "    --gpu=1 \\"
echo "    --gpu-type=\"nvidia-l4\" \\"
echo "    --port=8000 \\"
echo "    --ingress=all \\"
echo "    --allow-unauthenticated"
echo "----------------------------------------------------------"

echo "=========================================================="
echo "✅ OCTAGON CORE READY FOR DEPLOYMENT SIGNALS"
echo "=========================================================="
