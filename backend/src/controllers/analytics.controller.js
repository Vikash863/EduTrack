import Result from '../models/Result.model.js';
import Student from '../models/Student.model.js';
import Subject from '../models/Subject.model.js';

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
