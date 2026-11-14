import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/mindsprint/ScreenHeader';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { confirmAction } from '@/components/common/dialogs';
import { IMPORTANT_QUESTIONS_DATA, ImportantQuestion } from '@/constants/academicData';
import { ApiService } from '@/services/api';

export interface BoardQuestion {
  id: number;
  originalId?: string;
  section: 'A' | 'B' | 'C' | 'D';
  marks: number;
  chapterTitle?: string;
  chapterTitleGujarati?: string;
  questionText: string;
  questionTextGujarati: string;
  options?: string[];
  correctAnswer?: number;
  modelAnswer: string;
  modelAnswerGujarati: string;
  markingRubric: { step: string; stepGujarati: string; marks: number }[];
  examinerTips?: string;
  examinerTipsGujarati?: string;
}

export default function BoardExamSimulatorScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade = user?.grade || '10';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode;

  const { tr } = useLanguage();

  // `value` is what the API / question filter expects; `label` is what students see.
  const availableSubjects = useMemo<{ value: string; label: string }[]>(() => {
    if (!isSchoolMode) {
      return [
        { value: 'All Topics', label: tr('All topics', 'બધા વિષયો') },
        { value: 'Quantitative Aptitude', label: tr('Aptitude', 'એપ્ટિટ્યુડ') },
        { value: 'Data Structures & Algorithms', label: tr('Data structures', 'ડેટા સ્ટ્રક્ચર') },
        { value: 'Web Development', label: tr('Web development', 'વેબ ડેવલપમેન્ટ') },
        { value: 'Computer Networks', label: tr('Computer networks', 'કમ્પ્યુટર નેટવર્ક') },
      ];
    }
    if (['11', '12'].includes(userGrade)) {
      return [
        { value: 'All Subjects', label: tr('All subjects', 'બધા વિષયો') },
        { value: 'Physics (ભૌતિકવિજ્ઞાન)', label: tr('Physics', 'ભૌતિક વિજ્ઞાન') },
        { value: 'Chemistry (રસાયણવિજ્ઞાન)', label: tr('Chemistry', 'રસાયણ વિજ્ઞાન') },
        { value: 'Mathematics (ગણિત)', label: tr('Maths', 'ગણિત') },
        { value: 'Biology (જીવવિજ્ઞાન)', label: tr('Biology', 'જીવ વિજ્ઞાન') },
      ];
    }
    return [
      { value: 'All Subjects', label: tr('All subjects', 'બધા વિષયો') },
      { value: 'Mathematics', label: tr('Maths', 'ગણિત') },
      { value: 'Science', label: tr('Science', 'વિજ્ઞાન') },
      { value: 'Social Science', label: tr('Social science', 'સામાજિક વિજ્ઞાન') },
      { value: 'English', label: tr('English', 'અંગ્રેજી') },
      { value: 'Gujarati', label: tr('Gujarati', 'ગુજરાતી') },
    ];
  }, [isSchoolMode, userGrade, tr]);

  const [selectedSubject, setSelectedSubject] = useState<string>(isSchoolMode ? 'All Subjects' : 'All Topics');
  const [selectedSection, setSelectedSection] = useState<'All' | 'A' | 'B' | 'C' | 'D'>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchedQuestions, setFetchedQuestions] = useState<ImportantQuestion[]>([]);
  const [activeQIndex, setActiveQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, any>>({});
  const [writtenNotes, setWrittenNotes] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(180 * 60); // 3 hours (180 mins)
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [evalMarks, setEvalMarks] = useState<Record<string, boolean>>({});

  // Fetch real questions dynamically from backend or localized dataset
  useEffect(() => {
    let isCancelled = false;
    async function loadPaperQuestions() {
      setLoading(true);
      try {
        const subParam = selectedSubject !== 'All Subjects' && selectedSubject !== 'All Topics' ? selectedSubject : undefined;
        const res = await ApiService.getImportantQuestions(userGrade, subParam);
        if (!isCancelled) {
          if (res && res.length > 0) {
            setFetchedQuestions(res);
          } else {
            setFetchedQuestions(IMPORTANT_QUESTIONS_DATA);
          }
        }
      } catch (e) {
        if (!isCancelled) {
          setFetchedQuestions(IMPORTANT_QUESTIONS_DATA);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }
    loadPaperQuestions();
    return () => {
      isCancelled = true;
    };
  }, [userGrade, selectedSubject]);

  // Assemble the official 80-Mark Board Exam blueprint:
  // Section A: 1-mark objective questions (targeted 16 questions)
  // Section B: 2-mark short questions (targeted 10 questions)
  // Section C: 3-mark analytical/proof questions (targeted 8 questions)
  // Section D: 4-mark comprehensive long questions (targeted 5 questions)
  const paperQuestions: BoardQuestion[] = useMemo(() => {
    let pool = fetchedQuestions.filter((q) => q.grade === userGrade);
    if (selectedSubject !== 'All Subjects' && selectedSubject !== 'All Topics') {
      const subFiltered = pool.filter((q) => q.subject.toLowerCase() === selectedSubject.toLowerCase());
      if (subFiltered.length > 0) pool = subFiltered;
    }
    if (pool.length === 0) {
      pool = fetchedQuestions.filter((q) => q.grade === '10');
      if (pool.length === 0) pool = IMPORTANT_QUESTIONS_DATA;
    }

    const ones = pool.filter((q) => q.marks === 1);
    const twos = pool.filter((q) => q.marks === 2);
    const threes = pool.filter((q) => q.marks === 3);
    const fours = pool.filter((q) => q.marks >= 4);

    const secA = ones.slice(0, 16);
    const secB = twos.slice(0, 10);
    const secC = threes.slice(0, 8);
    const secD = fours.slice(0, 5);

    const orderedPool = [
      ...secA.map((q) => ({ ...q, section: 'A' as const })),
      ...secB.map((q) => ({ ...q, section: 'B' as const })),
      ...secC.map((q) => ({ ...q, section: 'C' as const })),
      ...secD.map((q) => ({ ...q, section: 'D' as const })),
    ];

    const finalSelection = orderedPool.length >= 6
      ? orderedPool
      : pool.sort((a, b) => a.marks - b.marks).map((q) => ({
          ...q,
          section: (q.marks === 1 ? 'A' : q.marks === 2 ? 'B' : q.marks === 3 ? 'C' : 'D') as 'A' | 'B' | 'C' | 'D',
        }));

    return finalSelection.map((q, idx) => {
      const rubric = (q.stepWiseMarking || []).map((s) => ({
        step: s.text,
        stepGujarati: s.textGujarati || s.text,
        marks: parseFloat(s.marksAllocated) || 1,
      }));
      if (rubric.length === 0) {
        rubric.push({
          step: 'Accurate and comprehensive response with standard units/diagram',
          stepGujarati: 'ચોક્કસ અને સંપૂર્ણ જવાબ',
          marks: q.marks,
        });
      }
      return {
        id: idx + 1,
        originalId: q.id,
        section: q.section,
        marks: q.marks,
        chapterTitle: q.chapterTitle,
        chapterTitleGujarati: q.chapterTitleGujarati,
        questionText: q.questionText,
        questionTextGujarati: q.questionTextGujarati || q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        modelAnswer: q.modelAnswer,
        modelAnswerGujarati: q.modelAnswerGujarati || q.modelAnswer,
        markingRubric: rubric,
        examinerTips: q.examinerTips,
        examinerTipsGujarati: q.examinerTipsGujarati,
      };
    });
  }, [fetchedQuestions, userGrade, selectedSubject]);

  const handleSelectSubject = (subj: string) => {
    setSelectedSubject(subj);
    setSelectedSection('All');
    setActiveQIndex(0);
    setSelectedAnswers({});
    setWrittenNotes({});
    setMarkedForReview([]);
    setEvalMarks({});
  };

  // When time runs out the paper is submitted automatically (no confirmation needed).
  const timeUp = timeLeft === 0;
  const submitted = isSubmitted || timeUp;

  useEffect(() => {
    if (submitted || isTimerPaused) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, isTimerPaused]);

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
    confirmAction({
      title: tr('Submit paper?', 'પેપર સબમિટ કરવું છે?'),
      message: tr(
        'Next you will check your answers against the model answers and give yourself marks.',
        'હવે તમે મોડેલ જવાબ સાથે તમારા જવાબ સરખાવીને જાતે ગુણ આપશો.'
      ),
      confirmText: tr('Submit paper', 'પેપર સબમિટ કરો'),
      cancelText: tr('Keep writing', 'લખતા રહો'),
      onConfirm: () => setIsSubmitted(true),
    });
  };

  const currentQ = paperQuestions[activeQIndex] || paperQuestions[0] || {
    id: 1,
    section: 'A',
    marks: 1,
    questionText: 'Loading board examination questions...',
    questionTextGujarati: 'પ્રશ્નો લોડ થઈ રહ્યા છે...',
    modelAnswer: '',
    modelAnswerGujarati: '',
    markingRubric: [],
  };
  const displayQ = isGSEB && currentQ.questionTextGujarati ? currentQ.questionTextGujarati : currentQ.questionText;

  // Calculate self-evaluation score
  const totalMaxMarks = paperQuestions.reduce((sum, q) => sum + q.marks, 0);
  let studentAwardedScore = 0;
  paperQuestions.forEach((q) => {
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

  const percentage = totalMaxMarks > 0 ? Math.round((studentAwardedScore / totalMaxMarks) * 100) : 0;

  const handleSafeExit = () => {
    confirmAction({
      title: tr('Leave this paper?', 'પેપર છોડવું છે?'),
      message: tr('Your answers on this paper will be lost.', 'આ પેપરના તમારા જવાબ સાચવાશે નહીં.'),
      confirmText: tr('Leave paper', 'પેપર છોડો'),
      cancelText: tr('Keep writing', 'લખતા રહો'),
      destructive: true,
      onConfirm: () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)');
        }
      },
    });
  };

  const handleFinishAndSave = async () => {
    try {
      if (user?.email) {
        await ApiService.submitExamResult({
          userEmail: user.email,
          scorePercentage: percentage,
          correctCount: studentAwardedScore,
          totalQuestions: totalMaxMarks,
          userAnswers: selectedAnswers,
          weakCategories: [],
          grade: userGrade,
          board: user?.board || 'CBSE',
          category: `80M Board Exam - ${selectedSubject}`,
        });
      }
    } catch (e) {
      console.warn('Failed to record board simulation score:', e);
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader
        title={tr('Board exam', 'બોર્ડ પરીક્ષા')}
        subtitle={isSchoolMode ? tr(`Class ${userGrade} · 80 marks`, `ધોરણ ${userGrade} · 80 ગુણ`) : tr('80 marks', '80 ગુણ')}
        leadingIcon="close"
        onBack={handleSafeExit}
        right={
          <>
            <View
              style={[styles.timerBadge, { backgroundColor: timeLeft < 600 ? colors.errorContainer : colors.surfaceContainerLow }]}
              accessibilityLabel={`Time left ${formatTime(timeLeft)}`}
            >
              <MaterialIcons name="timer" size={16} color={timeLeft < 600 ? colors.error : colors.onSurfaceVariant} />
              <Text style={[styles.timerText, { color: timeLeft < 600 ? colors.error : colors.onSurface }]}>{formatTime(timeLeft)}</Text>
            </View>
            {!submitted && (
              <TouchableOpacity
                onPress={handleSubmitPaper}
                style={[styles.headerSubmitBtn, { backgroundColor: colors.accent }]}
                accessibilityRole="button"
              >
                <Text style={[styles.headerSubmitBtnText, { color: colors.onAccent }]}>{tr('Submit', 'સબમિટ')}</Text>
              </TouchableOpacity>
            )}
          </>
        }
      />

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>
            Preparing your 80-mark paper…
          </Text>
        </View>
      ) : !submitted ? (
        /* ACTIVE EXAM INTERFACE */
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Subject / Paper Selector Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subjectChipScroll}>
            {availableSubjects.map(({ value: sub, label }) => {
              const isSelected = selectedSubject === sub;
              return (
                <TouchableOpacity
                  key={sub}
                  style={[
                    styles.subjectChip,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surfaceContainerLowest,
                      borderColor: isSelected ? colors.primary : colors.outlineVariant,
                    },
                  ]}
                  onPress={() => handleSelectSubject(sub)}
                >
                  <Text style={[styles.subjectChipText, { color: isSelected ? colors.onPrimary : colors.onSurface }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Section Filter / Jump Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sectionTabsRow}>
            {(['All', 'A', 'B', 'C', 'D'] as const).map((sec) => {
              const isSecSelected = selectedSection === sec;
              const count = sec === 'All'
                ? paperQuestions.length
                : paperQuestions.filter((q) => q.section === sec).length;
              if (sec !== 'All' && count === 0) return null;
              return (
                <TouchableOpacity
                  key={sec}
                  style={[
                    styles.secFilterTab,
                    {
                      backgroundColor: isSecSelected ? colors.primary : colors.surfaceContainerLowest,
                      borderColor: isSecSelected ? colors.primary : colors.outlineVariant,
                    },
                  ]}
                  onPress={() => {
                    setSelectedSection(sec);
                    if (sec !== 'All') {
                      const firstIdx = paperQuestions.findIndex((q) => q.section === sec);
                      if (firstIdx !== -1) setActiveQIndex(firstIdx);
                    }
                  }}
                >
                  <Text style={[styles.secFilterText, { color: isSecSelected ? colors.onPrimary : colors.onSurface }]}>
                    {sec === 'All' ? tr('All sections', 'બધા વિભાગ') : tr(`Section ${sec}`, `વિભાગ ${sec}`)} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Question Navigator Palette */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paletteScroll}>
            {paperQuestions.map((q, idx) => {
              if (selectedSection !== 'All' && q.section !== selectedSection) return null;
              const isCurrent = activeQIndex === idx;
              const isAnswered = selectedAnswers[q.id] !== undefined || (writtenNotes[q.id] && writtenNotes[q.id].length > 0);
              const isReview = markedForReview.includes(q.id);

              let pillBg = colors.surfaceContainerLow;
              let textColor = colors.onSurface;

              if (isCurrent) {
                pillBg = colors.primary;
                textColor = colors.onPrimary;
              } else if (isReview) {
                pillBg = colors.accent;
                textColor = colors.onAccent;
              } else if (isAnswered) {
                pillBg = colors.tertiary;
                textColor = colors.onTertiary;
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
            {/* Meta: section, marks, chapter, and a mark-for-review toggle */}
            <View style={styles.qMetaRow}>
              <View style={[styles.sectionBadge, { backgroundColor: colors.primaryFixed }]}>
                <Text style={[styles.sectionBadgeText, { color: colors.primary }]}>Section {currentQ.section}</Text>
              </View>
              <Text style={[styles.marksText, { color: colors.onSurfaceVariant }]}>
                {currentQ.marks} {currentQ.marks === 1 ? tr('mark', 'ગુણ') : tr('marks', 'ગુણ')}
              </Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                style={[
                  styles.flagBtn,
                  { backgroundColor: markedForReview.includes(currentQ.id) ? colors.accentContainer : colors.surfaceContainerLow },
                ]}
                onPress={() => toggleMarkReview(currentQ.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: markedForReview.includes(currentQ.id) }}
              >
                <MaterialIcons
                  name={markedForReview.includes(currentQ.id) ? 'bookmark' : 'bookmark-border'}
                  size={16}
                  color={markedForReview.includes(currentQ.id) ? colors.accent : colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.flagBtnText,
                    { color: markedForReview.includes(currentQ.id) ? colors.onAccentContainer : colors.onSurfaceVariant },
                  ]}
                >
                  {markedForReview.includes(currentQ.id) ? tr('Marked', 'નિશાની કરી') : tr('Mark for review', 'રિવ્યૂ માટે નિશાની')}
                </Text>
              </TouchableOpacity>
            </View>
            {currentQ.chapterTitle ? (
              <Text style={[styles.chapterTag, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                {isGSEB && currentQ.chapterTitleGujarati ? currentQ.chapterTitleGujarati : currentQ.chapterTitle}
              </Text>
            ) : null}

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
                          backgroundColor: isSelected ? colors.primary : isDarkMode ? colors.surfaceContainerLow : '#F5F7FB',
                          borderColor: isSelected ? colors.primary : colors.outlineVariant,
                        },
                      ]}
                      onPress={() => handleSelectOption(currentQ.id, optIdx)}
                    >
                      <View style={[styles.radioCircle, { borderColor: isSelected ? colors.onPrimary : colors.outline }]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <Text style={[styles.optionLabel, { color: isSelected ? colors.onPrimary : colors.onSurface }]}>
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
                  {tr('Your answer (rough work is fine)', 'તમારો જવાબ (રફ કામ ચાલશે)')}
                </Text>
                <TextInput
                  style={[
                    styles.theoryInput,
                    {
                      backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#F5F7FB',
                      borderColor: colors.outlineVariant,
                      color: colors.onSurface,
                    },
                  ]}
                  placeholder={tr('Write your steps, formula or explanation here', 'તમારા પગલાં, સૂત્ર કે સમજૂતી અહીં લખો')}
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
              <Text style={[styles.navBtnText, { color: colors.onSurface }]}>{tr('Previous', 'પાછળ')}</Text>
            </TouchableOpacity>

            {activeQIndex < paperQuestions.length - 1 ? (
              <TouchableOpacity
                style={[styles.navBtn, { backgroundColor: colors.primary }]}
                onPress={() => setActiveQIndex((prev) => Math.min(paperQuestions.length - 1, prev + 1))}
              >
                <Text style={[styles.navBtnText, { color: colors.onPrimary }]}>{tr('Next', 'આગળ')}</Text>
                <MaterialIcons name="chevron-right" size={20} color={colors.onPrimary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navBtn, { backgroundColor: colors.accent }]}
                onPress={handleSubmitPaper}
              >
                <MaterialIcons name="done-all" size={20} color={colors.onAccent} />
                <Text style={[styles.navBtnText, { color: colors.onAccent }]}>Submit paper</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      ) : (
        /* STEP-BY-STEP SELF-EVALUATION SCORING RUBRIC */
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Report Header Card */}
          <View style={[styles.scoreSummaryCard, { backgroundColor: '#12245C' }, MindSprintShadows.card]}>
            <MaterialIcons name="emoji-events" size={40} color="#F4A30B" />
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
          {paperQuestions.map((q, idx) => {
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
                    {tr(`Q${idx + 1} · Section ${q.section} · ${q.marks} marks`, `પ્રશ્ન ${idx + 1} · વિભાગ ${q.section} · ${q.marks} ગુણ`)}
                  </Text>
                  {isMcq && (
                    <Text style={{ color: mcqCorrect ? '#12805C' : '#C8372D', fontWeight: '800', fontSize: 12 }}>
                      {mcqCorrect ? '+1 Mark (Auto-checked ✓)' : '0 Marks (Incorrect ✗)'}
                    </Text>
                  )}
                </View>

                <Text style={[styles.evalQText, { color: colors.onSurface }]}>
                  {isGSEB && q.questionTextGujarati ? q.questionTextGujarati : q.questionText}
                </Text>

                {/* Model Answer */}
                <View style={[styles.modelAnsBox, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#F5F7FB' }]}>
                  <Text style={[styles.modelAnsHeader, { color: '#12805C' }]}>
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
                              backgroundColor: isChecked ? 'rgba(18, 128, 92, 0.15)' : colors.surfaceContainerLow,
                              borderColor: isChecked ? '#12805C' : colors.outlineVariant,
                            },
                          ]}
                          onPress={() => setEvalMarks((prev) => ({ ...prev, [key]: !prev[key] }))}
                        >
                          <MaterialIcons
                            name={isChecked ? 'check-box' : 'check-box-outline-blank'}
                            size={20}
                            color={isChecked ? '#12805C' : colors.outline}
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
            onPress={handleFinishAndSave}
          >
            <Text style={styles.finishEvalBtnText}>Save Result & Return to Dashboard 🎓</Text>
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
    color: '#9AA6C0',
    fontSize: 11,
  },
  headerSubmitBtn: {
    paddingHorizontal: 12,
    minHeight: 32,
    borderRadius: 16,
    justifyContent: 'center',
  },
  headerSubmitBtnText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 14,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    minHeight: 32,
    borderRadius: 16,
  },
  timerText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 15,
    fontVariant: ['tabular-nums'],
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
    fontFamily: MindSprintFonts.label,
    fontSize: 13,
  },
  marksText: {
    fontSize: 13,
    fontWeight: '600',
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
    fontFamily: MindSprintFonts.title,
    fontSize: 18,
    lineHeight: 27,
    marginTop: 12,
    marginBottom: 14,
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
    color: '#F4A30B',
    fontSize: 28,
    fontWeight: '900',
  },
  scoreGradeBadge: {
    color: '#12805C',
    fontWeight: '800',
    fontSize: 14,
  },
  scoreInstruction: {
    color: '#C9D5F5',
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
  subjectChipScroll: {
    gap: 8,
    paddingBottom: 2,
  },
  subjectChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  subjectChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 32,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTabsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  secFilterTab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  secFilterText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chapterTag: {
    fontSize: 12.5,
    marginTop: 6,
  },
});
