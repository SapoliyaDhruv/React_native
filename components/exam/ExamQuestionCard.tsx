import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Question } from '@/constants/mindsprintData';
import { MindSprintFonts } from '@/constants/mindsprintTheme';

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
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Category & Status Bar */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: colors.primaryFixed },
          ]}
        >
          <Text style={[styles.categoryText, { color: colors.primary }]}>
            {(question as any).categoryGujarati || question.category}
          </Text>
        </View>

        {isMarkedForReview && (
          <View style={[styles.reviewBadge, { backgroundColor: colors.accentContainer }]}>
            <MaterialIcons name="bookmark" size={14} color={colors.accent} />
            <Text style={[styles.reviewText, { color: colors.onAccentContainer }]}>Marked for review</Text>
          </View>
        )}
      </View>

      {/* Question Text */}
      <Text style={[styles.questionText, { color: colors.onSurface }]}>
        {(question as any).questionTextGujarati || question.questionText}
      </Text>

      {/* Options List */}
      <View style={styles.optionsList}>
        {(((question as any).optionsGujarati && (question as any).optionsGujarati.length > 0)
          ? (question as any).optionsGujarati
          : question.options
        ).map((option: string, optIdx: number) => {
          const isSelected = selectedOption === optIdx;
          const letter = String.fromCharCode(65 + optIdx);

          return (
            <TouchableOpacity
              key={optIdx}
              activeOpacity={0.8}
              onPress={() => onSelectOption(optIdx)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Option ${letter}: ${option}`}
              style={[
                styles.optionCard,
                {
                  backgroundColor: isSelected ? colors.primaryFixed : colors.surface,
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
                      : colors.surfaceContainerLow,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.radioLetter,
                    { color: isSelected ? colors.onPrimary : colors.onSurfaceVariant },
                  ]}
                >
                  {letter}
                </Text>
              </View>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: colors.onSurface,
                    fontWeight: isSelected ? '600' : '400',
                  },
                ]}
              >
                {option}
              </Text>
              {isSelected && <MaterialIcons name="check-circle" size={22} color={colors.primary} />}
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
    fontFamily: MindSprintFonts.label,
    fontSize: 13,
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
    fontSize: 12,
    fontWeight: '600',
  },
  questionText: {
    fontFamily: MindSprintFonts.title,
    fontSize: 19,
    lineHeight: 28,
    marginBottom: 20,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    minHeight: 58,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  radioCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioLetter: {
    fontFamily: MindSprintFonts.label,
    fontSize: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 23,
  },
});
