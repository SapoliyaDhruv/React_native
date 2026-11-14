const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const VideoLecture = require('../models/VideoLecture');

// Fully seeded library covering Classes 6 to 12 and College with 0 duplicate YouTube IDs
const SEED_VIDEOS = require('../data/videos.json'); // shared with the app (constants/videoData.ts)

// Seed videos on startup or on demand
async function seedDefaultVideos() {
  try {
    await VideoLecture.deleteMany({ id: { $regex: '^vid-school-' } });
    await VideoLecture.deleteMany({ grades: '6' });
    for (const video of SEED_VIDEOS) {
      await VideoLecture.findOneAndUpdate(
        { id: video.id },
        video,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  } catch (err) {
    console.warn('Video auto-seed notice:', err.message);
  }
}

// GET /api/videos - returns video lectures with grade/subject filtering
router.get('/', async (req, res) => {
  try {
    const { grade, category, board } = req.query;

    const filterSeed = () => {
      let filtered = SEED_VIDEOS;
      if (grade) {
        filtered = filtered.filter(v => v.grades && v.grades.includes(grade));
      }
      if (category && category !== 'All') {
        const catLower = category.toLowerCase();
        filtered = filtered.filter(v => {
          const vCat = (v.category || '').toLowerCase();
          const vCatG = (v.categoryGujarati || '').toLowerCase();
          return vCat.includes(catLower) || vCatG.includes(catLower) ||
            (category === 'ગણિત' && (vCat.includes('math') || vCatG.includes('ગણિત'))) ||
            (category === 'વિજ્ઞાન' && (vCat.includes('sci') || vCatG.includes('વિજ્ઞાન'))) ||
            (category === 'સામાજિક વિજ્ઞાન' && (vCat.includes('soc') || vCatG.includes('સામાજિક'))) ||
            (category === 'ગુજરાતી' && (vCat.includes('guj') || vCatG.includes('ગુજરાતી'))) ||
            (category === 'અંગ્રેજી' && (vCat.includes('eng') || vCatG.includes('અંગ્રેજી')));
        });
      }
      if (board) {
        filtered = filtered.filter(v => v.boards && v.boards.includes(board));
      }
      return filtered.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
    };

    if (mongoose.connection.readyState !== 1) {
      return res.json(filterSeed());
    }

    let query = {};
    if (grade) {
      query.grades = grade;
    }
    if (category && category !== 'All') {
      const orClauses = [
        { category: new RegExp(category, 'i') },
        { categoryGujarati: new RegExp(category, 'i') },
      ];
      if (category === 'ગણિત') orClauses.push({ category: /math/i });
      if (category === 'વિજ્ઞાન') orClauses.push({ category: /sci/i });
      if (category === 'સામાજિક વિજ્ઞાન') orClauses.push({ category: /social/i });
      if (category === 'ગુજરાતી') orClauses.push({ category: /gujarati/i });
      if (category === 'અંગ્રેજી') orClauses.push({ category: /english/i });
      query.$or = orClauses;
    }
    if (board) {
      query.boards = board;
    }

    let videos = await VideoLecture.find(query).sort({ chapterNumber: 1, id: 1 });

    if (!videos || videos.length === 0) {
      return res.json(filterSeed());
    }

    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.json(SEED_VIDEOS);
  }
});

// POST /api/videos/:id/comments - Post a new discussion comment

// POST /api/videos/report - students flag a video that is wrong, broken or unhelpful.
// Stored in MongoDB when connected, otherwise appended to backend/data/video-reports.jsonl
// so reports are never lost. Review them, then fix backend/data/*.json.
const REPORT_REASONS = ['wrong-topic', 'wrong-chapter', 'not-playing', 'bad-quality', 'other'];
const VideoReport = mongoose.models.VideoReport || mongoose.model('VideoReport', new mongoose.Schema({
  youtubeVideoId: { type: String, required: true },
  grade: String,
  subjectId: String,
  chapterNumber: Number,
  reason: { type: String, enum: REPORT_REASONS, default: 'other' },
  note: { type: String, maxlength: 500 },
  email: String,
  createdAt: { type: Date, default: Date.now },
}));

router.post('/report', async (req, res) => {
  try {
    const { youtubeVideoId, grade, subjectId, chapterNumber, reason, note, email } = req.body || {};
    if (!/^[\w-]{11}$/.test(youtubeVideoId || '')) {
      return res.status(400).json({ error: 'A valid youtubeVideoId is required.' });
    }
    const report = {
      youtubeVideoId,
      grade: grade ? String(grade).slice(0, 10) : undefined,
      subjectId: subjectId ? String(subjectId).slice(0, 40) : undefined,
      chapterNumber: Number.isFinite(Number(chapterNumber)) ? Number(chapterNumber) : undefined,
      reason: REPORT_REASONS.includes(reason) ? reason : 'other',
      note: note ? String(note).slice(0, 500) : undefined,
      email: email ? String(email).slice(0, 120) : undefined,
    };
    if (mongoose.connection.readyState === 1) {
      await VideoReport.create(report);
    } else {
      fs.appendFileSync(path.join(__dirname, '../data/video-reports.jsonl'), JSON.stringify({ ...report, createdAt: new Date().toISOString() }) + '\n');
    }
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Video report error:', err.message);
    res.status(500).json({ error: 'Could not save the report. Please try again.' });
  }
});

router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { author, userEmail, text, role } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const newComment = {
      id: 'c_' + Date.now(),
      author: author || 'MindSprint Scholar',
      userEmail: userEmail || 'student@mindsprint.app',
      role: role || 'Verified Learner',
      text: text.trim(),
      upvotes: 1,
      upvotedBy: [userEmail || 'self'],
      createdAt: new Date().toISOString(),
    };

    let video = await VideoLecture.findOne({ id });
    if (!video) {
      // Find from SEED_VIDEOS and create
      const seed = SEED_VIDEOS.find(v => v.id === id);
      if (seed) {
        video = new VideoLecture({ ...seed, comments: [newComment] });
        await video.save();
        return res.json({ success: true, comment: newComment });
      }
      return res.status(404).json({ error: 'Video not found' });
    }

    video.comments = video.comments || [];
    video.comments.unshift(newComment);
    await video.save();

    res.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/videos/:id/comments/:commentId/upvote
router.post('/:id/comments/:commentId/upvote', async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { userEmail } = req.body;

    let video = await VideoLecture.findOne({ id });
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const comment = (video.comments || []).find(c => c.id === commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.upvotedBy = comment.upvotedBy || [];
    const voter = userEmail || 'anonymous';

    if (comment.upvotedBy.includes(voter)) {
      comment.upvotedBy = comment.upvotedBy.filter(u => u !== voter);
      comment.upvotes = Math.max(0, (comment.upvotes || 1) - 1);
    } else {
      comment.upvotedBy.push(voter);
      comment.upvotes = (comment.upvotes || 0) + 1;
    }

    await video.save();
    res.json({ success: true, upvotes: comment.upvotes, upvotedBy: comment.upvotedBy });
  } catch (error) {
    console.error('Error upvoting comment:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/videos/seed - manual seed trigger
router.get('/seed', async (req, res) => {
  try {
    await seedDefaultVideos();
    res.json({ success: true, count: SEED_VIDEOS.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, autoSeedVideos: seedDefaultVideos, SEED_VIDEOS };
