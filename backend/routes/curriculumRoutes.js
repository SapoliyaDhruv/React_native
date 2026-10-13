const express = require('express');
const router = express.Router();
const Curriculum = require('../models/Curriculum');

// Seed with full curriculum data
const { ACADEMIC_CURRICULUM } = require('./academicDataSeed');

async function ensureCurriculumsSeeded() {
  for (const gradeKey of Object.keys(ACADEMIC_CURRICULUM)) {
    const c = ACADEMIC_CURRICULUM[gradeKey];
    await Curriculum.findOneAndUpdate({ grade: c.grade }, c, { upsert: true, new: true });
  }
}

// GET /api/curriculum
router.get('/', async (req, res) => {
  try {
    const { grade } = req.query;

    if (grade) {
      // First check local updated dataset for immediate response
      if (ACADEMIC_CURRICULUM[grade]) {
        // Sync asynchronously to MongoDB in background
        Curriculum.findOneAndUpdate({ grade }, ACADEMIC_CURRICULUM[grade], { upsert: true }).catch(() => {});
        return res.json(ACADEMIC_CURRICULUM[grade]);
      }

      const curr = await Curriculum.findOne({ grade });
      if (curr) return res.json(curr);
      return res.json(ACADEMIC_CURRICULUM['6']);
    }

    const all = await Curriculum.find().sort({ grade: 1 });
    res.json(all.length > 0 ? all : Object.values(ACADEMIC_CURRICULUM));
  } catch (error) {
    console.error('Error fetching curriculum:', error);
    if (req.query.grade && ACADEMIC_CURRICULUM[req.query.grade]) {
      return res.json(ACADEMIC_CURRICULUM[req.query.grade]);
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
