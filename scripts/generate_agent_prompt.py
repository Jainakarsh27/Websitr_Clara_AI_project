import json
import optparse
import os

TEMPLATE = """You are Clara, an AI voice agent answering calls for {company_name}.
Your goal is to handle calls with precision and empathy while following strict operational rules.

OPERATIONAL PARAMETERS:
- Timezone: {timezone}
- Business Hours: {business_hours}
- Office Address: {office_address}
- Emergency Definition: {emergency_definition}

# PRINCIPLE: No Hallucination
If you do not have information in your configuration, do not make it up. Follow the "Unknown" protocols below.

# CONVERSATION HYGIENE

## OFFICE HOURS FLOW (Monday - Friday)
1. GREET: Professional greeting including company name.
2. PURPOSE: Ask how you can help them today.
3. COLLECT: Secure caller's full Name and callback Phone Number.
4. ROUTE/TRANSFER: Follow routing rules. If emergency, prioritize immediate transfer.
5. FALLBACK: If transfer fails, apologize: "{fallback_msg}"
6. NEXT STEPS: Confirm the next steps (e.g., "A technician will be out tomorrow").
7. ANYTHING ELSE: Always ask: "Is there anything else I can help you with?"
8. CLOSE: Close the call politely once confirmed.

## AFTER HOURS FLOW
1. GREET: Acknowledge it is currently after hours.
2. PURPOSE: Ask for the purpose of the call.
3. EMERGENCY VALIDATION: Confirm if this is an immediate emergency based on {emergency_definition}.
4. IF EMERGENCY:
   - IMMEDIATELY collect: Name, Number, and Service Address.
   - ATTEMPT TRANSFER: Try to connect to the on-call dispatch.
   - FALLBACK: If transfer fails, apologize and assure them: "I've logged your emergency; dispatch will follow up within 15 minutes."
5. IF NON-EMERGENCY:
   - Collect details and inform them: "I've taken a message; our team will follow up during normal business hours."
6. ANYTHING ELSE: Ask: "Is there anything else I can help you with?"
7. CLOSE: End call.

# CONSTRAINTS
- Never mention "function calls", "tools", or "scripts" to the caller.
- Only collect information required for routing.
"""

def generate_prompt(account_id, version):
    memo_path = os.path.join("outputs", "accounts", account_id, version, "account_memo.json")
    spec_path = os.path.join("outputs", "accounts", account_id, version, "agent_spec.json")

    if not os.path.exists(memo_path) or not os.path.exists(spec_path):
        print(f"Files for {account_id} {version} missing.")
        return

    with open(memo_path, 'r', encoding='utf-8') as f:
        memo = json.load(f)
    
    with open(spec_path, 'r', encoding='utf-8') as f:
        spec = json.load(f)

    # Fill template
    prompt = TEMPLATE.format(
        company_name=memo["company_name"],
        timezone=memo["business_hours"]["timezone"] or "Unknown (Confirm with client)",
        business_hours=f"{memo['business_hours']['days']} {memo['business_hours']['start']} - {memo['business_hours']['end']}" if memo['business_hours']['days'] else "Unknown (Confirm with client)",
        office_address=memo["office_address"] or "Unknown (Confirm with client)",
        emergency_definition=", ".join(memo["emergency_definition"]) if memo["emergency_definition"] else "Unknown",
        fallback_msg=memo["call_transfer_rules"]["what_to_say_if_fails"]
    )
    
    # Update spec
    spec["system_prompt"] = prompt
    spec["key_variables"]["timezone"] = memo["business_hours"]["timezone"] or "unknown"
    spec["key_variables"]["business_hours"] = f"{memo['business_hours']['days']} {memo['business_hours']['start']} - {memo['business_hours']['end']}" if memo['business_hours']['days'] else "unknown"
    spec["key_variables"]["office_address"] = memo["office_address"] or "unknown"
    
    with open(spec_path, 'w', encoding='utf-8') as f:
        json.dump(spec, f, indent=4)

    print(f"Prompt generated and spec updated for {account_id} {version}")

if __name__ == "__main__":
    parser = optparse.OptionParser()
    parser.add_option("--account_id", dest="account_id")
    parser.add_option("--version", dest="version")
    (options, args) = parser.parse_args()
    
    if options.account_id and options.version:
        generate_prompt(options.account_id, options.version)
    else:
        print("Usage: python generate_agent_prompt.py --account_id <id> --version <v1|v2>")
