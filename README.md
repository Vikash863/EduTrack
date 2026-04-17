# EduTrack - Student Result Management & Analysis System

A production-ready MERN stack application for managing student results, analyzing performance, and tracking academic progress.

## 🚀 Features

- **Teacher Authentication**: Secure register/login with JWT
- **Student Management**: Add, update, delete students with filters by semester & branch
- **Subject Management**: Manage subjects per semester with teacher assignments
- **Result Entry**: Enter marks (Sessional, PUT, Final) with auto-grade calculation
- **Analytics**: 
  - Student-wise performance tracking
  - Subject-wise averages
  - Semester comparison
  - Top performers leaderboard
- **Responsive UI**: Tailwind CSS with charts using Recharts
- **Protected Routes**: JWT-based access control

## 🛠️ Tech Stack

**Backend**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication with bcryptjs
- Morgan for logging

**Frontend**
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Recharts for data visualization

## 📦 Installation

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## ⚙️ Environment Variables

Create `.env` file in the backend directory:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

## 🚀 Running the Application

### Start Backend
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

### Start Frontend
```bash
cd frontend
npm run dev
```
Application runs on `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register teacher
- `POST /api/auth/login` - Login teacher
- `GET /api/auth/profile` - Get profile (protected)

### Students
- `POST /api/students` - Add student (protected)
- `GET /api/students` - Get all students (with filters)
- `GET /api/students/:id` - Get single student
- `PUT /api/students/:id` - Update student (protected)
- `DELETE /api/students/:id` - Delete student (protected)

### Subjects
- `POST /api/subjects` - Add subject (protected)
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get single subject
- `PUT /api/subjects/:id` - Update subject (protected)
- `DELETE /api/subjects/:id` - Delete subject (protected)

### Results
- `POST /api/results` - Add result (protected)
- `GET /api/results` - Get all results
- `GET /api/results/:id` - Get single result
- `PUT /api/results/:id` - Update result (protected)
- `DELETE /api/results/:id` - Delete result (protected)

### Analytics
- `GET /api/analytics/student/:studentId` - Student performance
- `GET /api/analytics/subject-averages` - Subject averages
- `GET /api/analytics/semester/:studentId` - Semester comparison
- `GET /api/analytics/top-performers` - Top performers list

## 🧪 Testing with Postman/Hoppscotch

1. Register a teacher first
2. Use the returned token in Authorization header: `Bearer <token>`
3. Test all endpoints with proper request bodies

## 📋 Project Structure

```
EduTrack/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/db.js
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── utils/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- CORS enabled
- Input validation

## 📦 Deployment

**Backend**: Ready for Render, Railway, or Heroku
**Frontend**: Ready for Vercel, Netlify, or GitHub Pages

## 📝 License

MIT License - Feel free to use this project

## 👨‍💻 Author

EduTrack Team
