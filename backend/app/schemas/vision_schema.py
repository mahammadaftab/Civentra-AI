from pydantic import BaseModel, HttpUrl

class VisionAnalyzeRequest(BaseModel):
    image_url: HttpUrl

class VisionAnalysisResponse(BaseModel):
    category: str
    confidence: float
    severity: str
    suggested_department: str
    risk_summary: str
