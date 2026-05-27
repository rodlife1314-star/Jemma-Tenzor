#!/usr/bin/env python3
"""
Validates Python module dependencies and checks for structural package mismatches.
"""
import sys

def validate_dependencies():
    print("[VALIDATOR] Running dependency checks...")
    critical_deps = ["fastapi", "pydantic", "transformers", "numpy"]
    missing = []
    
    for dep in critical_deps:
        try:
            __import__(dep)
            print(f"  [OK] Found dependency: {dep}")
        except ImportError:
            print(f"  [MISSING] Unable to load critical dependency: {dep}")
            missing.append(dep)
            
    if missing:
        print(f"[WARNING] Several runtime dependencies are absent in current light-tier: {missing}")
        return False
    
    print("[SUCCESS] All runtime dependencies structurally present.")
    return True

if __name__ == "__main__":
    validate_dependencies()
