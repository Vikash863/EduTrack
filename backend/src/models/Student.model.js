import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: [true, 'Please provide a roll number'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a student name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    dob: {
      type: Date,
    },
    section: {
      type: String,
      required: [true, 'Please provide a section'],
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
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    gpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    cgpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    address: {
      type: String,
      default: '',
    },
    parentContact: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Index for unique roll number per semester
studentSchema.index({ rollNumber: 1, semester: 1 }, { unique: true });

export default mongoose.model('Student', studentSchema);
