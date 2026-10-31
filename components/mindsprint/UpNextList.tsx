import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '../../constants/mindsprintTheme';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { VideoLecture } from '@/constants/videoData';

interface UpNextListProps {
  lectures: VideoLecture[];
  allLectures?: VideoLecture[];
  totalChaptersCount?: number;
  activeLectureId: string;
  completedLectureIds: string[];
  isSequentialMode?: boolean;
  onToggleSequentialMode?: () => void;
  onSelectLecture: (lecture: VideoLecture) => void;
  onToggleComplete: (lectureId: string) => void;
  remainingLockedCount?: number;
  nextLockedTitle?: string;
  isLectureUnlocked?: (lecture: VideoLecture) => boolean;
}

export const UpNextList: React.FC<UpNextListProps> = ({
  lectures,
  allLectures,
  totalChaptersCount,
  activeLectureId,
  completedLectureIds,
  isSequentialMode = true,
  onToggleSequentialMode,
  onSelectLecture,
  onToggleComplete,
  remainingLockedCount = 0,
  nextLockedTitle,
  isLectureUnlocked = () => true,
}) => {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const isGujarati = user?.grade !== 'college';
  const totalCount = totalChaptersCount || lectures.length;
  const completedCount = completedLectureIds.filter((id) =>
    (allLectures || lectures).some((l) => l.id === id)
  ).length;

  const handlePressLecture = (item: VideoLecture) => {
    const unlocked = isLectureUnlocked(item);
    if (!unlocked) {
      Alert.alert(
        isGujarati ? '🔒 પ્રકરણ લૉક છે' : '🔒 Chapter Locked',
        isGujarati
          ? `આ પ્રકરણ જોવા માટે કૃપા કરીને અગાઉનું પ્રકરણ પૂર્ણ કરો.`
          : `Please complete the previous chapter to unlock this lesson.`
      );
      return;
    }
    onSelectLecture(item);
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="playlist-play" size={22} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            {isGujarati ? 'અભ્યાસક્રમ પ્લેલિસ્ટ' : 'Course Playlist'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {/* Mode Switcher Pill */}
          {onToggleSequentialMode && (
            <TouchableOpacity
              activeOpacity={0.75}
              style={[
                styles.modeTogglePill,
                {
                  backgroundColor: isSequentialMode
                    ? isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7'
                    : isDarkMode ? colors.surfaceContainerLow : '#f1f5f9',
                  borderColor: isSequentialMode ? '#f59e0b' : colors.outlineVariant,
                },
              ]}
              onPress={onToggleSequentialMode}
            >
              <MaterialIcons
                name={isSequentialMode ? 'lock-outline' : 'lock-open'}
                size={13}
                color={isSequentialMode ? '#d97706' : colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.modeToggleText,
                  { color: isSequentialMode ? '#d97706' : colors.onSurfaceVariant },
                ]}
              >
                {isSequentialMode
                  ? isGujarati ? 'ક્રમિક (Sequential)' : 'Sequential'
                  : isGujarati ? 'બધા (All)' : 'All'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Completion Count Badge */}
          <View
            style={[
              styles.countBadge,
              { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.15)' : '#eef2ff' },
            ]}
          >
            <Text style={[styles.countText, { color: colors.primary }]}>
              {completedCount}/{totalCount} {isGujarati ? 'પૂર્ણ' : 'Completed'}
            </Text>
          </View>
        </View>
      </View>

      {/* Sequential Notice Banner when sequential unlock is active */}
      {isSequentialMode && (
        <View
          style={[
            styles.modeInfoBanner,
            {
              backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.12)' : '#eff6ff',
              borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe',
            },
          ]}
        >
          <MaterialIcons name="auto-awesome" size={16} color={colors.primary} />
          <Text style={[styles.modeInfoText, { color: colors.primary }]}>
            {isGujarati
              ? '✨ ૧લું પ્રકરણ પૂર્ણ કરતાં ૨જું ખૂલશે, અને ૨જું પૂર્ણ કરતાં ૩જું ખૂલશે.'
              : '✨ Complete each chapter to automatically reveal and unlock the next lesson.'}
          </Text>
        </View>
      )}

      {/* Lecture Cards */}
      <View style={styles.list}>
        {lectures.map((item, index) => {
          const isActive = item.id === activeLectureId;
          const isCompleted = completedLectureIds.includes(item.id);
          const unlocked = isLectureUnlocked(item);
          const displayTitle = (isGujarati && item.titleGujarati) ? item.titleGujarati : item.title;
          const displayInstructor = (isGujarati && item.instructorGujarati) ? item.instructorGujarati : item.instructor;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => handlePressLecture(item)}
              style={[
                styles.itemCard,
                {
                  backgroundColor: isActive
                    ? isDarkMode ? 'rgba(129,140,248,0.08)' : 'rgba(30,0,169,0.04)'
                    : isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                  borderColor: isActive ? colors.primary : isDarkMode ? colors.outlineVariant : '#e5e7eb',
                  borderWidth: isActive ? 1.5 : 1,
                  opacity: unlocked ? 1 : 0.65,
                },
                !isActive && MindSprintShadows.card,
              ]}
            >
              {/* Lesson Number or Checkmark Circle */}
              <TouchableOpacity
                onPress={() => {
                  if (unlocked) onToggleComplete(item.id);
                  else handlePressLecture(item);
                }}
                style={[
                  styles.lessonNumCircle,
                  {
                    backgroundColor: !unlocked
                      ? isDarkMode ? '#334155' : '#cbd5e1'
                      : isCompleted
                      ? '#10b981'
                      : isActive
                      ? colors.primary
                      : isDarkMode ? colors.surfaceContainerHigh : '#f1f5f9',
                  },
                ]}
              >
                {!unlocked ? (
                  <MaterialIcons name="lock" size={14} color="#64748b" />
                ) : isCompleted ? (
                  <MaterialIcons name="check" size={16} color="#ffffff" />
                ) : isActive ? (
                  <MaterialIcons name="equalizer" size={16} color="#ffffff" />
                ) : (
                  <Text style={[styles.lessonNumText, { color: colors.onSurfaceVariant }]}>
                    {item.chapterNumber || index + 1}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Thumbnail */}
              <View style={styles.thumbnailBox}>
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={styles.thumbImage}
                  resizeMode="cover"
                />
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
                {!unlocked && (
                  <View style={styles.lockedOverlay}>
                    <MaterialIcons name="lock" size={20} color="#ffffff" />
                  </View>
                )}
                {isActive && unlocked && (
                  <View style={styles.playingOverlay}>
                    <MaterialIcons name="play-arrow" size={22} color="#ffffff" />
                  </View>
                )}
              </View>

              {/* Meta Content */}
              <View style={styles.metaContent}>
                <Text style={[styles.videoTitle, { color: colors.onSurface }]} numberOfLines={2}>
                  {displayTitle}
                </Text>
                <View style={styles.metaBottom}>
                  <Text style={[styles.channelName, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                    {displayInstructor}
                  </Text>
                  {isCompleted && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>
                        {isGujarati ? 'પૂર્ણ ✓' : 'COMPLETED ✓'}
                      </Text>
                    </View>
                  )}
                  {!unlocked && (
                    <View style={styles.lockedBadge}>
                      <Text style={styles.lockedBadgeText}>
                        {isGujarati ? '🔒 લૉક' : '🔒 LOCKED'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lock Notice Card below list when more chapters remain locked */}
      {isSequentialMode && remainingLockedCount > 0 && (
        <View
          style={[
            styles.nextUnlockNoticeCard,
            {
              backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb',
              borderColor: isDarkMode ? 'rgba(245, 158, 11, 0.25)' : '#fde68a',
            },
          ]}
        >
          <View style={styles.lockNoticeIconCircle}>
            <MaterialIcons name="lock" size={18} color="#d97706" />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.nextUnlockTitle, { color: isDarkMode ? '#fde68a' : '#92400e' }]}>
              {nextLockedTitle
                ? `${isGujarati ? 'આગળનું પ્રકરણ' : 'Next Chapter'}: ${nextLockedTitle}`
                : isGujarati
                ? 'હાલનું પ્રકરણ પૂર્ણ કરતાં આગળનું પ્રકરણ અનલૉક થશે'
                : 'Complete the active lesson to reveal next chapter'}
            </Text>
            <Text style={[styles.nextUnlockSub, { color: isDarkMode ? '#cbd5e1' : '#b45309' }]}>
              {isGujarati
                ? `🔒 કુલ ${remainingLockedCount} વધુ પ્રકરણો ક્રમશઃ ખૂલશે (બધા જોવા માટે ઉપર 'બધા' ટેપ કરો)`
                : `🔒 ${remainingLockedCount} more chapters will unlock sequentially (tap 'All' above to view all)`}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  modeTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  modeToggleText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modeInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  modeInfoText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  list: {
    gap: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    gap: 10,
  },
  lessonNumCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumText: {
    fontSize: 12,
    fontWeight: '800',
  },
  thumbnailBox: {
    width: 88,
    height: 56,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  playingOverlay: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'rgba(30, 0, 169, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedOverlay: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  metaContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  videoTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 17,
  },
  metaBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  channelName: {
    fontSize: 11,
    fontWeight: '400',
    flexShrink: 1,
  },
  completedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  completedBadgeText: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: '800',
  },
  lockedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lockedBadgeText: {
    color: '#ef4444',
    fontSize: 9,
    fontWeight: '800',
  },
  nextUnlockNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  lockNoticeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextUnlockTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  nextUnlockSub: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15,
  },
});
