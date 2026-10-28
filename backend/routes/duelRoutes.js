const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DuelRoom = require('../models/DuelRoom');
const Question = require('../models/Question');
const User = require('../models/User');

// In-memory room cache for offline/local resilience
const inMemoryRooms = new Map();

// Grade-aware localized peer fallback cohort
const COHORT_PEERS = {
  school: [
    { name: 'Kavya Trivedi', avatar: '👩‍🎓', schoolOrCollege: 'Sheth C.N. Vidyalaya Ahmedabad' },
    { name: 'Harsh Vardhan', avatar: '🧑‍🎓', schoolOrCollege: 'Kendriya Vidyalaya Ahmedabad Cantt' },
    { name: 'Niyati Joshi', avatar: '👩‍🔬', schoolOrCollege: 'Gyanmanjari Vidyapith Bhavnagar' },
    { name: 'Meet Dave', avatar: '🧑‍💻', schoolOrCollege: 'St. Kabir High School Vadodara' },
    { name: 'Tanvi Shah', avatar: '👩‍🎓', schoolOrCollege: 'Zydus School for Excellence Ahmedabad' },
    { name: 'Pranav Solanki', avatar: '👨‍🎓', schoolOrCollege: 'Utkarsh Vidyalaya Rajkot' },
  ],
  college: [
    { name: 'Aarav Patel', avatar: '🧑‍🎓', schoolOrCollege: 'LDCE Ahmedabad' },
    { name: 'Priya Sharma', avatar: '👩‍🎓', schoolOrCollege: 'VGEC Chandkheda' },
    { name: 'Rohan Mehta', avatar: '👨‍🎓', schoolOrCollege: 'DA-IICT Gandhinagar' },
    { name: 'Ananya Desai', avatar: '👩‍🔬', schoolOrCollege: 'Nirma University' },
    { name: 'Devendra Shah', avatar: '🧑‍💻', schoolOrCollege: 'BVM Engineering Anand' },
    { name: 'Isha Singhania', avatar: '👩‍💻', schoolOrCollege: 'IIT Gandhinagar' },
  ],
};

// Helper: Fetch 5 real questions for grade & subject
async function getQuestionsForDuel(grade, subject) {
  const isSchool = grade && grade !== 'college';

  const defaultSchoolDuelQuestions = [
    {
      id: 101,
      questionText: 'ત્રિકોણના ત્રણેય ખૂણાઓનો સરવાળો કેટલો થાય છે?',
      questionTextGujarati: 'ત્રિકોણના ત્રણેય ખૂણાઓનો સરવાળો કેટલો થાય છે?',
      category: 'ગણિત',
      categoryGujarati: 'ગણિત',
      options: ['90°', '180°', '270°', '360°'],
      optionsGujarati: ['90°', '180°', '270°', '360°'],
      correctAnswer: 1,
      explanation: 'ત્રિકોણના અંદરના ત્રણેય ખૂણાઓનો સરવાળો હંમેશાં 180° થાય છે.',
      explanationGujarati: 'ત્રિકોણના અંદરના ત્રણેય ખૂણાઓનો સરવાળો હંમેશાં 180° થાય છે.',
    },
    {
      id: 102,
      questionText: 'વનસ્પતિમાં પ્રકાશસંશ્લેષણ માટે સૂર્યપ્રકાશ શોષતું લીલું રંજકદ્રવ્ય કયું છે?',
      questionTextGujarati: 'વનસ્પતિમાં પ્રકાશસંશ્લેષણ માટે સૂર્યપ્રકાશ શોષતું લીલું રંજકદ્રવ્ય કયું છે?',
      category: 'વિજ્ઞાન',
      categoryGujarati: 'વિજ્ઞાન',
      options: ['ક્લોરોફિલ (હરિદ્રવ્ય)', 'હિમોગ્લોબિન', 'કેરોટીન', 'એન્થોસાયનિન'],
      optionsGujarati: ['ક્લોરોફિલ (હરિદ્રવ્ય)', 'હિમોગ્લોબિન', 'કેરોટીન', 'એન્થોસાયનિન'],
      correctAnswer: 0,
      explanation: 'ક્લોરોફિલ (હરિદ્રવ્ય) સૂર્યપ્રકાશનું શોષણ કરી ખોરાક બનાવવામાં મદદ કરે છે.',
      explanationGujarati: 'ક્લોરોફિલ (હરિદ્રવ્ય) સૂર્યપ્રકાશનું શોષણ કરી ખોરાક બનાવવામાં મદદ કરે છે.',
    },
    {
      id: 103,
      questionText: 'વિશાળ જાહેર સ્નાનાગાર સિંધુ સંસ્કૃતિના કયા પ્રાચીન નગરમાંથી મળી આવ્યું હતું?',
      questionTextGujarati: 'વિશાળ જાહેર સ્નાનાગાર સિંધુ સંસ્કૃતિના કયા પ્રાચીન નગરમાંથી મળી આવ્યું હતું?',
      category: 'સામાજિક વિજ્ઞાન',
      categoryGujarati: 'સામાજિક વિજ્ઞાન',
      options: ['ઇજિપ્ત', 'મોહેં-જો-દડો (હડપ્પા)', 'મેસોપોટેમિયા', 'રોમ'],
      optionsGujarati: ['ઇજિપ્ત', 'મોહેં-જો-દડો (હડપ્પા)', 'મેસોપોટેમિયા', 'રોમ'],
      correctAnswer: 1,
      explanation: 'મોહેં-જો-દડો ખાતેથી વિશાળ જાહેર સ્નાનાગારના અવશેષો મળી આવ્યા હતા.',
      explanationGujarati: 'મોહેં-જો-દડો ખાતેથી વિશાળ જાહેર સ્નાનાગારના અવશેષો મળી આવ્યા હતા.',
    },
    {
      id: 104,
      questionText: 'કિંમત શોધો: (-12) + (-8) = ?',
      questionTextGujarati: 'કિંમત શોધો: (-12) + (-8) = ?',
      category: 'ગણિત',
      categoryGujarati: 'ગણિત',
      options: ['-4', '+20', '-20', '+4'],
      optionsGujarati: ['-4', '+20', '-20', '+4'],
      correctAnswer: 2,
      explanation: '(-12) + (-8) = -20.',
      explanationGujarati: '(-12) + (-8) = -20.',
    },
    {
      id: 105,
      questionText: 'બલ્બ પ્રકાશિત કરવા માટે સતત વિદ્યુત પ્રવાહ વહેવા દેતો પરિપથ કયો છે?',
      questionTextGujarati: 'બલ્બ પ્રકાશિત કરવા માટે સતત વિદ્યુત પ્રવાહ વહેવા દેતો પરિપથ કયો છે?',
      category: 'વિજ્ઞાન',
      categoryGujarati: 'વિજ્ઞાન',
      options: ['ખુલ્લો પરિપથ', 'બંધ પરિપથ', 'શોર્ટ સર્કિટ', 'તૂટેલો પરિપથ'],
      optionsGujarati: ['ખુલ્લો પરિપથ', 'બંધ પરિપથ', 'શોર્ટ સર્કિટ', 'તૂટેલો પરિપથ'],
      correctAnswer: 1,
      explanation: 'બંધ પરિપથ વિદ્યુત પ્રવાહના વહન માટે અવિરત માર્ગ પૂરો પાડે છે.',
      explanationGujarati: 'બંધ પરિપથ વિદ્યુત પ્રવાહના વહન માટે અવિરત માર્ગ પૂરો પાડે છે.',
    },
  ];

  const defaultCollegeDuelQuestions = [
    {
      id: 101,
      questionText: 'What is the sum of angles in a triangle?',
      category: 'Mathematics',
      options: ['90°', '180°', '270°', '360°'],
      correctAnswer: 1,
      explanation: 'The interior angles of a triangle always sum to 180°.',
    },
    {
      id: 102,
      questionText: 'Which green pigment in plants traps sunlight for photosynthesis?',
      category: 'Science',
      options: ['Chlorophyll', 'Hemoglobin', 'Carotene', 'Anthocyanin'],
      correctAnswer: 0,
      explanation: 'Chlorophyll traps sunlight for photosynthesis.',
    },
    {
      id: 103,
      questionText: 'Which ancient civilization built the Great Bath at Mohenjo-daro?',
      category: 'Social Science',
      options: ['Egyptian', 'Indus Valley (Harappan)', 'Mesopotamian', 'Roman'],
      correctAnswer: 1,
      explanation: 'The Indus Valley Civilization built the Great Bath.',
    },
    {
      id: 104,
      questionText: 'Evaluate: (-12) + (-8) = ?',
      category: 'Mathematics',
      options: ['-4', '+20', '-20', '+4'],
      correctAnswer: 2,
      explanation: '(-12) + (-8) = -20.',
    },
    {
      id: 105,
      questionText: 'What type of electric circuit allows continuous current flow to light a bulb?',
      category: 'Science',
      options: ['Open circuit', 'Closed circuit', 'Short circuit', 'Broken circuit'],
      correctAnswer: 1,
      explanation: 'A closed circuit provides an unbroken path.',
    },
  ];

  if (mongoose.connection.readyState !== 1) {
    return isSchool ? defaultSchoolDuelQuestions : defaultCollegeDuelQuestions;
  }

  try {
    const filter = { grades: grade };
    if (subject && subject !== 'All') {
      filter.$or = [
        { subject: { $regex: subject, $options: 'i' } },
        { category: { $regex: subject, $options: 'i' } },
        { categoryGujarati: { $regex: subject, $options: 'i' } },
      ];
    }

    let questions = await Question.find(filter).lean();

    if (!questions || questions.length < 5) {
      const broader = await Question.find({ grades: grade }).lean();
      if (broader && broader.length > 0) {
        questions = broader;
      }
    }

    if (!questions || questions.length === 0) {
      questions = await Question.find({}).lean();
    }

    if (!questions || questions.length === 0) {
      return isSchool ? defaultSchoolDuelQuestions : defaultCollegeDuelQuestions;
    }

    // Shuffle and pick 5
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5).map((q, idx) => ({
      id: q.id || idx + 1,
      questionText: isSchool && q.questionTextGujarati ? q.questionTextGujarati : q.questionText,
      questionTextGujarati: q.questionTextGujarati || q.questionText,
      category: isSchool && (q.categoryGujarati || q.category) ? (q.categoryGujarati || q.category) : (q.subject || q.category || 'General'),
      options: isSchool && q.optionsGujarati && q.optionsGujarati.length > 0 ? q.optionsGujarati : (q.options || ['Option A', 'Option B', 'Option C', 'Option D']),
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: isSchool && q.explanationGujarati ? q.explanationGujarati : (q.explanation || 'Review fundamental concepts for this question.'),
      explanationGujarati: q.explanationGujarati || q.explanation,
    }));
  } catch (err) {
    console.warn('Error fetching duel questions from DB:', err.message);
    return isSchool ? defaultSchoolDuelQuestions : defaultCollegeDuelQuestions;
  }
}

// POST /api/duels/create - Host creates a private 1v1 duel room
router.post('/create', async (req, res) => {
  try {
    const { host, grade = '10', subject = 'All' } = req.body;

    if (!host || !host.name) {
      return res.status(400).json({ success: false, error: 'Host user details required' });
    }

    // Generate unique 4-digit room code
    let roomCode = '';
    let exists = true;
    let attempts = 0;
    while (exists && attempts < 10) {
      roomCode = Math.floor(1000 + Math.random() * 9000).toString();
      if (inMemoryRooms.has(roomCode)) {
        exists = true;
      } else if (mongoose.connection.readyState === 1) {
        exists = await DuelRoom.exists({ roomCode, status: { $in: ['waiting', 'ready', 'active'] } });
      } else {
        exists = false;
      }
      attempts++;
    }

    const questions = await getQuestionsForDuel(grade, subject);

    const roomData = {
      roomCode,
      grade,
      subject,
      status: 'waiting',
      host: {
        name: host.name,
        email: host.email || '',
        avatar: host.avatar || '🧑‍🎓',
        schoolOrCollege: host.schoolOrCollege || (grade === 'college' ? 'Engineering Campus' : 'Gujarat High School'),
        score: 0,
        currentRound: 0,
        ready: true,
      },
      guest: null,
      questions,
      createdAt: new Date(),
    };

    inMemoryRooms.set(roomCode, roomData);

    if (mongoose.connection.readyState === 1) {
      try {
        const newRoom = new DuelRoom(roomData);
        await newRoom.save();
      } catch (_) {}
    }

    res.json({
      success: true,
      roomCode,
      room: roomData,
    });
  } catch (err) {
    console.error('Error creating duel room:', err);
    res.status(500).json({ success: false, error: 'Failed to create duel room' });
  }
});

// POST /api/duels/join - Guest joins an existing room via 4-digit PIN
router.post('/join', async (req, res) => {
  try {
    const { roomCode, guest } = req.body;

    if (!roomCode || !guest || !guest.name) {
      return res.status(400).json({ success: false, error: 'Room code and guest profile are required' });
    }

    let room = inMemoryRooms.get(roomCode);
    if (!room && mongoose.connection.readyState === 1) {
      room = await DuelRoom.findOne({ roomCode });
    }

    if (!room) {
      return res.status(404).json({ success: false, error: 'Room PIN not found or has expired. Please check the code.' });
    }

    if (room.status === 'completed' || room.status === 'abandoned') {
      return res.status(400).json({ success: false, error: 'This duel match has already ended.' });
    }

    if (room.guest && room.guest.name && room.guest.email !== guest.email) {
      return res.status(400).json({ success: false, error: 'This duel room is already full (2/2 players).' });
    }

    room.guest = {
      name: guest.name,
      email: guest.email || '',
      avatar: guest.avatar || '👩‍🎓',
      schoolOrCollege: guest.schoolOrCollege || (room.grade === 'college' ? 'Peer College' : 'Peer High School'),
      score: 0,
      currentRound: 0,
      ready: true,
    };
    room.status = 'active';

    inMemoryRooms.set(roomCode, room);

    if (mongoose.connection.readyState === 1 && typeof room.save === 'function') {
      await room.save();
    }

    res.json({
      success: true,
      room,
    });
  } catch (err) {
    console.error('Error joining duel room:', err);
    res.status(500).json({ success: false, error: 'Failed to join duel room' });
  }
});

// GET /api/duels/room/:roomCode - Poll room state & opponent score
router.get('/room/:roomCode', async (req, res) => {
  try {
    const { roomCode } = req.params;
    let room = inMemoryRooms.get(roomCode);

    if (!room && mongoose.connection.readyState === 1) {
      room = await DuelRoom.findOne({ roomCode });
      if (room) inMemoryRooms.set(roomCode, room);
    }

    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    res.json({
      success: true,
      room,
    });
  } catch (err) {
    console.error('Error fetching duel room:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch room' });
  }
});

// POST /api/duels/room/:roomCode/score - Submit round score in live duel
router.post('/room/:roomCode/score', async (req, res) => {
  try {
    const { roomCode } = req.params;
    const { role = 'host', pointsEarned = 0, roundIndex = 0 } = req.body;

    let room = inMemoryRooms.get(roomCode);
    if (!room && mongoose.connection.readyState === 1) {
      room = await DuelRoom.findOne({ roomCode });
    }

    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    if (role === 'host') {
      room.host.score = (room.host.score || 0) + pointsEarned;
      room.host.currentRound = roundIndex + 1;
    } else {
      if (room.guest) {
        room.guest.score = (room.guest.score || 0) + pointsEarned;
        room.guest.currentRound = roundIndex + 1;
      }
    }

    // Check if match completed (both reached 5 rounds)
    if (room.host.currentRound >= 5 && room.guest && room.guest.currentRound >= 5) {
      room.status = 'completed';
    }

    inMemoryRooms.set(roomCode, room);

    if (mongoose.connection.readyState === 1 && typeof room.save === 'function') {
      await room.save();
    }

    res.json({
      success: true,
      room,
      opponentScore: role === 'host' ? (room.guest ? room.guest.score : 0) : room.host.score,
    });
  } catch (err) {
    console.error('Error updating duel score:', err);
    res.status(500).json({ success: false, error: 'Failed to update duel score' });
  }
});

// GET /api/duels/random-match - Find open room or dynamic peer from database
router.get('/random-match', async (req, res) => {
  try {
    const { grade = '10', subject = 'All', email = '', name = 'You' } = req.query;

    // 1. Check for open waiting room hosted by another player
    if (mongoose.connection.readyState === 1) {
      const openRoom = await DuelRoom.findOne({
        grade,
        status: 'waiting',
        'host.email': { $ne: email },
      }).sort({ createdAt: -1 });

      if (openRoom) {
        openRoom.guest = {
          name: name || 'Challenger',
          email,
          avatar: '🧑‍🎓',
          schoolOrCollege: grade === 'college' ? 'College of Engineering' : 'State Board School',
          score: 0,
          currentRound: 0,
          ready: true,
        };
        openRoom.status = 'active';
        await openRoom.save();

        return res.json({
          success: true,
          isMultiplayerRoom: true,
          roomCode: openRoom.roomCode,
          role: 'guest',
          opponent: openRoom.host,
          questions: openRoom.questions,
        });
      }
    }

    // 2. Dynamic peer sampling from MongoDB registered Users
    let dynamicPeer = null;
    if (mongoose.connection.readyState === 1) {
      try {
        const realUsers = await User.find({
          email: { $ne: email },
          grade: grade === 'college' ? 'college' : { $in: [grade, '10', '9', '8'] },
        }).limit(15).lean();

        if (realUsers && realUsers.length > 0) {
          const picked = realUsers[Math.floor(Math.random() * realUsers.length)];
          const schoolAffiliation = picked.board
            ? `${picked.board} Model School (${picked.medium || 'English'})`
            : grade === 'college'
            ? 'Institute of Technology'
            : 'High School Ahmedabad';

          dynamicPeer = {
            name: picked.name,
            avatar: ['🧑‍🎓', '👩‍🎓', '👩‍🔬', '🧑‍💻', '👨‍🎓'][Math.floor(Math.random() * 5)],
            schoolSchool: schoolAffiliation,
            college: schoolAffiliation,
          };
        }
      } catch (_) {}
    }

    // Fallback peer if database has limited user records
    if (!dynamicPeer) {
      const cohortList = grade === 'college' ? COHORT_PEERS.college : COHORT_PEERS.school;
      const picked = cohortList[Math.floor(Math.random() * cohortList.length)];
      dynamicPeer = {
        name: picked.name,
        avatar: picked.avatar,
        schoolSchool: picked.schoolOrCollege,
        college: picked.schoolOrCollege,
      };
    }

    // 3. Load 5 authentic curriculum questions from MongoDB
    const questions = await getQuestionsForDuel(grade, subject);

    res.json({
      success: true,
      isMultiplayerRoom: false,
      roomCode: null,
      role: 'solo',
      opponent: dynamicPeer,
      questions,
    });
  } catch (err) {
    console.error('Error finding random match:', err);
    res.status(500).json({ success: false, error: 'Matchmaking failed' });
  }
});

module.exports = router;
