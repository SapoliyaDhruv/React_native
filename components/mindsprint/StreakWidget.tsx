import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '../../constants/mindsprintTheme';
import { useTheme } from '../../context/ThemeContext';

type DayItem = {
  day: string;
  status: 'completed' | 'active' | 'locked';
};

const daysData: DayItem[] = [
  { day: 'Mon', status: 'completed' },
  { day: 'Tue', status: 'completed' },
  { day: 'Wed', status: 'active' },
  { day: 'Thu', status: 'locked' },
  { day: 'Fri', status: 'locked' },
  { day: 'Sat', status: 'locked' },
  { day: 'Sun', status: 'locked' },
];

interface StreakWidgetProps {
  streakCount?: number;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ streakCount = 1 }) => {
  const { colors } = useTheme();
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

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.onSurface }]}>Your Daily Streak</Text>
        <View style={styles.flamePill}>
          <Animated.View style={{ transform: [{ scale: flamePulse }] }}>
            <MaterialIcons name="local-fire-department" size={20} color="#f59e0b" />
          </Animated.View>
          <Text style={styles.flameText}>{streakCount} Day Streak 🔥</Text>
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
              <View key={index} style={[styles.dayCard, styles.activeCard, MindSprintShadows.glow]}>
                <Text style={styles.activeDayText}>{item.day}</Text>
                <Animated.View style={{ transform: [{ scale: flamePulse }] }}>
                  <MaterialIcons name="local-fire-department" size={24} color="#ffffff" />
                </Animated.View>
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
    height: 80,
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
    backgroundColor: '#3525cd',
    borderColor: '#3525cd',
    position: 'relative',
  },
  normalDayText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  activeDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  activeDot: {
    position: 'absolute',
    bottom: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
});
