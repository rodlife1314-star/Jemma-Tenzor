#!/usr/bin/env python3
"""
CUDA / GPU compatibility diagnostics checker. Falbacks gracefully on standard setups.
"""
import os
import subprocess

def validate_gpu_availability():
    print("[VALIDATOR] Launching hardware context analyser...")
    
    try:
        res = subprocess.run(["nvidia-smi"], capture_output=True, text=True, timeout=5)
        if res.returncode == 0:
            print("[INFO] CUDA-supported hardware detected. Full GPU orchestration pipeline active.")
            print(res.stdout.split("\n")[0:5])
            return True
    except Exception:
        pass
        
    print("[INFO] No native GPU hardware found during sandbox query. Defaulting strictly to CPU-safe baseline triggers.")
    return False

if __name__ == "__main__":
    validate_gpu_availability()
