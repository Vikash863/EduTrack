# EduTrack v2.0 Migration Guide

## Overview
This guide will help you update your existing EduTrack installation to include all the new v2.0 features.

---

## Step 1: Backend Updates

### 1.1 Install New Dependencies
```bash
cd backend
npm install pdfkit nodemailer
```

### 1.2 Update Environment Variables
Add these to your `.env` file if using email notifications:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # For Gmail, use app-specific password
EMAIL_SERVICE=gmail
JWT_SECRET=your-secret-key
```

### 1.3 Database Migration
Your existing Student and Teacher collections will need to be updated. The new fields are optional with defaults, but to fully utilize new features:

```javascript
// Optional: Add default values to existing students
db.students.updateMany(
  {},
  {
    $set: {
      cgpa: 0,
      status: 'active',
      registrationDate: new Date(),
      parentContact: '',
      section: ''
    }
  }
)

// Optional: Add default values to existing teachers
db.teachers.updateMany(
  {},
  {
    $set: {
      phone: '',
      qualification: '',
      experience: 0,
      joiningDate: new Date(),
      assignedStudents: [],
      assignedSubjects: [],
      permissions: {
        canManageAttendance: true,
        canManageMarks: true,
        canViewAnalytics: true,
        canGenerateReports: true
      },
      status: 'active'
    }
  }
)
```

### 1.4 Create New Collections
New collections will be automatically created by Mongoose when first used:
- `attendances`
- `notifications`
- `users`

---

## Step 2: Backend File Updates

### 2.1 New Files to Create/Copy
Ensure these files exist in your backend:
```
backend/src/
├── controllers/
│   ├── attendance.controller.js (NEW)
│   ├── notification.controller.js (NEW)
│   ├── report.controller.js (NEW)
│   └── (existing files...)
├── models/
│   ├── Attendance.model.js (NEW)
│   ├── Notification.model.js (NEW)
│   ├── User.model.js (NEW)
│   ├── Student.model.js (UPDATED)
│   ├── Teacher.model.js (UPDATED)
│   └── (existing files...)
├── routes/
│   ├── attendance.routes.js (NEW)
│   ├── notification.routes.js (NEW)
│   ├── report.routes.js (NEW)
│   ├── analytics.routes.js (UPDATED)
│   └── (existing files...)
├── utils/
│   ├── calculateCGPA.js (NEW)
│   └── (existing files...)
└── middlewares/
    ├── rbacMiddleware.js (NEW)
    └── (existing files...)
```

### 2.2 Update Existing Files
Files that were modified:
- `src/models/Student.model.js` - Added new fields
- `src/models/Teacher.model.js` - Added new fields
- `src/controllers/analytics.controller.js` - Added new endpoints
- `src/routes/index.js` - Added new route imports
- `src/routes/analytics.routes.js` - Added new routes
- `package.json` - Added new dependencies

---

## Step 3: Frontend Updates

### 3.1 Install Dependencies (if needed)
```bash
cd frontend
# Recharts should already be installed, but verify:
npm list recharts
# If not installed:
npm install recharts
```

### 3.2 New Frontend Files
Ensure these files exist:
```
frontend/src/
├── pages/
│   ├── StudentProfile.jsx (NEW)
│   ├── Attendance.jsx (NEW)
│   ├── AnalyticsPage.jsx (NEW)
│   ├── AdminDashboard.jsx (NEW)
│   └── (existing files...)
├── services/
│   └── api.js (UPDATED with new endpoints)
├── App.jsx (UPDATED with new routes)
└── components/
    └── Navbar.jsx (UPDATED with new links)
```

### 3.3 Updated Files
- `src/App.jsx` - Added new routes and imports
- `src/components/Navbar.jsx` - Added new navigation links
- `src/services/api.js` - Added new API methods

---

## Step 4: Database Schema Verification

### 4.1 Check Indexes
Ensure these indexes are created (Mongoose handles this automatically):
```javascript
// Attendance indexes
db.attendances.createIndex({ student: 1, subject: 1, semester: 1 })
db.attendances.createIndex({ student: 1, date: 1 })

// Notification indexes
db.notifications.createIndex({ recipient: 1, read: 1 })
db.notifications.createIndex({ createdAt: -1 })

// Student indexes
db.students.createIndex({ rollNumber: 1, semester: 1 }, { unique: true })
```

---

## Step 5: Testing the Updates

### 5.1 Backend Testing
```bash
cd backend

# Start the server
npm start

# Test attendance endpoint
curl -X GET http://localhost:5000/api/attendance/stats

# Test analytics endpoint
curl -X GET http://localhost:5000/api/analytics/dashboard

# Test notification endpoint
curl -X GET http://localhost:5000/api/notifications/stats
```

### 5.2 Frontend Testing
```bash
cd frontend

# Start dev server
npm run dev

# Check that new pages load:
# http://localhost:5173/admin-dashboard
# http://localhost:5173/attendance
# http://localhost:5173/analytics-dashboard
# http://localhost:5173/student/:id
```

---

## Step 6: Data Population (Optional)

If you want to test the new features, populate some test data:

### 6.1 Add Sample Attendance Records
```javascript
// Using Postman or curl
POST /api/attendance/bulk-add
{
  "records": [
    {
      "student": "student_id_here",
      "subject": "subject_id_here",
      "date": "2024-04-18",
      "status": "present",
      "remarks": ""
    }
  ]
}
```

### 6.2 Update Student CGPA
The system automatically calculates CGPA based on results. Just add results through the existing Results API.

### 6.3 Send Sample Notifications
```javascript
POST /api/notifications/send
{
  "recipient": "teacher_id_here",
  "type": "marks",
  "title": "Marks Updated",
  "message": "Marks have been updated for CSE101",
  "deliveryMethod": "in-app",
  "priority": "medium"
}
```

---

## Step 7: Email Configuration (Optional)

### 7.1 Gmail Setup
For sending emails via Gmail:
1. Enable 2-factor authentication on your Gmail account
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in your `.env` file:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # 16-character app password
```

### 7.2 Alternative Email Services
To use a different email service, modify the `emailConfig` in `notification.controller.js`:
```javascript
const emailConfig = {
  service: 'your-service',  // 'gmail', 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
};
```

---

## Step 8: Rollback (If Needed)

If you need to rollback to v1.0:

### 8.1 Revert Database Changes
```javascript
// Remove new collections
db.attendances.drop()
db.notifications.drop()
db.users.drop()

// Revert student schema (optional)
db.students.updateMany(
  {},
  {
    $unset: {
      cgpa: "",
      status: "",
      registrationDate: "",
      parentContact: "",
      section: "",
      dob: ""
    }
  }
)
```

### 8.2 Revert Code Changes
- Restore original `src/models/Student.model.js`
- Restore original `src/models/Teacher.model.js`
- Restore original `package.json` dependencies
- Restore original frontend files from your backup

---

## Step 9: Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Database collections created
- [ ] Backend server starts without errors (`npm start`)
- [ ] Frontend development server starts (`npm run dev`)
- [ ] Can access admin dashboard (`/admin-dashboard`)
- [ ] Can access attendance page (`/attendance`)
- [ ] Can access analytics dashboard (`/analytics-dashboard`)
- [ ] Can view student profile (`/student/:id`)
- [ ] Navigation links display correctly
- [ ] API endpoints respond correctly
- [ ] Charts render properly on analytics pages

---

## Step 10: Performance Optimization (Recommended)

### 10.1 Add Database Indexes
```javascript
// Run these commands in MongoDB:
db.results.createIndex({ student: 1, semester: 1 })
db.results.createIndex({ subject: 1 })
db.subjects.createIndex({ teacher: 1 })
```

### 10.2 Optimize Queries
The controllers already use pagination and selective field selection. For better performance:
```javascript
// Limit results in list endpoints
GET /api/attendance/stats?limit=50
GET /api/notifications/:userId?limit=20
```

---

## Troubleshooting

### Issue: "Cannot find module 'pdfkit'"
**Solution:** Run `npm install pdfkit` in the backend directory

### Issue: "Nodemailer not working"
**Solution:** Check email credentials in `.env` file and ensure Gmail App Password is used

### Issue: "Attendance page not loading"
**Solution:** Check that routes are imported in `src/routes/index.js`

### Issue: "Charts not rendering"
**Solution:** Verify Recharts is installed: `npm list recharts`

### Issue: "Database connection error"
**Solution:** Ensure MongoDB is running and connection string is correct

---

## Support

If you encounter issues:
1. Check the error messages in console
2. Review the API endpoints in backend routes
3. Verify database connectivity
4. Check environment variable configuration
5. Refer to the FEATURES_IMPLEMENTED.md document

---

**Migration Complete!** 🎉

Your EduTrack system is now upgraded to v2.0 with all new features enabled.

For questions or issues, refer to the documentation or review the source code comments.
