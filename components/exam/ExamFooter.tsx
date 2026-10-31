import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
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
  const { colors, isDarkMode } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff',
          borderTopColor: colors.outlineVariant,
        },
      ]}
    >
      {/* Utilities Row */}
      <View style={styles.utilityRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          onPress={onToggleReview}
        >
          <MaterialIcons
            name={isMarkedForReview ? 'bookmark' : 'bookmark-border'}
            size={18}
            color={isMarkedForReview ? '#f59e0b' : colors.outline}
          />
          <Text
            style={[
              styles.actionLabel,
              { color: isMarkedForReview ? '#d97706' : colors.onSurfaceVariant },
            ]}
          >
            {isMarkedForReview ? 'Marked' : 'Mark for Review'}
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {hasSelectedOption && (
            <TouchableOpacity style={styles.clearBtn} activeOpacity={0.7} onPress={onClearChoice}>
              <MaterialIcons name="close" size={14} color="#ef4444" />
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.finishEarlyBtn, { backgroundColor: '#10b98115', borderColor: '#10b981' }]}
            activeOpacity={0.7}
            onPress={onSubmit}
          >
            <MaterialIcons name="done-all" size={14} color="#10b981" />
            <Text style={styles.finishEarlyText}>Finish Exam</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Buttons Row */}
      <View style={styles.navRow}>
        {currentIndex > 0 && (
          <TouchableOpacity
            style={[styles.prevBtn, { borderColor: colors.outlineVariant }]}
            activeOpacity={0.7}
            onPress={onPrevious}
          >
            <MaterialIcons name="chevron-left" size={20} color={colors.onSurface} />
            <Text style={[styles.prevText, { color: colors.onSurface }]}>Previous</Text>
          </TouchableOpacity>
        )}

        {currentIndex < totalQuestions - 1 ? (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: colors.primary }, MindSprintShadows.glow]}
            activeOpacity={0.85}
            onPress={onNext}
          >
            <Text style={styles.nextText}>Next Question</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: '#10b981' }, MindSprintShadows.glow]}
            activeOpacity={0.85}
            onPress={onSubmit}
          >
            <MaterialIcons name="check-circle" size={20} color="#ffffff" />
            <Text style={styles.submitText}>Submit Exam</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  utilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  finishEarlyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  finishEarlyText: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  prevText: {
    fontSize: 13,
    fontWeight: '600',
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 4,
  },
  nextText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
