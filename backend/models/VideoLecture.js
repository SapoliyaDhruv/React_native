const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  author: { type: String, required: true },
  role: { type: String, default: 'Student' },
  userEmail: { type: String },
  text: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: String }],
  createdAt: { type: mongoose.Schema.Types.Mixed, default: () => new Date().toISOString() },
});

const VideoLectureSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  chapterNumber: { type: Number },
  subjectId: { type: String },
  grades: [{ type: String, default: ['college'] }], // e.g. ['7'], ['8'], ['9'], ['10'], ['11'], ['12'], ['college']
  boards: [{ type: String, default: ['CBSE', 'GSEB'] }], // e.g. ['CBSE', 'GSEB']
  category: { type: String, required: true },
  categoryGujarati: { type: String },
  title: { type: String, required: true },
  titleGujarati: { type: String },
  instructor: { type: String, required: true },
  instructorGujarati: { type: String },
  duration: { type: String, required: true },
  durationSeconds: { type: Number, required: true },
  youtubeVideoId: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  playbackMode: { type: String, enum: ['embed', 'in_app_browser'], default: 'embed' },
  description: { type: String, required: true },
  descriptionGujarati: { type: String },
  referencePdfUrl: { type: String },
  timeStampedNotes: [
    {
      time: { type: String, required: true },
      text: { type: String, required: true },
      textGujarati: { type: String },
    },
  ],
  comments: [CommentSchema],
});

VideoLectureSchema.index({ grades: 1 });
VideoLectureSchema.index({ boards: 1 });
VideoLectureSchema.index({ category: 1 });

module.exports = mongoose.model('VideoLecture', VideoLectureSchema);
