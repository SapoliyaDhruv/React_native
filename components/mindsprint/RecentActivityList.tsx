import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

type ActivityItem = {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
  badgeText?: string;
  scoreText?: string;
};

export interface RecentActivityItem {
  id: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  createdAt: string;
}

interface RecentActivityListProps {
  items?: RecentActivityItem[];
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ items = [] }) => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.onSurface }]}>Recent Mock Exam Activity</Text>
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: colors.surfaceContainerLowest,
            borderColor: colors.outlineVariant,
          },
        ]}
      >
        {items.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <MaterialIcons name="assessment" size={32} color={colors.outline} />
            <Text style={{ marginTop: 8, color: colors.onSurfaceVariant, fontSize: 13 }}>
              No mock tests completed yet. Launch your first custom exam above!
            </Text>
          </View>
        ) : (
          items.map((item, index) => {
            const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent';
            const isPassed = item.scorePercentage >= 60;
            return (
              <TouchableOpacity
                key={item.id || index.toString()}
                activeOpacity={0.7}
                onPress={() => item.id && router.push(`/exam-review?resultId=${item.id}`)}
                style={[
                  styles.itemRow,
                  index < items.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.outlineVariant,
                  },
                ]}
              >
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceContainerHigh }]}>
                  <MaterialIcons
                    name={isPassed ? 'check-circle' : 'assignment'}
                    size={24}
                    color={isPassed ? '#10b981' : colors.primary}
                  />
                </View>

                <View style={styles.content}>
                  <Text style={[styles.itemTitle, { color: colors.onSurface }]}>
                    Mock Placement Test ({item.totalQuestions || 10} Qs)
                  </Text>
                  <Text style={[styles.itemSubtitle, { color: colors.onSurfaceVariant }]}>
                    {item.correctCount}/{item.totalQuestions} Correct • {dateStr}
                  </Text>
                </View>

                <Text style={[styles.scoreText, { color: isPassed ? '#10b981' : '#f59e0b' }]}>
                  {item.scorePercentage}%
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  cardContainer: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
