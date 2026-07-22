import fitz
from docx import Document


def read_pdf(file):
    text = ""

    pdf = fitz.open(stream=file.read(), filetype="pdf")

    for page in pdf:
        text += page.get_text()

    return text


def read_docx(file):
    doc = Document(file)

    text = ""

    for para in doc.paragraphs:
        text += para.text + "\n"

    return text


def read_txt(file):
    return file.read().decode("utf-8")


def extract_text(file):

    filename = file.name.lower()

    if filename.endswith(".pdf"):
        return read_pdf(file)

    elif filename.endswith(".docx"):
        return read_docx(file)

    elif filename.endswith(".txt"):
        return read_txt(file)

    return ""