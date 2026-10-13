import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '../../constants/mindsprintTheme';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface PerformanceChartProps {
  scoresHistory?: number[];
  recentActivity?: Array<{
    title: string;
    scorePercentage: number;
    completedAt?: string;
    category?: string;
  }>;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  scoresHistory = [],
  recentActivity = [],
}) => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade = user?.grade || 'college';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode && user?.medium === 'Gujarati';

  const [activeTab, setActiveTab] = useState<'trend' | 'metrics'>('trend');

  const hasRealData = scoresHistory.length > 0;
  const displayScores = hasRealData
    ? scoresHistory.slice(-6)
    : [50, 60, 65, 75, 70, 85]; // Preview benchmark

  const lastScore = displayScores[displayScores.length - 1] || 0;
  const firstScore = displayScores[0] || 0;
  const diff = lastScore - firstScore;
  const isPositiveTrend = diff >= 0;

  const maxScore = Math.max(...displayScores);
  const avgScore = Math.round(displayScores.reduce((a, b) => a + b, 0) / displayScores.length);

  return (
    <View style={styles.container}>
      {/* Title & Trend Pill */}
      <View style={styles.titleRow}>
        <View>
          <Text style={[styles.title, { color: colors.onSurface }]}>
            📊 Accuracy & Performance Curve
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            {hasRealData
              ? `Analyzed from your last ${scoresHistory.length} assessments`
              : 'Benchmark curve • Take tests to track real progress'}
          </Text>
        </View>

        <View
          style={[
            styles.trendPill,
            { backgroundColor: isPositiveTrend ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' },
          ]}
        >
          <MaterialIcons
            name={isPositiveTrend ? 'trending-up' : 'trending-down'}
            size={16}
            color={isPositiveTrend ? '#10b981' : '#ef4444'}
          />
          <Text
            style={[
              styles.trendPillText,
              { color: isPositiveTrend ? '#065f46' : '#991b1b' },
            ]}
          >
            {isPositiveTrend ? `+${diff}%` : `${diff}%`}
          </Text>
        </View>
      </View>

      {/* Main Chart Container Card */}
      <View
        style={[
          styles.chartCard,
          {
            backgroundColor: colors.surfaceContainerLowest,
            borderColor: colors.outlineVariant,
          },
          MindSprintShadows.card,
        ]}
      >
        {/* Toggle Tabs */}
        <View style={[styles.tabBar, { backgroundColor: isDarkMode ? colors.surfaceContainerHigh : '#f1f5f9' }]}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'trend' && {
                backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff',
                ...MindSprintShadows.card,
              },
            ]}
            onPress={() => setActiveTab('trend')}
          >
            <MaterialIcons
              name="bar-chart"
              size={16}
              color={activeTab === 'trend' ? colors.primary : colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'trend' ? colors.primary : colors.onSurfaceVariant },
              ]}
            >
              Trend Chart
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'metrics' && {
                backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff',
                ...MindSprintShadows.card,
              },
            ]}
            onPress={() => setActiveTab('metrics')}
          >
            <MaterialIcons
              name="insights"
              size={16}
              color={activeTab === 'metrics' ? colors.primary : colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'metrics' ? colors.primary : colors.onSurfaceVariant },
              ]}
            >
              Key Metrics
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'trend' ? (
          /* ======================================================== */
          /* VERTICAL BAR CHART WITH GRID & PILL TOOLTIPS             */
          /* ======================================================== */
          <View style={styles.gridContainer}>
            {/* Reference Grid Lines */}
            <View style={styles.gridLines}>
              <View style={styles.gridLineRow}>
                <Text style={[styles.axisLabel, { color: colors.outline }]}>100%</Text>
                <View style={[styles.line, { backgroundColor: colors.outlineVariant }]} />
              </View>
              <View style={styles.gridLineRow}>
                <Text style={[styles.axisLabel, { color: colors.outline }]}>50%</Text>
                <View style={[styles.line, { backgroundColor: colors.outlineVariant }]} />
              </View>
              <View style={styles.gridLineRow}>
                <Text style={[styles.axisLabel, { color: colors.outline }]}>0%</Text>
                <View style={[styles.line, { backgroundColor: colors.outlineVariant }]} />
              </View>
            </View>

            {/* Bar Columns */}
            <View style={styles.barsContainer}>
              {displayScores.map((score, index) => {
                const isLast = index === displayScores.length - 1;
                const barHeight = `${Math.max(score, 14)}%`;

                let barColor = colors.primary;
                let badgeBg = colors.primary;

                if (score >= 75) {
                  barColor = '#10b981';
                  badgeBg = '#10b981';
                } else if (score < 50) {
                  barColor = '#ef4444';
                  badgeBg = '#ef4444';
                } else {
                  barColor = '#f59e0b';
                  badgeBg = '#f59e0b';
                }

                return (
                  <View key={index} style={styles.columnWrapper}>
                    {/* Tooltip Score Tag */}
                    <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                      <Text style={styles.badgeText}>{score}%</Text>
                    </View>

                    {/* Bar Pillar */}
                    <View style={[styles.barTrack, { backgroundColor: isDarkMode ? colors.surfaceContainerHigh : '#f1f5f9' }]}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: barHeight as any,
                            backgroundColor: barColor,
                            opacity: isLast ? 1 : 0.8,
                          },
                        ]}
                      />
                    </View>

                    {/* X-Axis Tag */}
                    <Text
                      style={[
                        styles.xLabel,
                        {
                          color: isLast ? colors.primary : colors.onSurfaceVariant,
                          fontWeight: isLast ? '800' : '600',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {isLast ? 'Latest' : `T${index + 1}`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          /* ======================================================== */
          /* KEY METRICS BREAKDOWN VIEW                               */
          /* ======================================================== */
          <View style={styles.metricsContainer}>
            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.12)' : '#ecfdf5', borderColor: '#10b981' }]}>
                <MaterialIcons name="military-tech" size={24} color="#10b981" />
                <Text style={[styles.metricValue, { color: '#065f46' }]}>{maxScore}%</Text>
                <Text style={styles.metricLabel}>Personal Best</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.12)' : '#eef2ff', borderColor: colors.primary }]}>
                <MaterialIcons name="analytics" size={24} color={colors.primary} />
                <Text style={[styles.metricValue, { color: colors.primary }]}>{avgScore}%</Text>
                <Text style={styles.metricLabel}>Average Accuracy</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.12)' : '#fef3c7', borderColor: '#f59e0b' }]}>
                <MaterialIcons name="bolt" size={24} color="#f59e0b" />
                <Text style={[styles.metricValue, { color: '#b45309' }]}>{lastScore}%</Text>
                <Text style={styles.metricLabel}>Latest Attempt</Text>
              </View>
            </View>

            {/* Quick Action Button to take exam */}
            <TouchableOpacity
              style={[styles.takeTestShortcutBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/exam?limit=10')}
            >
              <MaterialIcons name="quiz" size={18} color="#ffffff" />
              <Text style={styles.takeTestShortcutText}>
                Launch New 10-Question Drill 🎯
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  trendPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  chartCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 9,
    gap: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  gridContainer: {
    height: 180,
    position: 'relative',
    justifyContent: 'flex-end',
    paddingTop: 24,
    paddingBottom: 4,
  },
  gridLines: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 24,
    bottom: 24,
    justifyContent: 'space-between',
  },
  gridLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  axisLabel: {
    fontSize: 10,
    fontWeight: '600',
    width: 32,
    textAlign: 'right',
  },
  line: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingLeft: 40,
    height: '100%',
  },
  columnWrapper: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    width: 36,
  },
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  barTrack: {
    width: 14,
    height: 105,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  xLabel: {
    fontSize: 11,
    marginTop: 6,
  },
  metricsContainer: {
    gap: 12,
    paddingVertical: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
  },
  takeTestShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    marginTop: 4,
  },
  takeTestShortcutText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
