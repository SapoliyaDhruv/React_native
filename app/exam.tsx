import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { APTITUDE_QUESTIONS, Question } from '@/constants/mindsprintData';
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

  // Load Questions Effect
  useEffect(() => {
    async function fetchQuestions() {
      try {
        let data: Question[];
        if (isDiagnostic) {
          data = await ApiService.getDiagnosticQuestions(user?.email, examLimit);
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
        setQuestions(data && data.length > 0 ? data : APTITUDE_QUESTIONS.slice(0, examLimit));
      } catch (err) {
        console.error('Error fetching questions:', err);
        setQuestions(APTITUDE_QUESTIONS.slice(0, examLimit));
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [user, examCategory, examLimit, examCompany, isDiagnostic]);

  const handleSubmitExam = useCallback(async () => {
    setIsSubmitted(true);

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

    // Score % calculation with standard accuracy
    const scorePercentage = Math.max(0, Math.round((correctCount / questions.length) * 100));

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
  }, [questions, userAnswers, user?.email]);

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
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleClearChoice = () => {
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
        onQuitExam={() => {
          Alert.alert('Quit Exam?', 'Are you sure you want to exit? Your progress will be lost.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Quit', style: 'destructive', onPress: () => router.back() },
          ]);
        }}
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
        onSubmit={() => {
          Alert.alert(
            'Submit Exam?',
            `You have answered ${Object.keys(userAnswers).length} of ${questions.length} questions. Are you ready to finish?`,
            [
              { text: 'Review Answers', style: 'cancel' },
              { text: 'Submit Now', onPress: handleSubmitExam },
            ]
          );
        }}
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
