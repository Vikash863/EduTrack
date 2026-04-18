import PDFDocument from 'pdfkit';
import Result from '../models/Result.model.js';
import Student from '../models/Student.model.js';
import Attendance from '../models/Attendance.model.js';
import { calculateCGPA } from '../utils/calculateCGPA.js';

export const generateStudentReport = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get student details
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get student results
    const results = await Result.find({ student: studentId })
      .populate('subject', 'subjectName subjectCode credits')
      .sort({ semester: 1 });

    // Get attendance data
    const attendance = await Attendance.find({ student: studentId });
    const presentCount = attendance.filter((a) => a.status === 'present').length;
    const totalClasses = attendance.length;
    const attendancePercentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;

    // Calculate CGPA
    const cgpa = await calculateCGPA(studentId);

    // Create PDF
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="student_report_${student.rollNumber}.pdf"`);

    doc.pipe(res);

    // Title
    doc.fontSize(20).font('Helvetica-Bold').text('EduTrack - Student Academic Report', { align: 'center' });
    doc.moveDown();

    // Student Information
    doc.fontSize(12).font('Helvetica-Bold').text('Student Information');
    doc.font('Helvetica');
    doc.fontSize(10).text(`Name: ${student.name}`);
    doc.text(`Roll Number: ${student.rollNumber}`);
    doc.text(`Email: ${student.email}`);
    doc.text(`Branch: ${student.branch}`);
    doc.text(`Section: ${student.section || 'N/A'}`);
    doc.text(`Current Semester: ${student.semester}`);
    doc.text(`CGPA: ${cgpa}`);
    doc.moveDown();

    // Academic Performance
    doc.fontSize(12).font('Helvetica-Bold').text('Academic Performance');
    doc.font('Helvetica');
    doc.fontSize(10);
    
    if (results.length > 0) {
      const table = {
        title: 'Results',
        headers: ['Semester', 'Subject', 'Code', 'Marks', 'Grade', 'Credits'],
        rows: results.map((r) => [
          r.semester.toString(),
          r.subject.subjectName,
          r.subject.subjectCode,
          r.totalMarks.toString(),
          r.grade,
          r.subject.credits.toString(),
        ]),
      };

      // Simple table rendering
      let yPosition = doc.y;
      const columnWidths = [80, 150, 80, 80, 80, 80];
      const startX = 50;

      // Headers
      doc.font('Helvetica-Bold').fontSize(9);
      table.headers.forEach((header, i) => {
        doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), yPosition, {
          width: columnWidths[i],
          align: 'left',
        });
      });

      yPosition += 20;
      doc.moveTo(startX, yPosition).lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), yPosition).stroke();

      // Rows
      doc.font('Helvetica').fontSize(9);
      table.rows.forEach((row) => {
        row.forEach((cell, i) => {
          doc.text(cell, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), yPosition, {
            width: columnWidths[i],
            align: 'left',
          });
        });
        yPosition += 15;
      });
    } else {
      doc.text('No results recorded yet.');
    }

    doc.moveDown();

    // Attendance
    doc.fontSize(12).font('Helvetica-Bold').text('Attendance');
    doc.font('Helvetica').fontSize(10);
    doc.text(`Classes Attended: ${presentCount} / ${totalClasses}`);
    doc.text(`Attendance Percentage: ${attendancePercentage}%`);
    doc.moveDown();

    // Footer
    doc.fontSize(8).font('Helvetica');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.text('This is an electronically generated report from EduTrack System', { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate Transcript
export const generateTranscript = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const results = await Result.find({ student: studentId })
      .populate('subject', 'subjectName subjectCode credits')
      .sort({ semester: 1 });

    const cgpa = await calculateCGPA(studentId);

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="transcript_${student.rollNumber}.pdf"`);

    doc.pipe(res);

    // Transcript Header
    doc.fontSize(16).font('Helvetica-Bold').text('Academic Transcript', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text(`EduTrack System`, { align: 'center' });
    doc.moveDown();

    // Student Details
    doc.fontSize(11).font('Helvetica-Bold').text('Candidate Information:');
    doc.font('Helvetica').fontSize(10);
    doc.text(`Name: ${student.name}`);
    doc.text(`Roll Number: ${student.rollNumber}`);
    doc.text(`Branch: ${student.branch}`);
    doc.text(`CGPA: ${cgpa}`);
    doc.moveDown();

    // Transcript Table
    if (results.length > 0) {
      doc.fontSize(10).font('Helvetica-Bold').text('Course Performance:');
      doc.font('Helvetica').fontSize(9);
      
      let yPos = doc.y;
      const colX = [50, 150, 220, 300, 350, 420];
      
      // Headers
      doc.font('Helvetica-Bold');
      doc.text('Sem', colX[0], yPos);
      doc.text('Subject', colX[1], yPos);
      doc.text('Code', colX[2], yPos);
      doc.text('Credits', colX[3], yPos);
      doc.text('Marks', colX[4], yPos);
      doc.text('Grade', colX[5], yPos);
      
      yPos += 15;
      doc.moveTo(50, yPos).lineTo(500, yPos).stroke();
      yPos += 5;

      // Data rows
      doc.font('Helvetica');
      results.forEach((result) => {
        doc.text(result.semester.toString(), colX[0], yPos);
        doc.text(result.subject.subjectName.substring(0, 15), colX[1], yPos);
        doc.text(result.subject.subjectCode, colX[2], yPos);
        doc.text(result.subject.credits.toString(), colX[3], yPos);
        doc.text(result.totalMarks.toString(), colX[4], yPos);
        doc.text(result.grade, colX[5], yPos);
        yPos += 12;
      });
    }

    doc.moveDown();
    doc.fontSize(8).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
