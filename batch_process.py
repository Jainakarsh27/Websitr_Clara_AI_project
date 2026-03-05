import os
import subprocess

ACCOUNTS = ["account_001", "account_002", "account_003", "account_004", "account_005"]

def run_pipeline():
    print("--- STARTING BATCH PIPELINE PROCESSING ---")
    
    # 1. Clean previous outputs to ensure idempotency
    # (Optional, but good for demo)
    
    for acc in ACCOUNTS:
        print(f"\n[ORCHESTRATOR] Processing {acc}...")
        
        # Stage 1: Demo Call -> v1
        print(f"  > Executing Stage 1 (Demo)...")
        subprocess.run(["python", "scripts/extract_demo_data.py", 
                        "--transcript", f"dataset/demo_{acc}.txt", 
                        "--account_id", acc], check=True)
        
        subprocess.run(["python", "scripts/generate_agent_prompt.py", 
                        "--account_id", acc, "--version", "v1"], check=True)
        
        # Stage 2: Onboarding -> v2
        print(f"  > Executing Stage 2 (Onboarding Patch)...")
        subprocess.run(["python", "scripts/extract_onboarding_data.py", 
                        "--transcript", f"dataset/onboard_{acc}.txt", 
                        "--account_id", acc], check=True)
        
        subprocess.run(["python", "scripts/apply_patch.py", 
                        "--account_id", acc], check=True)
        
        subprocess.run(["python", "scripts/generate_agent_prompt.py", 
                        "--account_id", acc, "--version", "v2"], check=True)
        
        subprocess.run(["python", "scripts/generate_diff.py", 
                        "--account_id", acc], check=True)
        
        print(f"[SUCCESS] {acc} fully provisioned.")

    print("\n--- BATCH PROCESSING COMPLETE ---")

if __name__ == "__main__":
    run_pipeline()
