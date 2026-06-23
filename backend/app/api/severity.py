import os
import json
import requests
from io import BytesIO
from PIL import Image
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from app.services.firebase_admin_service import get_firestore_client
from google.cloud import firestore

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

class SeverityAnalyzeRequest(BaseModel):
    issue_id: str

class SeverityAnalyzeResponse(BaseModel):
    severity: str
    risk_score: int
    reasoning: str

@router.post("/analyze", response_model=SeverityAnalyzeResponse)
async def analyze_severity(request: SeverityAnalyzeRequest):
    try:
        db = get_firestore_client()
        issue_ref = db.collection("issues").document(request.issue_id)
        doc = issue_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Issue not found")
            
        data = doc.to_dict()
        
        # Gather Context
        title = data.get("title", "Unknown")
        description = data.get("description", "No description")
        category = data.get("category", "Unknown")
        location = data.get("location", "Unknown")
        
        confirmations = len(data.get("confirmations", []))
        rejections = len(data.get("rejections", []))
        trust_score = data.get("communityConfidenceScore", 0)
        
        # Prepare Prompt
        prompt = f"""
        You are the Civentra Deep Severity & Risk Analysis Agent.
        Analyze the following civic issue and assign a comprehensive risk score and severity level.
        
        Title: {title}
        Category: {category}
        Location: {location}
        Description: {description}
        
        Community Verification Data:
        - Confirmations: {confirmations}
        - Rejections: {rejections}
        - Community Trust Score: {trust_score}%
        
        Based on this data (and the attached image if provided), determine the true risk this issue poses to public safety, infrastructure, or city operations.
        
        Return exactly and ONLY a JSON object matching this schema:
        {{
            "severity": "Low" | "Medium" | "High" | "Critical",
            "risk_score": integer between 0 and 100,
            "reasoning": "A highly detailed paragraph explaining your reasoning. Reference the image (if any) and the community verification data."
        }}
        """

        prompt_parts = [prompt]

        # Handle Image
        image_url = None
        if "media" in data and "images" in data["media"] and len(data["media"]["images"]) > 0:
            image_url = data["media"]["images"][0]
            
        if image_url:
            try:
                response = requests.get(image_url)
                if response.status_code == 200:
                    img = Image.open(BytesIO(response.content))
                    prompt_parts.append(img)
            except Exception as e:
                print(f"Failed to load image for severity analysis: {e}")

        # Generate Response
        response = model.generate_content(prompt_parts)
        text_resp = response.text.strip()
        
        if text_resp.startswith("```json"):
            text_resp = text_resp[7:-3].strip()
            
        result = json.loads(text_resp)
        
        severity = result.get("severity", "Medium")
        risk_score = int(result.get("risk_score", 50))
        reasoning = result.get("reasoning", "Analysis completed.")
        
        # Update Firestore
        new_event = {
            "status": data.get("status", "Analyzed"),
            "timestamp": firestore.SERVER_TIMESTAMP,
            "description": f"Deep Severity Analysis completed. Risk Score: {risk_score}/100. Severity updated to {severity}.",
            "actor": "Severity Agent"
        }
        
        issue_ref.update({
            "severity": severity,
            "riskScore": risk_score,
            "severityReasoning": reasoning,
            "events": firestore.ArrayUnion([new_event]),
            "updatedAt": firestore.SERVER_TIMESTAMP
        })
        
        return SeverityAnalyzeResponse(
            severity=severity,
            risk_score=risk_score,
            reasoning=reasoning
        )
        
    except Exception as e:
        print(f"Error in Severity Analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
