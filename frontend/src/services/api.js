/**
 * Comprehensive API Service for EduTrack
 * Handles all backend communication with interceptors and error handling
 */

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR - Add JWT Token
// ============================================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// RESPONSE INTERCEPTOR - Error Handling
// ============================================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error?.response?.data || error.message);
  }
);

// ============================================
// AUTHENTICATION APIs
// ============================================
export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
};

// ============================================
// STUDENT APIs
// ============================================
export const studentService = {
  create: (data) => API.post('/students', data),
  getAll: (params) => API.get('/students', { params }),
  getById: (id) => API.get(`/students/${id}`),
  update: (id, data) => API.put(`/students/${id}`, data),
  delete: (id) => API.delete(`/students/${id}`),
  search: (query) => API.get(`/students/search?q=${query}`),
  getByBranch: (branch) => API.get(`/students?branch=${branch}`),
};

// Legacy endpoint support
export const addStudent = (data) => API.post('/students', data);
export const getStudents = (params) => API.get('/students', { params });
export const getStudent = (id) => API.get(`/students/${id}`);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// ============================================
// TEACHER APIs
// ============================================
export const teacherService = {
  create: (data) => API.post('/teachers', data),
  getAll: (params) => API.get('/teachers', { params }),
  getById: (id) => API.get(`/teachers/${id}`),
  update: (id, data) => API.put(`/teachers/${id}`, data),
  delete: (id) => API.delete(`/teachers/${id}`),
};

// Legacy endpoint support
export const registerTeacher = (data) => API.post('/auth/register', data);
export const loginTeacher = (data) => API.post('/auth/login', data);
export const getTeacherProfile = () => API.get('/auth/profile');

// ============================================
// SUBJECT APIs
// ============================================
export const subjectService = {
  create: (data) => API.post('/subjects', data),
  getAll: (params) => API.get('/subjects', { params }),
  getById: (id) => API.get(`/subjects/${id}`),
  update: (id, data) => API.put(`/subjects/${id}`, data),
  delete: (id) => API.delete(`/subjects/${id}`),
};

// Legacy endpoint support
export const addSubject = (data) => API.post('/subjects', data);
export const getSubjects = (params) => API.get('/subjects', { params });
export const getSubject = (id) => API.get(`/subjects/${id}`);
export const updateSubject = (id, data) => API.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => API.delete(`/subjects/${id}`);

// ============================================
// RESULT APIs
// ============================================
export const resultService = {
  create: (data) => API.post('/results', data),
  getAll: (params) => API.get('/results', { params }),
  getById: (id) => API.get(`/results/${id}`),
  update: (id, data) => API.put(`/results/${id}`, data),
  delete: (id) => API.delete(`/results/${id}`),
  getByStudent: (studentId) => API.get(`/results?student=${studentId}`),
  calculateGPA: (studentId) => API.get(`/results/gpa/${studentId}`),
};

// Legacy endpoint support
export const addResult = (data) => API.post('/results', data);
export const getResults = (params) => API.get('/results', { params });
export const getResult = (id) => API.get(`/results/${id}`);
export const updateResult = (id, data) => API.put(`/results/${id}`, data);
export const deleteResult = (id) => API.delete(`/results/${id}`);

// ============================================
// ATTENDANCE APIs
// ============================================
export const attendanceService = {
  mark: (data) => API.post('/attendance/add', data),
  markBulk: (data) => API.post('/attendance/bulk-add', data),
  getAll: (params) => API.get('/attendance', { params }),
  getByStudent: (studentId) => API.get(`/attendance/student/${studentId}`, { params: {} }),
  getBySubject: (subjectId, params) => API.get(`/attendance/subject/${subjectId}`, { params }),
  update: (id, data) => API.put(`/attendance/update/${id}`, data),
  delete: (id) => API.delete(`/attendance/${id}`),
  getStats: (params) => API.get('/attendance/stats', { params }),
};

// Legacy endpoint support
export const addAttendance = (data) => API.post('/attendance/add', data);
export const getStudentAttendance = (studentId, params) =>
  API.get(`/attendance/student/${studentId}`, { params });
export const getSubjectAttendance = (subjectId, params) =>
  API.get(`/attendance/subject/${subjectId}`, { params });
export const updateAttendance = (id, data) =>
  API.put(`/attendance/update/${id}`, data);
export const bulkAddAttendance = (data) =>
  API.post('/attendance/bulk-add', data);
export const getAttendanceStats = (params) =>
  API.get('/attendance/stats', { params });

// ============================================
// ANALYTICS APIs
// ============================================
export const analyticsService = {
  getDashboard: () => API.get('/analytics/dashboard'),
  getPassFail: () => API.get('/analytics/pass-fail'),
  getBranchStats: () => API.get('/analytics/branch-stats'),
  getTrends: () => API.get('/analytics/trends'),
  getTopPerformers: (params) => API.get('/analytics/top-performers', { params }),
};

// Legacy endpoint support
export const getDashboardAnalytics = (params) =>
  API.get('/analytics/dashboard', { params });
export const getPassFailStats = (params) =>
  API.get('/analytics/pass-fail', { params });
export const getStudentStatsByBranch = (params) =>
  API.get('/analytics/branch-stats', { params });
export const getStudentPerformance = (studentId) =>
  API.get(`/analytics/dashboard`, { params: { student: studentId } });
export const getTopPerformers = (params) =>
  API.get('/analytics/top-performers', { params });
export const getSubjectAverages = (params) =>
  API.get('/analytics/subject-averages', { params });

// ============================================
// REPORT APIs
// ============================================
export const reportService = {
  getStudentReport: (studentId) => API.get(`/reports/student/${studentId}`),
  generatePDF: (studentId) => API.get(`/reports/generate?studentId=${studentId}`, { responseType: 'blob' }),
};

// Legacy endpoint support
export const generateStudentReport = (studentId) =>
  API.get(`/reports/student/${studentId}`, { responseType: 'blob' });
export const generateTranscript = (studentId) =>
  API.get(`/reports/generate`, { params: { studentId }, responseType: 'blob' });

// ============================================
// NOTIFICATION APIs
// ============================================
export const notificationService = {
  send: (data) => API.post('/notifications/send', data),
  getAll: () => API.get('/notifications'),
  getById: (id) => API.get(`/notifications/${id}`),
  markAsRead: (id) => API.put(`/notifications/${id}/read`, {}),
  delete: (id) => API.delete(`/notifications/${id}`),
};

// Legacy endpoint support
export const sendNotification = (data) => API.post('/notifications/send', data);
export const markNotificationAsRead = (id) =>
  API.put(`/notifications/${id}/read`);
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/**
 * Get stored user data
 */
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * Get user role
 */
export const getUserRole = () => {
  const user = getStoredUser();
  return user?.role || null;
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

export default API;
