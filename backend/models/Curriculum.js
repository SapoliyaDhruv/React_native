const mongoose = require('mongoose');

const chapterVideoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  titleGujarati: { type: String },
  teacher: { type: String, default: 'MindSprint Educator' },
  duration: { type: String, default: '15m' },
  youtubeVideoId: { type: String, required: true },
  tag: { type: String, default: 'Full Concept' }, // e.g. 'Concept In-Depth', 'Fast Revision', 'GSEB Solved Examples'
});

const chapterConceptSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  headingGujarati: { type: String },
  explanation: { type: String, required: true },
  explanationGujarati: { type: String },
});

const chapterSchema = new mongoose.Schema({
  id: { type: String, required: true },
  chapterNumber: { type: Number, required: true },
  title: { type: String, required: true },
  titleGujarati: { type: String },
  duration: { type: String, default: '15m' },
  summary: { type: String },
  summaryGujarati: { type: String },
  questionCount: { type: Number, default: 15 },
  iconName: { type: String, default: 'menu-book' },
  videos: [chapterVideoSchema],
  concepts: [chapterConceptSchema],
  keyFormulas: [{ type: String }],
  keyFormulasGujarati: [{ type: String }],
});

const subjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  nameGujarati: { type: String },
  code: { type: String },
  color: { type: String, default: '#3b82f6' },
  chapters: [chapterSchema],
});

const curriculumSchema = new mongoose.Schema({
  grade: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  badge: { type: String },
  subjects: [subjectSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Curriculum', curriculumSchema);
