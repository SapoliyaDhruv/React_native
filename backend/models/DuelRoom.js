const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  avatar: { type: String, default: '🧑‍🎓' },
  schoolOrCollege: { type: String, default: '' },
  score: { type: Number, default: 0 },
  currentRound: { type: Number, default: 0 },
  ready: { type: Boolean, default: false },
}, { _id: false });

const duelRoomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true, index: true },
  grade: { type: String, required: true },
  subject: { type: String, required: true, default: 'All' },
  status: {
    type: String,
    enum: ['waiting', 'ready', 'active', 'completed', 'abandoned'],
    default: 'waiting',
    index: true,
  },
  host: { type: playerSchema, required: true },
  guest: { type: playerSchema, default: null },
  questions: [{
    id: mongoose.Schema.Types.Mixed,
    questionText: String,
    questionTextGujarati: String,
    category: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    explanationGujarati: String,
  }],
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

module.exports = mongoose.model('DuelRoom', duelRoomSchema);
