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

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mindsprint';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', examRoutes);
app.use('/api', courseRoutes);
app.use('/api', videoRoutes);
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

// Database Connection & Server Start
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas / Local Database');
    await autoSeedVideos();
    await autoSeedSamplePapers();
    await autoSeedImportantQuestions();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 MindSprint Backend Server running on http://0.0.0.0:${PORT} (LAN: http://10.166.238.124:${PORT})`);
    });
  })
  .catch((err) => {
    console.log('⚠️ MongoDB Connection Note:', err.message);
    console.log('Starting Express server with fallback dataset handler...');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 MindSprint Backend Server running on http://0.0.0.0:${PORT} (LAN: http://10.166.238.124:${PORT})`);
    });
  });
