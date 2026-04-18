# 🚀 EduTrack Backend - Quick Start Reference Card

## ⚡ 60-Second Setup

```bash
# 1. Start Server
cd backend && npm run dev

# 2. Seed Database (in another terminal)
node scripts/seedData.js

# 3. Test Health
curl http://localhost:5000/health
```

**✅ Done!** Your backend is running.

---

## 🔑 Test Credentials

Run `node scripts/seedData.js` to get:

```
Teacher Login:
  Email: rajesh.kumar@edutrack.com
  Password: Teacher@123
  Token: [auto-generated from script output]

Other Teachers:
  - priya.sharma@edutrack.com
  - arun.patel@edutrack.com
  - sneha.gupta@edutrack.com
```

---

## 📮 Postman Quick Setup

1. Open Postman
2. **Import** → `EduTrack_API.postman_collection.json`
3. Set variables:
   - `base_url`: `http://localhost:5000/api`
   - `teacher_token`: Paste token from seed script output

**Ready to test!**

---

## 🔌 Essential cURL Commands

```bash
# 1. Health Check
curl http://localhost:5000/health

# 2. Login (Get Token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajesh.kumar@edutrack.com","password":"Teacher@123"}'

# Save token as:
TOKEN="your-token-here"

# 3. Get Profile (Protected)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/profile

# 4. Get All Students
curl http://localhost:5000/api/students

# 5. Get All Results
curl http://localhost:5000/api/results

# 6. Analytics Dashboard (Protected)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/analytics/dashboard
```

---

## 📊 HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Request successful ✅ |
| 201 | Created | Resource created ✅ |
| 400 | Bad Request | Fix your data ❌ |
| 401 | Unauthorized | Add/refresh token ❌ |
| 403 | Forbidden | User lacks permission ❌ |
| 404 | Not Found | Resource doesn't exist ❌ |
| 409 | Conflict | Duplicate data ❌ |
| 500 | Server Error | Check backend logs ❌ |

---

## ✅ API Endpoints Cheat Sheet

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile              [Token required]
```

### Data Management
```
GET    /api/students
POST   /api/students                  [Token required]
PUT    /api/students/:id              [Token required]
DELETE /api/students/:id              [Token required]

GET    /api/subjects
POST   /api/subjects                  [Token required]

GET    /api/results
POST   /api/results                   [Token required]
GET    /api/results/gpa/:studentId

GET    /api/attendance
POST   /api/attendance/mark           [Token required]
```

### Analytics
```
GET    /api/analytics/dashboard       [Token required]
GET    /api/analytics/pass-fail       [Token required]
GET    /api/analytics/branch-stats    [Token required]
```

---

## 🔒 Token Usage

**Getting Token:**
```bash
# After login, you get:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "teacher": {...}
}
```

**Using Token:**
```bash
# Add to Authorization header:
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:5000/api/auth/profile
```

**Token Expiration:**
- Expires in 7 days
- Re-login to get new token

---

## 📝 Sample Request/Response

### Request (Create Student)
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rollNumber": "2024999",
    "name": "John Doe",
    "email": "john@student.edutrack.com",
    "phone": "9876543210",
    "semester": 3,
    "branch": "Computer Science"
  }'
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "rollNumber": "2024999",
    "name": "John Doe",
    "email": "john@student.edutrack.com",
    "semester": 3,
    "branch": "Computer Science",
    "createdAt": "2024-04-18T10:30:00Z"
  }
}
```

---

## ❌ Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Connection refused` | MongoDB not connected | Check MONGO_URI in .env |
| `Invalid token` | Missing/expired token | Re-login & get new token |
| `Duplicate key` | Email/rollNumber exists | Use unique value |
| `400 Bad Request` | Missing required fields | Check request body |
| `401 Unauthorized` | Token missing | Add Authorization header |
| `403 Forbidden` | Insufficient permissions | Need admin role |
| `404 Not Found` | Resource doesn't exist | Check ID/URL |

---

## 🧪 5-Phase Testing Workflow

### Phase 1: Auth (5 min)
- [ ] Health check works
- [ ] Register teacher
- [ ] Login gets token
- [ ] Get profile with token

### Phase 2: Students (10 min)
- [ ] Create student
- [ ] Get all students
- [ ] Update student
- [ ] Delete student

### Phase 3: Subjects (8 min)
- [ ] Create subject
- [ ] Get all subjects
- [ ] Update subject
- [ ] Delete subject

### Phase 4: Results (10 min)
- [ ] Create result
- [ ] Get results
- [ ] Calculate GPA
- [ ] Update result

### Phase 5: Analytics (7 min)
- [ ] Dashboard stats
- [ ] Pass/fail stats
- [ ] Branch stats
- [ ] Performance trends

**Total: ~45 minutes**

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| `COMPLETE_TESTING_GUIDE.md` | Detailed testing instructions |
| `IMPLEMENTATION_STATUS.md` | Complete feature list |
| `README.md` | Project overview |
| `DEPLOYMENT_GUIDE.md` | Production deployment |
| `QUICK_START.md` | Initial setup |

---

## 🔗 Key Links

```
Backend Server:    http://localhost:5000
Health Check:      http://localhost:5000/health
API Base:          http://localhost:5000/api
Frontend (later):  http://localhost:5173
Database:          MongoDB Atlas (configured in .env)
```

---

## 📋 Environment Variables

```bash
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://...
JWT_SECRET=ff63be7ac191c4db52bd7d0cffcf7c4aacbce8f0ced9e3c0f3fb20c9fc214d70
JWT_EXPIRES_IN=7d
```

---

## ✨ Database Models

```
Teacher
├── name, email, password
├── department, phone, qualification
├── assignedStudents, assignedSubjects
└── permissions (manage attendance, marks, etc.)

Student
├── rollNumber, name, email, phone
├── semester, branch
├── father, mother (parents)
└── timestamps

Subject
├── name, code (unique)
├── semester, credits, department
└── teacher (reference)

Result
├── student, subject (references)
├── marksObtained, maxMarks
├── grade, GPA (auto-calculated)
└── semester, academicYear, examType

Attendance
├── student, date, status (present/absent/leave)
├── subject (optional)
└── markedBy (teacher reference)

Other Models: Notification, User, Report
```

---

## 🎯 Testing Checklist

- [ ] Server starts without errors
- [ ] Health endpoint returns 200
- [ ] Can register new teacher
- [ ] Can login and get token
- [ ] Protected routes work with token
- [ ] Protected routes return 401 without token
- [ ] Can create student with validation
- [ ] Invalid data returns 400
- [ ] Duplicate data returns 409
- [ ] Can create subjects and results
- [ ] GPA calculation works correctly
- [ ] Analytics endpoints return data
- [ ] Error messages are descriptive
- [ ] CORS allows frontend requests
- [ ] Database operations are atomic

---

## 🚀 Next Steps

1. ✅ Verify all 15 items in checklist above
2. ✅ Document any issues found
3. ✅ Start React frontend development
4. ✅ Connect frontend to backend API
5. ✅ Test end-to-end workflows

---

## 📞 Troubleshooting

**Server won't start?**
```bash
# Check MongoDB
echo $MONGO_URI

# Check if port 5000 is available
lsof -i :5000

# Clear node_modules and reinstall
rm -rf node_modules && npm install
```

**Database connection fails?**
```bash
# Check .env has MONGO_URI
cat .env | grep MONGO_URI

# Test connection
node -e "require('mongoose').connect(process.env.MONGO_URI); console.log('✅ Connected')"
```

**Can't get token?**
```bash
# Make sure email/password are correct
# Try: rajesh.kumar@edutrack.com / Teacher@123

# Re-seed database
node scripts/seedData.js
```

---

## 📊 Architecture Quick Reference

```
User Request
    ↓
CORS Middleware
    ↓
Morgan Logging (Request)
    ↓
Body Parser
    ↓
XSS Sanitization
    ↓
Input Validation
    ↓
JWT Verification (if protected)
    ↓
RBAC Check (if protected)
    ↓
Controller Logic
    ↓
Database Query
    ↓
Response Formatting
    ↓
Error Handler (if error)
    ↓
Morgan Logging (Response)
    ↓
Send Response
```

---

## 🎓 Learning Resources

```
JWT Authentication:
https://jwt.io/introduction

MongoDB Mongoose:
https://mongoosejs.com/docs/guide.html

Express.js:
https://expressjs.com/

bcryptjs:
https://github.com/dcodeIO/bcrypt.js
```

---

**Last Updated:** April 18, 2024  
**Status:** ✅ Production Ready  
**Questions?** See `COMPLETE_TESTING_GUIDE.md`
