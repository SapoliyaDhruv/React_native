import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';

interface ExamFooterProps {
  currentIndex: number;
  totalQuestions: number;
  hasSelectedOption: boolean;
  isMarkedForReview: boolean;
  onToggleReview: () => void;
  onClearChoice: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

/**
 * Sticky bottom bar: small utilities (mark / clear / submit early) above a
 * Previous · Next row. On the last question Next becomes "Submit test".
 */
export const ExamFooter: React.FC<ExamFooterProps> = ({
  currentIndex,
  totalQuestions,
  hasSelectedOption,
  isMarkedForReview,
  onToggleReview,
  onClearChoice,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  const { colors } = useTheme();
  const isFirst = currentIndex === 0;
  const isLast = currentIndex >= totalQuestions - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.outlineVariant }]}>
      <View style={styles.utilityRow}>
        <TouchableOpacity
          style={[styles.chip, isMarkedForReview && { backgroundColor: colors.accentContainer }]}
          activeOpacity={0.7}
          onPress={onToggleReview}
          accessibilityRole="button"
          accessibilityState={{ selected: isMarkedForReview }}
        >
          <MaterialIcons
            name={isMarkedForReview ? 'bookmark' : 'bookmark-border'}
            size={18}
            color={isMarkedForReview ? colors.accent : colors.onSurfaceVariant}
          />
          <Text style={[styles.chipText, { color: isMarkedForReview ? colors.onAccentContainer : colors.onSurfaceVariant }]}>
            {isMarkedForReview ? 'Marked for review' : 'Mark for review'}
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {hasSelectedOption && (
            <TouchableOpacity style={styles.chip} activeOpacity={0.7} onPress={onClearChoice} accessibilityRole="button">
              <MaterialIcons name="backspace" size={16} color={colors.onSurfaceVariant} />
              <Text style={[styles.chipText, { color: colors.onSurfaceVariant }]}>Clear</Text>
            </TouchableOpacity>
          )}
          {!isLast && (
            <TouchableOpacity style={styles.chip} activeOpacity={0.7} onPress={onSubmit} accessibilityRole="button">
              <MaterialIcons name="done-all" size={16} color={colors.tertiary} />
              <Text style={[styles.chipText, { color: colors.tertiary }]}>Submit test</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.prevBtn, { borderColor: colors.outlineVariant, opacity: isFirst ? 0.4 : 1 }]}
          activeOpacity={0.7}
          onPress={onPrevious}
          disabled={isFirst}
          accessibilityRole="button"
          accessibilityState={{ disabled: isFirst }}
        >
          <MaterialIcons name="chevron-left" size={22} color={colors.onSurface} />
          <Text style={[styles.btnText, { color: colors.onSurface }]}>Previous</Text>
        </TouchableOpacity>

        {!isLast ? (
          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
            onPress={onNext}
            accessibilityRole="button"
          >
            <Text style={[styles.btnText, { color: colors.onPrimary }]}>Next</Text>
            <MaterialIcons name="chevron-right" size={22} color={colors.onPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: colors.accent }]}
            activeOpacity={0.85}
            onPress={onSubmit}
            accessibilityRole="button"
          >
            <MaterialIcons name="done-all" size={20} color={colors.onAccent} />
            <Text style={[styles.btnText, { color: colors.onAccent }]}>Submit test</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  utilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 36,
    paddingHorizontal: 8,
    borderRadius: 18,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 2,
  },
  mainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 14,
    gap: 4,
  },
  btnText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 16,
  },
});
