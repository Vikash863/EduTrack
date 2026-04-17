import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('teacher');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('teacher');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const registerTeacher = (data) => API.post('/teachers/register', data);
export const loginTeacher = (data) => API.post('/teachers/login', data);
export const getTeacherProfile = () => API.get('/teachers/profile');
// Student APIs
export const addStudent = (data) => API.post('/students', data);
export const getStudents = (params) => API.get('/students', { params });
export const getStudent = (id) => API.get(`/students/${id}`);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// Subject APIs
export const addSubject = (data) => API.post('/subjects', data);
export const getSubjects = (params) => API.get('/subjects', { params });
export const getSubject = (id) => API.get(`/subjects/${id}`);
export const updateSubject = (id, data) => API.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => API.delete(`/subjects/${id}`);

// Result APIs
export const addResult = (data) => API.post('/results', data);
export const getResults = (params) => API.get('/results', { params });
export const getResult = (id) => API.get(`/results/${id}`);
export const updateResult = (id, data) => API.put(`/results/${id}`, data);
export const deleteResult = (id) => API.delete(`/results/${id}`);

// Analytics APIs
export const getStudentPerformance = (studentId) =>
  API.get(`/analytics/student/${studentId}`);
export const getSubjectAverages = (params) =>
  API.get('/analytics/subject-averages', { params });
export const getSemesterComparison = (studentId) =>
  API.get(`/analytics/semester/${studentId}`);
export const getTopPerformers = (params) =>
  API.get('/analytics/top-performers', { params });

export default API;
