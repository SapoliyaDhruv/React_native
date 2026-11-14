import React, { useState, useCallback, useEffect } from 'react';
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
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/services/api';
import { TrackType } from '@/constants/mindsprintData';
import {
  GRADE_OPTIONS,
  AcademicGrade,
  EducationBoard,
  InstructionMedium,
  GradeCurriculum,
  SubjectChapter,
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
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { getLastChapter, LastChapter } from '@/services/learningProgress';

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDpTpadB_GY_XTy7q4R83ni9Q0r3ovKCNCuNHvfTLdAAUsEDZQQ26lLxFQO_WijYLtiUQadQJ_c0VDSE0fHXcuipv31vufAkHZtjG1aj35AKp-BjX-2zVCFy4qBBlHxSdFhkGtwh5DKfM4qwVUmYdc-K3yrzrEPvVhlN2E9YXrZH1pl8ECG17oL9IkbPI8NtjpIidsOBmstyEVvCWiL4dNDK14kJBzDlDXzw8GOBDLwWHwzKNd5EGU3';

// Number of chapters previewed on Home; the full list is in Courses.
const HOME_CHAPTER_PREVIEW = 4;

export default function DashboardScreen() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const { user, updateAcademicProfile } = useAuth();

  const userGrade: AcademicGrade = user?.grade || 'college';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode;

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All Topics');
  const [userStats, setUserStats] = useState<any>(null);
  const [weakSpots, setWeakSpots] = useState<string[]>(['Quantitative Aptitude', 'Data Structures']);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedChapterForRead, setSelectedChapterForRead] = useState<SubjectChapter | null>(null);
  const [lastChapter, setLastChapter] = useState<LastChapter | null>(null);
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>([]);

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
  const [showMorningSprint, setShowMorningSprint] = useState<boolean>(false);
  const [showShareProgress, setShowShareProgress] = useState<boolean>(false);

  // Fetch dynamic curriculum from MongoDB
  useEffect(() => {
    async function loadCurriculum() {
      try {
        const currData = await ApiService.getCurriculum(userGrade);
        if (currData && currData.subjects && currData.subjects.length > 0) {
          setCurriculum(currData);
          if (!selectedSubjectId || !currData.subjects.find((s: any) => s.id === selectedSubjectId)) {
            setSelectedSubjectId(currData.subjects[0].id);
          }
        }
      } catch (err) {
        console.warn('Failed to load dynamic curriculum:', err);
      }
    }
    loadCurriculum();
  }, [userGrade]);

  const loadStats = useCallback(async (isRefresh = false) => {
    if (!isRefresh && !userStats) setLoading(true);
    try {
      if (user?.email) {
        const [stats, weak] = await Promise.all([
          ApiService.getDashboardStats(user.email, userGrade),
          ApiService.getWeakSpots(user.email, userGrade),
        ]);
        if (stats) setUserStats(stats);
        if (weak && weak.weakTopics) setWeakSpots(weak.weakTopics);
      }
    } catch (e) {
      console.warn('Dashboard stats load note:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.email, userGrade, userStats]);

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
      if (weak && weak.weakTopics) setWeakSpots(weak.weakTopics);
    }
  };

  const activeSubjects = curriculum?.subjects || [];
  const activeSubject = activeSubjects.find((s) => s.id === selectedSubjectId) || activeSubjects[0];
  const currentGradeLabel = GRADE_OPTIONS.find((g) => g.grade === userGrade)?.label || 'Class ' + userGrade;

  // Practice tools: one calm list. Wording says what each tool does.
  const practiceTools: ToolItem[] = isSchoolMode
    ? [
        { key: 'quiz', icon: 'bolt', title: 'Quick 10-question quiz', subtitle: `${activeSubject?.name || 'Mixed'} · about 5 minutes`, onPress: () => router.push(`/exam?limit=10&category=${encodeURIComponent(activeSubject?.name || 'Science')}`) },
        { key: 'board', icon: 'assignment', title: 'Board exam paper', subtitle: 'Full 80-mark timed paper', onPress: () => router.push('/board-exam-simulator' as any) },
        { key: 'imp', icon: 'star-outline', title: 'Important questions', subtitle: '1 to 4 mark questions by chapter', onPress: () => router.push('/(tabs)/courses') },
        { key: 'sprint', icon: 'timer', title: '2-minute revision', subtitle: 'Recall what you studied before', onPress: () => setShowMorningSprint(true) },
        { key: 'vault', icon: 'replay', title: 'Fix my mistakes', subtitle: 'Retry questions you got wrong', onPress: () => router.push('/error-vault' as any) },
        { key: 'doubt', icon: 'photo-camera', title: 'Scan a doubt', subtitle: 'Photo of a question → step-by-step help', onPress: () => router.push('/doubt-solver' as any) },
      ]
    : [
        { key: 'mock', icon: 'tune', title: 'Custom mock test', subtitle: 'Pick topics and number of questions', onPress: () => setShowExamModal(true) },
        { key: 'interview', icon: 'record-voice-over', title: 'Interview practice', subtitle: 'Answer HR and technical questions', onPress: () => router.push('/interview-simulator') },
        { key: 'cards', icon: 'style', title: 'Flashcards', subtitle: 'HR and technical Q&A', onPress: () => router.push('/flashcards') },
        { key: 'sprint', icon: 'timer', title: '2-minute revision', subtitle: 'Recall what you studied before', onPress: () => setShowMorningSprint(true) },
        { key: 'vault', icon: 'replay', title: 'Fix my mistakes', subtitle: 'Retry questions you got wrong', onPress: () => router.push('/error-vault' as any) },
        { key: 'doubt', icon: 'photo-camera', title: 'Scan a doubt', subtitle: 'Photo of a question → step-by-step help', onPress: () => router.push('/doubt-solver' as any) },
      ];

  const competeTools: { key: string; icon: React.ComponentProps<typeof MaterialIcons>['name']; label: string; onPress: () => void }[] = [
    { key: 'duel', icon: 'sports-kabaddi', label: '1v1 duel', onPress: () => router.push('/quiz-duel') },
    { key: 'board', icon: 'emoji-events', label: 'Rankings', onPress: () => router.push('/leaderboard') },
    { key: 'radar', icon: 'insights', label: 'Strengths', onPress: () => router.push('/mastery-analytics') },
    { key: 'share', icon: 'ios-share', label: 'Share', onPress: () => setShowShareProgress(true) },
  ];

  // Hero: resume the last chapter, otherwise suggest the first unfinished chapter.
  const firstSubject = activeSubjects[0];
  const suggestedChapter = firstSubject?.chapters?.find((c) => !completedChapterIds.includes(c.id)) || firstSubject?.chapters?.[0];
  const firstName = (user?.name || '').split(' ')[0] || 'there';
  const gradeLine = isSchoolMode
    ? `Class ${userGrade} · ${user?.board || 'GSEB'}`
    : 'College · Campus placements';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header: who you are and which syllabus you're on (tap to change) */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/(tabs)/profile')} accessibilityLabel="Open profile">
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
            Hi, {firstName}
          </Text>
          <TouchableOpacity onPress={() => setShowGradeModal(true)} activeOpacity={0.7} style={styles.gradeLine} accessibilityRole="button" accessibilityLabel={`Change class. Current: ${gradeLine}`}>
            <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
              {gradeLine}
            </Text>
            <MaterialIcons name="expand-more" size={18} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.streakPillHeader, { backgroundColor: colors.accentContainer }]}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.8}
          accessibilityLabel={`${userStats?.streakCount || 1} day streak`}
        >
          <MaterialIcons name="local-fire-department" size={18} color={colors.accent} />
          <Text style={[styles.streakPillHeaderText, { color: colors.onAccentContainer }]}>{userStats?.streakCount || 1}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowSearchBar(!showSearchBar)} accessibilityLabel="Search">
          <MaterialIcons name={showSearchBar ? 'close' : 'search'} size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/bookmarks')} accessibilityLabel="Bookmarks">
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
                placeholder="Search chapters, formulas, practice tests..."
              />
            </View>
          )}

          {isSchoolMode && curriculum ? (
            lastChapter ? (
              <TodayCard
                context={`Continue · ${lastChapter.subjectName} · Chapter ${lastChapter.chapterNumber}`}
                title={(isGSEB && lastChapter.titleGujarati) || lastChapter.title}
                subtitle={lastChapter.action === 'video' ? 'Pick up the video where you stopped.' : lastChapter.action === 'pdf' ? 'Open the chapter PDF again.' : 'Back to your chapter notes.'}
                primary={{
                  label: lastChapter.action === 'video' ? 'Resume video' : lastChapter.action === 'pdf' ? 'Open PDF' : 'Open notes',
                  icon: lastChapter.action === 'video' ? 'play-arrow' : 'menu-book',
                  onPress: () => router.push({ pathname: '/(tabs)/courses', params: { subject: lastChapter.subjectId, resume: String(Date.now()) } }),
                }}
                secondary={{ label: 'Quiz', icon: 'quiz', onPress: () => router.push(`/exam?limit=10&category=${encodeURIComponent(lastChapter.title)}`) }}
              />
            ) : suggestedChapter && firstSubject ? (
              <TodayCard
                context={`Start here · ${(isGSEB && firstSubject.nameGujarati?.replace(/\s*\(.*\)/, '')) || firstSubject.name} · Chapter ${suggestedChapter.chapterNumber}`}
                title={(isGSEB && suggestedChapter.titleGujarati) || suggestedChapter.title}
                subtitle="Watch the lesson, read the chapter, then try a quick quiz."
                primary={{ label: 'Open chapter', icon: 'play-arrow', onPress: () => router.push({ pathname: '/(tabs)/courses', params: { subject: firstSubject.id } }) }}
                secondary={{ label: 'Quiz', icon: 'quiz', onPress: () => router.push(`/exam?limit=10&category=${encodeURIComponent(suggestedChapter.title)}`) }}
              />
            ) : null
          ) : (
            <TodayCard
              context={`Placement prep · ${selectedCompany}`}
              title={selectedCompany === 'All Companies' ? 'Aptitude & technical mock test' : `${selectedCompany} mock test`}
              subtitle="15 minutes, timed like a real screening round."
              primary={{ label: 'Start mock test', icon: 'play-arrow', onPress: () => setShowExamModal(true) }}
              secondary={{ label: 'Interview', icon: 'record-voice-over', onPress: () => router.push('/interview-simulator') }}
            />
          )}

          {/* Signature element: the subjects as a shelf of textbooks */}
          {activeSubjects.length > 0 && (
            <View style={styles.section}>
              <View style={[styles.sectionHeaderRow, styles.padded]}>
                <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>
                  {isSchoolMode ? 'Your textbooks' : 'Your subjects'}
                </Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/courses')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={[styles.sectionHeaderLink, { color: colors.primary }]}>All courses</Text>
                </TouchableOpacity>
              </View>
              <TextbookShelf
                subjects={activeSubjects}
                gujarati={isGSEB}
                completedIds={completedChapterIds}
                onOpen={(sub) => router.push({ pathname: '/(tabs)/courses', params: { subject: sub.id } })}
              />
            </View>
          )}

          <View style={styles.padded}>
            <DailyChallengeCard userGrade={userGrade} streakCount={userStats?.streakCount || 1} />
          </View>

          <View style={[styles.section, styles.padded]}>
            <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>Practice</Text>
            <ToolList items={practiceTools} />
          </View>

          <View style={[styles.section, styles.padded]}>
            <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>Compete and track</Text>
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

              {/* Track Switcher */}
              <TrackSwitcher
                activeTrack={activeTrack}
                onSelectTrack={(track) => setActiveTrack(track)}
              />

              {/* AI Weak Spot Diagnostic Card */}
              <View
                style={[
                  styles.diagnosticCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.outlineVariant,
                  },
                ]}
              >
                <View style={styles.diagnosticHeader}>
                  <View style={[styles.diagnosticIconCircle, { backgroundColor: colors.primaryFixed }]}>
                    <MaterialIcons name="track-changes" size={22} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.diagnosticTitle, { color: colors.onSurface }]}>
                      Find your weak topics
                    </Text>
                    <Text style={[styles.diagnosticSub, { color: colors.onSurfaceVariant }]}>
                      Based on your recent test answers
                    </Text>
                  </View>
                </View>

                {/* Weak Category Tags */}
                <View style={styles.weakTagsRow}>
                  {weakSpots.slice(0, 2).map((topic, i) => (
                    <View
                      key={i}
                      style={[
                        styles.weakTag,
                        { backgroundColor: colors.errorContainer },
                      ]}
                    >
                      <MaterialIcons name="trending-down" size={12} color={colors.error} />
                      <Text style={[styles.weakTagText, { color: colors.error }]} numberOfLines={1}>
                        {topic}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.launchDiagnosticBtn, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/exam?isDiagnostic=true&limit=10')}
                >
                  <MaterialIcons name="bolt" size={18} color="#ffffff" />
                  <Text style={styles.launchDiagnosticText}>
                    Take a 10-minute check
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Target Company Filter (Dynamic from MongoDB) */}
              <CompanyFilterBar
                selectedCompany={selectedCompany}
                onSelectCompany={(company) => setSelectedCompany(company)}
              />

            </View>
          )}

          {/* Progress */}
          <View style={[styles.section, styles.padded]}>
            <StreakWidget
              streakCount={userStats?.streakCount || 1}
              recentActivity={userStats?.recentActivity || []}
            />
            <StatsCard
              totalTests={userStats?.totalTests || 0}
              avgScore={userStats?.avgScore || 0}
              totalQuestions={userStats?.totalQuestionsAnswered || 0}
            />
            <PerformanceChart
              scoresHistory={(userStats?.recentActivity || []).map((r: any) => r.scorePercentage).reverse()}
              recentActivity={userStats?.recentActivity || []}
            />
            <RecentActivityList items={userStats?.recentActivity || []} />
          </View>
        </ScrollView>
      )}

      {/* Grade Selector Modal */}
      <AcademicGradeModal
        visible={showGradeModal}
        currentGrade={userGrade}
        currentBoard={user?.board || 'CBSE'}
        currentMedium={user?.medium || 'English'}
        onClose={() => setShowGradeModal(false)}
        onSave={handleSaveGrade}
      />

      {/* Chapter Reader Summary Modal */}
      <Modal
        visible={!!selectedChapterForRead}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedChapterForRead(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                <MaterialIcons name="menu-book" size={24} color={colors.primary} />
                <Text style={[styles.modalTitle, { color: colors.onSurface }]} numberOfLines={1}>
                  {isGSEB && selectedChapterForRead?.titleGujarati
                    ? selectedChapterForRead.titleGujarati
                    : selectedChapterForRead?.title}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedChapterForRead(null)}>
                <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380, marginVertical: 10 }}>
              <Text style={[styles.chapterReadHeading, { color: colors.primary }]}>
                Chapter Summary & Core Concepts:
              </Text>
              <Text style={[styles.chapterReadBody, { color: colors.onSurface }]}>
                {selectedChapterForRead?.summary}
              </Text>

              <View style={[styles.chapterReadTipBox, { backgroundColor: isDarkMode ? 'rgba(147,172,255,0.1)' : '#E3EDFC' }]}>
                <Text style={[styles.chapterReadTipTitle, { color: colors.primary }]}>
                  💡 NCERT / GSEB Exam Advice:
                </Text>
                <Text style={[styles.chapterReadTipText, { color: colors.onSurfaceVariant }]}>
                  {isGSEB
                    ? 'પાઠ્યપુસ્તકના સ્વાધ્યાયના પ્રશ્નો અને ઉદાહરણો સારી રીતે સમજો. પ્રકરણ ક્વિઝ આપીને તમારી તૈયારી ચકાસો.'
                    : `Review the textbook exercises thoroughly. Practice ${selectedChapterForRead?.questionCount || 15} questions in the chapter quiz to reinforce your understanding.`}
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.launchBtn, MindSprintShadows.glow]}
              onPress={() => {
                const chap = selectedChapterForRead;
                setSelectedChapterForRead(null);
                if (chap) {
                  router.push(`/exam?limit=10&category=${encodeURIComponent(chap.title)}`);
                }
              }}
            >
              <MaterialIcons name="play-arrow" size={22} color="#ffffff" />
              <Text style={styles.launchBtnText}>
                Take Chapter Assessment (10 Qs)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                  Exam Configurator
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowExamModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* Question Count Chips */}
            <Text style={[styles.modalSectionLabel, { color: colors.onSurface }]}>
              1. Select Number of Questions:
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
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: selectedLimit === num ? '#ffffff' : colors.onSurface },
                    ]}
                  >
                    {num} Qs ({num === 50 ? '45m' : num === 25 ? '25m' : '10m'})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Launch Exam Action */}
            <TouchableOpacity
              style={[styles.launchBtn, MindSprintShadows.glow]}
              onPress={() => {
                setShowExamModal(false);
                router.push(
                  `/exam?limit=${selectedLimit}&category=${encodeURIComponent(selectedCategory)}&company=${encodeURIComponent(selectedCompany)}`
                );
              }}
            >
              <MaterialIcons name="play-arrow" size={22} color="#ffffff" />
              <Text style={styles.launchBtnText}>
                Launch {selectedLimit}-Question Test
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Morning Sprint Modal */}
      <MorningSprintModal
        visible={showMorningSprint}
        onClose={() => setShowMorningSprint(false)}
      />

      {/* Share Progress Modal */}
      <ShareProgressModal
        visible={showShareProgress}
        onClose={() => setShowShareProgress(false)}
        streakDays={userStats?.streakCount || 1}
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
