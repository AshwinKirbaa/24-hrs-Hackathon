class FeedbackAgent:

    def generate_feedback(self, rubric_result, bloom_result):

        strengths = []
        improvements = []
        suggestions = []

        # -------------------------
        # Strengths
        # -------------------------
        if rubric_result["Concepts"] == 4:
            strengths.append("Covered all important concepts correctly.")

        if rubric_result["Diagram"] == 2:
            strengths.append("Included the required diagram.")

        if rubric_result["Advantages"] == 2:
            strengths.append("Mentioned the advantages clearly.")

        if rubric_result["Conclusion"] == 2:
            strengths.append("Provided a proper conclusion.")

        # -------------------------
        # Improvements
        # -------------------------
        if rubric_result["Concepts"] < 4:
            improvements.append("Add the missing concepts.")

        if rubric_result["Diagram"] < 2:
            improvements.append("Include a neat labelled diagram.")

        if rubric_result["Advantages"] < 2:
            improvements.append("Mention more advantages.")

        if rubric_result["Conclusion"] < 2:
            improvements.append("Write a proper conclusion.")

        # -------------------------
        # Suggestions
        # -------------------------
        bloom = bloom_result["level"]

        if bloom == "Remember":
            suggestions.append(
                "Explain the concepts instead of only listing facts."
            )

        elif bloom == "Understand":
            suggestions.append(
                "Include practical examples or real-world applications."
            )

        elif bloom == "Apply":
            suggestions.append(
                "Show how the concepts are applied in real situations."
            )

        elif bloom == "Analyze":
            suggestions.append(
                "Provide comparisons and deeper analysis."
            )

        elif bloom == "Evaluate":
            suggestions.append(
                "Support your judgments with proper justification."
            )

        elif bloom == "Create":
            suggestions.append(
                "Excellent higher-order thinking demonstrated."
            )

        return {
            "strengths": strengths,
            "improvements": improvements,
            "suggestions": suggestions
        }