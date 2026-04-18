# EduTrack API Documentation - v2.0

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except login/register) require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Attendance Endpoints

### Add Single Attendance Record
```
POST /attendance/add
Content-Type: application/json
Authorization: Bearer <token>

{
  "student": "student_id",
  "subject": "subject_id",
  "date": "2024-04-18",
  "status": "present",  // 'present', 'absent', 'leave'
  "remarks": "optional remarks"
}

Response:
{
  "success": true,
  "message": "Attendance recorded successfully",
  "attendance": { ... }
}
```

### Add Multiple Attendance Records (Bulk)
```
POST /attendance/bulk-add
Content-Type: application/json
Authorization: Bearer <token>

{
  "records": [
    {
      "student": "student_id_1",
      "subject": "subject_id",
      "date": "2024-04-18",
      "status": "present",
      "remarks": ""
    },
    {
      "student": "student_id_2",
      "subject": "subject_id",
      "date": "2024-04-18",
      "status": "absent",
      "remarks": "Medical leave"
    }
  ]
}

Response:
{
  "success": true,
  "message": "2 attendance records added successfully",
  "count": 2
}
```

### Get Student Attendance
```
GET /attendance/student/:studentId
Query Parameters:
  - subjectId: optional filter by subject
  - semester: optional filter by semester

Response:
{
  "success": true,
  "totalClasses": 30,
  "presentCount": 28,
  "absentCount": 2,
  "attendancePercentage": "93.33",
  "records": [ ... ]
}
```

### Get Subject Attendance
```
GET /attendance/subject/:subjectId
Query Parameters:
  - semester: optional filter by semester

Response:
{
  "success": true,
  "totalRecords": 150,
  "studentAttendance": [
    {
      "student": { ... },
      "totalClasses": 30,
      "present": 28,
      "absent": 2,
      "leave": 0,
      "attendancePercentage": "93.33"
    }
  ]
}
```

### Update Attendance Record
```
PUT /attendance/update/:attendanceId
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "absent",
  "remarks": "Updated remarks"
}

Response:
{
  "success": true,
  "message": "Attendance updated successfully",
  "attendance": { ... }
}
```

### Get Attendance Statistics
```
GET /attendance/stats
Query Parameters:
  - semester: optional filter
  - branch: optional filter

Response:
{
  "success": true,
  "stats": {
    "totalClasses": 500,
    "presentCount": 450,
    "absentCount": 50,
    "leaveCount": 0,
    "overallAttendancePercentage": "90.00"
  }
}
```

---

## 2. Analytics Endpoints

### Get Student Performance
```
GET /analytics/student/:studentId

Response:
{
  "success": true,
  "student": { ... },
  "totalSubjects": 8,
  "avgMarks": "75.50",
  "gradeDistribution": {
    "A+": 2,
    "A": 3,
    "B+": 2,
    "B": 1
  },
  "results": [ ... ]
}
```

### Get Subject Averages
```
GET /analytics/subject-averages
Query Parameters:
  - semester: optional
  - branch: optional

Response:
{
  "success": true,
  "count": 12,
  "subjectAverages": [
    {
      "subject": "CSE101",
      "subjectName": "Data Structures",
      "avgMarks": "72.50",
      "passPercentage": "85.50",
      "totalStudents": 50
    }
  ]
}
```

### Get Semester Comparison
```
GET /analytics/semester/:studentId

Response:
{
  "success": true,
  "comparison": [
    {
      "semester": 1,
      "avgMarks": "78.00",
      "totalSubjects": 6
    },
    {
      "semester": 2,
      "avgMarks": "75.50",
      "totalSubjects": 6
    }
  ]
}
```

### Get Performance Trends
```
GET /analytics/semester-trends/:studentId

Response:
{
  "success": true,
  "trends": [
    {
      "semester": 1,
      "avgMarks": 78,
      "gpa": 3.5,
      "subjectsCount": 6
    },
    {
      "semester": 2,
      "avgMarks": 75.5,
      "gpa": 3.2,
      "subjectsCount": 6
    }
  ]
}
```

### Get Top Performers
```
GET /analytics/top-performers
Query Parameters:
  - semester: optional
  - limit: default 10

Response:
{
  "success": true,
  "count": 10,
  "topPerformers": [
    {
      "student": { ... },
      "avgGpa": "3.8",
      "subjectsCount": 8,
      "avgMarks": "85.50"
    }
  ]
}
```

### Get Pass/Fail Statistics
```
GET /analytics/pass-fail
Query Parameters:
  - semester: optional
  - branch: optional
  - subject: optional

Response:
{
  "success": true,
  "stats": {
    "totalStudents": 150,
    "passCount": 127,
    "failCount": 23,
    "passPercentage": "84.67",
    "failPercentage": "15.33"
  }
}
```

### Get Dashboard Analytics
```
GET /analytics/dashboard
Query Parameters:
  - semester: optional

Response:
{
  "success": true,
  "dashboard": {
    "totalStudents": 500,
    "totalResults": 4000,
    "passCount": 3400,
    "failCount": 600,
    "passPercentage": "85.00",
    "failPercentage": "15.00",
    "avgMarks": "72.50",
    "gradeDistribution": { ... },
    "topPerformersCount": 5
  }
}
```

### Get Branch-wise Statistics
```
GET /analytics/branch-stats
Query Parameters:
  - semester: optional

Response:
{
  "success": true,
  "branchStats": {
    "CSE": {
      "totalStudents": 100,
      "totalResults": 800,
      "passCount": 700,
      "failCount": 100,
      "avgMarks": "75.00",
      "passPercentage": "87.50"
    },
    "IT": {
      "totalStudents": 80,
      "totalResults": 640,
      "passCount": 550,
      "failCount": 90,
      "avgMarks": "72.00",
      "passPercentage": "85.94"
    }
  }
}
```

---

## 3. Report Endpoints

### Generate Student Report (PDF)
```
GET /reports/student/:studentId

Returns: PDF file
Filename: student_report_<rollNumber>.pdf

Contains:
- Student information
- Academic performance
- Attendance summary
- Semester-wise results
```

### Generate Transcript (PDF)
```
GET /reports/transcript/:studentId

Returns: PDF file
Filename: transcript_<rollNumber>.pdf

Contains:
- Student details
- Course performance
- CGPA
- Semester-wise grades
```

---

## 4. Notification Endpoints

### Send Notification
```
POST /notifications/send
Content-Type: application/json
Authorization: Bearer <token>

{
  "recipient": "user_id",
  "type": "marks",  // 'marks', 'attendance', 'announcement', 'report', 'warning'
  "title": "Marks Updated",
  "message": "Your marks have been updated",
  "relatedStudent": "student_id (optional)",
  "relatedSubject": "subject_id (optional)",
  "deliveryMethod": "email",  // 'in-app', 'email', 'sms'
  "priority": "medium"  // 'low', 'medium', 'high'
}

Response:
{
  "success": true,
  "message": "Notification sent successfully",
  "notification": { ... }
}
```

### Get User Notifications
```
GET /notifications/:userId
Query Parameters:
  - read: optional (true/false to filter)

Response:
{
  "success": true,
  "count": 15,
  "notifications": [ ... ]
}
```

### Mark Notification as Read
```
PUT /notifications/:notificationId/read
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Notification marked as read",
  "notification": { ... }
}
```

### Mark All Notifications as Read
```
PUT /notifications/:userId/read-all
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "All notifications marked as read",
  "modifiedCount": 5
}
```

### Delete Notification
```
DELETE /notifications/:notificationId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

### Broadcast Notification
```
POST /notifications/broadcast
Content-Type: application/json
Authorization: Bearer <token>

{
  "userIds": ["user_id_1", "user_id_2", "user_id_3"],
  "type": "announcement",
  "title": "System Maintenance",
  "message": "System will be under maintenance",
  "deliveryMethod": "email",
  "priority": "high"
}

Response:
{
  "success": true,
  "message": "3 notifications sent successfully",
  "count": 3
}
```

### Get Notification Statistics
```
GET /notifications/:userId/stats
Authorization: Bearer <token>

Response:
{
  "success": true,
  "stats": {
    "totalNotifications": 25,
    "unreadCount": 5,
    "readCount": 20
  }
}
```

---

## 5. Student Endpoints (Enhanced)

### Add Student
```
POST /students
Content-Type: application/json
Authorization: Bearer <token>

{
  "rollNumber": "2023001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "semester": 2,
  "branch": "CSE",
  "section": "A",
  "registrationDate": "2023-08-01",
  "address": "123 Main St",
  "parentContact": "9876543211"
}

Response:
{
  "success": true,
  "message": "Student added successfully",
  "student": { ... }
}
```

### Get Students
```
GET /students
Query Parameters:
  - semester: optional
  - branch: optional

Response:
{
  "success": true,
  "count": 250,
  "students": [ ... ]
}
```

### Get Student Details
```
GET /students/:studentId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "student": {
    "_id": "...",
    "rollNumber": "2023001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "semester": 2,
    "branch": "CSE",
    "section": "A",
    "gpa": 3.5,
    "cgpa": 3.6,
    "status": "active",
    "registrationDate": "2023-08-01"
  }
}
```

### Update Student
```
PUT /students/:studentId
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "semester": 3,
  "branch": "CSE",
  "status": "active"
}

Response:
{
  "success": true,
  "message": "Student updated successfully",
  "student": { ... }
}
```

### Delete Student
```
DELETE /students/:studentId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "User role 'student' is not authorized to access this route"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Student not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Query Parameters

### Pagination
```
GET /endpoint?limit=20&offset=0
```

### Filtering
```
GET /students?semester=2&branch=CSE
GET /attendance/stats?semester=1&branch=IT
```

### Sorting
```
GET /analytics/top-performers?sort=-avgGpa
```

---

## Rate Limiting
No rate limiting is currently implemented, but it's recommended for production.

---

## Webhooks
Webhooks for events like "attendance marked" or "marks updated" can be implemented in future versions.

---

## Versioning
Current API Version: **v2.0**

Future versions will maintain backward compatibility with this API.

---

## Example Usage (cURL)

### Add Attendance
```bash
curl -X POST http://localhost:5000/api/attendance/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "student": "student_id",
    "subject": "subject_id",
    "date": "2024-04-18",
    "status": "present"
  }'
```

### Get Analytics
```bash
curl -X GET http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Send Notification
```bash
curl -X POST http://localhost:5000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "recipient": "teacher_id",
    "type": "marks",
    "title": "Marks Updated",
    "message": "Student marks have been updated",
    "deliveryMethod": "email"
  }'
```

### Generate Report
```bash
curl -X GET http://localhost:5000/api/reports/student/student_id \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o student_report.pdf
```

---

## Integration Tips

1. **Always include Authorization header** for authenticated endpoints
2. **Handle error responses** properly in your client
3. **Use query parameters** for filtering and pagination
4. **Set proper Content-Type** headers for POST/PUT requests
5. **Test with tools** like Postman or curl before integrating

---

**Last Updated:** April 2026
**API Version:** 2.0
