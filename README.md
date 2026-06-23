# Civentra AI

<div align="center">
  <h3>Communities Don't Need More Complaints.<br/>They Need Autonomous Problem Solving.</h3>
  <p>An enterprise-grade, Multi-Agent Civic Operating System powered by Gemini 1.5 Flash.</p>
</div>

---

## 🏆 The Problem

Traditional civic reporting apps (like 311) are black holes. Citizens submit reports that sit in opaque backlogs for months. Duplicate reports flood the system. City planners react to infrastructure failures instead of preventing them. Repair crews mark jobs as "Done" without oversight. 

**The result:** Broken trust, wasted budgets, and decaying cities.

## 🚀 The Solution: Civentra AI

Civentra AI replaces the traditional complaint backlog with an autonomous, multi-agent workforce. We built **6 specialized Gemini AI Agents** that handle the entire lifecycle of a civic issue—from the moment a citizen snaps a photo, to the moment the repair crew submits proof of resolution.

We also **gamified civic duty**, rewarding citizens with Hero Points, Badges, and Trust Scores for accurate reporting and community verification.

---

## 🧠 Agentic Depth: The 6-Agent Workforce

Civentra is not a wrapper. It is a deeply agentic system powered by **Gemini 1.5 Flash & Pro**, working sequentially:

1. **👁️ Vision Routing Agent:** When a citizen uploads a photo (e.g., a pothole), Gemini Vision instantly categorizes it, extracts the severity, and autonomously routes it to the correct department (e.g., Department of Transportation) without human intervention.
2. **🛡️ Duplicate Detection Agent:** Before a report is saved, this agent uses Haversine distance calculations and image similarity to detect if someone else already reported the same pothole, merging data instead of spamming city queues.
3. **⚠️ Severity Risk Agent:** A specialized deep-analysis agent that reads the context and assigns a mathematical `0-100` Risk Score (e.g., "This water leak is near a power station: Risk Score 95").
4. **⚖️ Community Verification Agent:** Prevents AI hallucinations and spam by sending nearby citizens a ping to verify the issue. It calculates mathematical consensus to establish a "Community Confidence Score".
5. **🔮 Predictive Intelligence Agent:** Acts as an AI Urban Planner. It ingests historical spatial data to forecast future infrastructure hotspots, displaying them on a tactical map.
6. **✅ Resolution Verification Agent:** Acts as a strict City Inspector. When a crew marks a job as "Done", they must upload an "After Photo". Gemini Vision mathematically compares the Before and After photos to verify the fix, refusing to close the ticket if the work is shoddy.

---

## 🛠️ Google Technologies Used

We maximized our usage of the Google Cloud & AI ecosystem to build a highly scalable, real-time application.

- **Google Gemini 1.5 Flash/Pro:** The core intelligence engine powering all 6 agents, utilizing Multimodal Vision, Structured JSON Outputs, and Deep Reasoning.
- **Firebase Authentication:** Secure, frictionless role-based access control (Citizens vs. Super Admins vs. Department Crews).
- **Cloud Firestore:** Real-time NoSQL database syncing data instantly between the citizen app and the Admin Command Center.
- **Firebase Storage:** Securely hosts and serves user-generated media (Before/After photos, videos, voice memos).
- **Google Maps API:** Powering the Geo-Intelligence Map and Predictive Hotspot Heatmaps.

---

## 💻 Tech Stack

- **Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **Backend AI Microservices:** Python, FastAPI, Google Generative AI SDK, Firebase Admin SDK
- **Database & Auth:** Firebase / Google Cloud

---

## 🚀 Getting Started

### 1. Start the Backend (AI Microservices)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt

# Create a .env file with your GEMINI_API_KEY
python main.py
```
*The FastAPI server will boot up on port 8000.*

### 2. Start the Frontend (Next.js)
```bash
# In the root directory
npm install
npm run dev
```
*The web app will boot up on localhost:3000.*

---

## 🎮 The Experience

- **Citizens:** Log in via the `/dashboard` to report issues, earn Hero Points, climb the Leaderboard, and verify local complaints.
- **Department Crews:** Log in via the `/department` queue to see autonomously routed tasks and upload "After Photos" for AI Verification.
- **Super Admins:** Log in via the `/admin` Command Center to view the live Geo-Map, monitor the Agent Health Dashboard, and run Predictive Intelligence models.

---

### *Built for the future of Smart Cities.*
