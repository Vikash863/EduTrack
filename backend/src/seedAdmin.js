import 'dotenv/config';
import connectDB from './config/db.js';
import Teacher from './models/Teacher.model.js';

const adminName = process.env.ADMIN_NAME || 'Admin';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@edutrack.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
const adminDepartment = process.env.ADMIN_DEPARTMENT || 'Administration';
const adminRole = process.env.ADMIN_ROLE || 'admin';
const forceUpdate = process.argv.includes('--force') || process.env.FORCE_ADMIN === 'true';

const createAdmin = async () => {
  await connectDB();

  const existing = await Teacher.findOne({ email: adminEmail });

  if (existing) {
    if (existing.role === adminRole && !forceUpdate) {
      console.log(`✅ Admin already exists with email ${adminEmail}`);
      process.exit(0);
    }

    existing.name = adminName;
    existing.department = adminDepartment;
    existing.role = adminRole;

    if (forceUpdate) {
      existing.password = adminPassword;
    }

    await existing.save();
    console.log(`✅ Updated existing user to admin: ${adminEmail}`);
  } else {
    const teacher = new Teacher({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      department: adminDepartment,
      role: adminRole,
    });

    await teacher.save();
    console.log(`✅ Created admin user: ${adminEmail}`);
  }

  console.log('✔️  Admin seed complete. Use the configured email and password to sign in.');
  process.exit(0);
};

createAdmin().catch((error) => {
  console.error('❌ Failed to seed admin:', error.message || error);
  process.exit(1);
});
