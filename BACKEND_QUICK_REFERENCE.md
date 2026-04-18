# EduTrack Backend - Quick Reference Card

## Essential Commands

### Setup & Running
```bash
# Install dependencies
cd backend
npm install

# Create .env file from .env.example
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET

# Development (with auto-reload)
npm run dev

# Production
npm start

# Check server health
curl http://localhost:5000/health
```

---

## File Structure Quick Map

```
src/
├── app.js                 ← Express configuration
├── server.js              ← Server startup & entry point
├── config/db.js           ← MongoDB connection
├── models/
│   ├── Student.model.js   ← Student schema
│   ├── Teacher.model.js   ← Teacher schema
│   ├── Result.model.js    ← Result schema
│   ├── Attendance.model.js ← Attendance schema
│   └── Subject.model.js   ← Subject schema
├── controllers/
│   ├── auth.controller.js       ← Auth logic
│   ├── student.controller.js    ← Student CRUD
│   ├── result.controller.js     ← Result CRUD
│   ├── attendance.controller.js ← Attendance CRUD
│   └── analytics.controller.js  ← Analytics logic
├── routes/
│   ├── index.js           ← Main router
│   ├── auth.routes.js     ← Auth endpoints
│   ├── student.routes.js  ← Student endpoints
│   ├── result.routes.js   ← Result endpoints
│   └── attendance.routes.js ← Attendance endpoints
├── middlewares/
│   ├── authMiddleware.js  ← JWT auth
│   ├── rbacMiddleware.js  ← Role-based access
│   ├── validation.middleware.js ← Input validation
│   └── error.middleware.js ← Error handling
└── utils/
    └── generateToken.js   ← JWT generation
```

---

## Key Endpoints Summary

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | /api/auth/register | ❌ | - | Register teacher |
| POST | /api/auth/login | ❌ | - | Login teacher |
| GET | /api/auth/profile | ✅ | Any | Get profile |
| POST | /api/students | ✅ | T/A | Create student |
| GET | /api/students | ❌ | - | List students |
| PUT | /api/students/:id | ✅ | T/A | Update student |
| DELETE | /api/students/:id | ✅ | A | Delete student |
| POST | /api/results | ✅ | T/A | Add result |
| GET | /api/results | ❌ | - | List results |
| PUT | /api/results/:id | ✅ | T/A | Update result |
| DELETE | /api/results/:id | ✅ | A | Delete result |
| POST | /api/attendance/add | ✅ | T/A | Mark attendance |
| GET | /api/attendance/student/:id | ✅ | Any | View attendance |
| POST | /api/attendance/bulk-add | ✅ | T/A | Batch attendance |
| GET | /api/analytics/dashboard | ❌ | - | Dashboard data |

**T/A = Teacher/Admin, A = Admin, ✅ = Requires JWT token**

---

## Testing Quick Commands

### 1. Register Teacher
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Test1234",
    "department": "CSE"
  }'
```

### 2. Login & Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test1234"
  }'

# Copy the token from response
export TOKEN="your_jwt_token_here"
```

### 3. Add Student (with token)
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rollNumber": "2024001",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "semester": 2,
    "branch": "CSE",
    "phone": "9876543210",
    "address": "123 Main St"
  }'

# Copy student ID from response
export STUDENT_ID="student_id_here"
```

### 4. Add Result
```bash
# First get or create Subject ID (assume SUBJECT_ID="...")
curl -X POST http://localhost:5000/api/results \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student": "'$STUDENT_ID'",
    "subject": "SUBJECT_ID",
    "semester": 2,
    "sessionalMarks": 15,
    "putMarks": 35,
    "finalMarks": 40
  }'
```

### 5. Mark Attendance
```bash
curl -X POST http://localhost:5000/api/attendance/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student": "'$STUDENT_ID'",
    "subject": "SUBJECT_ID",
    "date": "2024-04-18",
    "status": "present",
    "remarks": "Regular"
  }'
```

### 6. Get Dashboard Analytics
```bash
curl http://localhost:5000/api/analytics/dashboard?semester=2
```

---

## Validation Rules

### Student
- Roll Number: 4-20 chars
- Name: 3-100 chars
- Email: Valid format
- Semester: 1-8
- Phone: ≥10 digits

### Result
- Sessional: 0-100
- PUT: 0-100
- Final: 0-100
- Semester: 1-8

### Attendance
- Status: "present", "absent", "leave"
- Date: Valid date
- Remarks: 0-200 chars

### Authentication
- Email: Valid format
- Password: ≥6 chars

---

## Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET |
| 201 | Created | Student created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | Insufficient role |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email |
| 500 | Server Error | Database error |

---

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/edutrack

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Email (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## Role-Based Access

```
Admin (role: "admin")
├─ Full access to all endpoints
├─ Can delete any resource
├─ Can manage users

Teacher (role: "teacher")
├─ Create/read/update students
├─ Add/update results
├─ Mark attendance
├─ View analytics

Student (role: "student")
├─ View own profile
├─ View own results
└─ View own attendance (future)
```

---

## Error Response Format

```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": [
    "Field validation error 1",
    "Field validation error 2"
  ]
}
```

---

## JWT Token Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Decoded:
{
  "id": "teacher_id_mongodb",
  "role": "teacher",
  "iat": 1713425400,
  "exp": 1714030200
}
```

---

## Postman Collection Setup

```json
{
  "info": {
    "name": "EduTrack API",
    "description": "EduTrack Backend APIs"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/auth/register"
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## Debugging Tips

### 1. Check Server Logs
```bash
# Server logs all requests with morgan
# Watch for error messages
npm run dev
```

### 2. Verify MongoDB Connection
```javascript
// Create test-db.js
import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DB Connected'))
  .catch(err => console.error('❌', err));
```

### 3. Test JWT Token
```bash
# Use jwt.io to decode token
# Verify exp (expiration) timestamp
# Check id and role fields
```

### 4. MongoDB Compass
- Install MongoDB Compass
- Connect with MONGO_URI
- Browse collections
- Check document structure

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "MONGO_URI is not defined" | Missing .env | Create .env from .env.example |
| "JWT_SECRET is not defined" | Missing .env | Add JWT_SECRET to .env |
| "Cannot read property '_id'" | No auth token | Add Authorization header |
| "Token is not valid" | Expired token | Login again |
| "Duplicate key error" | Existing email | Use different email |
| "Connection refused" | DB not running | Check MongoDB Atlas/Local DB |
| "E11000 duplicate key" | Unique constraint | Check rollNumber/email |

---

## Performance Tips

1. **Use Indexes**
   ```javascript
   // Already configured in models
   db.students.createIndex({ email: 1 })
   db.results.createIndex({ student: 1, semester: 1 })
   ```

2. **Pagination**
   ```bash
   GET /api/students?page=1&limit=20
   ```

3. **Select Specific Fields**
   ```javascript
   Student.find({}, 'name email semester')
   ```

4. **Populate Carefully**
   ```javascript
   Result.findById(id).populate('student', 'name email')
   ```

---

## Next Steps

1. ✅ Install & configure backend
2. ✅ Set up .env file
3. ✅ Start server (`npm run dev`)
4. ✅ Test auth endpoints
5. ✅ Create sample data
6. ✅ Test CRUD operations
7. ⏭️ Move to frontend development

---

## Useful Links

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- JWT.io: https://jwt.io
- Postman: https://www.postman.com
- Express Docs: https://expressjs.com
- Mongoose Docs: https://mongoosejs.com

---

## Team Communication

- Backend Running: `http://localhost:5000`
- API Base URL: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/health`
- MongoDB: Check `MONGO_URI` in .env

---

**Happy Coding! 🚀**

Last Updated: April 18, 2024
EduTrack Backend v2.0

