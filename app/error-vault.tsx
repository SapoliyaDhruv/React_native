import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { MistakeItem, MistakeStorage } from '@/services/mistakeStorage';

export default function ErrorVaultScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
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
    Alert.alert('Concept Mastered! 🌟', 'Great job fixing this concept. It has been moved to your Mastered list.');
  };

  const handleRemove = async (id: string) => {
    Alert.alert('Remove Mistake', 'Do you want to remove this question from your Error Vault?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const updated = await MistakeStorage.removeMistake(id, user?.email || 'guest', userGrade);
          setMistakes(updated);
        },
      },
    ]);
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
      {/* Header Bar */}
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
            Error Vault & Mistake Notebook 🛡️
          </Text>
          <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
            {isSchoolMode ? `Class ${userGrade} • Fix Your Weak Concepts` : 'Placement Prep • Fix Past Errors'}
          </Text>
        </View>
        <View style={[styles.badgePill, { backgroundColor: '#ef444420' }]}>
          <MaterialIcons name="security" size={14} color="#ef4444" />
          <Text style={[styles.badgeText, { color: '#ef4444' }]}>{needsPracticeCount} to fix</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Intro Card */}
        <View style={[styles.introCard, { backgroundColor: '#1e1b4b' }, MindSprintShadows.card]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={styles.introIconBox}>
              <MaterialIcons name="psychology-alt" size={24} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.introTitle}>Smart Error Remediation</Text>
              <Text style={styles.introSub}>
                Every question answered incorrectly in Quizzes, Mock Exams, and Duels is saved here until you master it.
              </Text>
            </View>
          </View>
          {needsPracticeCount > 0 && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                marginTop: 12,
                backgroundColor: '#ef4444',
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onPress={() => router.push(`/exam?isDiagnostic=true&limit=${Math.min(25, Math.max(5, needsPracticeCount))}`)}
            >
              <MaterialIcons name="replay" size={18} color="#ffffff" />
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 13 }}>
                Retest & Practice Weak Concepts ({needsPracticeCount})
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabBar, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f1f5f9' }]}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'needs_practice' && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab('needs_practice')}
          >
            <Text style={[styles.tabBtnText, { color: activeTab === 'needs_practice' ? '#ffffff' : colors.onSurface }]}>
              Needs Practice ({needsPracticeCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'mastered' && { backgroundColor: '#10b981' }]}
            onPress={() => setActiveTab('mastered')}
          >
            <Text style={[styles.tabBtnText, { color: activeTab === 'mastered' ? '#ffffff' : colors.onSurface }]}>
              Mastered ({masteredCount}) ✓
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
                  <Text style={[styles.chipText, { color: isSel ? '#ffffff' : colors.onSurface }]}>
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
            <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>Loading your error vault...</Text>
          </View>
        ) : filteredMistakes.length === 0 ? (
          <View style={styles.centerBox}>
            <MaterialIcons
              name={activeTab === 'needs_practice' ? 'verified' : 'emoji-events'}
              size={56}
              color={activeTab === 'needs_practice' ? '#10b981' : colors.outline}
            />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
              {activeTab === 'needs_practice' ? 'No Pending Mistakes! 🎉' : 'No Mastered Concepts Yet'}
            </Text>
            <Text style={[styles.emptySub, { color: colors.onSurfaceVariant }]}>
              {activeTab === 'needs_practice'
                ? 'You have zero pending errors in this subject. Keep taking quizzes to test your knowledge!'
                : 'Solve your pending questions and mark them mastered to build your trophy vault.'}
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
                    borderColor: item.status === 'needs_practice' ? '#ef4444' : '#10b981',
                    borderLeftWidth: 4,
                  },
                  MindSprintShadows.card,
                ]}
              >
                {/* Meta Row */}
                <View style={styles.metaRow}>
                  <View style={[styles.subjectTag, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.2)' : '#e0e7ff' }]}>
                    <Text style={[styles.subjectTagText, { color: colors.primary }]}>{item.subject}</Text>
                  </View>
                  {item.chapter && (
                    <Text style={[styles.chapterTagText, { color: colors.onSurfaceVariant }]}>
                      {item.chapter}
                    </Text>
                  )}
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.deleteBtn}>
                    <MaterialIcons name="delete-outline" size={18} color="#ef4444" />
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

                      let optBg = isDarkMode ? colors.surfaceContainerLow : '#f8fafc';
                      let optBorder = colors.outlineVariant;
                      let optTextColor = colors.onSurface;

                      if (isCorrect) {
                        optBg = 'rgba(16, 185, 129, 0.15)';
                        optBorder = '#10b981';
                        optTextColor = '#10b981';
                      } else if (wasSelected) {
                        optBg = 'rgba(239, 68, 68, 0.15)';
                        optBorder = '#ef4444';
                        optTextColor = '#ef4444';
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
                            color={isCorrect ? '#10b981' : wasSelected ? '#ef4444' : colors.outline}
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
                  style={[styles.toggleAnsBtn, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f1f5f9' }]}
                  onPress={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <MaterialIcons name={isExpanded ? 'visibility-off' : 'lightbulb'} size={16} color={colors.primary} />
                  <Text style={[styles.toggleAnsBtnText, { color: colors.primary }]}>
                    {isExpanded ? 'Hide Step-by-Step Solution ▲' : 'View Verified Model Solution 💡'}
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={[styles.explanationCard, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#fafafa' }]}>
                    <Text style={[styles.solutionHeading, { color: '#10b981' }]}>
                      ✓ Verified Solution & Rule:
                    </Text>
                    <Text style={[styles.explanationText, { color: colors.onSurface }]}>
                      {displayExplanation || 'Refer to the textbook theorem or step-by-step formula for this question.'}
                    </Text>
                  </View>
                )}

                {/* Remediation Action Buttons */}
                {item.status === 'needs_practice' && (
                  <TouchableOpacity
                    style={[styles.masterBtn, { backgroundColor: '#10b981' }]}
                    onPress={() => handleMarkResolved(item.id)}
                  >
                    <MaterialIcons name="done-all" size={18} color="#ffffff" />
                    <Text style={styles.masterBtnText}>I Have Mastered This Concept ✓</Text>
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
    fontSize: 12,
    color: '#c7d2fe',
    marginTop: 2,
    lineHeight: 17,
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
    fontSize: 17,
    fontWeight: '800',
    marginTop: 4,
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
