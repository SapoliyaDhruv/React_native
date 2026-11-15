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
import { ScreenHeader } from '@/components/mindsprint/ScreenHeader';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows, MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ApiService } from '@/services/api';
import { ACADEMIC_CURRICULUM, AcademicGrade, subjectsForStream } from '@/constants/academicData';

interface SubjectMasteryItem {
  name: string;
  accuracy: number;
  totalAttempted: number;
  status: 'Mastered' | 'Moderate' | 'Needs Practice' | 'Not started';
  color: string;
}

export default function MasteryAnalyticsScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { tr } = useLanguage();
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
        if (apiStats?.avgScore) setOverallMastery(Math.round(apiStats.avgScore));

        if (isSchoolMode) {
          // 3. Build per-subject mastery from real chapter completions
          const curriculum = ACADEMIC_CURRICULUM[userGrade];
          const subjects = subjectsForStream(curriculum?.subjects, userGrade, user?.stream);
          let totalChaps = 0;
          let doneChaps  = 0;

          const schoolData: SubjectMasteryItem[] = subjects.map((sub) => {
            const subChapIds = sub.chapters.map((c) => c.id);
            const done = subChapIds.filter((id) => completedChapterIds.includes(id)).length;
            totalChaps += subChapIds.length;
            doneChaps  += done;

            // Count mastered flashcards for this subject
            const subFlash = masteredFlashIds.filter((id) => sub.chapters.some((c) => id.startsWith(c.id))).length;
            const totalSubFlash = sub.chapters.reduce((acc, c) => {
              return acc + (c.keyFormulas?.length || 0) + (c.exerciseSolutions?.length || 0) + 1;
            }, 0);

            // Accuracy: blend of chapter completion + flashcard mastery + api quiz accuracy
            const chapAccuracy  = subChapIds.length > 0 ? Math.round((done / subChapIds.length) * 100) : 0;
            const flashAccuracy = totalSubFlash > 0 ? Math.round((subFlash / totalSubFlash) * 100) : 0;
            // Only real test averages count; no invented per-subject scores.
            const quizAccuracy  = apiStats?.avgScore || 0;
            const blended = Math.max(
              chapAccuracy,
              Math.round((chapAccuracy * 0.5) + (flashAccuracy * 0.3) + (quizAccuracy * 0.2))
            );

            const started = done > 0 || subFlash > 0 || (apiStats?.totalTests || 0) > 0;
            const status: SubjectMasteryItem['status'] = !started
              ? 'Not started'
              : blended >= 80 ? 'Mastered' : blended >= 50 ? 'Moderate' : 'Needs Practice';

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
          // College mode: calculate based on actual user test history from recentActivity
          const recent = apiStats?.recentActivity || [];
          const avgSc = Math.round(apiStats?.avgScore || 0);

          const categories = [
            { name: 'Quantitative Aptitude', color: '#F4A30B' },
            { name: 'Data Structures & Algorithms', color: '#C8372D' },
            { name: 'React & Frontend Core', color: '#12805C' },
            { name: 'Logical Reasoning', color: '#2F6FD6' },
          ];

          const collegeTopics: SubjectMasteryItem[] = categories.map((cat) => {
            const catTests = recent.filter((r: any) =>
              (r.category && r.category.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0])) ||
              (r.weakCategories && r.weakCategories.includes(cat.name))
            );

            let accuracy = 0;
            let totalAttempted = 0;

            if (catTests.length > 0) {
              const sum = catTests.reduce((acc: number, t: any) => acc + (t.scorePercentage || 0), 0);
              accuracy = Math.round(sum / catTests.length);
              totalAttempted = catTests.length;
            }
            // Topics with no tests stay "Not started"; we never estimate a score.

            const status: SubjectMasteryItem['status'] = totalAttempted === 0
              ? 'Not started'
              : accuracy >= 75 ? 'Mastered' : accuracy >= 50 ? 'Moderate' : 'Needs Practice';

            return {
              name: cat.name,
              accuracy,
              totalAttempted,
              status,
              color: cat.color,
            };
          });

          setMasteryData(collegeTopics);
          setOverallMastery(avgSc);
        }
      } catch (e) {
        console.warn('Mastery analytics error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadMastery();
  }, [user?.email, userGrade, isSchoolMode, isGSEB, user?.stream]);

  const weakestTopic =
    masteryData.find((m) => m.status === 'Needs Practice') ||
    masteryData.find((m) => m.status === 'Not started') ||
    masteryData[0];
  const statusLabel = (st: SubjectMasteryItem['status']) =>
    st === 'Mastered'
      ? tr('Strong', 'મજબૂત')
      : st === 'Moderate'
      ? tr('Getting there', 'સુધારો થઈ રહ્યો છે')
      : st === 'Needs Practice'
      ? tr('Needs practice', 'પ્રેક્ટિસ જરૂરી')
      : tr('Not started', 'શરૂ નથી કર્યું');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader
        title={tr('My strengths', 'મારી તાકાત')}
        subtitle={isSchoolMode ? tr(`Class ${userGrade} · ${completedChapters}/${totalChapters} chapters done`, `ધોરણ ${userGrade} · ${totalChapters} માંથી ${completedChapters} પ્રકરણ પૂરા`) : tr('Placement topics', 'પ્લેસમેન્ટ વિષયો')}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Overall Mastery Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: '#12245C' }, MindSprintShadows.glow]}>
          <View style={styles.heroTopRow}>
            <View>
          <Text style={styles.heroBadgeText}>
            {tr('Overall', 'કુલ')}
          </Text>
          <Text style={styles.heroTitle}>
            {overallMastery > 0 || completedChapters > 0
              ? tr(`${overallMastery}% mastered`, `${overallMastery}% મજબૂત`)
              : tr('Not started yet', 'હજુ શરૂ નથી કર્યું')}
          </Text>
          <Text style={styles.heroSub}>
            {isSchoolMode
              ? tr(`${completedChapters} of ${totalChapters} chapters completed`, `${totalChapters} માંથી ${completedChapters} પ્રકરણ પૂરા`)
              : tr('Based on the tests you have taken', 'તમે આપેલા ટેસ્ટ પરથી')}
          </Text>
            </View>
            <View style={[styles.dialCircle, { borderColor: '#12805C' }]}>
              <MaterialIcons name="insights" size={32} color="#12805C" />
            </View>
          </View>
        </View>

        {/* AI Daily Prescription / Study Recommendation */}
        {weakestTopic && (
          <View
            style={[
              styles.prescriptionCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.outlineVariant,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.rxIconBox, { backgroundColor: colors.primaryFixed }]}>
                <MaterialIcons name="track-changes" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rxHeading, { color: colors.onSurfaceVariant }]}>
                  {weakestTopic.status === 'Not started' ? tr('Start with this', 'અહીંથી શરૂ કરો') : tr('Practise this today', 'આજે આ પ્રેક્ટિસ કરો')}
                </Text>
                <Text style={[styles.rxTitle, { color: colors.onSurface }]}>
                  {weakestTopic.name}
                </Text>
                <Text style={[styles.rxSub, { color: colors.onSurfaceVariant }]}>
                  {weakestTopic.status === 'Not started'
                    ? tr('No tests taken yet', 'હજુ કોઈ ટેસ્ટ નથી આપ્યો')
                    : tr(`Current accuracy ${weakestTopic.accuracy}%`, `હાલની ચોકસાઈ ${weakestTopic.accuracy}%`)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.rxQuizBtn, { backgroundColor: colors.accent }]}
              onPress={() => router.push(`/exam?limit=10&category=${encodeURIComponent(weakestTopic.name)}`)}
            >
              <MaterialIcons name="play-arrow" size={20} color={colors.onAccent} />
              <Text style={[styles.rxQuizBtnText, { color: colors.onAccent }]}>{tr('Practise 10 questions', '10 પ્રશ્નો પ્રેક્ટિસ કરો')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Topic-by-Topic Mastery Breakdown */}
        <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>
          {tr('By subject', 'વિષય પ્રમાણે')}
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
                  <Text style={[styles.statusBadgeText, { color: item.color }]}>{statusLabel(item.status)}</Text>
                </View>
              </View>

              {/* Chapters done / total (school only) */}
              {isSchoolMode && (item as any).chaptersTotal && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MaterialIcons name="menu-book" size={13} color={colors.onSurfaceVariant} />
                  <Text style={[{ fontSize: 11, color: colors.onSurfaceVariant }]}>
                    {tr(`${(item as any).chaptersDone}/${(item as any).chaptersTotal} chapters done`, `${(item as any).chaptersTotal} માંથી ${(item as any).chaptersDone} પ્રકરણ પૂરા`)}
                    {(item as any).flashMastered > 0 ? tr(` · ${(item as any).flashMastered} flashcards learned`, ` · ${(item as any).flashMastered} ફ્લેશકાર્ડ શીખ્યા`) : ''}
                  </Text>
                </View>
              )}

              {/* Progress Bar */}
              <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceContainer }]}>
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
                  {tr(`${item.accuracy}% mastered`, `${item.accuracy}% મજબૂત`)}
                </Text>
                {/* School cards already show chapters done above; college shows tests taken. */}
                {!isSchoolMode && (
                  <Text style={[styles.attemptedText, { color: colors.onSurfaceVariant }]}>
                    {tr(`${item.totalAttempted} tests`, `${item.totalAttempted} ટેસ્ટ`)}
                  </Text>
                )}
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
    fontSize: 13,
    fontWeight: '600',
    color: '#B9C6EA',
  },
  heroTitle: {
    fontFamily: MindSprintFonts.display,
    fontSize: 30,
    lineHeight: 38,
    color: '#ffffff',
  },
  heroSub: {
    fontSize: 12,
    color: '#C9D5F5',
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
    fontFamily: MindSprintFonts.heading,
    fontSize: 18,
    lineHeight: 24,
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
    fontFamily: MindSprintFonts.label,
    fontSize: 16,
  },
  sectionHeading: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 20,
    lineHeight: 26,
    marginTop: 8,
    marginBottom: 10,
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
