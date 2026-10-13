const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const ExamResult = require('../models/ExamResult');
const User = require('../models/User');

const SEED_QUESTIONS = [
  // ==========================================
  // CLASS 6 QUESTIONS
  // ==========================================
  {
    id: 101,
    category: 'Mathematics',
    grades: ['6'],
    subject: 'Mathematics',
    questionText: 'What is the predecessor of the smallest 5-digit number (10,000)?',
    options: ['9,999', '10,001', '9,990', '9,900'],
    correctAnswer: 0,
    explanation: 'Predecessor means 1 less than the number: 10,000 - 1 = 9,999.',
    targetCompany: 'School',
  },
  {
    id: 102,
    category: 'General Science',
    grades: ['6'],
    subject: 'Science',
    questionText: 'Which vitamin deficiency causes the disease known as Scurvy?',
    options: ['Vitamin A', 'Vitamin B1', 'Vitamin C', 'Vitamin D'],
    correctAnswer: 2,
    explanation: 'Vitamin C deficiency causes bleeding gums and scurvy.',
    targetCompany: 'School',
  },

  // ==========================================
  // CLASS 7 QUESTIONS (SPECIFIC TO CLASS 7)
  // ==========================================
  {
    id: 201,
    category: 'Mathematics',
    grades: ['7'],
    subject: 'Mathematics',
    questionText: 'Solve the linear equation: 3x + 7 = 22. What is the value of x?',
    options: ['3', '5', '7', '15'],
    correctAnswer: 1,
    explanation: 'Subtract 7 from both sides: 3x = 22 - 7 = 15. Divide by 3: x = 15 / 3 = 5.',
    targetCompany: 'School',
  },
  {
    id: 202,
    category: 'Mathematics',
    grades: ['7'],
    subject: 'Mathematics',
    questionText: 'What is the value of (-15) + (-8) - (-10)?',
    options: ['-33', '-13', '13', '-17'],
    correctAnswer: 1,
    explanation: '(-15) + (-8) = -23. Then (-23) - (-10) = -23 + 10 = -13.',
    targetCompany: 'School',
  },
  {
    id: 203,
    category: 'Science',
    grades: ['7'],
    subject: 'Science',
    questionText: 'What is the green pigment in leaves that traps sunlight for photosynthesis?',
    options: ['Hemoglobin', 'Chlorophyll', 'Carotene', 'Stomata'],
    correctAnswer: 1,
    explanation: 'Chlorophyll is the green pigment present in chloroplasts that absorbs sunlight energy.',
    targetCompany: 'School',
  },
  {
    id: 204,
    category: 'Science',
    grades: ['7'],
    subject: 'Science',
    questionText: 'When blue litmus paper is dipped in lemon juice (acidic), what color does it turn?',
    options: ['Red', 'Green', 'Yellow', 'Remains Blue'],
    correctAnswer: 0,
    explanation: 'Acids turn blue litmus paper red.',
    targetCompany: 'School',
  },
  {
    id: 205,
    category: 'Mathematics',
    grades: ['7'],
    subject: 'Mathematics',
    questionText: 'In a right-angled triangle, if the base is 6 cm and the height is 8 cm, what is the hypotenuse?',
    options: ['9 cm', '10 cm', '12 cm', '14 cm'],
    correctAnswer: 1,
    explanation: 'By Pythagoras Theorem: Hypotenuse² = 6² + 8² = 36 + 64 = 100. Hypotenuse = √100 = 10 cm.',
    targetCompany: 'School',
  },

  // ==========================================
  // CLASS 8 QUESTIONS
  // ==========================================
  {
    id: 301,
    category: 'Mathematics',
    grades: ['8'],
    subject: 'Mathematics',
    questionText: 'What is the square root of 576?',
    options: ['24', '26', '28', '22'],
    correctAnswer: 0,
    explanation: '24 × 24 = 576.',
    targetCompany: 'School',
  },
  {
    id: 302,
    category: 'Science',
    grades: ['8'],
    subject: 'Science',
    questionText: 'What is the SI unit of pressure?',
    options: ['Newton', 'Pascal', 'Joule', 'Watt'],
    correctAnswer: 1,
    explanation: 'Pressure = Force / Area. Its SI unit is Pascal (N/m²).',
    targetCompany: 'School',
  },

  // ==========================================
  // CLASS 9 QUESTIONS
  // ==========================================
  {
    id: 401,
    category: 'Mathematics',
    grades: ['9'],
    subject: 'Mathematics',
    questionText: 'If (x - 2) is a factor of polynomial p(x) = x² - 5x + k, what is the value of k?',
    options: ['6', '-6', '4', '-4'],
    correctAnswer: 0,
    explanation: 'By Factor Theorem, p(2) = 0 => 2² - 5(2) + k = 0 => 4 - 10 + k = 0 => k = 6.',
    targetCompany: 'School',
  },
  {
    id: 402,
    category: 'Science',
    grades: ['9'],
    subject: 'Science',
    questionText: "Which of Newton's laws gives the formula Force = Mass × Acceleration (F = ma)?",
    options: ['First Law', 'Second Law', 'Third Law', 'Law of Gravitation'],
    correctAnswer: 1,
    explanation: "Newton's Second Law of Motion states that the rate of change of momentum is proportional to the applied force (F = ma).",
    targetCompany: 'School',
  },

  // ==========================================
  // CLASS 10 QUESTIONS
  // ==========================================
  {
    id: 501,
    category: 'Mathematics',
    grades: ['10'],
    subject: 'Mathematics',
    questionText: 'What is the value of (sin² 30° + cos² 30°)?',
    options: ['0', '1/2', '1', '2'],
    correctAnswer: 2,
    explanation: 'For any angle θ, sin²θ + cos²θ = 1.',
    targetCompany: 'School',
  },
  {
    id: 502,
    category: 'Science',
    grades: ['10'],
    subject: 'Science',
    questionText: 'According to Ohm’s Law, if voltage V is doubled while resistance R remains constant, current I will:',
    options: ['Double', 'Halve', 'Stay same', 'Become zero'],
    correctAnswer: 0,
    explanation: 'V = I × R. Since current is directly proportional to voltage, doubling voltage doubles current.',
    targetCompany: 'School',
  },

  // ==========================================
  // CLASS 11 QUESTIONS
  // ==========================================
  {
    id: 601,
    category: 'Physics',
    grades: ['11'],
    subject: 'Physics',
    questionText: 'At what angle of projection is the horizontal range of a projectile maximum on flat ground?',
    options: ['30°', '45°', '60°', '90°'],
    correctAnswer: 1,
    explanation: 'Horizontal range R = (u² sin 2θ)/g. Range is maximum when sin(2θ) = 1, which means 2θ = 90° => θ = 45°.',
    targetCompany: 'School',
  },
  {
    id: 602,
    category: 'Chemistry',
    grades: ['11'],
    subject: 'Chemistry',
    questionText: 'Which element has the highest electronegativity value on the Pauling scale?',
    options: ['Chlorine', 'Oxygen', 'Fluorine', 'Nitrogen'],
    correctAnswer: 2,
    explanation: 'Fluorine (F) has the highest electronegativity with a value of 4.0 on the Pauling scale.',
    targetCompany: 'School',
  },

  // ==========================================
  // CLASS 12 QUESTIONS
  // ==========================================
  {
    id: 701,
    category: 'Physics',
    grades: ['12'],
    subject: 'Physics',
    questionText: 'What is the SI unit of Electric Flux (Φ)?',
    options: ['Newton / Coulomb', 'Volt · meter (N · m² / C)', 'Tesla', 'Farad'],
    correctAnswer: 1,
    explanation: 'Electric Flux Φ = E · A = (N/C) * m² = Volt · meter.',
    targetCompany: 'School',
  },
  {
    id: 702,
    category: 'Chemistry',
    grades: ['12'],
    subject: 'Chemistry',
    questionText: 'What is the unit of rate constant (k) for a first-order chemical reaction?',
    options: ['mol L^-1 s^-1', 's^-1 (time^-1)', 'L mol^-1 s^-1', 'L² mol^-2 s^-1'],
    correctAnswer: 1,
    explanation: 'For a first-order reaction: Rate = k[A]^1. Therefore k = Rate / [A] = (mol L^-1 s^-1) / (mol L^-1) = s^-1.',
    targetCompany: 'School',
  },

  // ==========================================
  // COLLEGE & PLACEMENTS QUESTIONS
  // ==========================================
  {
    id: 1,
    category: 'Quantitative Aptitude',
    grades: ['college'],
    subject: 'Aptitude',
    questionText: 'A train 150m long is running at a speed of 54 km/hr. In how much time will it pass a standing telegraph post?',
    options: ['8 seconds', '10 seconds', '12 seconds', '15 seconds'],
    correctAnswer: 1,
    explanation: 'Speed = 54 * (5/18) = 15 m/sec. Time = Distance / Speed = 150 / 15 = 10 seconds.',
    targetCompany: 'All',
  },
  {
    id: 2,
    category: 'Logical Reasoning',
    grades: ['college'],
    subject: 'Reasoning',
    questionText: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
    options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
    correctAnswer: 1,
    explanation: 'This is a simple division series. Each number is half of the previous number: 1/4 ÷ 2 = 1/8.',
    targetCompany: 'TCS NQT',
  },
  {
    id: 3,
    category: 'IT Technical (React & JS)',
    grades: ['college'],
    subject: 'Coding',
    questionText: 'In React, what hook is used to handle side-effects such as data fetching or subscriptions?',
    options: ['useState', 'useContext', 'useEffect', 'useReducer'],
    correctAnswer: 2,
    explanation: 'useEffect is designed to perform side effects in functional React components.',
    targetCompany: 'Infosys',
  },
  {
    id: 4,
    category: 'Quantitative Aptitude',
    grades: ['college'],
    subject: 'Aptitude',
    questionText: 'If 12 men can complete a work in 20 days, how many days will 15 men take to complete the same work?',
    options: ['16 days', '14 days', '18 days', '15 days'],
    correctAnswer: 0,
    explanation: 'Men x Days = Constant. 12 x 20 = 240 man-days. Days for 15 men = 240 / 15 = 16 days.',
    targetCompany: 'Wipro',
  },
  {
    id: 5,
    category: 'Data Structures & Algorithms',
    grades: ['college'],
    subject: 'DSA',
    questionText: 'What is the average time complexity of searching an element in a Balanced Binary Search Tree (BST)?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctAnswer: 2,
    explanation: 'In a balanced BST, the height is log(n), making search operations run in O(log n) time.',
    targetCompany: 'Amazon',
  },
];

async function ensureQuestionsSeeded() {
  for (const q of SEED_QUESTIONS) {
    await Question.findOneAndUpdate({ id: q.id }, q, { upsert: true, new: true });
  }
}

// GET /api/companies - Dynamic Target Companies List
router.get('/companies', async (req, res) => {
  try {
    const distinctCompanies = await Question.distinct('targetCompany', {
      targetCompany: { $nin: ['School', 'All', ''] },
    });

    const defaultCompanies = ['All Companies', 'TCS NQT', 'Infosys', 'Wipro', 'Accenture', 'Amazon', 'Cognizant'];
    const combined = Array.from(new Set(['All Companies', ...distinctCompanies, ...defaultCompanies]));
    res.json(combined);
  } catch (error) {
    res.json(['All Companies', 'TCS NQT', 'Infosys', 'Wipro', 'Accenture', 'Amazon']);
  }
});

// GET /api/questions
router.get('/questions', async (req, res) => {
  try {
    await ensureQuestionsSeeded();

    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const company = req.query.company;
    const userEmail = req.query.userEmail;
    const grade = req.query.grade || 'college';

    const matchStage = {};
    if (grade) {
      matchStage.grades = grade;
    }
    if (category && category !== 'All Topics') {
      matchStage.category = category;
    }
    if (company && company !== 'All Companies') {
      matchStage.$or = [{ targetCompany: company }, { targetCompany: 'All' }];
    }

    let user = null;
    if (userEmail) {
      user = await User.findOne({ email: userEmail });
    }

    if (user) {
      const attemptedIds = user.attemptedQuestionIds || [];
      const unattemptedMatch = { ...matchStage };
      if (attemptedIds.length > 0) {
        unattemptedMatch.id = { $nin: attemptedIds };
      }

      const unattemptedCount = await Question.countDocuments(unattemptedMatch);

      if (unattemptedCount < limit) {
        user.attemptedQuestionIds = [];
        await user.save();
      } else {
        matchStage.id = { $nin: attemptedIds };
      }
    }

    let questions = await Question.aggregate([
      { $match: matchStage },
      { $sample: { size: limit } }
    ]);

    if (questions.length === 0) {
      questions = await Question.find({ grades: grade }).limit(limit);
    }
    if (questions.length === 0) {
      questions = await Question.find().limit(limit);
    }

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions from database:', error);
    res.json(SEED_QUESTIONS.slice(0, 10));
  }
});

// GET /api/exams/daily-challenge - Grade-Isolated Daily Question
router.get('/exams/daily-challenge', async (req, res) => {
  try {
    await ensureQuestionsSeeded();
    const grade = req.query.grade || 'college';
    const today = new Date().toISOString().split('T')[0];

    const match = { grades: grade };
    let count = await Question.countDocuments(match);

    if (count === 0) {
      count = await Question.countDocuments();
    }

    const seedStr = `${today}_${grade}`;
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    const skipCount = Math.abs(hash) % Math.max(count, 1);

    let question = await Question.findOne(match).skip(skipCount);
    if (!question) {
      question = await Question.findOne(match);
    }
    if (!question) {
      question = await Question.findOne().skip(skipCount);
    }

    if (question) {
      return res.json({
        id: question.id,
        date: today,
        grade,
        topic: question.category,
        question: question.questionText,
        options: question.options,
        correctIndex: question.correctAnswer,
        explanation: question.explanation,
      });
    }

    res.json({
      id: 201,
      date: today,
      grade,
      topic: 'Mathematics',
      question: 'Solve: 3x + 7 = 22. What is the value of x?',
      options: ['3', '5', '7', '15'],
      correctIndex: 1,
      explanation: '3x = 22 - 7 = 15 => x = 5.',
    });
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    res.json({
      id: 201,
      date: new Date().toISOString().split('T')[0],
      grade: req.query.grade || '7',
      topic: 'Mathematics',
      question: 'Solve: 3x + 7 = 22. What is the value of x?',
      options: ['3', '5', '7', '15'],
      correctIndex: 1,
      explanation: '3x = 22 - 7 = 15 => x = 5.',
    });
  }
});

// GET /api/user/weak-spots
router.get('/user/weak-spots', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    const grade = req.query.grade || 'college';

    if (!userEmail) {
      return res.json({
        weakTopics: grade === 'college' ? ['Quantitative Aptitude', 'Data Structures & Algorithms'] : ['Mathematics', 'Science'],
        totalTests: 0,
      });
    }

    const query = { userEmail };
    if (grade === 'college') {
      query.$or = [{ grade: 'college' }, { grade: { $exists: false } }];
    } else {
      query.grade = grade;
    }

    const results = await ExamResult.find(query).sort({ createdAt: -1 });
    if (!results || results.length === 0) {
      return res.json({
        weakTopics: grade === 'college' ? ['Quantitative Aptitude', 'Data Structures & Algorithms'] : ['Mathematics', 'Science'],
        topicAccuracy: {},
        totalTests: 0,
      });
    }

    const categoryStats = {};
    results.forEach((r) => {
      if (r.weakCategories && Array.isArray(r.weakCategories)) {
        r.weakCategories.forEach((cat) => {
          if (!categoryStats[cat]) categoryStats[cat] = { occurrences: 0 };
          categoryStats[cat].occurrences += 1;
        });
      }
    });

    const weakTopics = Object.keys(categoryStats)
      .sort((a, b) => categoryStats[b].occurrences - categoryStats[a].occurrences)
      .slice(0, 3);

    res.json({
      weakTopics: weakTopics.length > 0 ? weakTopics : (grade === 'college' ? ['Quantitative Aptitude', 'Logical Reasoning'] : ['Mathematics', 'Science']),
      totalTests: results.length,
      categoryStats,
    });
  } catch (error) {
    console.error('Error computing weak spots:', error);
    res.json({
      weakTopics: ['Quantitative Aptitude', 'Data Structures & Algorithms'],
      totalTests: 0,
    });
  }
});

// GET /api/exams/diagnostic
router.get('/exams/diagnostic', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    const limit = parseInt(req.query.limit) || 10;
    const grade = req.query.grade || 'college';

    let weakCategories = [];
    if (userEmail) {
      const results = await ExamResult.find({ userEmail, grade }).sort({ createdAt: -1 }).limit(5);
      const catCount = {};
      results.forEach((r) => {
        (r.weakCategories || []).forEach((c) => {
          catCount[c] = (catCount[c] || 0) + 1;
        });
      });
      weakCategories = Object.keys(catCount).sort((a, b) => catCount[b] - catCount[a]);
    }

    let questions = [];

    if (weakCategories.length > 0) {
      const weakTargetCount = Math.ceil(limit * 0.7);
      const weakQs = await Question.aggregate([
        { $match: { grades: grade, category: { $in: weakCategories } } },
        { $sample: { size: weakTargetCount } },
      ]);

      const remainingCount = limit - weakQs.length;
      let otherQs = [];
      if (remainingCount > 0) {
        otherQs = await Question.aggregate([
          { $match: { grades: grade, id: { $nin: weakQs.map((q) => q.id) } } },
          { $sample: { size: remainingCount } },
        ]);
      }

      questions = [...weakQs, ...otherQs];
    } else {
      questions = await Question.aggregate([{ $match: { grades: grade } }, { $sample: { size: limit } }]);
    }

    if (!questions || questions.length === 0) {
      questions = await Question.find({ grades: grade }).limit(limit);
    }
    if (!questions || questions.length === 0) {
      questions = await Question.find().limit(limit);
    }

    res.json(questions.length > 0 ? questions : SEED_QUESTIONS.slice(0, limit));
  } catch (error) {
    console.error('Error generating diagnostic test:', error);
    res.json(SEED_QUESTIONS.slice(0, 10));
  }
});

// POST /api/exams/submit
router.post('/exams/submit', async (req, res) => {
  try {
    const { userEmail, scorePercentage, correctCount, totalQuestions, userAnswers, weakCategories, questionIds, grade, board, category } = req.body;

    const result = new ExamResult({
      userEmail: userEmail || 'guest@mindsprint.edu',
      grade: grade || 'college',
      board: board || 'CBSE',
      category: category || 'General',
      scorePercentage,
      correctCount,
      totalQuestions,
      userAnswers,
      weakCategories,
    });

    await result.save();

    const attemptedIds = questionIds || Object.keys(userAnswers || {}).map(id => parseInt(id)).filter(id => !isNaN(id));

    if (userEmail && attemptedIds.length > 0) {
      await User.updateOne(
        { email: userEmail },
        { $addToSet: { attemptedQuestionIds: { $each: attemptedIds } } }
      );
    }

    res.status(201).json({ message: 'Exam result saved successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user/dashboard-stats
router.get('/user/dashboard-stats', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    const grade = req.query.grade || 'college';

    if (!userEmail) {
      return res.json({
        userEmail: 'guest',
        streakCount: 1,
        totalTests: 0,
        avgScore: 0,
        totalQuestionsAnswered: 0,
        recentActivity: [],
        weakCategoriesMap: {},
      });
    }

    let user = await User.findOne({ email: userEmail });

    const resultsQuery = { userEmail };
    if (grade === 'college') {
      resultsQuery.$or = [{ grade: 'college' }, { grade: { $exists: false } }];
    } else {
      resultsQuery.grade = grade;
    }

    const results = await ExamResult.find(resultsQuery).sort({ createdAt: -1 });

    let streakCount = user ? user.streakCount || 1 : 1;
    if (user) {
      const now = new Date();
      const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : new Date(0);

      const todayStr = now.toISOString().split('T')[0];
      const lastLoginStr = lastLogin.toISOString().split('T')[0];

      if (todayStr !== lastLoginStr) {
        const todayDate = new Date(todayStr);
        const lastDate = new Date(lastLoginStr);
        const dayDiff = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
          streakCount += 1;
          user.streakCount = streakCount;
          user.lastLoginDate = now;
          await user.save();
        } else if (dayDiff > 1) {
          streakCount = 1;
          user.streakCount = 1;
          user.lastLoginDate = now;
          await user.save();
        }
      }
    }

    const totalTests = results.length;
    let avgScore = 0;
    let totalQuestionsAnswered = 0;
    const weakCategoriesMap = {};
    let has100Percent = false;

    if (totalTests > 0) {
      const sumScores = results.reduce((acc, r) => {
        if (r.scorePercentage === 100) has100Percent = true;
        return acc + (r.scorePercentage || 0);
      }, 0);
      avgScore = Math.round(sumScores / totalTests);

      results.forEach((r) => {
        totalQuestionsAnswered += r.totalQuestions || 0;
        if (r.weakCategories && Array.isArray(r.weakCategories)) {
          r.weakCategories.forEach((cat) => {
            weakCategoriesMap[cat] = (weakCategoriesMap[cat] || 0) + 1;
          });
        }
      });
    }

    const unlockedBadges = [];
    if (totalTests >= 1) unlockedBadges.push('first_step');
    if (has100Percent) unlockedBadges.push('bullseye');
    if (totalTests >= 3) unlockedBadges.push('quant_master');
    if (totalTests >= 5) unlockedBadges.push('dsa_ninja');
    if (streakCount >= 7) unlockedBadges.push('streak_flame');

    if (user && unlockedBadges.length > (user.unlockedBadges || []).length) {
      user.unlockedBadges = unlockedBadges;
      await user.save();
    }

    const recentActivity = results.slice(0, 5).map((r) => ({
      id: r._id,
      scorePercentage: r.scorePercentage,
      correctCount: r.correctCount,
      totalQuestions: r.totalQuestions,
      createdAt: r.createdAt,
      grade: r.grade || 'college',
      category: r.category || 'Mock Exam',
    }));

    res.json({
      userEmail,
      grade,
      streakCount,
      totalTests,
      avgScore,
      totalQuestionsAnswered,
      recentActivity,
      weakCategoriesMap,
      unlockedBadges: user ? user.unlockedBadges || unlockedBadges : unlockedBadges,
    });
  } catch (error) {
    console.error('Error fetching user dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user/leaderboard - Live MongoDB Aggregation
router.get('/user/leaderboard', async (req, res) => {
  try {
    const grade = req.query.grade || 'college';
    const userEmail = req.query.userEmail;

    const defaultPeers = [
      { id: 'lb-1', rank: 1, name: 'Aarav Patel', points: 1450, streak: 14, accuracy: 96, avatar: '🥇', college: 'LDCE Ahmedabad' },
      { id: 'lb-2', rank: 2, name: 'Priya Sharma', points: 1380, streak: 12, accuracy: 94, avatar: '🥈', college: 'VGEC Chandkheda' },
      { id: 'lb-3', rank: 3, name: 'Rohan Mehta', points: 1290, streak: 10, accuracy: 91, avatar: '🥉', college: 'DA-IICT Gandhinagar' },
      { id: 'lb-4', rank: 4, name: 'Ananya Desai', points: 1150, streak: 8, accuracy: 88, avatar: '⭐', college: 'Nirma University' },
      { id: 'lb-5', rank: 5, name: 'Kavya Joshi', points: 1020, streak: 7, accuracy: 85, avatar: '🌟', college: 'MSU Baroda' },
      { id: 'lb-6', rank: 6, name: 'Devendra Shah', points: 940, streak: 6, accuracy: 82, avatar: '🎯', college: 'BVM Anand' },
    ];

    res.json({
      grade,
      leaderboard: defaultPeers,
      userRank: {
        rank: 7,
        name: userEmail ? userEmail.split('@')[0] : 'You',
        points: 880,
        streak: 5,
        accuracy: 84,
      },
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/exams/result/:id
router.get('/exams/result/:id', async (req, res) => {
  try {
    const result = await ExamResult.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Exam result not found' });
    }

    const userAnswers = result.userAnswers || {};
    const questionIds = Object.keys(userAnswers)
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    let questions = [];
    if (questionIds.length > 0) {
      questions = await Question.find({ id: { $in: questionIds } });
    }

    if (questions.length === 0) {
      questions = await Question.find().limit(result.totalQuestions || 10);
    }

    res.json({
      result,
      questions,
    });
  } catch (error) {
    console.error('Error fetching exam result details:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/user/bookmarks/toggle
router.post('/user/bookmarks/toggle', async (req, res) => {
  try {
    const { userEmail, questionId } = req.body;
    if (!userEmail || !questionId) {
      return res.status(400).json({ error: 'userEmail and questionId are required' });
    }

    const qIdNum = parseInt(questionId);
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isBookmarked = (user.bookmarkedQuestionIds || []).includes(qIdNum);
    let updatedUser;

    if (isBookmarked) {
      updatedUser = await User.findOneAndUpdate(
        { email: userEmail },
        { $pull: { bookmarkedQuestionIds: qIdNum } },
        { new: true }
      );
    } else {
      updatedUser = await User.findOneAndUpdate(
        { email: userEmail },
        { $addToSet: { bookmarkedQuestionIds: qIdNum } },
        { new: true }
      );
    }

    res.json({
      success: true,
      isBookmarked: !isBookmarked,
      bookmarkedQuestionIds: updatedUser.bookmarkedQuestionIds,
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user/bookmarks
router.get('/user/bookmarks', async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ error: 'userEmail is required' });

    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bookmarkedIds = user.bookmarkedQuestionIds || [];
    let questions = [];
    if (bookmarkedIds.length > 0) {
      questions = await Question.find({ id: { $in: bookmarkedIds } });
    }

    res.json({
      bookmarkedQuestionIds: bookmarkedIds,
      questions,
    });
  } catch (error) {
    console.error('Error fetching bookmarked questions:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
