import json
import optparse
import os

def generate_diff(account_id):
    v1_path = os.path.join("outputs", "accounts", account_id, "v1", "account_memo.json")
    v2_path = os.path.join("outputs", "accounts", account_id, "v2", "account_memo.json")
    changelog_path = os.path.join("outputs", "accounts", account_id, "changes.md")

    if not os.path.exists(v1_path) or not os.path.exists(v2_path):
        print("v1 or v2 memo missing.")
        return

    with open(v1_path, 'r', encoding='utf-8') as f:
        v1 = json.load(f)
    with open(v2_path, 'r', encoding='utf-8') as f:
        v2 = json.load(f)

    changes = []

    # Business Hours
    v1_bh = v1.get("business_hours", {})
    v2_bh = v2.get("business_hours", {})
    if v1_bh != v2_bh and v2_bh.get("days"):
        changes.append(f"Business hours added:\n    {v2_bh['days']} {v2_bh['start']} – {v2_bh['end']} {v2_bh['timezone']}")

    # Emergency Definition
    if v1["emergency_definition"] != v2["emergency_definition"]:
        new_defs = "\n    ".join(v2["emergency_definition"])
        changes.append(f"Emergency definition updated:\n    {new_defs}")

    # Call Transfer Rules
    if v1["call_transfer_rules"] != v2["call_transfer_rules"]:
        timeout = v2["call_transfer_rules"].get("timeout_seconds")
        changes.append(f"Transfer timeout added:\n    {timeout} seconds")

    # Integration Constraints
    if v1["integration_constraints"] != v2["integration_constraints"]:
        constraints = "\n    ".join(v2["integration_constraints"])
        changes.append(f"Integration constraint added:\n    {constraints}")

    content = f"# CHANGELOG – {account_id}\n\nVersion 1 → Version 2\n\n"
    if not changes:
        content += "No changes detected."
    else:
        content += "\n\n".join(changes)

    with open(changelog_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Changelog generated for {account_id}")

if __name__ == "__main__":
    parser = optparse.OptionParser()
    parser.add_option("--account_id", dest="account_id")
    (options, args) = parser.parse_args()
    
    if options.account_id:
        generate_diff(options.account_id)
    else:
        print("Usage: python generate_diff.py --account_id <id>")
