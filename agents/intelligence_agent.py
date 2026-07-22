from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


class IntelligenceAgent:

    def __init__(self):
        print("Loading AI Model...")
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        print("Model Loaded Successfully!")

    def compare_answers(self, teacher_answer, student_answer):

        teacher_embedding = self.model.encode([teacher_answer])
        student_embedding = self.model.encode([student_answer])

        similarity = cosine_similarity(
            teacher_embedding,
            student_embedding
        )[0][0]

        return similarity