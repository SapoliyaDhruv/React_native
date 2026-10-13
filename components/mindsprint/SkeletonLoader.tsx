import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, DimensionValue, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface SkeletonBoxProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const { isDarkMode } = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacityAnim]);

  const baseColor = isDarkMode ? '#334155' : '#e2e8f0';

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

// Shimmer layout for Dashboard / Home screen
export const DashboardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Profile Bar */}
      <View style={styles.rowBetween}>
        <View style={{ gap: 8, flex: 1 }}>
          <SkeletonBox width={140} height={16} borderRadius={6} />
          <SkeletonBox width={200} height={24} borderRadius={8} />
        </View>
        <SkeletonBox width={44} height={44} borderRadius={22} />
      </View>

      {/* Streak Banner Skeleton */}
      <SkeletonBox width="100%" height={90} borderRadius={18} style={{ marginVertical: 16 }} />

      {/* Quick Actions Grid */}
      <View style={styles.gridRow}>
        <SkeletonBox width="48%" height={100} borderRadius={16} />
        <SkeletonBox width="48%" height={100} borderRadius={16} />
      </View>

      {/* Performance Section */}
      <SkeletonBox width={180} height={20} borderRadius={6} style={{ marginTop: 24, marginBottom: 12 }} />
      <SkeletonBox width="100%" height={180} borderRadius={20} />

      {/* Recent Activity */}
      <SkeletonBox width={160} height={20} borderRadius={6} style={{ marginTop: 24, marginBottom: 12 }} />
      <SkeletonBox width="100%" height={72} borderRadius={16} style={{ marginBottom: 10 }} />
      <SkeletonBox width="100%" height={72} borderRadius={16} />
    </View>
  );
};

// Shimmer layout for Courses / Tracks screen
export const CourseListSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SkeletonBox width={220} height={26} borderRadius={8} style={{ marginBottom: 16 }} />
      <SkeletonBox width="100%" height={40} borderRadius={20} style={{ marginBottom: 20 }} />

      {[1, 2, 3].map((item) => (
        <View key={item} style={{ marginBottom: 16 }}>
          <SkeletonBox width="100%" height={130} borderRadius={18} />
        </View>
      ))}
    </View>
  );
};

// Shimmer layout for Video Masterclasses screen
export const VideoScreenSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 16:9 Video Box */}
      <SkeletonBox width="100%" height={210} borderRadius={14} style={{ marginBottom: 16 }} />

      {/* Video Details */}
      <SkeletonBox width={100} height={18} borderRadius={6} style={{ marginBottom: 8 }} />
      <SkeletonBox width="90%" height={24} borderRadius={8} style={{ marginBottom: 8 }} />
      <SkeletonBox width={160} height={16} borderRadius={6} style={{ marginBottom: 20 }} />

      {/* Tabs */}
      <View style={[styles.rowBetween, { marginBottom: 20 }]}>
        <SkeletonBox width="30%" height={32} borderRadius={10} />
        <SkeletonBox width="30%" height={32} borderRadius={10} />
        <SkeletonBox width="30%" height={32} borderRadius={10} />
      </View>

      {/* Playlist Items */}
      <SkeletonBox width={180} height={20} borderRadius={6} style={{ marginBottom: 12 }} />
      {[1, 2, 3].map((i) => (
        <SkeletonBox key={i} width="100%" height={76} borderRadius={14} style={{ marginBottom: 10 }} />
      ))}
    </View>
  );
};

// Shimmer layout for Exam Question screen
export const ExamSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.rowBetween, { marginBottom: 20 }]}>
        <SkeletonBox width={100} height={32} borderRadius={10} />
        <SkeletonBox width={120} height={32} borderRadius={10} />
      </View>

      <SkeletonBox width="100%" height={10} borderRadius={5} style={{ marginBottom: 24 }} />

      <SkeletonBox width="100%" height={110} borderRadius={16} style={{ marginBottom: 24 }} />

      {[1, 2, 3, 4].map((i) => (
        <SkeletonBox key={i} width="100%" height={56} borderRadius={14} style={{ marginBottom: 12 }} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
