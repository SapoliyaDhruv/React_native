import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '../../constants/mindsprintTheme';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Question } from '../../constants/mindsprintData';

interface WeakSpotAnalyzerProps {
  questions: Question[];
  userAnswers: Record<number, number>;
}

export const WeakSpotAnalyzer: React.FC<WeakSpotAnalyzerProps> = ({
  questions,
  userAnswers,
}) => {
  const router = useRouter();
  const { colors } = useTheme();
  const { tr } = useLanguage();

  // Group performance by category
  const categoryStats: Record<string, { correct: number; total: number }> = {};

  questions.forEach((q, idx) => {
    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { correct: 0, total: 0 };
    }
    categoryStats[q.category].total += 1;
    if (userAnswers[idx] === q.correctAnswer) {
      categoryStats[q.category].correct += 1;
    }
  });

  const categoryList = Object.keys(categoryStats).map((cat) => {
    const stat = categoryStats[cat];
    const percent = Math.round((stat.correct / stat.total) * 100);
    return {
      category: cat,
      correct: stat.correct,
      total: stat.total,
      percent,
      isWeak: percent < 60,
      isStrong: percent >= 80,
    };
  });

  const weakCategories = categoryList.filter((item) => item.isWeak);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryFixed }]}>
          <MaterialIcons name="psychology" size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            {tr('Score by topic', 'વિષય પ્રમાણે ગુણ')}
          </Text>
          <Text style={[styles.sectionSub, { color: colors.onSurfaceVariant }]}>
            {tr('Where you did well and what to practise', 'ક્યાં સારું કર્યું અને શું પ્રેક્ટિસ કરવી')}
          </Text>
        </View>
      </View>

      {/* Category Performance Bars */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surfaceContainerLowest,
            borderColor: colors.outlineVariant,
          },
          MindSprintShadows.card,
        ]}
      >
        {categoryList.map((item, idx) => {
          let barColor = colors.primary;
          let badgeColor = colors.primary;
          let badgeText = tr('Okay', 'ઠીક');

          if (item.isStrong) {
            barColor = colors.tertiary;
            badgeColor = colors.tertiary;
            badgeText = tr('Strong', 'મજબૂત');
          } else if (item.isWeak) {
            barColor = colors.error;
            badgeColor = colors.error;
            badgeText = tr('Needs practice', 'પ્રેક્ટિસ જરૂરી');
          }

          return (
            <View
              key={item.category}
              style={[
                styles.categoryRow,
                idx < categoryList.length - 1 && [styles.borderBottom, { borderBottomColor: colors.outlineVariant }],
              ]}
            >
              <View style={styles.catHeader}>
                <Text style={[styles.catName, { color: colors.onSurface }]}>{item.category}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={[styles.statusBadge, { backgroundColor: badgeColor + '20' }]}>
                    <Text style={[styles.statusBadgeText, { color: badgeColor }]}>{badgeText}</Text>
                  </View>
                  <Text style={[styles.catPercent, { color: barColor }]}>
                    {item.percent}% ({item.correct}/{item.total})
                  </Text>
                </View>
              </View>

              <View style={[styles.trackBar, { backgroundColor: colors.surfaceContainer }]}>
                <View
                  style={[
                    styles.fillBar,
                    { width: `${Math.max(item.percent, 8)}%` as any, backgroundColor: barColor },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Weak Spot Actionable Recommendations */}
      {weakCategories.length > 0 && (
        <View style={styles.recommendationBox}>
          <View style={styles.recommendHeader}>
            <MaterialIcons name="auto-fix-high" size={20} color={colors.primary} />
            <Text style={[styles.recommendTitle, { color: colors.primary }]}>
              {tr('What to practise next', 'હવે શું પ્રેક્ટિસ કરવી')}
            </Text>
          </View>

          {weakCategories.map((weak) => (
            <View
              key={weak.category}
              style={[
                styles.weakItemCard,
                {
                  backgroundColor: colors.surfaceContainerLowest,
                  borderColor: colors.outlineVariant,
                },
                MindSprintShadows.card,
              ]}
            >
              <View style={styles.weakTextContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MaterialIcons name="flag" size={18} color={colors.error} />
                  <Text style={[styles.weakAlertTitle, { color: colors.onSurface }]}>
                    {weak.category}
                  </Text>
                </View>
                <Text style={[styles.weakSubText, { color: colors.onSurfaceVariant }]}>
                  {tr(
                    `You got ${weak.correct} of ${weak.total} right. Watch the lesson, then try the flashcards.`,
                    `તમારા ${weak.total} માંથી ${weak.correct} સાચા. પહેલા વિડિયો જુઓ, પછી ફ્લેશકાર્ડ કરો.`
                  )}
                </Text>
              </View>

              {/* 2 Action Buttons: Watch Video & Review Formulas */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/(tabs)/video')}
                >
                  <MaterialIcons name="play-circle-filled" size={16} color={colors.onPrimary} />
                  <Text style={[styles.actionBtnText, { color: colors.onPrimary }]}>
                    {tr('Watch lesson', 'વિડિયો જુઓ')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryActionBtn, { borderColor: colors.outlineVariant }]}
                  onPress={() => router.push('/flashcards')}
                >
                  <MaterialIcons name="style" size={16} color={colors.primary} />
                  <Text style={[styles.secondaryActionBtnText, { color: colors.primary }]}>
                    {tr('Flashcards', 'ફ્લેશકાર્ડ')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: 12,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  categoryRow: {
    paddingVertical: 10,
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  catPercent: {
    fontSize: 13,
    fontWeight: '800',
  },
  trackBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fillBar: {
    height: '100%',
    borderRadius: 4,
  },
  recommendationBox: {
    marginTop: 16,
    gap: 10,
  },
  recommendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  recommendTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  weakItemCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  weakTextContent: {
    gap: 4,
  },
  weakAlertTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  weakSubText: {
    fontSize: 12,
    lineHeight: 17,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  secondaryActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
