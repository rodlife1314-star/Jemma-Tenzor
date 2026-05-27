#!/usr/bin/env python3
"""
Parses structural Model Manifest templates against compiled definitions schema.
"""
import json
import os

def validate_model_manifest(manifest_path: str) -> bool:
    print(f"[VALIDATOR] Checking model manifest layout: {manifest_path}")
    if not os.path.exists(manifest_path):
        print(f"  [ERROR] Manifest target missing entirely.")
        return False
        
    try:
        with open(manifest_path, "r") as f:
            data = json.load(f)
            
        required = ["model_id", "repo_tag", "precision"]
        for key in required:
            if key not in data:
                print(f"  [ERROR] Key missing: '{key}'")
                return False
                
        print(f"  [SUCCESS] Manifest file structurally valid for '{data['model_id']}'")
        return True
    except Exception as e:
        print(f"  [ERROR] Failed to parse JSON manifest structure: {e}")
        return False

if __name__ == "__main__":
    # Internal validation diagnostic test
    validate_model_manifest("/config/model_profile_template.json")
