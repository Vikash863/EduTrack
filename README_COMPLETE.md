# 🎓 EduTrack - College Management System

**Complete production-ready full-stack application for managing students, teachers, subjects, marks, and attendance.**

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)

---

## 📸 Features at a Glance

### ✅ Core Features
- **Authentication** - JWT-based secure login/registration
- **Role-Based Access** - Admin, Teacher, Student dashboards
- **Student Management** - CRUD operations with validation
- **Teacher Management** - Assign subjects and manage classes
- **Subject Management** - Create and manage courses
- **Marks & Results** - Enter, calculate, and track student marks
- **Attendance System** - Daily attendance marking with reports
- **CGPA Calculation** - Automatic grade point calculation
- **Analytics Dashboard** - Performance trends and statistics

### 🚀 Advanced Features
- **PDF Report Generation** - Download student transcripts
- **Email Notifications** - Automatic alerts for important updates
- **File Upload** - Profile pictures via Cloudinary
- **Search & Filter** - Find students by name, email, roll number
- **Data Export** - Export to CSV/Excel
- **Activity Logging** - Track all system activities
- **Pagination** - Handle large datasets efficiently
- **Responsive Design** - Mobile, tablet, and desktop friendly

---

## 🛠️ Technology Stack

### Frontend
```
✓ React 18.2.0        - UI library
✓ Vite 5.0            - Fast bundler
✓ Tailwind CSS 3.4    - Styling
✓ React Router 6.20   - Navigation
✓ Axios 1.15          - HTTP client
✓ Recharts 2.15       - Charts
✓ jsPDF 2.5           - PDF generation
✓ XLSX 0.18           - Excel export
✓ React Hot Toast 2.6 - Notifications
```

### Backend
```
✓ Node.js + Express 5 - Server framework
✓ MongoDB + Mongoose  - Database
✓ JWT                 - Authentication
✓ bcryptjs            - Password hashing
✓ Multer              - File upload
✓ Nodemailer          - Email service
✓ Cloudinary          - File hosting
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ ([Download](https://nodejs.org/))
- MongoDB ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- Git ([Download](https://git-scm.com/))

### 1️⃣ Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edutrack
JWT_SECRET=your_secret_key_min_32_characters_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
EOF

# Start development server
npm run dev
```

✅ Backend running on `http://localhost:5000`

### 2️⃣ Setup Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=EduTrack
EOF

# Start development server
npm run dev
```

✅ Frontend running on `http://localhost:5173`

### 3️⃣ Seed Database

```bash
cd backend
node scripts/seedData.js
```

This creates test data with:
- **Admin** - Full system access
- **Teachers** - Manage marks and attendance
- **Students** - View grades and attendance

### 4️⃣ Login & Explore

```
🔑 Test Credentials:
Email: rajesh.kumar@edutrack.com
Password: Teacher@123
```

Login at: http://localhost:5173/login

---

## 📁 Project Structure

```
EduTrack/
│
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API integration
│   │   ├── context/            # AuthContext
│   │   ├── routes/             # Protected routes
│   │   ├── utils/              # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                     # Node.js/Express API
│   ├── src/
│   │   ├── models/             # Database models (7 total)
│   │   ├── controllers/        # Request handlers
│   │   ├── routes/             # API routes
│   │   ├── middlewares/        # Auth, validation, error
│   │   ├── config/             # Database config
│   │   └── utils/              # Utilities
│   ├── scripts/
│   │   └── seedData.js         # Test data generator
│   ├── .env.example
│   └── package.json
│
├── Documentation/
│   ├── FULL_IMPLEMENTATION_GUIDE.md
│   ├── PRODUCTION_IMPLEMENTATION_GUIDE.md
│   ├── SETUP_ADVANCED_FEATURES_GUIDE.md
│   ├── API_REFERENCE.md
│   ├── README.md               # This file
│   └── QUICK_START.md
```

---

## 📊 API Overview

### 50+ Endpoints covering:

| Domain | Count | Examples |
|--------|-------|----------|
| Authentication | 3 | register, login, profile |
| Students | 6 | CRUD, search, bulk operations |
| Teachers | 5 | CRUD, assignments, reports |
| Subjects | 5 | CRUD, courses, credits |
| Marks/Results | 8 | Create, update, CGPA, transcript |
| Attendance | 6 | Mark, report, bulk mark |
| Analytics | 4 | Dashboard, stats, trends |
| Reports | 3 | PDF generation, exports |
| Notifications | 4 | Get, read, delete, send |

**Full documentation:** See [API_REFERENCE.md](API_REFERENCE.md)

---

## 🔑 Key Features Explained

### Authentication & Authorization
```javascript
// Automatic token management in frontend
const { token, user, role, isAuthenticated, login, logout } = useAuth();

// Role-based route protection
<RoleRoute allowedRoles={['admin']}>
  <AdminDashboard />
</RoleRoute>
```

### CRUD Operations with Validation
```javascript
// Student creation with automatic validation
POST /api/students
{
  name, email, rollNumber, branch,
  phoneNumber, dateOfBirth, ...
}
```

### Real-time Analytics
```
- Dashboard statistics
- Pass/Fail distribution
- Performance trends
- Branch-wise comparison
- Top performers ranking
```

### Report Generation
```
- Student transcripts (PDF)
- Attendance reports (PDF)
- Class performance (PDF)
- Excel exports
```

---

## 🔐 Security Features

✅ **JWT Authentication**
- 7-day token expiry
- Automatic refresh on login
- Secure token storage

✅ **Password Security**
- bcryptjs hashing (10 rounds)
- Minimum 6 character requirement
- Compare before granting access

✅ **Database Security**
- MongoDB indexing for performance
- Data validation on every request
- Input sanitization

✅ **API Security**
- CORS enabled
- Rate limiting ready
- Error handling without exposing details

---

## 📈 Performance Features

- **Database Indexing** - Faster queries
- **Pagination** - Handle 1000+ records efficiently
- **Caching** - Reduce database calls
- **Lazy Loading** - Fast page transitions
- **Optimized Queries** - Select only needed fields
- **Production Build** - Minified & gzipped assets

---

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process
kill -9 <PID>

# Restart backend
npm run dev
```

### Frontend shows CORS error?
```javascript
// Check backend CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### MongoDB connection fails?
```
1. Ensure MongoDB is running
2. Check connection string in .env
3. Verify IP whitelisting in MongoDB Atlas
4. Confirm database name is correct
```

### Login not working?
```bash
# Check if test data is seeded
node scripts/seedData.js

# Verify JWT_SECRET is set in .env
# Try with test credentials:
# Email: rajesh.kumar@edutrack.com
# Password: Teacher@123
```

---

## 📚 Documentation Map

| Document | Purpose |
|----------|---------|
| [FULL_IMPLEMENTATION_GUIDE.md](FULL_IMPLEMENTATION_GUIDE.md) | Complete system overview, checklist |
| [PRODUCTION_IMPLEMENTATION_GUIDE.md](PRODUCTION_IMPLEMENTATION_GUIDE.md) | Advanced components, deployment |
| [SETUP_ADVANCED_FEATURES_GUIDE.md](SETUP_ADVANCED_FEATURES_GUIDE.md) | Email, uploads, search, logging |
| [API_REFERENCE.md](API_REFERENCE.md) | Complete 50+ endpoint docs |
| [QUICK_START.md](QUICK_START.md) | Fast setup guide |

---

## 🚀 Deployment

### Deploy Backend
```bash
# Option 1: Render
- Connect GitHub repo
- Set env variables
- Auto-deploy on push

# Option 2: Railway
- Similar setup to Render
- Good free tier

# Option 3: Heroku
- Traditional platform
- Requires setup
```

### Deploy Frontend
```bash
# Vercel (Recommended)
npm install -g vercel
cd frontend
vercel

# Netlify
- Connect GitHub
- Auto-deploy on push
- Custom domain support
```

**Full deployment guide:** See [PRODUCTION_IMPLEMENTATION_GUIDE.md](PRODUCTION_IMPLEMENTATION_GUIDE.md)

---

## 📊 Database Models

### 1. **User Model**
- Fields: name, email, password, role, createdAt
- Unique: email
- Indexes: email, role

### 2. **Student Model**
- Fields: name, email, rollNumber, branch, cgpa, attendancePercentage
- Relations: Marks, Attendance
- Unique: email, rollNumber

### 3. **Teacher Model**
- Fields: name, email, department, qualifications, experience
- Relations: Subjects, Results
- Unique: email

### 4. **Subject Model**
- Fields: code, name, credits, semester, branch
- Relations: Teacher, Results
- Unique: code

### 5. **Result Model**
- Fields: studentId, subjectId, marks, grade, gpa
- Relations: Student, Subject
- Indexes: studentId, subjectId

### 6. **Attendance Model**
- Fields: studentId, subjectId, date, status
- Relations: Student, Subject
- Indexes: studentId, date

### 7. **Notification Model**
- Fields: userId, type, message, read, createdAt
- Indexes: userId, read

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under MIT License - see LICENSE file for details.

---

## 👨‍💻 Author

**Created:** April 18, 2026  
**Maintained By:** Development Team  
**Version:** 2.0.0 - Production Ready

---

## 📞 Support

For issues and questions:
- 📧 Email: support@edutrack.com
- 🐛 Report bugs on GitHub Issues
- 💡 Request features via Discussions

---

## 🎯 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Face recognition attendance
- [ ] AI-powered recommendations
- [ ] Live classes integration
- [ ] Parent portal
- [ ] Student assignment system
- [ ] Online exam system

---

## ✨ What You Get

✅ **Complete Backend** - 50+ production-ready API endpoints  
✅ **Complete Frontend** - React application with all pages  
✅ **Database Setup** - 7 fully configured models  
✅ **Authentication** - JWT + RBAC fully implemented  
✅ **Documentation** - 4 comprehensive guides  
✅ **Test Data** - Seed script with 26+ records  
✅ **Deployment Ready** - Production configuration included  
✅ **Responsive Design** - Mobile, tablet, desktop support  

---

## 🚀 Get Started Now!

```bash
# 1. Clone repository
git clone https://github.com/your-org/edutrack.git
cd edutrack

# 2. Setup backend
cd backend
npm install
npm run dev

# 3. Setup frontend (new terminal)
cd frontend
npm install
npm run dev

# 4. Login with test credentials
# Email: rajesh.kumar@edutrack.com
# Password: Teacher@123
```

**That's it!** Your complete college management system is running.

---

**Made with ❤️ by the EduTrack Team**

**Last Updated:** April 18, 2026  
**Status:** ✅ Production Ready
