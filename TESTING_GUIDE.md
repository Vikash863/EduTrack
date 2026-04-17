# EduTrack - API Testing Guide

## Quick Start

### 1. Start Backend
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:5000`

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## API Testing Steps (Postman/Hoppscotch)

### Step 1: Teacher Registration
**POST** `http://localhost:5000/api/auth/register`

**Body (JSON):**
```json
{
  "name": "Dr. John Doe",
  "email": "john@example.com",
  "password": "password123",
  "department": "CSE"
}
```

**Response:** You'll get a token - save it!

---

### Step 2: Add Students
**POST** `http://localhost:5000/api/students`

**Headers:**
```
Authorization: Bearer <your_token>
```

**Body (JSON):**
```json
{
  "rollNumber": "CSE001",
  "name": "Raj Kumar",
  "email": "raj@student.com",
  "semester": 1,
  "branch": "CSE",
  "phone": "9876543210",
  "address": "123 Main St"
}
```

Add multiple students with different roll numbers.

---

### Step 3: Add Subjects
**POST** `http://localhost:5000/api/subjects`

**Headers:**
```
Authorization: Bearer <your_token>
```

**Body (JSON):**
```json
{
  "subjectCode": "CS101",
  "subjectName": "Data Structures",
  "semester": 1,
  "branch": "CSE",
  "credits": 3,
  "teacher": "<your_teacher_id_from_registration>"
}
```

Add more subjects like:
- CS102 - Algorithms (Semester 1)
- CS103 - Database Systems (Semester 1)

---

### Step 4: Add Results
**POST** `http://localhost:5000/api/results`

**Headers:**
```
Authorization: Bearer <your_token>
```

**Body (JSON):**
```json
{
  "student": "<student_id>",
  "subject": "<subject_id>",
  "semester": 1,
  "sessionalMarks": 30,
  "putMarks": 15,
  "finalMarks": 38
}
```

---

### Step 5: Test Analytics APIs

#### Get Student Performance
**GET** `http://localhost:5000/api/analytics/student/<student_id>`

#### Get Subject Averages
**GET** `http://localhost:5000/api/analytics/subject-averages?semester=1&branch=CSE`

#### Get Semester Comparison
**GET** `http://localhost:5000/api/analytics/semester/<student_id>`

#### Get Top Performers
**GET** `http://localhost:5000/api/analytics/top-performers?limit=5`

---

### Step 6: Test Frontend

1. Go to `http://localhost:5173`
2. Click Register
3. Fill in the form with same details as registration API
4. Use the app to:
   - View Dashboard
   - Add/Edit/Delete Students
   - View Results

---

## Notes

- **Authentication Token**: Copy the token from registration response and use it in Authorization header as `Bearer <token>`
- **IDs**: When adding results, use actual MongoDB ObjectIds from created students and subjects
- **Marks Constraints**:
  - Sessional: 0-40
  - PUT: 0-20
  - Final: 0-40
  - Total: 0-100

## Grade Scale
- A+: 90-100
- A: 85-89
- B+: 80-84
- B: 75-79
- C+: 70-74
- C: 65-69
- D+: 60-64
- D: 55-59
- F: 0-54
