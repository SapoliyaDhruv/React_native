const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  topic: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  interviewerTips: { type: String },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
