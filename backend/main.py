import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Use absolute import based on your setup. If api_router throws error we adjust.
from app.api.routes import router as api_router
from app.api.reports import router as reports_router
from app.api.duplicate import router as duplicate_router
from app.api.severity import router as severity_router
from app.api.predictive import router as predictive_router
from app.api.resolution import router as resolution_router

load_dotenv()

app = FastAPI(
    title="Civentra AI Services",
    description="Backend AI microservices for autonomous civic issue routing.",
    version="1.0.0"
)

# Configure CORS so the Next.js frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the AI agent routes
app.include_router(api_router, prefix="/api/agents", tags=["AI Agents"])

app.include_router(reports_router, prefix="/api/reports", tags=["Reports"])
app.include_router(duplicate_router, prefix="/api/agents/duplicate", tags=["Duplicate Detection"])
app.include_router(severity_router, prefix="/api/agents/severity", tags=["Severity Detection"])
app.include_router(predictive_router, prefix="/api/agents/predictive", tags=["Predictive Intelligence"])
app.include_router(resolution_router, prefix="/api/agents/resolution", tags=["Resolution Verification"])

@app.get("/")
def root():
    return {"status": "online", "message": "Civentra AI Backend Service Running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
