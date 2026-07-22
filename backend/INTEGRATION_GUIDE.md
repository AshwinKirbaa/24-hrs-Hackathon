# TwinEval AI Backend — Integration & Quickstart Guide

This backend is designed to adapt seamlessly to the existing static frontend.

## Quickstart Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database Environment
Create or edit `.env` inside `backend/`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=twineval_db
JWT_SECRET=twineval_ai_super_secret_jwt_key_2026_prod
JWT_EXPIRES_IN=7d
```

### 3. Import MySQL Database Schema
Run the schema initialization script:
```bash
mysql -u root -p < database/schema.sql
```
*Note: A default faculty user is automatically seeded:*
- **Email**: `faculty@college.edu`
- **Password**: `FacultyPass123!`

### 4. Run the Backend Server
```bash
npm start
```
The server starts on `http://localhost:5000` and automatically serves static frontend files from `../public`.
