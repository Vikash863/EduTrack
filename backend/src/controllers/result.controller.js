import Result from '../models/Result.model.js';
import Student from '../models/Student.model.js';

// Add Result
export const addResult = async (req, res) => {
  try {
    const { student, subject, semester, sessionalMarks, putMarks, finalMarks } = req.body;

    if (!student || !subject || !semester || sessionalMarks === undefined || putMarks === undefined || finalMarks === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingResult = await Result.findOne({ student, subject, semester });
    if (existingResult) {
      return res.status(409).json({ message: 'Result already exists for this student-subject' });
    }

    const result = new Result({
      student,
      subject,
      semester,
      sessionalMarks,
      putMarks,
      finalMarks,
    });

    await result.save();

    // Update student GPA
    const allResults = await Result.find({ student });
    const totalGradePoints = allResults.reduce((sum, r) => sum + r.gradePoint, 0);
    const gpa = (totalGradePoints / allResults.length).toFixed(2);

    await Student.findByIdAndUpdate(student, { gpa });

    res.status(201).json({
      success: true,
      message: 'Result added successfully',
      result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Results with Filters
export const getResults = async (req, res) => {
  try {
    const { student, subject, semester } = req.query;
    const filter = {};

    if (student) filter.student = student;
    if (subject) filter.subject = subject;
    if (semester) filter.semester = semester;

    const results = await Result.find(filter)
      .populate('student', 'name rollNumber')
      .populate('subject', 'subjectCode subjectName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Result
export const getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('student', 'name rollNumber email')
      .populate('subject', 'subjectCode subjectName credits');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Result
export const updateResult = async (req, res) => {
  try {
    const { sessionalMarks, putMarks, finalMarks } = req.body;

    const result = await Result.findByIdAndUpdate(
      req.params.id,
      { sessionalMarks, putMarks, finalMarks },
      { new: true, runValidators: true }
    )
      .populate('student', 'name rollNumber')
      .populate('subject', 'subjectCode subjectName');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Update student GPA
    const allResults = await Result.find({ student: result.student._id });
    const totalGradePoints = allResults.reduce((sum, r) => sum + r.gradePoint, 0);
    const gpa = (totalGradePoints / allResults.length).toFixed(2);

    await Student.findByIdAndUpdate(result.student._id, { gpa });

    res.status(200).json({
      success: true,
      message: 'Result updated successfully',
      result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Result
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Update student GPA
    const allResults = await Result.find({ student: result.student });
    if (allResults.length > 0) {
      const totalGradePoints = allResults.reduce((sum, r) => sum + r.gradePoint, 0);
      const gpa = (totalGradePoints / allResults.length).toFixed(2);
      await Student.findByIdAndUpdate(result.student, { gpa });
    } else {
      await Student.findByIdAndUpdate(result.student, { gpa: 0 });
    }

    res.status(200).json({
      success: true,
      message: 'Result deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
