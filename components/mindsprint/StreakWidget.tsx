import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '../../constants/mindsprintTheme';
import { useTheme } from '../../context/ThemeContext';

export type DayItem = {
  day: string;
  dateNum: number;
  status: 'completed' | 'active' | 'locked';
};

export interface StreakWidgetProps {
  streakCount?: number;
  recentActivity?: Array<{
    createdAt?: string;
    completedAt?: string;
    scorePercentage?: number;
  }>;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({
  streakCount = 1,
  recentActivity = [],
}) => {
  const { colors, isDarkMode } = useTheme();
  const [flamePulse] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(flamePulse, {
          toValue: 1.18,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(flamePulse, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnim.start();

    return () => pulseAnim.stop();
  }, [flamePulse]);

  // Dynamically compute the current week (Monday to Sunday) based on real date
  const daysData: DayItem[] = useMemo(() => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    // Monday-based index: 0 = Mon, 1 = Tue, 2 = Wed, 3 = Thu, 4 = Fri, 5 = Sat, 6 = Sun
    const currentDayOfWeek = (now.getDay() + 6) % 7;
    const todayStr = now.toISOString().split('T')[0];

    // Monday of the current week
    const mondayDate = new Date(now);
    mondayDate.setDate(now.getDate() - currentDayOfWeek);
    mondayDate.setHours(0, 0, 0, 0);

    // Set of ISO dates on which user completed assessments
    const activityDates = new Set<string>();
    if (Array.isArray(recentActivity)) {
      recentActivity.forEach((act) => {
        const d = act.createdAt || act.completedAt;
        if (d) {
          try {
            const dateOnly = new Date(d).toISOString().split('T')[0];
            activityDates.add(dateOnly);
          } catch (_) {}
        }
      });
    }

    const hasStudiedToday = activityDates.has(todayStr);

    return dayNames.map((dayName, idx) => {
      const dayDate = new Date(mondayDate);
      dayDate.setDate(mondayDate.getDate() + idx);
      const dateNum = dayDate.getDate();
      const dateStr = dayDate.toISOString().split('T')[0];

      let status: 'completed' | 'active' | 'locked';

      if (idx === currentDayOfWeek) {
        status = 'active';
      } else if (idx < currentDayOfWeek) {
        const daysAgo = currentDayOfWeek - idx;
        const isCoveredByStreak = streakCount > daysAgo || (streakCount >= daysAgo && hasStudiedToday);
        status = activityDates.has(dateStr) || isCoveredByStreak ? 'completed' : 'locked';
      } else {
        status = 'locked';
      }

      return {
        day: dayName,
        dateNum,
        status,
      };
    });
  }, [streakCount, recentActivity]);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.onSurface }]}>Your Daily Streak</Text>
        <View style={styles.flamePill}>
          <Animated.View style={{ transform: [{ scale: flamePulse }] }}>
            <MaterialIcons name="local-fire-department" size={20} color="#f59e0b" />
          </Animated.View>
          <Text style={styles.flameText}>
            {streakCount > 1 ? `${streakCount} Day Streak 🔥` : '1 Day Streak 🔥'}
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {daysData.map((item, index) => {
          if (item.status === 'active') {
            return (
              <View
                key={index}
                style={[
                  styles.dayCard,
                  styles.activeCard,
                  { backgroundColor: colors.primary, borderColor: colors.primary },
                  MindSprintShadows.glow,
                ]}
              >
                <Text style={styles.activeDayText}>{item.day}</Text>
                <Animated.View style={{ transform: [{ scale: flamePulse }] }}>
                  <MaterialIcons name="local-fire-department" size={24} color="#ffffff" />
                </Animated.View>
                <Text style={styles.activeDateSubText}>{item.dateNum}</Text>
                <View style={styles.activeDot} />
              </View>
            );
          }

          const isLocked = item.status === 'locked';

          return (
            <View
              key={index}
              style={[
                styles.dayCard,
                {
                  backgroundColor: colors.surfaceContainerLowest,
                  borderColor: colors.outlineVariant,
                },
                styles.normalCardBorder,
                isLocked && styles.lockedCard,
              ]}
            >
              <Text style={[styles.normalDayText, { color: colors.onSurface }]}>
                {item.day}
              </Text>
              <MaterialIcons
                name={isLocked ? 'lock' : 'check-circle'}
                size={22}
                color={isLocked ? colors.outline : colors.primary}
              />
              <Text style={[styles.normalDateSubText, { color: colors.onSurfaceVariant }]}>
                {item.dateNum}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  flamePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  flameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  scrollContent: {
    gap: 12,
    paddingRight: 16,
  },
  dayCard: {
    width: 64,
    height: 86,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalCardBorder: {
    borderWidth: 1,
  },
  lockedCard: {
    opacity: 0.5,
  },
  activeCard: {
    position: 'relative',
  },
  normalDayText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  activeDayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  normalDateSubText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
    opacity: 0.8,
  },
  activeDateSubText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
    opacity: 0.9,
  },
  activeDot: {
    position: 'absolute',
    bottom: 5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ffffff',
  },
});

