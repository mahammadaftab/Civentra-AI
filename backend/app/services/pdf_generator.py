import io
import qrcode
import requests
from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_qr_code(url: str) -> io.BytesIO:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    return img_byte_arr

def download_image_to_bytes(url: str) -> io.BytesIO:
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return io.BytesIO(response.content)
    except Exception as e:
        print(f"Failed to download image: {e}")
        return None

def build_civic_report_pdf(issue_data: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    
    # Setup document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=20,
        textColor=colors.HexColor("#1e3a8a") # Blue-900
    )
    
    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=10,
        textColor=colors.HexColor("#4b5563") # Gray-600
    )
    
    normal_style = styles["Normal"]
    
    elements = []
    
    # 1. Header
    elements.append(Paragraph(f"Civentra AI - Official Issue Report", title_style))
    elements.append(Paragraph(f"Complaint ID: {issue_data.get('complaintId', 'UNKNOWN')}", subtitle_style))
    elements.append(Spacer(1, 0.2 * inch))
    
    # 2. Main Details Table
    data = [
        ["Title:", issue_data.get('title', 'N/A')],
        ["Category:", issue_data.get('category', 'N/A')],
        ["Location:", issue_data.get('location', 'N/A')],
        ["Status:", issue_data.get('status', 'N/A')],
        ["Reported By:", issue_data.get('reportedBy', 'N/A')],
        ["Created At:", str(issue_data.get('createdAt', 'N/A'))[:19]],
    ]
    
    t = Table(data, colWidths=[1.5 * inch, 4.5 * inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#f3f4f6")),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#e5e7eb")),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.3 * inch))
    
    # 3. AI Analysis Section
    elements.append(Paragraph("AI Intelligence Assessment", subtitle_style))
    ai_data = [
        ["Severity Score:", issue_data.get('severity', 'Pending Analysis')],
        ["Confidence:", f"{float(issue_data.get('confidence', 0.0)) * 100:.1f}%" if issue_data.get('confidence') else "N/A"],
        ["Suggested Dept:", issue_data.get('department', 'Unassigned')],
    ]
    
    t_ai = Table(ai_data, colWidths=[1.5 * inch, 4.5 * inch])
    t_ai.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#f5f3ff")), # Purple tint
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#ddd6fe")),
    ]))
    elements.append(t_ai)
    elements.append(Spacer(1, 0.3 * inch))
    
    # Description
    elements.append(Paragraph("<b>Detailed Description:</b>", normal_style))
    elements.append(Spacer(1, 0.1 * inch))
    elements.append(Paragraph(issue_data.get('description', 'No description provided.'), normal_style))
    elements.append(Spacer(1, 0.4 * inch))
    
    # 4. Image & QR Code Side-by-side
    image_element = None
    media = issue_data.get('media', {})
    if isinstance(media, dict) and media.get('images') and len(media['images']) > 0:
        img_url = media['images'][0]
        img_bytes = download_image_to_bytes(img_url)
        if img_bytes:
            # Resize image to fit nicely
            try:
                rl_img = RLImage(img_bytes)
                rl_img._restrictSize(3 * inch, 3 * inch)
                image_element = rl_img
            except Exception:
                pass
                
    qr_url = f"https://civentra-ai.vercel.app/dashboard/issues/{issue_data.get('id', '')}"
    qr_bytes = generate_qr_code(qr_url)
    qr_img = RLImage(qr_bytes)
    qr_img._restrictSize(1.5 * inch, 1.5 * inch)
    
    # Create a simple table to hold image on left, QR on right
    if image_element:
        footer_table = Table([[image_element, qr_img]], colWidths=[4 * inch, 2 * inch])
    else:
        footer_table = Table([["No visual evidence attached.", qr_img]], colWidths=[4 * inch, 2 * inch])
        
    footer_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    elements.append(footer_table)
    
    elements.append(Spacer(1, 0.2 * inch))
    elements.append(Paragraph(f"Scan this QR code to track live status: {qr_url}", ParagraphStyle('small', fontSize=8, textColor=colors.gray)))

    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer
