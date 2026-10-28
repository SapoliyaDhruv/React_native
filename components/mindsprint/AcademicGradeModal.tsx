import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import {
  AcademicGrade,
  EducationBoard,
  InstructionMedium,
  GRADE_OPTIONS,
} from '@/constants/academicData';

interface AcademicGradeModalProps {
  visible: boolean;
  currentGrade?: AcademicGrade;
  currentBoard?: EducationBoard;
  currentMedium?: InstructionMedium;
  onClose: () => void;
  onSave: (grade: AcademicGrade, board: EducationBoard, medium: InstructionMedium) => void;
}

export const AcademicGradeModal: React.FC<AcademicGradeModalProps> = ({
  visible,
  currentGrade = 'college',
  currentBoard = 'CBSE',
  currentMedium = 'English',
  onClose,
  onSave,
}) => {
  const { colors, isDarkMode } = useTheme();

  const [selectedGrade, setSelectedGrade] = useState<AcademicGrade>(currentGrade);

  // Sync state when props change or modal opens
  React.useEffect(() => {
    if (visible) {
      setSelectedGrade(currentGrade);
    }
  }, [visible, currentGrade]);

  const isSchool = selectedGrade !== 'college';

  const handleConfirm = () => {
    if (selectedGrade === 'college') {
      onSave('college', 'CBSE', 'English');
    } else {
      onSave(selectedGrade, 'GSEB', 'Gujarati');
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff' },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="school" size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.onSurface }]}>
                  Select Academic Stage
                </Text>
                <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
                  Tailor your entire feed, tests & curriculum
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={22} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Step 1: Select Grade */}
            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
              1. Choose Grade / Goal:
            </Text>

            <View style={styles.gradeGrid}>
              {GRADE_OPTIONS.map((item) => {
                const isSelected = selectedGrade === item.grade;
                return (
                  <TouchableOpacity
                    key={item.grade}
                    activeOpacity={0.8}
                    style={[
                      styles.gradeCard,
                      {
                        backgroundColor: isSelected
                          ? isDarkMode ? 'rgba(129,140,248,0.15)' : '#eef2ff'
                          : isDarkMode ? colors.surfaceContainerLow : '#f8fafc',
                        borderColor: isSelected ? colors.primary : colors.outlineVariant,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                    onPress={() => setSelectedGrade(item.grade)}
                  >
                    <View style={styles.gradeHeaderRow}>
                      <Text
                        style={[
                          styles.gradeLabel,
                          { color: isSelected ? colors.primary : colors.onSurface },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {isSelected && (
                        <MaterialIcons name="check-circle" size={18} color={colors.primary} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.gradeSub,
                        { color: isSelected ? colors.primary : colors.onSurfaceVariant },
                      ]}
                      numberOfLines={1}
                    >
                      {item.subLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Academic Track Confirmation Banner */}
            {isSchool ? (
              <View
                style={[
                  styles.gsebNoticeCard,
                  {
                    backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.12)' : '#ecfdf5',
                    borderColor: '#10b981',
                  },
                ]}
              >
                <Text style={styles.gsebNoticeEmoji}>🦁</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.gsebNoticeTitle, { color: isDarkMode ? '#34d399' : '#065f46' }]}>
                    GSEB ગુજરાત બોર્ડ • ગુજરાતી માધ્યમ
                  </Text>
                  <Text style={[styles.gsebNoticeSub, { color: isDarkMode ? '#a7f3d0' : '#047857' }]}>
                    ધોરણ ૬ થી ૧૨ નો તમામ અભ્યાસક્રમ, સ્વાધ્યાય, વિડીયો અને બોર્ડ પેપર્સ ગુજરાતી માધ્યમમાં ઉપલબ્ધ રહેશે.
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.gsebNoticeCard,
                  {
                    backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.12)' : '#eef2ff',
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Text style={styles.gsebNoticeEmoji}>🎓</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.gsebNoticeTitle, { color: colors.primary }]}>
                    College & Campus Placements (English)
                  </Text>
                  <Text style={[styles.gsebNoticeSub, { color: colors.onSurfaceVariant }]}>
                    Aptitude, DSA, Web Dev, and technical interview simulations are delivered in English.
                  </Text>
                </View>
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: colors.primary }, MindSprintShadows.glow]}
            activeOpacity={0.85}
            onPress={handleConfirm}
          >
            <MaterialIcons name="done" size={20} color="#ffffff" />
            <Text style={styles.confirmBtnText}>
              Confirm & Switch Curriculum 🚀
            </Text>
          </TouchableOpacity>
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
  card: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    maxHeight: 440,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  gradeGrid: {
    gap: 8,
  },
  gradeCard: {
    padding: 12,
    borderRadius: 14,
    gap: 3,
  },
  gradeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradeLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  gradeSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 12,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  gsebNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
  },
  gsebNoticeEmoji: {
    fontSize: 28,
  },
  gsebNoticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  gsebNoticeSub: {
    fontSize: 12,
    lineHeight: 16,
  },
});
