import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows, MindSprintFonts } from '../../constants/mindsprintTheme';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface StatsCardProps {
  totalTests?: number;
  avgScore?: number;
  totalQuestions?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ totalTests = 0, avgScore = 0, totalQuestions = 0 }) => {
  const { colors } = useTheme();
  const { tr } = useLanguage();

  return (
    <View style={styles.grid}>
      {/* Mock Tests Completed Card */}
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
        <View style={styles.headerRow}>
          <View style={[styles.iconBox, { backgroundColor: colors.secondaryContainer }]}>
            <MaterialIcons name="quiz" size={18} color={colors.onSecondaryContainer} />
          </View>
          <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>{tr('Tests taken', 'આપેલા ટેસ્ટ')}</Text>
        </View>
        <View style={styles.valueRow}>
          <Text style={[styles.valueText, { color: colors.onSurface }]}>{totalTests}</Text>
          <Text style={[styles.subText, { color: colors.outline }]}>{tr('completed', 'પૂરા')}</Text>
        </View>
      </View>

      {/* Average Accuracy Card */}
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
        <View style={styles.headerRow}>
          <View style={[styles.iconBox, { backgroundColor: colors.tertiaryContainer }]}>
            <MaterialIcons name="analytics" size={18} color={colors.onTertiaryContainer} />
          </View>
          <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>{tr('Accuracy', 'ચોકસાઈ')}</Text>
        </View>
        <View style={styles.valueRow}>
          <Text style={[styles.valueText, { color: colors.onSurface }]}>{avgScore}%</Text>
          <Text style={[styles.subText, { color: colors.outline }]}>{tr('average', 'સરેરાશ')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 8,
  },
  valueText: {
    fontFamily: MindSprintFonts.display,
    fontSize: 28,
    lineHeight: 34,
  },
  subText: {
    fontSize: 12,
    fontWeight: '400',
  },
});
