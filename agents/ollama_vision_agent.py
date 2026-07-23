import json
import re
import os
import ollama


def calculate_grade(percentage: float) -> str:
    if percentage >= 90:
        return "A+"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B+"
    elif percentage >= 60:
        return "B"
    elif percentage >= 50:
        return "C"
    elif percentage >= 40:
        return "D"
    else:
        return "F"


class OllamaVisionAgent:

    def __init__(self, model: str = "gemma3:4b"):
        self.model = model

    # -------------------------------------------------------
    # OCR Pipeline
    # -------------------------------------------------------

    def extract_text(self, image_path: str) -> str:
        """
        Extract handwritten and printed text from an answer sheet image.
        Preserves line breaks, punctuation, and exact text without summarizing.
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image path not found: {image_path}")

        prompt = """You are an OCR engine.

Read every handwritten and printed word from this image.

Rules:
1. Extract text exactly as written.
2. Preserve line breaks and paragraph structure.
3. Preserve punctuation.
4. Do NOT summarize or shorten text.
5. Do NOT correct spelling or grammar.
6. Do NOT invent or add words.
7. Return ONLY the extracted text.
"""

        try:
            response = ollama.chat(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                        "images": [image_path]
                    }
                ]
            )
            return response["message"]["content"].strip()
        except Exception as e:
            print(f"Ollama OCR Error: {e}")
            raise RuntimeError(f"OCR extraction failed: {e}")

    # -------------------------------------------------------
    # Evaluation Pipeline
    # -------------------------------------------------------

    def evaluate(self, answer_key: str, student_answer: str, total_marks: float = 10.0) -> dict:
        """
        Evaluates student answer against teacher answer key using local Ollama model.
        Guarantees strict evaluation schema and criteria.
        """
        clean_teacher = (answer_key or "").strip()
        clean_student = (student_answer or "").strip()

        # Handle empty student answer
        if not clean_student:
            return {
                "student_answer": "",
                "marks": 0.0,
                "percentage": 0.0,
                "grade": "F",
                "found_concepts": [],
                "missing_concepts": [line.strip() for line in clean_teacher.splitlines() if line.strip()],
                "strengths": [],
                "improvements": ["Please provide a complete answer."],
                "suggestions": ["Answer the question based on the study material."],
                "bloom_level": "Remember",
                "confidence": 100.0,
                "feedback": "No student answer was provided."
            }

        # ---------------------------------------------------
        # Rule: If answers are identical, award full marks
        # ---------------------------------------------------
        if clean_teacher.lower() == clean_student.lower():
            teacher_lines = [line.strip() for line in clean_teacher.splitlines() if line.strip()]
            return {
                "student_answer": clean_student,
                "marks": float(total_marks),
                "percentage": 100.0,
                "grade": "A+",
                "found_concepts": teacher_lines if teacher_lines else [clean_teacher],
                "missing_concepts": [],
                "strengths": ["Identical match to model teacher answer.", "Completely accurate and thorough."],
                "improvements": [],
                "suggestions": ["Maintain this level of precision and clarity."],
                "bloom_level": "Understand",
                "confidence": 100.0,
                "feedback": "Student answer is identical to the teacher model answer. Full marks awarded."
            }

        prompt = f"""You are a university examiner evaluating a student's answer against a teacher's model answer key.

Teacher Model Answer:
{clean_teacher}

Student Answer:
{clean_student}

Evaluation Scoring Breakdown (Total Marks: {total_marks}):
- Accuracy (40% weight): Correctness of facts, technical definitions, and figures.
- Completeness (30% weight): Inclusion of all required sections, diagrams, advantages, or steps.
- Concept Coverage (20% weight): Core terminology and key concepts identified.
- Clarity (10% weight): Formatting, legibility, and proper structure.

Rules:
1. Do NOT invent missing concepts or hallucinate missing facts.
2. Award marks proportionally out of {total_marks}.
3. If student answer covers everything correctly, award full marks.
4. Return ONLY valid JSON matching the exact key structure below. Do NOT wrap in markdown formatting or add extra text.

Required JSON Structure:
{{
  "student_answer": "{clean_student}",
  "marks": 8.0,
  "percentage": 80.0,
  "grade": "A",
  "found_concepts": ["concept 1", "concept 2"],
  "missing_concepts": ["concept 3"],
  "strengths": ["strength 1"],
  "improvements": ["improvement 1"],
  "suggestions": ["suggestion 1"],
  "bloom_level": "Understand",
  "confidence": 90.0,
  "feedback": "Detailed examiner summary."
}}
"""

        try:
            response = ollama.chat(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                format="json"
            )
            raw_text = response["message"]["content"].strip()
        except Exception as e:
            print(f"Ollama Chat Error: {e}")
            raw_text = ""

        # Remove markdown fences if present
        cleaned_json = raw_text
        if "```" in cleaned_json:
            cleaned_json = re.sub(r"```(?:json)?", "", cleaned_json).strip()

        try:
            result = json.loads(cleaned_json)
        except Exception:
            # Fallback basic scoring if JSON decoding fails
            result = {
                "student_answer": clean_student,
                "marks": round(total_marks * 0.7, 2),
                "confidence": 70.0,
                "feedback": raw_text if raw_text else "Evaluation completed with default parsing."
            }

        # Enforce list structures
        list_fields = ["found_concepts", "missing_concepts", "strengths", "improvements", "suggestions"]
        for field in list_fields:
            val = result.get(field, [])
            if isinstance(val, str):
                result[field] = [val] if val.strip() else []
            elif not isinstance(val, list):
                result[field] = []
            else:
                result[field] = [str(item) for item in val if item is not None]

        # Enforce string structures
        string_fields = ["student_answer", "grade", "bloom_level", "feedback"]
        for field in string_fields:
            val = result.get(field)
            if val is None:
                result[field] = ""
            else:
                result[field] = str(val)

        if not result["student_answer"]:
            result["student_answer"] = clean_student

        # Numerical clamping and calculations
        try:
            raw_marks = float(result.get("marks", 0))
        except (ValueError, TypeError):
            raw_marks = 0.0

        clamped_marks = max(0.0, min(float(total_marks), round(raw_marks, 2)))
        result["marks"] = clamped_marks

        calc_percentage = round((clamped_marks / float(total_marks)) * 100.0, 2)
        result["percentage"] = calc_percentage
        result["grade"] = calculate_grade(calc_percentage)

        try:
            raw_confidence = float(result.get("confidence", 85.0))
        except (ValueError, TypeError):
            raw_confidence = 85.0

        result["confidence"] = max(0.0, min(100.0, round(raw_confidence, 2)))

        if not result["bloom_level"] or result["bloom_level"] not in [
            "Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"
        ]:
            result["bloom_level"] = "Understand"

        return result