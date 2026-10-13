import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { AcademicGrade } from '@/constants/academicData';
import { ApiService } from '@/services/api';

interface DailyChallengeCardProps {
  userGrade?: AcademicGrade;
  streakCount?: number;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  userGrade = 'college',
  streakCount = 1,
}) => {
  const { colors, isDarkMode } = useTheme();

  const [questionData, setQuestionData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const todayDate = new Date().toISOString().split('T')[0];
  const storageKey = `@mindsprint_daily_q_${todayDate}_${userGrade}`;
  const dismissKey = `@mindsprint_daily_dismiss_${todayDate}_${userGrade}`;

  useEffect(() => {
    async function loadChallenge() {
      setLoading(true);
      try {
        const [savedAnswer, isDismissSaved, fetchedQ] = await Promise.all([
          AsyncStorage.getItem(storageKey),
          AsyncStorage.getItem(dismissKey),
          ApiService.getDailyChallenge(userGrade),
        ]);

        if (isDismissSaved === 'true') {
          setIsDismissed(true);
        }

        if (fetchedQ) {
          setQuestionData(fetchedQ);
        }

        if (savedAnswer !== null) {
          setSelectedOpt(parseInt(savedAnswer, 10));
          setIsAnswered(true);
          setIsCollapsed(true);
        }
      } catch (e) {
        console.warn('Daily challenge load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadChallenge();
  }, [storageKey, dismissKey, userGrade]);

  const handleSelectOption = async (index: number) => {
    if (isAnswered || !questionData) return;

    setSelectedOpt(index);
    setIsAnswered(true);

    try {
      await AsyncStorage.setItem(storageKey, index.toString());
    } catch (e) {
      console.warn('Failed to save daily challenge state:', e);
    }

    const isCorrect = index === questionData.correctIndex;

    Alert.alert(
      isCorrect ? 'Brilliant! Correct Answer 🎯' : 'Good Attempt! 💪',
      isCorrect
        ? '+1 Day added to your study streak! Challenge solved.'
        : 'Review the explanation anytime using the Review button.',
      [
        {
          text: 'Got it ✓',
          onPress: () => setIsCollapsed(true),
        },
      ]
    );

    // Auto-collapse after brief timeout in case alert is dismissed
    setTimeout(() => {
      setIsCollapsed(true);
    }, 2500);
  };

  const handleDismiss = async () => {
    setIsDismissed(true);
    try {
      await AsyncStorage.setItem(dismissKey, 'true');
    } catch (e) {
      console.warn('Failed to save dismiss state:', e);
    }
  };

  if (isDismissed || loading || !questionData) return null;

  // COMPACT COLLAPSED BADGE
  if (isAnswered && isCollapsed) {
    const isCorrect = selectedOpt === questionData.correctIndex;

    return (
      <View
        style={[
          styles.collapsedCard,
          {
            backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
            borderColor: '#10b981',
          },
          MindSprintShadows.card,
        ]}
      >
        <View style={styles.collapsedLeft}>
          <MaterialIcons
            name={isCorrect ? 'check-circle' : 'offline-pin'}
            size={22}
            color="#10b981"
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.collapsedTitle, { color: colors.onSurface }]}>
              Today's Challenge Solved! 🔥
            </Text>
            <Text style={[styles.collapsedSub, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
              {questionData.topic} • {isCorrect ? 'Correct 🎯' : 'Reviewed 💡'}
            </Text>
          </View>
        </View>

        <View style={styles.collapsedActions}>
          <TouchableOpacity
            style={[styles.reviewBtn, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#d1fae5' }]}
            onPress={() => setIsCollapsed(false)}
          >
            <Text style={styles.reviewBtnText}>Review ▾</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dismissBtn}
            onPress={handleDismiss}
          >
            <MaterialIcons name="close" size={18} color={colors.outline} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff',
          borderColor: isDarkMode ? 'rgba(245, 158, 11, 0.4)' : '#fef08a',
        },
        MindSprintShadows.card,
      ]}
    >
      {/* Card Header */}
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View style={styles.qotdBadge}>
            <MaterialIcons name="bolt" size={13} color="#ffffff" />
            <Text style={styles.qotdText}>QUESTION OF THE DAY</Text>
          </View>
          <View style={styles.topicPill}>
            <Text style={styles.topicText}>{questionData.topic}</Text>
          </View>
        </View>

        <View style={styles.rightHeaderActions}>
          <View style={styles.streakBadge}>
            <MaterialIcons name="local-fire-department" size={15} color="#f59e0b" />
            <Text style={styles.streakText}>+1 STREAK</Text>
          </View>

          {isAnswered && (
            <TouchableOpacity onPress={() => setIsCollapsed(true)} style={styles.collapseToggleBtn}>
              <Text style={[styles.collapseToggleText, { color: colors.primary }]}>Collapse ✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Question Body */}
      <Text style={[styles.questionText, { color: colors.onSurface }]}>
        {questionData.question}
      </Text>

      {/* 4 Interactive Option Rows */}
      <View style={styles.optionsList}>
        {questionData.options.map((opt: string, idx: number) => {
          const isSelected = selectedOpt === idx;
          const isCorrect = idx === questionData.correctIndex;

          let bg = isDarkMode ? colors.surfaceContainerLow : '#f8fafc';
          let border = isDarkMode ? colors.outlineVariant : '#e2e8f0';
          let textClr = colors.onSurface;

          if (isAnswered) {
            if (isCorrect) {
              bg = isDarkMode ? 'rgba(16, 185, 129, 0.25)' : '#d1fae5';
              border = '#10b981';
              textClr = '#065f46';
            } else if (isSelected && !isCorrect) {
              bg = isDarkMode ? 'rgba(239, 68, 68, 0.25)' : '#fee2e2';
              border = '#ef4444';
              textClr = '#991b1b';
            }
          }

          return (
            <TouchableOpacity
              key={idx}
              disabled={isAnswered}
              activeOpacity={0.75}
              style={[
                styles.optionRow,
                { backgroundColor: bg, borderColor: border },
                isSelected && { borderWidth: 2 },
              ]}
              onPress={() => handleSelectOption(idx)}
            >
              <View
                style={[
                  styles.optionLetterCircle,
                  {
                    backgroundColor: isAnswered && isCorrect
                      ? '#10b981'
                      : isAnswered && isSelected && !isCorrect
                      ? '#ef4444'
                      : isDarkMode ? colors.surfaceContainerHigh : '#e2e8f0',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionLetterText,
                    { color: isAnswered && (isCorrect || isSelected) ? '#ffffff' : colors.onSurface },
                  ]}
                >
                  {String.fromCharCode(65 + idx)}
                </Text>
              </View>

              <Text style={[styles.optionLabel, { color: textClr }]}>{opt}</Text>

              {isAnswered && isCorrect && (
                <MaterialIcons name="check-circle" size={18} color="#10b981" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <MaterialIcons name="cancel" size={18} color="#ef4444" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Explanation Box */}
      {isAnswered && (
        <View
          style={[
            styles.explanationBox,
            { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.1)' : '#eff6ff' },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <MaterialIcons name="lightbulb" size={16} color={colors.primary} />
            <Text style={[styles.explanationHeading, { color: colors.primary }]}>
              Solution & Step-by-Step Logic:
            </Text>
          </View>
          <Text style={[styles.explanationText, { color: colors.onSurface }]}>
            {questionData.explanation}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 16,
    marginVertical: 8,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qotdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qotdText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.4,
  },
  topicPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  topicText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4f46e5',
  },
  rightHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  streakText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309',
  },
  collapseToggleBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  collapseToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  questionText: {
    fontSize: 14.5,
    fontWeight: '700',
    lineHeight: 21,
  },
  optionsList: {
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  optionLetterCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: {
    fontSize: 12,
    fontWeight: '800',
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  explanationBox: {
    padding: 12,
    borderRadius: 12,
    marginTop: 2,
  },
  explanationHeading: {
    fontSize: 11,
    fontWeight: '800',
  },
  explanationText: {
    fontSize: 12,
    lineHeight: 18,
  },
  // Collapsed View Styles
  collapsedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginVertical: 8,
  },
  collapsedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  collapsedTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  collapsedSub: {
    fontSize: 11,
    marginTop: 1,
  },
  collapsedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  reviewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  dismissBtn: {
    padding: 4,
  },
});
