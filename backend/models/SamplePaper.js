const mongoose = require('mongoose');

const samplePaperSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    titleGujarati: { type: String },
    grade: { type: String, required: true }, // '6', '7', '8', '9', '10', '11', '12', 'college'
    board: { type: String, default: 'CBSE' }, // 'CBSE', 'GSEB', 'Placement'
    subject: { type: String, required: true },
    year: { type: String, default: '2024-2025' },
    durationMinutes: { type: Number, default: 60 },
    totalMarks: { type: Number, default: 50 },
    questionCount: { type: Number, default: 25 },
    difficulty: { type: String, default: 'Medium' },
    officialPdfUrl: { type: String },
    solutionPdfUrl: { type: String },
    badge: { type: String, default: 'OFFICIAL MODEL PAPER' },
    instructions: [{ type: String }],
    instructionsGujarati: [{ type: String }],
  },
  { timestamps: true }
);

samplePaperSchema.index({ grade: 1 });
samplePaperSchema.index({ board: 1 });
samplePaperSchema.index({ subject: 1 });

module.exports = mongoose.model('SamplePaper', samplePaperSchema);
