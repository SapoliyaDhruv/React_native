const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const courseRoutes = require('./routes/courseRoutes');
const { router: videoRoutes, autoSeedVideos } = require('./routes/videoRoutes');
const formulaRoutes = require('./routes/formulaRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const curriculumRoutes = require('./routes/curriculumRoutes');
const { router: samplePaperRoutes, autoSeedSamplePapers } = require('./routes/samplePaperRoutes');
const { router: importantQuestionRoutes, autoSeedImportantQuestions } = require('./routes/importantQuestionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const duelRoutes = require('./routes/duelRoutes');

const { createRateLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mindsprint';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Security Rate Limiters
const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 30, message: 'Too many authentication attempts. Please try again after 15 minutes.' });
const apiLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 400 });

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api', apiLimiter, examRoutes);
app.use('/api', apiLimiter, courseRoutes);
app.use('/api/videos', apiLimiter, videoRoutes);
app.use('/api/ai', apiLimiter, aiRoutes);
app.use('/api/duels', apiLimiter, duelRoutes);
app.use('/api/formulas', formulaRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/sample-papers', samplePaperRoutes);
app.use('/api/important-questions', importantQuestionRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    message: 'MindSprint REST API Server is running cleanly',
    version: '1.2.0',
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

// Database Connection & Server Start
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas / Local Database');
    await autoSeedVideos();
    await autoSeedSamplePapers();
    await autoSeedImportantQuestions();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 MindSprint Backend Server running on http://0.0.0.0:${PORT} (LAN: http://192.168.137.244:${PORT})`);
    });
  })
  .catch((err) => {
    console.log('⚠️ MongoDB Connection Note:', err.message);
    console.log('Starting Express server with fallback dataset handler...');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 MindSprint Backend Server running on http://0.0.0.0:${PORT} (LAN: http://192.168.137.244:${PORT})`);
    });
  });
