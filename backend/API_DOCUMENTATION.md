# TwinEval AI Backend — API Documentation

All API responses follow the standard JSON envelope:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description.",
  "errors": ["Specific error detail"]
}
```

---

## 1. Authentication Endpoints

### Student Registration
- **Endpoint**: `POST /api/auth/student/signup`
- **Body**: `{ "full_name": "Jane Doe", "email": "student@college.edu", "password": "Password123!", "college": "Tech University", "department": "CS", "year": "3rd Year", "roll_number": "21CS042" }`
- **Response**: Returns JWT token and user profile object.

### Student Login
- **Endpoint**: `POST /api/auth/student/login`
- **Body**: `{ "email": "student@college.edu", "password": "Password123!" }`

### Faculty Login
- **Endpoint**: `POST /api/auth/teacher/login`
- **Body**: `{ "email": "faculty@college.edu", "password": "FacultyPass123!" }`

---

## 2. Student Workspace Endpoints

### Student Dashboard Summary
- **Endpoint**: `GET /api/student/dashboard`
- **Headers**: `Authorization: Bearer <token>`

### Answer Sheet Submission (Upload)
- **Endpoint**: `POST /api/student/submissions`
- **Content-Type**: `multipart/form-data`
- **Form Fields**: `file` (PDF/JPG/PNG <= 25MB), `subject`, `exam_title`, `notes`, `run_blooms`.

### Submission Processing Status
- **Endpoint**: `GET /api/student/submissions/:id/status`

### Detailed Evaluation Result
- **Endpoint**: `GET /api/student/evaluations/:submissionId`

### Concept Feedback & Recommendations
- **Endpoint**: `GET /api/student/feedback/:evaluationId`

### Student Performance Analytics
- **Endpoint**: `GET /api/student/analytics`

---

## 3. Faculty Workspace Endpoints

### Faculty Dashboard Overview
- **Endpoint**: `GET /api/teacher/dashboard`

### Create Assignment & Rubric Criteria
- **Endpoint**: `POST /api/teacher/assignments`
- **Content-Type**: `multipart/form-data`
- **Form Fields**: `title`, `subject`, `course_code`, `due_date`, `model_answer_text`, `model_answer_file` (optional PDF/TXT), `bloom_targets` (JSON array), `criteria` (JSON array).

### Moderation Review Queue
- **Endpoint**: `GET /api/teacher/review-queue?search=&assignment_id=&status=`

### Score Override & Moderation
- **Endpoint**: `PUT /api/teacher/review-queue/:submissionId/moderate`
- **Body**: `{ "original_score": 85, "overridden_score": 90, "action": "approved", "reason": "Accurate complexity proof." }`

### Class Analytics
- **Endpoint**: `GET /api/teacher/analytics`

---

## 4. Profile & Settings

### Get / Update Profile
- **Endpoints**: `GET /api/profile`, `PUT /api/profile`
- **Avatar Upload**: `POST /api/profile/avatar` (field `avatar`)

### User Settings
- **Endpoints**: `GET /api/settings`, `PUT /api/settings`, `DELETE /api/settings/account`
