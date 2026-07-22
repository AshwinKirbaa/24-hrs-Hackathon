from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from datetime import datetime
import os


def generate_pdf(student, teacher, topic, marks, bloom_result,
                 found, missing, feedback_result):

    os.makedirs("output", exist_ok=True)

    filename = f"output/{student.register_no}_Evaluation_Report.pdf"

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    story = []

    story.append(Paragraph("<b>AI PAPER EVALUATION REPORT</b>", styles["Title"]))

    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph(f"<b>Student Name:</b> {student.name}", styles["Normal"]))
    story.append(Paragraph(f"<b>Register Number:</b> {student.register_no}", styles["Normal"]))
    story.append(Paragraph(f"<b>Department:</b> {student.department}", styles["Normal"]))
    story.append(Paragraph(f"<b>Semester:</b> {student.semester}", styles["Normal"]))

    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph(f"<b>Teacher:</b> {teacher.name}", styles["Normal"]))
    story.append(Paragraph(f"<b>Subject:</b> {teacher.subject}", styles["Normal"]))
    story.append(Paragraph(f"<b>Topic:</b> {topic}", styles["Normal"]))

    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph(f"<b>Total Marks:</b> {marks['Total']}/10", styles["Normal"]))
    story.append(Paragraph(f"<b>Grade:</b> {marks['Grade']}", styles["Normal"]))
    story.append(Paragraph(f"<b>Percentage:</b> {marks['Percentage']}%", styles["Normal"]))
    story.append(Paragraph(f"<b>Bloom Level:</b> {bloom_result['level']}", styles["Normal"]))

    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph("<b>Concepts Found</b>", styles["Heading2"]))

    for concept in found:
        story.append(Paragraph(f"• {concept}", styles["Normal"]))

    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph("<b>Missing Concepts</b>", styles["Heading2"]))

    for concept in missing:
        story.append(Paragraph(f"• {concept}", styles["Normal"]))

    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph("<b>Strengths</b>", styles["Heading2"]))

    for item in feedback_result["strengths"]:
        story.append(Paragraph(f"• {item}", styles["Normal"]))

    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph("<b>Improvements</b>", styles["Heading2"]))

    for item in feedback_result["improvements"]:
        story.append(Paragraph(f"• {item}", styles["Normal"]))

    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(
        Paragraph(
            f"Generated on: {datetime.now().strftime('%d-%m-%Y %H:%M:%S')}",
            styles["Italic"]
        )
    )

    doc.build(story)

    return filename