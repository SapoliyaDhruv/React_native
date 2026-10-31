import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { VideoPlayerView } from '@/components/mindsprint/VideoPlayerView';
import { UpNextList } from '@/components/mindsprint/UpNextList';
import { VideoScreenSkeleton } from '@/components/mindsprint/SkeletonLoader';
import { ErrorState } from '@/components/mindsprint/ErrorState';
import { VIDEO_LECTURES_DATA, VideoLecture, VideoComment } from '@/constants/videoData';
import { ApiService } from '@/services/api';

const COLLEGE_FILTERS = [
  { key: 'All', label: 'All Topics', icon: 'video-library' as const },
  { key: 'Quant', label: 'Quant', icon: 'calculate' as const },
  { key: 'DSA', label: 'DSA', icon: 'code' as const },
  { key: 'React', label: 'React JS', icon: 'web' as const },
  { key: 'HR', label: 'HR Rounds', icon: 'person-outline' as const },
];

const SCHOOL_GSEB_FILTERS = [
  { key: 'All', label: 'બધા વિષયો', icon: 'video-library' as const },
  { key: 'ગણિત', label: 'ગણિત', icon: 'calculate' as const },
  { key: 'વિજ્ઞાન', label: 'વિજ્ઞાન', icon: 'biotech' as const },
  { key: 'સામાજિક વિજ્ઞાન', label: 'સામા. વિજ્ઞાન', icon: 'public' as const },
  { key: 'ગુજરાતી', label: 'ગુજરાતી', icon: 'edit-note' as const },
  { key: 'અંગ્રેજી', label: 'અંગ્રેજી', icon: 'menu-book' as const },
];

const SENIOR_GSEB_FILTERS = [
  { key: 'All', label: 'બધા વિષયો', icon: 'video-library' as const },
  { key: 'ભૌતિક વિજ્ઞાન', label: 'ભૌતિક વિજ્ઞાન', icon: 'speed' as const },
  { key: 'રસાયણ વિજ્ઞાન', label: 'રસાયણ વિજ્ઞાન', icon: 'science' as const },
  { key: 'ગણિત', label: 'ગણિત', icon: 'calculate' as const },
  { key: 'જીવ વિજ્ઞાન', label: 'જીવ વિજ્ઞાન', icon: 'biotech' as const },
  { key: 'ગુજરાતી', label: 'ગુજરાતી', icon: 'edit-note' as const },
  { key: 'અંગ્રેજી', label: 'અંગ્રેજી', icon: 'menu-book' as const },
  { key: 'કોમ્પ્યુટર સાયન્સ', label: 'કોમ્પ્યુટર', icon: 'computer' as const },
];

export default function VideoScreen() {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade = user?.grade || 'college';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode;

  const filterOptions = useMemo(() => {
    if (!isSchoolMode) return COLLEGE_FILTERS;
    if (userGrade === '11' || userGrade === '12') return SENIOR_GSEB_FILTERS;
    return SCHOOL_GSEB_FILTERS;
  }, [isSchoolMode, userGrade]);

  const [lectures, setLectures] = useState<VideoLecture[]>(VIDEO_LECTURES_DATA);
  const [activeLecture, setActiveLecture] = useState<VideoLecture>(VIDEO_LECTURES_DATA[0]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [isSequentialMode, setIsSequentialMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedLectures, setBookmarkedLectures] = useState<string[]>([]);
  const [completedLectureIds, setCompletedLectureIds] = useState<string[]>([]);

  const storageKey = `@mindsprint_completed_videos_${userGrade}_${user?.board || 'CBSE'}_${user?.email || 'guest'}`;

  // Reset filter when grade or board changes
  useEffect(() => {
    setSelectedFilter('All');
  }, [userGrade, user?.board]);

  // Load completed videos
  useEffect(() => {
    async function loadCompleted() {
      try {
        const data = await AsyncStorage.getItem(storageKey);
        if (data) {
          setCompletedLectureIds(JSON.parse(data));
        }
      } catch (e) {
        console.warn('Completed videos load error:', e);
      }
    }
    loadCompleted();
  }, [user?.email, storageKey]);

  // Check if a lecture is unlocked sequentially within its subject
  const isLectureUnlocked = useCallback((lecture: VideoLecture) => {
    const subjectLecs = lectures.filter(
      (l) => (l.category && l.category === lecture.category) ||
             (l.categoryGujarati && l.categoryGujarati === lecture.categoryGujarati)
    );
    const index = subjectLecs.findIndex((l) => l.id === lecture.id);
    if (index <= 0) return true; // Chapter 1 is always unlocked
    return completedLectureIds.includes(subjectLecs[index - 1].id);
  }, [lectures, completedLectureIds]);

  // Displayed lectures based on sequential mode
  const displayedLectures = useMemo(() => {
    if (!isSequentialMode) return lectures;
    return lectures.filter((l) => isLectureUnlocked(l));
  }, [isSequentialMode, lectures, isLectureUnlocked]);

  // Number of remaining locked chapters
  const remainingLockedCount = Math.max(0, lectures.length - displayedLectures.length);

  // Next locked lecture title
  const nextLockedLecture = useMemo(() => {
    return lectures.find((l) => !isLectureUnlocked(l));
  }, [lectures, isLectureUnlocked]);

  // Ensure active lecture is valid and in displayed list
  useEffect(() => {
    if (displayedLectures.length > 0 && !displayedLectures.some((l) => l.id === activeLecture?.id)) {
      setActiveLecture(displayedLectures[0]);
    }
  }, [displayedLectures, activeLecture?.id]);

  const toggleComplete = async (lectureId: string) => {
    let updated: string[];
    const isNowComplete = !completedLectureIds.includes(lectureId);

    if (completedLectureIds.includes(lectureId)) {
      updated = completedLectureIds.filter((id) => id !== lectureId);
    } else {
      updated = [...completedLectureIds, lectureId];

      // Auto-unlock next chapter feedback
      const currentSubjectLecs = lectures.filter(
        (l) => (l.category && l.category === activeLecture?.category) ||
               (l.categoryGujarati && l.categoryGujarati === activeLecture?.categoryGujarati)
      );
      const currIdx = currentSubjectLecs.findIndex((l) => l.id === lectureId);
      if (currIdx !== -1 && currIdx + 1 < currentSubjectLecs.length) {
        const nextLec = currentSubjectLecs[currIdx + 1];
        setActiveLecture(nextLec);
        Alert.alert(
          isGSEB ? '🎉 પ્રકરણ પૂર્ણ થયું!' : '🎉 Lesson Completed!',
          isGSEB
            ? `અભિનંદન! આગળનું પ્રકરણ અનલૉક થઈ ગયું છે:\n"${nextLec.titleGujarati || nextLec.title}"`
            : `Great job! Next chapter unlocked:\n"${nextLec.title}"`
        );
      } else if (updated.length >= lectures.length) {
        Alert.alert(
          'Masterclass Series Completed! 🎓',
          'Congratulations! You have completed all masterclass lectures in this track.'
        );
      }
    }

    setCompletedLectureIds(updated);
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save completed video:', e);
    }
  };

  const fetchVideos = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getVideos(selectedFilter, userGrade, user?.board);
      if (Array.isArray(data) && data.length > 0) {
        setLectures(data);
        setActiveLecture((prev) => {
          const matched = data.find((v) => v.id === prev?.id);
          return matched || data[0];
        });
      }
    } catch (err: any) {
      console.warn('Failed to load dynamic videos:', err);
      setError('Could not connect to video server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedFilter, userGrade, user?.board]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVideos(true);
  };

  const toggleBookmark = () => {
    if (bookmarkedLectures.includes(activeLecture.id)) {
      setBookmarkedLectures(bookmarkedLectures.filter((id) => id !== activeLecture.id));
    } else {
      setBookmarkedLectures([...bookmarkedLectures, activeLecture.id]);
    }
  };

  const handleCommentAdded = (newComment: VideoComment) => {
    setActiveLecture((prev) => ({
      ...prev,
      comments: [newComment, ...(prev.comments || [])],
      discussionCount: (prev.discussionCount || 0) + 1,
    }));
  };

  const completedCount = lectures.filter((l) => completedLectureIds.includes(l.id)).length;
  const progressPercentage = lectures.length > 0 ? Math.round((completedCount / lectures.length) * 100) : 0;
  const isActiveCompleted = completedLectureIds.includes(activeLecture?.id || '');

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Premium Header */}
      <View
        style={[styles.header, { backgroundColor: isDarkMode ? '#1e1b4b' : '#eef2ff' }]}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.headerIconCircle, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.2)' : 'rgba(30,0,169,0.1)' }]}>
            <MaterialIcons name="play-circle-filled" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.primary }]}>
              {!isSchoolMode
                ? 'Placement Masterclasses'
                : isGSEB
                ? `ધોરણ ${userGrade} GSEB ગુજરાત બોર્ડ`
                : `Class ${userGrade} Masterclasses`}
            </Text>
            <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
              {isSequentialMode
                ? `${displayedLectures.length} of ${lectures.length} lessons unlocked • ${isSchoolMode ? `${user?.board || 'GSEB'} Board (ગુજરાતી માધ્યમ)` : 'Campus Placement Track'}`
                : `${lectures.length} lessons • ${isSchoolMode ? `${user?.board || 'GSEB'} Board (ગુજરાતી માધ્યમ)` : 'Campus Placement Track'}`}
            </Text>
          </View>
        </View>

        {/* Quick Progress Indicator */}
        <View style={[styles.headerProgressPill, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#dcfce7' }]}>
          <MaterialIcons name="check-circle" size={14} color="#10b981" />
          <Text style={styles.headerProgressText}>{progressPercentage}% DONE</Text>
        </View>
      </View>

      {/* Main Scrollable Content */}
      {loading ? (
        <VideoScreenSkeleton />
      ) : error && lectures.length === 0 ? (
        <ErrorState
          title="Video Feed Unavailable"
          message="Could not load latest video masterclasses. Check your connection."
          onRetry={() => fetchVideos()}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* Interactive Video Player */}
          {activeLecture && (
            <View>
              <VideoPlayerView
                lecture={activeLecture}
                isBookmarked={bookmarkedLectures.includes(activeLecture.id)}
                onToggleBookmark={toggleBookmark}
                onCommentAdded={handleCommentAdded}
              />

              {/* Active Lesson Completion Bar */}
              <View style={styles.completeBarWrapper}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.completeActionBtn,
                    {
                      backgroundColor: isActiveCompleted ? '#10b981' : isDarkMode ? colors.surfaceContainerLow : '#f1f5f9',
                      borderColor: isActiveCompleted ? '#10b981' : colors.outlineVariant,
                    },
                    isActiveCompleted && MindSprintShadows.glow,
                  ]}
                  onPress={() => toggleComplete(activeLecture.id)}
                >
                  <MaterialIcons
                    name={isActiveCompleted ? 'check-circle' : 'radio-button-unchecked'}
                    size={20}
                    color={isActiveCompleted ? '#ffffff' : colors.primary}
                  />
                  <Text
                    style={[
                      styles.completeActionText,
                      { color: isActiveCompleted ? '#ffffff' : colors.onSurface },
                    ]}
                  >
                    {isActiveCompleted
                      ? isGSEB ? 'પ્રકરણ પૂર્ણ થયું ✓ (Tap to Undo)' : 'Lesson Completed ✓ (Tap to Undo)'
                      : isGSEB ? 'આ પ્રકરણ પૂર્ણ તરીકે ચિહ્નિત કરો (Mark as Completed)' : 'Mark Lesson as Completed'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Course Progress Card */}
          <View
            style={[
              styles.progressCard,
              {
                backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff',
                borderColor: colors.outlineVariant,
              },
              MindSprintShadows.card,
            ]}
          >
            <View style={styles.progressHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialIcons name="school" size={20} color={colors.primary} />
                <Text style={[styles.progressTitle, { color: colors.onSurface }]}>
                  {isGSEB ? 'અભ્યાસક્રમ પ્રગતિ (Course Progress)' : 'Course Completion Progress'}
                </Text>
              </View>
              <Text style={[styles.progressCountText, { color: colors.primary }]}>
                {completedCount} of {lectures.length} ({progressPercentage}%)
              </Text>
            </View>

            {/* Progress Bar Line */}
            <View style={[styles.progressBarTrack, { backgroundColor: isDarkMode ? colors.surfaceContainerHigh : '#e2e8f0' }]}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%`, backgroundColor: colors.primary }]} />
            </View>
          </View>

          {/* Category Filter Chips */}
          <View style={[styles.filterSection, { backgroundColor: colors.background }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
            >
              {filterOptions.map((filter) => {
                const isSelected = selectedFilter === filter.key;
                return (
                  <TouchableOpacity
                    key={filter.key}
                    activeOpacity={0.75}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                        borderColor: isSelected ? colors.primary : colors.outlineVariant,
                      },
                    ]}
                    onPress={() => setSelectedFilter(filter.key)}
                  >
                    <MaterialIcons
                      name={filter.icon}
                      size={14}
                      color={isSelected ? '#ffffff' : colors.onSurfaceVariant}
                    />
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: isSelected ? '#ffffff' : colors.onSurface },
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Dynamic Course Playlist with sequential unlocking */}
          <UpNextList
            lectures={displayedLectures}
            allLectures={lectures}
            totalChaptersCount={lectures.length}
            activeLectureId={activeLecture?.id || ''}
            completedLectureIds={completedLectureIds}
            isSequentialMode={isSequentialMode}
            onToggleSequentialMode={() => setIsSequentialMode(!isSequentialMode)}
            onSelectLecture={(lec) => setActiveLecture(lec)}
            onToggleComplete={toggleComplete}
            remainingLockedCount={remainingLockedCount}
            nextLockedTitle={isGSEB ? nextLockedLecture?.titleGujarati || nextLockedLecture?.title : nextLockedLecture?.title}
            isLectureUnlocked={isLectureUnlocked}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 1,
  },
  headerProgressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  headerProgressText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10b981',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  completeBarWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  completeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  completeActionText: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressCard: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressCountText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  filterSection: {
    paddingVertical: 12,
  },
  chipScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
