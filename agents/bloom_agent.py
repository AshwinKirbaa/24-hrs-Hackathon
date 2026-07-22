import json


class BloomAgent:

    def __init__(self):
        with open("dataset/bloom_levels.json", "r") as file:
            self.levels = json.load(file)

    def analyze(self, student_answer):

        answer = student_answer.lower()

        scores = {}
        matched_keywords = {}

        # Count keyword matches for each Bloom level
        for level, keywords in self.levels.items():

            matched = []

            for keyword in keywords:
                if keyword.lower() in answer:
                    matched.append(keyword)

            scores[level] = len(matched)
            matched_keywords[level] = matched

        # Find the best Bloom level
        best_level = max(scores, key=scores.get)
        best_score = scores[best_level]

        total_matches = sum(scores.values())

        if total_matches == 0:
            confidence = 0
        else:
            confidence = round((best_score / total_matches) * 100, 2)

        # Generate explanation
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
            "reason": reasons[best_level]
        }