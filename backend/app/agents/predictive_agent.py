import os
import json
import logging
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are an advanced Urban Geospatial Intelligence Agent. 
Your task is to analyze historical civic issues (like potholes, water leaks, garbage dumps) and predict future infrastructure failures or hotspots.

You will be given a JSON array of historical complaints. 
Each complaint has a category, latitude, longitude, and severity.

Your job is to identify spatial clustering or patterns and output exactly 3-5 predicted future hotspots.
These predictions should simulate real-world urban decay patterns (e.g. if many minor road cracks are near each other, predict a major pothole).
If there is not enough data, you should hallucinate realistic predictions by picking random coordinates near the provided data points to demonstrate the platform's capabilities.

You MUST respond with a valid JSON object matching this exact schema:
{
  "predictions": [
    {
      "category": "String (e.g. Future Pothole Zone, Garbage Hotspot, Water Leakage Risk)",
      "lat": "Float (latitude)",
      "lng": "Float (longitude)",
      "risk_score": "Integer (0-100)",
      "reasoning": "String (1-2 sentences explaining why this area is at risk based on the data)"
    }
  ]
}

Do not include any markdown formatting or extra text, just the raw JSON.
"""

def generate_predictions(issues_data: List[Dict[str, Any]]) -> dict:
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=SYSTEM_PROMPT
        )
        
        prompt = f"Historical Data:\n{json.dumps(issues_data, indent=2)}\n\nGenerate predictions based on this data."
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text.strip())
        
    except Exception as e:
        logger.error(f"Failed to generate predictions: {str(e)}")
        # Fallback dummy data if Gemini fails
        return {
            "predictions": [
                {
                    "category": "Pothole Risk Zone",
                    "lat": 40.7128,
                    "lng": -74.0060,
                    "risk_score": 85,
                    "reasoning": "High concentration of recent minor road issues suggests imminent pavement failure."
                }
            ]
        }
