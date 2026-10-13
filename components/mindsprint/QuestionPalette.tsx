import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintColors } from '../../constants/mindsprintTheme';

interface QuestionPaletteProps {
  visible: boolean;
  totalQuestions: number;
  currentQuestionIndex: number;
  userAnswers: Record<number, number>; // index -> selected option
  markedForReview: Record<number, boolean>;
  onSelectQuestion: (index: number) => void;
  onClose: () => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  visible,
  totalQuestions,
  currentQuestionIndex,
  userAnswers,
  markedForReview,
  onSelectQuestion,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.header}>
            <Text style={styles.title}>Question Palette</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color={MindSprintColors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Legend Row */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: MindSprintColors.primary }]} />
              <Text style={styles.legendText}>Answered</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.legendText}>Review</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: MindSprintColors.surfaceContainerHigh }]} />
              <Text style={styles.legendText}>Unanswered</Text>
            </View>
          </View>

          {/* Grid of Numbers */}
          <View style={styles.grid}>
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const isCurrent = currentQuestionIndex === index;
              const isAnswered = userAnswers[index] !== undefined;
              const isMarked = markedForReview[index];

              let boxStyle = styles.unansweredBox;
              let textStyle = styles.unansweredText;

              if (isMarked) {
                boxStyle = styles.markedBox;
                textStyle = styles.markedText;
              } else if (isAnswered) {
                boxStyle = styles.answeredBox;
                textStyle = styles.answeredText;
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.gridItem,
                    boxStyle,
                    isCurrent && styles.currentBoxBorder,
                  ]}
                  onPress={() => {
                    onSelectQuestion(index);
                    onClose();
                  }}
                >
                  <Text style={[styles.gridText, textStyle]}>{index + 1}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: MindSprintColors.surfaceContainerLowest,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: MindSprintColors.onSurface,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: MindSprintColors.outlineVariant,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: MindSprintColors.onSurfaceVariant,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  gridItem: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unansweredBox: {
    backgroundColor: MindSprintColors.surfaceContainerLow,
  },
  unansweredText: {
    color: MindSprintColors.onSurfaceVariant,
  },
  answeredBox: {
    backgroundColor: MindSprintColors.primary,
  },
  answeredText: {
    color: MindSprintColors.onPrimary,
  },
  markedBox: {
    backgroundColor: '#f59e0b',
  },
  markedText: {
    color: '#ffffff',
  },
  currentBoxBorder: {
    borderWidth: 2,
    borderColor: MindSprintColors.onSurface,
  },
  gridText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
