# Quick Start Guide - EduTrack

## ⚡ 5-Minute Setup

### Step 1: Start Backend
```bash
cd backend
npm run dev
```
✅ Server runs on `http://localhost:5000`

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```
✅ App runs on `http://localhost:5173`

### Step 3: First Time Setup in Browser
1. Go to `http://localhost:5173`
2. Click "Register" button
3. Fill form:
   - **Name**: Dr. John Doe
   - **Email**: john@example.com
   - **Password**: password123
   - **Department**: CSE
4. Click Register ✅
5. You're logged in!

---

## 🎯 Quick Features to Try

### Add a Student
1. Click "Students" button on dashboard
2. Click "Add Student"
3. Fill form:
   - Roll Number: CSE001
   - Name: Raj Kumar
   - Email: raj@student.com
   - Semester: 1
   - Branch: CSE
   - Phone: 9876543210
4. Click "Save" ✅

### View Students
- Dashboard → Students
- Click "Edit" to modify
- Click "Delete" to remove
- Use filters (Semester, Branch)

### Add Results (for entering marks)
1. Dashboard → Results
2. Click "Add Result"
3. Select student & subject
4. Enter marks:
   - Sessional: 0-40
   - PUT: 0-20
   - Final: 0-40
5. Grade calculates automatically ✅

### View Analytics
- Dashboard shows top performers
- Check subject averages
- Track semester progress

---

## 📊 API Testing (Postman/Hoppscotch)

### Register Teacher
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Dr. John",
  "email": "john@example.com",
  "password": "password123",
  "department": "CSE"
}
```

### Get All Students
```
GET http://localhost:5000/api/students?semester=1&branch=CSE
```

### Add Result
```
POST http://localhost:5000/api/results
Headers: Authorization: Bearer <token>
Body:
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

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check `.env` file has `MONGO_URI`
- Verify MongoDB is running
- Check cluster is active in MongoDB Atlas

### "Token error" in frontend
- Clear localStorage: F12 → Application → Storage
- Log in again

### Port already in use
- Backend: Change PORT in .env
- Frontend: Vite uses different port automatically

### CORS Error
- Backend is running on 5000?
- Frontend API URL correct in `services/api.js`?

---

## 📁 Project Structure Quick Ref

```
EduTrack/
├── backend/
│   ├── src/
│   │   ├── models/          (Database schemas)
│   │   ├── controllers/      (Business logic)
│   │   ├── routes/           (API endpoints)
│   │   └── middlewares/      (Auth, errors)
│   └── .env                  (Config - MongoDB, JWT)
│
├── frontend/
│   ├── src/
│   │   ├── pages/           (Login, Register, Dashboard, etc)
│   │   ├── services/        (API calls)
│   │   └── App.jsx          (Routing)
│   └── .env.example         (API URL)
│
├── README.md                 (Full docs)
├── TESTING_GUIDE.md          (API testing steps)
└── DEPLOYMENT_GUIDE.md       (Production setup)
```

---

## ✅ What's Included

- ✅ User authentication (register/login)
- ✅ Student management (add, edit, delete, filter)
- ✅ Result entry (marks with auto-grade)
- ✅ Analytics (performance, averages, top performers)
- ✅ Responsive UI (works on mobile too!)
- ✅ Error handling
- ✅ Data validation
- ✅ Protected routes
- ✅ Database indexed for performance
- ✅ Production-ready code

---

## 🎓 Next Steps

1. **Explore API**: Test all endpoints in Postman
2. **Add Data**: Create students, subjects, results
3. **Check Analytics**: See grade distributions
4. **Deploy**: Follow DEPLOYMENT_GUIDE.md
5. **Customize**: Modify UI/colors in pages

---

## 📞 Quick Help

### Backend won't start?
```bash
npm install  # Reinstall packages
npm run dev  # Try again
```

### Frontend shows blank page?
```bash
npm install  # Reinstall packages
npm run dev  # Try again
```

### Can't log in?
- Did you register first? ✅
- Is backend running on 5000? ✅
- Check browser console (F12) for errors ✅

---

## 🚀 You're All Set!

Everything is configured and ready to use. Just follow the 3 steps above and start building!

**Happy Coding!** 🎉
