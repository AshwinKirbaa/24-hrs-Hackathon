<<<<<<< HEAD
# TwinEval AI - Student Evaluation & AI Analytics Platform Backend

![TwinEval AI Banner](https://img.shields.io/badge/TwinEval_AI-Production_Ready-blue?style=for-the-badge&logo=node.js)
![Tech Stack](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express.js-v4-lightgrey?style=for-the-badge&logo=express)
![MySQL](https://img.shields.io/badge/MySQL-v8.0+-orange?style=for-the-badge&logo=mysql)

**TwinEval AI** is an intelligent, scalable, production-ready AI student evaluation platform built for teachers and academic institutions. It calculates AI performance scores, generates personalized learning plans, provides analytics dashboards, tracks student progress, and offers student leaderboards and ranking insights.

---

## 🌟 Features

- 🔐 **JWT Authentication & Role-Based Access Control**: Secure teacher/admin access with bcrypt password hashing.
- 🎓 **Student Management**: Full CRUD, instant search, filtering by department/semester, sorting, and pagination.
- 🤖 **AI Evaluation Engine**: Dynamic multi-factor weighted scoring (Marks, Attendance, Communication, Problem Solving), performance grade computation, strengths/weaknesses identification, and actionable advice.
- 📘 **Personalized Learning Plans**: Tailored weak topic detection, recommended resources, practice tasks, and weekly study schedule generator.
- 📊 **Analytics & Leaderboard**: Comprehensive dashboard summary, top/lowest performers, department comparison, student rankings, and progress trends.
- 🛡️ **Production Security & Middleware**: Hardened with Helmet, CORS, Morgan request logging, express-validator input sanitization, and central SQL error masking.

---

## 🏗️ Architecture & Folder Structure

Built using the clean **Model-View-Controller (MVC)** architectural pattern:

```
backend/
├── config/
│   └── db.js                 # MySQL connection pool configuration (mysql2/promise)
├── controllers/
│   ├── aiController.js        # AI evaluation & learning plan endpoints
│   ├── analyticsController.js # Department & platform analytics
│   ├── authController.js      # User registration, login, profile
│   ├── dashboardController.js  # Dashboard overview metrics
│   ├── evaluationController.js# Evaluation CRUD & AI score integration
│   ├── learningPlanController.js# Learning plan CRUD
│   └── studentController.js   # Student CRUD, leaderboard, ranking, trend, report
├── models/
│   ├── analyticsModel.js      # Aggregation queries for dashboard & analytics
│   ├── evaluationModel.js     # DB operations for evaluations
│   ├── learningPlanModel.js   # DB operations for learning plans
│   ├── studentModel.js        # DB operations for students & rankings
│   └── userModel.js           # DB operations for users
├── routes/
│   ├── aiRoutes.js            # /ai endpoints
│   ├── analyticsRoutes.js     # /analytics endpoints
│   ├── authRoutes.js         # /auth endpoints
│   ├── dashboardRoutes.js     # /dashboard endpoint
│   ├── evaluationRoutes.js    # /evaluations endpoints
│   ├── learningPlanRoutes.js  # /plans endpoints
│   └── studentRoutes.js       # /students endpoints
├── middleware/
│   ├── authMiddleware.js      # JWT token verification & role authorization
│   ├── errorHandler.js        # Central 404 & SQL error handler
│   └── validation.js          # express-validator rules
├── services/
│   └── aiService.js           # AI evaluation algorithm & plan generator
├── utils/
│   └── responseHandler.js     # Standardized JSON response utilities
├── scripts/
│   └── seedRunner.js          # One-click database table creation and seeding script
├── uploads/                   # Media/file upload directory placeholder
├── docs/
│   ├── API_DOCUMENTATION.md   # Exhaustive API reference
│   ├── Postman_Collection.json# Complete Postman Collection
│   ├── schema.sql             # SQL DDL database schema
│   └── seed.sql               # 20+ sample students & seed data
├── .env.example               # Environment variables template
├── package.json
└── server.js                  # Express app entry point
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js (v18+ recommended)
- MySQL Server (v8.0+)

### 2. Installation
Clone or navigate to the repository directory and run:

```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (or copy `.env.example`):

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=twineval_ai
DB_PORT=3306
JWT_SECRET=twineval_super_secret_jwt_key_2026_hackathon
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Database Creation & Seeding
Initialize the MySQL database `twineval_ai`, create all 5 required tables, foreign keys, indexes, and seed **20+ sample students**, evaluations, learning plans, analytics, and user accounts with a single command:

```bash
npm run seed
```

> Alternatively, run `docs/schema.sql` followed by `docs/seed.sql` in MySQL Workbench or phpMyAdmin.

### 5. Running the Server

- **Development Mode (with Nodemon):**
  ```bash
  npm run dev
  ```

- **Production Mode:**
  ```bash
  npm start
  ```

The server will be live at `http://localhost:5000`.

---

## 🗝️ Default Auth Credentials (from Seed)

| Role | Email | Password |
|---|---|---|
| Teacher | `sarah.jenkins@twineval.edu` | `password123` |
| Admin | `alan.turing@twineval.edu` | `password123` |

---

## 🚀 Key API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| **POST** | `/auth/login` | Teacher/Admin Login | No |
| **GET** | `/dashboard` | Overall Dashboard Statistics | No |
| **GET** | `/students` | List students (Filter, Search, Paginate) | No |
| **GET** | `/students/:id/report` | Comprehensive Student Report | No |
| **GET** | `/students/analytics/leaderboard` | Top Performing Students Leaderboard | No |
| **GET** | `/students/:id/ranking` | Department & Platform Rank | No |
| **POST** | `/ai/evaluate` | Calculate AI Score & Feedback | No |
| **POST** | `/ai/learning-plan` | Generate AI Learning Plan | No |
| **POST** | `/students` | Create new student | Yes (Teacher/Admin) |
| **POST** | `/evaluations` | Create evaluation result | Yes (Teacher/Admin) |

For complete payload details, status codes, and JSON response examples, see [docs/API_DOCUMENTATION.md](file:///c:/Users/akhil/OneDrive/Desktop/backend/docs/API_DOCUMENTATION.md).

---

## 🧪 Postman Collection

Import `docs/Postman_Collection.json` directly into Postman to instantly test all authentication, student, evaluation, learning plan, analytics, and AI endpoints!
=======
# 24-hrs-Hackathon
>>>>>>> origin/alen
