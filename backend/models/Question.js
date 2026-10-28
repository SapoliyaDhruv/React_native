const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  category: { type: String, required: true },
  grades: [{ type: String, default: ['college'] }], // e.g. ['6'], ['7'], ['8'], ['9'], ['10'], ['11'], ['12'], ['college']
  subject: { type: String },
  board: { type: String, default: 'All' },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // 0-based index
  explanation: { type: String, required: true },
  targetCompany: { type: String, default: 'All' },
  difficulty: { type: String, default: 'Medium' },
  questionTextGujarati: { type: String },
  optionsGujarati: [{ type: String }],
  explanationGujarati: { type: String },
  categoryGujarati: { type: String },
});

// Indexes for fast lookups and randomized sampling queries
questionSchema.index({ grades: 1 });
questionSchema.index({ category: 1 });
questionSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
