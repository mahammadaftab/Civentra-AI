from fastapi import APIRouter, HTTPException
from app.schemas.vision_schema import VisionAnalyzeRequest, VisionAnalysisResponse
from app.agents.vision_agent import analyze_image

router = APIRouter()

@router.post("/vision/analyze", response_model=VisionAnalysisResponse)
async def analyze_civic_image(request: VisionAnalyzeRequest):
    """
    Receives an image URL, downloads it, and uses the Gemini Vision Agent
    to automatically categorize and assess the severity of the issue.
    """
    try:
        # The agent returns a dictionary matching the schema
        analysis_dict = analyze_image(request.image_url)
        return VisionAnalysisResponse(**analysis_dict)
    except ValueError as ve:
        # Configuration errors (like missing API key)
        raise HTTPException(status_code=500, detail=str(ve))
    except Exception as e:
        # General errors (download fail, API timeout)
        raise HTTPException(status_code=400, detail=str(e))
