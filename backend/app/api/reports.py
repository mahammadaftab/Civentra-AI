from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.services.firebase_admin_service import get_firestore_client
from app.services.pdf_generator import build_civic_report_pdf

router = APIRouter()

@router.get("/download/{issue_id}")
async def download_report_pdf(issue_id: str):
    """
    Fetches the issue data from Firestore and dynamically generates a PDF report.
    Returns the PDF as a downloadable stream.
    """
    db = get_firestore_client()
    if not db:
        raise HTTPException(
            status_code=500, 
            detail="Firebase Admin SDK is not configured properly. Cannot fetch issue data."
        )

    # Fetch document
    doc_ref = db.collection("issues").document(issue_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Issue not found.")

    issue_data = doc.to_dict()
    issue_data["id"] = doc.id
    
    # Generate PDF in memory
    try:
        pdf_buffer = build_civic_report_pdf(issue_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=CIV-REPORT-{issue_data.get('complaintId', issue_id)}.pdf"
        }
    )
