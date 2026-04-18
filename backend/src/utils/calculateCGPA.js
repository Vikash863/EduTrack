import Result from '../models/Result.model.js';
import Subject from '../models/Subject.model.js';

// Calculate CGPA for a student
export const calculateCGPA = async (studentId) => {
  try {
    const results = await Result.find({ student: studentId });

    if (results.length === 0) {
      return 0;
    }

    let totalCredits = 0;
    let totalGradePoints = 0;

    for (const result of results) {
      const subject = await Subject.findById(result.subject);
      if (subject) {
        totalCredits += subject.credits;
        totalGradePoints += result.gradePoint * subject.credits;
      }
    }

    const cgpa = (totalGradePoints / totalCredits).toFixed(2);
    return parseFloat(cgpa);
  } catch (error) {
    console.error('Error calculating CGPA:', error);
    return 0;
  }
};

// Calculate GPA for a specific semester
export const calculateSemesterGPA = async (studentId, semester) => {
  try {
    const results = await Result.find({ student: studentId, semester });

    if (results.length === 0) {
      return 0;
    }

    let totalCredits = 0;
    let totalGradePoints = 0;

    for (const result of results) {
      const subject = await Subject.findById(result.subject);
      if (subject) {
        totalCredits += subject.credits;
        totalGradePoints += result.gradePoint * subject.credits;
      }
    }

    const gpa = (totalGradePoints / totalCredits).toFixed(2);
    return parseFloat(gpa);
  } catch (error) {
    console.error('Error calculating semester GPA:', error);
    return 0;
  }
};

// Update student CGPA and GPA
export const updateStudentGPA = async (studentId) => {
  try {
    const cgpa = await calculateCGPA(studentId);
    const currentSemester = await Result.findOne({ student: studentId }).sort({ semester: -1 });

    const Student = (await import('../models/Student.model.js')).default;
    const updateData = { cgpa };

    if (currentSemester) {
      const gpa = await calculateSemesterGPA(studentId, currentSemester.semester);
      updateData.gpa = gpa;
    }

    await Student.findByIdAndUpdate(studentId, updateData);
    return { cgpa, gpa: updateData.gpa || 0 };
  } catch (error) {
    console.error('Error updating student GPA:', error);
    return null;
  }
};

// Get all semester GPAs for a student
export const getAllSemesterGPAs = async (studentId) => {
  try {
    const results = await Result.find({ student: studentId }).sort({ semester: 1 });

    if (results.length === 0) {
      return [];
    }

    const semesters = [...new Set(results.map((r) => r.semester))];
    const semesterGPAs = [];

    for (const semester of semesters) {
      const gpa = await calculateSemesterGPA(studentId, semester);
      semesterGPAs.push({ semester, gpa });
    }

    return semesterGPAs;
  } catch (error) {
    console.error('Error getting semester GPAs:', error);
    return [];
  }
};
