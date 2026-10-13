import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '../../constants/mindsprintTheme';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { VideoLecture } from '@/constants/videoData';

interface UpNextListProps {
  lectures: VideoLecture[];
  activeLectureId: string;
  completedLectureIds: string[];
  onSelectLecture: (lecture: VideoLecture) => void;
  onToggleComplete: (lectureId: string) => void;
}

export const UpNextList: React.FC<UpNextListProps> = ({
  lectures,
  activeLectureId,
  completedLectureIds,
  onSelectLecture,
  onToggleComplete,
}) => {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const isGujarati = user?.grade !== 'college' && user?.medium === 'Gujarati';

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="playlist-play" size={22} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Course Playlist
          </Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.15)' : '#eef2ff' }]}>
          <Text style={[styles.countText, { color: colors.primary }]}>
            {completedLectureIds.length}/{lectures.length} Completed
          </Text>
        </View>
      </View>

      {/* Lecture Cards */}
      <View style={styles.list}>
        {lectures.map((item, index) => {
          const isActive = item.id === activeLectureId;
          const isCompleted = completedLectureIds.includes(item.id);
          const displayTitle = (isGujarati && item.titleGujarati) ? item.titleGujarati : item.title;
          const displayInstructor = (isGujarati && item.instructorGujarati) ? item.instructorGujarati : item.instructor;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => onSelectLecture(item)}
              style={[
                styles.itemCard,
                {
                  backgroundColor: isActive
                    ? isDarkMode ? 'rgba(129,140,248,0.08)' : 'rgba(30,0,169,0.04)'
                    : isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                  borderColor: isActive ? colors.primary : isDarkMode ? colors.outlineVariant : '#e5e7eb',
                  borderWidth: isActive ? 1.5 : 1,
                },
                !isActive && MindSprintShadows.card,
              ]}
            >
              {/* Lesson Number or Checkmark Circle */}
              <TouchableOpacity
                onPress={() => onToggleComplete(item.id)}
                style={[
                  styles.lessonNumCircle,
                  {
                    backgroundColor: isCompleted
                      ? '#10b981'
                      : isActive
                      ? colors.primary
                      : isDarkMode ? colors.surfaceContainerHigh : '#f1f5f9',
                  },
                ]}
              >
                {isCompleted ? (
                  <MaterialIcons name="check" size={16} color="#ffffff" />
                ) : isActive ? (
                  <MaterialIcons name="equalizer" size={16} color="#ffffff" />
                ) : (
                  <Text style={[styles.lessonNumText, { color: colors.onSurfaceVariant }]}>
                    {index + 1}
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
                {isActive && (
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
                      <Text style={styles.completedBadgeText}>COMPLETED ✓</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
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
  },
  channelName: {
    fontSize: 11,
    fontWeight: '400',
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
});
