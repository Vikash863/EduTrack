import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import teacherRoutes from './routes/teacherRoutes.js';

app.get('/', (req, res) => {
  res.send("🚀 EduTrack API is running successfully");
});

const PORT = process.env.PORT || 5000;


app.use("/api/teachers", teacherRoutes);

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Start Server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
