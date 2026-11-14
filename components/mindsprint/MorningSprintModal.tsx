import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows, MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { SpacedItem, SpacedRepetitionStorage } from '@/services/spacedRepetitionStorage';

interface MorningSprintModalProps {
  visible: boolean;
  onClose: () => void;
  onSprintCompleted?: () => void;
}

export const MorningSprintModal: React.FC<MorningSprintModalProps> = ({
  visible,
  onClose,
  onSprintCompleted,
}) => {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade = user?.grade || '10';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode && user?.medium === 'Gujarati';

  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<SpacedItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);

  useEffect(() => {
    if (visible) {
      loadSprintCards();
    }
  }, [visible, userGrade, user?.email]);

  const loadSprintCards = async () => {
    setLoading(true);
    setCurrentIndex(0);
    setIsRevealed(false);
    setCompleted(false);
    setCorrectCount(0);
    try {
      const cards = await SpacedRepetitionStorage.getItemsForReview(user?.email || 'guest', userGrade);
      setItems(cards);
    } catch (e) {
      console.warn('Error loading sprint cards:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (remembered: boolean) => {
    const currentItem = items[currentIndex];
    if (currentItem) {
      await SpacedRepetitionStorage.recordResult(currentItem.id, remembered, user?.email || 'guest', userGrade);
      if (remembered) {
        setCorrectCount((prev) => prev + 1);
      }
    }

    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsRevealed(false);
    } else {
      // Completed sprint
      await SpacedRepetitionStorage.markSprintCompletedToday(user?.email || 'guest');
      setCompleted(true);
      if (onSprintCompleted) onSprintCompleted();
    }
  };

  const currentItem = items[currentIndex];
  const displayFront = (isGSEB && currentItem?.frontGujarati) ? currentItem.frontGujarati : currentItem?.front;
  const displayBack = (isGSEB && currentItem?.backGujarati) ? currentItem.backGujarati : currentItem?.back;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.surfaceContainerLowest }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              <View style={[styles.headerIconBox, { backgroundColor: colors.accent }]}>
                <MaterialIcons name="timer" size={20} color={colors.onAccent} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
                  2-minute revision
                </Text>
                <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
                  Recall what you studied before
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={22} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.subText, { color: colors.onSurfaceVariant, marginTop: 10 }]}>
                Loading your revision cards…
              </Text>
            </View>
          ) : completed ? (
            /* COMPLETED SPRINT SCREEN */
            <View style={styles.finishBox}>
              <View style={[styles.trophyCircle, { backgroundColor: 'rgba(18, 128, 92, 0.15)' }]}>
                <MaterialIcons name="local-fire-department" size={48} color="#F4A30B" />
              </View>
              <Text style={[styles.finishTitle, { color: colors.onSurface }]}>
                Revision done
              </Text>
              <Text style={[styles.finishSub, { color: colors.onSurfaceVariant }]}>
                You reviewed {items.length} cards today and recalled {correctCount}/{items.length} correctly. Your streak is safe for today.
              </Text>
              <View style={styles.xpBadge}>
                <Text style={styles.xpBadgeText}>+50 XP</Text>
              </View>

              <TouchableOpacity
                style={[styles.doneBtn, { backgroundColor: colors.primary }]}
                onPress={onClose}
              >
                <Text style={styles.doneBtnText}>Back to studying</Text>
              </TouchableOpacity>
            </View>
          ) : currentItem ? (
            /* ACTIVE CARD SCREEN */
            <View style={{ gap: 14 }}>
              {/* Progress Bar & Leitner Box Indicator */}
              <View style={styles.progressRow}>
                <Text style={[styles.progressText, { color: colors.onSurfaceVariant }]}>
                  Card {currentIndex + 1} of {items.length} • {currentItem.subject}
                </Text>
                <View style={[styles.boxBadge, { backgroundColor: isDarkMode ? 'rgba(147,172,255,0.2)' : '#E4EAF8' }]}>
                  <Text style={[styles.boxBadgeText, { color: colors.primary }]}>
                    Box {currentItem.box}/5
                  </Text>
                </View>
              </View>

              <View style={[styles.progressBar, { backgroundColor: isDarkMode ? colors.surfaceContainerHigh : '#DCE2EE' }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${((currentIndex + 1) / items.length) * 100}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>

              {/* Flashcard Box */}
              <View
                style={[
                  styles.flashCard,
                  {
                    backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#F5F7FB',
                    borderColor: colors.outlineVariant,
                  },
                  MindSprintShadows.card,
                ]}
              >
                <Text style={[styles.cardPrompt, { color: colors.primary }]}>
                  {isRevealed ? 'Answer' : 'Try to recall'}
                </Text>

                <Text style={[styles.cardContentText, { color: colors.onSurface }]}>
                  {isRevealed ? displayBack : displayFront}
                </Text>

                {!isRevealed ? (
                  <TouchableOpacity
                    style={[styles.revealBtn, { backgroundColor: colors.primary }]}
                    onPress={() => setIsRevealed(true)}
                  >
                    <MaterialIcons name="touch-app" size={18} color="#ffffff" />
                    <Text style={styles.revealBtnText}>Show answer</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.answerChoiceBtn, { backgroundColor: colors.error }]}
                      onPress={() => handleAnswer(false)}
                    >
                      <MaterialIcons name="close" size={18} color="#ffffff" />
                      <Text style={styles.actionBtnText}>Didn’t know</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.answerChoiceBtn, { backgroundColor: colors.tertiary }]}
                      onPress={() => handleAnswer(true)}
                    >
                      <MaterialIcons name="check" size={18} color="#ffffff" />
                      <Text style={styles.actionBtnText}>Knew it</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.15)',
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 19,
    lineHeight: 25,
  },
  headerSub: {
    fontSize: 11,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBox: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subText: {
    fontSize: 13,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  boxBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  boxBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressBar: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  flashCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    gap: 14,
    minHeight: 220,
    justifyContent: 'center',
  },
  cardPrompt: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardContentText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  revealBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  answerChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  finishBox: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  trophyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishTitle: {
    fontFamily: MindSprintFonts.display,
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
  },
  finishSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  xpBadge: {
    backgroundColor: 'rgba(244, 163, 11, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  xpBadgeText: {
    color: '#8A5A00',
    fontWeight: '800',
    fontSize: 12,
  },
  doneBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  doneBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
