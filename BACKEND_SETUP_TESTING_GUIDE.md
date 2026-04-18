# EduTrack Backend Setup & Testing Guide

## Overview
This guide covers the complete setup and testing of the EduTrack backend API with all CRUD operations, authentication, RBAC, and validation.

---

## Prerequisites

### Installed Dependencies (Verify in package.json)
```
✅ express ^5.2.1
✅ mongoose ^9.1.3
✅ jsonwebtoken ^9.0.3
✅ bcryptjs ^3.0.3
✅ cors ^2.8.5
✅ dotenv ^17.2.3
✅ morgan ^1.10.0
✅ pdfkit ^0.13.0
✅ nodemailer ^6.9.7
✅ nodemon ^3.1.11 (dev)
```

### Environment Setup
Install all dependencies:
```bash
cd backend
npm install
```

---

## Environment Configuration

### 1. Create `.env` File
Copy from `.env.example` and configure:
```bash
# Backend
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/edutrack?appName=Cluster0

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email (Optional - for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_SERVICE=gmail
```

### 2. MongoDB Setup
- Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Update `MONGO_URI` in `.env`

### 3. JWT Secret
Generate a strong secret key:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server startup
│   ├── config/
│   │   └── db.js             # Database connection
│   ├── models/
│   │   ├── Student.model.js
│   │   ├── Teacher.model.js
│   │   ├── Subject.model.js
│   │   ├── Result.model.js
│   │   ├── Attendance.model.js
│   │   └── Notification.model.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── student.controller.js
│   │   ├── result.controller.js
│   │   ├── attendance.controller.js
│   │   ├── analytics.controller.js
│   │   ├── notification.controller.js
│   │   └── report.controller.js
│   ├── routes/
│   │   ├── index.js           # Main router
│   │   ├── auth.routes.js
│   │   ├── student.routes.js
│   │   ├── result.routes.js
│   │   ├── attendance.routes.js
│   │   └── ...
│   ├── middlewares/
│   │   ├── authMiddleware.js  # JWT authentication
│   │   ├── rbacMiddleware.js  # Role-based access control
│   │   ├── validation.middleware.js  # Input validation
│   │   └── error.middleware.js      # Error handling
│   └── utils/
│       ├── generateToken.js
│       └── calculateGrades.js
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## Starting the Server

### Development Mode (with auto-reload)
```bash
cd backend
npm run dev
```

### Production Mode
```bash
cd backend
npm start
```

### Expected Output
```
🔄 Connecting to MongoDB...
✅ MongoDB connected successfully

╔══════════════════════════════════════╗
║   EduTrack Backend Server Started    ║
╠══════════════════════════════════════╣
║ 🚀 Server: http://localhost:5000     ║
║ 🌍 Environment: development          ║
║ 📅 Started at: [timestamp]           ║
╠══════════════════════════════════════╣
║ Available Routes:                    ║
║ GET  /health (Status Check)          ║
║ GET  /api (API Info)                 ║
║ POST /api/auth/register              ║
║ POST /api/auth/login                 ║
║ GET  /api/students                   ║
║ POST /api/results                    ║
╚══════════════════════════════════════╝
```

---

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

---

## Authentication & Testing

### 1. Health Check
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-04-18T10:30:00.000Z",
  "message": "✅ EduTrack Backend is running"
}
```

---

## Authentication Endpoints

### Register Teacher
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "department": "Computer Science"
}
```

Response:
```json
{
  "success": true,
  "message": "Teacher registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "teacher": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Computer Science"
  }
}
```

### Login Teacher
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Get Teacher Profile (Authenticated)
```bash
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Student Management Endpoints

### Create Student (Teacher/Admin only)
```bash
POST /api/students
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "rollNumber": "2023001",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "semester": 2,
  "branch": "CSE",
  "phone": "9876543210",
  "address": "123 Main Street"
}
```

### Get All Students
```bash
GET /api/students
```

### Get All Students with Filters
```bash
GET /api/students?semester=2&branch=CSE
```

### Get Single Student
```bash
GET /api/students/507f1f77bcf86cd799439011
```

### Update Student (Teacher/Admin only)
```bash
PUT /api/students/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Alice Johnson",
  "semester": 3,
  "gpa": 3.8
}
```

### Delete Student (Admin only)
```bash
DELETE /api/students/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Result Management Endpoints

### Add Result (Teacher/Admin only)
```bash
POST /api/results
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "student": "507f1f77bcf86cd799439011",
  "subject": "507f1f77bcf86cd799439012",
  "semester": 2,
  "sessionalMarks": 15,
  "putMarks": 35,
  "finalMarks": 40
}
```

### Get All Results with Filters
```bash
GET /api/results?student=507f1f77bcf86cd799439011&semester=2
```

### Get Single Result
```bash
GET /api/results/507f1f77bcf86cd799439013
```

### Update Result (Teacher/Admin only)
```bash
PUT /api/results/507f1f77bcf86cd799439013
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "sessionalMarks": 16,
  "putMarks": 36,
  "finalMarks": 42
}
```

### Delete Result (Admin only)
```bash
DELETE /api/results/507f1f77bcf86cd799439013
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Attendance Management Endpoints

### Add Attendance (Teacher/Admin only)
```bash
POST /api/attendance/add
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "student": "507f1f77bcf86cd799439011",
  "subject": "507f1f77bcf86cd799439012",
  "date": "2024-04-18",
  "status": "present",
  "remarks": "Regular"
}
```

Valid status values: `present`, `absent`, `leave`

### Get Student Attendance
```bash
GET /api/attendance/student/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Subject Attendance (Teacher/Admin only)
```bash
GET /api/attendance/subject/507f1f77bcf86cd799439012?semester=2
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Attendance (Teacher/Admin only)
```bash
PUT /api/attendance/update/507f1f77bcf86cd799439014
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "absent",
  "remarks": "Sick leave"
}
```

### Bulk Add Attendance (Teacher/Admin only)
```bash
POST /api/attendance/bulk-add
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "records": [
    {
      "student": "507f1f77bcf86cd799439011",
      "subject": "507f1f77bcf86cd799439012",
      "date": "2024-04-18",
      "status": "present",
      "remarks": ""
    },
    {
      "student": "507f1f77bcf86cd799439015",
      "subject": "507f1f77bcf86cd799439012",
      "date": "2024-04-18",
      "status": "absent",
      "remarks": "Absent without leave"
    }
  ]
}
```

### Get Attendance Statistics (Teacher/Admin only)
```bash
GET /api/attendance/stats?semester=2&branch=CSE
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Analytics Endpoints

### Get Dashboard Analytics
```bash
GET /api/analytics/dashboard?semester=2
```

Response includes:
- Total students
- Pass/Fail counts and percentages
- Average marks
- Grade distribution

### Get Pass/Fail Statistics
```bash
GET /api/analytics/pass-fail?semester=2&branch=CSE
```

### Get Student Statistics by Branch
```bash
GET /api/analytics/branch-stats?semester=2
```

### Get Semester Trends
```bash
GET /api/analytics/semester-trends/507f1f77bcf86cd799439011
```

---

## Testing with Postman

### 1. Import Collection
- Open Postman
- Create new collection "EduTrack API"
- Add requests following the endpoints above

### 2. Environment Variables
Create Postman environment with:
```json
{
  "base_url": "http://localhost:5000/api",
  "token": "",
  "student_id": "",
  "subject_id": "",
  "teacher_id": ""
}
```

### 3. Authentication Flow
1. Register teacher: `POST /auth/register`
2. Copy token from response
3. Set `{{token}}` in environment
4. Use `Authorization: Bearer {{token}}` in headers

### 4. Data Flow for Testing
```
Register Teacher → Login → Create Subject → Create Student → Add Result → Mark Attendance
```

---

## Testing with cURL

### Basic Tests

#### 1. Health Check
```bash
curl -X GET http://localhost:5000/health
```

#### 2. Register Teacher
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Teacher",
    "email": "teacher@test.com",
    "password": "Test1234",
    "department": "CSE"
  }'
```

#### 3. Login Teacher
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@test.com",
    "password": "Test1234"
  }'
```

#### 4. Add Student (with JWT Token)
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rollNumber": "2024001",
    "name": "Test Student",
    "email": "student@test.com",
    "semester": 1,
    "branch": "CSE",
    "phone": "9876543210",
    "address": "Test Address"
  }'
```

#### 5. Get All Students
```bash
curl -X GET http://localhost:5000/api/students
```

---

## Input Validation

### Validation Rules Implemented

#### Student
- `rollNumber`: 4-20 characters
- `name`: 3-100 characters
- `email`: Valid email format
- `semester`: 1-8
- `branch`: 2-50 characters
- `phone`: At least 10 digits

#### Teacher
- `name`: 3-100 characters
- `email`: Valid email format
- `password`: 6-50 characters
- `department`: 2-100 characters

#### Result
- `semester`: 1-8
- `sessionalMarks`: 0-100
- `putMarks`: 0-100
- `finalMarks`: 0-100

#### Attendance
- `status`: Must be `present`, `absent`, or `leave`
- `date`: Valid date format
- `remarks`: 0-200 characters

### Error Response Example
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Phone must contain at least 10 digits",
    "Email is required"
  ]
}
```

---

## Security Features

### 1. JWT Authentication
- Tokens generated on login/register
- Required for protected endpoints
- Expires in 7 days (configurable)
- Secret key stored in .env

### 2. Role-Based Access Control (RBAC)
```
Admin - Full access to all endpoints
Teacher - Can create/update students, results, attendance
Student - Can view own profile (feature - coming soon)
```

### 3. Password Security
- Passwords hashed with bcryptjs
- Never sent back in responses
- Minimum 6 characters enforced

### 4. Input Sanitization
- XSS protection - HTML/script tags removed
- Type validation
- Length validation
- Format validation (email, phone, etc.)

### 5. CORS Configuration
- Restricted to frontend URL
- Credentials allowed
- Specific methods allowed

---

## Error Handling

### HTTP Status Codes
```
200 OK - Request successful
201 Created - Resource created
400 Bad Request - Validation error
401 Unauthorized - No/invalid token
403 Forbidden - Insufficient permissions
404 Not Found - Resource not found
409 Conflict - Duplicate record
500 Internal Server Error - Server error
```

### Error Response Format
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": [] // Optional - validation errors
}
```

---

## Common Issues & Solutions

### Issue: "MONGO_URI is not defined"
**Solution**: Check `.env` file exists and has MONGO_URI

### Issue: "JWT_SECRET is not defined"
**Solution**: Add JWT_SECRET to `.env`

### Issue: "Cannot read property '_id' of undefined"
**Solution**: Ensure user is authenticated (token is valid)

### Issue: "Token is not valid"
**Solution**: 
- Token might be expired
- JWT_SECRET might be different
- Re-login to get new token

### Issue: "User role 'student' is not authorized"
**Solution**: Some endpoints are teacher/admin only

### Issue: "Duplicate key error"
**Solution**: Student with same email/rollNumber exists

### Issue: "MongoDB connection failed"
**Solution**:
- Check MONGO_URI in .env
- Verify MongoDB Atlas IP whitelist
- Check internet connection

---

## Troubleshooting

### Enable Debug Logging
```bash
# In development, morgan logs all requests
# Check console output for request/response details
```

### Test Database Connection
```bash
# Create a test file: test-db.js
import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected'))
  .catch(err => console.error('❌ Error:', err));
```

Run:
```bash
node test-db.js
```

### View Server Logs
```bash
# Development mode shows detailed logs
npm run dev
```

---

## Next Steps

1. ✅ Backend API Setup Complete
2. ⏭️ Frontend Development
3. ⏭️ Full Integration Testing
4. ⏭️ Deploy to Production

---

## Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS only
- [ ] Set proper CORS origins
- [ ] Enable database backups
- [ ] Set up monitoring/logging
- [ ] Configure rate limiting
- [ ] Test all endpoints thoroughly
- [ ] Set up email service
- [ ] Document API for frontend team

---

## Support & Documentation

For more details:
- Check individual controller files for implementation
- Review validation.middleware.js for validation rules
- See rbacMiddleware.js for permission logic
- Check routes files for endpoint definitions

---

**Backend Setup Complete!** 🎉
Ready to proceed with Frontend Development.

