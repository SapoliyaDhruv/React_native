import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { ApiService, API_BASE_URL } from '@/services/api';
import {
  GradeCurriculum,
  SubjectChapter,
  ChapterVideo,
  ACADEMIC_CURRICULUM,
  SamplePaper,
  ImportantQuestion,
} from '@/constants/academicData';
import { GlossaryTooltip } from '@/components/mindsprint/GlossaryTooltip';
import { AudioWalkmanPlayer, AudioTrackItem } from '@/components/mindsprint/AudioWalkmanPlayer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = Math.round((SCREEN_WIDTH - 48) * 9 / 16);

export default function CoursesScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade = user?.grade || '6';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode;

  const [curriculum, setCurriculum] = useState<GradeCurriculum | null>(
    ACADEMIC_CURRICULUM[userGrade] || ACADEMIC_CURRICULUM['6']
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    ACADEMIC_CURRICULUM[userGrade]?.subjects?.[0]?.id || 'g6-math'
  );
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'imp' | 'books' | 'papers' | 'videos' | 'practice' | 'formulas'>('all');
  const [samplePapers, setSamplePapers] = useState<SamplePaper[]>([]);
  const [importantQuestions, setImportantQuestions] = useState<ImportantQuestion[]>([]);
  const [selectedMarksFilter, setSelectedMarksFilter] = useState<number | null>(null);
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<string[]>([]);

  // Modals state
  const [selectedChapterForRead, setSelectedChapterForRead] = useState<SubjectChapter | null>(null);
  const [selectedChapterForVideo, setSelectedChapterForVideo] = useState<SubjectChapter | null>(null);
  const [activeVideoOption, setActiveVideoOption] = useState<ChapterVideo | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [selectedChapterForQuiz, setSelectedChapterForQuiz] = useState<SubjectChapter | null>(null);
  const [selectedLimit, setSelectedLimit] = useState<number>(10);
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<string | null>(null);
  const [showWalkman, setShowWalkman] = useState<boolean>(false);
  const [walkmanInitialTrack, setWalkmanInitialTrack] = useState<number>(0);

  // Chapter completion tracking state
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>([]);
  const storageKey = `@mindsprint_completed_chapters_${userGrade}_${user?.email || 'guest'}`;

  // Chapter bookmark state
  const [bookmarkedChapterIds, setBookmarkedChapterIds] = useState<string[]>([]);
  const bookmarkKey = `@mindsprint_bookmarked_chapters_${userGrade}_${user?.email || 'guest'}`;

  // Load Curriculum from MongoDB
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
      } catch (e) {
        console.warn('Courses curriculum load error:', e);
      }
    }
    loadCurriculum();
  }, [userGrade]);

  // Load Official Sample & Board Exam Papers
  useEffect(() => {
    async function loadPapers() {
      try {
        const targetBoard = isSchoolMode ? 'GSEB' : (user?.board || 'CBSE');
        const papers = await ApiService.getSamplePapers(userGrade, targetBoard);
        setSamplePapers(papers);
      } catch (e) {
        console.warn('Error loading sample papers:', e);
      }
    }
    loadPapers();
  }, [userGrade, isSchoolMode, user?.board]);

  // Load Frequently Asked Important Questions (1M, 2M, 3M, 4M)
  useEffect(() => {
    async function loadImpQs() {
      try {
        const activeSub = curriculum?.subjects.find((s) => s.id === selectedSubjectId);
        const questions = await ApiService.getImportantQuestions(
          userGrade,
          activeSub?.name,
          selectedMarksFilter || undefined
        );
        setImportantQuestions(questions);
      } catch (e) {
        console.warn('Error loading important questions:', e);
      }
    }
    loadImpQs();
  }, [userGrade, selectedSubjectId, curriculum, selectedMarksFilter]);

  const toggleExpandQuestion = (id: string) => {
    setExpandedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Load saved completed chapters
  useEffect(() => {
    async function loadSaved() {
      try {
        const [chapRaw, bookRaw] = await Promise.all([
          AsyncStorage.getItem(storageKey),
          AsyncStorage.getItem(bookmarkKey),
        ]);
        if (chapRaw) setCompletedChapterIds(JSON.parse(chapRaw));
        if (bookRaw) setBookmarkedChapterIds(JSON.parse(bookRaw));
      } catch (_) {}
    }
    loadSaved();
  }, [storageKey, bookmarkKey]);

  const toggleChapterComplete = async (chapId: string) => {
    const updated = completedChapterIds.includes(chapId)
      ? completedChapterIds.filter((id) => id !== chapId)
      : [...completedChapterIds, chapId];
    setCompletedChapterIds(updated);
    try { await AsyncStorage.setItem(storageKey, JSON.stringify(updated)); } catch (_) {}
  };

  const toggleChapterBookmark = async (chapId: string) => {
    const updated = bookmarkedChapterIds.includes(chapId)
      ? bookmarkedChapterIds.filter((id) => id !== chapId)
      : [...bookmarkedChapterIds, chapId];
    setBookmarkedChapterIds(updated);
    try { await AsyncStorage.setItem(bookmarkKey, JSON.stringify(updated)); } catch (_) {}
  };

  const activeSubjects = curriculum?.subjects || ACADEMIC_CURRICULUM[userGrade]?.subjects || [];
  const activeSubject = activeSubjects.find((s) => s.id === selectedSubjectId) || activeSubjects[0];
  const chapters = activeSubject?.chapters || [];

  const audioTracks: AudioTrackItem[] = chapters.map((chap, idx) => ({
    id: chap.id,
    title: chap.title,
    titleGujarati: chap.titleGujarati,
    chapterNumber: chap.chapterNumber || idx + 1,
    subject: activeSubject?.name || 'Curriculum',
    duration: chap.duration || '15m',
    contentToSpeak: `${isGSEB && chap.titleGujarati ? chap.titleGujarati : chap.title}. ${isGSEB && chap.summaryGujarati ? chap.summaryGujarati : chap.summary}. ${((isGSEB ? chap.keyFormulasGujarati : chap.keyFormulas) || []).join('. ')}`,
  }));

  const handleOpenPdf = async (url?: string) => {
    if (!url) {
      Alert.alert('Examination Paper', 'Exam paper will be available shortly.');
      return;
    }
    // Resolve relative backend routes (/api/sample-papers/render/...) to absolute server URL
    let fullUrl = url;
    if (!url.startsWith('http')) {
      const normalizedPath = url.startsWith('/') ? url : `/${url}`;
      const base = API_BASE_URL.replace(/\/api\/?$/, '');
      fullUrl = `${base}${normalizedPath}`;
    }

    try {
      await WebBrowser.openBrowserAsync(fullUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        toolbarColor: colors.primary,
      });
    } catch (_) {
      try {
        await Linking.openURL(fullUrl);
      } catch (err) {
        Alert.alert('Paper Vault', `Opening link: ${fullUrl}`);
      }
    }
  };

  const handleOpenVideoModal = (chap: SubjectChapter) => {
    setSelectedChapterForVideo(chap);
    if (chap.videos && chap.videos.length > 0) {
      setActiveVideoOption(chap.videos[0]);
    } else {
      const fallbackOption: ChapterVideo = {
        id: `fb-${chap.id}`,
        title: `${chap.title} - Video Lesson`,
        titleGujarati: `${chap.titleGujarati || chap.title} - વિડિયો લેક્ચર`,
        teacher: 'MindSprint Faculty',
        duration: chap.duration || '15m',
        youtubeVideoId: 'w7ejDZ8SWv8',
        tag: 'Chapter Masterclass',
      };
      chap.videos = [fallbackOption];
      setActiveVideoOption(fallbackOption);
    }
  };

  const handleLaunchExternalVideo = async (videoId: string) => {
    const webUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const appUrl = `vnd.youtube://${videoId}`;
    try {
      const canOpen = await Linking.canOpenURL(appUrl);
      if (canOpen) {
        await Linking.openURL(appUrl);
        return;
      }
    } catch (_) {}
    try {
      await Linking.openURL(webUrl);
    } catch (_) {
      try {
        await WebBrowser.openBrowserAsync(webUrl);
      } catch (_) {
        Alert.alert('Video Link', webUrl);
      }
    }
  };

  const handleStartExam = () => {
    if (!selectedChapterForQuiz) return;
    const cat = selectedChapterForQuiz.title;
    setShowConfigModal(false);
    router.push({
      pathname: '/exam',
      params: {
        category: cat,
        limit: selectedLimit.toString(),
      },
    });
  };

  const completedInSubject = chapters.filter((c) => completedChapterIds.includes(c.id)).length;
  const progressPercent = chapters.length > 0 ? Math.round((completedInSubject / chapters.length) * 100) : 0;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? '#1e1b4b' : '#eef2ff',
            borderBottomColor: colors.outlineVariant,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.headerIconCircle, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.2)' : 'rgba(30,0,169,0.1)' }]}>
            <MaterialIcons name="menu-book" size={22} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.primary }]}>
              {isSchoolMode
                ? `Class ${userGrade} Subject Learning Hub`
                : 'Placement Course & Concept Hub'}
            </Text>
            <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
              {isSchoolMode ? `${user?.board || 'CBSE'} Board • ${user?.medium || 'English'} Medium` : 'Campus Recruitment Tracks'}
            </Text>
          </View>
        </View>

        <View style={[styles.headerProgressPill, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#dcfce7' }]}>
          <MaterialIcons name="check-circle" size={13} color="#10b981" />
          <Text style={styles.headerProgressText}>{progressPercent}% DONE</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Horizontal Subject Switcher Chips */}
        <View style={styles.subjectChipsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectChipsScroll}
          >
            {activeSubjects.map((sub) => {
              const isSelected = selectedSubjectId === sub.id;
              const displayName = isGSEB && sub.nameGujarati ? sub.nameGujarati : sub.name;
              const iconName = (sub.id.includes('math') ? 'calculate' : sub.id.includes('sci') ? 'biotech' : sub.id.includes('soc') ? 'public' : sub.id.includes('guj') ? 'edit-note' : 'menu-book') as any;

              return (
                <TouchableOpacity
                  key={sub.id}
                  activeOpacity={0.75}
                  style={[
                    styles.subjectChip,
                    {
                      backgroundColor: isSelected
                        ? sub.color
                        : isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
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
                  <View style={[styles.chipCountBadge, { backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }]}>
                    <Text style={[styles.chipCountText, { color: isSelected ? '#ffffff' : colors.onSurfaceVariant }]}>
                      {sub.chapters?.length || 0}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 360° Learning Feature Pillar Tabs */}
        <View style={styles.pillarTabsSection}>
          {[
            { key: 'all', label: 'All Modules' },
            { key: 'imp', label: 'Imp Qs (1M-4M) ⭐' },
            { key: 'books', label: 'Textbooks 📚' },
            { key: 'papers', label: 'Board Papers 📄' },
            { key: 'videos', label: 'Video Options 🎬' },
            { key: 'practice', label: 'Practice Drills 🎯' },
            { key: 'formulas', label: 'Formulas & Notes 📝' },
          ].map((tab) => {
            const isSelected = activeFilterTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.pillarTabChip,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                    borderColor: isSelected ? colors.primary : colors.outlineVariant,
                  },
                ]}
                onPress={() => setActiveFilterTab(tab.key as any)}
              >
                <Text
                  style={[
                    styles.pillarTabText,
                    { color: isSelected ? '#ffffff' : colors.onSurface },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Subject Card Banner with Progress Tracker & Official Textbook PDF Button */}
        <View
          style={[
            styles.subjectHeroCard,
            { backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff', borderColor: colors.outlineVariant },
            MindSprintShadows.card,
          ]}
        >
          <View style={styles.subjectHeroTop}>
            <View style={[styles.subjectHeroIcon, { backgroundColor: `${activeSubject?.color || '#3b82f6'}20` }]}>
              <MaterialIcons name="school" size={24} color={activeSubject?.color || '#3b82f6'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.subjectHeroTitle, { color: colors.onSurface }]}>
                {isGSEB && activeSubject?.nameGujarati ? `${activeSubject.nameGujarati} (${activeSubject.name})` : activeSubject?.name}
              </Text>
              <Text style={[styles.subjectHeroSub, { color: colors.onSurfaceVariant }]}>
                {chapters.length} Official Textbook Chapters • {completedInSubject} Completed
              </Text>
            </View>
            <View style={[styles.subjectProgressBadge, { backgroundColor: `${activeSubject?.color || '#3b82f6'}15` }]}>
              <Text style={[styles.subjectProgressText, { color: activeSubject?.color || '#3b82f6' }]}>
                {progressPercent}%
              </Text>
            </View>
          </View>

          {/* Official Textbook Download / E-Book Reader Action Button */}
          {activeSubject?.officialTextbookPdf && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.officialTextbookPdfBtn, { backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.18)' : '#eff6ff', borderColor: colors.primary }]}
              onPress={() => handleOpenPdf(activeSubject.officialTextbookPdf)}
            >
              <MaterialIcons name="picture-as-pdf" size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.officialTextbookPdfTitle, { color: colors.primary }]}>
                  {isGSEB
                    ? `📕 ${activeSubject.textbookTitleGujarati || activeSubject.nameGujarati} e-Textbook (PDF)`
                    : `📕 Official ${activeSubject.textbookTitle || activeSubject.name} e-Textbook (PDF)`}
                </Text>
                <Text style={[styles.officialTextbookPdfSub, { color: colors.onSurfaceVariant }]}>
                  Read official NCERT / State Board Textbook
                </Text>
              </View>
              <MaterialIcons name="open-in-new" size={18} color={colors.primary} />
            </TouchableOpacity>
          )}

          {/* Progress Bar */}
          <View style={[styles.progressBarTrack, { backgroundColor: isDarkMode ? colors.surfaceContainerHigh : '#e2e8f0' }]}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: activeSubject?.color || '#3b82f6' }]} />
          </View>
        </View>

        {/* ===================================================================== */}
        {/* DEDICATED VIEW RENDERING BASED ON SELECTED PILLAR TAB                 */}
        {/* ===================================================================== */}

        {/* VIEW 1: TEXTBOOKS 📚 (Complete In-Depth Concept Reader & Swadhyay Solutions) */}
        {activeFilterTab === 'books' && (
          <View style={styles.chaptersList}>
            <Text style={[styles.viewSectionTitle, { color: colors.primary }]}>
              📚 {isGSEB && activeSubject?.nameGujarati ? `${activeSubject.nameGujarati} Textbook Chapters (${chapters.length}):` : `${activeSubject?.name} Textbook Chapters (${chapters.length}):`}
            </Text>
            {chapters.map((chap, idx) => {
              const chapterTitle = isGSEB && chap.titleGujarati ? `${chap.chapterNumber}. ${chap.titleGujarati}` : `${chap.chapterNumber}. ${chap.title}`;
              return (
                <View
                  key={chap.id}
                  style={[
                    styles.bookViewCard,
                    { backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff', borderColor: colors.outlineVariant },
                    MindSprintShadows.card,
                  ]}
                >
                  <View style={styles.bookCardHeader}>
                    <View style={[styles.bookNumBadge, { backgroundColor: `${activeSubject?.color || '#3b82f6'}20` }]}>
                      <Text style={[styles.bookNumText, { color: activeSubject?.color || '#3b82f6' }]}>{idx + 1}</Text>
                    </View>
                    <Text style={[styles.bookChapterTitle, { color: colors.onSurface }]}>
                      {chapterTitle}
                    </Text>
                  </View>

                  <Text style={[styles.bookSummaryText, { color: colors.onSurfaceVariant }]}>
                    {(isGSEB && chap.summaryGujarati) ? chap.summaryGujarati : chap.summary}
                  </Text>

                    {/* Actions Row (Read Notes, Listen Audio, Open Chapter PDF) */}
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                      <TouchableOpacity
                        style={[styles.readFullNotesBtn, { flex: 1, backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#eef2ff' }]}
                        onPress={() => setSelectedChapterForRead(chap)}
                      >
                        <MaterialIcons name="menu-book" size={16} color={colors.primary} />
                        <Text style={[styles.readFullNotesBtnText, { color: colors.primary }]}>
                          Read Notes 📖
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.pdfQuickBtn, { backgroundColor: isDarkMode ? 'rgba(56, 189, 248, 0.15)' : '#e0f2fe', borderColor: '#38bdf8' }]}
                        onPress={() => {
                          setWalkmanInitialTrack(idx);
                          setShowWalkman(true);
                        }}
                      >
                        <MaterialIcons name="headphones" size={16} color="#0284c7" />
                        <Text style={[styles.pdfQuickBtnText, { color: '#0284c7' }]}>Listen 🎧</Text>
                      </TouchableOpacity>

                      {chap.textbookPdfUrl && (
                        <TouchableOpacity
                          style={[styles.pdfQuickBtn, { backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', borderColor: '#ef4444' }]}
                          onPress={() => handleOpenPdf(chap.textbookPdfUrl)}
                        >
                          <MaterialIcons name="picture-as-pdf" size={16} color="#ef4444" />
                          <Text style={styles.pdfQuickBtnText}>PDF</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                </View>
              );
            })}
          </View>
        )}

        {/* VIEW 2: VIDEOS 🎬 (Multi-Teacher Video Choices View) */}
        {activeFilterTab === 'videos' && (
          <View style={styles.chaptersList}>
            <Text style={[styles.viewSectionTitle, { color: '#ef4444' }]}>
              🎬 Chapter Video Masterclasses & Teacher Choices:
            </Text>
            {chapters.map((chap) => {
              const chapterTitle = isGSEB && chap.titleGujarati ? `${chap.chapterNumber}. ${chap.titleGujarati}` : `${chap.chapterNumber}. ${chap.title}`;
              const videoCount = chap.videos?.length || 1;

              return (
                <View
                  key={chap.id}
                  style={[
                    styles.videoViewCard,
                    { backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff', borderColor: '#ef4444' },
                    MindSprintShadows.card,
                  ]}
                >
                  <View style={styles.videoCardTop}>
                    <MaterialIcons name="play-circle-filled" size={24} color="#ef4444" />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.videoCardTitle, { color: colors.onSurface }]}>
                        {chapterTitle}
                      </Text>
                      <Text style={[styles.videoCardSub, { color: colors.onSurfaceVariant }]}>
                        {videoCount} Alternative Teacher Videos Available
                      </Text>
                    </View>
                  </View>

                  {/* Available video tags */}
                  <View style={styles.videoTagsRow}>
                    {(chap.videos || []).map((v) => (
                      <View key={v.id} style={[styles.videoTagPill, { backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2' }]}>
                        <Text style={[styles.videoTagPillText, { color: '#ef4444' }]}>
                          🎥 {v.teacher} ({v.tag})
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.watchVideosActionBtn}
                    onPress={() => handleOpenVideoModal(chap)}
                  >
                    <MaterialIcons name="smart-display" size={18} color="#ffffff" />
                    <Text style={styles.watchVideosActionBtnText}>
                      Watch & Choose Video Lesson ({videoCount})
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* VIEW 3: PRACTICE DRILLS 🎯 */}
        {activeFilterTab === 'practice' && (
          <View style={styles.chaptersList}>
            <Text style={[styles.viewSectionTitle, { color: colors.primary }]}>
              🎯 Chapter-Wise Practice Tests & Assessments:
            </Text>
            {chapters.map((chap) => {
              const chapterTitle = isGSEB && chap.titleGujarati ? `${chap.chapterNumber}. ${chap.titleGujarati}` : `${chap.chapterNumber}. ${chap.title}`;
              return (
                <View
                  key={chap.id}
                  style={[
                    styles.practiceViewCard,
                    { backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff', borderColor: colors.outlineVariant },
                    MindSprintShadows.card,
                  ]}
                >
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={[styles.practiceCardTitle, { color: colors.onSurface }]}>
                      {chapterTitle}
                    </Text>
                    <Text style={[styles.practiceCardSub, { color: colors.onSurfaceVariant }]}>
                      {chap.questionCount || 15} Curated Questions
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.startQuizPillBtn, { backgroundColor: activeSubject?.color || '#3b82f6' }]}
                    onPress={() => {
                      setSelectedChapterForQuiz(chap);
                      setShowConfigModal(true);
                    }}
                  >
                    <MaterialIcons name="play-arrow" size={16} color="#ffffff" />
                    <Text style={styles.startQuizPillBtnText}>Start Test</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* VIEW 4: FORMULAS & NOTES 📝 */}
        {activeFilterTab === 'formulas' && (
          <View style={styles.chaptersList}>
            <Text style={[styles.viewSectionTitle, { color: '#8b5cf6' }]}>
              📝 All Chapter Formulas & Important Rules:
            </Text>
            {chapters.map((chap) => {
              const chapterTitle = isGSEB && chap.titleGujarati ? `${chap.chapterNumber}. ${chap.titleGujarati}` : `${chap.chapterNumber}. ${chap.title}`;
              const formulas = (isGSEB ? chap.keyFormulasGujarati : chap.keyFormulas) || chap.keyFormulas || [];

              return (
                <View
                  key={chap.id}
                  style={[
                    styles.formulasViewCard,
                    { backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff', borderColor: '#8b5cf6' },
                    MindSprintShadows.card,
                  ]}
                >
                  <Text style={[styles.formulaChapterHeading, { color: '#8b5cf6' }]}>
                    📌 {chapterTitle}
                  </Text>
                  {formulas.length > 0 ? (
                    formulas.map((f, fIdx) => (
                      <View key={fIdx} style={styles.formulaItemRow}>
                        <MaterialIcons name="check" size={14} color="#8b5cf6" />
                        <Text style={[styles.formulaText, { color: colors.onSurface }]}>{f}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={[styles.noFormulaText, { color: colors.onSurfaceVariant }]}>
                      {chap.summary}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* VIEW 4B: OFFICIAL SAMPLE & BOARD EXAM PAPERS 📄 */}
        {activeFilterTab === 'papers' && (
          <View style={styles.chaptersList}>
            <Text style={[styles.viewSectionTitle, { color: colors.primary }]}>
              📄 Official Board & Model Exam Papers:
            </Text>

            {/* Real 80-Mark Board Exam Simulator Banner */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.boardSimulatorHeroCard,
                { backgroundColor: '#1e1b4b' },
                MindSprintShadows.card,
              ]}
              onPress={() => router.push('/board-exam-simulator' as any)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.boardSimIconBox, { backgroundColor: '#8b5cf6' }]}>
                  <MaterialIcons name="assignment" size={24} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.simBadge}>
                    <Text style={styles.simBadgeText}>OFFICIAL PATTERN • 80 MARKS</Text>
                  </View>
                  <Text style={styles.boardSimTitle}>
                    Full 80-Mark Board Exam Simulator
                  </Text>
                  <Text style={styles.boardSimSub}>
                    3-Hour Countdown Timer • Section A-D • Step-wise Self-Evaluation Rubric
                  </Text>
                </View>
                <MaterialIcons name="arrow-forward" size={22} color="#ffffff" />
              </View>
            </TouchableOpacity>
            {samplePapers.length === 0 ? (
              <View style={[styles.bookViewCard, { padding: 24, alignItems: 'center', backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff' }]}>
                <MaterialIcons name="description" size={40} color={colors.onSurfaceVariant} />
                <Text style={{ marginTop: 8, color: colors.onSurfaceVariant }}>
                  No sample papers currently available for this grade.
                </Text>
              </View>
            ) : (
              samplePapers.map((paper) => (
                <View
                  key={paper.id}
                  style={[
                    styles.bookViewCard,
                    { backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff', borderColor: colors.primary },
                    MindSprintShadows.card,
                  ]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ backgroundColor: `${colors.primary}18`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                      <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 11 }}>
                        {paper.badge || 'OFFICIAL PAPER'}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, fontWeight: '600' }}>
                      ⏱️ {paper.durationMinutes} mins • 🎯 {paper.totalMarks} Marks
                    </Text>
                  </View>

                  <Text style={[styles.bookChapterTitle, { color: colors.onSurface, fontSize: 16, marginBottom: 4 }]}>
                    {isGSEB && paper.titleGujarati ? paper.titleGujarati : paper.title}
                  </Text>

                  <Text style={[styles.bookSummaryText, { color: colors.onSurfaceVariant, marginBottom: 12 }]}>
                    {paper.subject} • {paper.year} • {paper.questionCount} Questions
                  </Text>

                  {/* Action Row */}
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                    {paper.officialPdfUrl && (
                      <TouchableOpacity
                        style={[styles.readFullNotesBtn, { flex: 1, backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#eff6ff' }]}
                        onPress={() => handleOpenPdf(paper.officialPdfUrl)}
                      >
                        <MaterialIcons name="picture-as-pdf" size={16} color={colors.primary} />
                        <Text style={[styles.readFullNotesBtnText, { color: colors.primary }]}>
                          Question PDF 📥
                        </Text>
                      </TouchableOpacity>
                    )}

                    {paper.solutionPdfUrl && (
                      <TouchableOpacity
                        style={[styles.readFullNotesBtn, { flex: 1, backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f0fdf4' }]}
                        onPress={() => handleOpenPdf(paper.solutionPdfUrl)}
                      >
                        <MaterialIcons name="done-all" size={16} color="#16a34a" />
                        <Text style={[styles.readFullNotesBtnText, { color: '#16a34a' }]}>
                          Solutions 💡
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[styles.pdfQuickBtn, { backgroundColor: colors.primary, borderColor: colors.primary, paddingHorizontal: 12 }]}
                      onPress={() => router.push(`/exam?limit=${Math.min(paper.questionCount || 25, 25)}&category=${encodeURIComponent(paper.subject)}` as any)}
                    >
                      <MaterialIcons name="play-arrow" size={16} color="#ffffff" />
                      <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 12, marginLeft: 2 }}>
                        Start
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* VIEW 4C: FREQUENTLY ASKED 1M, 2M, 3M, 4M BOARD QUESTIONS ⭐ */}
        {activeFilterTab === 'imp' && (
          <View style={styles.chaptersList}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <Text style={[styles.viewSectionTitle, { color: '#f59e0b', marginBottom: 0 }]}>
                ⭐ Frequently Asked Board Questions (1M-4M):
              </Text>
            </View>

            {/* Marks Filter Pills (All, 1 Mark, 2 Marks, 3 Marks, 4 Marks) */}
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {[
                { marks: null, label: 'All Marks' },
                { marks: 1, label: '1 Mark (VSA)' },
                { marks: 2, label: '2 Marks (Short)' },
                { marks: 3, label: '3 Marks (Medium)' },
                { marks: 4, label: '4 Marks (Long/Theorem)' },
              ].map((m) => {
                const isSelected = selectedMarksFilter === m.marks;
                return (
                  <TouchableOpacity
                    key={m.label}
                    onPress={() => setSelectedMarksFilter(m.marks)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      borderWidth: 1,
                      backgroundColor: isSelected ? '#f59e0b' : isDarkMode ? colors.surfaceContainerLow : '#fef3c7',
                      borderColor: isSelected ? '#f59e0b' : '#fde68a',
                    }}
                  >
                    <Text style={{ fontSize: 11.5, fontWeight: '700', color: isSelected ? '#ffffff' : isDarkMode ? '#fde68a' : '#b45309' }}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {importantQuestions.length === 0 ? (
              <View style={[styles.bookViewCard, { padding: 24, alignItems: 'center', backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff' }]}>
                <MaterialIcons name="star-outline" size={40} color={colors.onSurfaceVariant} />
                <Text style={{ marginTop: 8, color: colors.onSurfaceVariant, textAlign: 'center' }}>
                  {isGSEB
                    ? 'આ વિષય માટે પસંદ કરેલ ગુણના પ્રશ્નો ઉપલબ્ધ નથી.'
                    : 'No board questions found for the selected filter.'}
                </Text>
              </View>
            ) : (
              importantQuestions.map((q) => {
                const isExpanded = expandedQuestionIds.includes(q.id);
                const qText = isGSEB && q.questionTextGujarati ? q.questionTextGujarati : q.questionText;
                const modelAns = isGSEB && q.modelAnswerGujarati ? q.modelAnswerGujarati : q.modelAnswer;
                const chTitle = isGSEB && q.chapterTitleGujarati ? q.chapterTitleGujarati : q.chapterTitle;
                const exTips = isGSEB && q.examinerTipsGujarati ? q.examinerTipsGujarati : q.examinerTips;

                return (
                  <View
                    key={q.id}
                    style={[
                      styles.impQuestionCard,
                      {
                        backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff',
                        borderColor: isExpanded ? '#f59e0b' : colors.outlineVariant,
                      },
                      MindSprintShadows.card,
                    ]}
                  >
                    {/* Top Meta Header: Marks badge, Chapter, Year frequency */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={[styles.marksBadge, { backgroundColor: q.marks === 1 ? '#3b82f6' : q.marks === 2 ? '#10b981' : q.marks === 3 ? '#8b5cf6' : '#ef4444' }]}>
                          <Text style={styles.marksBadgeText}>
                            {q.marks} {q.marks === 1 ? 'MARK' : 'MARKS'}
                          </Text>
                        </View>
                        <Text style={[styles.impChapText, { color: colors.onSurfaceVariant }]}>
                          Ch {q.chapterNumber}: {chTitle}
                        </Text>
                      </View>

                      {q.frequentlyAskedYears && q.frequentlyAskedYears.length > 0 && (
                        <View style={[styles.frequencyPill, { backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7' }]}>
                          <MaterialIcons name="whatshot" size={13} color="#f59e0b" />
                          <Text style={styles.frequencyPillText}>
                            {q.frequentlyAskedYears.slice(0, 2).join(' • ')}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Question Text */}
                    <Text style={[styles.impQuestionText, { color: colors.onSurface }]}>
                      {qText}
                    </Text>

                    {/* Expand/Collapse Toggle Button */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.toggleAnswerBtn,
                        {
                          backgroundColor: isExpanded
                            ? (isDarkMode ? colors.surfaceContainerHigh : '#fef3c7')
                            : (isDarkMode ? colors.surfaceContainerLow : '#f8fafc'),
                          borderColor: isExpanded ? '#f59e0b' : colors.outlineVariant,
                        },
                      ]}
                      onPress={() => toggleExpandQuestion(q.id)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <MaterialIcons
                          name={isExpanded ? 'visibility-off' : 'verified'}
                          size={16}
                          color={isExpanded ? '#f59e0b' : colors.primary}
                        />
                        <Text
                          style={[
                            styles.toggleAnswerBtnText,
                            { color: isExpanded ? '#d97706' : colors.primary },
                          ]}
                        >
                          {isExpanded
                            ? 'Hide Model Answer & Marking Scheme ▲'
                            : 'View Model Answer & Marking Scheme ▼'}
                        </Text>
                      </View>
                      <MaterialIcons
                        name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={20}
                        color={isExpanded ? '#f59e0b' : colors.onSurfaceVariant}
                      />
                    </TouchableOpacity>

                    {/* Expanded Content: Model Answer, Step-wise Marking, Examiner Tips */}
                    {isExpanded && (
                      <View style={[styles.expandedAnswerBox, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#fafafa', borderColor: colors.outlineVariant }]}>
                        {/* Model Answer */}
                        <View style={{ marginBottom: 12 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <MaterialIcons name="check-circle" size={16} color="#10b981" />
                            <Text style={[styles.ansSectionHeader, { color: '#10b981' }]}>
                              Ideal Board Model Answer:
                            </Text>
                          </View>
                          <Text style={[styles.modelAnsText, { color: colors.onSurface }]}>
                            {modelAns}
                          </Text>
                        </View>

                        {/* Step-by-Step Marking Breakdown */}
                        {q.stepWiseMarking && q.stepWiseMarking.length > 0 && (
                          <View style={{ marginBottom: 12 }}>
                            <Text style={[styles.ansSectionHeader, { color: colors.primary, marginBottom: 6 }]}>
                              📐 Step-Wise Marks Allocation:
                            </Text>
                            {q.stepWiseMarking.map((step) => {
                              const stepText = isGSEB && step.textGujarati ? step.textGujarati : step.text;
                              return (
                                <View key={step.stepNumber} style={styles.stepMarkingRow}>
                                  <View style={[styles.stepMarkBadge, { backgroundColor: `${colors.primary}20` }]}>
                                    <Text style={[styles.stepMarkBadgeText, { color: colors.primary }]}>
                                      +{step.marksAllocated}
                                    </Text>
                                  </View>
                                  <Text style={[styles.stepDetailText, { color: colors.onSurface }]}>
                                    {stepText}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        )}

                        {/* Examiner Tip */}
                        {exTips && (
                          <View style={[styles.examinerTipCard, { backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.12)' : '#fffbeb', borderColor: '#fde68a' }]}>
                            <MaterialIcons name="lightbulb" size={16} color="#f59e0b" style={{ marginTop: 2 }} />
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.examinerTipTitle, { color: '#b45309' }]}>
                                Board Examiner Tip:
                              </Text>
                              <Text style={[styles.examinerTipBody, { color: isDarkMode ? '#fef3c7' : '#92400e' }]}>
                                {exTips}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* VIEW 5: ALL MODULES (Default 360° View) */}
        {activeFilterTab === 'all' && (
          <View style={styles.chaptersList}>
            {chapters.map((chap, index) => {
              const isCompleted = completedChapterIds.includes(chap.id);
              const chapterTitle = isGSEB && chap.titleGujarati ? `${chap.chapterNumber}. ${chap.titleGujarati}` : `${chap.chapterNumber}. ${chap.title}`;
              const videoCount = chap.videos?.length || 1;
              const formulaCount = (isGSEB ? chap.keyFormulasGujarati?.length : chap.keyFormulas?.length) || chap.keyFormulas?.length || 0;

              return (
                <View
                  key={chap.id}
                  style={[
                    styles.chapterCard,
                    {
                      backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff',
                      borderColor: isCompleted ? '#10b981' : colors.outlineVariant,
                    },
                    MindSprintShadows.card,
                  ]}
                >
                  {/* Chapter Header */}
                  <View style={styles.chapterHeader}>
                    <TouchableOpacity
                      onPress={() => toggleChapterComplete(chap.id)}
                      style={[
                        styles.completeCheckCircle,
                        {
                          backgroundColor: isCompleted
                            ? '#10b981'
                            : isDarkMode ? colors.surfaceContainerHigh : '#f1f5f9',
                        },
                      ]}
                    >
                      {isCompleted ? (
                        <MaterialIcons name="check" size={16} color="#ffffff" />
                      ) : (
                        <Text style={[styles.chapterNumText, { color: colors.onSurfaceVariant }]}>
                          {index + 1}
                        </Text>
                      )}
                    </TouchableOpacity>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.chapterTitle, { color: colors.onSurface }]}>
                        {chapterTitle}
                      </Text>
                      <Text style={[styles.chapterSummary, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                        {(isGSEB && chap.summaryGujarati) ? chap.summaryGujarati : chap.summary}
                      </Text>
                    </View>

                    {/* Bookmark Icon */}
                    <TouchableOpacity
                      onPress={() => toggleChapterBookmark(chap.id)}
                      style={styles.bookmarkBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <MaterialIcons
                        name={bookmarkedChapterIds.includes(chap.id) ? 'bookmark' : 'bookmark-outline'}
                        size={22}
                        color={bookmarkedChapterIds.includes(chap.id) ? colors.primary : colors.outline}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Key Formulas Preview Pill (if available) */}
                  {formulaCount > 0 && (
                    <View style={[styles.formulaPillBox, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.1)' : '#f5f3ff' }]}>
                      <MaterialIcons name="functions" size={14} color="#8b5cf6" />
                      <Text style={[styles.formulaPillText, { color: colors.onSurface }]} numberOfLines={1}>
                        {`Formulas (${formulaCount}): `}
                        {((isGSEB && chap.keyFormulasGujarati?.[0]) || chap.keyFormulas?.[0])}
                      </Text>
                    </View>
                  )}

                  {/* 3 Pillars Action Row */}
                  <View style={styles.actionPillarsRow}>
                    {/* Pillar 1: Textbook Concept Reader */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.pillarBtn, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc', borderColor: colors.outlineVariant }]}
                      onPress={() => setSelectedChapterForRead(chap)}
                    >
                      <MaterialIcons name="auto-stories" size={16} color={colors.primary} />
                      <Text style={[styles.pillarBtnText, { color: colors.primary }]}>
                        Read Notes
                      </Text>
                    </TouchableOpacity>

                    {/* Pillar 2: Multi-Teacher Video Lessons Modal */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.pillarBtn, { backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2', borderColor: '#ef4444' }]}
                      onPress={() => handleOpenVideoModal(chap)}
                    >
                      <MaterialIcons name="play-circle-filled" size={16} color="#ef4444" />
                      <Text style={[styles.pillarBtnText, { color: '#ef4444' }]}>
                        {`Videos (${videoCount})`}
                      </Text>
                    </TouchableOpacity>

                    {/* Pillar 3: Practice Chapter Quiz */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.pillarBtn, { backgroundColor: activeSubject?.color || '#3b82f6', borderColor: activeSubject?.color || '#3b82f6' }]}
                      onPress={() => {
                        setSelectedChapterForQuiz(chap);
                        setShowConfigModal(true);
                      }}
                    >
                      <MaterialIcons name="quiz" size={16} color="#ffffff" />
                      <Text style={[styles.pillarBtnText, { color: '#ffffff' }]}>
                        Quiz 🎯
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* ========================================================================= */}
      {/* MULTI-TEACHER / MULTI-VIDEO PLAYER MODAL WITH ALTERNATIVE CHOICES       */}
      {/* ========================================================================= */}
      <Modal
        visible={!!selectedChapterForVideo}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedChapterForVideo(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.videoModalCard, { backgroundColor: colors.surfaceContainerLowest }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: colors.onSurface }]} numberOfLines={1}>
                  🎬 {isGSEB && selectedChapterForVideo?.titleGujarati ? selectedChapterForVideo.titleGujarati : selectedChapterForVideo?.title}
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.onSurfaceVariant }]}>
                  Choose your preferred teacher & explanation style
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedChapterForVideo(null)}>
                <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* Embedded YouTube Player */}
            {activeVideoOption && (
              <View style={styles.embeddedPlayerBox}>
                <YoutubePlayer
                  key={activeVideoOption.youtubeVideoId}
                  height={VIDEO_HEIGHT}
                  play={false}
                  videoId={activeVideoOption.youtubeVideoId}
                  initialPlayerParams={{
                    controls: true,
                    modestbranding: true,
                    rel: false,
                  }}
                />
              </View>
            )}

            {/* Quick Textbook PDF Bar for current chapter */}
            {selectedChapterForVideo?.textbookPdfUrl && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.videoOptionCard,
                  {
                    backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
                    borderColor: '#ef4444',
                    borderWidth: 1,
                    marginVertical: 8,
                  },
                ]}
                onPress={() => handleOpenPdf(selectedChapterForVideo.textbookPdfUrl)}
              >
                <View style={[styles.videoOptionIcon, { backgroundColor: '#ef4444' }]}>
                  <MaterialIcons name="picture-as-pdf" size={18} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.videoOptionTitle, { color: '#ef4444', fontWeight: '700' }]}>
                    {isGSEB ? '📖 આ પ્રકરણનું અધિકૃત પાઠ્યપુસ્તક PDF વાંચો' : '📖 Read Official Chapter Textbook PDF'}
                  </Text>
                  <Text style={[styles.videoTeacherName, { color: colors.onSurfaceVariant }]}>
                    {isGSEB ? 'NCERT / GSEB ડિજિટલ પુસ્તક • ઓરિજિનલ સિલેબસ' : 'NCERT / GSEB Official Material & Diagrams'}
                  </Text>
                </View>
                <MaterialIcons name="open-in-new" size={18} color="#ef4444" />
              </TouchableOpacity>
            )}

            {/* Multiple Video Selection Options List */}
            <Text style={[styles.alternativeVideosHeading, { color: colors.primary }]}>
              🎥 Available Video Lessons (Tap to switch):
            </Text>

            <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
              {(selectedChapterForVideo?.videos || []).map((vid) => {
                const isSelected = activeVideoOption?.id === vid.id;
                const vidTitle = isGSEB && vid.titleGujarati ? vid.titleGujarati : vid.title;

                return (
                  <TouchableOpacity
                    key={vid.id}
                    activeOpacity={0.8}
                    style={[
                      styles.videoOptionCard,
                      {
                        backgroundColor: isSelected
                          ? isDarkMode ? 'rgba(129,140,248,0.15)' : '#eef2ff'
                          : isDarkMode ? colors.surfaceContainerLow : '#f8fafc',
                        borderColor: isSelected ? colors.primary : colors.outlineVariant,
                        borderWidth: isSelected ? 1.5 : 1,
                      },
                    ]}
                    onPress={() => setActiveVideoOption(vid)}
                  >
                    <View style={[styles.videoOptionIcon, { backgroundColor: isSelected ? colors.primary : isDarkMode ? colors.surfaceContainerHigh : '#e2e8f0' }]}>
                      <MaterialIcons name={isSelected ? 'play-arrow' : 'video-library'} size={18} color={isSelected ? '#ffffff' : colors.onSurfaceVariant} />
                    </View>

                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[styles.videoOptionTitle, { color: isSelected ? colors.primary : colors.onSurface }]} numberOfLines={2}>
                        {vidTitle}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.videoTeacherName, { color: colors.onSurfaceVariant }]}>
                          👨‍🏫 {vid.teacher}
                        </Text>
                        <Text style={[styles.videoTagBadge, { color: colors.primary }]}>
                          • {vid.tag}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleLaunchExternalVideo(vid.youtubeVideoId)}
                      style={styles.openYtIconBtn}
                    >
                      <MaterialIcons name="open-in-new" size={18} color={colors.primary} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* TEXTBOOK CONCEPT & FORMULA READER MODAL (NO FORCED QUIZ!)                */}
      {/* ========================================================================= */}
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

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420, marginVertical: 10 }}>
              {/* Summary Section */}
              <Text style={[styles.chapterReadHeading, { color: colors.primary }]}>
                📌 Chapter Summary & Key Concepts:
              </Text>
              <Text style={[styles.chapterReadBody, { color: colors.onSurface }]}>
                {(isGSEB && selectedChapterForRead?.summaryGujarati)
                  ? selectedChapterForRead.summaryGujarati
                  : selectedChapterForRead?.summary}
              </Text>

              {/* Key Formulas Vault */}
              {((isGSEB ? selectedChapterForRead?.keyFormulasGujarati : selectedChapterForRead?.keyFormulas) || selectedChapterForRead?.keyFormulas || []).length > 0 && (
                <View style={[styles.formulasVaultCard, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.1)' : '#f5f3ff', borderColor: '#8b5cf6' }]}>
                  <Text style={[styles.formulasVaultTitle, { color: '#8b5cf6' }]}>
                    ⚡ Key Formulas & Rules:
                  </Text>
                  {((isGSEB ? selectedChapterForRead?.keyFormulasGujarati : selectedChapterForRead?.keyFormulas) || selectedChapterForRead?.keyFormulas || []).map((formula, fIdx) => (
                    <View key={fIdx} style={styles.formulaItemRow}>
                      <MaterialIcons name="label-important" size={14} color="#8b5cf6" />
                      <Text style={[styles.formulaItemText, { color: colors.onSurface }]}>{formula}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Textbook Swadhyay Solutions */}
              {(selectedChapterForRead?.exerciseSolutions || []).length > 0 && (
                <View style={[styles.swadhyayCard, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc', borderColor: colors.outlineVariant }]}>
                  <Text style={[styles.swadhyayHeading, { color: colors.primary }]}>
                    📝 Textbook Exercise Solutions:
                  </Text>
                  {selectedChapterForRead?.exerciseSolutions?.map((ex, exIdx) => (
                    <View key={exIdx} style={styles.swadhyayItem}>
                      <Text style={[styles.swadhyayQuestion, { color: colors.onSurface }]}>
                        Q{exIdx + 1}. {(isGSEB && ex.questionGujarati) ? ex.questionGujarati : ex.question}
                      </Text>
                      <Text style={[styles.swadhyayAnswer, { color: colors.onSurfaceVariant }]}>
                        Ans. {(isGSEB && ex.answerGujarati) ? ex.answerGujarati : ex.answer}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Concepts List */}
              {(selectedChapterForRead?.concepts || []).map((concept, cIdx) => (
                <View key={cIdx} style={[styles.conceptCard, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc', borderColor: colors.outlineVariant }]}>
                  <Text style={[styles.conceptHeading, { color: colors.primary }]}>
                    {isGSEB && concept.headingGujarati ? concept.headingGujarati : concept.heading}
                  </Text>
                  <Text style={[styles.conceptText, { color: colors.onSurface }]}>
                    {isGSEB && concept.explanationGujarati ? concept.explanationGujarati : concept.explanation}
                  </Text>
                </View>
              ))}

              {/* Tap-to-Translate Micro-Glossary Section */}
              <View style={[styles.glossaryPillsCard, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f0fdf4', borderColor: '#10b981' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <MaterialIcons name="translate" size={16} color="#10b981" />
                  <Text style={[styles.glossaryPillsTitle, { color: '#10b981' }]}>
                    Interactive Micro-Glossary (Tap for English/Gujarati terms):
                  </Text>
                </View>
                <View style={styles.glossaryRow}>
                  {['photosynthesis', 'chlorophyll', 'circuit', 'resistance', 'primenumber', 'gravity'].map((termKey) => (
                    <TouchableOpacity
                      key={termKey}
                      style={[styles.termChip, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#dcfce7' }]}
                      onPress={() => setActiveGlossaryTerm(termKey)}
                    >
                      <Text style={[styles.termChipText, { color: '#047857' }]}>
                        🔍 {termKey}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={[styles.notesReadDoneBox, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5' }]}>
                <MaterialIcons name="check-circle" size={18} color="#10b981" />
                <Text style={[styles.notesReadDoneText, { color: '#10b981' }]}>
                  You have completed reading this chapter’s concept notes!
                </Text>
              </View>
            </ScrollView>

            {/* Modal Actions (Close Notes OR Practice Quiz) */}
            <View style={styles.readModalActionsRow}>
              <TouchableOpacity
                style={[styles.closeReadNotesBtn, { backgroundColor: isDarkMode ? colors.surfaceContainerHigh : '#f1f5f9', borderColor: colors.outlineVariant }]}
                onPress={() => setSelectedChapterForRead(null)}
              >
                <Text style={[styles.closeReadNotesBtnText, { color: colors.onSurface }]}>
                  Done Reading (Close)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionalQuizBtn, { backgroundColor: colors.primary }]}
                onPress={() => {
                  const chap = selectedChapterForRead;
                  setSelectedChapterForRead(null);
                  if (chap) {
                    router.push(`/exam?limit=10&category=${encodeURIComponent(chap.title)}`);
                  }
                }}
              >
                <MaterialIcons name="quiz" size={16} color="#ffffff" />
                <Text style={styles.optionalQuizBtnText}>
                  Take Quiz 🎯
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Practice Configurator Modal */}
      <Modal
        visible={showConfigModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfigModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.surfaceContainerLowest },
              MindSprintShadows.card,
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: colors.onSurface }]}>
                  {isGSEB && selectedChapterForQuiz?.titleGujarati ? selectedChapterForQuiz.titleGujarati : selectedChapterForQuiz?.title}
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.onSurfaceVariant }]}>
                  Configure practice quiz session
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowConfigModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* Question Count Selector */}
            <Text style={[styles.configLabel, { color: colors.onSurface }]}>
              Number of Questions:
            </Text>
            <View style={styles.limitRow}>
              {[5, 10, 25].map((limit) => {
                const isSelected = selectedLimit === limit;
                return (
                  <TouchableOpacity
                    key={limit}
                    style={[
                      styles.limitChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceContainer,
                        borderColor: isSelected ? colors.primary : colors.outlineVariant,
                      },
                    ]}
                    onPress={() => setSelectedLimit(limit)}
                  >
                    <Text
                      style={[
                        styles.limitChipText,
                        { color: isSelected ? '#ffffff' : colors.onSurface },
                      ]}
                    >
                      {limit} Qs
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Start Exam Action Button */}
            <TouchableOpacity
              style={[styles.launchExamBtn, { backgroundColor: colors.primary }, MindSprintShadows.glow]}
              onPress={handleStartExam}
            >
              <Text style={styles.launchExamBtnText}>
                Begin Practice Drill 🎯
              </Text>
              <MaterialIcons name="play-arrow" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Interactive Micro-Glossary Tooltip Modal */}
      <GlossaryTooltip
        visible={!!activeGlossaryTerm}
        termKeyOrText={activeGlossaryTerm || ''}
        onClose={() => setActiveGlossaryTerm(null)}
      />

      {/* Audio Walkman Player Modal */}
      <AudioWalkmanPlayer
        visible={showWalkman}
        tracks={audioTracks}
        initialTrackIndex={walkmanInitialTrack}
        onClose={() => setShowWalkman(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 11,
    marginTop: 1,
    fontWeight: '500',
  },
  headerProgressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  headerProgressText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#10b981',
  },
  scrollContainer: {
    padding: 16,
    gap: 14,
    paddingBottom: 36,
  },
  subjectChipsSection: {
    marginVertical: 2,
  },
  subjectChipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  subjectChipText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  chipCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  chipCountText: {
    fontSize: 10,
    fontWeight: '800',
  },
  pillarTabsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pillarTabChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  pillarTabText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  subjectHeroCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  subjectHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subjectHeroIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectHeroTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  subjectHeroSub: {
    fontSize: 12,
    marginTop: 2,
  },
  subjectProgressBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  subjectProgressText: {
    fontSize: 13,
    fontWeight: '800',
  },
  officialTextbookPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  officialTextbookPdfTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  officialTextbookPdfSub: {
    fontSize: 11,
    marginTop: 1,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  viewSectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  chaptersList: {
    gap: 12,
  },
  // Book View Styles
  bookViewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  bookCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bookNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNumText: {
    fontSize: 12,
    fontWeight: '800',
  },
  bookChapterTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  bookSummaryText: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  readFullNotesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  readFullNotesBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pdfQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  pdfQuickBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '800',
  },
  // Video View Styles
  videoViewCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    gap: 10,
  },
  videoCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  videoCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  videoCardSub: {
    fontSize: 11,
    marginTop: 1,
  },
  videoTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  videoTagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  videoTagPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  watchVideosActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  watchVideosActionBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  // Practice View Styles
  practiceViewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  practiceCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  practiceCardSub: {
    fontSize: 11.5,
  },
  startQuizPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startQuizPillBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  // Formulas View Styles
  formulasViewCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    gap: 8,
  },
  formulaChapterHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  formulaItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  formulaItemText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  formulaText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  noFormulaText: {
    fontSize: 12,
    lineHeight: 17,
  },
  // Chapter Card Styles (Default View)
  chapterCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  completeCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  chapterNumText: {
    fontSize: 12,
    fontWeight: '800',
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  chapterSummary: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  bookmarkBtn: {
    padding: 2,
    marginTop: 1,
    alignSelf: 'flex-start',
  },
  formulaPillBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  formulaPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    flex: 1,
  },
  actionPillarsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillarBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  pillarBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  videoModalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
    maxHeight: '90%',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 16.5,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  embeddedPlayerBox: {
    width: '100%',
    backgroundColor: '#000000',
    borderRadius: 14,
    overflow: 'hidden',
  },
  alternativeVideosHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  videoOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    gap: 10,
  },
  videoOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoOptionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 17,
  },
  videoTeacherName: {
    fontSize: 11,
    fontWeight: '500',
  },
  videoTagBadge: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  openYtIconBtn: {
    padding: 6,
  },
  chapterReadHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: 6,
  },
  chapterReadBody: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  formulasVaultCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 6,
  },
  formulasVaultTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 2,
  },
  swadhyayCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  swadhyayHeading: {
    fontSize: 13,
    fontWeight: '800',
  },
  swadhyayItem: {
    gap: 3,
    paddingVertical: 4,
  },
  swadhyayQuestion: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  swadhyayAnswer: {
    fontSize: 12,
    lineHeight: 17,
  },
  conceptCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 4,
  },
  conceptHeading: {
    fontSize: 13,
    fontWeight: '700',
  },
  conceptText: {
    fontSize: 12,
    lineHeight: 18,
  },
  notesReadDoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  notesReadDoneText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  readModalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  closeReadNotesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  closeReadNotesBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  optionalQuizBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  optionalQuizBtnText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
  },
  configLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  limitRow: {
    flexDirection: 'row',
    gap: 10,
  },
  limitChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  limitChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  launchExamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  launchExamBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  // Important Board Questions Styles
  impQuestionCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    gap: 12,
  },
  marksBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  marksBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  impChapText: {
    fontSize: 12,
    fontWeight: '600',
  },
  frequencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  frequencyPillText: {
    color: '#d97706',
    fontSize: 11,
    fontWeight: '700',
  },
  impQuestionText: {
    fontSize: 14.5,
    fontWeight: '700',
    lineHeight: 21,
  },
  toggleAnswerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  toggleAnswerBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  expandedAnswerBox: {
    marginTop: 4,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  ansSectionHeader: {
    fontSize: 12.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modelAnsText: {
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '500',
  },
  stepMarkingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  stepMarkBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 1,
  },
  stepMarkBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  stepDetailText: {
    fontSize: 12.5,
    lineHeight: 18,
    flex: 1,
  },
  examinerTipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  examinerTipTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    marginBottom: 2,
  },
  examinerTipBody: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  boardSimulatorHeroCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  boardSimIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  simBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  boardSimTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  boardSimSub: {
    color: '#c7d2fe',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  glossaryPillsCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 8,
    marginBottom: 10,
  },
  glossaryPillsTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  glossaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  termChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  termChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
