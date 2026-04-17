import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: [true, 'Please provide a subject code'],
      unique: true,
      uppercase: true,
    },
    subjectName: {
      type: String,
      required: [true, 'Please provide a subject name'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Please provide a semester'],
      min: 1,
      max: 8,
    },
    branch: {
      type: String,
      required: [true, 'Please provide a branch'],
      enum: ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE'],
    },
    credits: {
      type: Number,
      required: [true, 'Please provide credits'],
      min: 1,
      max: 4,
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
  },
  { timestamps: true }
);

// Index for unique subject code per semester
subjectSchema.index({ subjectCode: 1, semester: 1 }, { unique: true });

export default mongoose.model('Subject', subjectSchema);
