import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    sessionalMarks: {
      type: Number,
      required: [true, 'Please provide sessional marks'],
      min: 0,
      max: 40,
    },
    putMarks: {
      type: Number,
      required: [true, 'Please provide PUT marks'],
      min: 0,
      max: 20,
    },
    finalMarks: {
      type: Number,
      required: [true, 'Please provide final marks'],
      min: 0,
      max: 40,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'],
      default: 'F',
    },
    gradePoint: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent duplicate entries
resultSchema.index({ student: 1, subject: 1, semester: 1 }, { unique: true });

// Calculate total marks and grade before saving
resultSchema.pre('save', function (next) {
  this.totalMarks = this.sessionalMarks + this.putMarks + this.finalMarks;

  // Grade calculation (0-100 scale)
  const percentage = this.totalMarks;
  if (percentage >= 90) {
    this.grade = 'A+';
    this.gradePoint = 4.0;
  } else if (percentage >= 85) {
    this.grade = 'A';
    this.gradePoint = 4.0;
  } else if (percentage >= 80) {
    this.grade = 'B+';
    this.gradePoint = 3.5;
  } else if (percentage >= 75) {
    this.grade = 'B';
    this.gradePoint = 3.0;
  } else if (percentage >= 70) {
    this.grade = 'C+';
    this.gradePoint = 2.5;
  } else if (percentage >= 65) {
    this.grade = 'C';
    this.gradePoint = 2.0;
  } else if (percentage >= 60) {
    this.grade = 'D+';
    this.gradePoint = 1.5;
  } else if (percentage >= 55) {
    this.grade = 'D';
    this.gradePoint = 1.0;
  } else {
    this.grade = 'F';
    this.gradePoint = 0.0;
  }

  next();
});

export default mongoose.model('Result', resultSchema);
