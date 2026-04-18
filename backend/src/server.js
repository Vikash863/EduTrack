import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

// ============================================
// HEALTH CHECK ENDPOINT (accessible before DB connection)
// ============================================
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: "🚀 EduTrack API is running successfully",
    version: '2.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth',
      students: '/api/students',
      teachers: '/api/teachers',
      results: '/api/results',
      subjects: '/api/subjects',
      attendance: '/api/attendance'
    }
  });
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// START SERVER
// ============================================
const startServer = async () => {
  try {
    // Connect to Database
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    // Start Express Server
    const server = app.listen(PORT, () => {
      console.log('\n╔══════════════════════════════════════╗');
      console.log('║   EduTrack Backend Server Started    ║');
      console.log('╠══════════════════════════════════════╣');
      console.log(`║ 🚀 Server: http://localhost:${PORT}${' '.repeat(PORT.toString().length <= 4 ? 11 : 9)}║`);
      console.log(`║ 🌍 Environment: ${NODE_ENV}${NODE_ENV === 'production' ? ' '.repeat(19) : ' '.repeat(20)}║`);
      console.log(`║ 📅 Started at: ${new Date().toLocaleString()}       ║`);
      console.log('╠══════════════════════════════════════╣');
      console.log('║ Available Routes:                    ║');
      console.log('║ GET  /health (Status Check)          ║');
      console.log('║ GET  /api (API Info)                 ║');
      console.log('║ POST /api/auth/register              ║');
      console.log('║ POST /api/auth/login                 ║');
      console.log('║ GET  /api/students                   ║');
      console.log('║ POST /api/results                    ║');
      console.log('╚══════════════════════════════════════╝\n');
    });

    // Handle Graceful Shutdown
    process.on('SIGTERM', () => {
      console.log('\n⚠️  SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n⚠️  SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Server failed to start:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    process.exit(1);
  }
};

startServer();
