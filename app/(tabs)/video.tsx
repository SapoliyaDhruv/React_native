import React, { useState, useEffect, useCallback } from 'react';
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

const SCHOOL_CBSE_FILTERS = [
  { key: 'All', label: 'All Subjects', icon: 'video-library' as const },
  { key: 'Mathematics', label: 'Maths', icon: 'calculate' as const },
  { key: 'Science', label: 'Science', icon: 'biotech' as const },
  { key: 'Social Science', label: 'Social Sci.', icon: 'public' as const },
  { key: 'Gujarati', label: 'Gujarati', icon: 'edit-note' as const },
  { key: 'English', label: 'English', icon: 'menu-book' as const },
];

const SCHOOL_GSEB_FILTERS = [
  { key: 'All', label: 'All Subjects', icon: 'video-library' as const },
  { key: 'ગણિત', label: 'ગણિત', icon: 'calculate' as const },
  { key: 'વિજ્ઞાન', label: 'વિજ્ઞાન', icon: 'biotech' as const },
  { key: 'સામાજિક વિજ્ઞાન', label: 'સામા. વિ.', icon: 'public' as const },
  { key: 'ગુજરાતી', label: 'ગુજરાતી', icon: 'edit-note' as const },
  { key: 'અંગ્રેજી', label: 'અંગ્રેજી', icon: 'menu-book' as const },
];

export default function VideoScreen() {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade = user?.grade || 'college';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode && user?.medium === 'Gujarati';

  const filterOptions = !isSchoolMode
    ? COLLEGE_FILTERS
    : isGSEB
    ? SCHOOL_GSEB_FILTERS
    : SCHOOL_CBSE_FILTERS;

  const [lectures, setLectures] = useState<VideoLecture[]>(VIDEO_LECTURES_DATA);
  const [activeLecture, setActiveLecture] = useState<VideoLecture>(VIDEO_LECTURES_DATA[0]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
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

  const toggleComplete = async (lectureId: string) => {
    let updated: string[];
    const isNowComplete = !completedLectureIds.includes(lectureId);

    if (completedLectureIds.includes(lectureId)) {
      updated = completedLectureIds.filter((id) => id !== lectureId);
    } else {
      updated = [...completedLectureIds, lectureId];
      if (updated.length === lectures.length) {
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
              {lectures.length} lessons • {isSchoolMode ? `${user?.board || 'CBSE'} Board (${user?.medium || 'English'})` : 'Campus Placement Track'}
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
                      ? 'Lesson Completed ✓ (Tap to Undo)'
                      : 'Mark Lesson as Completed'}
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
                  Course Completion Progress
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

          {/* Dynamic Course Playlist with completed checkmarks */}
          <UpNextList
            lectures={lectures}
            activeLectureId={activeLecture?.id || ''}
            completedLectureIds={completedLectureIds}
            onSelectLecture={(lec) => setActiveLecture(lec)}
            onToggleComplete={toggleComplete}
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
