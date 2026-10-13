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

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDpTpadB_GY_XTy7q4R83ni9Q0r3ovKCNCuNHvfTLdAAUsEDZQQ26lLxFQO_WijYLtiUQadQJ_c0VDSE0fHXcuipv31vufAkHZtjG1aj35AKp-BjX-2zVCFy4qBBlHxSdFhkGtwh5DKfM4qwVUmYdc-K3yrzrEPvVhlN2E9YXrZH1pl8ECG17oL9IkbPI8NtjpIidsOBmstyEVvCWiL4dNDK14kJBzDlDXzw8GOBDLwWHwzKNd5EGU3';

export default function DashboardScreen() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const { user, updateAcademicProfile } = useAuth();

  const userGrade: AcademicGrade = user?.grade || 'college';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode && user?.medium === 'Gujarati';

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

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Top App Bar with Welcome Greeting & Profile Access */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.outlineVariant,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/(tabs)/profile')}>
            <Image source={{ uri: AVATAR_URL }} style={styles.avatar} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerGreeting, { color: colors.onSurfaceVariant }]}>
              Welcome back 👋
            </Text>
            <Text style={[styles.headerTitle, { color: colors.onSurface }]} numberOfLines={1}>
              {user?.name || 'MindSprint Learner'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Quick Streak Counter Pill */}
          <TouchableOpacity
            style={[styles.streakPillHeader, { backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7' }]}
            onPress={() => router.push('/(tabs)/profile')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="local-fire-department" size={17} color="#f59e0b" />
            <Text style={styles.streakPillHeaderText}>{userStats?.streakCount || 1}</Text>
          </TouchableOpacity>

          {/* Search Toggle */}
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f1f5f9' }]}
            onPress={() => setShowSearchBar(!showSearchBar)}
          >
            <MaterialIcons name="search" size={20} color={colors.onSurface} />
          </TouchableOpacity>

          {/* Dark / Light Toggle */}
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f1f5f9' }]}
            onPress={toggleDarkMode}
          >
            <MaterialIcons
              name={isDarkMode ? 'dark-mode' : 'light-mode'}
              size={20}
              color={colors.onSurface}
            />
          </TouchableOpacity>

          {/* Bookmarks */}
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f1f5f9' }]}
            onPress={() => router.push('/bookmarks')}
          >
            <MaterialIcons name="bookmark-border" size={20} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      {loading && !userStats && !curriculum ? (
        <DashboardSkeleton />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* 1-Tap Academic Grade & Board Switcher Banner */}
          <View style={[styles.gradeBannerRow, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}>
            <View style={styles.gradeBannerLeft}>
              <View style={[styles.gradeBannerIcon, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="school" size={14} color="#ffffff" />
              </View>
              <View>
                <Text style={[styles.gradeBannerLabel, { color: colors.onSurfaceVariant }]}>
                  {isSchoolMode ? 'CURRENT SYLLABUS' : 'CAREER GOAL'}
                </Text>
                <Text style={[styles.gradeBannerText, { color: colors.onSurface }]}>
                  {currentGradeLabel} {isSchoolMode ? `• ${user?.board || 'CBSE'} (${user?.medium || 'English'})` : '• Campus Placements'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.changeGradeBtn, { backgroundColor: colors.primary }]}
              onPress={() => setShowGradeModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.changeGradeBtnText}>Switch ▾</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar Input (When expanded) */}
          {showSearchBar && (
            <SearchBar
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              onClear={() => setSearchQuery('')}
              placeholder="Search chapters, formulas, practice tests..."
            />
          )}

          {/* ======================================================== */}
          {/* SMART HERO MISSION CARD (ROLE-AWARE)                     */}
          {/* ======================================================== */}
          {isSchoolMode && curriculum ? (
            <View style={[styles.schoolHeroCard, { backgroundColor: isDarkMode ? '#1e1b4b' : '#312e81' }, MindSprintShadows.glow]}>
              <View style={styles.heroTopRow}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>
                    {curriculum.badge || (isGSEB ? `CLASS ${userGrade} • GSEB` : `CLASS ${userGrade}`)}
                  </Text>
                </View>
                <View style={styles.heroBadgeLight}>
                  <Text style={styles.heroBadgeLightText}>
                    {user?.medium === 'Gujarati' ? 'Gujarati Medium' : `${user?.medium || 'English'} Medium`}
                  </Text>
                </View>
              </View>

              <Text style={styles.schoolHeroTitle}>
                {isGSEB ? `${activeSubject?.nameGujarati || activeSubject?.name} અભ્યાસક્રમ` : `${activeSubject?.name || 'Academic'} Curriculum`}
              </Text>
              <Text style={styles.schoolHeroSub}>
                {isGSEB
                  ? `પાઠ્યપુસ્તક પ્રકરણો, સૂત્રો, IMP પ્રશ્નો અને પ્રેક્ટિસ ક્વિઝ સાથે સંપૂર્ણ તૈયારી કરો.`
                  : `Master all ${activeSubject?.chapters?.length || 0} chapters with verified notes, formulas & quizzes.`}
              </Text>

              <View style={styles.heroActionRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.heroPrimaryBtn}
                  onPress={() => router.push(`/exam?limit=10&category=${encodeURIComponent(activeSubject?.name || 'Science')}`)}
                >
                  <MaterialIcons name="play-arrow" size={20} color="#1e1b4b" />
                  <Text style={styles.heroPrimaryBtnText}>
                    Quick 10 Qs Quiz 🎯
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.heroSecondaryBtn}
                  onPress={() => router.push('/(tabs)/courses')}
                >
                  <MaterialIcons name="menu-book" size={17} color="#ffffff" />
                  <Text style={styles.heroSecondaryBtnText}>
                    Syllabus 📚
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={[styles.heroCard, { backgroundColor: isDarkMode ? '#1e1b4b' : '#312e81' }, MindSprintShadows.glow]}>
              <View style={styles.heroTopRow}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>CAMPUS PLACEMENT</Text>
                </View>
                <View style={styles.heroBadgeLight}>
                  <Text style={styles.heroBadgeLightText}>{selectedCompany}</Text>
                </View>
              </View>

              <Text style={styles.heroTitle}>
                {selectedCompany === 'All Companies'
                  ? 'Aptitude & Technical Mock Exam'
                  : `${selectedCompany} Placement Mock Test`}
              </Text>
              <Text style={styles.heroSub}>
                Timed 15-minute test simulating technical and aptitude screening rounds.
              </Text>

              <View style={styles.heroActionRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.heroPrimaryBtn}
                  onPress={() => setShowExamModal(true)}
                >
                  <MaterialIcons name="tune" size={20} color="#1e1b4b" />
                  <Text style={styles.heroPrimaryBtnText}>Customize & Start</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.heroSecondaryBtn}
                  onPress={() => router.push('/interview-simulator')}
                >
                  <MaterialIcons name="record-voice-over" size={17} color="#ffffff" />
                  <Text style={styles.heroSecondaryBtnText}>AI Simulator</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ======================================================== */}
          {/* QUICK POWER TOOLS 2x2 GRID                               */}
          {/* ======================================================== */}
          <View style={styles.powerGrid}>
            <View style={styles.powerGridRow}>
              {/* 1. 1v1 Speed Duel */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.powerCard,
                  { backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2', borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : '#fecaca' },
                  MindSprintShadows.card,
                ]}
                onPress={() => router.push('/quiz-duel')}
              >
                <View style={[styles.powerIconBox, { backgroundColor: '#ef4444' }]}>
                  <MaterialIcons name="sports-kabaddi" size={20} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.powerCardTitle, { color: colors.onSurface }]}>
                    1v1 Speed Duel
                  </Text>
                  <Text style={[styles.powerCardSub, { color: colors.onSurfaceVariant }]}>
                    Live peer battle ⚔️
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 2. AI Mastery Radar */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.powerCard,
                  { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.12)' : '#ecfdf5', borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.3)' : '#a7f3d0' },
                  MindSprintShadows.card,
                ]}
                onPress={() => router.push('/mastery-analytics')}
              >
                <View style={[styles.powerIconBox, { backgroundColor: '#10b981' }]}>
                  <MaterialIcons name="insights" size={20} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.powerCardTitle, { color: colors.onSurface }]}>
                    Mastery Radar
                  </Text>
                  <Text style={[styles.powerCardSub, { color: colors.onSurfaceVariant }]}>
                    AI Study Radar 📈
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.powerGridRow}>
              {/* 3. Leaderboards */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.powerCard,
                  { backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.12)' : '#fffbeb', borderColor: isDarkMode ? 'rgba(245, 158, 11, 0.3)' : '#fde68a' },
                  MindSprintShadows.card,
                ]}
                onPress={() => router.push('/leaderboard')}
              >
                <View style={[styles.powerIconBox, { backgroundColor: '#f59e0b' }]}>
                  <MaterialIcons name="emoji-events" size={20} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.powerCardTitle, { color: colors.onSurface }]}>
                    Leaderboard
                  </Text>
                  <Text style={[styles.powerCardSub, { color: colors.onSurfaceVariant }]}>
                    State & Campus 👑
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 4. Placement Flashcards / Important Questions */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.powerCard,
                  { backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.12)' : '#f5f3ff', borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.3)' : '#ddd6fe' },
                  MindSprintShadows.card,
                ]}
                onPress={() => (isSchoolMode ? router.push('/(tabs)/courses') : router.push('/flashcards'))}
              >
                <View style={[styles.powerIconBox, { backgroundColor: '#8b5cf6' }]}>
                  <MaterialIcons name={isSchoolMode ? 'star' : 'question-answer'} size={20} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.powerCardTitle, { color: colors.onSurface }]}>
                    {isSchoolMode ? 'Imp Questions' : 'Flashcards'}
                  </Text>
                  <Text style={[styles.powerCardSub, { color: colors.onSurfaceVariant }]}>
                    {isSchoolMode ? '1M-4M Marks ⭐' : 'HR & Tech Q&A 💡'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* ======================================================== */}
          {/* SMART STUDY ACCELERATOR SUITE                             */}
          {/* ======================================================== */}
          <View style={{ gap: 10, marginVertical: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>
                ⚡ Smart Study Accelerator
              </Text>
              <TouchableOpacity onPress={() => setShowShareProgress(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MaterialIcons name="share" size={14} color="#25D366" />
                <Text style={{ fontSize: 12, fontWeight: '800', color: '#25D366' }}>Share Card</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 4 }}>
              {/* 1. Error Vault */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.acceleratorCard,
                  { backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', borderColor: '#ef4444' },
                  MindSprintShadows.card,
                ]}
                onPress={() => router.push('/error-vault' as any)}
              >
                <View style={[styles.acceleratorIconBox, { backgroundColor: '#ef4444' }]}>
                  <MaterialIcons name="security" size={18} color="#ffffff" />
                </View>
                <View>
                  <Text style={[styles.acceleratorTitle, { color: colors.onSurface }]}>Error Vault 🛡️</Text>
                  <Text style={[styles.acceleratorSub, { color: colors.onSurfaceVariant }]}>Fix past mistakes</Text>
                </View>
              </TouchableOpacity>

              {/* 2. Scan Doubt AI Camera */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.acceleratorCard,
                  { backgroundColor: isDarkMode ? 'rgba(56, 189, 248, 0.15)' : '#f0f9ff', borderColor: '#0284c7' },
                  MindSprintShadows.card,
                ]}
                onPress={() => router.push('/doubt-solver' as any)}
              >
                <View style={[styles.acceleratorIconBox, { backgroundColor: '#0284c7' }]}>
                  <MaterialIcons name="photo-camera" size={18} color="#ffffff" />
                </View>
                <View>
                  <Text style={[styles.acceleratorTitle, { color: colors.onSurface }]}>Scan Doubt 📸</Text>
                  <Text style={[styles.acceleratorSub, { color: colors.onSurfaceVariant }]}>Instant AI solution</Text>
                </View>
              </TouchableOpacity>

              {/* 3. Morning Sprint */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.acceleratorCard,
                  { backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb', borderColor: '#f59e0b' },
                  MindSprintShadows.card,
                ]}
                onPress={() => setShowMorningSprint(true)}
              >
                <View style={[styles.acceleratorIconBox, { backgroundColor: '#f59e0b' }]}>
                  <MaterialIcons name="bolt" size={18} color="#ffffff" />
                </View>
                <View>
                  <Text style={[styles.acceleratorTitle, { color: colors.onSurface }]}>2-Min Sprint ⚡</Text>
                  <Text style={[styles.acceleratorSub, { color: colors.onSurfaceVariant }]}>Spaced recall</Text>
                </View>
              </TouchableOpacity>

              {/* 4. Full 80-Mark Board Exam */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.acceleratorCard,
                  { backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : '#f5f3ff', borderColor: '#8b5cf6' },
                  MindSprintShadows.card,
                ]}
                onPress={() => router.push('/board-exam-simulator' as any)}
              >
                <View style={[styles.acceleratorIconBox, { backgroundColor: '#8b5cf6' }]}>
                  <MaterialIcons name="assignment" size={18} color="#ffffff" />
                </View>
                <View>
                  <Text style={[styles.acceleratorTitle, { color: colors.onSurface }]}>Board Exam 📄</Text>
                  <Text style={[styles.acceleratorSub, { color: colors.onSurfaceVariant }]}>80M Simulation</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Daily 60-Second Interactive Challenge Card */}
          <DailyChallengeCard
            userGrade={userGrade}
            streakCount={userStats?.streakCount || 1}
          />

          {/* ======================================================== */}
          {/* SCHOOL MODE: CLASSES 6 TO 12 (NCERT & GSEB SYLLABUS)      */}
          {/* ======================================================== */}
          {isSchoolMode && curriculum ? (
            <View>
              {/* Section Header: Subjects */}
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>
                  📚 Your Subjects ({activeSubjects.length})
                </Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/courses')} activeOpacity={0.7}>
                  <Text style={[styles.sectionHeaderLink, { color: colors.primary }]}>
                    View Syllabus →
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Horizontal Scrollable Subject Switcher Chips */}
              <View style={styles.subjectChipsSection}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.subjectChipsScroll}
                >
                  {activeSubjects.map((sub) => {
                    const isSelected = selectedSubjectId === sub.id;
                    const displayName = isGSEB && sub.nameGujarati ? sub.nameGujarati : sub.name;
                    const iconName = (sub.id.includes('math')
                      ? 'calculate'
                      : sub.id.includes('sci')
                      ? 'biotech'
                      : sub.id.includes('soc')
                      ? 'public'
                      : sub.id.includes('guj')
                      ? 'edit-note'
                      : 'menu-book') as any;

                    return (
                      <TouchableOpacity
                        key={sub.id}
                        activeOpacity={0.75}
                        style={[
                          styles.subjectChip,
                          {
                            backgroundColor: isSelected
                              ? sub.color
                              : isDarkMode
                              ? colors.surfaceContainerLow
                              : colors.surfaceContainerLowest,
                            borderColor: isSelected ? sub.color : colors.outlineVariant,
                          },
                        ]}
                        onPress={() => setSelectedSubjectId(sub.id)}
                      >
                        <MaterialIcons
                          name={iconName}
                          size={16}
                          color={isSelected ? '#ffffff' : sub.color}
                        />
                        <Text
                          style={[
                            styles.subjectChipText,
                            { color: isSelected ? '#ffffff' : colors.onSurface },
                          ]}
                        >
                          {displayName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Chapter-by-Chapter Learning Cards */}
              <View style={styles.chaptersSection}>
                <Text style={[styles.subSectionHeading, { color: colors.onSurfaceVariant }]}>
                  📖 {isGSEB && activeSubject?.nameGujarati ? `${activeSubject.nameGujarati} પ્રકરણો` : `${activeSubject?.name} Chapters`} ({activeSubject?.chapters?.length || 0})
                </Text>

                {(activeSubject?.chapters || []).map((chap) => {
                  const chapterTitle =
                    isGSEB && chap.titleGujarati
                      ? `${chap.chapterNumber}. ${chap.titleGujarati}`
                      : `${chap.chapterNumber}. ${chap.title}`;

                  return (
                    <View
                      key={chap.id}
                      style={[
                        styles.chapterCard,
                        {
                          backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff',
                          borderColor: colors.outlineVariant,
                        },
                        MindSprintShadows.card,
                      ]}
                    >
                      <View style={styles.chapterTopRow}>
                        <View style={[styles.chapterIconBox, { backgroundColor: `${activeSubject.color}20` }]}>
                          <MaterialIcons
                            name={(chap.iconName || 'menu-book') as any}
                            size={22}
                            color={activeSubject.color}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.chapterTitle, { color: colors.onSurface }]}>
                            {chapterTitle}
                          </Text>
                          <Text style={[styles.chapterSub, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                            {chap.summary}
                          </Text>
                        </View>
                      </View>

                      {/* Chapter Actions */}
                      <View style={styles.chapterActionRow}>
                        <TouchableOpacity
                          style={styles.readNotesBtn}
                          onPress={() => setSelectedChapterForRead(chap)}
                        >
                          <MaterialIcons name="menu-book" size={14} color={colors.primary} />
                          <Text style={[styles.readNotesBtnText, { color: colors.primary }]}>
                            Read Summary
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.startChapterQuizBtn, { backgroundColor: activeSubject.color }]}
                          activeOpacity={0.8}
                          onPress={() => router.push(`/exam?limit=10&category=${encodeURIComponent(chap.title)}`)}
                        >
                          <MaterialIcons name="quiz" size={14} color="#ffffff" />
                          <Text style={styles.startChapterQuizText}>
                            Start Quiz ({chap.questionCount || 10} Qs)
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            /* ======================================================== */
            /* COLLEGE & PLACEMENT RECRUITMENT MODE                     */
            /* ======================================================== */
            <View>
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
                    backgroundColor: isDarkMode ? 'rgba(129,140,248,0.1)' : '#f5f3ff',
                    borderColor: isDarkMode ? 'rgba(129,140,248,0.3)' : '#ddd6fe',
                  },
                  MindSprintShadows.card,
                ]}
              >
                <View style={styles.diagnosticHeader}>
                  <View style={[styles.diagnosticIconCircle, { backgroundColor: '#8b5cf6' }]}>
                    <MaterialIcons name="auto-awesome" size={22} color="#ffffff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.diagnosticTitle, { color: colors.onSurface }]}>
                      AI Weak-Spot Diagnostic
                    </Text>
                    <Text style={[styles.diagnosticSub, { color: colors.onSurfaceVariant }]}>
                      Auto-generated from your recent test results
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
                        { backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2' },
                      ]}
                    >
                      <MaterialIcons name="trending-down" size={12} color="#ef4444" />
                      <Text style={[styles.weakTagText, { color: '#ef4444' }]} numberOfLines={1}>
                        {topic}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.launchDiagnosticBtn, { backgroundColor: '#8b5cf6' }, MindSprintShadows.glow]}
                  onPress={() => router.push('/exam?isDiagnostic=true&limit=10')}
                >
                  <MaterialIcons name="bolt" size={18} color="#ffffff" />
                  <Text style={styles.launchDiagnosticText}>
                    Take 10-Min Diagnostic Test 🎯
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Target Company Filter (Dynamic from MongoDB) */}
              <CompanyFilterBar
                selectedCompany={selectedCompany}
                onSelectCompany={(company) => setSelectedCompany(company)}
              />

              {/* Placement Interview Flashcards Entry Card */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.flashcardsBanner,
                  { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant },
                  MindSprintShadows.card,
                ]}
                onPress={() => router.push('/flashcards')}
              >
                <View style={[styles.flashcardIconCircle, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                  <MaterialIcons name="question-answer" size={24} color="#6366f1" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.flashcardBannerTitle, { color: colors.onSurface }]}>
                    Placement Interview Flashcards
                  </Text>
                  <Text style={[styles.flashcardBannerSub, { color: colors.onSurfaceVariant }]}>
                    Revise HR & Technical Q&As with interviewer tips
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Grade-Isolated Streak, Stats, and Performance Analytics */}
          <StreakWidget streakCount={userStats?.streakCount || 1} />
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

              <View style={[styles.chapterReadTipBox, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.1)' : '#eff6ff' }]}>
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
        streakDays={userStats?.streakCount || 5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: 'rgba(79, 70, 229, 0.2)',
  },
  headerGreeting: {
    fontSize: 11,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakPillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  streakPillHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#d97706',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
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
    color: '#e0e7ff',
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
    color: '#c7d2fe',
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
    color: '#1e1b4b',
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
    marginTop: 14,
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionHeaderLink: {
    fontSize: 12,
    fontWeight: '700',
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
    backgroundColor: '#3525cd',
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
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
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
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
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
    backgroundColor: '#3525cd',
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
