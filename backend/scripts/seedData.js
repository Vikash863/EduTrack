/**
 * Seed Data Script for EduTrack
 * Creates sample teachers, students, subjects, and results for testing
 * 
 * Usage: node scripts/seedData.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Teacher from '../src/models/Teacher.model.js';
import Student from '../src/models/Student.model.js';
import Subject from '../src/models/Subject.model.js';
import Result from '../src/models/Result.model.js';
import generateToken from '../src/utils/generateToken.js';

// ============================================
// DATABASE CONNECTION
// ============================================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// ============================================
// SAMPLE DATA
// ============================================
const teachers = [
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@edutrack.com',
    password: 'Teacher@123',
    department: 'Computer Science',
    phone: '9876543210',
    qualification: 'Ph.D. in Computer Science',
    experience: 8,
  },
  {
    name: 'Prof. Priya Sharma',
    email: 'priya.sharma@edutrack.com',
    password: 'Teacher@123',
    department: 'Mathematics',
    phone: '9876543211',
    qualification: 'M.Tech in Mathematics',
    experience: 5,
  },
  {
    name: 'Dr. Arun Patel',
    email: 'arun.patel@edutrack.com',
    password: 'Teacher@123',
    department: 'Physics',
    phone: '9876543212',
    qualification: 'Ph.D. in Physics',
    experience: 10,
  },
  {
    name: 'Ms. Sneha Gupta',
    email: 'sneha.gupta@edutrack.com',
    password: 'Teacher@123',
    department: 'English',
    phone: '9876543213',
    qualification: 'M.A. in English Literature',
    experience: 3,
  },
];

const subjects = [
  {
    name: 'Data Structures',
    code: 'CS201',
    semester: 3,
    credits: 4,
    department: 'Computer Science',
  },
  {
    name: 'Database Management',
    code: 'CS202',
    semester: 3,
    credits: 4,
    department: 'Computer Science',
  },
  {
    name: 'Advanced Calculus',
    code: 'MA201',
    semester: 3,
    credits: 4,
    department: 'Mathematics',
  },
  {
    name: 'Linear Algebra',
    code: 'MA202',
    semester: 3,
    credits: 4,
    department: 'Mathematics',
  },
  {
    name: 'Quantum Mechanics',
    code: 'PH201',
    semester: 3,
    credits: 4,
    department: 'Physics',
  },
  {
    name: 'Thermodynamics',
    code: 'PH202',
    semester: 3,
    credits: 4,
    department: 'Physics',
  },
];

const students = [
  {
    rollNumber: '2024001',
    name: 'Aarav Singh',
    email: 'aarav.singh@student.edutrack.com',
    phone: '8765432101',
    semester: 3,
    branch: 'Computer Science',
    mother: 'Kavya Singh',
    father: 'Vikram Singh',
  },
  {
    rollNumber: '2024002',
    name: 'Priya Verma',
    email: 'priya.verma@student.edutrack.com',
    phone: '8765432102',
    semester: 3,
    branch: 'Computer Science',
    mother: 'Anjali Verma',
    father: 'Rajiv Verma',
  },
  {
    rollNumber: '2024003',
    name: 'Rohan Reddy',
    email: 'rohan.reddy@student.edutrack.com',
    phone: '8765432103',
    semester: 3,
    branch: 'Mathematics',
    mother: 'Lakshmi Reddy',
    father: 'Ravi Reddy',
  },
  {
    rollNumber: '2024004',
    name: 'Ananya Kapoor',
    email: 'ananya.kapoor@student.edutrack.com',
    phone: '8765432104',
    semester: 3,
    branch: 'Mathematics',
    mother: 'Neha Kapoor',
    father: 'Arjun Kapoor',
  },
  {
    rollNumber: '2024005',
    name: 'Divya Nair',
    email: 'divya.nair@student.edutrack.com',
    phone: '8765432105',
    semester: 3,
    branch: 'Physics',
    mother: 'Meera Nair',
    father: 'Karthik Nair',
  },
  {
    rollNumber: '2024006',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@student.edutrack.com',
    phone: '8765432106',
    semester: 3,
    branch: 'Physics',
    mother: 'Sunita Kumar',
    father: 'Ashok Kumar',
  },
  {
    rollNumber: '2024007',
    name: 'Zara Khan',
    email: 'zara.khan@student.edutrack.com',
    phone: '8765432107',
    semester: 3,
    branch: 'Computer Science',
    mother: 'Fatima Khan',
    father: 'Ahmed Khan',
  },
  {
    rollNumber: '2024008',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@student.edutrack.com',
    phone: '8765432108',
    semester: 3,
    branch: 'Mathematics',
    mother: 'Gitika Sharma',
    father: 'Ramesh Sharma',
  },
];

// ============================================
// SEEDING FUNCTION
// ============================================
const seedDatabase = async () => {
  try {
    console.log('🗑️  Cleaning up existing data...');
    
    // Clear existing data
    await Teacher.deleteMany({});
    await Student.deleteMany({});
    await Subject.deleteMany({});
    await Result.deleteMany({});
    console.log('✅ Database cleaned');

    // ============================================
    // SEED TEACHERS
    // ============================================
    console.log('\n📚 Creating teachers...');
    const createdTeachers = await Teacher.insertMany(teachers);
    console.log(`✅ ${createdTeachers.length} teachers created`);
    createdTeachers.forEach((teacher) => {
      console.log(`   - ${teacher.name} (${teacher.email})`);
    });

    // ============================================
    // SEED SUBJECTS
    // ============================================
    console.log('\n📖 Creating subjects...');
    const createdSubjects = await Subject.insertMany(subjects);
    console.log(`✅ ${createdSubjects.length} subjects created`);
    createdSubjects.forEach((subject) => {
      console.log(`   - ${subject.name} (${subject.code})`);
    });

    // ============================================
    // SEED STUDENTS
    // ============================================
    console.log('\n👨‍🎓 Creating students...');
    const createdStudents = await Student.insertMany(students);
    console.log(`✅ ${createdStudents.length} students created`);
    createdStudents.forEach((student) => {
      console.log(`   - ${student.name} (${student.rollNumber})`);
    });

    // ============================================
    // SEED RESULTS
    // ============================================
    console.log('\n📊 Creating sample results...');
    const results = [];
    const subjectsForCS = createdSubjects.filter(s => s.code.startsWith('CS'));
    const subjectsForMA = createdSubjects.filter(s => s.code.startsWith('MA'));
    const subjectsForPH = createdSubjects.filter(s => s.code.startsWith('PH'));

    // Create results for CS students
    createdStudents
      .filter(s => s.branch === 'Computer Science')
      .forEach((student) => {
        subjectsForCS.forEach((subject) => {
          results.push({
            student: student._id,
            subject: subject._id,
            marksObtained: Math.floor(Math.random() * 30) + 60, // 60-90
            maxMarks: 100,
            semester: 3,
            academicYear: '2023-2024',
            examType: 'Mid-Term',
          });
        });
      });

    // Create results for Math students
    createdStudents
      .filter(s => s.branch === 'Mathematics')
      .forEach((student) => {
        subjectsForMA.forEach((subject) => {
          results.push({
            student: student._id,
            subject: subject._id,
            marksObtained: Math.floor(Math.random() * 30) + 65, // 65-95
            maxMarks: 100,
            semester: 3,
            academicYear: '2023-2024',
            examType: 'Mid-Term',
          });
        });
      });

    // Create results for Physics students
    createdStudents
      .filter(s => s.branch === 'Physics')
      .forEach((student) => {
        subjectsForPH.forEach((subject) => {
          results.push({
            student: student._id,
            subject: subject._id,
            marksObtained: Math.floor(Math.random() * 25) + 70, // 70-95
            maxMarks: 100,
            semester: 3,
            academicYear: '2023-2024',
            examType: 'Mid-Term',
          });
        });
      });

    const createdResults = await Result.insertMany(results);
    console.log(`✅ ${createdResults.length} results created`);

    // ============================================
    // GENERATE TEST TOKENS
    // ============================================
    console.log('\n🔐 Generating test tokens...');
    console.log('\n' + '='.repeat(60));
    console.log('TEST CREDENTIALS & TOKENS');
    console.log('='.repeat(60));

    createdTeachers.forEach((teacher) => {
      const token = generateToken(teacher._id);
      console.log(`\n👨‍🏫 ${teacher.name}`);
      console.log(`   Email: ${teacher.email}`);
      console.log(`   Password: Teacher@123`);
      console.log(`   Token: ${token}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Teachers created: ${createdTeachers.length}`);
    console.log(`✅ Students created: ${createdStudents.length}`);
    console.log(`✅ Subjects created: ${createdSubjects.length}`);
    console.log(`✅ Results created: ${createdResults.length}`);
    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📌 Next steps:');
    console.log('   1. Copy a token from above');
    console.log('   2. Use it in Postman with Authorization: Bearer <token>');
    console.log('   3. Test the API endpoints');
    console.log('   4. View results at: http://localhost:5000/api/results');

  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    if (error.code === 11000) {
      console.error('⚠️  Duplicate key error - try clearing MongoDB and running again');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// ============================================
// RUN SEEDING
// ============================================
const main = async () => {
  await connectDB();
  await seedDatabase();
};

main();
