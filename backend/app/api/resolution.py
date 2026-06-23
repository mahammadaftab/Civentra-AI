from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agents.resolution_agent import verify_resolution

router = APIRouter()

class ResolutionVerifyRequest(BaseModel):
    before_image_url: str
    after_image_url: str

class ResolutionVerifyResponse(BaseModel):
    status: str
    confidence: float
    explanation: str

@router.post("/verify", response_model=ResolutionVerifyResponse)
async def verify_issue_resolution(request: ResolutionVerifyRequest):
    """
    Takes a before and after image and uses Gemini Vision to determine if the issue is actually resolved.
    """
    try:
        if not request.before_image_url or not request.after_image_url:
            raise HTTPException(status_code=400, detail="Both before and after image URLs are required.")
            
        data = verify_resolution(request.before_image_url, request.after_image_url)
        return ResolutionVerifyResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
