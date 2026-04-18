import Attendance from '../models/Attendance.model.js';
import Student from '../models/Student.model.js';
import Subject from '../models/Subject.model.js';

// Add Attendance Record
export const addAttendance = async (req, res) => {
  try {
    const { student, subject, date, status, remarks } = req.body;
    const teacherId = req.user?._id;

    if (!student || !subject || !date || !status) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Get student and subject details for semester
    const studentDoc = await Student.findById(student);
    const subjectDoc = await Subject.findById(subject);

    if (!studentDoc || !subjectDoc) {
      return res.status(404).json({ message: 'Student or Subject not found' });
    }

    const attendance = new Attendance({
      student,
      subject,
      teacher: teacherId,
      semester: studentDoc.semester,
      date: new Date(date),
      status,
      remarks,
    });

    await attendance.save();
    await attendance.populate(['student', 'subject', 'teacher']);

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Attendance for Student
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId, semester } = req.query;

    const filter = { student: studentId };
    if (subjectId) filter.subject = subjectId;
    if (semester) filter.semester = semester;

    const attendance = await Attendance.find(filter)
      .populate('subject', 'subjectCode subjectName')
      .sort({ date: -1 });

    if (attendance.length === 0) {
      return res.status(200).json({
        success: true,
        totalClasses: 0,
        presentCount: 0,
        absentCount: 0,
        attendancePercentage: 0,
        records: [],
      });
    }

    // Calculate attendance percentage
    const presentCount = attendance.filter((a) => a.status === 'present').length;
    const totalClasses = attendance.length;
    const attendancePercentage = ((presentCount / totalClasses) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      totalClasses,
      presentCount,
      absentCount: totalClasses - presentCount,
      attendancePercentage,
      records: attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Attendance for Subject
export const getSubjectAttendance = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { semester } = req.query;

    const filter = { subject: subjectId };
    if (semester) filter.semester = semester;

    const attendance = await Attendance.find(filter)
      .populate('student', 'rollNumber name')
      .sort({ date: -1 });

    if (attendance.length === 0) {
      return res.status(200).json({
        success: true,
        totalRecords: 0,
        studentAttendance: [],
      });
    }

    // Group by student
    const studentAttendance = {};
    attendance.forEach((record) => {
      if (!studentAttendance[record.student._id]) {
        studentAttendance[record.student._id] = {
          student: record.student,
          totalClasses: 0,
          present: 0,
          absent: 0,
          leave: 0,
        };
      }
      studentAttendance[record.student._id].totalClasses++;
      if (record.status === 'present') {
        studentAttendance[record.student._id].present++;
      } else if (record.status === 'absent') {
        studentAttendance[record.student._id].absent++;
      } else {
        studentAttendance[record.student._id].leave++;
      }
    });

    // Calculate percentage
    Object.keys(studentAttendance).forEach((key) => {
      const data = studentAttendance[key];
      data.attendancePercentage = ((data.present / data.totalClasses) * 100).toFixed(2);
    });

    res.status(200).json({
      success: true,
      totalRecords: attendance.length,
      studentAttendance: Object.values(studentAttendance),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Attendance Record
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { status, remarks },
      { new: true, runValidators: true }
    ).populate(['student', 'subject', 'teacher']);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bulk Add Attendance
export const bulkAddAttendance = async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'Please provide attendance records' });
    }

    const attendanceRecords = [];
    for (const record of records) {
      const studentDoc = await Student.findById(record.student);
      if (studentDoc) {
        attendanceRecords.push({
          ...record,
          semester: studentDoc.semester,
          teacher: req.user?._id,
        });
      }
    }

    const result = await Attendance.insertMany(attendanceRecords);

    res.status(201).json({
      success: true,
      message: `${result.length} attendance records added successfully`,
      count: result.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Attendance Statistics
export const getAttendanceStats = async (req, res) => {
  try {
    const { semester, branch } = req.query;

    const filter = {};
    if (semester) filter.semester = semester;

    // Get all attendance records
    const attendanceRecords = await Attendance.find(filter).populate('student');

    if (attendanceRecords.length === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          totalClasses: 0,
          presentCount: 0,
          absentCount: 0,
          leaveCount: 0,
          overallAttendancePercentage: 0,
        },
      });
    }

    // Filter by branch if needed
    let filtered = attendanceRecords;
    if (branch) {
      filtered = attendanceRecords.filter((a) => a.student.branch === branch);
    }

    // Calculate statistics
    const totalClasses = filtered.length;
    const presentCount = filtered.filter((a) => a.status === 'present').length;
    const absentCount = filtered.filter((a) => a.status === 'absent').length;
    const leaveCount = filtered.filter((a) => a.status === 'leave').length;

    const overallAttendancePercentage = ((presentCount / totalClasses) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      stats: {
        totalClasses,
        presentCount,
        absentCount,
        leaveCount,
        overallAttendancePercentage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
