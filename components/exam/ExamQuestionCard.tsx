import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Question } from '@/constants/mindsprintData';

interface ExamQuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOption?: number;
  isMarkedForReview?: boolean;
  onSelectOption: (optionIndex: number) => void;
}

export const ExamQuestionCard: React.FC<ExamQuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOption,
  isMarkedForReview = false,
  onSelectOption,
}) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={styles.container}>
      {/* Category & Status Bar */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.15)' : '#eef2ff' },
          ]}
        >
          <Text style={[styles.categoryText, { color: colors.primary }]}>
            {question.category}
          </Text>
        </View>

        {isMarkedForReview && (
          <View style={[styles.reviewBadge, { backgroundColor: isDarkMode ? '#78350f' : '#fef3c7' }]}>
            <MaterialIcons name="bookmark" size={14} color="#f59e0b" />
            <Text style={styles.reviewText}>Marked for Review</Text>
          </View>
        )}
      </View>

      {/* Question Text */}
      <Text style={[styles.questionText, { color: colors.onSurface }]}>
        {question.questionText}
      </Text>

      {/* Options List */}
      <View style={styles.optionsList}>
        {question.options.map((option, optIdx) => {
          const isSelected = selectedOption === optIdx;
          const letter = String.fromCharCode(65 + optIdx);

          return (
            <TouchableOpacity
              key={optIdx}
              activeOpacity={0.8}
              onPress={() => onSelectOption(optIdx)}
              style={[
                styles.optionCard,
                {
                  backgroundColor: isSelected
                    ? isDarkMode ? 'rgba(129,140,248,0.12)' : 'rgba(53, 37, 205, 0.06)'
                    : isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                  borderColor: isSelected ? colors.primary : colors.outlineVariant,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.radioCircle,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : isDarkMode ? colors.surfaceContainerHigh : '#f1f5f9',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.radioLetter,
                    { color: isSelected ? '#ffffff' : colors.onSurfaceVariant },
                  ]}
                >
                  {letter}
                </Text>
              </View>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? colors.primary : colors.onSurface,
                    fontWeight: isSelected ? '700' : '400',
                  },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  reviewText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d97706',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: -0.2,
    marginBottom: 20,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  radioCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioLetter: {
    fontSize: 13,
    fontWeight: '800',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
