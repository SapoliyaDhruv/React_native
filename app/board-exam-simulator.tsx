import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

interface BoardQuestion {
  id: number;
  section: 'A' | 'B' | 'C' | 'D';
  marks: number;
  questionText: string;
  questionTextGujarati: string;
  options?: string[];
  correctAnswer?: number;
  modelAnswer: string;
  modelAnswerGujarati: string;
  markingRubric: { step: string; stepGujarati: string; marks: number }[];
}

const BOARD_PAPER_QUESTIONS: BoardQuestion[] = [
  // SECTION A: 1-MARK OBJECTIVE (4 Questions demo)
  {
    id: 1,
    section: 'A',
    marks: 1,
    questionText: 'Which gas is evolved during the reaction of Zinc with dilute Sulphuric Acid?',
    questionTextGujarati: 'ઝિંકની મંદ સલ્ફ્યુરિક એસિડ સાથેની પ્રક્રિયાથી કયો વાયુ ઉત્પન્ન થાય છે?',
    options: ['Hydrogen (H₂)', 'Oxygen (O₂)', 'Carbon Dioxide (CO₂)', 'Nitrogen (N₂)'],
    correctAnswer: 0,
    modelAnswer: 'Hydrogen gas (H₂) is released: Zn + H₂SO₄ → ZnSO₄ + H₂↑.',
    modelAnswerGujarati: 'હાઈડ્રોજન વાયુ (H₂) મુક્ત થાય છે: Zn + H₂SO₄ → ZnSO₄ + H₂↑.',
    markingRubric: [{ step: 'Correct option chosen (H₂)', stepGujarati: 'સાચો વિકલ્પ (H₂)', marks: 1 }],
  },
  {
    id: 2,
    section: 'A',
    marks: 1,
    questionText: 'What is the SI unit of Electric Power?',
    questionTextGujarati: 'વિદ્યુત પાવરનો SI એકમ કયો છે?',
    options: ['Watt (W)', 'Joule (J)', 'Volt (V)', 'Ampere (A)'],
    correctAnswer: 0,
    modelAnswer: 'The SI unit of electric power is Watt (W).',
    modelAnswerGujarati: 'વિદ્યુત પાવરનો SI એકમ વૉટ (Watt - W) છે.',
    markingRubric: [{ step: 'Correct unit stated (Watt)', stepGujarati: 'સાચો એકમ (વૉટ)', marks: 1 }],
  },
  // SECTION B: 2-MARK SHORT ANSWER (2 Questions demo)
  {
    id: 3,
    section: 'B',
    marks: 2,
    questionText: 'Define Refraction of light and state Snell’s Law.',
    questionTextGujarati: 'પ્રકાશનું વક્રીભવન એટલે શું? સ્નેલનો નિયમ જણાવો.',
    modelAnswer: 'Refraction is the bending of light when it passes obliquely from one transparent medium to another. Snell\'s Law: sin(i) / sin(r) = constant = n.',
    modelAnswerGujarati: 'પ્રકાશનું ત્રાંસું કિરણ એક પારદર્શક માધ્યમમાંથી બીજા માધ્યમમાં પ્રવેશતા દિશા બદલે તેને વક્રીભવન કહેવાય. સ્નેલનો નિયમ: આપાતકોણની સાઇન અને વક્રીભૂતકોણની સાઇનનો ગુણોત્તર અચળ હોય છે: sin(i)/sin(r) = અચળ.',
    markingRubric: [
      { step: 'Definition of refraction with medium change', stepGujarati: 'વક્રીભવનની સાચી વ્યાખ્યા', marks: 1 },
      { step: 'Snell\'s law formula sin(i)/sin(r) = n', stepGujarati: 'સ્નેલનું સૂત્ર sin(i)/sin(r) = n', marks: 1 },
    ],
  },
  {
    id: 4,
    section: 'B',
    marks: 2,
    questionText: 'Find the 10th term of the Arithmetic Progression: 2, 7, 12 ...',
    questionTextGujarati: 'સમાંતર શ્રેણી ૨, ૭, ૧૨ ... નું ૧૦મું પદ શોધો.',
    modelAnswer: 'a = 2, d = 7 - 2 = 5, n = 10.\naₙ = a + (n - 1)d\na₁₀ = 2 + (10 - 1) × 5 = 2 + 45 = 47.',
    modelAnswerGujarati: 'a = ૨, d = ૭ - ૨ = ૫, n = ૧૦.\naₙ = a + (n - 1)d\na₁₀ = ૨ + (૧૦ - ૧) × ૫ = ૨ + ૪૫ = ૪૭.',
    markingRubric: [
      { step: 'Formula aₙ = a + (n-1)d and substituting values', stepGujarati: 'સૂત્ર અને કિંમતો મૂકવી', marks: 1 },
      { step: 'Final answer a₁₀ = 47', stepGujarati: 'અંતિમ જવાબ ૪૭', marks: 1 },
    ],
  },
  // SECTION C: 3-MARK MEDIUM SUMS / PROOFS (1 Question demo)
  {
    id: 5,
    section: 'C',
    marks: 3,
    questionText: 'Prove that √5 is an irrational number by contradiction method.',
    questionTextGujarati: 'અસંગતતા (વિરોધાભાસ) ની રીતે સાબિત કરો કે √૫ અસંમેય સંખ્યા છે.',
    modelAnswer: 'Assume √5 is rational = p/q (coprime). Squaring both sides: 5 = p²/q² => p² = 5q². So 5 divides p². Thus 5 divides p. Let p = 5k => 25k² = 5q² => q² = 5k². So 5 divides q. Contradiction to p, q being coprime. Hence √5 is irrational.',
    modelAnswerGujarati: 'ધારો કે √૫ સંમેય છે = p/q (પરસ્પર અવિભાજ્ય). બંને બાજુ વર્ગ: ૫ = p²/q² => p² = ૫q². આથી ૫ એ p² નો અવયવ છે => ૫ એ p નો પણ અવયવ છે. p = ૫k મૂકતા: ૨૫k² = ૫q² => q² = ૫k². આથી ૫ એ q નો પણ અવયવ છે. આથી p અને q નો સામાન્ય અવયવ ૫ મળે છે જે વિરોધાભાસ છે. આથી √૫ અસંમેય છે.',
    markingRubric: [
      { step: 'Assumption of rationality and p = 5k logic', stepGujarati: 'સંમેય ધારણા અને વર્ગ કરવો', marks: 1 },
      { step: 'Showing 5 divides both p and q', stepGujarati: '૫ એ બંને p અને q નો અવયવ દર્શાવવો', marks: 1 },
      { step: 'Contradiction statement and conclusion', stepGujarati: 'વિરોધાભાસ અને અંતિમ તારણ', marks: 1 },
    ],
  },
  // SECTION D: 4-MARK LONG QUESTION (1 Question demo)
  {
    id: 6,
    section: 'D',
    marks: 4,
    questionText: 'Draw the ray diagram of human eye defects (Myopia & Hypermetropia) and state their causes and corrections.',
    questionTextGujarati: 'માનવ આંખની ખામીઓ (લઘુદ્રષ્ટિ અને ગુરુદ્રષ્ટિ) ના કારણો અને તેના નિવારણના ચશ્માના લેન્સ સમજાવો.',
    modelAnswer: '1. Myopia (Near-sightedness): Image forms in front of retina. Causes: Excessive curvature of cornea or elongation of eyeball. Correction: Concave lens.\n2. Hypermetropia (Far-sightedness): Image forms behind retina. Causes: Focal length too long or eyeball too short. Correction: Convex lens.',
    modelAnswerGujarati: '૧. લઘુદ્રષ્ટિ (Myopia): નજીકનું ચોખ્ખું દેખાય, દૂરનું ન દેખાય. પ્રતિબિંબ નેત્રપટલની આગળ રચાય. નિવારણ: અંતર્ગોળ લેન્સ.\n૨. ગુરુદ્રષ્ટિ (Hypermetropia): દૂરનું ચોખ્ખું દેખાય, નજીકનું ન દેખાય. પ્રતિબિંબ નેત્રપટલની પાછળ રચાય. નિવારણ: બહિર્ગોળ લેન્સ.',
    markingRubric: [
      { step: 'Myopia definition, image position and concave lens', stepGujarati: 'લઘુદ્રષ્ટિ અને અંતર્ગોળ લેન્સ', marks: 2 },
      { step: 'Hypermetropia definition, image position and convex lens', stepGujarati: 'ગુરુદ્રષ્ટિ અને બહિર્ગોળ લેન્સ', marks: 2 },
    ],
  },
];

export default function BoardExamSimulatorScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade = user?.grade || '10';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode && user?.medium === 'Gujarati';

  const [activeQIndex, setActiveQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, any>>({});
  const [writtenNotes, setWrittenNotes] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(180 * 60); // 3 hours (180 mins)
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [evalMarks, setEvalMarks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isSubmitted || isTimerPaused) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitPaper();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, isTimerPaused]);

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const toggleMarkReview = (qId: number) => {
    setMarkedForReview((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const handleSubmitPaper = () => {
    Alert.alert(
      'Submit Board Exam Paper?',
      'Are you sure you want to finish the exam and enter the Self-Evaluation Step-by-Step Scoring Rubric?',
      [
        { text: 'Continue Writing', style: 'cancel' },
        {
          text: 'Submit & Evaluate',
          style: 'default',
          onPress: () => setIsSubmitted(true),
        },
      ]
    );
  };

  const currentQ = BOARD_PAPER_QUESTIONS[activeQIndex];
  const displayQ = isGSEB && currentQ.questionTextGujarati ? currentQ.questionTextGujarati : currentQ.questionText;

  // Calculate self-evaluation score
  const totalMaxMarks = BOARD_PAPER_QUESTIONS.reduce((sum, q) => sum + q.marks, 0);
  let studentAwardedScore = 0;
  BOARD_PAPER_QUESTIONS.forEach((q) => {
    if (q.options && selectedAnswers[q.id] === q.correctAnswer) {
      studentAwardedScore += q.marks;
    } else {
      q.markingRubric.forEach((rubric, rIdx) => {
        const key = `${q.id}_${rIdx}`;
        if (evalMarks[key]) {
          studentAwardedScore += rubric.marks;
        }
      });
    }
  });

  const percentage = Math.round((studentAwardedScore / totalMaxMarks) * 100);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Top Header Bar with Exam Timer */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? '#1e1b4b' : '#0f172a',
            borderBottomColor: colors.outlineVariant,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="close" size={22} color="#ffffff" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.examTitle}>
            {isSchoolMode ? `Class ${userGrade} GSEB/CBSE Board Exam` : 'Comprehensive Exam'}
          </Text>
          <Text style={styles.examSub}>Total: 80 Marks • Standard 3-Hour Simulation</Text>
        </View>

        {/* Timer Box */}
        <View style={[styles.timerBadge, { backgroundColor: timeLeft < 600 ? '#ef4444' : '#1e293b' }]}>
          <MaterialIcons name="timer" size={16} color="#ffffff" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {!isSubmitted ? (
        /* ACTIVE EXAM INTERFACE */
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Question Navigator Palette */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paletteScroll}>
            {BOARD_PAPER_QUESTIONS.map((q, idx) => {
              const isCurrent = activeQIndex === idx;
              const isAnswered = selectedAnswers[q.id] !== undefined || (writtenNotes[q.id] && writtenNotes[q.id].length > 0);
              const isReview = markedForReview.includes(q.id);

              let pillBg = colors.surfaceContainerLow;
              let textColor = colors.onSurface;

              if (isCurrent) {
                pillBg = colors.primary;
                textColor = '#ffffff';
              } else if (isReview) {
                pillBg = '#f59e0b';
                textColor = '#ffffff';
              } else if (isAnswered) {
                pillBg = '#10b981';
                textColor = '#ffffff';
              }

              return (
                <TouchableOpacity
                  key={q.id}
                  style={[styles.palettePill, { backgroundColor: pillBg }]}
                  onPress={() => setActiveQIndex(idx)}
                >
                  <Text style={[styles.paletteText, { color: textColor }]}>
                    Q{idx + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Current Question Card */}
          <View
            style={[
              styles.questionCard,
              { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant },
              MindSprintShadows.card,
            ]}
          >
            {/* Meta Row */}
            <View style={styles.qMetaRow}>
              <View style={[styles.sectionBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.sectionBadgeText}>SECTION {currentQ.section}</Text>
              </View>
              <Text style={[styles.marksText, { color: colors.primary }]}>
                {currentQ.marks} {currentQ.marks === 1 ? 'Mark' : 'Marks'}
              </Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                style={[
                  styles.flagBtn,
                  { backgroundColor: markedForReview.includes(currentQ.id) ? '#f59e0b' : colors.surfaceContainerHigh },
                ]}
                onPress={() => toggleMarkReview(currentQ.id)}
              >
                <MaterialIcons
                  name="flag"
                  size={16}
                  color={markedForReview.includes(currentQ.id) ? '#ffffff' : colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.flagBtnText,
                    { color: markedForReview.includes(currentQ.id) ? '#ffffff' : colors.onSurfaceVariant },
                  ]}
                >
                  {markedForReview.includes(currentQ.id) ? 'Flagged' : 'Flag for Review'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Question Text */}
            <Text style={[styles.qStatement, { color: colors.onSurface }]}>
              Q{activeQIndex + 1}. {displayQ}
            </Text>

            {/* Options if Section A MCQ */}
            {currentQ.options ? (
              <View style={styles.optionsWrap}>
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  return (
                    <TouchableOpacity
                      key={optIdx}
                      style={[
                        styles.optionBtn,
                        {
                          backgroundColor: isSelected ? colors.primary : isDarkMode ? colors.surfaceContainerLow : '#f8fafc',
                          borderColor: isSelected ? colors.primary : colors.outlineVariant,
                        },
                      ]}
                      onPress={() => handleSelectOption(currentQ.id, optIdx)}
                    >
                      <View style={[styles.radioCircle, { borderColor: isSelected ? '#ffffff' : colors.outline }]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <Text style={[styles.optionLabel, { color: isSelected ? '#ffffff' : colors.onSurface }]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              /* Written Scratchpad for Theory / Numericals */
              <View style={styles.theoryBox}>
                <Text style={[styles.scratchpadLabel, { color: colors.onSurfaceVariant }]}>
                  Your Answer / Rough Calculation Scratchpad:
                </Text>
                <TextInput
                  style={[
                    styles.theoryInput,
                    {
                      backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc',
                      borderColor: colors.outlineVariant,
                      color: colors.onSurface,
                    },
                  ]}
                  placeholder="Type your mathematical steps, formula used, or theoretical explanation here..."
                  placeholderTextColor={colors.outline}
                  multiline
                  numberOfLines={5}
                  value={writtenNotes[currentQ.id] || ''}
                  onChangeText={(txt) => setWrittenNotes((prev) => ({ ...prev, [currentQ.id]: txt }))}
                />
              </View>
            )}
          </View>

          {/* Navigation Controls */}
          <View style={styles.navRow}>
            <TouchableOpacity
              disabled={activeQIndex === 0}
              style={[
                styles.navBtn,
                { backgroundColor: colors.surfaceContainerLow, opacity: activeQIndex === 0 ? 0.4 : 1 },
              ]}
              onPress={() => setActiveQIndex((prev) => Math.max(0, prev - 1))}
            >
              <MaterialIcons name="chevron-left" size={20} color={colors.onSurface} />
              <Text style={[styles.navBtnText, { color: colors.onSurface }]}>Previous</Text>
            </TouchableOpacity>

            {activeQIndex < BOARD_PAPER_QUESTIONS.length - 1 ? (
              <TouchableOpacity
                style={[styles.navBtn, { backgroundColor: colors.primary }]}
                onPress={() => setActiveQIndex((prev) => Math.min(BOARD_PAPER_QUESTIONS.length - 1, prev + 1))}
              >
                <Text style={[styles.navBtnText, { color: '#ffffff' }]}>Next Question</Text>
                <MaterialIcons name="chevron-right" size={20} color="#ffffff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navBtn, { backgroundColor: '#10b981' }]}
                onPress={handleSubmitPaper}
              >
                <MaterialIcons name="done-all" size={20} color="#ffffff" />
                <Text style={[styles.navBtnText, { color: '#ffffff' }]}>Submit Paper</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      ) : (
        /* STEP-BY-STEP SELF-EVALUATION SCORING RUBRIC */
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Report Header Card */}
          <View style={[styles.scoreSummaryCard, { backgroundColor: '#1e1b4b' }, MindSprintShadows.card]}>
            <MaterialIcons name="emoji-events" size={40} color="#f59e0b" />
            <Text style={styles.scoreTitle}>Board Readiness Predictor</Text>
            <Text style={styles.scoreNumber}>
              {studentAwardedScore} / {totalMaxMarks} ({percentage}%)
            </Text>
            <Text style={styles.scoreGradeBadge}>
              {percentage >= 90 ? 'Grade A1 • Exceptional' : percentage >= 80 ? 'Grade A2 • Strong' : 'Grade B1 • Passing Pace'}
            </Text>
            <Text style={styles.scoreInstruction}>
              Check the criteria below according to your written answers to finalize your score:
            </Text>
          </View>

          {/* Question-by-Question Evaluation List */}
          {BOARD_PAPER_QUESTIONS.map((q, idx) => {
            const isMcq = !!q.options;
            const mcqCorrect = isMcq && selectedAnswers[q.id] === q.correctAnswer;

            return (
              <View
                key={q.id}
                style={[
                  styles.evalCard,
                  { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant },
                  MindSprintShadows.card,
                ]}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.evalQTitle, { color: colors.primary }]}>
                    Q{idx + 1} (Section {q.section} • {q.marks}M)
                  </Text>
                  {isMcq && (
                    <Text style={{ color: mcqCorrect ? '#10b981' : '#ef4444', fontWeight: '800', fontSize: 12 }}>
                      {mcqCorrect ? '+1 Mark (Auto-checked ✓)' : '0 Marks (Incorrect ✗)'}
                    </Text>
                  )}
                </View>

                <Text style={[styles.evalQText, { color: colors.onSurface }]}>
                  {isGSEB && q.questionTextGujarati ? q.questionTextGujarati : q.questionText}
                </Text>

                {/* Model Answer */}
                <View style={[styles.modelAnsBox, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc' }]}>
                  <Text style={[styles.modelAnsHeader, { color: '#10b981' }]}>
                    Official Board Model Answer:
                  </Text>
                  <Text style={[styles.modelAnsBody, { color: colors.onSurface }]}>
                    {isGSEB && q.modelAnswerGujarati ? q.modelAnswerGujarati : q.modelAnswer}
                  </Text>
                </View>

                {/* Step-by-Step Marking Checklist */}
                {!isMcq && (
                  <View style={styles.rubricBox}>
                    <Text style={[styles.rubricTitle, { color: colors.outline }]}>
                      Step-by-Step Marks Verification:
                    </Text>
                    {q.markingRubric.map((rubric, rIdx) => {
                      const key = `${q.id}_${rIdx}`;
                      const isChecked = !!evalMarks[key];
                      const rubricText = isGSEB && rubric.stepGujarati ? rubric.stepGujarati : rubric.step;

                      return (
                        <TouchableOpacity
                          key={rIdx}
                          style={[
                            styles.rubricRow,
                            {
                              backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.15)' : colors.surfaceContainerLow,
                              borderColor: isChecked ? '#10b981' : colors.outlineVariant,
                            },
                          ]}
                          onPress={() => setEvalMarks((prev) => ({ ...prev, [key]: !prev[key] }))}
                        >
                          <MaterialIcons
                            name={isChecked ? 'check-box' : 'check-box-outline-blank'}
                            size={20}
                            color={isChecked ? '#10b981' : colors.outline}
                          />
                          <Text style={[styles.rubricStepText, { color: colors.onSurface, flex: 1 }]}>
                            {rubricText}
                          </Text>
                          <Text style={[styles.rubricMarksBadge, { color: colors.primary }]}>
                            +{rubric.marks}M
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}

          <TouchableOpacity
            style={[styles.finishEvalBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.finishEvalBtnText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 64,
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
  examTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  examSub: {
    color: '#94a3b8',
    fontSize: 11,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  timerText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  scrollContainer: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  paletteScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  palettePill: {
    width: 44,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paletteText: {
    fontSize: 12,
    fontWeight: '800',
  },
  questionCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  qMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sectionBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  marksText: {
    fontSize: 13,
    fontWeight: '800',
  },
  flagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  flagBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  qStatement: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  optionsWrap: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  theoryBox: {
    gap: 6,
  },
  scratchpadLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  theoryInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 6,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  scoreSummaryCard: {
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    gap: 8,
  },
  scoreTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  scoreNumber: {
    color: '#f59e0b',
    fontSize: 28,
    fontWeight: '900',
  },
  scoreGradeBadge: {
    color: '#10b981',
    fontWeight: '800',
    fontSize: 14,
  },
  scoreInstruction: {
    color: '#c7d2fe',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  evalCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  evalQTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  evalQText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  modelAnsBox: {
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  modelAnsHeader: {
    fontSize: 12,
    fontWeight: '800',
  },
  modelAnsBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  rubricBox: {
    gap: 6,
  },
  rubricTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  rubricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  rubricStepText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rubricMarksBadge: {
    fontSize: 12,
    fontWeight: '800',
  },
  finishEvalBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  finishEvalBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
