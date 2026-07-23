import os
import streamlit as st

from models.student import Student
from models.teacher import Teacher
from utils.file_reader import extract_text
from utils.pdf_generator import generate_pdf
from agents.ollama_vision_agent import OllamaVisionAgent

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

@st.cache_resource
def get_vision_agent():
    return OllamaVisionAgent(model="gemma3:4b")

vision_agent = get_vision_agent()

# Default Model Teacher Answer
DEFAULT_TEACHER_ANSWER = """The OSI model consists of seven layers:
1. Physical Layer: Handles bit transmission over physical media.
2. Data Link Layer: Responsible for node-to-node framing and error detection.
3. Network Layer: Manages packet routing and logical IP addressing.
4. Transport Layer: Guarantees end-to-end reliability and flow control.
5. Session Layer: Establishes, manages, and terminates sessions.
6. Presentation Layer: Handles data formatting, encryption, and compression.
7. Application Layer: Provides network services directly to end-user applications.

Advantages:
- Standardization across vendors
- Modular design for easier troubleshooting"""

# Initialize session state keys for text areas if not set
if "teacher_answer_text" not in st.session_state:
    st.session_state["teacher_answer_text"] = DEFAULT_TEACHER_ANSWER

if "student_answer_text" not in st.session_state:
    st.session_state["student_answer_text"] = ""

# -------------------------------------------------
# Student & Teacher Information
# -------------------------------------------------

st.header("👨‍🎓 Student & Teacher Information")

col1, col2 = st.columns(2)

with col1:
    student_name = st.text_input("Student Name", value="John Doe")
    register_no = st.text_input("Register Number", value="REG1001")
    department = st.text_input("Department", value="Computer Science")

with col2:
    semester = st.selectbox(
        "Semester",
        ["1", "2", "3", "4", "5", "6", "7", "8"],
        index=5
    )
    teacher_name = st.text_input("Teacher Name", value="Dr. Smith")
    subject = st.text_input("Subject", value="Computer Networks")

st.markdown("---")

# -------------------------------------------------
# Topic Selection
# -------------------------------------------------

topic = st.selectbox(
    "📚 Topic",
    ["OSI Model", "TCP/IP Protocol", "Database Normalization", "General Evaluation"]
)

# -------------------------------------------------
# Teacher Answer Section (File Upload & Text Area)
# -------------------------------------------------

st.subheader("📄 Teacher Answer Key")

teacher_file = st.file_uploader(
    "Upload Teacher Answer Key (PDF, DOCX, TXT, PNG, JPG, JPEG)",
    type=["pdf", "docx", "txt", "png", "jpg", "jpeg"],
    key="teacher_file_input"
)

if teacher_file is not None:
    teacher_file_id = f"{teacher_file.name}_{teacher_file.size}"
    if st.session_state.get("last_processed_teacher_file") != teacher_file_id:
        try:
            with st.spinner("📄 Reading teacher answer file..."):
                extracted_teacher = extract_text(teacher_file)
                if extracted_teacher and extracted_teacher.strip():
                    st.session_state["teacher_answer_text"] = extracted_teacher
                    st.session_state["last_processed_teacher_file"] = teacher_file_id
                    st.success("✅ Teacher answer key extracted successfully!")
                else:
                    st.warning("Uploaded teacher answer file produced no text.")
        except Exception as e:
            st.error(f"Error reading teacher answer file: {e}")

teacher_answer = st.text_area(
    "👨‍🏫 Teacher Answer Key",
    height=200,
    key="teacher_answer_text"
)

st.markdown("---")

# -------------------------------------------------
# Student Answer Section (File Upload & Text Area)
# -------------------------------------------------

st.subheader("🖼 Upload Student Answer Sheet / File")

student_file = st.file_uploader(
    "Upload Student Answer (Handwritten Photo, PDF, DOCX, TXT)",
    type=["pdf", "docx", "txt", "png", "jpg", "jpeg"],
    key="student_file_input"
)

if student_file is not None:
    student_file_id = f"{student_file.name}_{student_file.size}"
    if st.session_state.get("last_processed_student_file") != student_file_id:
        filename = student_file.name.lower()
        if filename.endswith((".png", ".jpg", ".jpeg")):
            os.makedirs("uploads", exist_ok=True)
            suffix = os.path.splitext(student_file.name)[1]
            temp_path = os.path.join("uploads", f"temp_student_{student_file.name}")
            with open(temp_path, "wb") as f:
                f.write(student_file.getbuffer())

            try:
                with st.spinner("🤖 Reading handwritten student answer using Ollama Vision (gemma3:4b)..."):
                    extracted_ocr_text = vision_agent.extract_text(temp_path)
                    st.session_state["student_answer_text"] = extracted_ocr_text
                    st.session_state["last_processed_student_file"] = student_file_id
                st.success("✅ Handwriting extracted successfully!")
            except Exception as e:
                st.error(f"Ollama Vision OCR Error: {e}")
            finally:
                if os.path.exists(temp_path):
                    try:
                        os.remove(temp_path)
                    except Exception:
                        pass
        else:
            try:
                with st.spinner("📄 Reading student answer document..."):
                    extracted_doc_text = extract_text(student_file)
                    st.session_state["student_answer_text"] = extracted_doc_text
                    st.session_state["last_processed_student_file"] = student_file_id
                st.success("✅ Student document extracted successfully!")
            except Exception as e:
                st.error(f"Error reading student answer document: {e}")

student_answer = st.text_area(
    "👨‍🎓 Student Answer (Extracted or Typed)",
    height=220,
    placeholder="Extracted text from uploaded image or document will appear here. You can also type or edit directly.",
    key="student_answer_text"
)

st.markdown("---")

# -------------------------------------------------
# Evaluate Button Workflow
# -------------------------------------------------

if st.button("🚀 Evaluate Answer", use_container_width=True, type="primary"):
    current_teacher = st.session_state.get("teacher_answer_text", "").strip()
    current_student = st.session_state.get("student_answer_text", "").strip()

    if not current_teacher or not current_student:
        st.error("⚠️ Please provide both Teacher Answer Key and Student Answer before evaluating.")
    else:
        student = Student(
            name=student_name.strip() or "Student",
            register_no=register_no.strip() or "REG000",
            department=department.strip() or "General",
            semester=str(semester),
            subject=subject.strip() or "General Subject"
        )

        teacher = Teacher(
            name=teacher_name.strip() or "Teacher",
            subject=subject.strip() or "General Subject",
            max_marks=10
        )

        with st.spinner("🧠 AI Agent evaluating student answer against model key..."):
            try:
                result = vision_agent.evaluate(
                    answer_key=current_teacher,
                    student_answer=current_student,
                    total_marks=10
                )
                pdf_path = generate_pdf(student, teacher, topic, result)

                st.session_state["eval_result"] = result
                st.session_state["pdf_path"] = pdf_path
                st.session_state["eval_student"] = student
                st.session_state["eval_teacher"] = teacher
                st.success("✅ Evaluation Completed Successfully!")
            except Exception as e:
                st.error(f"Evaluation Error: {e}")

# -------------------------------------------------
# Render Evaluation Dashboard
# -------------------------------------------------

if "eval_result" in st.session_state:
    result = st.session_state["eval_result"]
    pdf_path = st.session_state.get("pdf_path")
    eval_student = st.session_state.get("eval_student")
    eval_teacher = st.session_state.get("eval_teacher")

    st.markdown("## 📊 Evaluation Summary")

    c1, c2, c3, c4 = st.columns(4)

    with c1:
        st.metric("🏆 Grade", result.get("grade", "F"))

    with c2:
        st.metric("📝 Marks", f"{result.get('marks', 0)} / 10")

    with c3:
        st.metric("🎓 Bloom Level", result.get("bloom_level", "Understand"))

    with c4:
        st.metric("🤖 AI Confidence", f"{result.get('confidence', 0)}%")

    st.markdown("---")

    # Tabs
    tab1, tab2, tab3, tab4 = st.tabs([
        "📊 Marks & Percentage",
        "📚 Concepts",
        "🎓 Bloom Analysis",
        "💬 Detailed Feedback"
    ])

    with tab1:
        st.subheader("📊 Marks Breakdown")
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Total Score", f"{result.get('marks', 0)} / 10")
        with col2:
            st.metric("Percentage", f"{result.get('percentage', 0)}%")
        with col3:
            st.metric("Grade", result.get("grade", "F"))

        st.markdown("---")
        st.subheader("📝 Examiner Feedback Summary")
        st.info(result.get("feedback", "Evaluation complete."))

    with tab2:
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("✅ Concepts Found")
            found = result.get("found_concepts", [])
            if found:
                for concept in found:
                    st.success(f"✓ {concept}")
            else:
                st.info("No concepts identified.")

        with col2:
            st.subheader("❌ Missing Concepts")
            missing = result.get("missing_concepts", [])
            if missing:
                for concept in missing:
                    st.warning(f"• {concept}")
            else:
                st.success("No missing concepts 🎉")

    with tab3:
        st.subheader("🎓 Bloom's Taxonomy Level")
        st.metric("Detected Level", result.get("bloom_level", "Understand"))
        confidence_val = min(1.0, max(0.0, float(result.get("confidence", 0)) / 100.0))
        st.progress(confidence_val)
        st.write(f"**Confidence Score:** {result.get('confidence', 0)}%")
        st.info(f"Analysis: Demonstrated {result.get('bloom_level', 'Understand')} cognitive level in student response.")

    with tab4:
        with st.expander("✅ Strengths", expanded=True):
            strengths = result.get("strengths", [])
            if strengths:
                for item in strengths:
                    st.success(f"• {item}")
            else:
                st.info("No explicit strengths highlighted.")

        with st.expander("⚠️ Areas to Improve", expanded=True):
            improvements = result.get("improvements", [])
            if improvements:
                for item in improvements:
                    st.warning(f"• {item}")
            else:
                st.success("No areas to improve noted.")

        with st.expander("💡 Suggestions", expanded=True):
            suggestions = result.get("suggestions", [])
            if suggestions:
                for item in suggestions:
                    st.info(f"• {item}")
            else:
                st.info("No suggestions needed.")

    st.markdown("---")

    # Download Report Button
    if pdf_path and os.path.exists(pdf_path):
        with open(pdf_path, "rb") as f:
            st.download_button(
                label="📥 Download Evaluation Report (PDF)",
                data=f,
                file_name=os.path.basename(pdf_path),
                mime="application/pdf",
                use_container_width=True
            )

st.caption("AI Paper Evaluation System powered by Streamlit & Ollama gemma3:4b")