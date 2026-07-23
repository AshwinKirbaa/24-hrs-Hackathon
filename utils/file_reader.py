import os
import tempfile

import fitz
from docx import Document


def read_pdf(file):
    text = ""
    try:
        file.seek(0)
    except Exception:
        pass
    pdf = fitz.open(stream=file.read(), filetype="pdf")
    for page in pdf:
        text += page.get_text()
    return text


def read_docx(file):
    try:
        file.seek(0)
    except Exception:
        pass
    doc = Document(file)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text


def read_txt(file):
    try:
        file.seek(0)
    except Exception:
        pass
    content = file.read()
    if isinstance(content, bytes):
        return content.decode("utf-8", errors="ignore")
    return str(content)


def read_image(file):
    """
    Save uploaded image temporarily and extract text using available OCR (Ollama / Gemini).
    """
    try:
        file.seek(0)
    except Exception:
        pass

    suffix = os.path.splitext(file.name)[1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
        temp.write(file.getbuffer() if hasattr(file, "getbuffer") else file.read())
        temp_path = temp.name

    try:
        if os.getenv("GEMINI_API_KEY"):
            from utils.gemini_ocr import extract_handwritten_text
            text = extract_handwritten_text(temp_path)
        else:
            from agents.ollama_vision_agent import OllamaVisionAgent
            agent = OllamaVisionAgent()
            text = agent.extract_text(temp_path)
    except Exception as e:
        print(f"Error reading image: {e}")
        from agents.ollama_vision_agent import OllamaVisionAgent
        agent = OllamaVisionAgent()
        text = agent.extract_text(temp_path)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return text


def extract_text(file):
    filename = file.name.lower()

    if filename.endswith(".pdf"):
        return read_pdf(file)
    elif filename.endswith(".docx"):
        return read_docx(file)
    elif filename.endswith(".txt"):
        return read_txt(file)
    elif filename.endswith((".jpg", ".jpeg", ".png")):
        return read_image(file)

    return ""