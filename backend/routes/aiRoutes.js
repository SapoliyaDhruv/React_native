const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ImportantQuestion = require('../models/ImportantQuestion');
const Question = require('../models/Question');
const Formula = require('../models/Formula');

// POST /api/ai/solve-doubt - Gemini Multimodal Vision + Intelligent Curriculum Solver
router.post('/solve-doubt', async (req, res) => {
  try {
    const { query, imageBase64, grade = '10', medium = 'English', subject } = req.body;
    const isGujarati = medium === 'Gujarati';

    // 1. If GEMINI_API_KEY is configured in environment, call Google Gemini 1.5/2.0 API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const parts = [];
        if (imageBase64) {
          const cleanB64 = imageBase64.replace(/^data:image\/\w+;base64,/, '').trim();
          parts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanB64,
            },
          });
        }

        const promptText = `
You are an expert CBSE and GSEB textbook teacher and doubt-solving tutor.
Target Student Grade: ${grade}
Language Medium: ${medium}
Subject: ${subject || 'Auto-detect'}

Question or Query from Student:
"${query || 'Extract the question from the image and solve it completely step-by-step.'}"

Provide a structured, step-by-step textbook solution in strict JSON format matching this schema:
{
  "title": "Short title of the question or concept (under 50 chars)",
  "titleGujarati": "Gujarati title of question",
  "subject": "Mathematics / Science / Social Science / Physics / Chemistry / etc.",
  "chapter": "Probable Chapter Name",
  "marks": 3,
  "question": "Full transcribed question text",
  "questionGujarati": "Question in Gujarati",
  "solution": "Step-by-step mathematical / conceptual explanation with final answer and units",
  "solutionGujarati": "Step-by-step explanation in Gujarati",
  "formulaOrKeywords": ["Formula 1", "Keyword 2", "Principle 3"],
  "examinerTips": "Examiner advice on common mistakes and how to score full marks in board exams",
  "videoTeacher": "MindSprint AI Faculty"
}
Output only valid parseable JSON. Do not include markdown code fences or backticks.
`;
        parts.push({ text: promptText });

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1200,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              return res.json({ success: true, solution: parsed, source: 'gemini' });
            }
          }
        } else {
          const errorBody = await geminiRes.text();
          console.warn('Gemini API returned error response:', geminiRes.status, errorBody);
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to curriculum knowledge graph:', geminiError.message);
      }
    }

    // 2. Intelligent Curriculum Knowledge Graph Solver
    // If no Gemini key or offline, search against MongoDB Questions, Important Questions & Formulas
    const cleanQuery = (query || '').toLowerCase().trim();
    const queryTokens = cleanQuery.split(/[\s,?.!]+/).filter((t) => t.length > 2);

    let matchedQuestion = null;

    // Search Important Questions
    if (queryTokens.length > 0 && mongoose.connection.readyState === 1) {
      const regexPattern = queryTokens.map((t) => `(?=.*${t})`).join('');
      try {
        matchedQuestion = await ImportantQuestion.findOne({
          grade,
          $or: [
            { questionText: { $regex: cleanQuery, $options: 'i' } },
            { questionTextGujarati: { $regex: cleanQuery, $options: 'i' } },
            { chapterTitle: { $regex: cleanQuery, $options: 'i' } },
          ],
        });
      } catch (_) {}
    }

    // Fallback search on Question collection
    if (!matchedQuestion && queryTokens.length > 0 && mongoose.connection.readyState === 1) {
      try {
        const mcqMatch = await Question.findOne({
          grades: grade,
          questionText: { $regex: cleanQuery, $options: 'i' },
        });
        if (mcqMatch) {
          matchedQuestion = {
            questionText: mcqMatch.questionText,
            questionTextGujarati: mcqMatch.questionTextGujarati || mcqMatch.questionText,
            subject: mcqMatch.subject || mcqMatch.category,
            chapterTitle: mcqMatch.category,
            marks: 2,
            modelAnswer: `${mcqMatch.explanation || 'Option ' + (mcqMatch.correctAnswer + 1) + ' is the correct answer.'} Correct Answer: ${mcqMatch.options ? mcqMatch.options[mcqMatch.correctAnswer] : ''}`,
            modelAnswerGujarati: mcqMatch.explanationGujarati || mcqMatch.explanation,
            stepWiseMarking: [{ text: 'Identification of core concept' }, { text: 'Correct solution calculation' }],
            examinerTips: 'Read all multiple-choice distractors carefully before selecting.',
          };
        }
      } catch (_) {}
    }

    // Search Formulas
    let matchedFormula = null;
    if (queryTokens.length > 0 && mongoose.connection.readyState === 1) {
      try {
        matchedFormula = await Formula.findOne({
          grades: grade,
          $or: [
            { title: { $regex: cleanQuery, $options: 'i' } },
            { formulas: { $elemMatch: { $regex: cleanQuery, $options: 'i' } } },
          ],
        });
      } catch (_) {}
    }

    if (matchedQuestion) {
      return res.json({
        success: true,
        source: 'curriculum_database',
        solution: {
          title: matchedQuestion.chapterTitle || cleanQuery.slice(0, 45) || 'Textbook Question Solution',
          titleGujarati: matchedQuestion.chapterTitleGujarati || 'પાઠ્યપુસ્તક પ્રશ્ન ઉકેલ',
          subject: matchedQuestion.subject || (grade === 'college' ? 'Aptitude & Technical' : 'Science'),
          chapter: matchedQuestion.chapterTitle || `Class ${grade} Curriculum`,
          marks: matchedQuestion.marks || 3,
          question: matchedQuestion.questionText,
          questionGujarati: matchedQuestion.questionTextGujarati || matchedQuestion.questionText,
          solution: matchedQuestion.modelAnswer,
          solutionGujarati: matchedQuestion.modelAnswerGujarati || matchedQuestion.modelAnswer,
          formulaOrKeywords: matchedFormula
            ? matchedFormula.formulas.slice(0, 3)
            : (matchedQuestion.stepWiseMarking || []).map((s) => s.text).slice(0, 4),
          examinerTips: matchedQuestion.examinerTips || 'Always box final numerical answers with appropriate SI units.',
          videoTeacher: 'Dr. Pathak Sir (MindSprint)',
        },
      });
    }

    // 3. Dynamic Pedagogical Breakdown based on Domain & Mathematical Inference
    const inferredSubject =
      cleanQuery.includes('math') || cleanQuery.includes('sum') || cleanQuery.includes('solve') || cleanQuery.includes('area') || cleanQuery.includes('root') || cleanQuery.includes('ratio') || cleanQuery.includes('algebra') || cleanQuery.includes('triangle')
        ? 'Mathematics'
        : cleanQuery.includes('acid') || cleanQuery.includes('light') || cleanQuery.includes('energy') || cleanQuery.includes('force') || cleanQuery.includes('cell') || cleanQuery.includes('atom') || cleanQuery.includes('circuit')
        ? 'Science'
        : cleanQuery.includes('code') || cleanQuery.includes('search') || cleanQuery.includes('algo') || cleanQuery.includes('database') || cleanQuery.includes('time complexity')
        ? 'Computer Science'
        : cleanQuery.includes('history') || cleanQuery.includes('civilization') || cleanQuery.includes('constitution')
        ? 'Social Science'
        : subject || (grade === 'college' ? 'Aptitude & Technical' : 'Curriculum Deep Dive');

    const displayPrompt = cleanQuery.length > 0 ? query : 'Textbook Question from Captured Image';

    return res.json({
      success: true,
      source: 'pedagogical_engine',
      solution: {
        title: `${displayPrompt.slice(0, 40)} • Step-by-Step AI Breakdown`,
        titleGujarati: `${displayPrompt.slice(0, 40)} • વિગતવાર AI ઉકેલ`,
        subject: inferredSubject,
        chapter: `Class ${grade} • ${inferredSubject} Revision`,
        marks: 3,
        question: `How to systematically solve and master: "${displayPrompt}"?`,
        questionGujarati: `"${displayPrompt}" પ્રશ્નનો ક્રમબદ્ધ ઉકેલ અને વિભાવના:`,
        solution: `Detailed Pedagogical Solution:\n\n1. Given Information & Setup:\nCarefully extract all given parameters from the problem statement and identify the target variable.\n\n2. Governing Principles & Equations:\nApply the fundamental theorem of ${inferredSubject}. For numerical problems, write the standard formula with all variables defined.\n\n3. Step-by-Step Mathematical Derivation:\nSubstitute given values into the equation. Ensure unit conversions (e.g., cm to m, km/h to m/s) are handled consistently.\n\n4. Final Result & Conclusion:\nState the final answer clearly with bold highlights and mandatory SI units.`,
        solutionGujarati: `વિગતવાર ઉકેલ:\n\n૧. પ્રશ્નની માહિતી અને વિગતો:\nપ્રશ્નમાં આપેલી તમામ કિંમતો નોંધી જે શોધવાનું છે તે પદ નક્કી કરો.\n\n૨. લાગુ પડતા સૂત્રો અને નિયમો:\n${inferredSubject} ના મૂળભૂત નિયમો અને પ્રમાણિત સૂત્રો દર્શાવો.\n\n૩. સ્ટેપ-બાય-સ્ટેપ ગણતરી:\nસૂત્રમાં કિંમતો મૂકી સાદુરૂપ આપો. એકમોની સમાનતા ચકાસો.\n\n૪. અંતિમ પરિણામ:\nઅંતિમ જવાબને ચોરસ બોક્સમાં યોગ્ય SI એકમ સાથે દર્શાવો.`,
        formulaOrKeywords: [
          `${inferredSubject} Axioms`,
          'Dimensional Analysis',
          'Standard SI Units',
          'Step-Wise Derivation',
        ],
        examinerTips: `In board examinations, writing the step-wise formulas and highlighting the final value fetches maximum marks according to official marking schemes.`,
        videoTeacher: 'MindSprint Academic Faculty',
      },
    });
  } catch (error) {
    console.error('Error in AI doubt solver:', error);
    res.status(500).json({ error: error.message || 'Internal server error in doubt solver' });
  }
});

// POST /api/ai/evaluate-viva - AI Viva & Oral Exam Assessment Engine
router.post('/evaluate-viva', async (req, res) => {
  try {
    const {
      question = '',
      userAnswer = '',
      expectedKeywords = [],
      winningAnswer = '',
      grade = '10',
      medium = 'English',
    } = req.body;

    const trimmedAnswer = (userAnswer || '').trim();
    const isGujarati = medium === 'Gujarati';

    if (!trimmedAnswer || trimmedAnswer.length < 3) {
      return res.json({
        success: true,
        score: 0,
        rating: isGujarati ? 'જવાબ આપેલ નથી' : 'No Answer Provided',
        matchedKeywords: [],
        missingKeywords: expectedKeywords,
        feedback: isGujarati
          ? 'કૃપા કરીને મૌખિક પ્રશ્નનો જવાબ બોલો અથવા ટાઈપ કરો.'
          : 'Please speak or type your verbal explanation before submitting.',
        examinerTip: isGujarati
          ? 'મૌખિક પરીક્ષામાં પ્રશ્નનો ઉત્તર આપ્યા વગર ન બેસો. જે પણ વિભાવના યાદ હોય તે રજૂ કરો.'
          : 'Never leave a viva question unanswered. Attempt to state whatever foundational concepts you remember.',
      });
    }

    // 1. If GEMINI_API_KEY is configured, evaluate using Google Gemini AI
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const promptText = `
You are a senior board viva examiner (CBSE / GSEB) and technical interview panel lead.
Target Candidate Grade: ${grade}
Language Medium: ${medium}

Question Asked:
"${question}"

Expected Core Concepts / Keywords:
${expectedKeywords.join(', ')}

Model Winning Response:
"${winningAnswer}"

Candidate's Spoken Answer:
"${trimmedAnswer}"

Evaluate the candidate's answer with academic rigor. Rate the response strictly from 1 to 10 points based on:
1. Conceptual correctness and completeness (4 pts)
2. Coverage of key scientific / technical terms (3 pts)
3. Clarity and professional articulation (3 pts)

Output strict, parseable JSON matching this schema:
{
  "score": 8,
  "rating": "Outstanding / Solid Explanation / Partially Complete / Needs Work",
  "matchedKeywords": ["Keyword1", "Keyword2"],
  "missingKeywords": ["Keyword3"],
  "feedback": "2-3 concise sentences explaining strengths and what needs improvement",
  "examinerTip": "Direct examiner advice for scoring full marks in oral defense"
}
Output only the JSON object without markdown fences or code blocks.
`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 600,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              return res.json({
                success: true,
                source: 'gemini',
                score: Math.min(10, Math.max(1, parsed.score || 5)),
                rating: parsed.rating || 'Evaluated',
                matchedKeywords: parsed.matchedKeywords || [],
                missingKeywords: parsed.missingKeywords || [],
                feedback: parsed.feedback || 'Good attempt.',
                examinerTip: parsed.examinerTip || 'Maintain clear pacing and define keywords first.',
              });
            }
          }
        } else {
          const errorBody = await geminiRes.text();
          console.warn('Gemini viva API returned error response:', geminiRes.status, errorBody);
        }
      } catch (geminiError) {
        console.warn('Gemini viva evaluator fallback:', geminiError.message);
      }
    }

    // 2. Intelligent NLP Keyword & Semantic Rubric Engine (Fallback)
    const lowerAnswer = trimmedAnswer.toLowerCase();
    const matchedKeywords = [];
    const missingKeywords = [];

    expectedKeywords.forEach((kw) => {
      const cleanKw = kw.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
      const tokens = cleanKw.split(/\s+/).filter((t) => t.length > 2);
      const isPresent =
        lowerAnswer.includes(cleanKw) ||
        (tokens.length > 0 && tokens.some((tok) => lowerAnswer.includes(tok)));

      if (isPresent) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const matchRatio = expectedKeywords.length > 0
      ? matchedKeywords.length / expectedKeywords.length
      : 0.5;

    const wordCount = trimmedAnswer.split(/\s+/).length;
    const depthPoints = wordCount >= 18 ? 3 : Math.max(1, Math.round((wordCount / 18) * 3));
    const rawScore = Math.round(matchRatio * 7) + depthPoints;
    const finalScore = Math.min(10, Math.max(2, rawScore));

    let rating = 'Solid Explanation 👍';
    if (finalScore >= 9) rating = 'Outstanding Defense 🌟';
    else if (finalScore >= 7) rating = 'Good Explanation 👍';
    else if (finalScore >= 5) rating = 'Partially Complete ⚠️';
    else rating = 'Needs More Depth 📚';

    let feedback = '';
    if (matchedKeywords.length > 0) {
      feedback += `Strong grasp shown on: ${matchedKeywords.slice(0, 3).join(', ')}. `;
    }
    if (missingKeywords.length > 0) {
      feedback += `To achieve full marks, include concepts like: ${missingKeywords.slice(0, 2).join(', ')}.`;
    } else {
      feedback += 'Comprehensive response covering all required textbook points!';
    }

    const examinerTip = isGujarati
      ? 'મૌખિક પરીક્ષામાં વિભાવનાની ચોક્કસ વ્યાખ્યા અને વાસ્તવિક ઉદાહરણ આપવાથી પૂરા માર્ક્સ મળે છે.'
      : 'In oral exams and viva, stating the formal definition first before giving a real-world example secures top marks.';

    res.json({
      success: true,
      source: 'rubric_engine',
      score: finalScore,
      rating,
      matchedKeywords,
      missingKeywords,
      feedback,
      examinerTip,
    });
  } catch (error) {
    console.error('Error in viva evaluator:', error);
    res.status(500).json({ error: 'Failed to evaluate viva answer' });
  }
});

module.exports = router;

