import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows, MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/services/api';
import { TrackType } from '@/constants/mindsprintData';
import {
  AcademicGrade,
  EducationBoard,
  InstructionMedium,
  GradeCurriculum,
  ACADEMIC_CURRICULUM,
} from '@/constants/academicData';
import { TrackSwitcher } from '@/components/mindsprint/TrackSwitcher';
import { SearchBar } from '@/components/mindsprint/SearchBar';
import { CompanyFilterBar } from '@/components/mindsprint/CompanyFilterBar';
import { StreakWidget } from '@/components/mindsprint/StreakWidget';
import { StatsCard } from '@/components/mindsprint/StatsCard';
import { PerformanceChart } from '@/components/mindsprint/PerformanceChart';
import { RecentActivityList } from '@/components/mindsprint/RecentActivityList';
import { DashboardSkeleton } from '@/components/mindsprint/SkeletonLoader';
import { AcademicGradeModal } from '@/components/mindsprint/AcademicGradeModal';
import { DailyChallengeCard } from '@/components/mindsprint/DailyChallengeCard';
import { MorningSprintModal } from '@/components/mindsprint/MorningSprintModal';
import { ShareProgressModal } from '@/components/mindsprint/ShareProgressModal';
import { TodayCard } from '@/components/mindsprint/home/TodayCard';
import { TextbookShelf } from '@/components/mindsprint/home/TextbookShelf';
import { ToolList, ToolItem } from '@/components/mindsprint/home/ToolList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLastChapter, LastChapter } from '@/services/learningProgress';
import { useLanguage } from '@/context/LanguageContext';
import { PlanCard } from '@/components/mindsprint/home/PlanCard';
import { examCountdown, nextChapters, shortSubjectName } from '@/components/mindsprint/home/studyPlan';
import { CoachTour, CoachStep } from '@/components/tour/CoachTour';

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDpTpadB_GY_XTy7q4R83ni9Q0r3ovKCNCuNHvfTLdAAUsEDZQQ26lLxFQO_WijYLtiUQadQJ_c0VDSE0fHXcuipv31vufAkHZtjG1aj35AKp-BjX-2zVCFy4qBBlHxSdFhkGtwh5DKfM4qwVUmYdc-K3yrzrEPvVhlN2E9YXrZH1pl8ECG17oL9IkbPI8NtjpIidsOBmstyEVvCWiL4dNDK14kJBzDlDXzw8GOBDLwWHwzKNd5EGU3';

// Set once the first-open Home tour has been shown or skipped.
const TOUR_KEY = '@mindsprint_home_tour_v1';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, updateAcademicProfile } = useAuth();
  const { tr, isGujarati } = useLanguage();

  const userGrade: AcademicGrade = user?.grade || 'college';
  const isSchoolMode = userGrade !== 'college';

  // Initial state with immediate fallback so there is never a blank flash
  const [curriculum, setCurriculum] = useState<GradeCurriculum | null>(
    ACADEMIC_CURRICULUM[userGrade] || null
  );
  const [activeTrack, setActiveTrack] = useState<TrackType>('placement');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    ACADEMIC_CURRICULUM[userGrade]?.subjects?.[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('All Companies');
  const [showExamModal, setShowExamModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState<number>(10);
  const [userStats, setUserStats] = useState<any>(null);
  // Real weak topics only; empty until the student has taken tests.
  const [weakSpots, setWeakSpots] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastChapter, setLastChapter] = useState<LastChapter | null>(null);
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>([]);
  const [showMorningSprint, setShowMorningSprint] = useState<boolean>(false);
  const [showShareProgress, setShowShareProgress] = useState<boolean>(false);
  const [showTour, setShowTour] = useState<boolean>(false);

  // Tour targets
  const rootRef = useRef<View>(null);
  const todayRef = useRef<View>(null);
  const shelfRef = useRef<View>(null);
  const searchRef = useRef<View>(null);

  // Chapter completion is written by Courses; read it so the shelf shows real progress.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      AsyncStorage.getItem(`@mindsprint_completed_chapters_${userGrade}_${user?.email || 'guest'}`)
        .then((raw) => { if (active) setCompletedChapterIds(raw ? JSON.parse(raw) : []); })
        .catch(() => {});
      return () => { active = false; };
    }, [userGrade, user?.email])
  );

  // "Continue where you left off": refreshed every time the Home tab comes into view
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getLastChapter(userGrade, user?.email).then((c) => { if (active) setLastChapter(c); });
      return () => { active = false; };
    }, [userGrade, user?.email])
  );

  // Show the first-open tour once per device.
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(TOUR_KEY)
      .then((seen) => { if (active && !seen) setShowTour(true); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const finishTour = () => {
    setShowTour(false);
    AsyncStorage.setItem(TOUR_KEY, '1').catch(() => {});
  };

  // Fetch dynamic curriculum from the server (falls back to bundled data)
  useEffect(() => {
    async function loadCurriculum() {
      try {
        const currData = await ApiService.getCurriculum(userGrade);
        if (currData && currData.subjects && currData.subjects.length > 0) {
          setCurriculum(currData);
          setSelectedSubjectId((prev) =>
            prev && currData.subjects.find((s: any) => s.id === prev) ? prev : currData.subjects[0].id
          );
        }
      } catch (err) {
        console.warn('Failed to load dynamic curriculum:', err);
      }
    }
    loadCurriculum();
  }, [userGrade]);

  const hasStatsRef = useRef(false);
  const userEmail = user?.email;
  const loadStats = useCallback(async (isRefresh = false) => {
    if (!isRefresh && !hasStatsRef.current) setLoading(true);
    try {
      if (userEmail) {
        const [stats, weak] = await Promise.all([
          ApiService.getDashboardStats(userEmail, userGrade),
          ApiService.getWeakSpots(userEmail, userGrade),
        ]);
        if (stats) {
          setUserStats(stats);
          hasStatsRef.current = true;
        }
        setWeakSpots(weak && weak.totalTests > 0 && Array.isArray(weak.weakTopics) ? weak.weakTopics : []);
      }
    } catch (e) {
      console.warn('Dashboard stats load note:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userEmail, userGrade]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadStats(true);
  };

  const handleSaveGrade = async (grade: AcademicGrade, board: EducationBoard, medium: InstructionMedium) => {
    await updateAcademicProfile(grade, board, medium);
    try {
      const currData = await ApiService.getCurriculum(grade);
      if (currData && currData.subjects && currData.subjects.length > 0) {
        setCurriculum(currData);
        setSelectedSubjectId(currData.subjects[0].id);
      } else if (ACADEMIC_CURRICULUM[grade]) {
        setCurriculum(ACADEMIC_CURRICULUM[grade]);
        setSelectedSubjectId(ACADEMIC_CURRICULUM[grade].subjects[0].id);
      }
    } catch (e) {
      console.warn('Curriculum update error:', e);
    }

    if (user?.email) {
      const [stats, weak] = await Promise.all([
        ApiService.getDashboardStats(user.email, grade),
        ApiService.getWeakSpots(user.email, grade),
      ]);
      if (stats) setUserStats(stats);
      setWeakSpots(weak && weak.totalTests > 0 && Array.isArray(weak.weakTopics) ? weak.weakTopics : []);
    }
  };

  const activeSubjects = curriculum?.subjects || [];
  const activeSubject = activeSubjects.find((s) => s.id === selectedSubjectId) || activeSubjects[0];
  const recentActivity = Array.isArray(userStats?.recentActivity) ? userStats.recentActivity : [];
  // A streak needs recorded activity; never show one for a student with no tests.
  const hasActivity = (Number(userStats?.totalTests) || 0) > 0 || recentActivity.length > 0;
  const streak: number = hasActivity ? Number(userStats?.streakCount) || 0 : 0;

  // Practice tools: one calm list. Wording says what each tool does.
  const subjectLabel = activeSubject ? shortSubjectName(activeSubject, isGujarati) : tr('Mixed', 'મિશ્ર');
  const practiceTools: ToolItem[] = isSchoolMode
    ? [
        { key: 'quiz', icon: 'bolt', title: tr('Quick 10-question quiz', 'ઝડપી 10 પ્રશ્નોની ક્વિઝ'), subtitle: tr(`${subjectLabel} · about 5 minutes`, `${subjectLabel} · આશરે 5 મિનિટ`), onPress: () => router.push(`/exam?limit=10&category=${encodeURIComponent(activeSubject?.name || 'Science')}`) },
        { key: 'board', icon: 'assignment', title: tr('Board exam paper', 'બોર્ડ પરીક્ષાનું પેપર'), subtitle: tr('Full 80-mark timed paper', '80 ગુણનું પૂરું સમયબદ્ધ પેપર'), onPress: () => router.push('/board-exam-simulator' as any) },
        { key: 'imp', icon: 'star-outline', title: tr('Important questions', 'મહત્વના પ્રશ્નો'), subtitle: tr('1 to 4 mark questions by chapter', 'પ્રકરણ પ્રમાણે 1 થી 4 ગુણના પ્રશ્નો'), onPress: () => router.push('/(tabs)/courses') },
        { key: 'sprint', icon: 'timer', title: tr('2-minute revision', '2 મિનિટનું પુનરાવર્તન'), subtitle: tr('Recall what you studied before', 'પહેલાં ભણેલું યાદ કરો'), onPress: () => setShowMorningSprint(true) },
        { key: 'vault', icon: 'replay', title: tr('Fix my mistakes', 'મારી ભૂલો સુધારો'), subtitle: tr('Retry questions you got wrong', 'ખોટા પડેલા પ્રશ્નો ફરી કરો'), onPress: () => router.push('/error-vault' as any) },
        { key: 'doubt', icon: 'photo-camera', title: tr('Scan a doubt', 'શંકાનો ફોટો પાડો'), subtitle: tr('Photo of a question → step-by-step help', 'પ્રશ્નનો ફોટો → પગલાવાર મદદ'), onPress: () => router.push('/doubt-solver' as any) },
      ]
    : [
        { key: 'mock', icon: 'tune', title: tr('Custom mock test', 'તમારી પસંદગીનો મૉક ટેસ્ટ'), subtitle: tr('Pick topics and number of questions', 'વિષય અને પ્રશ્નોની સંખ્યા પસંદ કરો'), onPress: () => setShowExamModal(true) },
        { key: 'interview', icon: 'record-voice-over', title: tr('Interview practice', 'ઇન્ટરવ્યૂની પ્રેક્ટિસ'), subtitle: tr('Answer HR and technical questions', 'HR અને ટેક્નિકલ પ્રશ્નોના જવાબ આપો'), onPress: () => router.push('/interview-simulator') },
        { key: 'cards', icon: 'style', title: tr('Flashcards', 'ફ્લૅશકાર્ડ'), subtitle: tr('HR and technical Q&A', 'HR અને ટેક્નિકલ પ્રશ્નોત્તર'), onPress: () => router.push('/flashcards') },
        { key: 'sprint', icon: 'timer', title: tr('2-minute revision', '2 મિનિટનું પુનરાવર્તન'), subtitle: tr('Recall what you studied before', 'પહેલાં ભણેલું યાદ કરો'), onPress: () => setShowMorningSprint(true) },
        { key: 'vault', icon: 'replay', title: tr('Fix my mistakes', 'મારી ભૂલો સુધારો'), subtitle: tr('Retry questions you got wrong', 'ખોટા પડેલા પ્રશ્નો ફરી કરો'), onPress: () => router.push('/error-vault' as any) },
        { key: 'doubt', icon: 'photo-camera', title: tr('Scan a doubt', 'શંકાનો ફોટો પાડો'), subtitle: tr('Photo of a question → step-by-step help', 'પ્રશ્નનો ફોટો → પગલાવાર મદદ'), onPress: () => router.push('/doubt-solver' as any) },
      ];

  const competeTools: { key: string; icon: React.ComponentProps<typeof MaterialIcons>['name']; label: string; onPress: () => void }[] = [
    { key: 'duel', icon: 'sports-kabaddi', label: tr('1v1 duel', '1v1 મુકાબલો'), onPress: () => router.push('/quiz-duel') },
    { key: 'board', icon: 'emoji-events', label: tr('Rankings', 'રેન્કિંગ'), onPress: () => router.push('/leaderboard') },
    { key: 'radar', icon: 'insights', label: tr('Strengths', 'મજબૂત વિષયો'), onPress: () => router.push('/mastery-analytics') },
    { key: 'share', icon: 'ios-share', label: tr('Share', 'શેર કરો'), onPress: () => setShowShareProgress(true) },
  ];

  // Hero: resume the last chapter, otherwise suggest the first unfinished chapter.
  const firstSubject = activeSubjects[0];
  const suggestedChapter = firstSubject?.chapters?.find((c) => !completedChapterIds.includes(c.id)) || firstSubject?.chapters?.[0];
  const firstName = (user?.name || '').split(' ')[0] || tr('there', 'મિત્ર');
  const gradeLine = isSchoolMode
    ? tr(`Class ${userGrade} · ${user?.board || 'GSEB'}`, `ધોરણ ${userGrade} · ${user?.board || 'GSEB'}`)
    : tr('College · Campus placements', 'કૉલેજ · કૅમ્પસ પ્લેસમેન્ટ');

  // Exam countdown + today's plan (school only). Skip the chapter already shown in the hero.
  const countdown = isSchoolMode ? examCountdown(userGrade) : null;
  const heroChapterId = lastChapter?.chapterId ?? suggestedChapter?.id;
  const plan = isSchoolMode ? nextChapters(activeSubjects, completedChapterIds, 3, heroChapterId) : [];

  const subjectNameFor = (id: string, fallback: string) => {
    const s = activeSubjects.find((x) => x.id === id);
    return s ? shortSubjectName(s, isGujarati) : fallback;
  };

  const tourSteps: CoachStep[] = [
    {
      target: todayRef,
      title: tr('Start here every day', 'દરરોજ અહીંથી શરૂ કરો'),
      body: tr('This card opens the chapter you should study now, or takes you back to where you stopped.', 'આ કાર્ડ હવે ભણવાનું પ્રકરણ ખોલે છે, અથવા તમે જ્યાં અટક્યા હતા ત્યાં લઈ જાય છે.'),
    },
    {
      target: shelfRef,
      title: tr('Your textbooks', 'તમારાં પાઠ્યપુસ્તકો'),
      body: tr('Tap a book to see its chapters, videos, PDFs and quizzes. The yellow line shows how much you have finished.', 'પ્રકરણો, વિડિયો, PDF અને ક્વિઝ જોવા પુસ્તક પર ટૅપ કરો. પીળી લીટી બતાવે છે કે તમે કેટલું પૂરું કર્યું.'),
    },
    {
      target: searchRef,
      title: tr('Search anything', 'કંઈ પણ શોધો'),
      body: tr('Find any chapter, formula or practice test by typing its name.', 'નામ લખીને કોઈ પણ પ્રકરણ, સૂત્ર કે ટેસ્ટ શોધો.'),
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <View ref={rootRef} style={{ flex: 1 }} collapsable={false}>
      {/* Header: who you are and which syllabus you're on (tap to change) */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/(tabs)/profile')} accessibilityLabel={tr('Open profile', 'પ્રોફાઇલ ખોલો')}>
          {user?.avatarUrl && !user.avatarUrl.startsWith('http') && !user.avatarUrl.startsWith('file:') && !user.avatarUrl.startsWith('data:') ? (
            <View style={[styles.avatar, styles.emojiAvatarBox, { backgroundColor: colors.primaryFixed }]}>
              <Text style={styles.emojiAvatarText}>{user.avatarUrl}</Text>
            </View>
          ) : (
            <Image source={{ uri: user?.avatarUrl || AVATAR_URL }} style={styles.avatar} />
          )}
        </TouchableOpacity>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.headerTitle, { color: colors.onSurface }]} numberOfLines={1}>
            {tr(`Hi, ${firstName}`, `નમસ્તે, ${firstName}`)}
          </Text>
          <TouchableOpacity onPress={() => setShowGradeModal(true)} activeOpacity={0.7} style={styles.gradeLine} accessibilityRole="button" accessibilityLabel={tr(`Change class. Current: ${gradeLine}`, `ધોરણ બદલો. હાલ: ${gradeLine}`)}>
            <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
              {gradeLine}
            </Text>
            <MaterialIcons name="expand-more" size={18} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.streakPillHeader, { backgroundColor: streak > 0 ? colors.accentContainer : colors.surfaceContainerLow }]}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.8}
          accessibilityLabel={streak > 0 ? tr(`${streak} day streak`, `${streak} દિવસ સતત અભ્યાસ`) : tr('No streak yet. Study today to start one.', 'હજુ સ્ટ્રીક નથી. આજે ભણીને શરૂ કરો.')}
        >
          <MaterialIcons name="local-fire-department" size={18} color={streak > 0 ? colors.accent : colors.outline} />
          <Text style={[styles.streakPillHeaderText, { color: streak > 0 ? colors.onAccentContainer : colors.onSurfaceVariant }]}>{streak}</Text>
        </TouchableOpacity>
        <View ref={searchRef} collapsable={false}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowSearchBar(!showSearchBar)} accessibilityLabel={showSearchBar ? tr('Close search', 'શોધ બંધ કરો') : tr('Search', 'શોધો')}>
            <MaterialIcons name={showSearchBar ? 'close' : 'search'} size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/bookmarks')} accessibilityLabel={tr('Saved items', 'સાચવેલું')}>
          <MaterialIcons name="bookmark-border" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>

      {loading && !userStats && !curriculum ? (
        <DashboardSkeleton />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
        >
          {showSearchBar && (
            <View style={styles.padded}>
              <SearchBar
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                onClear={() => setSearchQuery('')}
                placeholder={tr('Search chapters, formulas, practice tests...', 'પ્રકરણ, સૂત્રો, ટેસ્ટ શોધો...')}
              />
            </View>
          )}

          <View ref={todayRef} collapsable={false}>
          {isSchoolMode && curriculum ? (
            lastChapter ? (
              <TodayCard
                context={tr(
                  `Continue · ${subjectNameFor(lastChapter.subjectId, lastChapter.subjectName)} · Chapter ${lastChapter.chapterNumber}`,
                  `ચાલુ રાખો · ${subjectNameFor(lastChapter.subjectId, lastChapter.subjectName)} · પ્રકરણ ${lastChapter.chapterNumber}`
                )}
                title={(isGujarati && lastChapter.titleGujarati) || lastChapter.title}
                subtitle={
                  lastChapter.action === 'video'
                    ? tr('Pick up the video where you stopped.', 'જ્યાં અટક્યા હતા ત્યાંથી વિડિયો જુઓ.')
                    : lastChapter.action === 'pdf'
                      ? tr('Open the chapter PDF again.', 'પ્રકરણની PDF ફરી ખોલો.')
                      : tr('Back to your chapter notes.', 'તમારી પ્રકરણ નોંધ પર પાછા જાઓ.')
                }
                primary={{
                  label:
                    lastChapter.action === 'video'
                      ? tr('Resume video', 'વિડિયો આગળ જુઓ')
                      : lastChapter.action === 'pdf'
                        ? tr('Open PDF', 'PDF ખોલો')
                        : tr('Open notes', 'નોંધ ખોલો'),
                  icon: lastChapter.action === 'video' ? 'play-arrow' : 'menu-book',
                  onPress: () => router.push({ pathname: '/(tabs)/courses', params: { subject: lastChapter.subjectId, resume: String(Date.now()) } }),
                }}
                secondary={{ label: tr('Quiz', 'ક્વિઝ'), icon: 'quiz', onPress: () => router.push(`/exam?limit=10&category=${encodeURIComponent(lastChapter.title)}`) }}
              />
            ) : suggestedChapter && firstSubject ? (
              <TodayCard
                context={tr(
                  `Start here · ${shortSubjectName(firstSubject, isGujarati)} · Chapter ${suggestedChapter.chapterNumber}`,
                  `અહીંથી શરૂ કરો · ${shortSubjectName(firstSubject, isGujarati)} · પ્રકરણ ${suggestedChapter.chapterNumber}`
                )}
                title={(isGujarati && suggestedChapter.titleGujarati) || suggestedChapter.title}
                subtitle={tr('Watch the lesson, read the chapter, then try a quick quiz.', 'પાઠ જુઓ, પ્રકરણ વાંચો, પછી ઝડપી ક્વિઝ આપો.')}
                primary={{ label: tr('Open chapter', 'પ્રકરણ ખોલો'), icon: 'play-arrow', onPress: () => router.push({ pathname: '/(tabs)/courses', params: { subject: firstSubject.id } }) }}
                secondary={{ label: tr('Quiz', 'ક્વિઝ'), icon: 'quiz', onPress: () => router.push(`/exam?limit=10&category=${encodeURIComponent(suggestedChapter.title)}`) }}
              />
            ) : null
          ) : (
            <TodayCard
              context={tr(`Placement prep · ${selectedCompany}`, `પ્લેસમેન્ટ તૈયારી · ${selectedCompany === 'All Companies' ? 'બધી કંપનીઓ' : selectedCompany}`)}
              title={selectedCompany === 'All Companies' ? tr('Aptitude & technical mock test', 'ઍપ્ટિટ્યૂડ અને ટેક્નિકલ મૉક ટેસ્ટ') : tr(`${selectedCompany} mock test`, `${selectedCompany} મૉક ટેસ્ટ`)}
              subtitle={tr('15 minutes, timed like a real screening round.', '15 મિનિટ, સાચા સ્ક્રીનિંગ રાઉન્ડ જેવો સમય.')}
              primary={{ label: tr('Start mock test', 'મૉક ટેસ્ટ શરૂ કરો'), icon: 'play-arrow', onPress: () => setShowExamModal(true) }}
              secondary={{ label: tr('Interview', 'ઇન્ટરવ્યૂ'), icon: 'record-voice-over', onPress: () => router.push('/interview-simulator') }}
            />
          )}
          </View>

          {isSchoolMode && (
            <PlanCard
              countdown={countdown}
              plan={plan}
              onOpen={(item) => router.push({ pathname: '/(tabs)/courses', params: { subject: item.subject.id } })}
            />
          )}

          {/* Signature element: the subjects as a shelf of textbooks */}
          {activeSubjects.length > 0 && (
            <View style={styles.section}>
              <View style={[styles.sectionHeaderRow, styles.padded]}>
                <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>
                  {isSchoolMode ? tr('Your textbooks', 'તમારાં પાઠ્યપુસ્તકો') : tr('Your subjects', 'તમારા વિષયો')}
                </Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/courses')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={[styles.sectionHeaderLink, { color: colors.primary }]}>{tr('All courses', 'બધા વિષયો')}</Text>
                </TouchableOpacity>
              </View>
              <View ref={shelfRef} collapsable={false}>
                <TextbookShelf
                  subjects={activeSubjects}
                  gujarati={isGujarati}
                  completedIds={completedChapterIds}
                  onOpen={(sub) => router.push({ pathname: '/(tabs)/courses', params: { subject: sub.id } })}
                />
              </View>
            </View>
          )}

          <View style={styles.padded}>
            <DailyChallengeCard userGrade={userGrade} streakCount={streak} />
          </View>

          <View style={[styles.section, styles.padded]}>
            <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>{tr('Practice', 'પ્રેક્ટિસ')}</Text>
            <ToolList items={practiceTools} />
          </View>

          <View style={[styles.section, styles.padded]}>
            <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>{tr('Compete and track', 'સ્પર્ધા અને પ્રગતિ')}</Text>
            <View style={styles.competeRow}>
              {competeTools.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  activeOpacity={0.75}
                  onPress={t.onPress}
                  accessibilityRole="button"
                  style={[styles.competeTile, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}
                >
                  <MaterialIcons name={t.icon} size={24} color={colors.primary} />
                  <Text style={[styles.competeLabel, { color: colors.onSurface }]} numberOfLines={2}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* College-only placement tools */}
          {!isSchoolMode && (
            <View style={styles.padded}>
              <TrackSwitcher
                activeTrack={activeTrack}
                onSelectTrack={(track) => setActiveTrack(track)}
              />

              {/* Weak topics: only real data; otherwise invite a first check */}
              <View style={[styles.diagnosticCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
                <View style={styles.diagnosticHeader}>
                  <View style={[styles.diagnosticIconCircle, { backgroundColor: colors.primaryFixed }]}>
                    <MaterialIcons name="track-changes" size={22} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.diagnosticTitle, { color: colors.onSurface }]}>
                      {tr('Find your weak topics', 'તમારા નબળા વિષયો શોધો')}
                    </Text>
                    <Text style={[styles.diagnosticSub, { color: colors.onSurfaceVariant }]}>
                      {weakSpots.length > 0
                        ? tr('Based on your recent test answers', 'તમારા તાજેતરના ટેસ્ટના જવાબો પરથી')
                        : tr('Take a short check and we will show where to focus.', 'નાની ચકાસણી આપો, ક્યાં ધ્યાન આપવું તે અમે બતાવીશું.')}
                    </Text>
                  </View>
                </View>

                {weakSpots.length > 0 && (
                  <View style={styles.weakTagsRow}>
                    {weakSpots.slice(0, 2).map((topic, i) => (
                      <View key={i} style={[styles.weakTag, { backgroundColor: colors.errorContainer }]}>
                        <MaterialIcons name="trending-down" size={12} color={colors.error} />
                        <Text style={[styles.weakTagText, { color: colors.error }]} numberOfLines={1}>
                          {topic}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.launchDiagnosticBtn, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/exam?isDiagnostic=true&limit=10')}
                >
                  <MaterialIcons name="bolt" size={18} color={colors.onPrimary} />
                  <Text style={[styles.launchDiagnosticText, { color: colors.onPrimary }]}>
                    {tr('Take a 10-minute check', '10 મિનિટની ચકાસણી આપો')}
                  </Text>
                </TouchableOpacity>
              </View>

              <CompanyFilterBar
                selectedCompany={selectedCompany}
                onSelectCompany={(company) => setSelectedCompany(company)}
              />
            </View>
          )}

          {/* Progress */}
          <View style={[styles.section, styles.padded]}>
            <StreakWidget streakCount={streak} recentActivity={recentActivity} />
            <StatsCard
              totalTests={userStats?.totalTests || 0}
              avgScore={userStats?.avgScore || 0}
              totalQuestions={userStats?.totalQuestionsAnswered || 0}
            />
            <PerformanceChart
              scoresHistory={recentActivity.map((r: any) => r.scorePercentage).reverse()}
              recentActivity={recentActivity}
            />
            <RecentActivityList items={recentActivity} />
          </View>
        </ScrollView>
      )}

      <CoachTour visible={showTour && !loading} steps={tourSteps} rootRef={rootRef} onDone={finishTour} />
      </View>

      {/* Grade Selector Modal */}
      <AcademicGradeModal
        visible={showGradeModal}
        currentGrade={userGrade}
        currentBoard={user?.board || 'CBSE'}
        currentMedium={user?.medium || 'English'}
        onClose={() => setShowGradeModal(false)}
        onSave={handleSaveGrade}
      />

      {/* Custom Exam Setup Modal */}
      <Modal
        visible={showExamModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExamModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialIcons name="tune" size={22} color={colors.primary} />
                <Text style={[styles.modalTitle, { color: colors.onSurface }]}>
                  {tr('Set up your test', 'તમારો ટેસ્ટ તૈયાર કરો')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowExamModal(false)} accessibilityLabel={tr('Close', 'બંધ કરો')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSectionLabel, { color: colors.onSurface }]}>
              {tr('Number of questions', 'પ્રશ્નોની સંખ્યા')}
            </Text>
            <View style={styles.chipRow}>
              {[10, 25, 50].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.chip,
                    selectedLimit === num
                      ? { backgroundColor: colors.primary }
                      : { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant },
                  ]}
                  onPress={() => setSelectedLimit(num)}
                  accessibilityState={{ selected: selectedLimit === num }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: selectedLimit === num ? colors.onPrimary : colors.onSurface },
                    ]}
                  >
                    {tr(`${num} questions · ${num === 50 ? 45 : num === 25 ? 25 : 10} min`, `${num} પ્રશ્નો · ${num === 50 ? 45 : num === 25 ? 25 : 10} મિનિટ`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.launchBtn, MindSprintShadows.glow]}
              onPress={() => {
                setShowExamModal(false);
                router.push(
                  `/exam?limit=${selectedLimit}&category=${encodeURIComponent('All Topics')}&company=${encodeURIComponent(selectedCompany)}`
                );
              }}
            >
              <MaterialIcons name="play-arrow" size={22} color="#ffffff" />
              <Text style={styles.launchBtnText}>
                {tr(`Start ${selectedLimit}-question test`, `${selectedLimit} પ્રશ્નોનો ટેસ્ટ શરૂ કરો`)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MorningSprintModal
        visible={showMorningSprint}
        onClose={() => setShowMorningSprint(false)}
      />

      <ShareProgressModal
        visible={showShareProgress}
        onClose={() => setShowShareProgress(false)}
        streakDays={streak}
        masteryPercentage={userStats?.avgScore || 0}
        chaptersCompleted={completedChapterIds.length}
        questionsSolved={userStats?.totalQuestionsAnswered || 0}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  emojiAvatarBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiAvatarText: {
    fontSize: 22,
  },
  headerTitle: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 22,
    lineHeight: 28,
  },
  gradeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    minHeight: 22,
  },
  headerSub: {
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  streakPillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    minHeight: 34,
    borderRadius: 17,
  },
  streakPillHeaderText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 15,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingTop: 4,
    paddingBottom: 40,
    gap: 28,
  },
  padded: {
    paddingHorizontal: 16,
  },
  section: {
    gap: 12,
  },
  competeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  competeTile: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 84,
  },
  competeLabel: {
    fontFamily: MindSprintFonts.label,
    fontSize: 13,
    lineHeight: 17,
    textAlign: 'center',
  },
  // Grade & Curriculum Switcher Banner
  gradeBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 6,
  },
  gradeBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  gradeBannerIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeBannerLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gradeBannerText: {
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 1,
  },
  changeGradeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  changeGradeBtnText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },
  // Quick Power Tools 2x2 Grid
  powerGrid: {
    marginVertical: 10,
    gap: 10,
  },
  powerGridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  powerCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  powerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerCardTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  powerCardSub: {
    fontSize: 10.5,
    marginTop: 2,
  },
  // School Mode Styles
  schoolHeroCard: {
    borderRadius: 24,
    padding: 20,
    marginVertical: 10,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroBadgeLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  heroBadgeLightText: {
    color: '#E4EAF8',
    fontSize: 10,
    fontWeight: '700',
  },
  schoolHeroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  schoolHeroSub: {
    fontSize: 12.5,
    color: '#C9D5F5',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  heroActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroPrimaryBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 11,
    borderRadius: 14,
    gap: 6,
  },
  heroPrimaryBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#12245C',
  },
  heroSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 11,
    borderRadius: 14,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  heroSecondaryBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#ffffff',
  },
  // Section Headers
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 20,
    lineHeight: 26,
  },
  sectionHeaderLink: {
    fontFamily: MindSprintFonts.label,
    fontSize: 15,
  },
  subSectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  subjectChipsSection: {
    marginVertical: 10,
  },
  subjectChipsScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  subjectChipText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  chaptersSection: {
    gap: 12,
    marginBottom: 16,
  },
  seeAllChaptersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
  },
  seeAllChaptersText: {
    fontSize: 14,
    fontWeight: '700',
  },
  chapterCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  chapterTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chapterIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  chapterSub: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  chapterActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
  },
  readNotesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  readNotesBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  startChapterQuizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  startChapterQuizText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  // College Placement Styles
  heroCard: {
    backgroundColor: '#1D3A8A',
    borderRadius: 24,
    padding: 20,
    marginVertical: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  heroSub: {
    fontSize: 14,
    color: '#e2dfff',
    marginTop: 4,
    marginBottom: 16,
  },
  startExamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  startExamBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  diagnosticCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 12,
    gap: 10,
  },
  diagnosticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  diagnosticIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagnosticTitle: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 18,
    lineHeight: 24,
  },
  diagnosticSub: {
    fontSize: 11,
    marginTop: 2,
  },
  weakTagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  weakTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: '48%',
  },
  weakTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  launchDiagnosticBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    marginTop: 2,
  },
  launchDiagnosticText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 15,
    color: '#ffffff',
  },
  flashcardsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 12,
    gap: 12,
  },
  flashcardIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashcardBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  flashcardBannerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  leaderboardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 12,
    gap: 12,
  },
  leaderboardIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  leaderboardSub: {
    fontSize: 11,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  chapterReadHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  chapterReadBody: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  chapterReadTipBox: {
    padding: 14,
    borderRadius: 14,
    gap: 4,
  },
  chapterReadTipTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  chapterReadTipText: {
    fontSize: 12,
    lineHeight: 18,
  },
  modalSectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  launchBtn: {
    marginTop: 20,
    backgroundColor: '#1D3A8A',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  launchBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  acceleratorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 165,
  },
  acceleratorIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceleratorTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  acceleratorSub: {
    fontSize: 11,
    marginTop: 1,
  },
});
