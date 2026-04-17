import Subject from '../models/Subject.model.js';

// Add Subject
export const addSubject = async (req, res) => {
  try {
    const { subjectCode, subjectName, semester, branch, credits, teacher } = req.body;

    if (!subjectCode || !subjectName || !semester || !branch || !credits || !teacher) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingSubject = await Subject.findOne({ subjectCode, semester });
    if (existingSubject) {
      return res.status(409).json({ message: 'Subject already exists for this semester' });
    }

    const subject = new Subject({
      subjectCode: subjectCode.toUpperCase(),
      subjectName,
      semester,
      branch,
      credits,
      teacher,
    });

    await subject.save();

    res.status(201).json({
      success: true,
      message: 'Subject added successfully',
      subject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Subjects with Filters
export const getSubjects = async (req, res) => {
  try {
    const { semester, branch } = req.query;
    const filter = {};

    if (semester) filter.semester = semester;
    if (branch) filter.branch = branch;

    const subjects = await Subject.find(filter).populate('teacher', 'name email').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Subject
export const getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('teacher', 'name email');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Subject
export const updateSubject = async (req, res) => {
  try {
    const { subjectName, credits, teacher } = req.body;

    const updateData = {};
    if (subjectName !== undefined) updateData.subjectName = subjectName;
    if (credits !== undefined) updateData.credits = credits;
    if (teacher !== undefined) updateData.teacher = teacher;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('teacher', 'name email');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      subject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Subject
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
