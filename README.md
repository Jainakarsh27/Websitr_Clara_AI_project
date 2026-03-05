# Clara Ultra Orchestrator — Intern Assignment
Created by **Akarsh Jain | Project Architect**

## 1. Overview
This project implements a zero-cost automation pipeline that converts client conversations (demo and onboarding) into structured, deployable AI voice agent configurations (Retell AI).

## 2. Architecture
- **Stage 0 (Discovery)**: Value proposition and high-impact UI for new clients.
- **Stage 1 (Auth Vault)**: Secure node access controlled by identity verification.
- **Stage 2 (Unified Dashboard)**: Command center for versioning, diffing, and pipeline simulation.

## 3. How to Run Locally

### 3.1 Prerequisite: n8n (Local Docker)
As per the requirement for zero spend, we recommend self-hosting n8n via Docker.
1. Install Docker Desktop.
2. Run the provided `docker-compose.yml`:
   ```bash
   docker-compose up -d
   ```
3. Import the workflows from `/workflows` into your local n8n instance.

### 3.2 Running the Dashboard
1. Simply open `/dashboard/index.html` in any modern browser.
2. Navigate the **Discovery** page and enter the **Vault**.
3. Use the **Pipeline Simulator** to trigger Stage 1 (Demo) and Stage 2 (Onboarding) logic.

## 4. Dataset Processing
- **Pipeline A (Demo)**: Processes transcripts from `/dataset/demo_calls` and produces `v1 (Draft)` Account Memos.
- **Pipeline B (Onboarding)**: Processes inputs from `/dataset/onboarding_calls` and patches `v1` to `v2 (Operational)`.
- Use the **Run Full Batch** button in the UI to process the complete 10-call dataset (5+5).

## 5. Outputs
- **Account Memos**: Stored in `/outputs/accounts/<id>/v1` and `v2`.
- **Retell Specs**: Versioned JSON configurations for Retell AI agents.
- **Changelogs**: Human-readable `changes.md` highlighting procedural updates.

## 6. Known Limitations & Improvements
- **Security**: Current version uses mock database identity; production would use OAuth2/Auth0.
- **LLM**: Rule-based simulation is used for zero-cost compliance; production would use GPT-4o with temperature 0 for extraction.

---
*Engineered for Excellence — Akarsh Jain © 2026*
