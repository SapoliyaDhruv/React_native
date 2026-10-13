const express = require('express');
const router = express.Router();
const SamplePaper = require('../models/SamplePaper');

const SEED_SAMPLE_PAPERS = [
  // ==========================================
  // CLASS 10 BOARD EXAM PAPERS (GSEB & CBSE)
  // ==========================================
  {
    id: 'paper-g10-gseb-math-2025',
    title: 'GSEB Class 10 Board Mathematics (Standard) Model Paper 2025',
    titleGujarati: 'ધોરણ ૧૦ ગણિત બોર્ડ પરીક્ષા મોડેલ પેપર ૨૦૨૫ (GSEB)',
    grade: '10',
    board: 'GSEB',
    subject: 'Mathematics',
    year: '2024-2025',
    durationMinutes: 180,
    totalMarks: 80,
    questionCount: 35,
    difficulty: 'Medium',
    badge: 'GSEB BOARD 2025',
    officialPdfUrl: 'https://gujarat-education.gov.in/textbook/sample_paper_std10_maths.pdf',
    solutionPdfUrl: 'https://gujarat-education.gov.in/textbook/solution_std10_maths.pdf',
    instructions: [
      'The question paper comprises 4 Sections: A, B, C, and D.',
      'Section A contains 16 objective questions (1 mark each).',
      'Section B contains 10 short answer questions (2 marks each).',
      'Use of calculator is strictly prohibited.',
    ],
    instructionsGujarati: [
      'આ પ્રશ્નપત્રમાં કુલ ૪ વિભાગો છે: અ, બ, ક અને ડ.',
      'વિભાગ અ માં ૧૬ હેતુલક્ષી પ્રશ્નો (દરેકનો ૧ ગુણ) સમાવિષ્ટ છે.',
      'કેલ્ક્યુલેટરનો ઉપયોગ વર્જિત છે.',
    ],
  },
  {
    id: 'paper-g10-gseb-sci-2025',
    title: 'GSEB Class 10 Board Science Model Question Paper 2025',
    titleGujarati: 'ધોરણ ૧૦ વિજ્ઞાન બોર્ડ પરીક્ષા નમૂના પ્રશ્નપત્ર ૨૦૨૫ (GSEB)',
    grade: '10',
    board: 'GSEB',
    subject: 'Science',
    year: '2024-2025',
    durationMinutes: 180,
    totalMarks: 80,
    questionCount: 36,
    difficulty: 'Medium',
    badge: 'GSEB BOARD 2025',
    officialPdfUrl: 'https://gujarat-education.gov.in/textbook/sample_paper_std10_sci.pdf',
    solutionPdfUrl: 'https://gujarat-education.gov.in/textbook/solution_std10_sci.pdf',
    instructions: [
      'All questions are compulsory. Internal choice is provided in several sections.',
      'Draw neat and labelled diagrams wherever required.',
      'Write answers clearly in Gujarati or English medium.',
    ],
    instructionsGujarati: [
      'બધા જ પ્રશ્નો ફરજિયાત છે. સ્વચ્છ અને નામનિર્દેશનવાળી આકૃતિઓ દોરો.',
    ],
  },
  {
    id: 'paper-g10-cbse-math-2025',
    title: 'CBSE Class 10 Mathematics Standard Official Sample Paper 2025',
    titleGujarati: 'CBSE ધોરણ ૧૦ ગણિત સેમ્પલ પેપર ૨૦૨૫',
    grade: '10',
    board: 'CBSE',
    subject: 'Mathematics',
    year: '2024-2025',
    durationMinutes: 180,
    totalMarks: 80,
    questionCount: 38,
    difficulty: 'Hard',
    badge: 'CBSE OFFICIAL 2025',
    officialPdfUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/Maths-Standard-SQP.pdf',
    solutionPdfUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/Maths-Standard-MS.pdf',
    instructions: [
      'This question paper contains 5 Sections: A, B, C, D and E.',
      'Section A comprises 20 MCQs carrying 1 mark each.',
      'Section E comprises 3 case study based integrated assessments (4 marks each).',
    ],
    instructionsGujarati: [
      'પ્રશ્નપત્રમાં ૨૦ હેતુલક્ષી પ્રશ્નો અને ૩ કેસ-સ્ટડી આધારિત પ્રશ્નો છે.',
    ],
  },

  // ==========================================
  // CLASS 12 BOARD & ENTRANCE (GSEB & CBSE)
  // ==========================================
  {
    id: 'paper-g12-gseb-phy-2025',
    title: 'GSEB Class 12 Physics & GUJCET Official Practice Paper',
    titleGujarati: 'ધોરણ ૧૨ ભૌતિક વિજ્ઞાન & ગુજકેટ (GUJCET) મોડેલ પેપર',
    grade: '12',
    board: 'GSEB',
    subject: 'Physics',
    year: '2024-2025',
    durationMinutes: 120,
    totalMarks: 50,
    questionCount: 50,
    difficulty: 'Hard',
    badge: 'GUJCET & 12th BOARD',
    officialPdfUrl: 'https://gujarat-education.gov.in/textbook/sample_std12_phy.pdf',
    solutionPdfUrl: 'https://gujarat-education.gov.in/textbook/solution_std12_phy.pdf',
    instructions: [
      'Contains 50 multiple choice questions with 1 mark each.',
      'Covers Electrostatics, Optics, Current Electricity, and Modern Physics.',
      'Negative marking: -0.25 marks for each incorrect response in GUJCET mode.',
    ],
    instructionsGujarati: [
      'કુલ ૫૦ એમ.સી.ક્યુ. પ્રશ્નો. દરેક સાચા જવાબનો ૧ ગુણ.',
    ],
  },
  {
    id: 'paper-g12-cbse-math-2025',
    title: 'CBSE Class 12 Mathematics Official Board Sample Paper 2025',
    titleGujarati: 'CBSE ધોરણ ૧૨ ગણિત બોર્ડ મોડેલ પેપર',
    grade: '12',
    board: 'CBSE',
    subject: 'Mathematics',
    year: '2024-2025',
    durationMinutes: 180,
    totalMarks: 80,
    questionCount: 38,
    difficulty: 'Hard',
    badge: 'CBSE 12th BOARDS',
    officialPdfUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2024_25/Maths-SQP.pdf',
    solutionPdfUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2024_25/Maths-MS.pdf',
    instructions: [
      'Section A has 18 MCQs and 2 Assertion-Reason based questions of 1 mark each.',
      'Calculus, Vectors & 3D Geometry hold 45% weightage.',
    ],
    instructionsGujarati: [
      'કલનશાસ્ત્ર અને સદિશ ભૂમિતિ પર વિશેષ ધ્યાન આપો.',
    ],
  },

  // ==========================================
  // JUNIOR & MIDDLE SCHOOL (CLASSES 6, 7, 8, 9)
  // ==========================================
  {
    id: 'paper-g6-annual-math',
    title: 'Class 6 Annual Exam Mathematics Comprehensive Practice Paper',
    titleGujarati: 'ધોરણ ૬ વાર્ષિક પરીક્ષા ગણિત અભ્યાસ પ્રશ્નપત્ર',
    grade: '6',
    board: 'CBSE',
    subject: 'Mathematics',
    year: '2024-2025',
    durationMinutes: 90,
    totalMarks: 50,
    questionCount: 25,
    difficulty: 'Easy',
    badge: 'CLASS 6 ANNUAL',
    officialPdfUrl: 'https://ncert.nic.in/textbook/sample/class6_math.pdf',
    solutionPdfUrl: 'https://ncert.nic.in/textbook/sample/class6_math_sol.pdf',
    instructions: [
      'Questions cover Numbers, Fractions, Decimals, Perimeter, and Algebra.',
      'All 25 questions are multiple choice or one-word answers.',
    ],
    instructionsGujarati: [
      'સંખ્યા પરિચય, અપૂર્ણાંક, દશાંશ અને પરિમિતિ આધારિત પ્રશ્નો.',
    ],
  },
  {
    id: 'paper-g7-annual-sci',
    title: 'Class 7 Science Term-2 Comprehensive Practice Paper',
    titleGujarati: 'ધોરણ ૭ વિજ્ઞાન દ્વિતીય સત્ર પરીક્ષા પેપર',
    grade: '7',
    board: 'CBSE',
    subject: 'Science',
    year: '2024-2025',
    durationMinutes: 90,
    totalMarks: 50,
    questionCount: 25,
    difficulty: 'Medium',
    badge: 'CLASS 7 TERM-2',
    officialPdfUrl: 'https://ncert.nic.in/textbook/sample/class7_sci.pdf',
    solutionPdfUrl: 'https://ncert.nic.in/textbook/sample/class7_sci_sol.pdf',
    instructions: [
      'Covers Plant Nutrition, Acids & Bases, Heat, and Respiration.',
    ],
    instructionsGujarati: [
      'વનસ્પતિમાં પોષણ, ઉષ્મા અને એસિડ-બેઇઝ પર આધારિત પેપર.',
    ],
  },
  {
    id: 'paper-g8-math-prep',
    title: 'Class 8 Mathematics Board-Preparation Assessment Paper',
    titleGujarati: 'ધોરણ ૮ ગણિત પ્રિ-બોર્ડ મોડેલ પેપર',
    grade: '8',
    board: 'CBSE',
    subject: 'Mathematics',
    year: '2024-2025',
    durationMinutes: 120,
    totalMarks: 60,
    questionCount: 30,
    difficulty: 'Medium',
    badge: 'SECONDARY PREP',
    officialPdfUrl: 'https://ncert.nic.in/textbook/sample/class8_math.pdf',
    solutionPdfUrl: 'https://ncert.nic.in/textbook/sample/class8_math_sol.pdf',
    instructions: [
      'Rational Numbers, Square Roots, Linear Equations and Mensuration.',
    ],
    instructionsGujarati: [
      'સંમેય સંખ્યાઓ, વર્ગ-વર્ગમૂળ અને ઘનફળ-ક્ષેત્રફળના પ્રશ્નો.',
    ],
  },
  {
    id: 'paper-g9-math-sci-prep',
    title: 'Class 9 Math & Science Secondary Foundation Diagnostic Paper',
    titleGujarati: 'ધોરણ ૯ ગણિત અને વિજ્ઞાન પાયાની ચકાસણી પેપર',
    grade: '9',
    board: 'CBSE',
    subject: 'Mathematics',
    year: '2024-2025',
    durationMinutes: 120,
    totalMarks: 60,
    questionCount: 30,
    difficulty: 'Medium',
    badge: 'BOARD FOUNDATION',
    officialPdfUrl: 'https://ncert.nic.in/textbook/sample/class9_math.pdf',
    solutionPdfUrl: 'https://ncert.nic.in/textbook/sample/class9_math_sol.pdf',
    instructions: [
      'Heron Formula, Number Systems, Polynomials, and Laws of Motion.',
    ],
    instructionsGujarati: [
      'બહુપદીઓ, હેરોનનું સૂત્ર અને ન્યૂટનના ગતિના નિયમો.',
    ],
  },

  // ==========================================
  // COLLEGE & CAMPUS PLACEMENTS
  // ==========================================
  {
    id: 'paper-tcs-nqt-2025',
    title: 'TCS NQT 2025 Official Pattern Full Mock Test Paper',
    titleGujarati: 'TCS NQT ૨૦૨૫ પ્લેસમેન્ટ મોડેલ પરીક્ષા પેપર',
    grade: 'college',
    board: 'Placement',
    subject: 'Placement Aptitude',
    year: '2024-2025',
    durationMinutes: 75,
    totalMarks: 60,
    questionCount: 40,
    difficulty: 'Medium',
    badge: 'TCS NQT 2025 PATTERN',
    officialPdfUrl: 'https://learning.tcsion.com/hub/nqt-sample-paper.pdf',
    solutionPdfUrl: 'https://learning.tcsion.com/hub/nqt-solutions.pdf',
    instructions: [
      'Numerical Ability (20 Questions - 25 Mins).',
      'Reasoning Ability (20 Questions - 25 Mins).',
      'Verbal Ability (20 Questions - 25 Mins).',
      'Adaptive sectional timers strictly enforced in TCS exam.',
    ],
    instructionsGujarati: [
      'TCS NQT ૨૦૨૫ પરીક્ષા પદ્ધતિ પર આધારિત પ્રશ્નપત્ર.',
    ],
  },
  {
    id: 'paper-infosys-springboard-2025',
    title: 'Infosys Specialist Programmer & SE Placement Practice Paper',
    titleGujarati: 'ઈન્ફોસિસ પ્લેસમેન્ટ ટેકનિકલ & એપ્ટિટ્યુડ પેપર',
    grade: 'college',
    board: 'Placement',
    subject: 'IT Technical & Aptitude',
    year: '2024-2025',
    durationMinutes: 60,
    totalMarks: 50,
    questionCount: 35,
    difficulty: 'Hard',
    badge: 'INFOSYS ON-CAMPUS',
    officialPdfUrl: 'https://infytq.onwingspan.com/sample-papers/se-round1.pdf',
    solutionPdfUrl: 'https://infytq.onwingspan.com/sample-papers/se-round1-answers.pdf',
    instructions: [
      'Contains Logical Reasoning, Cryptarithmetic, and DSA Multiple Choice Questions.',
    ],
    instructionsGujarati: [
      'ઈન્ફોસિસ ઓન-કેમ્પસ પ્લેસમેન્ટ માટે ખાસ રચાયેલ પેપર.',
    ],
  },
  {
    id: 'paper-amazon-sde-dsa-2025',
    title: 'Amazon SDE-1 Assessment Technical & DSA Practice Paper',
    titleGujarati: 'એમેઝોન SDE-૧ ડેટા સ્ટ્રક્ચર્સ & કોડિંગ ટેસ્ટ પેપર',
    grade: 'college',
    board: 'Placement',
    subject: 'Data Structures & Algorithms',
    year: '2024-2025',
    durationMinutes: 90,
    totalMarks: 50,
    questionCount: 30,
    difficulty: 'Hard',
    badge: 'FAANG / PRODUCT COMPANIES',
    officialPdfUrl: 'https://amazon.jobs/content/software-development-interview-prep.pdf',
    solutionPdfUrl: 'https://amazon.jobs/content/dsa-solutions.pdf',
    instructions: [
      'Covers Binary Trees, Graphs, Dynamic Programming, and System Design fundamentals.',
    ],
    instructionsGujarati: [
      'બાયનરી ટ્રી, ગ્રાફ અને ડાઇનેમિક પ્રોગ્રામિંગ પ્રશ્નો.',
    ],
  },
];

// Seed to database on startup if collection is empty
async function autoSeedSamplePapers() {
  try {
    for (const p of SEED_SAMPLE_PAPERS) {
      await SamplePaper.findOneAndUpdate({ id: p.id }, p, { upsert: true });
    }
  } catch (e) {
    // MongoDB might not be connected in fallback mode
  }
}

// GET /api/sample-papers
router.get('/', async (req, res) => {
  try {
    const { grade, board, subject } = req.query;
    const query = {};
    if (grade) query.grade = grade;
    if (board && board !== 'All') query.board = board;
    if (subject && subject !== 'All') query.subject = subject;

    let papers = await SamplePaper.find(query).sort({ year: -1, totalMarks: -1 });

    if (papers.length === 0) {
      // Fallback filtering in memory
      papers = SEED_SAMPLE_PAPERS.filter((p) => {
        if (grade && p.grade !== grade) return false;
        if (board && board !== 'All' && p.board !== board) return false;
        if (subject && subject !== 'All' && p.subject !== subject) return false;
        return true;
      });
      if (papers.length === 0) papers = SEED_SAMPLE_PAPERS;
    }

    res.json(papers);
  } catch (error) {
    console.warn('Error fetching sample papers, using in-memory list:', error.message);
    const { grade } = req.query;
    if (grade) {
      const filtered = SEED_SAMPLE_PAPERS.filter((p) => p.grade === grade);
      return res.json(filtered.length > 0 ? filtered : SEED_SAMPLE_PAPERS);
    }
    res.json(SEED_SAMPLE_PAPERS);
  }
});

// GET /api/sample-papers/:id
router.get('/:id', async (req, res) => {
  try {
    const paper = await SamplePaper.findOne({ id: req.params.id });
    if (paper) return res.json(paper);
    const fallback = SEED_SAMPLE_PAPERS.find((p) => p.id === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(404).json({ error: 'Sample paper not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, autoSeedSamplePapers, SEED_SAMPLE_PAPERS };
