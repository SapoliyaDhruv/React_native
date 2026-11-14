import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintFonts } from '../../constants/mindsprintTheme';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface ExamHeaderProps {
  title: string;
  secondsLeft: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  onOpenPalette: () => void;
  onQuitExam: () => void;
  /** Submit lives in the exam's bottom bar; kept for API compatibility. */
  onSubmitExam?: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  title,
  secondsLeft,
  currentQuestionIndex,
  totalQuestions,
  onOpenPalette,
  onQuitExam,
}) => {
  const { colors } = useTheme();
  const { tr } = useLanguage();
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  const lowTime = secondsLeft <= 60;
  const progress = totalQuestions > 0 ? (currentQuestionIndex + 1) / totalQuestions : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconBtn} onPress={onQuitExam} accessibilityRole="button" accessibilityLabel="Leave test">
          <MaterialIcons name="close" size={24} color={colors.onSurface} />
        </TouchableOpacity>

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.counter, { color: colors.onSurfaceVariant }]}>
            {tr(
              `Question ${currentQuestionIndex + 1} of ${totalQuestions}`,
              `પ્રશ્ન ${currentQuestionIndex + 1} / ${totalQuestions}`
            )}
          </Text>
        </View>

        <View
          style={[styles.timer, { backgroundColor: lowTime ? colors.errorContainer : colors.surfaceContainerLow }]}
          accessibilityLabel={`Time left ${formatTime(secondsLeft)}`}
        >
          <MaterialIcons name="timer" size={16} color={lowTime ? colors.error : colors.onSurfaceVariant} />
          <Text style={[styles.timerText, { color: lowTime ? colors.error : colors.onSurface }]}>{formatTime(secondsLeft)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.primaryFixed }]}
          onPress={onOpenPalette}
          accessibilityRole="button"
          accessibilityLabel="Show all questions"
        >
          <MaterialIcons name="grid-view" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.track, { backgroundColor: colors.surfaceContainerLow }]}>
        <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 18,
    lineHeight: 24,
  },
  counter: {
    fontSize: 12.5,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    minHeight: 32,
    borderRadius: 16,
  },
  timerText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 15,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
  },
});
