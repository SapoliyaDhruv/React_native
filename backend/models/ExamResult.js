const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String, default: 'guest@mindsprint.edu' },
  grade: { type: String, default: 'college' },
  board: { type: String, default: 'CBSE' },
  category: { type: String, default: 'General' },
  scorePercentage: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  userAnswers: { type: Object, default: {} },
  weakCategories: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ExamResult', examResultSchema);
