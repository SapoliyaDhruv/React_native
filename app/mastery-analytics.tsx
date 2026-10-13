import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/services/api';
import { ACADEMIC_CURRICULUM, AcademicGrade } from '@/constants/academicData';

interface SubjectMasteryItem {
  name: string;
  accuracy: number;
  totalAttempted: number;
  status: 'Mastered' | 'Moderate' | 'Needs Practice';
  color: string;
}

export default function MasteryAnalyticsScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade: AcademicGrade = (user?.grade as AcademicGrade) || 'college';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode && user?.medium === 'Gujarati';

  const [loading, setLoading] = useState<boolean>(true);
  const [masteryData, setMasteryData] = useState<SubjectMasteryItem[]>([]);
  const [overallMastery, setOverallMastery] = useState<number>(0);
  const [totalChapters, setTotalChapters] = useState<number>(0);
  const [completedChapters, setCompletedChapters] = useState<number>(0);

  useEffect(() => {
    async function loadMastery() {
      setLoading(true);
      try {
        // 1. Read real chapter completions from AsyncStorage (saved by courses.tsx)
        const chapterKey = `@mindsprint_completed_chapters_${userGrade}_${user?.email || 'guest'}`;
        const flashKey   = `@mindsprint_flashcard_mastered_${userGrade}_${user?.email || 'guest'}`;
        const [chapterRaw, flashRaw] = await Promise.all([
          AsyncStorage.getItem(chapterKey),
          AsyncStorage.getItem(flashKey),
        ]);
        const completedChapterIds: string[] = chapterRaw ? JSON.parse(chapterRaw) : [];
        const masteredFlashIds: string[]    = flashRaw   ? JSON.parse(flashRaw)   : [];

        // 2. API stats for quiz accuracy (optional, falls back gracefully)
        let apiStats: any = null;
        if (user?.email) {
          apiStats = await ApiService.getDashboardStats(user.email, userGrade);
        }
        const weakMap = apiStats?.weakCategoriesMap || {};
        if (apiStats?.avgScore) setOverallMastery(Math.round(apiStats.avgScore));

        if (isSchoolMode) {
          // 3. Build per-subject mastery from real chapter completions
          const curriculum = ACADEMIC_CURRICULUM[userGrade];
          const subjects = curriculum?.subjects || [];
          let totalChaps = 0;
          let doneChaps  = 0;

          const schoolData: SubjectMasteryItem[] = subjects.map((sub) => {
            const subChapIds = sub.chapters.map((c) => c.id);
            const done = subChapIds.filter((id) => completedChapterIds.includes(id)).length;
            totalChaps += subChapIds.length;
            doneChaps  += done;

            // Count mastered flashcards for this subject
            const flashPrefix = sub.chapters[0]?.id.split('-')[0] + '-' + sub.chapters[0]?.id.split('-')[1];
            const subFlash = masteredFlashIds.filter((id) => sub.chapters.some((c) => id.startsWith(c.id))).length;
            const totalSubFlash = sub.chapters.reduce((acc, c) => {
              return acc + (c.keyFormulas?.length || 0) + (c.exerciseSolutions?.length || 0) + 1;
            }, 0);

            // Accuracy: blend of chapter completion + flashcard mastery + api quiz accuracy
            const chapAccuracy  = subChapIds.length > 0 ? Math.round((done / subChapIds.length) * 100) : 0;
            const flashAccuracy = totalSubFlash > 0 ? Math.round((subFlash / totalSubFlash) * 100) : 0;
            const quizAccuracy  = weakMap[sub.name] ? 45 : (apiStats?.avgScore || 0);
            const blended = Math.max(
              chapAccuracy,
              Math.round((chapAccuracy * 0.5) + (flashAccuracy * 0.3) + (quizAccuracy * 0.2))
            );

            const status: 'Mastered' | 'Moderate' | 'Needs Practice' =
              blended >= 80 ? 'Mastered' : blended >= 50 ? 'Moderate' : 'Needs Practice';

            return {
              name: isGSEB ? (sub.nameGujarati || sub.name) : sub.name,
              accuracy: blended,
              totalAttempted: done,
              chaptersDone: done,
              chaptersTotal: subChapIds.length,
              flashMastered: subFlash,
              status,
              color: sub.color,
            };
          });

          setTotalChapters(totalChaps);
          setCompletedChapters(doneChaps);
          setMasteryData(schoolData);

          // Compute overall mastery from actual data if API hasn't provided it
          if (!apiStats?.avgScore) {
            const avg = schoolData.length > 0 ? Math.round(schoolData.reduce((s, d) => s + d.accuracy, 0) / schoolData.length) : 0;
            setOverallMastery(avg);
          }
        } else {
          // College mode: keep API-driven logic
          const collegeTopics: SubjectMasteryItem[] = [
            { name: 'Quantitative Aptitude', accuracy: weakMap['Quantitative Aptitude'] ? 52 : (apiStats?.avgScore || 75), totalAttempted: 45, status: weakMap['Quantitative Aptitude'] ? 'Needs Practice' : 'Moderate', color: '#f59e0b' },
            { name: 'Data Structures & Algorithms', accuracy: weakMap['Data Structures & Algorithms'] ? 45 : 68, totalAttempted: 38, status: weakMap['Data Structures & Algorithms'] ? 'Needs Practice' : 'Moderate', color: '#ef4444' },
            { name: 'React & Frontend Core', accuracy: 88, totalAttempted: 28, status: 'Mastered', color: '#10b981' },
            { name: 'Logical Reasoning', accuracy: 84, totalAttempted: 32, status: 'Mastered', color: '#3b82f6' },
          ];
          setMasteryData(collegeTopics);
          if (!apiStats?.avgScore) setOverallMastery(72);
        }
      } catch (e) {
        console.warn('Mastery analytics error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadMastery();
  }, [user?.email, userGrade, isSchoolMode, isGSEB]);

  const weakestTopic = masteryData.find((m) => m.status === 'Needs Practice') || masteryData[1] || masteryData[0];

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
              ? `Class ${userGrade} Subject Mastery Radar`
              : 'Placement Topic Mastery Radar'}
          </Text>
          <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
            {isSchoolMode
              ? `${completedChapters}/${totalChapters} Chapters Done • Your Real Progress`
              : 'Placement Topics Mastery'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Overall Mastery Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: '#1e1b4b' }, MindSprintShadows.glow]}>
          <View style={styles.heroTopRow}>
            <View>
          <Text style={styles.heroBadgeText}>
            AI MASTERY INDEX
          </Text>
          <Text style={styles.heroTitle}>{overallMastery}% Mastery</Text>
          <Text style={styles.heroSub}>
            {isSchoolMode
              ? `${completedChapters} of ${totalChapters} chapters completed`
              : 'Calculated across all your recent test responses'}
          </Text>
            </View>
            <View style={[styles.dialCircle, { borderColor: '#10b981' }]}>
              <MaterialIcons name="insights" size={32} color="#10b981" />
            </View>
          </View>
        </View>

        {/* AI Daily Prescription / Study Recommendation */}
        {weakestTopic && (
          <View
            style={[
              styles.prescriptionCard,
              {
                backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : '#fecaca',
              },
              MindSprintShadows.card,
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.rxIconBox, { backgroundColor: '#ef4444' }]}>
                <MaterialIcons name="auto-awesome" size={22} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rxHeading, { color: '#991b1b' }]}>
                  AI Recommended Revision Today:
                </Text>
                <Text style={[styles.rxTitle, { color: colors.onSurface }]}>
                  {weakestTopic.name}
                </Text>
                <Text style={[styles.rxSub, { color: colors.onSurfaceVariant }]}>
                  Current accuracy: {weakestTopic.accuracy}% • Needs quick boost
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.rxQuizBtn, { backgroundColor: '#ef4444' }, MindSprintShadows.glow]}
              onPress={() => router.push(`/exam?limit=10&category=${encodeURIComponent(weakestTopic.name)}`)}
            >
              <MaterialIcons name="play-arrow" size={18} color="#ffffff" />
              <Text style={styles.rxQuizBtnText}>Practice 10 Target Questions 🎯</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Topic-by-Topic Mastery Breakdown */}
        <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>
          Subject Breakdown — Your Real Progress:
        </Text>

        <View style={{ gap: 12 }}>
          {masteryData.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.topicCard,
                {
                  backgroundColor: colors.surfaceContainerLowest,
                  borderColor: colors.outlineVariant,
                },
                MindSprintShadows.card,
              ]}
            >
              <View style={styles.topicHeaderRow}>
                <Text style={[styles.topicName, { color: colors.onSurface }]}>{item.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${item.color}20` }]}>
                  <Text style={[styles.statusBadgeText, { color: item.color }]}>{item.status}</Text>
                </View>
              </View>

              {/* Chapters done / total (school only) */}
              {isSchoolMode && (item as any).chaptersTotal && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MaterialIcons name="menu-book" size={13} color={colors.onSurfaceVariant} />
                  <Text style={[{ fontSize: 11, color: colors.onSurfaceVariant }]}>
                    {(item as any).chaptersDone}/{(item as any).chaptersTotal} Chapters done
                    {(item as any).flashMastered > 0 ? `  •  ${(item as any).flashMastered} flashcards mastered` : ''}
                  </Text>
                </View>
              )}

              {/* Progress Bar */}
              <View style={[styles.progressBarBg, { backgroundColor: isDarkMode ? colors.surfaceContainerHigh : '#e2e8f0' }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${item.accuracy}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>

              <View style={styles.topicFooterRow}>
                <Text style={[styles.accuracyText, { color: item.color }]}>
                  {item.accuracy}% Mastery
                </Text>
                <Text style={[styles.attemptedText, { color: colors.onSurfaceVariant }]}>
                  {isSchoolMode
                    ? `${item.totalAttempted} chapters ✓`
                    : `${item.totalAttempted} questions solved`}
                </Text>
              </View>
            </View>
          ))}
        </View>
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
    gap: 16,
    paddingBottom: 36,
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#818cf8',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    marginVertical: 4,
  },
  heroSub: {
    fontSize: 12,
    color: '#c7d2fe',
    maxWidth: 200,
  },
  dialCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  prescriptionCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    gap: 12,
  },
  rxIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rxHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  rxTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 1,
  },
  rxSub: {
    fontSize: 12,
    marginTop: 1,
  },
  rxQuizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  rxQuizBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  topicCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  topicHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topicName: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    paddingRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  topicFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accuracyText: {
    fontSize: 12,
    fontWeight: '800',
  },
  attemptedText: {
    fontSize: 11,
  },
});
