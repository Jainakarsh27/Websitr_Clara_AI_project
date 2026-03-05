import json
import optparse
import os
import copy

def apply_patch(account_id):
    v1_path = os.path.join("outputs", "accounts", account_id, "v1", "account_memo.json")
    update_path = os.path.join("outputs", "accounts", account_id, "v2_update.json")
    v2_dir = os.path.join("outputs", "accounts", account_id, "v2")
    os.makedirs(v2_dir, exist_ok=True)

    if not os.path.exists(v1_path) or not os.path.exists(update_path):
        print("v1 memo or update file missing.")
        return

    with open(v1_path, 'r', encoding='utf-8') as f:
        memo = json.load(f)
    
    with open(update_path, 'r', encoding='utf-8') as f:
        updates = json.load(f)

    # Apply updates (Conflict Resolution Logic: Onboarding overrides v1)
    v2_memo = copy.deepcopy(memo)
    
    for key, value in updates.items():
        v2_memo[key] = value
    
    # Update version info in notes or metadata
    v2_memo["notes"] = "Updated with onboarding call data."
    
    # Clear questions if they are resolved (simplified logic)
    if "business_hours" in updates:
        v2_memo["questions_or_unknowns"] = [q for q in v2_memo["questions_or_unknowns"] if "business hours" not in q.lower()]
    if "integration_constraints" in updates:
        v2_memo["questions_or_unknowns"] = [q for q in v2_memo["questions_or_unknowns"] if "ServiceTrade" not in q.lower()]

    with open(os.path.join(v2_dir, "account_memo.json"), 'w', encoding='utf-8') as f:
        json.dump(v2_memo, f, indent=4)

    # v2 Agent Spec
    v1_spec_path = os.path.join("outputs", "accounts", account_id, "v1", "agent_spec.json")
    if os.path.exists(v1_spec_path):
        with open(v1_spec_path, 'r') as f:
            spec = json.load(f)
        spec["version"] = "v2"
        if "business_hours" in updates:
            bh = updates["business_hours"]
            spec["key_variables"]["business_hours"] = f"{bh['days']} {bh['start']}-{bh['end']}"
            spec["key_variables"]["timezone"] = bh["timezone"]
        
        with open(os.path.join(v2_dir, "agent_spec.json"), 'w', encoding='utf-8') as f:
            json.dump(spec, f, indent=4)

    print(f"v2 configuration applied for {account_id}")

if __name__ == "__main__":
    parser = optparse.OptionParser()
    parser.add_option("--account_id", dest="account_id")
    (options, args) = parser.parse_args()
    
    if options.account_id:
        apply_patch(options.account_id)
    else:
        print("Usage: python apply_patch.py --account_id <id>")
