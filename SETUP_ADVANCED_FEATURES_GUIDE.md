# 🛠️ EduTrack - Setup & Advanced Features Guide

---

## 📋 Table of Contents
1. [Initial Setup](#initial-setup)
2. [Advanced Features](#advanced-features)
3. [Troubleshooting](#troubleshooting)
4. [Performance Optimization](#performance-optimization)
5. [Security Best Practices](#security-best-practices)
6. [API Documentation](#api-documentation)

---

## Initial Setup

### Prerequisites
- Node.js v16+ (verify with `node -v`)
- MongoDB (local or Atlas cloud)
- npm or yarn package manager
- Git for version control

### Step-by-Step Installation

**1. Clone and Setup Backend**
```bash
cd backend
npm install

# Create .env file with:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edutrack
JWT_SECRET=dev_secret_key_min_32_chars_change_in_prod
JWT_EXPIRE=7d

# Seed database with test data
node scripts/seedData.js

# Start development server
npm run dev
```

**2. Setup Frontend**
```bash
cd frontend
npm install

# Create .env file with:
VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

**3. Verify Installation**
- Backend: http://localhost:5000/api/health (should return 200)
- Frontend: http://localhost:5173
- Login with: rajesh.kumar@edutrack.com / Teacher@123

---

## Advanced Features Implementation

### 1. Email Notifications

**Backend Setup (src/utils/emailService.js)**
```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendMarksNotification = async (studentEmail, marks, subject) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: studentEmail,
    subject: `Marks Updated for ${subject}`,
    html: `
      <h2>Your marks have been updated!</h2>
      <p>Subject: ${subject}</p>
      <p>Marks: ${marks}</p>
      <p>Login to EduTrack to view detailed results.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendAttendanceAlert = async (studentEmail, percentage) => {
  if (percentage < 75) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: studentEmail,
      subject: 'Attendance Alert',
      html: `
        <h2>⚠️ Low Attendance Alert</h2>
        <p>Your current attendance is ${percentage}%</p>
        <p>Minimum required: 75%</p>
        <p>Please attend classes regularly.</p>
      `,
    };
    return transporter.sendMail(mailOptions);
  }
};
```

**Usage in Controllers**
```javascript
import { sendMarksNotification } from '../utils/emailService.js';

// In results.controller.js
export const createResult = async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();

    // Send notification email
    await sendMarksNotification(
      result.studentId.email,
      result.marks,
      result.subjectId.name
    );

    res.status(201).json({
      success: true,
      data: result,
      message: 'Result added and notification sent',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
```

### 2. File Upload with Cloudinary

**Frontend Component (src/components/FileUpload.jsx)**
```jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const FileUpload = ({ onFileUpload, accept = 'image/*' }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Upload to backend which handles Cloudinary
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('File uploaded successfully');
      onFileUpload(response.data.url);
    } catch (error) {
      toast.error('File upload failed');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-blue-400 p-6 rounded-lg">
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className="cursor-pointer text-center"
      >
        <p className="text-gray-600">
          {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
        </p>
      </label>
    </div>
  );
};
```

**Backend Upload Route (src/routes/upload.routes.js)**
```javascript
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { verifyJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/upload', verifyJWT, upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'edutrack/',
      },
      (error, result) => {
        if (error) throw error;
        res.json({ success: true, url: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
```

### 3. Search & Filter Implementation

**Frontend Hook (src/hooks/useSearch.js)**
```javascript
import { useState, useCallback, useMemo } from 'react';

export const useSearch = (items, searchFields) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const results = useMemo(() => {
    let filtered = items;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        searchFields.some((field) =>
          String(item[field] || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item) => item[key] === value);
      }
    });

    return filtered;
  }, [items, searchTerm, filters]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    results,
  };
};
```

**Usage in Component**
```jsx
function StudentList() {
  const [students, setStudents] = useState([]);
  const { searchTerm, setSearchTerm, filters, updateFilter, results } = 
    useSearch(students, ['name', 'email', 'rollNumber']);

  return (
    <div>
      <input
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select onChange={(e) => updateFilter('branch', e.target.value)}>
        <option value="">All Branches</option>
        <option value="CS">Computer Science</option>
        <option value="EC">Electronics</option>
      </select>
      <DataTable data={results} columns={columns} />
    </div>
  );
}
```

### 4. Activity Logging

**Backend Middleware (src/middlewares/loggingMiddleware.js)**
```javascript
import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'logs', 'activity.log');

export const logActivity = async (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      user: req.user?.id || 'anonymous',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      data: data,
    };

    // Log to file
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

    return originalJson.call(this, data);
  };

  next();
};
```

---

## Troubleshooting

### Common Issues & Solutions

**Issue 1: Port Already in Use**
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

**Issue 2: MongoDB Connection Error**
```javascript
// Check connection string
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/edutrack?retryWrites=true

// Common issues:
// 1. Wrong password
// 2. IP not whitelisted in MongoDB Atlas
// 3. Database name doesn't exist (will be created)
```

**Issue 3: CORS Errors**
```javascript
// Add to backend server setup
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

**Issue 4: JWT Token Expired**
```javascript
// Frontend handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Performance Optimization

### Database Indexing
```javascript
// models/Student.model.js
studentSchema.index({ email: 1 }, { unique: true });
studentSchema.index({ rollNumber: 1 }, { unique: true });
studentSchema.index({ branch: 1 });

// models/Result.model.js
resultSchema.index({ studentId: 1, semester: 1 });
resultSchema.index({ studentId: 1, subjectId: 1 });
```

### API Response Pagination
```javascript
export const getStudents = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const students = await Student.find()
    .skip(skip)
    .limit(limit);

  const total = await Student.countDocuments();

  res.json({
    data: students,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};
```

### Frontend Caching
```javascript
// services/api.js
const cache = new Map();

export const cachedGet = async (url, cacheTime = 5 * 60 * 1000) => {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.time < cacheTime) {
    return cached.data;
  }

  const response = await API.get(url);
  cache.set(url, { data: response.data, time: Date.now() });
  return response.data;
};
```

---

## Security Best Practices

### Password Hashing
```javascript
// Already implemented in auth.controller.js
import bcryptjs from 'bcryptjs';

const saltRounds = 10;
const hashedPassword = await bcryptjs.hash(password, saltRounds);
```

### Input Validation
```javascript
import { body, validationResult } from 'express-validator';

export const validateStudent = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
```

### Environment Variables
- Never commit .env files
- Use `.env.example` template
- Rotate secrets regularly
- Use strong JWT secret (32+ characters)

---

## API Documentation

### Authentication Endpoints
```
POST /api/auth/register
- Input: { name, email, password, role }
- Output: { token, user }

POST /api/auth/login
- Input: { email, password }
- Output: { token, user }

GET /api/auth/profile
- Headers: Authorization: Bearer <token>
- Output: { user }
```

### CRUD Endpoints Pattern
```
GET /api/students
- Query: ?page=1&limit=10&search=name

GET /api/students/:id
- Output: { student }

POST /api/students
- Headers: Authorization: Bearer <token>
- Input: { student data }

PUT /api/students/:id
- Input: { updated data }

DELETE /api/students/:id
```

---

## Quick Commands Reference

```bash
# Backend commands
npm run dev              # Start development server
npm run build            # Build for production
npm test                 # Run tests
node scripts/seedData.js # Seed database

# Frontend commands
npm run dev              # Start development server
npm run build            # Build production bundle
npm run preview          # Preview production build
npm run lint             # Check code quality

# Git commands
git clone <repo>         # Clone repository
git commit -am "msg"     # Commit changes
git push origin main     # Push to main branch
```

---

**Last Updated:** April 18, 2026  
**Status:** Production Ready
