import Student from '../models/Student.model.js';

// Add Student
export const addStudent = async (req, res) => {
  try {
    const { rollNumber, name, email, semester, branch, phone, address } = req.body;

    if (!rollNumber || !name || !email || !semester || !branch || !phone || !section) {
      return res.status(400).json({ message: 'Please provide all required fields (including section)' });
    }

    const existingStudent = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (existingStudent) {
      return res.status(409).json({ message: 'Student already exists' });
    }

    const student = new Student({
      rollNumber,
      name,
      email,
      semester,
      branch,
      phone,
      address,
      section,
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Students with Filters
export const getStudents = async (req, res) => {
  try {
    const { semester, branch } = req.query;
    const filter = {};

    if (semester) filter.semester = semester;
    if (branch) filter.branch = branch;

    const students = await Student.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Student
export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Student
export const updateStudent = async (req, res) => {
  try {
    const { name, email, semester, branch, phone, address, gpa } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        semester,
        branch,
        phone,
        address,
        gpa,
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
