from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.agents.predictive_agent import generate_predictions

router = APIRouter()

class PredictiveRequest(BaseModel):
    issues: List[Dict[str, Any]]

class Prediction(BaseModel):
    category: str
    lat: float
    lng: float
    risk_score: int
    reasoning: str

class PredictiveResponse(BaseModel):
    predictions: List[Prediction]

@router.post("/analyze", response_model=PredictiveResponse)
async def analyze_predictions(request: PredictiveRequest):
    """
    Takes historical issues and uses Gemini to predict future failure points.
    """
    try:
        if not request.issues:
            # If no data is passed, we'll just pass an empty array to Gemini and let it hallucinate
            data = generate_predictions([])
        else:
            # We don't want to pass too much data to Gemini, just enough for pattern recognition
            # Take latest 50 issues and extract only necessary spatial data
            spatial_data = []
            for issue in request.issues[:50]:
                if issue.get("gpsCoordinates"):
                    spatial_data.append({
                        "category": issue.get("category"),
                        "lat": issue["gpsCoordinates"].get("lat"),
                        "lng": issue["gpsCoordinates"].get("lng"),
                        "severity": issue.get("severity")
                    })
            data = generate_predictions(spatial_data)

        return PredictiveResponse(predictions=data.get("predictions", []))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
