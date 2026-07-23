import os
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer


def generate_pdf(
        student,
        teacher,
        topic,
        result
):
    """
    Generates AI Evaluation Report PDF from evaluation result dict.
    Returns the generated PDF file path.
    """
    os.makedirs("output", exist_ok=True)

    reg_no = getattr(student, "register_no", "Student")
    pdf_path = os.path.join(
        "output",
        f"{reg_no}_Evaluation_Report.pdf"
    )

    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(pdf_path)
    elements = []

    # Title
    elements.append(
        Paragraph("<b>AI Paper Evaluation Report</b>", styles["Title"])
    )
    elements.append(Spacer(1, 15))

    # Student Details
    elements.append(Paragraph("<b>Student Details</b>", styles["Heading2"]))
    elements.append(Paragraph(f"Name : {getattr(student, 'name', '')}", styles["BodyText"]))
    elements.append(Paragraph(f"Register No : {getattr(student, 'register_no', '')}", styles["BodyText"]))
    elements.append(Paragraph(f"Department : {getattr(student, 'department', '')}", styles["BodyText"]))
    elements.append(Paragraph(f"Semester : {getattr(student, 'semester', '')}", styles["BodyText"]))
    elements.append(Spacer(1, 10))

    # Teacher Details
    elements.append(Paragraph("<b>Teacher Details</b>", styles["Heading2"]))
    elements.append(Paragraph(f"Teacher : {getattr(teacher, 'name', '')}", styles["BodyText"]))
    elements.append(Paragraph(f"Subject : {getattr(teacher, 'subject', '')}", styles["BodyText"]))
    elements.append(Paragraph(f"Topic : {topic}", styles["BodyText"]))
    elements.append(Spacer(1, 10))

    # Evaluation Summary
    elements.append(Paragraph("<b>Evaluation Summary</b>", styles["Heading2"]))
    marks = result.get("marks", 0)
    total = getattr(teacher, "max_marks", 10)
    percentage = result.get("percentage", 0)
    grade = result.get("grade", "F")
    feedback = result.get("feedback", "")

    elements.append(Paragraph(f"<b>Total Marks : {marks} / {total}</b>", styles["BodyText"]))
    elements.append(Paragraph(f"Percentage : {percentage}%", styles["BodyText"]))
    elements.append(Paragraph(f"Grade : {grade}", styles["BodyText"]))
    elements.append(Paragraph(f"Feedback : {feedback}", styles["BodyText"]))
    elements.append(Spacer(1, 10))

    # Bloom Taxonomy
    elements.append(Paragraph("<b>Bloom Taxonomy</b>", styles["Heading2"]))
    elements.append(Paragraph(f"Detected Level : {result.get('bloom_level', 'Understand')}", styles["BodyText"]))
    elements.append(Paragraph(f"Confidence : {result.get('confidence', 0)}%", styles["BodyText"]))
    elements.append(Spacer(1, 10))

    # Concepts Found
    elements.append(Paragraph("<b>Concepts Found</b>", styles["Heading2"]))
    found = result.get("found_concepts", [])
    if found:
        for item in found:
            elements.append(Paragraph(f"• {item}", styles["BodyText"]))
    else:
        elements.append(Paragraph("None", styles["BodyText"]))
    elements.append(Spacer(1, 10))

    # Missing Concepts
    elements.append(Paragraph("<b>Missing Concepts</b>", styles["Heading2"]))
    missing = result.get("missing_concepts", [])
    if missing:
        for item in missing:
            elements.append(Paragraph(f"• {item}", styles["BodyText"]))
    else:
        elements.append(Paragraph("None", styles["BodyText"]))
    elements.append(Spacer(1, 10))

    # Strengths
    elements.append(Paragraph("<b>Strengths</b>", styles["Heading2"]))
    strengths = result.get("strengths", [])
    if strengths:
        for item in strengths:
            elements.append(Paragraph(f"• {item}", styles["BodyText"]))
    else:
        elements.append(Paragraph("None", styles["BodyText"]))
    elements.append(Spacer(1, 10))

    # Improvements
    elements.append(Paragraph("<b>Areas to Improve</b>", styles["Heading2"]))
    improvements = result.get("improvements", [])
    if improvements:
        for item in improvements:
            elements.append(Paragraph(f"• {item}", styles["BodyText"]))
    else:
        elements.append(Paragraph("No improvements needed.", styles["BodyText"]))
    elements.append(Spacer(1, 10))

    # Suggestions
    elements.append(Paragraph("<b>Suggestions</b>", styles["Heading2"]))
    suggestions = result.get("suggestions", [])
    if suggestions:
        for item in suggestions:
            elements.append(Paragraph(f"• {item}", styles["BodyText"]))
    else:
        elements.append(Paragraph("None", styles["BodyText"]))

    doc.build(elements)
    return pdf_path