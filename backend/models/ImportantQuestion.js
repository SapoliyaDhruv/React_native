const mongoose = require('mongoose');

const stepMarkingSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  marksAllocated: { type: String, required: true }, // e.g. "1 Mark", "0.5 Mark"
  text: { type: String, required: true },
  textGujarati: { type: String },
});

const importantQuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    grade: { type: String, required: true }, // '6', '7', '8', '9', '10', '11', '12'
    board: { type: String, default: 'All' }, // 'CBSE', 'GSEB', 'All'
    subject: { type: String, required: true },
    chapterNumber: { type: Number, default: 1 },
    chapterTitle: { type: String, required: true },
    chapterTitleGujarati: { type: String },
    marks: { type: Number, required: true }, // 1, 2, 3, 4, 5
    marksCategory: { type: String, required: true }, // '1-Mark Objective / VSA', '2-Mark Short Answer', '3-Mark Medium Proof / Sum', '4-Mark Long Answer / Case Study'
    questionText: { type: String, required: true },
    questionTextGujarati: { type: String, required: true },
    frequentlyAskedYears: [{ type: String }], // e.g. ['GSEB March 2024', 'GSEB 2022', 'CBSE 2023']
    modelAnswer: { type: String, required: true },
    modelAnswerGujarati: { type: String, required: true },
    stepWiseMarking: [stepMarkingSchema],
    examinerTips: { type: String },
    examinerTipsGujarati: { type: String },
  },
  { timestamps: true }
);

importantQuestionSchema.index({ grade: 1, marks: 1 });
importantQuestionSchema.index({ grade: 1, subject: 1 });

module.exports = mongoose.model('ImportantQuestion', importantQuestionSchema);
