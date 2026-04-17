// import Teacher from "../models/Teacher.model.js";
// import generateToken from "../utils/generateToken.js";

// // Register Teacher
// export const registerTeacher = async (req, res) => {
//   try {
//     const { name, email, password, department } = req.body;

//     if (!name || !email || !password || !department) {
//       return res.status(400).json({ message: "Please fill all fields" });
//     }

//     const existingTeacher = await Teacher.findOne({ email });
//     if (existingTeacher) {
//       return res.status(409).json({ message: "Email already exists" });
//     }

//     const teacher = await Teacher.create({
//       name,
//       email,
//       password,
//       department,
//     });

//     const token = generateToken(teacher._id);

//     res.status(201).json({
//       success: true,
//       message: "Registered successfully",
//       token,
//       teacher,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Login Teacher
// export const loginTeacher = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const teacher = await Teacher.findOne({ email }).select("+password");

//     if (!teacher) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await teacher.comparePassword(password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = generateToken(teacher._id);

//     res.status(200).json({
//       success: true,
//       token,
//       teacher,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };





import Teacher from '../models/Teacher.model.js';
import generateToken from '../utils/generateToken.js';

// ✅ Register
export const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const teacher = await Teacher.create({ name, email, password, department });
    const token = generateToken(teacher._id);
    const teacherData = teacher.toObject();
    delete teacherData.password;

    res.status(201).json({ success: true, token, teacher: teacherData });
  } catch (error) {
    console.error('❌ Teacher registration error:', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

// ✅ Login
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email }).select('+password');

    if (!teacher || !(await teacher.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(teacher._id);
    const teacherData = teacher.toObject();
    delete teacherData.password;

    res.json({ success: true, token, teacher: teacherData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Profile
export const getTeacherProfile = async (req, res) => {
  res.json({ success: true, teacher: req.teacher });
};