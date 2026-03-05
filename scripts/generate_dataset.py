import os

# 5 Demo Transcripts
DEMO_DATA = [
    ("account_001", "Ben's Electric demo line..."),
    ("account_002", "Shelley's Plumbing demo line... we handle emergency leaks and fire alarm issue."),
    ("account_003", "Quick HVAC demo line... sprinkler leak issues are common."),
    ("account_004", "Safe Guard Alarms demo line..."),
    ("account_005", "Elite Facility demo line... ServiceTrade integration is required.")
]

# 5 Onboarding Transcripts
ONBOARDING_DATA = [
    ("account_001", "Monday-Friday, 8:00 AM to 5:00 PM EST. 30 seconds for transfer."),
    ("account_002", "Monday-Friday, 9:00 AM to 6:00 PM PST. Fire alarm triggers and sprinkler leaks."),
    ("account_003", "Monday-Friday, 7:00 AM to 4:00 PM MST. Never create sprinkler jobs in ServiceTrade."),
    ("account_004", "Monday-Friday, 8:30 AM to 5:30 PM CST. 45 seconds timeout."),
    ("account_005", "Monday-Friday, 10:00 AM to 7:00 PM EST. Sprinkle leaks are critical.")
]

def generate():
    os.makedirs("dataset", exist_ok=True)
    
    for acc_id, content in DEMO_DATA:
        with open(f"dataset/demo_{acc_id}.txt", "w", encoding='utf-8') as f:
            f.write(content)
            
    for acc_id, content in ONBOARDING_DATA:
        with open(f"dataset/onboard_{acc_id}.txt", "w", encoding='utf-8') as f:
            f.write(content)
            
    print("Dataset of 10 transcripts generated in /dataset")

if __name__ == "__main__":
    generate()
