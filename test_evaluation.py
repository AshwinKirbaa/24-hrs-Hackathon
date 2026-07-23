from agents.ollama_vision_agent import OllamaVisionAgent

agent = OllamaVisionAgent()

teacher_answer = """
A chatbot is a software program that simulates conversation with human users through text or voice.
"""

student_answer = """
A chatbot is a software program that simulates conversation with human users through text or voice.
"""

result = agent.evaluate(
    answer_key=teacher_answer,
    student_answer=student_answer,
    total_marks=10
)

print("Evaluation Test Output:")
print(result)