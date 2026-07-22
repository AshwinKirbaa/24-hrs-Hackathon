import json
import re

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


class ConceptAgent:

    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        with open("dataset/concepts.json", "r") as file:
            self.data = json.load(file)

    def check_concepts(self, topic, student_answer):

        if topic not in self.data:
            raise ValueError(
                f"Topic '{topic}' not found in dataset/concepts.json"
            )

        expected = self.data[topic]["concepts"]

        found = []
        missing = []

        answer = student_answer.lower()

        # Split answer into sentences
        sentences = [
            s.strip()
            for s in re.split(r"[.!?]\s*", student_answer)
            if s.strip()
        ]

        sentence_embeddings = self.model.encode(sentences)

        for concept in expected:

            # Exact keyword match
            if concept.lower() in answer:
                found.append(concept)
                print(f"{concept} -> Exact Match")
                continue

            concept_embedding = self.model.encode([concept])

            best_similarity = 0

            for sentence_embedding in sentence_embeddings:

                similarity = cosine_similarity(
                    concept_embedding,
                    [sentence_embedding]
                )[0][0]

                best_similarity = max(best_similarity, similarity)

            print(f"{concept} -> {best_similarity:.2f}")

            if best_similarity >= 0.60:
                found.append(concept)
            else:
                missing.append(concept)

        return found, missing