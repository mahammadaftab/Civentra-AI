import os
import json
import requests
import google.generativeai as genai
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# We use gemini-1.5-flash for fast, multimodal vision tasks
VISION_MODEL = "gemini-1.5-flash"

SYSTEM_PROMPT = """
You are an expert AI Vision Agent for a Smart City Civic Issue reporting platform.
Your job is to analyze images uploaded by citizens and extract structured data to automate routing.

Analyze the image and detect if it falls into one of these categories:
- Pothole
- Road Damage
- Garbage / Illegal Dumping
- Water Leakage
- Streetlight Damage
- Infrastructure Damage
- Other

You MUST respond with a valid JSON object matching this exact schema:
{
  "category": "String (one of the categories above)",
  "confidence": "Float (between 0.0 and 1.0 representing your confidence)",
  "severity": "String (Low, Medium, High, Critical)",
  "suggested_department": "String (MUST BE EXACTLY ONE OF: Roads, Water, Electrical, Sanitation, Parks)",
  "risk_summary": "String (A 1-2 sentence summary of the immediate risks to public safety)"
}

Do not include markdown blocks, just the raw JSON string.
"""

# Simple in-memory cache to prevent re-analyzing the same image url repeatedly
@lru_cache(maxsize=100)
def analyze_image_with_gemini_cached(image_url: str) -> dict:
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured in the backend environment.")

    # 1. Download the image into memory
    try:
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        image_bytes = response.content
        mime_type = response.headers.get("content-type", "image/jpeg")
    except Exception as e:
        raise Exception(f"Failed to download image from URL: {str(e)}")

    # 2. Package it for Gemini
    image_parts = [
        {
            "mime_type": mime_type,
            "data": image_bytes
        }
    ]

    # 3. Request structured JSON from Gemini
    model = genai.GenerativeModel(
        model_name=VISION_MODEL,
        system_instruction=SYSTEM_PROMPT,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.2, # Low temperature for more deterministic categorization
        }
    )

    try:
        result = model.generate_content(
            contents=[
                "Analyze this civic issue image and provide the JSON report.",
                image_parts[0]
            ]
        )
        
        # Parse the JSON response
        analysis_data = json.loads(result.text)
        return analysis_data

    except Exception as e:
        raise Exception(f"Gemini API analysis failed: {str(e)}")


def analyze_image(image_url: str) -> dict:
    """Wrapper function to handle the URL correctly for the cache"""
    return analyze_image_with_gemini_cached(str(image_url))
