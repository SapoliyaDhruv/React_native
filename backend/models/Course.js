const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  instructor: { type: String, required: true },
  duration: { type: String, default: '10 hrs' },
  lessonsCount: { type: Number, default: 20 },
  rating: { type: Number, default: 4.8 },
  tag: { type: String, default: 'Trending' },
  level: { type: String, default: 'All Levels' },
  thumbnailUrl: { type: String },
  videoUrl: { type: String },
});

module.exports = mongoose.model('Course', courseSchema);
