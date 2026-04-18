import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Admin only
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admins can access this route',
    });
  }
  next();
};

// Teacher or Admin
export const teacherOrAdmin = (req, res, next) => {
  if (!['teacher', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: 'Only teachers or admins can access this route',
    });
  }
  next();
};

// Student or Admin
export const studentOrAdmin = (req, res, next) => {
  if (!['student', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: 'Only students or admins can access this route',
    });
  }
  next();
};
