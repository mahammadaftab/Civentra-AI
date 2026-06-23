# Civentra AI 🏙️🤖

**Autonomous Multi-Agent Civic Intelligence Platform**

Communities frequently face issues such as potholes, water leakages, damaged streetlights, waste management concerns, and public infrastructure challenges. Reporting these issues is often fragmented, difficult to track, and lacks transparency.

**Civentra AI** is a next-generation platform that enables citizens to identify, report, validate, track, and resolve community issues through collaboration, data, and intelligent automation. Our solution leverages a multi-agent AI system to ensure transparency, accountability, and active community participation.

---

## 🌟 Key Features

- **Image & Video-Based Issue Reporting**: Frictionless reporting using Next.js 15 and Firebase Storage.
- **AI-Powered Issue Categorization**: Automated classification and severity scoring via Gemini Vision and Gemini 2.5 Flash.
- **Geo-Location & Mapping**: Dynamic hot-spot prediction and mapping using Google Maps Platform and Vertex AI.
- **Community Verification**: Crowdsourced validation layer to prevent duplicate reports.
- **Real-Time Issue Tracking**: Live command center dashboards for authorities.
- **Predictive Insights**: AI forecasts for proactive infrastructure maintenance.
- **Gamification for Citizen Engagement**: "Hero Rewards" system to encourage active civic participation.

---

## 🏗️ Architecture

Civentra AI is designed as a highly scalable, serverless enterprise application.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, React Three Fiber.
- **Backend**: FastAPI (Python), Google Cloud Tasks for agent orchestration.
- **Database**: Firebase Firestore (NoSQL) with strict Role-Based Access Control (RBAC).
- **AI / ML**: Gemini 2.5 Flash, Gemini Vision, Google Vertex AI.
- **Deployment**: Vercel (Frontend Edge Network), Google Cloud Run (Backend API).

### The Multi-Agent Workflow
When a citizen reports an issue, our intelligent workforce takes over:
1. **Vision Agent**: Analyzes media for structural damage.
2. **Severity Agent**: Calculates impact and urgency.
3. **Geo Intelligence Agent**: Maps and clusters issues.
4. **Verification Agent**: Validates reports and flags duplicates.
5. **Resolution Agent**: Routes the issue to the correct municipal department.
6. **Analytics Agent**: Generates actionable insights and predictive forecasts.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm, yarn, or pnpm
- Firebase Project credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mahammadaftab/Civentra-AI.git
   cd Civentra-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to explore the platform.

---

## 🎯 Evaluation Focus

This platform demonstrates how AI can empower communities to address local challenges more efficiently through:
- Improved and frictionless reporting.
- Decentralized, crowdsourced verification.
- Autonomous tracking and intelligent routing.
- Faster, data-driven resolution of civic issues.

---

*Built for the future of Smart Cities.*
