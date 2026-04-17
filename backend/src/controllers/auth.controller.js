import Teacher from '../models/Teacher.model.js';
import generateToken from '../utils/generateToken.js';

// Register Teacher
export const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const teacher = new Teacher({ name, email, password, department });
    await teacher.save();

    const token = generateToken(teacher._id, teacher.role || 'teacher');

    res.status(201).json({
      success: true,
      message: 'Teacher registered successfully',
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        role: teacher.role || 'teacher',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login Teacher
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const teacher = await Teacher.findOne({ email }).select('+password');
    if (!teacher) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await teacher.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const role = teacher.role || 'teacher';
    const token = generateToken(teacher._id, role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        role,
      },
    });
  } catch (error) {
  console.error("🔥 REGISTER ERROR:", error); // 👈 ADD THIS
  res.status(500).json({ message: error.message });
}
};

// Get Teacher Profile
export const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher._id);

    res.status(200).json({
      success: true,
      teacher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
