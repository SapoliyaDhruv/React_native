import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Question, getOfflineQuestions } from '@/constants/mindsprintData';
import { ApiService } from '@/services/api';
import { ExamHeader } from '@/components/mindsprint/ExamHeader';
import { QuestionNavigatorModal } from '@/components/exam/QuestionNavigatorModal';
import { ExamQuestionCard } from '@/components/exam/ExamQuestionCard';
import { ExamFooter } from '@/components/exam/ExamFooter';
import { ExamResultView } from '@/components/exam/ExamResultView';
import { ExamSkeleton } from '@/components/mindsprint/SkeletonLoader';

export default function ExamScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const searchParams = useLocalSearchParams<{
    limit?: string;
    category?: string;
    company?: string;
    isDiagnostic?: string;
    negativeMarking?: string;
  }>();

  const examLimit = searchParams.limit ? parseInt(searchParams.limit) : 10;
  const examCategory = searchParams.category;
  const examCompany = searchParams.company;
  const isDiagnostic = searchParams.isDiagnostic === 'true';

  const initialSeconds = examLimit === 50 ? 2700 : examLimit === 25 ? 1500 : 600;
  const DRAFT_KEY = `@mindsprint_active_exam_draft_${user?.email || 'guest'}_${examLimit}_${examCategory || 'all'}_${examCompany || 'none'}`;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [showNavigator, setShowNavigator] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<number[]>([]);

  // Load Bookmarks Effect
  useEffect(() => {
    async function loadBookmarks() {
      if (user?.email) {
        try {
          const res = await ApiService.getBookmarkedQuestions(user.email);
          if (res && res.bookmarkedQuestionIds) {
            setBookmarkedQuestionIds(res.bookmarkedQuestionIds);
          }
        } catch (e) {
          console.error('Error loading bookmarks:', e);
        }
      }
    }
    loadBookmarks();
  }, [user?.email]);

  // Guest Notice Effect
  useEffect(() => {
    if (user?.isGuest) {
      Alert.alert(
        'Guest Student Notice',
        'You are currently exploring as a Guest. Guest mock test scores are temporary and will not save to a permanent profile.',
        [
          { text: 'Continue Preview', style: 'cancel' },
          {
            text: 'Sign Up / Log In',
            onPress: () => router.push('/(tabs)/profile' as any),
          },
        ]
      );
    }
  }, [user, router]);

  // Load Questions / Restore Draft Effect
  useEffect(() => {
    let isCancelled = false;

    async function fetchFreshQuestions() {
      try {
        let data: Question[];
        if (isDiagnostic) {
          data = await ApiService.getDiagnosticQuestions(user?.email, examLimit, user?.grade);
        } else {
          data = await ApiService.getQuestions(
            examCategory,
            user?.email,
            examLimit,
            examCompany,
            user?.grade,
            user?.board
          );
        }
        const fallback = getOfflineQuestions(user?.grade, examCategory, examLimit);
        if (!isCancelled) {
          setQuestions(data && data.length > 0 ? data : fallback);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        if (!isCancelled) {
          const fallback = getOfflineQuestions(user?.grade, examCategory, examLimit);
          setQuestions(fallback);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    async function initExam() {
      try {
        const rawDraft = await AsyncStorage.getItem(DRAFT_KEY);
        if (rawDraft) {
          try {
            const draft = JSON.parse(rawDraft);
            const isRecent = Date.now() - (draft.timestamp || 0) < 4 * 60 * 60 * 1000; // 4 hours
            if (isRecent && Array.isArray(draft.questions) && draft.questions.length > 0) {
              const answeredCount = Object.keys(draft.userAnswers || {}).length;
              Alert.alert(
                'Resume Previous Exam?',
                `You have an ongoing test session with ${answeredCount} of ${draft.questions.length} questions answered. Would you like to resume where you left off?`,
                [
                  {
                    text: 'Start Fresh',
                    style: 'destructive',
                    onPress: async () => {
                      await AsyncStorage.removeItem(DRAFT_KEY).catch(() => {});
                      if (!isCancelled) fetchFreshQuestions();
                    },
                  },
                  {
                    text: 'Resume Test',
                    onPress: () => {
                      if (isCancelled) return;
                      setQuestions(draft.questions);
                      setUserAnswers(draft.userAnswers || {});
                      setMarkedForReview(draft.markedForReview || {});
                      setSecondsLeft(
                        typeof draft.secondsLeft === 'number' && draft.secondsLeft > 0
                          ? draft.secondsLeft
                          : initialSeconds
                      );
                      setCurrentIndex(
                        typeof draft.currentIndex === 'number' && draft.currentIndex < draft.questions.length
                          ? draft.currentIndex
                          : 0
                      );
                      setLoading(false);
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                    },
                  },
                ],
                { cancelable: false }
              );
              return;
            } else {
              await AsyncStorage.removeItem(DRAFT_KEY).catch(() => {});
            }
          } catch (e) {
            console.error('Error parsing draft:', e);
            await AsyncStorage.removeItem(DRAFT_KEY).catch(() => {});
          }
        }

        if (!isCancelled) {
          await fetchFreshQuestions();
        }
      } catch (err) {
        console.error('Error initializing exam:', err);
        if (!isCancelled) {
          const fallback = getOfflineQuestions(user?.grade, examCategory, examLimit);
          setQuestions(fallback);
          setLoading(false);
        }
      }
    }

    initExam();

    return () => {
      isCancelled = true;
    };
  }, [user, examCategory, examLimit, examCompany, isDiagnostic, initialSeconds, DRAFT_KEY]);

  // Auto-Save Active Exam Draft Effect
  useEffect(() => {
    if (loading || isSubmitted || questions.length === 0) return;

    const saveTimer = setTimeout(() => {
      const draftData = {
        questions,
        userAnswers,
        markedForReview,
        secondsLeft,
        currentIndex,
        timestamp: Date.now(),
      };
      AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draftData)).catch((err) => {
        console.warn('Failed to auto-save exam draft:', err);
      });
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [questions, userAnswers, markedForReview, secondsLeft, currentIndex, loading, isSubmitted, DRAFT_KEY]);

  const handleSubmitExam = useCallback(async () => {
    setIsSubmitted(true);
    await AsyncStorage.removeItem(DRAFT_KEY).catch(() => {});
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    let correctCount = 0;
    let wrongCount = 0;

    questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected !== undefined) {
        if (selected === q.correctAnswer) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    // Score % calculation with negative marking support (e.g. -0.25 mark per wrong answer)
    const hasNegativeMarking = searchParams.negativeMarking === 'true';
    const rawMarks = hasNegativeMarking
      ? Math.max(0, correctCount - (wrongCount * 0.25))
      : correctCount;
    const scorePercentage = Math.max(0, Math.min(100, Math.round((rawMarks / questions.length) * 100)));

    const categoryStats: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, idx) => {
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { correct: 0, total: 0 };
      }
      categoryStats[q.category].total += 1;
      if (userAnswers[idx] === q.correctAnswer) {
        categoryStats[q.category].correct += 1;
      }
    });

    const weakCategories = Object.keys(categoryStats).filter((cat) => {
      const stat = categoryStats[cat];
      return (stat.correct / stat.total) < 0.6;
    });

    const userAnswersByQId: Record<number, number> = {};
    questions.forEach((q, idx) => {
      if (userAnswers[idx] !== undefined) {
        userAnswersByQId[q.id] = userAnswers[idx];
      }
    });

    try {
      await ApiService.submitExamResult({
        userEmail: user?.email,
        scorePercentage,
        correctCount,
        totalQuestions: questions.length,
        userAnswers: userAnswersByQId,
        weakCategories,
        questionIds: questions.map((q) => q.id),
      });
    } catch (e) {
      console.error('Failed to submit results to database:', e);
    }
  }, [questions, userAnswers, user?.email, DRAFT_KEY]);

  // Timer Effect
  useEffect(() => {
    if (isSubmitted || loading) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, loading, handleSubmitExam]);

  const currentQuestion = questions[currentIndex];
  const selectedOption = userAnswers[currentIndex];
  const isMarked = !!markedForReview[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleClearChoice = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIndex];
      return next;
    });
  };

  const handleToggleBookmark = async (qId: number) => {
    if (!user?.email) return;
    try {
      const res = await ApiService.toggleBookmark(user.email, qId);
      if (res && res.success) {
        setBookmarkedQuestionIds(res.bookmarkedQuestionIds || []);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleToggleReview = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));

    if (currentQuestion?.id) {
      await handleToggleBookmark(currentQuestion.id);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ExamSkeleton />
      </SafeAreaView>
    );
  }

  if (isSubmitted) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ExamResultView
          questions={questions}
          userAnswers={userAnswers}
          bookmarkedQuestionIds={bookmarkedQuestionIds}
          isDiagnostic={isDiagnostic}
          onToggleBookmark={handleToggleBookmark}
          onDone={() => router.replace('/(tabs)')}
        />
      </SafeAreaView>
    );
  }

  const isSchoolUser = user?.grade && user?.grade !== 'college';

  const examHeaderTitle = isDiagnostic
    ? '🎯 AI Diagnostic Test'
    : isSchoolUser
    ? `Class ${user?.grade} • ${examCategory || 'Practice Quiz'}`
    : examCompany && examCompany !== 'All Companies'
    ? `${examCompany} Placement Mock`
    : 'Aptitude & IT Mock Exam';

  const flaggedIndicesList = Object.keys(markedForReview)
    .filter((k) => markedForReview[parseInt(k, 10)])
    .map((k) => parseInt(k, 10));

  const handleSafeExit = () => {
    Alert.alert(
      'Quit Exam?',
      'Would you like to save your exam progress to resume later, or discard your current draft?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard & Exit',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(DRAFT_KEY).catch(() => {});
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)');
            }
          },
        },
        {
          text: 'Save & Exit',
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)');
            }
          },
        },
      ]
    );
  };

  const promptSubmitExam = () => {
    Alert.alert(
      'Submit Exam?',
      `You have answered ${Object.keys(userAnswers).length} of ${questions.length} questions. Are you ready to finish?`,
      [
        { text: 'Review Answers', style: 'cancel' },
        { text: 'Submit Now', onPress: handleSubmitExam },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ExamHeader
        title={examHeaderTitle}
        secondsLeft={secondsLeft}
        currentQuestionIndex={currentIndex}
        totalQuestions={questions.length}
        onOpenPalette={() => setShowNavigator(true)}
        onQuitExam={handleSafeExit}
        onSubmitExam={promptSubmitExam}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {currentQuestion && (
          <ExamQuestionCard
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            selectedOption={selectedOption}
            isMarkedForReview={isMarked}
            onSelectOption={handleSelectOption}
          />
        )}
      </ScrollView>

      {/* Bottom Controls */}
      <ExamFooter
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        hasSelectedOption={selectedOption !== undefined}
        isMarkedForReview={isMarked}
        onToggleReview={handleToggleReview}
        onClearChoice={handleClearChoice}
        onPrevious={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
        onSubmit={promptSubmitExam}
      />

      {/* Advanced Question Navigator Grid Modal */}
      <QuestionNavigatorModal
        visible={showNavigator}
        totalQuestions={questions.length}
        currentIndex={currentIndex}
        userAnswers={userAnswers}
        flaggedIndices={flaggedIndicesList}
        questionsList={questions}
        onSelectQuestion={(idx) => setCurrentIndex(idx)}
        onClose={() => setShowNavigator(false)}
        onSubmitExam={promptSubmitExam}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
