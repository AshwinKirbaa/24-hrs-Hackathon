from models.student import Student
from models.teacher import Teacher

student = Student(
    name="Ashwin",
    register_no="23CS001",
    department="CSE",
    semester="3",
    subject="Computer Networks"
)

teacher = Teacher(
    name="Dr. Kumar",
    subject="Computer Networks",
    max_marks=10
)

print("===== STUDENT DETAILS =====")
print(student)
print(student.to_dict())

print("\n===== TEACHER DETAILS =====")
print(teacher)
print(teacher.to_dict())