import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/services/api';
import { Question } from '@/constants/mindsprintData';

export default function ExamReviewScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { resultId } = useLocalSearchParams<{ resultId: string }>();

  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [examResult, setExamResult] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadReviewData() {
      if (!resultId) {
        setLoading(false);
        return;
      }
      try {
        const data = await ApiService.getExamResultDetails(resultId);
        if (data) {
          setExamResult(data.result);
          setQuestions(data.questions || []);
        }
        if (user?.email) {
          const bmRes = await ApiService.getBookmarkedQuestions(user.email);
          if (bmRes) setBookmarkedIds(bmRes.bookmarkedQuestionIds || []);
        }
      } catch (err) {
        console.error('Error loading exam review:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviewData();
  }, [resultId, user?.email]);

  const handleToggleBookmark = async (qId: number) => {
    if (!user?.email) return;
    try {
      const res = await ApiService.toggleBookmark(user.email, qId);
      if (res && res.success) {
        setBookmarkedIds(res.bookmarkedQuestionIds || []);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>
            Loading Exam Solutions & Explanations...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!examResult || questions.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Review Exam</Text>
        </View>
        <View style={styles.centerBox}>
          <MaterialIcons name="error-outline" size={48} color={colors.outline} />
          <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>
            No detailed solutions found for this test.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const userAnswers: Record<number, number> = examResult.userAnswers || {};
  const isPassed = examResult.scorePercentage >= 60;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* App Bar Header */}
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
        <View>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            Exam Solutions & Review
          </Text>
          <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
            {questions.length} Questions Analyzed
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Top Score Hero Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: colors.outlineVariant,
            },
            MindSprintShadows.card,
          ]}
        >
          <View style={styles.heroRow}>
            {/* Circular Percentage Ring */}
            <View
              style={[
                styles.scoreCircle,
                {
                  backgroundColor: isPassed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  borderColor: isPassed ? '#10b981' : '#ef4444',
                },
              ]}
            >
              <Text style={[styles.circleScoreText, { color: isPassed ? '#10b981' : '#ef4444' }]}>
                {examResult.scorePercentage}%
              </Text>
            </View>

            {/* Score Content */}
            <View style={{ flex: 1 }}>
              <View
                style={[
                  styles.outcomePill,
                  {
                    backgroundColor: isPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  },
                ]}
              >
                <MaterialIcons
                  name={isPassed ? 'emoji-events' : 'fitness-center'}
                  size={14}
                  color={isPassed ? '#10b981' : '#ef4444'}
                />
                <Text style={[styles.outcomePillText, { color: isPassed ? '#065f46' : '#991b1b' }]}>
                  {isPassed ? 'PASSED TEST' : 'NEEDS PRACTICE'}
                </Text>
              </View>

              <Text style={[styles.heroScoreCount, { color: colors.onSurface }]}>
                {examResult.correctCount} / {examResult.totalQuestions} Correct
              </Text>
              <Text style={[styles.heroSubText, { color: colors.onSurfaceVariant }]}>
                {isPassed
                  ? 'Great job! You met the benchmark score.'
                  : 'Review the detailed solutions below to improve.'}
              </Text>
            </View>
          </View>
        </View>

        {/* Weak Spots Alert / Recommended Topics */}
        {examResult.weakCategories && examResult.weakCategories.length > 0 && (
          <View
            style={[
              styles.weakSpotContainer,
              {
                backgroundColor: colors.surfaceContainerLowest,
                borderColor: colors.outlineVariant,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <MaterialIcons name="auto-awesome" size={18} color="#f59e0b" />
              <Text style={[styles.weakSpotHeaderTitle, { color: colors.onSurface }]}>
                AI Weak Spot Recommendations
              </Text>
            </View>
            <View style={styles.chipWrap}>
              {examResult.weakCategories.map((cat: string, idx: number) => (
                <View key={idx} style={[styles.weakChip, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                  <Text style={[styles.weakChipText, { color: '#b45309' }]}>{cat}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Question Breakdown Heading */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Detailed Question Review</Text>
          <Text style={[styles.sectionCount, { color: colors.outline }]}>
            {questions.length} Items
          </Text>
        </View>

        {/* Question Breakdown Cards */}
        {questions.map((q, idx) => {
          const userSelectedIdx =
            userAnswers[q.id] !== undefined ? userAnswers[q.id] : userAnswers[idx];
          const isUserCorrect = userSelectedIdx === q.correctAnswer;
          const statusColor = isUserCorrect ? '#10b981' : '#ef4444';

          return (
            <View
              key={q.id || idx}
              style={[
                styles.questionCard,
                {
                  backgroundColor: colors.surfaceContainerLowest,
                  borderColor: colors.outlineVariant,
                  borderLeftColor: statusColor,
                },
                MindSprintShadows.card,
              ]}
            >
              {/* Question Meta Row */}
              <View style={styles.qMetaRow}>
                <View style={[styles.categoryTagPill, { backgroundColor: '#e0e7ff' }]}>
                  <Text style={styles.categoryTagPillText}>
                    Q{idx + 1} • {q.category}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => handleToggleBookmark(q.id)}
                    style={{ padding: 4 }}
                  >
                    <MaterialIcons
                      name={bookmarkedIds.includes(q.id) ? 'bookmark' : 'bookmark-border'}
                      size={22}
                      color={bookmarkedIds.includes(q.id) ? colors.primary : colors.outline}
                    />
                  </TouchableOpacity>

                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: isUserCorrect
                          ? 'rgba(16, 185, 129, 0.12)'
                          : 'rgba(239, 68, 68, 0.12)',
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={isUserCorrect ? 'check-circle' : 'cancel'}
                      size={14}
                      color={statusColor}
                    />
                    <Text style={[styles.statusPillText, { color: isUserCorrect ? '#065f46' : '#991b1b' }]}>
                      {isUserCorrect ? 'Correct' : 'Incorrect'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Question Statement */}
              <Text style={[styles.questionStatement, { color: colors.onSurface }]}>
                {q.questionText}
              </Text>

              {/* Options List */}
              <View style={styles.optionsList}>
                {q.options.map((opt, optIdx) => {
                  const isCorrectAnswer = optIdx === q.correctAnswer;
                  const isUserChosen = optIdx === userSelectedIdx;

                  let optionBg = colors.surfaceContainerLowest;
                  let optionBorder = colors.outlineVariant;
                  let textColor = colors.onSurface;
                  let badgeLabel = null;
                  let badgeBg = '#10b981';

                  if (isUserChosen && isCorrectAnswer) {
                    optionBg = 'rgba(16, 185, 129, 0.12)';
                    optionBorder = '#10b981';
                    textColor = '#065f46';
                    badgeLabel = 'Your Answer ✓';
                    badgeBg = '#10b981';
                  } else if (isUserChosen && !isCorrectAnswer) {
                    optionBg = 'rgba(239, 68, 68, 0.12)';
                    optionBorder = '#ef4444';
                    textColor = '#991b1b';
                    badgeLabel = 'Your Choice ✗';
                    badgeBg = '#ef4444';
                  } else if (isCorrectAnswer) {
                    optionBg = 'rgba(16, 185, 129, 0.12)';
                    optionBorder = '#10b981';
                    textColor = '#065f46';
                    badgeLabel = 'Correct Answer ✓';
                    badgeBg = '#10b981';
                  }

                  return (
                    <View
                      key={optIdx}
                      style={[
                        styles.optionCard,
                        {
                          backgroundColor: optionBg,
                          borderColor: optionBorder,
                        },
                      ]}
                    >
                      <View style={styles.optionLeft}>
                        <Text style={[styles.optionIndexLabel, { color: textColor }]}>
                          {String.fromCharCode(65 + optIdx)}.
                        </Text>
                        <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                      </View>

                      {badgeLabel && (
                        <View style={[styles.optionBadge, { backgroundColor: badgeBg }]}>
                          <Text style={styles.optionBadgeText}>{badgeLabel}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Solution & Explanation Box */}
              {q.explanation && (
                <View style={[styles.solutionBox, { backgroundColor: colors.surfaceContainerHigh }]}>
                  <View style={styles.solutionHeader}>
                    <MaterialIcons name="lightbulb" size={18} color="#f59e0b" />
                    <Text style={[styles.solutionTitle, { color: colors.onSurface }]}>
                      Explanation & Solution:
                    </Text>
                  </View>
                  <Text style={[styles.solutionContent, { color: colors.onSurfaceVariant }]}>
                    {q.explanation}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
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
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 12,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContainer: {
    padding: 16,
    gap: 16,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleScoreText: {
    fontSize: 20,
    fontWeight: '800',
  },
  outcomePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 4,
  },
  outcomePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  heroScoreCount: {
    fontSize: 16,
    fontWeight: '700',
  },
  heroSubText: {
    fontSize: 12,
    marginTop: 2,
  },
  weakSpotContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  weakSpotHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  weakChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  weakChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  questionCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderLeftWidth: 5,
    padding: 16,
    gap: 12,
  },
  qMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTagPillText: {
    color: '#3730a3',
    fontSize: 12,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  questionStatement: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  optionsList: {
    gap: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  optionIndexLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  optionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  optionBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  solutionBox: {
    padding: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  solutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  solutionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  solutionContent: {
    fontSize: 13,
    lineHeight: 19,
  },
});
