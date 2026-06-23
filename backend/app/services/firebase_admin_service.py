import os
import firebase_admin
from firebase_admin import credentials, firestore

def get_firestore_client():
    if not firebase_admin._apps:
        # Check if service account JSON path is provided
        cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            print("WARNING: FIREBASE_SERVICE_ACCOUNT_JSON not set or file not found.")
            print("PDF Generator will fail to fetch Firestore data without a valid service account.")
            # Initialize with default credentials as fallback (works in GCP environments)
            try:
                firebase_admin.initialize_app()
            except Exception:
                pass
            
    try:
        return firestore.client()
    except Exception:
        return None
