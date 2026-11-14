import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows, MindSprintFonts } from '../../constants/mindsprintTheme';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

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
  const { tr } = useLanguage();

  const [activeTab, setActiveTab] = useState<'trend' | 'metrics'>('trend');

  const hasRealData = scoresHistory.length > 0;
  const displayScores = scoresHistory.slice(-6);

  const lastScore = displayScores[displayScores.length - 1] || 0;
  const firstScore = displayScores[0] || 0;
  const diff = lastScore - firstScore;
  const isPositiveTrend = diff >= 0;

  const maxScore = Math.max(...displayScores);
  const avgScore = Math.round(displayScores.reduce((a, b) => a + b, 0) / displayScores.length);

  // No tests yet: show an honest empty state instead of made-up sample scores.
  if (!hasRealData) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.onSurface }]}>
          {tr('Your accuracy trend', 'તમારી પ્રગતિ')}
        </Text>
        <View
          style={[
            styles.chartCard,
            styles.emptyCard,
            { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant },
          ]}
        >
          <MaterialIcons name="insights" size={28} color={colors.primary} />
          <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
            {tr('No test scores yet. Take a quick test and your accuracy trend will appear here.', 'હજુ કોઈ ટેસ્ટ આપ્યો નથી. એક ઝડપી ટેસ્ટ આપો અને અહીં તમારી પ્રગતિ જુઓ.')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            accessibilityRole="button"
            onPress={() => router.push('/exam?limit=10')}
            style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
          >
            <MaterialIcons name="play-arrow" size={18} color="#ffffff" />
            <Text style={styles.emptyBtnText}>{tr('Take a 10-question test', '10 પ્રશ્નોનો ટેસ્ટ આપો')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title & Trend Pill */}
      <View style={styles.titleRow}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: colors.onSurface }]}>
            {tr('Accuracy & performance', 'ચોકસાઈ અને પ્રદર્શન')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            {tr(`From your last ${scoresHistory.length} tests`, `તમારા છેલ્લા ${scoresHistory.length} ટેસ્ટ પરથી`)}
          </Text>
        </View>

        <View
          style={[
            styles.trendPill,
            { backgroundColor: isPositiveTrend ? 'rgba(18, 128, 92, 0.15)' : 'rgba(200, 55, 45, 0.15)' },
          ]}
        >
          <MaterialIcons
            name={isPositiveTrend ? 'trending-up' : 'trending-down'}
            size={16}
            color={isPositiveTrend ? '#12805C' : '#C8372D'}
          />
          <Text
            style={[
              styles.trendPillText,
              { color: isPositiveTrend ? '#0B5C42' : '#8E2219' },
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
        <View style={[styles.tabBar, { backgroundColor: isDarkMode ? colors.surfaceContainerHigh : '#EEF2F8' }]}>
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
              {tr('Trend', 'વલણ')}
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
              {tr('Key numbers', 'મુખ્ય આંકડા')}
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
                  barColor = '#12805C';
                  badgeBg = '#12805C';
                } else if (score < 50) {
                  barColor = '#C8372D';
                  badgeBg = '#C8372D';
                } else {
                  barColor = '#F4A30B';
                  badgeBg = '#F4A30B';
                }

                return (
                  <View key={index} style={styles.columnWrapper}>
                    {/* Tooltip Score Tag */}
                    <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                      <Text style={styles.badgeText}>{score}%</Text>
                    </View>

                    {/* Bar Pillar */}
                    <View style={[styles.barTrack, { backgroundColor: isDarkMode ? colors.surfaceContainerHigh : '#EEF2F8' }]}>
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
                      {isLast ? tr('Latest', 'છેલ્લો') : `T${index + 1}`}
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
              <View style={[styles.metricCard, { backgroundColor: colors.tertiaryContainer, borderColor: colors.tertiary }]}>
                <MaterialIcons name="military-tech" size={24} color={colors.tertiary} />
                <Text style={[styles.metricValue, { color: colors.onTertiaryContainer }]}>{maxScore}%</Text>
                <Text style={styles.metricLabel}>{tr('Best score', 'શ્રેષ્ઠ ગુણ')}</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: colors.primaryFixed, borderColor: colors.primary }]}>
                <MaterialIcons name="analytics" size={24} color={colors.primary} />
                <Text style={[styles.metricValue, { color: colors.primary }]}>{avgScore}%</Text>
                <Text style={styles.metricLabel}>{tr('Average', 'સરેરાશ')}</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: colors.accentContainer, borderColor: colors.accent }]}>
                <MaterialIcons name="bolt" size={24} color={colors.accent} />
                <Text style={[styles.metricValue, { color: colors.onAccentContainer }]}>{lastScore}%</Text>
                <Text style={styles.metricLabel}>{tr('Latest test', 'છેલ્લો ટેસ્ટ')}</Text>
              </View>
            </View>

            {/* Quick Action Button to take exam */}
            <TouchableOpacity
              style={[styles.takeTestShortcutBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/exam?limit=10')}
            >
              <MaterialIcons name="quiz" size={18} color="#ffffff" />
              <Text style={styles.takeTestShortcutText}>
                {tr('Take a 10-question test', '10 પ્રશ્નોનો ટેસ્ટ આપો')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyCard: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 22,
  },
  emptyText: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 300,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 4,
  },
  emptyBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
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
    fontFamily: MindSprintFonts.heading,
    fontSize: 20,
    lineHeight: 26,
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
    color: '#5A6680',
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
