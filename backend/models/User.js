const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  activeTrack: { type: String, default: 'placement' },
  grade: {
    type: String,
    enum: ['6', '7', '8', '9', '10', '11', '12', 'college'],
    default: 'college',
  },
  board: {
    type: String,
    enum: ['CBSE', 'GSEB', 'ICSE'],
    default: 'CBSE',
  },
  medium: {
    type: String,
    enum: ['English', 'Gujarati'],
    default: 'English',
  },
  academicStage: {
    type: String,
    enum: ['school', 'college'],
    default: 'college',
  },
  streakCount: { type: Number, default: 3 },
  targetCompany: { type: String, default: 'All Companies' },
  weakSpotStats: { type: Object, default: {} },
  attemptedQuestionIds: [{ type: Number }],
  bookmarkedQuestionIds: [{ type: Number }],
  lastLoginDate: { type: Date, default: Date.now },
  avatarUrl: { type: String, default: '' },
  unlockedBadges: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
