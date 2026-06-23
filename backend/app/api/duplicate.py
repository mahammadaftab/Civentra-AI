import os
import math
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import google.generativeai as genai
from app.services.firebase_admin_service import get_firestore_client

router = APIRouter()

# Initialize Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

class DuplicateCheckRequest(BaseModel):
    lat: float
    lng: float
    category: str
    image_url: Optional[str] = None

class DuplicateCheckResponse(BaseModel):
    is_duplicate: bool
    probability: float
    existing_issue_id: Optional[str] = None
    existing_complaint_id: Optional[str] = None

def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance in meters between two points 
    on the earth (specified in decimal degrees)
    """
    R = 6371000  # Radius of earth in meters
    
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_phi/2) * math.sin(delta_phi/2) + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda/2) * math.sin(delta_lambda/2)
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c
    return distance

@router.post("/analyze", response_model=DuplicateCheckResponse)
async def check_duplicate(request: DuplicateCheckRequest):
    try:
        db = get_firestore_client()
        
        # 1. Spatial Filter: Get all active issues in the same category
        issues_ref = db.collection("issues").where("category", "==", request.category).where("status", "in", ["Submitted", "Analyzed", "Verified", "Assigned", "In Progress"]).get()
        
        nearby_issues = []
        for doc in issues_ref:
            data = doc.to_dict()
            if "gpsCoordinates" in data and data["gpsCoordinates"]:
                existing_lat = data["gpsCoordinates"].get("lat")
                existing_lng = data["gpsCoordinates"].get("lng")
                if existing_lat and existing_lng:
                    dist = haversine(request.lat, request.lng, existing_lat, existing_lng)
                    # If within 100 meters, flag for AI review
                    if dist <= 100:
                        nearby_issues.append({"id": doc.id, "data": data, "distance": dist})
        
        if not nearby_issues:
            return DuplicateCheckResponse(is_duplicate=False, probability=0.0)

        # Sort by closest first
        nearby_issues.sort(key=lambda x: x["distance"])
        closest_issue = nearby_issues[0]

        # 2. AI Visual Comparison
        # If we have images for both, we can use Gemini. 
        # But for performance and simplicity in this pipeline, we will use Gemini to compare textual descriptions and distance 
        # (Or we can just rely on the spatial + category match as a high probability duplicate).
        # Let's ask Gemini to evaluate the likelihood based on context.
        
        prompt = f"""
        You are a civic intelligence Duplicate Detection Agent.
        A user is reporting a new issue.
        Category: {request.category}
        Distance from existing active report: {closest_issue['distance']:.1f} meters.
        
        Existing Report Title: {closest_issue['data'].get('title')}
        Existing Report Description: {closest_issue['data'].get('description')}
        
        Based on this, what is the probability that the new report is a duplicate of the existing report?
        Return ONLY a JSON object: {{"probability": 0.0 - 100.0, "reason": "string"}}
        """
        
        response = model.generate_content(prompt)
        text_resp = response.text.strip()
        
        # Strip markdown if present
        if text_resp.startswith("```json"):
            text_resp = text_resp[7:-3].strip()
            
        result = json.loads(text_resp)
        prob = float(result.get("probability", 0))
        
        # If probability > 70%, we flag it
        is_dup = prob > 70.0

        return DuplicateCheckResponse(
            is_duplicate=is_dup,
            probability=prob,
            existing_issue_id=closest_issue['id'],
            existing_complaint_id=closest_issue['data'].get('complaintId')
        )
        
    except Exception as e:
        print(f"Error in Duplicate Detection: {str(e)}")
        # Fail open: if duplicate detection crashes, don't block submission
        return DuplicateCheckResponse(is_duplicate=False, probability=0.0)
