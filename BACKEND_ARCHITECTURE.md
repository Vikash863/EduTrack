# EduTrack Backend Architecture Overview

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
│              http://localhost:5173                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/AJAX
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   API GATEWAY / ROUTER                          │
│            app.js - Express Configuration                       │
│                  server.js - Startup                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼────┐  ┌─────▼─────┐  ┌────▼─────┐
         │MIDDLEWARE│ │  ROUTES   │  │  ERROR   │
         │          │ │           │  │ HANDLER  │
         └────┬────┘  └─────┬─────┘  └──────────┘
              │             │
     ┌────────┼─────────────┼─────────────────┐
     │        │             │                 │
 ┌───▼──┐ ┌──▼───┐ ┌──────▼─────┐ ┌────────▼──┐
 │Morgan│ │CORS  │ │Validation  │ │Auth/RBAC  │
 └──────┘ └──────┘ └────────────┘ └───────────┘
                      │
         ┌────────────┼─────────────────────┐
         │            │                     │
    ┌────▼────┐ ┌────▼──────┐ ┌───────────▼──┐
    │  Routes │ │Controllers │ │   Models    │
    │         │ │            │ │ (Mongoose)  │
    └────┬────┘ └────┬──────┘  └─────┬──────┘
         │           │               │
         ├─Auth─┐    │           ┌───┴─────────────┐
         │      │    │           │                 │
    ┌────▼──┐┌──▼──┐┌─▼──┐   ┌──▼──┐ ┌────┐ ┌────▼────┐
    │Student││Result││Att.│   │User │ │Subj│ │Result   │
    │       ││      ││    │   │     │ │    │ │Attend.  │
    └───────┘└──────┘└────┘   └─────┘ └────┘ └─────────┘
                      │
                      │ Mongoose ODM
                      │
    ┌─────────────────▼─────────────────┐
    │       MONGODB DATABASE            │
    │                                   │
    │  Collections:                     │
    │  - users                          │
    │  - students                       │
    │  - teachers                       │
    │  - subjects                       │
    │  - results                        │
    │  - attendances                    │
    │  - notifications                  │
    │                                   │
    └───────────────────────────────────┘
```

---

## Core Components

### 1. **Server & App Configuration**

#### `server.js`
- Entry point of the application
- Loads environment variables
- Initializes database connection
- Starts Express server
- Graceful shutdown handling

#### `app.js`
- Express app configuration
- Global middleware setup (CORS, logging, parsing)
- Route mounting
- Error handling
- 404 handler

#### `config/db.js`
- MongoDB connection logic
- Mongoose initialization
- Connection error handling
- Automatic reconnection

---

### 2. **Middleware Layer**

#### `authMiddleware.js`
```javascript
Purpose: Legacy JWT authentication
Usage: 
  - Verifies JWT token
  - Extracts user from token
  - Attaches teacher to request
  - Used for backward compatibility
```

#### `rbacMiddleware.js` (Recommended)
```javascript
Exports:
  - protect() - Verifies JWT and extracts user
  - authorize(...roles) - Checks if user has required role
  - adminOnly() - Admin access only
  - teacherOrAdmin() - Teacher/Admin access
  - studentOrAdmin() - Student/Admin access
  
Usage:
  router.post('/path', protect, authorize('admin'), controller);
```

#### `validation.middleware.js`
```javascript
Exports:
  - validateStudent() - Student field validation
  - validateTeacher() - Teacher field validation
  - validateResult() - Result field validation
  - validateAttendance() - Attendance field validation
  - validateAuthCredentials() - Auth validation
  - validateObjectId() - MongoDB ID validation
  - sanitizeInput() - XSS protection
  
Validation Rules:
  - Type checking
  - Length validation
  - Format validation (email, phone, etc.)
  - Range validation (marks 0-100, semester 1-8)
  - Required field checking
```

#### `error.middleware.js`
```javascript
Purpose: Global error handler
Features:
  - Catches all errors
  - Returns consistent error format
  - Includes stack trace in development
  - Proper HTTP status codes
```

---

### 3. **Route Layer**

```
/api
├── /auth
│   ├── POST /register - Register teacher
│   ├── POST /login - Login teacher
│   └── GET /profile - Get teacher profile (protected)
│
├── /students
│   ├── POST / - Create student (teacher/admin)
│   ├── GET / - Get all students
│   ├── GET /:id - Get single student
│   ├── PUT /:id - Update student (teacher/admin)
│   └── DELETE /:id - Delete student (admin)
│
├── /results
│   ├── POST / - Add result (teacher/admin)
│   ├── GET / - Get all results
│   ├── GET /:id - Get single result
│   ├── PUT /:id - Update result (teacher/admin)
│   └── DELETE /:id - Delete result (admin)
│
├── /attendance
│   ├── POST /add - Add attendance (teacher/admin)
│   ├── GET /student/:id - Get student attendance (protected)
│   ├── GET /subject/:id - Get subject attendance (teacher/admin)
│   ├── PUT /update/:id - Update attendance (teacher/admin)
│   ├── POST /bulk-add - Bulk add attendance (teacher/admin)
│   └── GET /stats - Get statistics (teacher/admin)
│
├── /analytics
│   ├── GET /dashboard - Get dashboard analytics
│   ├── GET /pass-fail - Get pass/fail stats
│   ├── GET /branch-stats - Get branch statistics
│   └── GET /semester-trends/:id - Get trends
│
├── /subjects
│   ├── POST / - Create subject
│   ├── GET / - Get all subjects
│   ├── GET /:id - Get single subject
│   ├── PUT /:id - Update subject
│   └── DELETE /:id - Delete subject
│
└── /notifications
    ├── POST /send - Send notification (teacher/admin)
    ├── GET /:userId - Get notifications
    ├── PUT /:id/read - Mark as read
    ├── PUT /:userId/read-all - Mark all as read
    └── DELETE /:id - Delete notification
```

---

### 4. **Controller Layer**

Each controller follows this pattern:

```javascript
// CRUD Operations
export const createEntity = async (req, res) => {
  try {
    // Validation
    // Data processing
    // Database operation
    // Response
  } catch (error) {
    // Error handling
  }
};

export const readEntities = async (req, res) => {
  try {
    // Query with filters
    // Populate relations
    // Sorting/Pagination
    // Response
  } catch (error) { }
};

export const readEntity = async (req, res) => {
  try {
    // Find by ID
    // Populate relations
    // Response
  } catch (error) { }
};

export const updateEntity = async (req, res) => {
  try {
    // Validation
    // Update database
    // Response
  } catch (error) { }
};

export const deleteEntity = async (req, res) => {
  try {
    // Delete from database
    // Cleanup related data
    // Response
  } catch (error) { }
};
```

#### Controllers Available

1. **auth.controller.js**
   - `registerTeacher` - Create new teacher account
   - `loginTeacher` - Authenticate and get token
   - `getTeacherProfile` - Retrieve authenticated teacher

2. **student.controller.js**
   - `addStudent` - Create new student
   - `getStudents` - List all students (with filters)
   - `getStudent` - Get single student
   - `updateStudent` - Update student details
   - `deleteStudent` - Remove student

3. **result.controller.js**
   - `addResult` - Record student result
   - `getResults` - List results (with filters)
   - `getResult` - Get single result
   - `updateResult` - Modify result marks
   - `deleteResult` - Remove result

4. **attendance.controller.js**
   - `addAttendance` - Mark single attendance
   - `getStudentAttendance` - View student attendance
   - `getSubjectAttendance` - View subject attendance
   - `updateAttendance` - Modify attendance record
   - `bulkAddAttendance` - Batch attendance entry
   - `getAttendanceStats` - Calculate statistics

5. **analytics.controller.js**
   - `getDashboardAnalytics` - Overall statistics
   - `getPassFailStats` - Pass/fail analysis
   - `getStudentStatsByBranch` - Branch statistics
   - `getSemesterTrends` - Performance trends

6. **report.controller.js**
   - `generateStudentReport` - PDF student report
   - `generateTranscript` - PDF transcript

7. **notification.controller.js**
   - `sendNotification` - Send notification
   - `getUserNotifications` - Retrieve notifications
   - `markAsRead` - Update read status
   - `broadcastNotification` - Multi-user notification

---

### 5. **Model Layer**

#### Data Models with Mongoose

```javascript
Student Schema:
  - rollNumber (String, unique)
  - name (String)
  - email (String, unique)
  - semester (Number, 1-8)
  - branch (String)
  - gpa (Number)
  - cgpa (Number)
  - phone (String)
  - address (String)
  - dob (Date)
  - section (String)
  - parentContact (String)
  - status (Enum: active, inactive, graduated)
  - registrationDate (Date)

Teacher Schema:
  - name (String)
  - email (String, unique)
  - password (String, hashed)
  - department (String)
  - phone (String)
  - dob (Date)
  - qualification (String)
  - experience (Number)
  - joiningDate (Date)
  - assignedStudents (Array of ObjectId)
  - assignedSubjects (Array of ObjectId)
  - permissions (Object with boolean flags)
  - status (Enum: active, inactive, on-leave)

Result Schema:
  - student (ObjectId -> Student)
  - subject (ObjectId -> Subject)
  - semester (Number)
  - sessionalMarks (Number)
  - putMarks (Number)
  - finalMarks (Number)
  - gradePoint (Number, calculated)
  - grade (String, calculated)

Attendance Schema:
  - student (ObjectId -> Student)
  - subject (ObjectId -> Subject)
  - teacher (ObjectId -> Teacher)
  - semester (Number)
  - date (Date)
  - status (Enum: present, absent, leave)
  - remarks (String)

Subject Schema:
  - subjectCode (String)
  - subjectName (String)
  - credits (Number)
  - teacher (ObjectId -> Teacher)
  - semester (Number)

Notification Schema:
  - recipient (ObjectId -> User)
  - type (Enum)
  - title (String)
  - message (String)
  - read (Boolean)
  - deliveryMethod (Enum)
  - deliveryStatus (Enum)
  - priority (Enum)
```

---

## Data Flow

### Student Addition Flow
```
Request: POST /api/students
   ↓
Middleware: sanitizeInput → validateStudent → protect → authorize
   ↓
Controller: addStudent
   ├─ Check if student exists (uniqueness)
   ├─ Hash password (if applicable)
   ├─ Save to MongoDB
   └─ Response with created student
   ↓
Response: 201 Created
```

### Authentication Flow
```
1. Register:
   POST /api/auth/register
   → Controller creates teacher
   → JWT token generated
   → Token sent to frontend

2. Login:
   POST /api/auth/login
   → Verify email/password
   → Compare hashed password
   → Generate JWT token
   → Token sent to frontend

3. Protected Request:
   GET /api/auth/profile
   Authorization: Bearer <TOKEN>
   → Middleware verifies token
   → Extracts user ID from token
   → Fetches user data
   → Returns user information
```

### Result Recording & GPA Update
```
POST /api/results
   ↓
1. Validate input (marks 0-100, valid semester)
   ↓
2. Check duplicate result (same student-subject-semester)
   ↓
3. Save result to database
   ↓
4. Calculate grade and gradePoint
   ↓
5. Fetch all student results
   ↓
6. Calculate new GPA
   ↓
7. Update student GPA
   ↓
Response: Result created + Student GPA updated
```

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* resource data */ },
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Phone must contain 10 digits"
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Authorization Error
```json
{
  "success": false,
  "message": "User role 'student' is not authorized to access this route"
}
```

---

## Security Implementation

### JWT Token
```
Header: Authorization: Bearer <JWT_TOKEN>

Token Structure:
{
  "id": "teacher_id",
  "role": "teacher",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Password Security
```
1. Password hashing: bcryptjs
2. Hash rounds: 10
3. Comparison: bcrypt.compare()
4. Never stored in plain text
5. Never returned in responses
```

### CORS Configuration
```javascript
{
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

---

## Database Indexing Strategy

```javascript
// Student
db.students.createIndex({ email: 1 })
db.students.createIndex({ rollNumber: 1 })
db.students.createIndex({ semester: 1, branch: 1 })

// Result
db.results.createIndex({ student: 1, semester: 1 })
db.results.createIndex({ subject: 1 })

// Attendance
db.attendances.createIndex({ student: 1, date: 1 })
db.attendances.createIndex({ subject: 1, semester: 1 })

// Teacher
db.teachers.createIndex({ email: 1 })
db.teachers.createIndex({ department: 1 })
```

---

## Performance Optimization

### Query Optimization
```javascript
// Good: Select specific fields
await Student.find({}, 'name email semester')

// Good: Populate relations only when needed
await Result.findById(id).populate('student', 'name email')

// Good: Use lean() for read-only queries
await Student.find({}).lean()

// Avoid: Fetching all fields unnecessarily
await Student.find({})
```

### Pagination
```javascript
const page = req.query.page || 1;
const limit = req.query.limit || 20;
const skip = (page - 1) * limit;

const results = await Student.find({})
  .skip(skip)
  .limit(limit);
```

### Caching (for future implementation)
```javascript
// Cache analytics calculations
// Cache frequently accessed data
// Use Redis for session management
```

---

## Testing Endpoints Quick Reference

```bash
# Register & Login
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"name":"test","email":"test@test.com","password":"1234567","department":"CSE"}'

# Copy token from response

# Add Student
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rollNumber":"2024001","name":"John","email":"john@test.com","semester":2,"branch":"CSE","phone":"9876543210"}'

# Get Students
curl http://localhost:5000/api/students

# Add Result
curl -X POST http://localhost:5000/api/results \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"student":"ID","subject":"ID","semester":2,"sessionalMarks":15,"putMarks":35,"finalMarks":40}'

# Mark Attendance
curl -X POST http://localhost:5000/api/attendance/add \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"student":"ID","subject":"ID","date":"2024-04-18","status":"present"}'
```

---

## Next Steps

1. ✅ Backend Models Created
2. ✅ Controllers Implemented
3. ✅ Routes Configured
4. ✅ Authentication Setup
5. ✅ RBAC Implemented
6. ✅ Validation Added
7. ⏭️ Backend Testing (Use Postman/cURL)
8. ⏭️ Frontend Development
9. ⏭️ Integration Testing
10. ⏭️ Deployment

---

**Backend Architecture Complete!** 🎉

