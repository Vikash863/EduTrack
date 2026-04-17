// import jwt from 'jsonwebtoken';
// import Teacher from '../models/Teacher.model.js';

// const auth = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.teacher = await Teacher.findById(decoded.id);

//     if (!req.teacher) {
//       return res.status(404).json({ message: 'Teacher not found' });
//     }

//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid token', error: error.message });
//   }
// };

// export default auth;



import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.model.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const teacher = await Teacher.findById(decoded.id).select("-password");

    if (!teacher) {
      return res.status(401).json({ message: "User not found" });
    }

    req.teacher = teacher;

    next(); // ✅ MUST
  } catch (error) {
    console.error("AUTH ERROR:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;