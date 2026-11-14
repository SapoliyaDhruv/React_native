import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/mindsprint/ScreenHeader';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { notify, confirmAction } from '@/components/common/dialogs';
import { MistakeItem, MistakeStorage } from '@/services/mistakeStorage';

export default function ErrorVaultScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { tr } = useLanguage();
  const { user } = useAuth();

  const userGrade = user?.grade || '10';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode && user?.medium === 'Gujarati';

  const [loading, setLoading] = useState<boolean>(true);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [activeTab, setActiveTab] = useState<'needs_practice' | 'mastered'>('needs_practice');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadMistakes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await MistakeStorage.getMistakes(user?.email || 'guest', userGrade);
      setMistakes(data);
    } catch (e) {
      console.warn('Error loading error vault:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.email, userGrade]);

  useFocusEffect(
    useCallback(() => {
      loadMistakes();
    }, [loadMistakes])
  );

  const handleMarkResolved = async (id: string) => {
    const updated = await MistakeStorage.markResolved(id, user?.email || 'guest', userGrade);
    setMistakes(updated);
    notify(tr('Marked as fixed', 'સુધારેલું તરીકે નોંધ્યું'), tr('This question moved to your Fixed list.', 'આ પ્રશ્ન તમારી સુધારેલી યાદીમાં ગયો.'));
  };

  const handleRemove = async (id: string) => {
    confirmAction({
      title: tr('Remove question?', 'પ્રશ્ન દૂર કરવો છે?'),
      message: tr('It will no longer appear in Fix my mistakes.', 'તે હવે "ભૂલો સુધારો"માં નહીં દેખાય.'),
      confirmText: tr('Remove', 'દૂર કરો'),
      cancelText: tr('Cancel', 'રદ કરો'),
      destructive: true,
      onConfirm: async () => {
        const updated = await MistakeStorage.removeMistake(id, user?.email || 'guest', userGrade);
        setMistakes(updated);
      },
    });
  };

  // Distinct subjects for filter
  const subjects = ['All', ...Array.from(new Set(mistakes.map((m) => m.subject).filter(Boolean)))];

  const filteredMistakes = mistakes.filter((m) => {
    const tabMatch = m.status === activeTab;
    const subjectMatch = selectedSubject === 'All' || m.subject === selectedSubject;
    return tabMatch && subjectMatch;
  });

  const needsPracticeCount = mistakes.filter((m) => m.status === 'needs_practice').length;
  const masteredCount = mistakes.filter((m) => m.status === 'mastered').length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader
        title={tr('Fix my mistakes', 'મારી ભૂલો સુધારો')}
        subtitle={isSchoolMode ? tr(`Class ${userGrade} · questions you got wrong`, `ધોરણ ${userGrade} · ખોટા પડેલા પ્રશ્નો`) : tr('Placement prep · questions you got wrong', 'પ્લેસમેન્ટ · ખોટા પડેલા પ્રશ્નો')}
        right={
          needsPracticeCount > 0 ? (
            <View style={[styles.badgePill, { backgroundColor: colors.errorContainer }]}>
              <Text style={[styles.badgeText, { color: colors.error }]}>{needsPracticeCount} to fix</Text>
            </View>
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Intro: what this screen is, and the one action that matters */}
        <View style={[styles.introCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant, borderWidth: 1 }]}>
          <Text style={[styles.introSub, { color: colors.onSurfaceVariant }]}>
            Every question you get wrong in quizzes, tests and duels is kept here until you get it right.
          </Text>
          {needsPracticeCount > 0 && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.retestBtn, { backgroundColor: colors.accent }]}
              onPress={() => router.push(`/exam?isDiagnostic=true&limit=${Math.min(25, Math.max(5, needsPracticeCount))}`)}
              accessibilityRole="button"
            >
              <MaterialIcons name="replay" size={20} color={colors.onAccent} />
              <Text style={[styles.retestText, { color: colors.onAccent }]}>
                Practise these {needsPracticeCount} again
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabBar, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#EEF2F8' }]}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'needs_practice' && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab('needs_practice')}
          >
            <Text style={[styles.tabBtnText, { color: activeTab === 'needs_practice' ? colors.onPrimary : colors.onSurface }]}>
              To fix ({needsPracticeCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'mastered' && { backgroundColor: colors.tertiary }]}
            onPress={() => setActiveTab('mastered')}
          >
            <Text style={[styles.tabBtnText, { color: activeTab === 'mastered' ? colors.onPrimary : colors.onSurface }]}>
              Fixed ({masteredCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subject Filter Chips */}
        {subjects.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            {subjects.map((sub) => {
              const isSel = selectedSubject === sub;
              return (
                <TouchableOpacity
                  key={sub}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSel ? colors.primary : isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                      borderColor: isSel ? colors.primary : colors.outlineVariant,
                    },
                  ]}
                  onPress={() => setSelectedSubject(sub)}
                >
                  <Text style={[styles.chipText, { color: isSel ? colors.onPrimary : colors.onSurface }]}>
                    {sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Items List */}
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>Loading your mistakes…</Text>
          </View>
        ) : filteredMistakes.length === 0 ? (
          <View style={styles.centerBox}>
            <MaterialIcons
              name={activeTab === 'needs_practice' ? 'verified' : 'emoji-events'}
              size={56}
              color={activeTab === 'needs_practice' ? '#12805C' : colors.outline}
            />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
              {activeTab === 'needs_practice' ? 'Nothing to fix right now' : 'Nothing fixed yet'}
            </Text>
            <Text style={[styles.emptySub, { color: colors.onSurfaceVariant }]}>
              {activeTab === 'needs_practice'
                ? 'Questions you get wrong in a quiz will appear here.'
                : 'Open a question under “To fix”, read the solution, then mark it fixed.'}
            </Text>
          </View>
        ) : (
          filteredMistakes.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const displayQuestion = (isGSEB && item.questionTextGujarati) ? item.questionTextGujarati : item.questionText;
            const displayExplanation = (isGSEB && item.explanationGujarati) ? item.explanationGujarati : item.explanation;

            return (
              <View
                key={item.id}
                style={[
                  styles.mistakeCard,
                  {
                    backgroundColor: colors.surfaceContainerLowest,
                    borderColor: item.status === 'needs_practice' ? '#C8372D' : '#12805C',
                    borderLeftWidth: 4,
                  },
                  MindSprintShadows.card,
                ]}
              >
                {/* Meta Row */}
                <View style={styles.metaRow}>
                  <View style={[styles.subjectTag, { backgroundColor: isDarkMode ? 'rgba(147,172,255,0.2)' : '#E4EAF8' }]}>
                    <Text style={[styles.subjectTagText, { color: colors.primary }]}>{item.subject}</Text>
                  </View>
                  {item.chapter && (
                    <Text style={[styles.chapterTagText, { color: colors.onSurfaceVariant }]}>
                      {item.chapter}
                    </Text>
                  )}
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.deleteBtn}>
                    <MaterialIcons name="delete-outline" size={18} color="#C8372D" />
                  </TouchableOpacity>
                </View>

                {/* Question Statement */}
                <Text style={[styles.questionText, { color: colors.onSurface }]}>
                  {idx + 1}. {displayQuestion}
                </Text>

                {/* Options If Present */}
                {item.options && item.options.length > 0 && (
                  <View style={styles.optionsBox}>
                    {item.options.map((opt, optIdx) => {
                      const isCorrect = String(optIdx) === String(item.correctAnswer) || opt === item.correctAnswerText;
                      const wasSelected = String(optIdx) === String(item.selectedAnswer);

                      let optBg = isDarkMode ? colors.surfaceContainerLow : '#F5F7FB';
                      let optBorder = colors.outlineVariant;
                      let optTextColor = colors.onSurface;

                      if (isCorrect) {
                        optBg = 'rgba(18, 128, 92, 0.15)';
                        optBorder = '#12805C';
                        optTextColor = '#12805C';
                      } else if (wasSelected) {
                        optBg = 'rgba(200, 55, 45, 0.15)';
                        optBorder = '#C8372D';
                        optTextColor = '#C8372D';
                      }

                      return (
                        <View
                          key={optIdx}
                          style={[
                            styles.optionRow,
                            { backgroundColor: optBg, borderColor: optBorder },
                          ]}
                        >
                          <MaterialIcons
                            name={isCorrect ? 'check-circle' : wasSelected ? 'cancel' : 'radio-button-unchecked'}
                            size={16}
                            color={isCorrect ? '#12805C' : wasSelected ? '#C8372D' : colors.outline}
                          />
                          <Text style={[styles.optionText, { color: optTextColor }]} numberOfLines={2}>
                            {opt}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Toggle Model Answer / Explanation */}
                <TouchableOpacity
                  style={[styles.toggleAnsBtn, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#EEF2F8' }]}
                  onPress={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <MaterialIcons name={isExpanded ? 'visibility-off' : 'lightbulb'} size={16} color={colors.primary} />
                  <Text style={[styles.toggleAnsBtnText, { color: colors.primary }]}>
                    {isExpanded ? 'Hide Step-by-Step Solution ▲' : 'View Verified Model Solution 💡'}
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={[styles.explanationCard, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#fafafa' }]}>
                    <Text style={[styles.solutionHeading, { color: '#12805C' }]}>
                      Solution
                    </Text>
                    <Text style={[styles.explanationText, { color: colors.onSurface }]}>
                      {displayExplanation || 'Refer to the textbook theorem or step-by-step formula for this question.'}
                    </Text>
                  </View>
                )}

                {/* Remediation Action Buttons */}
                {item.status === 'needs_practice' && (
                  <TouchableOpacity
                    style={[styles.masterBtn, { backgroundColor: '#12805C' }]}
                    onPress={() => handleMarkResolved(item.id)}
                  >
                    <MaterialIcons name="done-all" size={18} color="#ffffff" />
                    <Text style={styles.masterBtnText}>Mark as fixed</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  retestBtn: {
    marginTop: 12,
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retestText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 16,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 60,
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
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  scrollContainer: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  introCard: {
    borderRadius: 20,
    padding: 16,
  },
  introIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  introSub: {
    fontSize: 14,
    lineHeight: 20,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  centerBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 13,
    marginTop: 8,
  },
  emptyTitle: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 20,
    lineHeight: 26,
    marginTop: 12,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  mistakeCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subjectTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subjectTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  chapterTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 4,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  optionsBox: {
    gap: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  toggleAnsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  toggleAnsBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  explanationCard: {
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  solutionHeading: {
    fontSize: 12,
    fontWeight: '800',
  },
  explanationText: {
    fontSize: 12,
    lineHeight: 18,
  },
  masterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  masterBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
