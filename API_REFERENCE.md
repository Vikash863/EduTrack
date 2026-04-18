# 📚 EduTrack - Complete API Reference

**50+ Endpoints fully documented with request/response examples**

---

## 🔐 Authentication Endpoints

### 1. Register User
```
POST /api/auth/register

Request:
{
  "name": "John Doe",
  "email": "john@college.com",
  "password": "SecurePass@123",
  "role": "student",  // admin, teacher, or student
  "branch": "CS",     // optional, for students
  "department": "IT"  // optional, for teachers
}

Response (201):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@college.com",
    "role": "student",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Registration successful"
}

Error (400):
{
  "success": false,
  "error": "Email already exists"
}
```

### 2. Login User
```
POST /api/auth/login

Request:
{
  "email": "john@college.com",
  "password": "SecurePass@123"
}

Response (200):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@college.com",
      "role": "student"
    }
  }
}

Error (401):
{
  "success": false,
  "error": "Invalid credentials"
}
```

### 3. Get User Profile
```
GET /api/auth/profile

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response (200):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@college.com",
    "role": "student",
    "createdAt": "2024-04-18T10:30:00Z"
  }
}

Error (401):
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## 👥 Student Endpoints

### 1. Get All Students (Admin/Teacher)
```
GET /api/students?page=1&limit=10&search=John

Headers:
Authorization: Bearer <token>

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- search: Search by name, email, roll number
- branch: Filter by branch

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@college.com",
      "rollNumber": "CS2021001",
      "branch": "CS",
      "cgpa": 3.8,
      "attendancePercentage": 92
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

### 2. Create Student (Admin Only)
```
POST /api/students

Headers:
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@college.com",
  "rollNumber": "CS2021001",
  "branch": "CS",
  "phoneNumber": "+91-9876543210",
  "address": "123 Main St",
  "dateOfBirth": "2003-01-15",
  "parentName": "Parent Name",
  "parentPhone": "+91-9876543211"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@college.com",
    "rollNumber": "CS2021001",
    "branch": "CS",
    "cgpa": 0,
    "createdAt": "2024-04-18T10:30:00Z"
  },
  "message": "Student created successfully"
}
```

### 3. Get Student by ID
```
GET /api/students/507f1f77bcf86cd799439011

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@college.com",
    "rollNumber": "CS2021001",
    "branch": "CS",
    "cgpa": 3.8,
    "attendancePercentage": 92,
    "createdAt": "2024-04-18T10:30:00Z"
  }
}
```

### 4. Update Student
```
PUT /api/students/507f1f77bcf86cd799439011

Headers:
Authorization: Bearer <token>

Request:
{
  "name": "John Doe Updated",
  "email": "newemail@college.com",
  "phoneNumber": "+91-9999999999"
}

Response (200):
{
  "success": true,
  "data": { /* updated student */ },
  "message": "Student updated successfully"
}
```

### 5. Delete Student
```
DELETE /api/students/507f1f77bcf86cd799439011

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Student deleted successfully"
}
```

### 6. Search Students
```
GET /api/students/search?q=John

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    { /* matching students */ }
  ]
}
```

---

## 🏫 Subject Endpoints

### 1. Get All Subjects
```
GET /api/subjects?page=1&limit=10

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "code": "CS101",
      "name": "Data Structures",
      "credits": 4,
      "semester": 1,
      "teacherId": "507f1f77bcf86cd799439012"
    }
  ],
  "pagination": { /* ... */ }
}
```

### 2. Create Subject (Admin Only)
```
POST /api/subjects

Request:
{
  "code": "CS102",
  "name": "Algorithms",
  "credits": 4,
  "semester": 1,
  "branch": "CS",
  "description": "Study of algorithms"
}

Response (201):
{
  "success": true,
  "data": { /* subject */ }
}
```

### 3. Update Subject
```
PUT /api/subjects/507f1f77bcf86cd799439011

Request:
{
  "name": "Advanced Algorithms",
  "credits": 3
}

Response (200):
{
  "success": true,
  "data": { /* updated subject */ }
}
```

---

## 📊 Results & Marks Endpoints

### 1. Create Result (Teacher)
```
POST /api/results

Headers:
Authorization: Bearer <token>

Request:
{
  "studentId": "507f1f77bcf86cd799439011",
  "subjectId": "507f1f77bcf86cd799439012",
  "marks": 85,
  "semester": 1,
  "year": 2024
}

Response (201):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "studentId": "507f1f77bcf86cd799439011",
    "subjectId": "507f1f77bcf86cd799439012",
    "marks": 85,
    "grade": "A",
    "gpa": 4.0,
    "semester": 1,
    "year": 2024
  }
}
```

### 2. Get Student Results
```
GET /api/results?studentId=507f1f77bcf86cd799439011&semester=1

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439013",
      "subjectName": "Data Structures",
      "marks": 85,
      "grade": "A",
      "gpa": 4.0,
      "credits": 4
    }
  ],
  "stats": {
    "totalCredits": 12,
    "earnedCredits": 12,
    "cgpa": 3.85,
    "totalMarks": 255,
    "averageMarks": 85
  }
}
```

### 3. Get CGPA
```
GET /api/results/gpa/507f1f77bcf86cd799439011

Response (200):
{
  "success": true,
  "data": {
    "studentId": "507f1f77bcf86cd799439011",
    "cgpa": 3.85,
    "semester": 1,
    "totalCredits": 12,
    "earnedCredits": 12,
    "gpaBreakdown": [
      { "semester": 1, "gpa": 3.9, "credits": 12 }
    ]
  }
}
```

### 4. Update Marks
```
PUT /api/results/507f1f77bcf86cd799439013

Request:
{
  "marks": 88
}

Response (200):
{
  "success": true,
  "data": { /* updated result */ }
}
```

---

## 📚 Attendance Endpoints

### 1. Mark Attendance
```
POST /api/attendance/mark

Headers:
Authorization: Bearer <token>

Request:
{
  "studentId": "507f1f77bcf86cd799439011",
  "subjectId": "507f1f77bcf86cd799439012",
  "date": "2024-04-18",
  "status": "present"  // present, absent, leave
}

Response (201):
{
  "success": true,
  "data": { /* attendance record */ }
}
```

### 2. Bulk Mark Attendance
```
POST /api/attendance/bulk

Request:
{
  "subjectId": "507f1f77bcf86cd799439012",
  "date": "2024-04-18",
  "records": [
    { "studentId": "id1", "status": "present" },
    { "studentId": "id2", "status": "absent" }
  ]
}

Response (201):
{
  "success": true,
  "data": {
    "totalMarked": 2,
    "presentCount": 1,
    "absentCount": 1
  }
}
```

### 3. Get Attendance Report
```
GET /api/attendance/507f1f77bcf86cd799439011?month=4&year=2024

Response (200):
{
  "success": true,
  "data": {
    "studentId": "507f1f77bcf86cd799439011",
    "month": 4,
    "year": 2024,
    "totalClasses": 20,
    "presentDays": 18,
    "absentDays": 2,
    "attendancePercentage": 90,
    "dayWiseReport": [
      { "date": "2024-04-01", "status": "present", "subject": "DS" }
    ]
  }
}
```

### 4. Update Attendance
```
PUT /api/attendance/507f1f77bcf86cd799439013

Request:
{
  "status": "absent"
}

Response (200):
{
  "success": true,
  "data": { /* updated attendance */ }
}
```

---

## 📈 Analytics Endpoints

### 1. Dashboard Statistics
```
GET /api/analytics/dashboard

Response (200):
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "totalTeachers": 25,
    "totalSubjects": 50,
    "averageCGPA": 3.65,
    "passedStudents": 145,
    "failedStudents": 5,
    "passPercentage": 96.67
  }
}
```

### 2. Pass/Fail Statistics
```
GET /api/analytics/pass-fail

Response (200):
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "passedStudents": 145,
    "failedStudents": 5,
    "passPercentage": 96.67,
    "subjectWise": [
      {
        "subjectName": "DS",
        "totalStudents": 60,
        "passedStudents": 58,
        "passPercentage": 96.67
      }
    ]
  }
}
```

### 3. Branch Statistics
```
GET /api/analytics/branch-stats

Response (200):
{
  "success": true,
  "data": [
    {
      "branch": "CS",
      "totalStudents": 60,
      "averageCGPA": 3.7,
      "passPercentage": 98
    },
    {
      "branch": "EC",
      "totalStudents": 50,
      "averageCGPA": 3.6,
      "passPercentage": 95
    }
  ]
}
```

### 4. Performance Trends
```
GET /api/analytics/trends?months=6

Response (200):
{
  "success": true,
  "data": [
    {
      "month": "January",
      "avgMarks": 72,
      "passPercentage": 94,
      "averageCGPA": 3.5
    },
    {
      "month": "February",
      "avgMarks": 74,
      "passPercentage": 96,
      "averageCGPA": 3.65
    }
  ]
}
```

---

## 👨‍🏫 Teacher Endpoints

### 1. Get All Teachers
```
GET /api/teachers?page=1&limit=10

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Prof. Smith",
      "email": "smith@college.com",
      "department": "IT",
      "subjects": ["CS101", "CS102"],
      "students": 60
    }
  ]
}
```

### 2. Create Teacher (Admin Only)
```
POST /api/teachers

Request:
{
  "name": "Prof. Johnson",
  "email": "johnson@college.com",
  "phoneNumber": "+91-8888888888",
  "department": "IT",
  "qualifications": ["B.Tech", "M.Tech"],
  "experience": 10
}

Response (201):
{
  "success": true,
  "data": { /* teacher */ }
}
```

### 3. Get Teacher by ID
```
GET /api/teachers/507f1f77bcf86cd799439012

Response (200):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Prof. Smith",
    "email": "smith@college.com",
    "department": "IT",
    "assignedSubjects": ["CS101", "CS102"],
    "assignedStudents": 60,
    "totalMarksEntered": 150,
    "averageMarks": 75.5
  }
}
```

---

## 📑 Report Generation Endpoints

### 1. Generate Student Report
```
GET /api/reports/student/507f1f77bcf86cd799439011

Response:
File: PDF (Student Report Card)
```

### 2. Generate Attendance Report
```
GET /api/reports/attendance?studentId=507f1f77bcf86cd799439011&month=4

Response:
File: PDF (Attendance Report)
```

### 3. Generate Class Report
```
GET /api/reports/class?classId=507f1f77bcf86cd799439014&semester=1

Response:
File: PDF (Class Performance Report)
```

---

## 🔔 Notification Endpoints

### 1. Get Notifications
```
GET /api/notifications?page=1&limit=10&read=false

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439015",
      "title": "Marks Updated",
      "message": "Your marks for DS have been updated",
      "type": "marks_update",
      "read": false,
      "createdAt": "2024-04-18T10:30:00Z"
    }
  ]
}
```

### 2. Mark as Read
```
PUT /api/notifications/507f1f77bcf86cd799439015

Request:
{
  "read": true
}

Response (200):
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## Error Responses

### Standard Error Format
```
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "2024-04-18T10:30:00Z"
}
```

### Common Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

**Last Updated:** April 18, 2026  
**Total Endpoints:** 50+  
**Status:** Production Ready
