import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintShadows, MindSprintFonts } from '@/constants/mindsprintTheme';

interface QuestionNavigatorModalProps {
  visible: boolean;
  totalQuestions: number;
  currentIndex: number;
  userAnswers: Record<number, number>;
  flaggedIndices: number[];
  questionsList: any[];
  onSelectQuestion: (index: number) => void;
  onClose: () => void;
  onSubmitExam?: () => void;
}

export const QuestionNavigatorModal: React.FC<QuestionNavigatorModalProps> = ({
  visible,
  totalQuestions,
  currentIndex,
  userAnswers,
  flaggedIndices,
  onSelectQuestion,
  onClose,
  onSubmitExam,
}) => {
  const { colors } = useTheme();
  const { tr } = useLanguage();

  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = flaggedIndices.length;
  const unvisitedCount = Math.max(0, totalQuestions - answeredCount);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.drawerCard, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialIcons name="grid-view" size={22} color={colors.primary} />
              <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
                {tr('All questions', 'બધા પ્રશ્નો')}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel={tr('Close', 'બંધ કરો')}>
              <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Status Counter Summary */}
          <View style={[styles.summaryRow, { backgroundColor: colors.surfaceContainerLow }]}>
            <View style={styles.statItem}>
              <View style={[styles.dot, { backgroundColor: colors.tertiary }]} />
              <Text style={[styles.statNum, { color: colors.onSurface }]}>{answeredCount}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>{tr('Answered', 'જવાબ આપ્યા')}</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.statNum, { color: colors.onSurface }]}>{flaggedCount}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>{tr('Marked', 'નિશાની')}</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.dot, { backgroundColor: colors.outline }]} />
              <Text style={[styles.statNum, { color: colors.onSurface }]}>{unvisitedCount}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>{tr('Not answered', 'બાકી')}</Text>
            </View>
          </View>

          {/* Question Grid */}
          <Text style={[styles.gridTitle, { color: colors.onSurfaceVariant }]}>
            {tr('Tap a number to go to that question', 'પ્રશ્ન પર જવા નંબર દબાવો')}
          </Text>

          <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              // Answers are keyed by question position (see app/exam.tsx).
              const isAnswered = userAnswers[idx] !== undefined;
              const isFlagged = flaggedIndices.includes(idx);
              const isCurrent = idx === currentIndex;

              let bg = colors.surface;
              let borderColor = colors.outlineVariant;
              let textColor = colors.onSurface;

              if (isAnswered) {
                bg = colors.tertiary;
                borderColor = colors.tertiary;
                textColor = colors.onTertiary;
              } else if (isFlagged) {
                bg = colors.accent;
                borderColor = colors.accent;
                textColor = colors.onAccent;
              }

              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  style={[
                    styles.gridBadge,
                    { backgroundColor: bg, borderColor: isCurrent ? colors.primary : borderColor },
                    isCurrent && { borderWidth: 2.5 },
                    MindSprintShadows.card,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={tr(`Question ${idx + 1}`, `પ્રશ્ન ${idx + 1}`)}
                  onPress={() => {
                    onSelectQuestion(idx);
                    onClose();
                  }}
                >
                  <Text style={[styles.badgeNum, { color: textColor }]}>
                    {idx + 1}
                  </Text>
                  {isFlagged && (
                    <MaterialIcons
                      name="flag"
                      size={10}
                      color={textColor}
                      style={styles.flagIcon}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Modal Actions */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
            <TouchableOpacity
              style={[styles.resumeBtn, { flex: 1, backgroundColor: colors.surfaceContainer }]}
              onPress={onClose}
            >
              <Text style={[styles.resumeBtnText, { color: colors.onSurface }]}>{tr('Back to question', 'પ્રશ્ન પર પાછા')}</Text>
            </TouchableOpacity>

            {onSubmitExam && (
              <TouchableOpacity
                style={[styles.resumeBtn, { flex: 1.2, backgroundColor: colors.primary }]}
                onPress={() => {
                  onClose();
                  onSubmitExam();
                }}
              >
                <Text style={[styles.resumeBtnText, { color: colors.onPrimary }]}>{tr('Submit test', 'ટેસ્ટ સબમિટ કરો')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  drawerCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '75%',
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 20,
    lineHeight: 26,
  },
  closeBtn: {
    padding: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 12,
    borderRadius: 14,
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  statNum: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  gridTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  gridBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeNum: {
    fontSize: 14,
    fontWeight: '800',
  },
  flagIcon: {
    position: 'absolute',
    top: 3,
    right: 3,
  },
  resumeBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  resumeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
