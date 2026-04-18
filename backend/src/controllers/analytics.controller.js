import Result from '../models/Result.model.js';
import Student from '../models/Student.model.js';
import Subject from '../models/Subject.model.js';
import Attendance from '../models/Attendance.model.js';
import { calculateCGPA, calculateSemesterGPA } from '../utils/calculateCGPA.js';

// Student-wise Performance
export const getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const results = await Result.find({ student: studentId })
      .populate('student', 'name rollNumber')
      .populate('subject', 'subjectCode subjectName credits');

    if (results.length === 0) {
      return res.status(404).json({ message: 'No results found for this student' });
    }

    const avgMarks = (results.reduce((sum, r) => sum + r.totalMarks, 0) / results.length).toFixed(2);
    const gradeDistribution = results.reduce((acc, r) => {
      acc[r.grade] = (acc[r.grade] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      student: results[0].student,
      totalSubjects: results.length,
      avgMarks,
      gradeDistribution,
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Subject-wise Averages
export const getSubjectAverages = async (req, res) => {
  try {
    const { semester, branch } = req.query;
    const filter = {};

    if (semester) filter.semester = semester;
    if (branch) filter.branch = branch;

    const subjects = await Subject.find(filter);
    const subjectAverages = [];

    for (const subject of subjects) {
      const results = await Result.find({ subject: subject._id });

      if (results.length > 0) {
        const avgMarks = (results.reduce((sum, r) => sum + r.totalMarks, 0) / results.length).toFixed(2);
        const passCount = results.filter((r) => r.totalMarks >= 40).length;
        const passPercentage = ((passCount / results.length) * 100).toFixed(2);

        subjectAverages.push({
          subject: subject.subjectCode,
          subjectName: subject.subjectName,
          avgMarks,
          passPercentage,
          totalStudents: results.length,
        });
      }
    }

    res.status(200).json({
      success: true,
      count: subjectAverages.length,
      subjectAverages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Semester Comparison
export const getSemesterComparison = async (req, res) => {
  try {
    const { studentId } = req.params;

    const results = await Result.find({ student: studentId }).sort({ semester: 1 });

    if (results.length === 0) {
      return res.status(404).json({ message: 'No results found for this student' });
    }

    const semesterData = {};
    results.forEach((result) => {
      if (!semesterData[result.semester]) {
        semesterData[result.semester] = { marks: [], grades: [] };
      }
      semesterData[result.semester].marks.push(result.totalMarks);
      semesterData[result.semester].grades.push(result.grade);
    });

    const comparison = Object.entries(semesterData).map(([semester, data]) => ({
      semester: parseInt(semester),
      avgMarks: (data.marks.reduce((a, b) => a + b, 0) / data.marks.length).toFixed(2),
      totalSubjects: data.marks.length,
    }));

    res.status(200).json({
      success: true,
      comparison,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Top Performers
export const getTopPerformers = async (req, res) => {
  try {
    const { semester, limit = 10 } = req.query;
    const filter = {};

    if (semester) filter.semester = semester;

    const results = await Result.find(filter)
      .populate('student', 'name rollNumber branch')
      .sort({ totalMarks: -1 })
      .limit(parseInt(limit));

    const topPerformers = [];
    const seenStudents = new Set();

    for (const result of results) {
      if (!seenStudents.has(result.student._id.toString())) {
        const studentResults = await Result.find({ student: result.student._id });
        const avgGpa = (
          studentResults.reduce((sum, r) => sum + r.gradePoint, 0) / studentResults.length
        ).toFixed(2);

        topPerformers.push({
          student: result.student,
          avgGpa,
          subjectsCount: studentResults.length,
          avgMarks: (
            studentResults.reduce((sum, r) => sum + r.totalMarks, 0) / studentResults.length
          ).toFixed(2),
        });

        seenStudents.add(result.student._id.toString());

        if (topPerformers.length === parseInt(limit)) break;
      }
    }

    res.status(200).json({
      success: true,
      count: topPerformers.length,
      topPerformers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Pass/Fail Statistics
export const getPassFailStats = async (req, res) => {
  try {
    const { semester, branch, subject } = req.query;
    const filter = {};

    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;

    const results = await Result.find(filter).populate('student', 'branch');

    if (results.length === 0) {
      return res.status(404).json({ message: 'No results found' });
    }

    let filtered = results;
    if (branch) {
      filtered = results.filter((r) => r.student.branch === branch);
    }

    const totalStudents = filtered.length;
    const passCount = filtered.filter((r) => r.totalMarks >= 40).length;
    const failCount = totalStudents - passCount;
    const passPercentage = ((passCount / totalStudents) * 100).toFixed(2);
    const failPercentage = ((failCount / totalStudents) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        passCount,
        failCount,
        passPercentage,
        failPercentage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Overall Analytics Dashboard
export const getDashboardAnalytics = async (req, res) => {
  try {
    const { semester } = req.query;
    const filter = {};
    if (semester) filter.semester = semester;

    // Total Students
    const totalStudents = await Student.countDocuments();

    // Results data
    const results = await Result.find(filter);
    const totalResults = results.length;
    const passCount = results.filter((r) => r.totalMarks >= 40).length;
    const failCount = totalResults - passCount;
    const passPercentage = totalResults > 0 ? ((passCount / totalResults) * 100).toFixed(2) : 0;
    const failPercentage = totalResults > 0 ? ((failCount / totalResults) * 100).toFixed(2) : 0;

    // Grade distribution
    const gradeDistribution = results.reduce((acc, r) => {
      acc[r.grade] = (acc[r.grade] || 0) + 1;
      return acc;
    }, {});

    // Average marks
    const avgMarks = totalResults > 0 ? (results.reduce((sum, r) => sum + r.totalMarks, 0) / totalResults).toFixed(2) : 0;

    // Top 5 performers
    const topPerformers = [];
    const seenStudents = new Set();
    const sortedResults = results.sort((a, b) => b.totalMarks - a.totalMarks);

    for (const result of sortedResults) {
      if (!seenStudents.has(result.student.toString()) && topPerformers.length < 5) {
        topPerformers.push(result.student.toString());
        seenStudents.add(result.student.toString());
      }
    }

    res.status(200).json({
      success: true,
      dashboard: {
        totalStudents,
        totalResults,
        passCount,
        failCount,
        passPercentage,
        failPercentage,
        avgMarks,
        gradeDistribution,
        topPerformersCount: topPerformers.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Student Statistics by Branch/Section
export const getStudentStatsByBranch = async (req, res) => {
  try {
    const { semester } = req.query;

    const students = await Student.find(semester ? { semester } : {});
    const branchStats = {};

    for (const student of students) {
      if (!branchStats[student.branch]) {
        branchStats[student.branch] = {
          totalStudents: 0,
          totalResults: 0,
          passCount: 0,
          failCount: 0,
          avgMarks: 0,
        };
      }

      const filter = { student: student._id };
      if (semester) filter.semester = semester;

      const studentResults = await Result.find(filter);
      const passCount = studentResults.filter((r) => r.totalMarks >= 40).length;

      branchStats[student.branch].totalStudents++;
      branchStats[student.branch].totalResults += studentResults.length;
      branchStats[student.branch].passCount += passCount;
      branchStats[student.branch].failCount += studentResults.length - passCount;
      branchStats[student.branch].avgMarks += studentResults.reduce((sum, r) => sum + r.totalMarks, 0);
    }

    // Calculate averages
    Object.keys(branchStats).forEach((branch) => {
      const stats = branchStats[branch];
      stats.avgMarks = stats.totalResults > 0 ? (stats.avgMarks / stats.totalResults).toFixed(2) : 0;
      stats.passPercentage = stats.totalResults > 0 ? ((stats.passCount / stats.totalResults) * 100).toFixed(2) : 0;
    });

    res.status(200).json({
      success: true,
      branchStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Semester Performance Trends
export const getSemesterTrends = async (req, res) => {
  try {
    const { studentId } = req.params;

    const results = await Result.find({ student: studentId }).sort({ semester: 1 });

    if (results.length === 0) {
      return res.status(404).json({ message: 'No results found for this student' });
    }

    const trends = [];
    const semesters = [...new Set(results.map((r) => r.semester))];

    for (const semester of semesters) {
      const semesterResults = results.filter((r) => r.semester === semester);
      const avgMarks = (semesterResults.reduce((sum, r) => sum + r.totalMarks, 0) / semesterResults.length).toFixed(2);
      const gpa = await calculateSemesterGPA(studentId, semester);

      trends.push({
        semester,
        avgMarks: parseFloat(avgMarks),
        gpa: parseFloat(gpa),
        subjectsCount: semesterResults.length,
      });
    }

    res.status(200).json({
      success: true,
      trends,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
