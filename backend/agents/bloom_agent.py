import json
import os

class BloomAgent:

    def __init__(self):
        dataset_path = os.path.join(os.path.dirname(__file__), "../dataset/bloom_levels.json")
        with open(dataset_path, "r") as file:
            self.levels = json.load(file)

    def analyze(self, student_answer):
        answer = student_answer.lower()
        scores = {}
        matched_keywords = {}

        for level, keywords in self.levels.items():
            matched = []
            for keyword in keywords:
                if keyword.lower() in answer:
                    matched.append(keyword)

            scores[level] = len(matched)
            matched_keywords[level] = matched

        best_level = max(scores, key=scores.get)
        best_score = scores[best_level]
        total_matches = sum(scores.values())

        confidence = 0 if total_matches == 0 else round((best_score / total_matches) * 100, 2)

        reasons = {
            "Remember": "The answer mainly recalls facts or lists information.",
            "Understand": "The answer explains concepts and demonstrates understanding.",
            "Apply": "The answer applies concepts to solve a problem.",
            "Analyze": "The answer compares or examines relationships.",
            "Evaluate": "The answer justifies or critiques ideas.",
            "Create": "The answer proposes or designs something new."
        }

        return {
            "level": best_level,
            "confidence": confidence,
            "scores": scores,
            "matched": matched_keywords[best_level],
            "reason": reasons.get(best_level, "Demonstrates cognitive understanding.")
        }
