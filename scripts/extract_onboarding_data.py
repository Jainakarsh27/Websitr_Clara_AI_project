import json
import optparse
import os
import re

def extract_onboarding_data(transcript_path):
    with open(transcript_path, 'r', encoding='utf-8') as f:
        transcript = f.read()

    # Extraction logic for onboarding call
    updates = {}

    # Business Hours
    hours_match = re.search(r"Monday-Friday, (.*?) to (.*? (?:AM|PM)) (.*)", transcript)
    if hours_match:
        updates["business_hours"] = {
            "days": "Monday-Friday",
            "start": hours_match.group(1),
            "end": hours_match.group(2),
            "timezone": hours_match.group(3).strip(".")
        }

    # Emergency Definition
    if "sprinkler leaks" in transcript.lower() or "fire alarm triggers" in transcript.lower():
        updates["emergency_definition"] = ["sprinkler leak", "fire alarm trigger"]

    # Transfer Rules
    timeout_match = re.search(r"(\d+) seconds", transcript)
    if timeout_match:
        updates["call_transfer_rules"] = {
            "transfer_timeout": int(timeout_match.group(1)),
            "retry_attempts": 1,
            "what_to_say_if_fails": "I'm sorry, I'm having trouble connecting you. Let me try another way."
        }

    # Integration Constraints
    if "Never create sprinkler jobs in ServiceTrade" in transcript:
        updates["integration_constraints"] = ["Never create sprinkler jobs in ServiceTrade directly"]

    return updates

if __name__ == "__main__":
    parser = optparse.OptionParser()
    parser.add_option("--transcript", dest="transcript")
    parser.add_option("--account_id", dest="account_id")
    (options, args) = parser.parse_args()
    
    if options.transcript and options.account_id:
        data = extract_onboarding_data(options.transcript)
        output_path = os.path.join("outputs", "accounts", options.account_id, "v2_update.json")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        print(f"Onboarding updates extracted to {output_path}")
    else:
        print("Usage: python extract_onboarding_data.py --transcript <path> --account_id <id>")
