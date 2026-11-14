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
import { MindSprintShadows, MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { AcademicGrade } from '@/constants/academicData';
import { ApiService } from '@/services/api';

interface DailyChallengeCardProps {
  userGrade?: AcademicGrade;
  streakCount?: number;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  userGrade = 'college',
}) => {
  const { colors, isDarkMode } = useTheme();
  const { tr } = useLanguage();

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
      isCorrect ? tr('Correct', 'સાચો જવાબ') : tr('Not quite', 'થોડું ચૂકી ગયા'),
      isCorrect
        ? tr('Well done. Come back tomorrow for a new question.', 'સરસ. કાલે નવો પ્રશ્ન આવશે.')
        : tr('The right answer and its solution are shown on the card.', 'સાચો જવાબ અને ઉકેલ કાર્ડ પર બતાવ્યો છે.'),
      [{ text: tr('OK, got it', 'સમજાઈ ગયું') }]
    );
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
            backgroundColor: colors.tertiaryContainer,
            borderColor: colors.tertiary,
          },
          MindSprintShadows.card,
        ]}
      >
        <View style={styles.collapsedLeft}>
          <MaterialIcons
            name={isCorrect ? 'check-circle' : 'offline-pin'}
            size={22}
            color={colors.tertiary}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.collapsedTitle, { color: colors.onSurface }]}>
              {tr("Today's question is done", 'આજનો પ્રશ્ન પૂરો થયો')}
            </Text>
            <Text style={[styles.collapsedSub, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
              {questionData.topic} · {isCorrect ? tr('Correct', 'સાચો જવાબ') : tr('Solution seen', 'ઉકેલ જોયો')}
            </Text>
          </View>
        </View>

        <View style={styles.collapsedActions}>
          <TouchableOpacity
            style={[styles.reviewBtn, { backgroundColor: colors.surface }]}
            onPress={() => setIsCollapsed(false)}
          >
            <Text style={[styles.reviewBtnText, { color: colors.onTertiaryContainer }]}>{tr('See again', 'ફરી જુઓ')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dismissBtn}
            onPress={handleDismiss}
            accessibilityLabel={tr("Hide today's question", 'આજનો પ્રશ્ન છુપાવો')}
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
          borderColor: colors.outlineVariant,
        },
        MindSprintShadows.card,
      ]}
    >
      {/* Card Header */}
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View style={styles.qotdBadge}>
            <MaterialIcons name="bolt" size={14} color="#3A2600" />
            <Text style={styles.qotdText}>{tr('Question of the day', 'આજનો પ્રશ્ન')}</Text>
          </View>
          <View style={[styles.topicPill, { backgroundColor: colors.primaryFixed }]}>
            <Text style={[styles.topicText, { color: colors.primary }]} numberOfLines={1}>{questionData.topic}</Text>
          </View>
        </View>

        <View style={styles.rightHeaderActions}>
          {isAnswered && (
            <TouchableOpacity onPress={() => setIsCollapsed(true)} style={styles.collapseToggleBtn}>
              <Text style={[styles.collapseToggleText, { color: colors.primary }]}>{tr('Hide', 'છુપાવો')}</Text>
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

          let bg = isDarkMode ? colors.surfaceContainerLow : '#F5F7FB';
          let border = isDarkMode ? colors.outlineVariant : '#DCE2EE';
          let textClr = colors.onSurface;

          if (isAnswered) {
            if (isCorrect) {
              bg = isDarkMode ? 'rgba(18, 128, 92, 0.25)' : '#DDF3EA';
              border = '#12805C';
              textClr = '#0B5C42';
            } else if (isSelected && !isCorrect) {
              bg = isDarkMode ? 'rgba(200, 55, 45, 0.25)' : '#FBE3E0';
              border = '#C8372D';
              textClr = '#8E2219';
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
                      ? '#12805C'
                      : isAnswered && isSelected && !isCorrect
                      ? '#C8372D'
                      : isDarkMode ? colors.surfaceContainerHigh : '#DCE2EE',
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
                <MaterialIcons name="check-circle" size={18} color="#12805C" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <MaterialIcons name="cancel" size={18} color="#C8372D" />
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
            { backgroundColor: isDarkMode ? 'rgba(147,172,255,0.1)' : '#E3EDFC' },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <MaterialIcons name="lightbulb" size={16} color={colors.primary} />
            <Text style={[styles.explanationHeading, { color: colors.primary }]}>
              {tr('Solution', 'ઉકેલ')}
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
    gap: 8,
  },
  badgeRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qotdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F4A30B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qotdText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 13,
    color: '#3A2600',
  },
  topicPill: {
    backgroundColor: 'rgba(29, 58, 138, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 1,
  },
  topicText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D3A8A',
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
    backgroundColor: 'rgba(244, 163, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  streakText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A5A00',
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
    fontFamily: MindSprintFonts.title,
    fontSize: 17,
    lineHeight: 25,
    marginTop: 12,
    marginBottom: 12,
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
    color: '#0B5C42',
  },
  dismissBtn: {
    padding: 4,
  },
});
