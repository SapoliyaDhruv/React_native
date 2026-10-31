import sys

with open('backend/routes/examRoutes.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """// GET /api/exams/daily-challenge - Grade-Isolated Daily Question
router.get('/exams/daily-challenge', async (req, res) => {"""

idx = text.find(target)
if idx == -1:
    print("Target not found!")
    sys.exit(1)

# Find end of this route
end_target = "    res.json({\n      id: 201,\n      date: today,\n      grade,\n      topic: 'Mathematics',\n      question: 'Solve: 3x + 7 = 22. What is the value of x?',\n      options: ['3', '5', '7', '15'],\n      correctIndex: 1,\n      explanation: '3x = 22 - 7 = 15 => x = 5.',\n    });"
end_idx = text.find(end_target, idx)
if end_idx == -1:
    # try CRLF
    end_target = end_target.replace('\n', '\r\n')
    end_idx = text.find(end_target, idx)

if end_idx == -1:
    print("End target not found!")
    sys.exit(1)

replacement = """// GET /api/exams/daily-challenge - Grade-Isolated Daily Question
router.get('/exams/daily-challenge', async (req, res) => {
  try {
    const grade = req.query.grade || 'college';
    const isSchool = grade !== 'college';
    const today = new Date().toISOString().split('T')[0];

    const formatQuestionResponse = (q) => {
      const qText = isSchool && q.questionTextGujarati ? q.questionTextGujarati : q.questionText;
      const qOpts = isSchool && q.optionsGujarati && q.optionsGujarati.length > 0 ? q.optionsGujarati : q.options;
      const qTopic = isSchool && q.categoryGujarati ? q.categoryGujarati : (q.category || 'દૈનિક પડકાર');
      const qExpl = isSchool && q.explanationGujarati ? q.explanationGujarati : (q.explanation || 'વિગતવાર સમજૂતી ઉપલબ્ધ છે.');
      return {
        id: q.id,
        date: today,
        grade,
        topic: qTopic,
        question: qText,
        options: qOpts,
        correctIndex: q.correctAnswer !== undefined ? q.correctAnswer : 0,
        explanation: qExpl,
      };
    };

    if (mongoose.connection.readyState !== 1) {
      let pool = SEED_QUESTIONS.filter((q) => q.grades && q.grades.includes(grade));
      if (pool.length === 0) pool = SEED_QUESTIONS;
      const seedStr = `${today}_${grade}`;
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        hash = (hash << 5) - hash + seedStr.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % pool.length;
      return res.json(formatQuestionResponse(pool[index]));
    }

    await ensureQuestionsSeeded();

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
      return res.json(formatQuestionResponse(question));
    }

    res.json({
      id: 201,
      date: today,
      grade,
      topic: isSchool ? 'ગણિત (Mathematics)' : 'Quantitative Aptitude',
      question: isSchool ? 'સમીકરણ ઉકેલો: 3x + 7 = 22. તો x ની કિંમત કેટલી થાય?' : 'Solve: 3x + 7 = 22. What is the value of x?',
      options: ['3', '5', '7', '15'],
      correctIndex: 1,
      explanation: isSchool ? '3x = 22 - 7 = 15 => x = 15 / 3 = 5.' : '3x = 22 - 7 = 15 => x = 5.',
    });"""

new_text = text[:idx] + replacement + text[end_idx + len(end_target):]
with open('backend/routes/examRoutes.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Successfully replaced daily-challenge in backend/routes/examRoutes.js!")

