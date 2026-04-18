/**
 * Input Validation Middleware
 * Provides comprehensive validation patterns for API requests
 */

// ============================================
// FIELD VALIDATION UTILITIES
// ============================================

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (10+ digits)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(phone?.toString().replace(/\D/g, '') || '');
};

/**
 * Validate marks (0-100)
 */
export const isValidMarks = (marks) => {
  return marks >= 0 && marks <= 100;
};

/**
 * Validate semester (1-8)
 */
export const isValidSemester = (semester) => {
  return Number.isInteger(semester) && semester >= 1 && semester <= 8;
};

/**
 * Validate string length
 */
export const isValidLength = (str, min = 3, max = 100) => {
  return typeof str === 'string' && str.trim().length >= min && str.trim().length <= max;
};

/**
 * Validate roll number format
 */
export const isValidRollNumber = (rollNumber) => {
  return typeof rollNumber === 'string' && rollNumber.trim().length >= 4 && rollNumber.trim().length <= 20;
};

// ============================================
// VALIDATION MIDDLEWARE FUNCTIONS
// ============================================

/**
 * Validate Student Creation/Update
 */
export const validateStudent = (req, res, next) => {
  const { rollNumber, name, email, semester, branch, phone, address, section } = req.body;
  const errors = [];

  // Check required fields
  if (!rollNumber) errors.push('Roll number is required');
  if (!name) errors.push('Name is required');
  if (!email) errors.push('Email is required');
  if (semester === undefined) errors.push('Semester is required');
  if (!branch) errors.push('Branch is required');
  if (!phone) errors.push('Phone is required');
  if (!section) errors.push('Section is required');

  // Validate field formats
  if (rollNumber && !isValidRollNumber(rollNumber)) {
    errors.push('Roll number must be 4-20 characters');
  }
  if (name && !isValidLength(name, 3, 100)) {
    errors.push('Name must be 3-100 characters');
  }
  if (email && !isValidEmail(email)) {
    errors.push('Invalid email format');
  }
  if (semester && !isValidSemester(semester)) {
    errors.push('Semester must be between 1 and 8');
  }
  if (branch && !isValidLength(branch, 2, 50)) {
    errors.push('Branch must be 2-50 characters');
  }
  if (phone && !isValidPhone(phone)) {
    errors.push('Phone must contain at least 10 digits');
  }
  if (address && !isValidLength(address, 5, 200)) {
    errors.push('Address must be 5-200 characters');
  }
  if (section && !isValidLength(section, 1, 10)) {
    errors.push('Section must be 1-10 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate Teacher Creation/Update
 */
export const validateTeacher = (req, res, next) => {
  const { name, email, password, department, phone } = req.body;
  const errors = [];

  // Check required fields
  if (!name) errors.push('Name is required');
  if (!email) errors.push('Email is required');
  if (req.method === 'POST' && !password) errors.push('Password is required');
  if (!department) errors.push('Department is required');

  // Validate field formats
  if (name && !isValidLength(name, 3, 100)) {
    errors.push('Name must be 3-100 characters');
  }
  if (email && !isValidEmail(email)) {
    errors.push('Invalid email format');
  }
  if (password && !isValidLength(password, 6, 50)) {
    errors.push('Password must be 6-50 characters');
  }
  if (department && !isValidLength(department, 2, 100)) {
    errors.push('Department must be 2-100 characters');
  }
  if (phone && !isValidPhone(phone)) {
    errors.push('Phone must contain at least 10 digits');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate Result Creation/Update
 */
export const validateResult = (req, res, next) => {
  const { student, subject, semester, sessionalMarks, putMarks, finalMarks } = req.body;
  const errors = [];

  // Check required fields
  if (!student) errors.push('Student ID is required');
  if (!subject) errors.push('Subject ID is required');
  if (semester === undefined) errors.push('Semester is required');
  if (sessionalMarks === undefined) errors.push('Sessional marks are required');
  if (putMarks === undefined) errors.push('PUT marks are required');
  if (finalMarks === undefined) errors.push('Final marks are required');

  // Validate marks
  if (sessionalMarks !== undefined && !isValidMarks(sessionalMarks)) {
    errors.push('Sessional marks must be between 0 and 100');
  }
  if (putMarks !== undefined && !isValidMarks(putMarks)) {
    errors.push('PUT marks must be between 0 and 100');
  }
  if (finalMarks !== undefined && !isValidMarks(finalMarks)) {
    errors.push('Final marks must be between 0 and 100');
  }
  if (semester && !isValidSemester(semester)) {
    errors.push('Semester must be between 1 and 8');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate Attendance Record
 */
export const validateAttendance = (req, res, next) => {
  const { student, subject, date, status, remarks } = req.body;
  const errors = [];

  // Check required fields
  if (!student) errors.push('Student ID is required');
  if (!subject) errors.push('Subject ID is required');
  if (!date) errors.push('Date is required');
  if (!status) errors.push('Status is required');

  // Validate status
  const validStatuses = ['present', 'absent', 'leave'];
  if (status && !validStatuses.includes(status.toLowerCase())) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate date
  if (date) {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      errors.push('Invalid date format');
    }
  }

  // Validate remarks
  if (remarks && !isValidLength(remarks, 0, 200)) {
    errors.push('Remarks must be 0-200 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate Auth Credentials
 */
export const validateAuthCredentials = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  if (email && !isValidEmail(email)) {
    errors.push('Invalid email format');
  }
  if (password && password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate MongoDB ObjectId
 */
export const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  next();
};

/**
 * Validate Query Parameters
 */
export const validateQueryParams = (req, res, next) => {
  const { semester, branch, page, limit } = req.query;
  const errors = [];

  if (semester && !isValidSemester(parseInt(semester))) {
    errors.push('Invalid semester in query');
  }
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    errors.push('Page must be a positive number');
  }
  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    errors.push('Limit must be between 1 and 100');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid query parameters',
      errors
    });
  }

  next();
};

/**
 * Sanitize Input - Remove potential XSS attacks
 */
export const sanitizeInput = (req, res, next) => {
  const sanitize = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim();
  };

  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitize(req.body[key]);
      }
    });
  }

  // Sanitize query
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitize(req.query[key]);
      }
    });
  }

  next();
};

export default {
  validateStudent,
  validateTeacher,
  validateResult,
  validateAttendance,
  validateAuthCredentials,
  validateObjectId,
  validateQueryParams,
  sanitizeInput
};
