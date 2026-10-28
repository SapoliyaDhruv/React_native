import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { VoiceVivaPlayer } from '@/components/common/VoiceVivaPlayer';
import { ApiService } from '@/services/api';

interface MockQuestion {
  id: number;
  question: string;
  questionGujarati?: string;
  category: string;
  categoryGujarati?: string;
  expectedKeywords: string[];
  expectedKeywordsGujarati?: string[];
  winningAnswer: string;
  winningAnswerGujarati?: string;
  interviewerAdvice: string;
  interviewerAdviceGujarati?: string;
}

interface InterviewTrack {
  title: string;
  titleGujarati?: string;
  subtitle: string;
  subtitleGujarati?: string;
  icon: string;
  questions: MockQuestion[];
}

const SCHOOL_VIVA_TRACKS: Record<string, InterviewTrack> = {
  school_science: {
    title: 'Science & Lab Viva Voce',
    titleGujarati: 'વિજ્ઞાન મૌખિક કસોટી & પ્રયોગો (GSEB/CBSE)',
    subtitle: 'Photosynthesis, Circuits, Separation & Matter',
    subtitleGujarati: 'પ્રકાશસંશ્લેષણ, પરિપથ, પદાર્થોનું અલગીકરણ & સજીવો',
    icon: 'biotech',
    questions: [
      {
        id: 1,
        question: 'Explain the process of Photosynthesis and what are the 4 essential requirements for it.',
        questionGujarati: 'પ્રકાશસંશ્લેષણ (Photosynthesis) ની પ્રક્રિયા સમજાવો અને તેના માટે કયા ૪ ઘટકો જરૂરી છે?',
        category: 'Biology Viva',
        categoryGujarati: 'જીવવિજ્ઞાન મૌખિક',
        expectedKeywords: ['Chlorophyll', 'Sunlight', 'Water (H2O)', 'Carbon Dioxide (CO2)', 'Glucose & Oxygen'],
        expectedKeywordsGujarati: ['હરિતદ્રવ્ય (ક્લોરોફિલ)', 'સૂર્યપ્રકાશ', 'પાણી', 'કાર્બન ડાયોક્સાઈડ', 'ગ્લુકોઝ & ઓક્સિજન'],
        winningAnswer: 'Photosynthesis is the process by which green plants make their own food using Sunlight, Chlorophyll, Carbon Dioxide from air, and Water from soil. The reaction produces Glucose (food) and releases Oxygen gas into the atmosphere: 6CO2 + 6H2O + Sunlight -> C6H12O6 + 6O2.',
        winningAnswerGujarati: 'પ્રકાશસંશ્લેષણ એવી પ્રક્રિયા છે જેમાં લીલી વનસ્પતિ સૂર્યપ્રકાશ, પર્ણમાં રહેલા હરિતદ્રવ્ય (ક્લોરોફિલ), હવામાંથી કાર્બન ડાયોક્સાઈડ અને મૂળમાંથી પાણી મેળવી પોતાનો ખોરાક (ગ્લુકોઝ) બનાવે છે અને ઓક્સિજન વાયુ મુક્ત કરે છે.',
        interviewerAdvice: 'State the word equation clearly and mention that chlorophyll is present in chloroplasts of leaf cells.',
        interviewerAdviceGujarati: 'પરીક્ષક સમક્ષ પ્રક્રિયાનું સમીકરણ અને ઓક્સિજન મુક્ત થવાની બાબત સ્પષ્ટ રીતે રજૂ કરો.',
      },
      {
        id: 2,
        question: 'What is the difference between an Open Circuit and a Closed Circuit? Why do we use a switch?',
        questionGujarati: 'ખુલ્લો વિદ્યુત પરિપથ (Open Circuit) અને બંધ પરિપથ (Closed Circuit) વચ્ચે શો તફાવત છે? સ્વિચનું શું કાર્ય છે?',
        category: 'Physics Viva',
        categoryGujarati: 'ભૌતિક વિજ્ઞાન મૌખિક',
        expectedKeywords: ['Continuous Path', 'Current Flow', 'Switch Gap', 'Conductor', 'Bulb Glow'],
        expectedKeywordsGujarati: ['સતત માર્ગ', 'વીજપ્રવાહનું વહન', 'સ્વિચ', 'સુવાહક વાયર', 'બલ્બ પ્રકાશિત'],
        winningAnswer: 'A closed circuit is a complete unbroken loop allowing electric current to flow continuously from the positive terminal to negative terminal, making the bulb glow. An open circuit has a break or gap (switch OFF) so current cannot flow. A switch is a device used to manually complete or break the circuit safely.',
        winningAnswerGujarati: 'બંધ વિદ્યુત પરિપથ એ એવો પૂર્ણ માર્ગ છે જેમાં વીજપ્રવાહ સતત વહે છે અને બલ્બ પ્રગટે છે. ખુલ્લા પરિપથમાં માર્ગ તૂટેલો હોય છે જેથી વીજપ્રવાહ વહી શકતો નથી. સ્વિચ એ પરિપથને ચાલુ (બંધ પરિપથ) અથવા બંધ (ખુલ્લો પરિપથ) કરવાનું સાધન છે.',
        interviewerAdvice: 'Mention that current flows from the positive (+) terminal to the negative (-) terminal of the cell.',
        interviewerAdviceGujarati: 'પ્રવાહ ધન ધ્રુવથી ઋણ ધ્રુવ તરફ વહે છે તે મુદ્દો અચૂક બોલો.',
      },
      {
        id: 3,
        question: 'Name three methods of separating solid-liquid mixtures and give one real-life example of each.',
        questionGujarati: 'ઘન-પ્રવાહી મિશ્રણના અલગીકરણની ૩ પદ્ધતિઓના નામ આપો અને દરેકનું એક વાસ્તવિક ઉદાહરણ આપો.',
        category: 'Chemistry Viva',
        categoryGujarati: 'રસાયણ વિજ્ઞાન મૌખિક',
        expectedKeywords: ['Sedimentation & Decantation', 'Filtration', 'Evaporation', 'Salt from Sea Water', 'Tea Filter'],
        expectedKeywordsGujarati: ['નિક્ષેપન & નિતારણ', 'ગાળણ (Filtration)', 'બાષ્પીભવન', 'દરિયામાંથી મીઠું', 'ચા ની પત્તી ગાળવી'],
        winningAnswer: '1. Sedimentation & Decantation (settling mud in water and pouring clean water). 2. Filtration (separating tea leaves using a strainer or chalk powder with filter paper). 3. Evaporation (recovering salt from sea water when water evaporates under sunlight).',
        winningAnswerGujarati: '૧. નિક્ષેપન અને નિતારણ (ડોહળા પાણીમાંથી માટી નીચે બેસી ગયા બાદ ચોખ્ખું પાણી અલગ કરવું). ૨. ગાળણ (ગળણી વડે ચા ની પત્તી અલગ કરવી). ૩. બાષ્પીભવન (સૂર્યપ્રકાશમાં દરિયાના પાણીમાંથી મીઠું મેળવવું).',
        interviewerAdvice: 'Highlight the difference between insoluble impurities (filtration) and soluble impurities (evaporation).',
        interviewerAdviceGujarati: 'દ્રાવ્ય પદાર્થ (મીઠું) માટે બાષ્પીભવન અને અદ્રાવ્ય પદાર્થ (માટી) માટે ગાળણ વપરાય તે સ્પષ્ટ કરો.',
      },
    ],
  },
  school_math: {
    title: 'Maths Mental Logic & Concept Defense',
    titleGujarati: 'ગણિત મૌખિક ખ્યાલો અને નિયમો (GSEB/CBSE)',
    subtitle: 'HCF/LCM, Integers Number Line, Fractions & Geometry',
    subtitleGujarati: 'ગુ.સા.અ./લ.સા.અ., પૂર્ણાંકો, અપૂર્ણાંક & ભૂમિતિ',
    icon: 'calculate',
    questions: [
      {
        id: 1,
        question: 'What is the difference between Prime numbers and Composite numbers? Why is 1 neither?',
        questionGujarati: 'અવિભાજ્ય સંખ્યા (Prime) અને વિભાજ્ય સંખ્યા (Composite) વચ્ચે શો તફાવત છે? ૧ શા માટે બંનેમાં નથી?',
        category: 'Number Theory',
        categoryGujarati: 'સંખ્યા પરિચય',
        expectedKeywords: ['Exactly 2 Factors', 'More than 2 Factors', '1 and Itself', 'Smallest Prime is 2', 'Unique Number 1'],
        expectedKeywordsGujarati: ['માત્ર ૨ અવયવ', '૨ થી વધુ અવયવ', '૧ અને સંખ્યા પોતે', 'સૌથી નાની અવિભાજ્ય ૨', 'વિશિષ્ટ સંખ્યા ૧'],
        winningAnswer: 'A prime number has exactly two distinct factors: 1 and the number itself (e.g. 2, 3, 5, 7). A composite number has more than two factors (e.g. 4, 6, 8, 9). The number 1 has only one factor (itself), so by definition it is neither prime nor composite—it is a unique number.',
        winningAnswerGujarati: 'અવિભાજ્ય સંખ્યાને માત્ર બે જ અવયવ હોય છે: ૧ અને સંખ્યા પોતે (દા.ત. ૨, ૩, ૫, ૭). વિભાજ્ય સંખ્યાને બે થી વધુ અવયવ હોય છે (દા.ત. ૪, ૬, ૮, ૯). સંખ્યા ૧ ને માત્ર એક જ અવયવ (૧) હોવાથી તે અવિભાજ્ય પણ નથી અને વિભાજ્ય પણ નથી, તે વિશિષ્ટ સંખ્યા છે.',
        interviewerAdvice: 'Always emphasize that 2 is the ONLY even prime number.',
        interviewerAdviceGujarati: '૨ એ એકમાત્ર બેકી અવિભાજ્ય સંખ્યા છે તે યાદ રાખીને જણાવો.',
      },
      {
        id: 2,
        question: 'State the rule for adding two negative integers and multiplying two negative integers.',
        questionGujarati: 'બે ઋણ પૂર્ણાંકોનો સરવાળો કરવાનો અને બે ઋણ પૂર્ણાંકોનો ગુણાકાર કરવાનો નિયમ જણાવો.',
        category: 'Integers & Algebra',
        categoryGujarati: 'પૂર્ણાંક સંખ્યાઓ',
        expectedKeywords: ['(-a) + (-b) = -(a+b)', 'Negative Sum', '(-a) × (-b) = +(ab)', 'Positive Product', 'Number Line Left'],
        expectedKeywordsGujarati: ['સરવાળો ઋણ રહે', 'ગુણાકાર ધન બને', '(-૩) + (-૫) = -૮', '(-૩) × (-૫) = +૧૫', 'સંખ્યારેખા'],
        winningAnswer: '1. Adding two negative integers: Add their absolute values and keep the negative sign: (-3) + (-5) = -8. 2. Multiplying two negative integers: The product of two negatives is always positive: (-3) × (-5) = +15.',
        winningAnswerGujarati: '૧. બે ઋણ પૂર્ણાંકોનો સરવાળો: બંનેના મૂલ્યોનો સરવાળો કરી આગળ ઋણ ચિહ્ન મુકાય: (-૩) + (-૫) = -૮. ૨. બે ઋણ પૂર્ણાંકોનો ગુણાકાર: બે ઋણ સંખ્યાઓનો ગુણાકાર હંમેશા ધન બને છે: (-૩) × (-૫) = +૧૫.',
        interviewerAdvice: 'Give a quick numerical example spontaneously to impress the oral examiner.',
        interviewerAdviceGujarati: 'દાખલો આપીને સમજાવવાથી મૌખિક પરીક્ષામાં પૂરા ગુણ મળે છે.',
      },
    ],
  },
  school_social: {
    title: 'Social Science & History Oral Explainer',
    titleGujarati: 'સામાજિક વિજ્ઞાન મૌખિક કસોટી (GSEB/CBSE)',
    subtitle: 'Harappan Civilization, Solar System & Sources of History',
    subtitleGujarati: 'હડપ્પીય સભ્યતા, સૌર પરિવાર & ઇતિહાસના સ્ત્રોતો',
    icon: 'public',
    questions: [
      {
        id: 1,
        question: 'What are Inscriptions (શિલાલેખ) and Manuscripts (તાડપત્ર/ભોજપત્ર), and how do they help historians?',
        questionGujarati: 'શિલાલેખ (Inscriptions) અને તાડપત્ર/ભોજપત્ર (Manuscripts) એટલે શું? તે ઇતિહાસ જાણવામાં કેવી રીતે મદદ કરે છે?',
        category: 'History Viva',
        categoryGujarati: 'ઇતિહાસ મૌખિક',
        expectedKeywords: ['Stone Carvings', 'Birch Bark / Palm Leaf', 'Primary Sources', 'King Orders / Edicts', 'Preserved Records'],
        expectedKeywordsGujarati: ['પથ્થર પર કોતરેલા લેખ', 'તાડના પર્ણ & ભૂર્જ વૃક્ષની છાલ', 'પ્રાચીન સ્ત્રોત', 'રાજાઓની આજ્ઞાઓ', 'અશોકનો શિલાલેખ'],
        winningAnswer: 'Inscriptions are writings engraved on hard surfaces like stones, rocks, or metal plates (e.g. Ashoka edicts at Junagadh). Manuscripts are handwritten records written on palm leaves or bark of birch trees (Bhojpatra). They provide direct historical evidence about kings, laws, society, religion, and culture of ancient times.',
        winningAnswerGujarati: 'ધાતુ કે પથ્થર પર કોતરેલા લેખને શિલાલેખ કે અભિલેખ કહેવાય છે (દા.ત. જૂનાગઢમાં આવેલો અશોકનો શિલાલેખ). તાડના વૃક્ષના પર્ણ કે હિમાલયમાં થતા ભૂર્જ નામના વૃક્ષની છાલ પર લખાતા હસ્તપ્રતને તાડપત્ર/ભોજપત્ર કહેવાય છે. તે પ્રાચીન રાજાઓ, સમાજ અને સંસ્કૃતિ જાણવાના મુખ્ય સ્ત્રોત છે.',
        interviewerAdvice: 'Mention Ashoka’s famous rock inscription at Junagadh, Gujarat as an iconic example.',
        interviewerAdviceGujarati: 'જૂનાગઢ ખાતે આવેલ અશોકના શિલાલેખનું ઉદાહરણ આપો.',
      },
    ],
  },
};

const COLLEGE_INTERVIEW_TRACKS: Record<string, InterviewTrack> = {
  placement: {
    title: 'TCS / Infosys Placement Round',
    subtitle: 'Technical Fundamentals & Aptitude logic',
    icon: 'business',
    questions: [
      {
        id: 1,
        question: 'Tell me about yourself, your technical strengths, and why you are a great fit for our company.',
        category: 'Self-Introduction',
        expectedKeywords: ['Projects', 'Tech Stack', 'Problem Solving', 'Teamwork', 'Growth Mindset'],
        winningAnswer: 'Structure your response into 3 parts: (1) Academic background & core strengths (e.g. React Native, Node.js), (2) 1 major project with quantifiable results, (3) Why their engineering culture and training programs align with your career goals.',
        interviewerAdvice: 'Keep your answer between 60–90 seconds. Maintain eye contact and speak with steady pacing.',
      },
      {
        id: 2,
        question: 'What is the difference between synchronous and asynchronous programming in JavaScript?',
        category: 'Technical Core',
        expectedKeywords: ['Event Loop', 'Non-blocking', 'Call Stack', 'Promises', 'Async/Await'],
        winningAnswer: 'Synchronous code executes sequentially, blocking subsequent execution until the current task finishes. Asynchronous code is non-blocking, delegating I/O operations to Web APIs and the Event Loop (using Callbacks, Promises, or Async/Await).',
        interviewerAdvice: 'Draw or explain the Call Stack vs Task Queue relationship to demonstrate deep understanding.',
      },
      {
        id: 3,
        question: 'How do you handle working on a team project when a teammate misses a deadline?',
        category: 'Behavioral & Teamwork',
        expectedKeywords: ['Communication', 'Empathy', 'STAR Method', 'Root Cause', 'Delivery'],
        winningAnswer: 'Use the STAR method: First communicate privately with the teammate to understand blockers. Offer assistance or reallocate modular tasks, and ensure the team lead is updated with a revised timeline so project delivery is not compromised.',
        interviewerAdvice: 'Interviewers look for empathy and proactive problem solving rather than blaming colleagues.',
      },
    ],
  },
  faang: {
    title: 'Amazon & FAANG SDE Track',
    subtitle: 'Data Structures, System Design & Leadership Principles',
    icon: 'code',
    questions: [
      {
        id: 1,
        question: 'Describe a situation where you had to dive deep into a difficult bug and solve it.',
        category: 'Amazon Leadership (Dive Deep)',
        expectedKeywords: ['Root Cause', 'Logs/Debugging', 'Hypothesis', 'Solution', 'Prevention'],
        winningAnswer: 'Explain a real debugging scenario: (1) The unexpected symptom, (2) Systematic instrumentation using logs and profilers, (3) Pinpointing root cause (e.g. memory leak or race condition), (4) Fix and automated test addition.',
        interviewerAdvice: 'Use the STAR method (Situation, Task, Action, Result). Quantify the impact of your fix.',
      },
      {
        id: 2,
        question: 'How would you find the median of a streaming data flow of numbers in real time?',
        category: 'Data Structures & Algorithms',
        expectedKeywords: ['Max-Heap', 'Min-Heap', 'O(log n) Insertion', 'O(1) Median Lookup'],
        winningAnswer: 'Use two heaps: a Max-Heap for the lower half of numbers and a Min-Heap for the upper half. Maintain size balance such that the heaps differ in size by at most 1. Median is either the top of the larger heap or the average of both tops.',
        interviewerAdvice: 'Always state time and space complexity explicitly before writing code.',
      },
    ],
  },
};

export default function InterviewSimulatorScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade = user?.grade || 'college';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode;

  const availableTracks = isSchoolMode ? SCHOOL_VIVA_TRACKS : COLLEGE_INTERVIEW_TRACKS;
  const initialTrackKey = isSchoolMode ? 'school_science' : 'placement';

  const [selectedTrackKey, setSelectedTrackKey] = useState<string>(initialTrackKey);
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userNotes, setUserNotes] = useState<string>('');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    rating: string;
    matchedKeywords: string[];
    missingKeywords: string[];
    feedback: string;
    examinerTip: string;
    source?: string;
  } | null>(null);

  const activeTrack = availableTracks[selectedTrackKey] || Object.values(availableTracks)[0];
  const currentQuestion = activeTrack.questions[currentQIndex] || activeTrack.questions[0];

  const handleStartSession = () => {
    setSessionStarted(true);
    setCurrentQIndex(0);
    setUserNotes('');
    setIsAnswerRevealed(false);
    setScores({});
    setEvaluationResult(null);
    setSessionFinished(false);
  };

  const handleEvaluateWithAi = async () => {
    if (!userNotes.trim()) {
      Alert.alert(
        'Oral Answer Required',
        'Please enter or speak your answer notes into the box before submitting to the AI examiner.'
      );
      return;
    }

    setIsEvaluating(true);
    try {
      const qText = isGSEB && currentQuestion.questionGujarati ? currentQuestion.questionGujarati : currentQuestion.question;
      const kws = isGSEB && currentQuestion.expectedKeywordsGujarati ? currentQuestion.expectedKeywordsGujarati : currentQuestion.expectedKeywords;
      const winAns = isGSEB && currentQuestion.winningAnswerGujarati ? currentQuestion.winningAnswerGujarati : currentQuestion.winningAnswer;

      const resp = await ApiService.evaluateVivaAnswer({
        question: qText,
        userAnswer: userNotes,
        expectedKeywords: kws,
        winningAnswer: winAns,
        grade: userGrade,
        medium: isSchoolMode ? 'Gujarati' : 'English',
      });

      if (resp && resp.success) {
        setEvaluationResult(resp);
        setScores((prev) => ({ ...prev, [currentQIndex]: resp.score }));
      } else {
        // Fallback local calculation
        const lower = userNotes.toLowerCase();
        const matched = kws.filter((k) => lower.includes(k.toLowerCase().split(' ')[0]));
        const missing = kws.filter((k) => !lower.includes(k.toLowerCase().split(' ')[0]));
        const score = Math.min(10, Math.max(3, Math.round((matched.length / Math.max(1, kws.length)) * 7) + 3));
        const fallbackRes = {
          score,
          rating: score >= 8 ? 'Strong Defense 👍' : 'Fair Attempt 📚',
          matchedKeywords: matched,
          missingKeywords: missing,
          feedback: `Good attempt covering ${matched.length} key concepts. Be sure to address ${missing.slice(0, 2).join(', ')} in your defense.`,
          examinerTip: 'State definitions explicitly and give concrete units or examples.',
        };
        setEvaluationResult(fallbackRes);
        setScores((prev) => ({ ...prev, [currentQIndex]: score }));
      }
    } catch (e) {
      console.warn('AI viva evaluator call error:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = (score: number) => {
    const updatedScores = { ...scores, [currentQIndex]: score };
    setScores(updatedScores);

    if (currentQIndex < activeTrack.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setUserNotes('');
      setIsAnswerRevealed(false);
      setEvaluationResult(null);
    } else {
      setSessionFinished(true);

      // Record oral exam completion in backend ExamResult
      const scoreVals = Object.values(updatedScores);
      const sum = scoreVals.reduce((a, b) => a + b, 0);
      const avgPct = Math.round((sum / (activeTrack.questions.length * 10)) * 100);

      ApiService.submitExamResult({
        userEmail: user?.email || 'guest@mindsprint.edu',
        scorePercentage: avgPct,
        correctCount: Math.round((avgPct / 100) * activeTrack.questions.length),
        totalQuestions: activeTrack.questions.length,
        userAnswers: {},
        weakCategories: [],
        grade: userGrade,
        category: `Oral Viva Voce (${activeTrack.title})`,
      }).catch(() => {});
    }
  };

  const calculateAverageScore = () => {
    const scoreVals = Object.values(scores);
    if (scoreVals.length === 0) return 0;
    const sum = scoreVals.reduce((a, b) => a + b, 0);
    return Math.round((sum / (scoreVals.length * 10)) * 100);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.outlineVariant,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            {isSchoolMode
              ? `Class ${userGrade} Oral Exam & Viva 🎙️`
              : 'AI Mock Interview Simulator'}
          </Text>
          <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
            {isSchoolMode
              ? 'Interactive Lab Viva & Concept Defense'
              : 'Interactive Viva & Technical Rounds'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {!sessionStarted ? (
          /* ======================================================== */
          /* TRACK SELECTION VIEW                                     */
          /* ======================================================== */
          <View style={{ gap: 16 }}>
            <View style={[styles.introCard, { backgroundColor: '#1e1b4b' }, MindSprintShadows.glow]}>
              <View style={styles.introBadge}>
                <Text style={styles.introBadgeText}>
                  {isSchoolMode ? 'AI VIVA COACH 🎙️' : 'AI INTERVIEW COACH 🎙️'}
                </Text>
              </View>
              <Text style={styles.introTitle}>
                {isSchoolMode
                  ? `Practice Class ${userGrade} Viva & Concept Defense`
                  : 'Simulate Real Placement & Viva Rounds'}
              </Text>
              <Text style={styles.introSub}>
                {isSchoolMode
                  ? 'Listen to viva questions, practice speaking your defense aloud, and reveal examiner model answers.'
                  : 'Practice answering top questions under realistic pressure, reveal winning frameworks, and score your performance.'}
              </Text>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
              {isSchoolMode ? 'Choose Your Viva Track:' : 'Choose Your Interview Simulation Track:'}
            </Text>

            {Object.entries(availableTracks).map(([key, track]) => {
              const isSelected = selectedTrackKey === key;
              const displayTitle = isGSEB && track.titleGujarati ? track.titleGujarati : track.title;
              const displaySub = isGSEB && track.subtitleGujarati ? track.subtitleGujarati : track.subtitle;
              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.85}
                  style={[
                    styles.trackCard,
                    {
                      backgroundColor: colors.surfaceContainerLowest,
                      borderColor: isSelected ? colors.primary : colors.outlineVariant,
                      borderWidth: isSelected ? 2 : 1,
                    },
                    MindSprintShadows.card,
                  ]}
                  onPress={() => setSelectedTrackKey(key)}
                >
                  <View
                    style={[
                      styles.trackIconBox,
                      { backgroundColor: isSelected ? colors.primary : colors.surfaceContainerHigh },
                    ]}
                  >
                    <MaterialIcons
                      name={track.icon as any}
                      size={24}
                      color={isSelected ? '#ffffff' : colors.primary}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.trackTitle, { color: colors.onSurface }]}>
                      {displayTitle}
                    </Text>
                    <Text style={[styles.trackSub, { color: colors.onSurfaceVariant }]}>
                      {displaySub} • {track.questions.length} Rounds
                    </Text>
                  </View>

                  <MaterialIcons
                    name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
                    size={22}
                    color={isSelected ? colors.primary : colors.outline}
                  />
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.startBtn, { backgroundColor: colors.primary }, MindSprintShadows.glow]}
              onPress={handleStartSession}
            >
              <MaterialIcons name="record-voice-over" size={20} color="#ffffff" />
              <Text style={styles.startBtnText}>
                {isSchoolMode ? 'Start Viva Simulator 🎯' : 'Start Mock Interview Simulator'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : sessionFinished ? (
          /* ======================================================== */
          /* INTERVIEW READINESS REPORT CARD                          */
          /* ======================================================== */
          <View style={{ gap: 16 }}>
            <View
              style={[
                styles.reportCard,
                {
                  backgroundColor: colors.surfaceContainerLowest,
                  borderColor: colors.outlineVariant,
                },
                MindSprintShadows.card,
              ]}
            >
              <View style={[styles.trophyBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <MaterialIcons name="emoji-events" size={40} color="#10b981" />
              </View>

              <Text style={[styles.reportTitle, { color: colors.onSurface }]}>
                {isSchoolMode ? 'Viva Practice Completed! 🎓' : 'Mock Interview Completed! 🎓'}
              </Text>
              <Text style={[styles.reportTrack, { color: colors.primary }]}>
                {isGSEB && activeTrack.titleGujarati ? activeTrack.titleGujarati : activeTrack.title}
              </Text>

              <View style={styles.scorePill}>
                <Text style={styles.scorePillText}>
                  {`Overall Readiness: ${calculateAverageScore()}%`}
                </Text>
              </View>

              {/* Tips Feedback Box */}
              <View style={[styles.feedbackBox, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc' }]}>
                <Text style={[styles.feedbackHeading, { color: colors.primary }]}>
                  {'AI Interviewer Feedback:'}
                </Text>
                <Text style={[styles.feedbackText, { color: colors.onSurface }]}>
                  {isSchoolMode ? (
                    '• State core scientific terms and definitions clearly before elaborating.\n• Always mention SI units and provide real-world examples for full marks.\n• Maintain clear pacing and speak with confidence.'
                  ) : (
                    '• Structure your answers using the STAR method for behavioral questions.\n• Keep introductions crisp and emphasize quantifiable impact in projects.\n• Speak with confidence and pause before complex technical answers.'
                  )}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.restartBtn, { backgroundColor: colors.primary }]}
                onPress={() => setSessionStarted(false)}
              >
                <Text style={styles.restartBtnText}>
                  {isSchoolMode ? 'Practice Another Viva Track' : 'Practice Another Track'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ======================================================== */
          /* ACTIVE INTERVIEW QUESTION SIMULATION                     */
          /* ======================================================== */
          <View style={{ gap: 16 }}>
            {/* Progress Header */}
            <View style={styles.progressHeader}>
              <Text style={[styles.progressText, { color: colors.onSurfaceVariant }]}>
                {`Question ${currentQIndex + 1} of ${activeTrack.questions.length}`} • {(isGSEB && currentQuestion.categoryGujarati) ? currentQuestion.categoryGujarati : currentQuestion.category}
              </Text>
              <View style={[styles.liveTag, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <View style={styles.liveDot} />
                <Text style={styles.liveTagText}>{'LIVE SIMULATOR'}</Text>
              </View>
            </View>

            {/* Interviewer Avatar & Question Box */}
            <View
              style={[
                styles.questionBox,
                {
                  backgroundColor: colors.surfaceContainerLowest,
                  borderColor: colors.outlineVariant,
                },
                MindSprintShadows.card,
              ]}
            >
              <View style={styles.interviewerRow}>
                <View style={[styles.interviewerAvatar, { backgroundColor: colors.primary }]}>
                  <MaterialIcons name="person" size={24} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.interviewerName, { color: colors.onSurface }]}>
                    {isSchoolMode ? 'Subject Viva Examiner' : 'Technical Panel Interviewer'}
                  </Text>
                  <Text style={[styles.interviewerRole, { color: colors.onSurfaceVariant }]}>
                    {isGSEB && activeTrack.titleGujarati ? activeTrack.titleGujarati : activeTrack.title}
                  </Text>
                </View>

                {/* Voice Viva Audio Player */}
                <VoiceVivaPlayer
                  textToRead={isGSEB && currentQuestion.questionGujarati ? currentQuestion.questionGujarati : currentQuestion.question}
                  label="Listen"
                />
              </View>

              <Text style={[styles.simQuestionText, { color: colors.onSurface }]}>
                "{isGSEB && currentQuestion.questionGujarati ? currentQuestion.questionGujarati : currentQuestion.question}"
              </Text>

              {/* Expected Keywords Pills */}
              <View style={styles.keywordsRow}>
                <Text style={[styles.keywordsLabel, { color: colors.outline }]}>
                  {'Key Concepts:'}
                </Text>
                {((isGSEB && currentQuestion.expectedKeywordsGujarati) ? currentQuestion.expectedKeywordsGujarati : currentQuestion.expectedKeywords).map((kw, i) => (
                  <View
                    key={i}
                    style={[
                      styles.kwPill,
                      { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.15)' : '#eef2ff' },
                    ]}
                  >
                    <Text style={[styles.kwText, { color: colors.primary }]}>{kw}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Answer Draft / Notes Input */}
            <View style={[styles.notesContainer, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }]}>
              <Text style={[styles.notesLabel, { color: colors.onSurfaceVariant }]}>
                {'Your Spoken Answer Notes (Practice thinking & speaking aloud):'}
              </Text>
              <TextInput
                style={[styles.notesInput, { color: colors.onSurface }]}
                placeholder={'Type your talking points or practice speaking aloud...'}
                placeholderTextColor={colors.outline}
                multiline
                numberOfLines={4}
                value={userNotes}
                onChangeText={setUserNotes}
              />
            </View>

            {/* AI Evaluation Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.evalBtn,
                { backgroundColor: colors.primary },
                MindSprintShadows.glow,
              ]}
              disabled={isEvaluating}
              onPress={handleEvaluateWithAi}
            >
              {isEvaluating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <MaterialIcons name="auto-awesome" size={20} color="#ffffff" />
                  <Text style={styles.evalBtnText}>
                    Evaluate My Spoken Answer with AI 🎙️
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* AI Evaluation Result Card */}
            {evaluationResult && (
              <View
                style={[
                  styles.aiEvalCard,
                  {
                    backgroundColor: colors.surfaceContainerLowest,
                    borderColor: evaluationResult.score >= 7 ? '#10b981' : '#f59e0b',
                    borderLeftWidth: 4,
                  },
                  MindSprintShadows.card,
                ]}
              >
                <View style={styles.aiEvalHeader}>
                  <View
                    style={[
                      styles.aiScoreBadge,
                      {
                        backgroundColor:
                          evaluationResult.score >= 7
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={evaluationResult.score >= 7 ? 'verified' : 'analytics'}
                      size={18}
                      color={evaluationResult.score >= 7 ? '#10b981' : '#f59e0b'}
                    />
                    <Text
                      style={[
                        styles.aiScoreText,
                        { color: evaluationResult.score >= 7 ? '#065f46' : '#b45309' },
                      ]}
                    >
                      AI Score: {evaluationResult.score}/10 • {evaluationResult.rating}
                    </Text>
                  </View>
                </View>

                {/* Matched Concepts */}
                {evaluationResult.matchedKeywords && evaluationResult.matchedKeywords.length > 0 && (
                  <View style={{ marginTop: 4 }}>
                    <Text style={[styles.subLabel, { color: '#10b981' }]}>
                      ✓ Concepts Mastered:
                    </Text>
                    <View style={styles.kwWrap}>
                      {evaluationResult.matchedKeywords.map((kw, i) => (
                        <View key={i} style={[styles.matchedKwPill, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                          <Text style={[styles.matchedKwText, { color: '#065f46' }]}>✓ {kw}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Missing Concepts */}
                {evaluationResult.missingKeywords && evaluationResult.missingKeywords.length > 0 && (
                  <View style={{ marginTop: 4 }}>
                    <Text style={[styles.subLabel, { color: '#f59e0b' }]}>
                      ⚠️ Missed Concepts:
                    </Text>
                    <View style={styles.kwWrap}>
                      {evaluationResult.missingKeywords.map((kw, i) => (
                        <View key={i} style={[styles.missingKwPill, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                          <Text style={[styles.missingKwText, { color: '#b45309' }]}>• {kw}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Examiner Feedback */}
                <View style={[styles.aiFeedbackBox, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc' }]}>
                  <Text style={[styles.feedbackHeading, { color: colors.primary }]}>
                    Examiner Feedback:
                  </Text>
                  <Text style={[styles.feedbackText, { color: colors.onSurface }]}>
                    {evaluationResult.feedback}
                  </Text>
                </View>

                {/* Examiner Tip */}
                {evaluationResult.examinerTip && (
                  <View style={[styles.tipBox, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                    <MaterialIcons name="lightbulb" size={16} color="#b45309" />
                    <Text style={styles.tipText}>
                      Tip: {evaluationResult.examinerTip}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.nextQBtn, { backgroundColor: colors.primary }]}
                  onPress={() => handleNextQuestion(evaluationResult.score)}
                >
                  <Text style={styles.nextQBtnText}>
                    {currentQIndex < activeTrack.questions.length - 1
                      ? 'Proceed to Next Viva Question ➔'
                      : 'Complete Viva & View Report Card 🏆'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Winning Answer Reveal */}
            {!isAnswerRevealed ? (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.revealBtn, { backgroundColor: '#3525cd' }]}
                onPress={() => setIsAnswerRevealed(true)}
              >
                <MaterialIcons name="lightbulb" size={20} color="#ffffff" />
                <Text style={styles.revealBtnText}>
                  {'Reveal Model Answer & Reference Rubric 💡'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ gap: 14 }}>
                <View
                  style={[
                    styles.winningAnswerCard,
                    {
                      backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff',
                      borderColor: '#10b981',
                    },
                    MindSprintShadows.card,
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <MaterialIcons name="verified" size={20} color="#10b981" />
                      <Text style={[styles.winningTitle, { color: '#10b981' }]}>
                        {'Ideal Winning Response:'}
                      </Text>
                    </View>
                    <VoiceVivaPlayer
                      textToRead={isGSEB && currentQuestion.winningAnswerGujarati ? currentQuestion.winningAnswerGujarati : currentQuestion.winningAnswer}
                      label="Audio"
                    />
                  </View>
                  <Text style={[styles.winningBody, { color: colors.onSurface }]}>
                    {isGSEB && currentQuestion.winningAnswerGujarati ? currentQuestion.winningAnswerGujarati : currentQuestion.winningAnswer}
                  </Text>

                  <View style={[styles.tipBox, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                    <Text style={[styles.tipTitle, { color: '#b45309' }]}>
                      {'Panel Advice:'}
                    </Text>
                    <Text style={[styles.tipText, { color: colors.onSurface }]}>
                      {isGSEB && currentQuestion.interviewerAdviceGujarati ? currentQuestion.interviewerAdviceGujarati : currentQuestion.interviewerAdvice}
                    </Text>
                  </View>
                </View>

                {/* Quick Next Button if answer revealed */}
                {!evaluationResult && (
                  <View
                    style={[
                      styles.scoringCard,
                      {
                        backgroundColor: colors.surfaceContainerLowest,
                        borderColor: colors.outlineVariant,
                      },
                    ]}
                  >
                    <Text style={[styles.scoringTitle, { color: colors.onSurface }]}>
                      Rate Your Spoken Response:
                    </Text>
                    <View style={styles.scoringBtnsRow}>
                      {[4, 6, 8, 10].map((val) => (
                        <TouchableOpacity
                          key={val}
                          style={[styles.scoreBtn, { backgroundColor: colors.primary }]}
                          onPress={() => handleNextQuestion(val)}
                        >
                          <Text style={styles.scoreBtnText}>{val}/10</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 12,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 36,
  },
  introCard: {
    borderRadius: 24,
    padding: 20,
    gap: 8,
  },
  introBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  introBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  introSub: {
    fontSize: 13,
    color: '#c7d2fe',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    gap: 14,
  },
  trackIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  trackSub: {
    fontSize: 12,
    marginTop: 2,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
  },
  startBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  // Simulation Active Styles
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  liveTagText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: '900',
  },
  questionBox: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  interviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  interviewerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interviewerName: {
    fontSize: 14,
    fontWeight: '800',
  },
  interviewerRole: {
    fontSize: 11,
  },
  simQuestionText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  keywordsLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  kwPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  kwText: {
    fontSize: 11,
    fontWeight: '700',
  },
  notesContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  notesInput: {
    fontSize: 14,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  revealBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  winningAnswerCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    gap: 10,
  },
  winningTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  winningBody: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  tipBox: {
    padding: 10,
    borderRadius: 10,
    gap: 2,
  },
  tipTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  tipText: {
    fontSize: 12,
    lineHeight: 17,
  },
  scoringCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  scoringTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  scoringBtnsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  scoreBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  // Report Card Styles
  reportCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  trophyBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  reportTrack: {
    fontSize: 14,
    fontWeight: '700',
  },
  scorePill: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  scorePillText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  feedbackBox: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    gap: 6,
  },
  feedbackHeading: {
    fontSize: 13,
    fontWeight: '800',
  },
  feedbackText: {
    fontSize: 12.5,
    lineHeight: 20,
  },
  restartBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  restartBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  evalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  evalBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  aiEvalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  aiEvalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  aiScoreText: {
    fontSize: 13,
    fontWeight: '800',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  kwWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  matchedKwPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  matchedKwText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  missingKwPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  missingKwText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  aiFeedbackBox: {
    padding: 12,
    borderRadius: 10,
    gap: 4,
    marginTop: 4,
  },
  nextQBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  nextQBtnText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
