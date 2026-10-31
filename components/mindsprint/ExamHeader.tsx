import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintColors } from '../../constants/mindsprintTheme';

interface ExamHeaderProps {
  title: string;
  secondsLeft: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  onOpenPalette: () => void;
  onQuitExam: () => void;
  onSubmitExam?: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  title,
  secondsLeft,
  currentQuestionIndex,
  totalQuestions,
  onOpenPalette,
  onQuitExam,
  onSubmitExam,
}) => {
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.closeBtn} onPress={onQuitExam}>
          <MaterialIcons name="close" size={24} color={MindSprintColors.onSurfaceVariant} />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <TouchableOpacity style={styles.paletteBtn} onPress={onOpenPalette}>
          <MaterialIcons name="grid-view" size={22} color={MindSprintColors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={styles.timerBadge}>
            <MaterialIcons name="timer" size={16} color={MindSprintColors.error} />
            <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
          </View>

          {onSubmitExam && (
            <TouchableOpacity style={styles.submitHeaderBtn} onPress={onSubmitExam}>
              <MaterialIcons name="done-all" size={15} color="#ffffff" />
              <Text style={styles.submitHeaderBtnText}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: MindSprintColors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: MindSprintColors.outlineVariant,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: MindSprintColors.onSurface,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  paletteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MindSprintColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterBadge: {
    backgroundColor: MindSprintColors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '600',
    color: MindSprintColors.onSurfaceVariant,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: MindSprintColors.errorContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '700',
    color: MindSprintColors.error,
  },
  submitHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  submitHeaderBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
});
