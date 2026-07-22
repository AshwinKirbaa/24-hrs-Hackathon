import json


class RubricAgent:

    def __init__(self):
        with open("dataset/concepts.json", "r") as file:
            self.data = json.load(file)

    def evaluate(self, topic, found, missing, student_answer):

        marks = {}

        # -----------------------------
        # Concept Marks (4)
        # -----------------------------
        total = len(found) + len(missing)

        if total > 0:
            marks["Concepts"] = round((len(found) / total) * 4, 2)
        else:
            marks["Concepts"] = 0

        # -----------------------------
        # Diagram Marks (2)
        # -----------------------------
        if "diagram" in student_answer.lower():
            marks["Diagram"] = 2
        else:
            marks["Diagram"] = 0

        # -----------------------------
        # Advantages Marks (2)
        # -----------------------------
        advantages = self.data[topic]["advantages"]

        count = 0

        for item in advantages:
            if item.lower() in student_answer.lower():
                count += 1

        marks["Advantages"] = round((count / len(advantages)) * 2, 2)

        # -----------------------------
        # Conclusion Marks (2)
        # -----------------------------
        conclusion_words = [
            "therefore",
            "thus",
            "finally",
            "in conclusion",
            "overall"
        ]

        if any(word in student_answer.lower() for word in conclusion_words):
            marks["Conclusion"] = 2
        else:
            marks["Conclusion"] = 0

        # -----------------------------
        # Total
        # -----------------------------
        marks["Total"] = round(sum([
            marks["Concepts"],
            marks["Diagram"],
            marks["Advantages"],
            marks["Conclusion"]
        ]), 2)

        # -----------------------------
        # Percentage
        # -----------------------------
        marks["Percentage"] = round((marks["Total"] / 10) * 100, 2)

        # -----------------------------
        # Grade
        # -----------------------------
        total_marks = marks["Total"]

        if total_marks >= 9:
            marks["Grade"] = "A+"
        elif total_marks >= 8:
            marks["Grade"] = "A"
        elif total_marks >= 7:
            marks["Grade"] = "B"
        elif total_marks >= 6:
            marks["Grade"] = "C"
        elif total_marks >= 5:
            marks["Grade"] = "D"
        else:
            marks["Grade"] = "F"

        # -----------------------------
        # Overall Remark
        # -----------------------------
        if total_marks >= 9:
            marks["Remark"] = "Excellent Answer."
        elif total_marks >= 8:
            marks["Remark"] = "Very Good Answer."
        elif total_marks >= 7:
            marks["Remark"] = "Good Answer."
        elif total_marks >= 6:
            marks["Remark"] = "Average Answer."
        elif total_marks >= 5:
            marks["Remark"] = "Needs Improvement."
        else:
            marks["Remark"] = "Poor Answer."

        return marks