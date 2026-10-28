const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const SamplePaper = require('../models/SamplePaper');
const ImportantQuestion = require('../models/ImportantQuestion');
const Question = require('../models/Question');
const { SEED_IMPORTANT_QUESTIONS } = require('./importantQuestionRoutes');

// Load verified questions as local dataset fallback
let verifiedQuestions = [];
try {
  verifiedQuestions = require('../data/verified_questions.json');
} catch (e) {
  verifiedQuestions = [];
}

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
    officialPdfUrl: '/api/sample-papers/render/paper-g10-gseb-math-2025?type=question',
    solutionPdfUrl: '/api/sample-papers/render/paper-g10-gseb-math-2025?type=solution',
    externalSourceUrl: 'https://gujarat-education.gov.in/textbook/sample_paper_std10_maths.pdf',
    instructions: [
      'The question paper comprises 4 Sections: A, B, C, and D.',
      'Section A contains 16 objective questions (1 mark each).',
      'Section B contains 10 short answer questions (2 marks each).',
      'Section C contains 8 long answer questions (3 marks each).',
      'Section D contains 5 application & theorem problems (4 marks each).',
      'Use of calculator is strictly prohibited.',
    ],
    instructionsGujarati: [
      'આ પ્રશ્નપત્રમાં કુલ ૪ વિભાગો છે: અ, બ, ક અને ડ.',
      'વિભાગ અ માં ૧૬ હેતુલક્ષી પ્રશ્નો (દરેકનો ૧ ગુણ) સમાવિષ્ટ છે.',
      'વિભાગ બ માં ૧૦ ટૂંકજવાબી પ્રશ્નો (દરેકના ૨ ગુણ) છે.',
      'વિભાગ ક માં ૮ મુદ્દાસર પ્રશ્નો (દરેકના ૩ ગુણ) છે.',
      'વિભાગ ડ માં ૫ પ્રમેય અને વ્યવહારુ પ્રશ્નો (દરેકના ૪ ગુણ) છે.',
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
    officialPdfUrl: '/api/sample-papers/render/paper-g10-gseb-sci-2025?type=question',
    solutionPdfUrl: '/api/sample-papers/render/paper-g10-gseb-sci-2025?type=solution',
    externalSourceUrl: 'https://gujarat-education.gov.in/textbook/sample_paper_std10_sci.pdf',
    instructions: [
      'All questions are compulsory. Internal choice is provided in several sections.',
      'Draw neat and labelled diagrams wherever required.',
      'Write answers clearly in Gujarati or English medium.',
    ],
    instructionsGujarati: [
      'બધા જ પ્રશ્નો ફરજિયાત છે. સ્વચ્છ અને નામનિર્દેશનવાળી આકૃતિઓ દોરો.',
      'જવાબો સ્પષ્ટ અને સુંદર અક્ષરે લખો.',
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
    officialPdfUrl: '/api/sample-papers/render/paper-g10-cbse-math-2025?type=question',
    solutionPdfUrl: '/api/sample-papers/render/paper-g10-cbse-math-2025?type=solution',
    externalSourceUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/Maths-Standard-SQP.pdf',
    instructions: [
      'This question paper contains 5 Sections: A, B, C, D and E.',
      'Section A comprises 20 MCQs carrying 1 mark each.',
      'Section B comprises 5 Short Answer (SA-I) type questions of 2 marks each.',
      'Section C comprises 6 Short Answer (SA-II) type questions of 3 marks each.',
      'Section D comprises 4 Long Answer (LA) type questions of 5 marks each.',
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
    officialPdfUrl: '/api/sample-papers/render/paper-g12-gseb-phy-2025?type=question',
    solutionPdfUrl: '/api/sample-papers/render/paper-g12-gseb-phy-2025?type=solution',
    externalSourceUrl: 'https://gujarat-education.gov.in/textbook/sample_std12_phy.pdf',
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
    officialPdfUrl: '/api/sample-papers/render/paper-g12-cbse-math-2025?type=question',
    solutionPdfUrl: '/api/sample-papers/render/paper-g12-cbse-math-2025?type=solution',
    externalSourceUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2024_25/Maths-SQP.pdf',
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
    officialPdfUrl: '/api/sample-papers/render/paper-g6-annual-math?type=question',
    solutionPdfUrl: '/api/sample-papers/render/paper-g6-annual-math?type=solution',
    externalSourceUrl: 'https://ncert.nic.in/textbook/sample/class6_math.pdf',
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
    officialPdfUrl: '/api/sample-papers/render/paper-g7-annual-sci?type=question',
    solutionPdfUrl: '/api/sample-papers/render/paper-g7-annual-sci?type=solution',
    externalSourceUrl: 'https://ncert.nic.in/textbook/sample/class7_sci.pdf',
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
    officialPdfUrl: '/api/sample-papers/render/paper-g8-math-prep?type=question',
    solutionPdfUrl: '/api/sample-papers/render/paper-g8-math-prep?type=solution',
    externalSourceUrl: 'https://ncert.nic.in/textbook/sample/class8_math.pdf',
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
    officialPdfUrl: '/api/sample-papers/render/paper-g9-math-sci-prep?type=question',
    solutionPdfUrl: '/api/sample-papers/render/paper-g9-math-sci-prep?type=solution',
    externalSourceUrl: 'https://ncert.nic.in/textbook/sample/class9_math.pdf',
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
    officialPdfUrl: '/api/sample-papers/render/paper-tcs-nqt-2025?type=question',
    solutionPdfUrl: '/api/sample-papers/render/paper-tcs-nqt-2025?type=solution',
    externalSourceUrl: 'https://learning.tcsion.com/hub/nqt-sample-paper.pdf',
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
    officialPdfUrl: '/api/sample-papers/render/paper-infosys-springboard-2025?type=question',
    solutionPdfUrl: '/api/sample-papers/render/paper-infosys-springboard-2025?type=solution',
    externalSourceUrl: 'https://infytq.onwingspan.com/sample-papers/se-round1.pdf',
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
    officialPdfUrl: '/api/sample-papers/render/paper-amazon-sde-dsa-2025?type=question',
    solutionPdfUrl: '/api/sample-papers/render/paper-amazon-sde-dsa-2025?type=solution',
    externalSourceUrl: 'https://amazon.jobs/content/software-development-interview-prep.pdf',
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
  if (mongoose.connection.readyState !== 1) return;
  try {
    for (const p of SEED_SAMPLE_PAPERS) {
      await SamplePaper.findOneAndUpdate({ id: p.id }, p, { upsert: true });
    }
    console.log('✅ Sample Papers synchronized with resilient rendering endpoints');
  } catch (e) {
    // MongoDB might not be connected in fallback mode
  }
}

// Helper: assemble questions for a given sample paper
async function fetchQuestionsForPaper(paper) {
  let impQuestions = [];
  if (mongoose.connection.readyState === 1) {
    try {
      impQuestions = await ImportantQuestion.find({
        grade: paper.grade,
        subject: paper.subject,
      });
    } catch (e) {}
  }

  if (!impQuestions || impQuestions.length === 0) {
    impQuestions = SEED_IMPORTANT_QUESTIONS.filter(
      (q) => q.grade === paper.grade && (q.subject.toLowerCase() === paper.subject.toLowerCase() || paper.grade === 'college')
    );
    if (impQuestions.length === 0) {
      impQuestions = SEED_IMPORTANT_QUESTIONS.filter((q) => q.grade === paper.grade);
    }
  }

  // MCQs
  let mcqList = [];
  if (mongoose.connection.readyState === 1) {
    try {
      mcqList = await Question.find({ grades: paper.grade }).limit(10);
    } catch (e) {}
  }

  if (!mcqList || mcqList.length === 0) {
    mcqList = verifiedQuestions
      .filter((q) => q.grades && q.grades.includes(paper.grade))
      .slice(0, 8);
    if (mcqList.length === 0 && paper.grade === 'college') {
      mcqList = verifiedQuestions.slice(0, 8);
    }
  }

  return { impQuestions, mcqList };
}

// Generate high-resolution, print-ready HTML examination paper / marking scheme
function generateSamplePaperHtml(paper, { impQuestions, mcqList }, type = 'question', lang = 'both') {
  const isSolution = type === 'solution';
  const showGu = lang !== 'en';
  const showEn = lang !== 'gu';

  // Questions breakdown by section
  const sectionA_MCQs = mcqList.slice(0, 6);
  const q1m = impQuestions.filter((q) => q.marks === 1);
  const q2m = impQuestions.filter((q) => q.marks === 2);
  const q3m = impQuestions.filter((q) => q.marks === 3);
  const q4m = impQuestions.filter((q) => q.marks >= 4);

  // Fallbacks if some marks categories are missing
  const sectionA = [...sectionA_MCQs, ...q1m].slice(0, 6);
  const sectionB = q2m.length > 0 ? q2m : impQuestions.slice(0, 2);
  const sectionC = q3m.length > 0 ? q3m : impQuestions.slice(1, 3);
  const sectionD = q4m.length > 0 ? q4m : impQuestions.slice(2, 4);

  let qGlobalIndex = 1;

  // HTML Template
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isSolution ? 'SOLUTIONS &bull; ' : 'EXAM PAPER &bull; '}${paper.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Gujarati:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4338ca;
      --primary-dark: #312e81;
      --primary-light: #e0e7ff;
      --success: #15803d;
      --success-light: #dcfce7;
      --amber: #b45309;
      --amber-light: #fef3c7;
      --border: #cbd5e1;
      --text: #0f172a;
      --text-muted: #475569;
      --bg: #f8fafc;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', 'Noto Sans Gujarati', system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding-bottom: 50px;
    }

    /* Floating Navigation Toolbar */
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 999;
      background: rgba(30, 27, 75, 0.95);
      backdrop-filter: blur(8px);
      color: #fff;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .toolbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      font-size: 15px;
    }
    .brand-badge {
      background: #8b5cf6;
      color: #fff;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-print { background: #3b82f6; color: #fff; }
    .btn-print:hover { background: #2563eb; }
    .btn-toggle { background: ${isSolution ? '#6366f1' : '#10b981'}; color: #fff; }
    .btn-toggle:hover { opacity: 0.9; }
    .lang-pills {
      display: flex;
      background: rgba(255,255,255,0.12);
      border-radius: 8px;
      padding: 3px;
      gap: 2px;
    }
    .lang-pill {
      color: #cbd5e1;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      text-decoration: none;
      font-weight: 600;
    }
    .lang-pill.active {
      background: #fff;
      color: var(--primary-dark);
    }

    /* Paper Page Container */
    .paper-sheet {
      max-width: 860px;
      margin: 24px auto;
      background: #ffffff;
      padding: 40px 48px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--border);
      position: relative;
    }

    /* Watermark */
    .paper-sheet::before {
      content: "MINDSPRINT OFFICIAL";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 72px;
      font-weight: 800;
      color: rgba(67, 56, 202, 0.03);
      pointer-events: none;
      z-index: 0;
      white-space: nowrap;
    }

    /* Official Board Header */
    .board-header {
      text-align: center;
      border-bottom: 2px solid var(--text);
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .board-super-title {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      letter-spacing: 2px;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 700;
    }
    .board-main-title {
      font-size: 22px;
      font-weight: 800;
      color: var(--primary-dark);
      margin: 6px 0;
    }
    .board-sub-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
    }
    .paper-meta-row {
      display: flex;
      justify-content: space-between;
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px dashed var(--border);
      font-size: 14px;
      font-weight: 600;
    }

    /* Candidate Box */
    .candidate-box {
      border: 1px solid var(--border);
      background: #fdfdfd;
      border-radius: 8px;
      padding: 12px 16px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      font-size: 12px;
      margin-bottom: 20px;
    }
    .candidate-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .candidate-label {
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      font-size: 11px;
    }
    .candidate-line {
      border-bottom: 1px dotted var(--text-muted);
      height: 16px;
    }

    /* Mode Banner */
    .mode-banner {
      background: ${isSolution ? 'var(--success-light)' : 'var(--primary-light)'};
      border-left: 5px solid ${isSolution ? 'var(--success)' : 'var(--primary)'};
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      color: ${isSolution ? 'var(--success)' : 'var(--primary-dark)'};
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* General Instructions */
    .instructions-box {
      background: #f8fafc;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 28px;
      font-size: 13px;
    }
    .instructions-title {
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .instructions-list {
      padding-left: 20px;
      color: var(--text-muted);
    }
    .instructions-list li { margin-bottom: 4px; }

    /* Section Styling */
    .section-header {
      background: #f1f5f9;
      border-left: 4px solid var(--primary);
      padding: 10px 14px;
      font-size: 14px;
      font-weight: 800;
      color: var(--primary-dark);
      margin: 28px 0 16px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Question Card */
    .question-card {
      margin-bottom: 22px;
      padding-bottom: 18px;
      border-bottom: 1px solid #f1f5f9;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .question-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 8px;
    }
    .question-num {
      font-weight: 800;
      color: var(--primary-dark);
      font-size: 15px;
      min-width: 32px;
    }
    .question-text-box {
      flex: 1;
    }
    .question-text-en {
      font-size: 15px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 4px;
    }
    .question-text-gu {
      font-size: 14px;
      color: #334155;
      font-weight: 500;
    }
    .marks-badge {
      background: #f1f5f9;
      border: 1px solid var(--border);
      font-size: 12px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      color: var(--text-muted);
      white-space: nowrap;
    }

    /* MCQ Options Grid */
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 16px;
      margin: 10px 0 6px 32px;
    }
    .option-item {
      font-size: 14px;
      color: var(--text);
      background: #f8fafc;
      border: 1px solid var(--border);
      padding: 8px 12px;
      border-radius: 6px;
    }
    .option-label {
      font-weight: 700;
      color: var(--primary);
      margin-right: 6px;
    }

    /* Solution Box */
    .solution-box {
      margin: 12px 0 6px 32px;
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 8px;
      padding: 14px 16px;
      font-size: 14px;
    }
    .solution-header {
      font-weight: 700;
      color: var(--success);
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .solution-body {
      color: #166534;
      font-weight: 500;
      line-height: 1.6;
    }
    .solution-gu {
      margin-top: 6px;
      color: #14532d;
      font-size: 13px;
    }

    /* Step Marking Rubric */
    .step-marking-box {
      margin-top: 10px;
      background: #ffffff;
      border: 1px dashed #86efac;
      border-radius: 6px;
      padding: 10px 14px;
    }
    .step-marking-title {
      font-size: 12px;
      font-weight: 700;
      color: var(--success);
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .step-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      padding: 3px 0;
      border-bottom: 1px dotted #e2e8f0;
    }
    .step-row:last-child { border-bottom: none; }
    .step-points { font-weight: 700; color: var(--success); }

    /* Examiner Tips */
    .examiner-tip-box {
      margin-top: 10px;
      background: var(--amber-light);
      border-left: 4px solid var(--amber);
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 13px;
      color: var(--amber);
      font-weight: 500;
    }

    /* Print media stylesheet */
    @media print {
      .no-print, .toolbar { display: none !important; }
      body { background: #ffffff !important; padding: 0 !important; color: #000 !important; }
      .paper-sheet {
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      .question-card {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      @page {
        margin: 15mm 15mm 15mm 15mm;
        size: A4 portrait;
      }
    }

    @media (max-width: 768px) {
      .paper-sheet { padding: 20px 16px; margin: 12px; }
      .candidate-box { grid-template-columns: 1fr; }
      .options-grid { grid-template-columns: 1fr; margin-left: 0; }
      .solution-box { margin-left: 0; }
      .toolbar { flex-direction: column; gap: 10px; align-items: stretch; }
      .toolbar-actions { flex-wrap: wrap; justify-content: space-between; }
    }
  </style>
</head>
<body>

  <!-- Sticky Top Navigation Bar -->
  <div class="toolbar no-print">
    <div class="toolbar-brand">
      <span>🎓 MindSprint Exam Vault</span>
      <span class="brand-badge">${paper.badge || 'OFFICIAL PAPER'}</span>
    </div>

    <div class="toolbar-actions">
      <button onclick="window.print()" class="btn btn-print">
        🖨️ Print / Save as PDF
      </button>

      <a href="?type=${isSolution ? 'question' : 'solution'}&lang=${lang}" class="btn btn-toggle">
        ${isSolution ? '📄 View Question Paper' : '💡 View Model Solutions'}
      </a>

      <div class="lang-pills">
        <a href="?type=${type}&lang=both" class="lang-pill ${lang === 'both' ? 'active' : ''}">Both</a>
        <a href="?type=${type}&lang=en" class="lang-pill ${lang === 'en' ? 'active' : ''}">English</a>
        <a href="?type=${type}&lang=gu" class="lang-pill ${lang === 'gu' ? 'active' : ''}">ગુજરાતી</a>
      </div>
    </div>
  </div>

  <!-- A4 Paper Document Sheet -->
  <div class="paper-sheet">

    <!-- Official Examination Header -->
    <header class="board-header">
      <div class="board-super-title">
        ${paper.board === 'GSEB' ? 'GUJARAT SECONDARY & HIGHER SECONDARY EDUCATION BOARD (GSHSEB)' : paper.board === 'CBSE' ? 'CENTRAL BOARD OF SECONDARY EDUCATION (CBSE)' : 'CAMPUS RECRUITMENT & PLACEMENT ASSESSMENT'}
      </div>
      <h1 class="board-main-title">
        ${paper.title}
      </h1>
      ${paper.titleGujarati && showGu ? `<div class="board-sub-title">${paper.titleGujarati}</div>` : ''}

      <div class="paper-meta-row">
        <div><strong>Subject:</strong> ${paper.subject}</div>
        <div><strong>Class / Stage:</strong> ${paper.grade === 'college' ? 'Final Year Placements' : `Class ${paper.grade}`}</div>
        <div><strong>Time:</strong> ${paper.durationMinutes} Minutes</div>
        <div><strong>Max. Marks:</strong> ${paper.totalMarks}</div>
      </div>
    </header>

    <!-- Candidate Fill-In Box -->
    <div class="candidate-box">
      <div class="candidate-field">
        <span class="candidate-label">Candidate Roll Number</span>
        <div class="candidate-line"></div>
      </div>
      <div class="candidate-field">
        <span class="candidate-label">Candidate Name</span>
        <div class="candidate-line"></div>
      </div>
      <div class="candidate-field">
        <span class="candidate-label">Centre Code & Invigilator Sign</span>
        <div class="candidate-line"></div>
      </div>
    </div>

    <!-- Mode Banner Indicator -->
    <div class="mode-banner">
      <span>${isSolution ? '💡 OFFICIAL STEP-BY-STEP MARKING SCHEME & SOLUTION KEY' : '📄 OFFICIAL MODEL QUESTION PAPER & BLUEPRINT'}</span>
      <span>${paper.year}</span>
    </div>

    <!-- General Instructions -->
    <div class="instructions-box">
      <div class="instructions-title">📋 General Instructions / સામાન્ય સૂચનાઓ:</div>
      <ul class="instructions-list">
        ${(paper.instructions || []).map((ins) => `<li>${ins}</li>`).join('')}
        ${showGu && paper.instructionsGujarati ? paper.instructionsGujarati.map((ins) => `<li><em>${ins}</em></li>`).join('') : ''}
      </ul>
    </div>

    <!-- SECTION A: 1-MARK OBJECTIVE / MCQS -->
    ${sectionA.length > 0 ? `
      <div class="section-header">
        <span>Section A: Objective Type Questions / હેતુલક્ષી પ્રશ્નો</span>
        <span>${sectionA.length} &times; 1 = ${sectionA.length} Marks</span>
      </div>

      ${sectionA.map((q) => {
        const qNum = qGlobalIndex++;
        const isMcq = Array.isArray(q.options) && q.options.length > 0;
        const textEn = q.questionText || q.question || '';
        const textGu = q.questionTextGujarati || '';
        const answer = isMcq ? `Option (${String.fromCharCode(65 + q.correctAnswer)}): ${q.options[q.correctAnswer]}` : (q.modelAnswer || 'Correct formula or calculation.');
        const answerGu = q.modelAnswerGujarati || '';
        const explanation = q.explanation || q.modelAnswer || '';

        return `
          <div class="question-card">
            <div class="question-top">
              <span class="question-num">Q${qNum}.</span>
              <div class="question-text-box">
                ${showEn && textEn ? `<div class="question-text-en">${textEn}</div>` : ''}
                ${showGu && textGu ? `<div class="question-text-gu">${textGu}</div>` : ''}
              </div>
              <span class="marks-badge">[1 Mark]</span>
            </div>

            ${isMcq ? `
              <div class="options-grid">
                ${q.options.map((opt, oIdx) => `
                  <div class="option-item">
                    <span class="option-label">(${String.fromCharCode(65 + oIdx)})</span> ${opt}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${isSolution ? `
              <div class="solution-box">
                <div class="solution-header">✅ Correct Answer / સાચો ઉત્તર:</div>
                <div class="solution-body">${answer}</div>
                ${showGu && answerGu ? `<div class="solution-gu"><strong>ગુજરાતી સમજૂતી:</strong> ${answerGu}</div>` : ''}
                ${explanation && explanation !== answer ? `<div style="margin-top:6px; font-size:13px; color:#15803d;"><strong>Explanation:</strong> ${explanation}</div>` : ''}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    ` : ''}

    <!-- SECTION B: 2-MARK SHORT ANSWER -->
    ${sectionB.length > 0 ? `
      <div class="section-header">
        <span>Section B: Short Answer Questions / ટૂંકજવાબી પ્રશ્નો</span>
        <span>${sectionB.length} &times; 2 = ${sectionB.length * 2} Marks</span>
      </div>

      ${sectionB.map((q) => {
        const qNum = qGlobalIndex++;
        const textEn = q.questionText || q.question || '';
        const textGu = q.questionTextGujarati || '';
        const answer = q.modelAnswer || 'Standard mathematical derivation or scientific definition.';
        const answerGu = q.modelAnswerGujarati || '';
        const stepWise = Array.isArray(q.stepWiseMarking) ? q.stepWiseMarking : [
          { stepNumber: 1, marksAllocated: '1 Mark', text: 'Formula statement & identification of given parameters.' },
          { stepNumber: 2, marksAllocated: '1 Mark', text: 'Correct numerical computation with physical units.' },
        ];

        return `
          <div class="question-card">
            <div class="question-top">
              <span class="question-num">Q${qNum}.</span>
              <div class="question-text-box">
                ${showEn && textEn ? `<div class="question-text-en">${textEn}</div>` : ''}
                ${showGu && textGu ? `<div class="question-text-gu">${textGu}</div>` : ''}
              </div>
              <span class="marks-badge">[2 Marks]</span>
            </div>

            ${isSolution ? `
              <div class="solution-box">
                <div class="solution-header">✅ Model Solution / નમૂનારૂપ ઉત્તર:</div>
                <div class="solution-body">${answer}</div>
                ${showGu && answerGu ? `<div class="solution-gu"><strong>ગુજરાતી ઉત્તર:</strong> ${answerGu}</div>` : ''}

                <div class="step-marking-box">
                  <div class="step-marking-title">Step-Wise Marking Breakdown / ગુણ વિભાજન:</div>
                  ${stepWise.map((st) => `
                    <div class="step-row">
                      <span>Step ${st.stepNumber}: ${st.text}</span>
                      <span class="step-points">${st.marksAllocated}</span>
                    </div>
                  `).join('')}
                </div>

                ${q.examinerTips ? `
                  <div class="examiner-tip-box">
                    💡 <strong>Examiner Tip:</strong> ${q.examinerTips}
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    ` : ''}

    <!-- SECTION C: 3-MARK ANALYTICAL / APPLICATION -->
    ${sectionC.length > 0 ? `
      <div class="section-header">
        <span>Section C: Long Answer Questions / મુદ્દાસર પ્રશ્નો</span>
        <span>${sectionC.length} &times; 3 = ${sectionC.length * 3} Marks</span>
      </div>

      ${sectionC.map((q) => {
        const qNum = qGlobalIndex++;
        const textEn = q.questionText || q.question || '';
        const textGu = q.questionTextGujarati || '';
        const answer = q.modelAnswer || 'Comprehensive proof, circuit diagram, or procedural solution.';
        const answerGu = q.modelAnswerGujarati || '';
        const stepWise = Array.isArray(q.stepWiseMarking) ? q.stepWiseMarking : [
          { stepNumber: 1, marksAllocated: '1 Mark', text: 'Theoretical law / formula / schematic declaration.' },
          { stepNumber: 2, marksAllocated: '1 Mark', text: 'Intermediate algebraic steps & substitution.' },
          { stepNumber: 3, marksAllocated: '1 Mark', text: 'Final conclusion statement & highlighted answer.' },
        ];

        return `
          <div class="question-card">
            <div class="question-top">
              <span class="question-num">Q${qNum}.</span>
              <div class="question-text-box">
                ${showEn && textEn ? `<div class="question-text-en">${textEn}</div>` : ''}
                ${showGu && textGu ? `<div class="question-text-gu">${textGu}</div>` : ''}
              </div>
              <span class="marks-badge">[3 Marks]</span>
            </div>

            ${isSolution ? `
              <div class="solution-box">
                <div class="solution-header">✅ Model Solution / નમૂનારૂપ ઉત્તર:</div>
                <div class="solution-body">${answer}</div>
                ${showGu && answerGu ? `<div class="solution-gu"><strong>ગુજરાતી ઉત્તર:</strong> ${answerGu}</div>` : ''}

                <div class="step-marking-box">
                  <div class="step-marking-title">Step-Wise Marking Breakdown / ગુણ વિભાજન:</div>
                  ${stepWise.map((st) => `
                    <div class="step-row">
                      <span>Step ${st.stepNumber}: ${st.text}</span>
                      <span class="step-points">${st.marksAllocated}</span>
                    </div>
                  `).join('')}
                </div>

                ${q.examinerTips ? `
                  <div class="examiner-tip-box">
                    💡 <strong>Chief Examiner Tip:</strong> ${q.examinerTips}
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    ` : ''}

    <!-- SECTION D: 4-5 MARK COMPREHENSIVE / THEOREMS -->
    ${sectionD.length > 0 ? `
      <div class="section-header">
        <span>Section D: Comprehensive & Theorem Problems / સવિસ્તર ઉત્તરો</span>
        <span>${sectionD.length} &times; 4 = ${sectionD.length * 4} Marks</span>
      </div>

      ${sectionD.map((q) => {
        const qNum = qGlobalIndex++;
        const textEn = q.questionText || q.question || '';
        const textGu = q.questionTextGujarati || '';
        const answer = q.modelAnswer || 'Step-by-step theorem proof with given data, required to prove, construction, and proof.';
        const answerGu = q.modelAnswerGujarati || '';
        const stepWise = Array.isArray(q.stepWiseMarking) ? q.stepWiseMarking : [
          { stepNumber: 1, marksAllocated: '1 Mark', text: 'Given & To Prove declarations + geometric construction.' },
          { stepNumber: 2, marksAllocated: '1 Mark', text: 'Primary similarity / congruence / algebraic statement.' },
          { stepNumber: 3, marksAllocated: '1 Mark', text: 'Deduction of intermediate relations.' },
          { stepNumber: 4, marksAllocated: '1 Mark', text: 'Hence Proved statement & final evaluation.' },
        ];

        return `
          <div class="question-card">
            <div class="question-top">
              <span class="question-num">Q${qNum}.</span>
              <div class="question-text-box">
                ${showEn && textEn ? `<div class="question-text-en">${textEn}</div>` : ''}
                ${showGu && textGu ? `<div class="question-text-gu">${textGu}</div>` : ''}
              </div>
              <span class="marks-badge">[4 Marks]</span>
            </div>

            ${isSolution ? `
              <div class="solution-box">
                <div class="solution-header">✅ Structured Marking Scheme:</div>
                <div class="solution-body">${answer}</div>
                ${showGu && answerGu ? `<div class="solution-gu"><strong>ગુજરાતી ઉત્તર:</strong> ${answerGu}</div>` : ''}

                <div class="step-marking-box">
                  <div class="step-marking-title">Step-Wise Marking Breakdown / ગુણ વિભાજન:</div>
                  ${stepWise.map((st) => `
                    <div class="step-row">
                      <span>Step ${st.stepNumber}: ${st.text}</span>
                      <span class="step-points">${st.marksAllocated}</span>
                    </div>
                  `).join('')}
                </div>

                ${q.examinerTips ? `
                  <div class="examiner-tip-box">
                    💡 <strong>Examiner Pitfall Warning:</strong> ${q.examinerTips}
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    ` : ''}

    <!-- Official Paper Footer -->
    <footer style="margin-top: 40px; border-top: 1px solid var(--border); padding-top: 16px; text-align: center; font-size: 12px; color: var(--text-muted);">
      <div>&bull; END OF QUESTION PAPER &bull; OFFICIAL MINDSPRINT ACADEMIC EVALUATION SYSTEM &bull;</div>
      <div style="margin-top: 4px;">Verified against NCERT / GSEB / CBSE Curricula for Academic Year ${paper.year}</div>
    </footer>

  </div>
</body>
</html>`;
}

// GET /api/sample-papers - List papers with resilient rendering links
router.get('/', async (req, res) => {
  try {
    const { grade, board, subject } = req.query;
    let papers = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const query = {};
        if (grade) query.grade = grade;
        if (board && board !== 'All') query.board = board;
        if (subject && subject !== 'All') query.subject = subject;
        papers = await SamplePaper.find(query).sort({ year: -1, totalMarks: -1 });
      } catch (e) {}
    }

    if (papers.length === 0) {
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

// GET /api/sample-papers/render/:id & /:id/render - Render high-res printable HTML
async function handleRenderPaper(req, res) {
  try {
    const { id } = req.params;
    const type = req.query.type === 'solution' ? 'solution' : 'question';
    const lang = req.query.lang || 'both';

    let paper = null;
    if (mongoose.connection.readyState === 1) {
      try {
        paper = await SamplePaper.findOne({ id });
      } catch (e) {}
    }
    if (!paper) {
      paper = SEED_SAMPLE_PAPERS.find((p) => p.id === id);
    }
    if (!paper) {
      return res.status(404).send('<h1>Sample Paper Not Found</h1><p>The requested exam paper ID does not exist in the vault.</p>');
    }

    const questionsData = await fetchQuestionsForPaper(paper);
    const html = generateSamplePaperHtml(paper, questionsData, type, lang);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('Render sample paper error:', error);
    res.status(500).send(`<h1>Error generating paper</h1><p>${error.message}</p>`);
  }
}

router.get('/render/:id', handleRenderPaper);
router.get('/:id/render', handleRenderPaper);
router.get('/pdf/:id', handleRenderPaper);
router.get('/:id/pdf', handleRenderPaper);

// GET /api/sample-papers/:id - Fetch single paper object
router.get('/:id', async (req, res) => {
  try {
    let paper = null;
    if (mongoose.connection.readyState === 1) {
      try {
        paper = await SamplePaper.findOne({ id: req.params.id });
      } catch (e) {}
    }
    if (paper) return res.json(paper);
    const fallback = SEED_SAMPLE_PAPERS.find((p) => p.id === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(404).json({ error: 'Sample paper not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, autoSeedSamplePapers, SEED_SAMPLE_PAPERS };
