import streamlit as st

from agents.intelligence_agent import IntelligenceAgent
from agents.concept_agent import ConceptAgent
from agents.rubric_agent import RubricAgent
from agents.fairness_agent import FairnessAgent
from agents.bloom_agent import BloomAgent
from agents.feedback_agent import FeedbackAgent
from models.student import Student
from models.teacher import Teacher
from utils.file_reader import extract_text
from utils.pdf_generator import generate_pdf

# -------------------------------------------------
# Page Configuration
# -------------------------------------------------

st.set_page_config(
    page_title="AI Paper Evaluation System",
    page_icon="📝",
    layout="wide"
)

st.title("📝 AI Paper Evaluation System")
st.markdown("---")

# -------------------------------------------------
# Student & Teacher Information
# -------------------------------------------------

st.header("👨‍🎓 Student & Teacher Information")

col1, col2 = st.columns(2)

with col1:
    student_name = st.text_input("Student Name")
    register_no = st.text_input("Register Number")
    department = st.text_input("Department")

with col2:
    semester = st.selectbox(
        "Semester",
        ["1", "2", "3", "4", "5", "6", "7", "8"]
    )

    teacher_name = st.text_input("Teacher Name")

    subject = st.text_input(
        "Subject",
        "Computer Networks"
    )

st.markdown("---")

# -------------------------------------------------
# Topic
# -------------------------------------------------

topic = st.selectbox(
    "📚 Topic",
    [
        "OSI Model"
    ]
)

# -------------------------------------------------
# Upload Teacher Answer
# -------------------------------------------------

teacher_file = st.file_uploader(
    "📄 Upload Teacher Answer",
    type=["pdf", "docx", "txt"],
    key="teacher"
)

teacher_text = ""

if teacher_file is not None:
    teacher_text = extract_text(teacher_file)

teacher_answer = st.text_area(
    "👨‍🏫 Teacher Answer",
    value=teacher_text,
    height=200
)

# -------------------------------------------------
# Upload Student Answer
# -------------------------------------------------

student_file = st.file_uploader(
    "📄 Upload Student Answer",
    type=["pdf", "docx", "txt"],
    key="student"
)

student_text = ""

if student_file is not None:
    student_text = extract_text(student_file)

student_answer = st.text_area(
    "👨‍🎓 Student Answer",
    value=student_text,
    height=250
)

# -------------------------------------------------
# Evaluate Button
# -------------------------------------------------

if st.button("🚀 Evaluate Answer", use_container_width=True):

    student = Student(
        name=student_name,
        register_no=register_no,
        department=department,
        semester=semester,
        subject=subject
    )

    teacher = Teacher(
        name=teacher_name,
        subject=subject,
        max_marks=10
    )

    if teacher_answer.strip() == "" or student_answer.strip() == "":
        st.error("Please provide both Teacher and Student answers.")
        st.stop()

    # ---------------------------------------------
    # Initialize Agents
    # ---------------------------------------------

    intelligence = IntelligenceAgent()
    concept = ConceptAgent()
    rubric = RubricAgent()
    fairness = FairnessAgent()
    bloom = BloomAgent()
    feedback = FeedbackAgent()

    # ---------------------------------------------
    # AI Evaluation
    # ---------------------------------------------

    similarity = intelligence.compare_answers(
        teacher_answer,
        student_answer
    )

    found, missing = concept.check_concepts(
        topic,
        student_answer
    )

    marks = rubric.evaluate(
        topic,
        found,
        missing,
        student_answer
    )

    confidence = fairness.verify(similarity)

    bloom_result = bloom.analyze(student_answer)

    feedback_result = feedback.generate_feedback(
        marks,
        bloom_result
    )

    # ---------------------------------------------
    # Generate PDF Report
    # ---------------------------------------------

    pdf_file = generate_pdf(
        student,
        teacher,
        topic,
        marks,
        bloom_result,
        found,
        missing,
        feedback_result
    )

    # ---------------------------------------------
    # Success Message
    # ---------------------------------------------

    st.success("✅ Evaluation Completed Successfully!")

    st.markdown("## 👨‍🎓 Student & Teacher Details")

    c1, c2, c3 = st.columns(3)

    with c1:
        st.info(f"Student: {student.name}")

    with c2:
        st.info(f"Register No: {student.register_no}")

    with c3:
        st.info(f"Department: {student.department}")

    c4, c5, c6 = st.columns(3)

    with c4:
        st.info(f"Semester: {student.semester}")

    with c5:
        st.info(f"Subject: {student.subject}")

    with c6:
        st.info(f"Teacher: {teacher.name}")

    st.markdown("---")

    # ---------------------------------------------
    # Summary Cards
    # ---------------------------------------------

    st.markdown("## 📊 Evaluation Summary")

    c1, c2, c3, c4 = st.columns(4)

    with c1:
        st.metric(
            "🏆 Grade",
            marks["Grade"]
        )

    with c2:
        st.metric(
            "📝 Total Marks",
            f'{marks["Total"]}/10'
        )

    with c3:
        st.metric(
            "🎓 Bloom Level",
            bloom_result["level"]
        )

    with c4:
        st.metric(
            "🤖 AI Confidence",
            f"{confidence}%"
        )

    st.markdown("---")

    # ---------------------------------------------
    # Tabs
    # ---------------------------------------------

    tab1, tab2, tab3, tab4 = st.tabs([
        "📊 Marks",
        "📚 Concepts",
        "🎓 Bloom",
        "💬 Feedback"
    ])

    # =============================================
    # MARKS TAB
    # =============================================

    with tab1:

        st.subheader("Section-wise Marks")

        st.write("### Concepts")
        st.progress(marks["Concepts"] / 4)
        st.write(f'{marks["Concepts"]} / 4')

        st.write("### Diagram")
        st.progress(marks["Diagram"] / 2)
        st.write(f'{marks["Diagram"]} / 2')

        st.write("### Advantages")
        st.progress(marks["Advantages"] / 2)
        st.write(f'{marks["Advantages"]} / 2')

        st.write("### Conclusion")
        st.progress(marks["Conclusion"] / 2)
        st.write(f'{marks["Conclusion"]} / 2')

        st.markdown("---")

        st.metric(
            "Percentage",
            f'{marks["Percentage"]}%'
        )

        st.info(
            f'Remark : {marks["Remark"]}'
        )

    # =============================================
    # CONCEPT TAB
    # =============================================

    with tab2:

        col1, col2 = st.columns(2)

        with col1:

            st.subheader("✅ Concepts Found")

            if found:
                for concept_name in found:
                    st.success(concept_name)
            else:
                st.warning("No Concepts Found")

        with col2:

            st.subheader("❌ Missing Concepts")

            if missing:
                for concept_name in missing:
                    st.error(concept_name)
            else:
                st.success("No Missing Concepts 🎉")

    # =============================================
    # BLOOM TAB
    # =============================================

    with tab3:

        st.subheader("Bloom's Taxonomy")

        st.metric(
            "Detected Level",
            bloom_result["level"]
        )

        st.progress(
            bloom_result["confidence"] / 100
        )

        st.write(
            f'Confidence : {bloom_result["confidence"]}%'
        )

        st.info(
            bloom_result["reason"]
        )

        if "matched" in bloom_result:

            st.subheader("Matched Keywords")

            for word in bloom_result["matched"]:
                st.success(word)

    # =============================================
    # FEEDBACK TAB
    # =============================================

    with tab4:

        with st.expander("✅ Strengths", expanded=True):

            for item in feedback_result["strengths"]:
                st.success(item)

        with st.expander("⚠ Areas to Improve"):

            if feedback_result["improvements"]:

                for item in feedback_result["improvements"]:
                    st.warning(item)

            else:
                st.success("No Improvements Needed")

        with st.expander("💡 Suggestions"):

            for item in feedback_result["suggestions"]:
                st.info(item)

    st.markdown("---")

    # ---------------------------------------------
    # Download PDF Report
    # ---------------------------------------------

    st.markdown("---")

    with open(pdf_file, "rb") as file:
        st.download_button(
            label="📥 Download Evaluation Report",
            data=file,
            file_name=f"{student.register_no}_Evaluation_Report.pdf",
            mime="application/pdf",
            use_container_width=True
        )

    st.caption("Developed using Streamlit and AI-based Paper Evaluation Agents")