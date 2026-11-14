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
import { MindSprintColors, MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
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
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const { tr } = useLanguage();
  const [selectedGrade, setSelectedGrade] = useState<AcademicGrade>(currentGrade);

  // Reset the selection each time the sheet opens (adjusting state during render, no effect needed).
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setSelectedGrade(currentGrade);
  }

  const isSchool = selectedGrade !== 'college';

  const handleConfirm = () => {
    if (selectedGrade === 'college') {
      onSave('college', 'CBSE', 'English');
    } else {
      onSave(selectedGrade, 'GSEB', 'Gujarati');
    }
    onClose();
  };

  const GUJ_DIGITS = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  const toGuj = (n: string) => n.replace(/[0-9]/g, (d) => GUJ_DIGITS[Number(d)]);
  const describe = (g: AcademicGrade) => {
    if (g === 'college')
      return {
        title: tr('College', 'કૉલેજ'),
        gu: tr('Placement prep', 'પ્લેસમેન્ટ તૈયારી'),
        sub: tr('Aptitude, reasoning, technical', 'ઍપ્ટિટ્યૂડ, રીઝનિંગ, ટેક્નિકલ'),
      };
    const sub =
      g === '10'
        ? tr('GSEB · SSC board exam', 'GSEB · SSC બોર્ડ પરીક્ષા')
        : g === '12'
          ? tr('GSEB · HSC board and GUJCET', 'GSEB · HSC બોર્ડ અને GUJCET')
          : tr('GSEB · Gujarati medium', 'GSEB · ગુજરાતી માધ્યમ');
    return { title: `ધોરણ ${toGuj(g)}`, gu: `Class ${g}`, sub };
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{tr('Choose your class', 'તમારું ધોરણ પસંદ કરો')}</Text>
              <Text style={styles.subtitle}>{tr('Your chapters, videos and tests will match it.', 'તમારાં પ્રકરણ, વિડિયો અને ટેસ્ટ તે પ્રમાણે બદલાશે.')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel={tr('Close', 'બંધ કરો')}>
              <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={{ gap: 8, paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
            {GRADE_OPTIONS.map((item) => {
              const isSelected = selectedGrade === item.grade;
              const info = describe(item.grade);
              return (
                <TouchableOpacity
                  key={item.grade}
                  activeOpacity={0.8}
                  style={[styles.row, isSelected && styles.rowSelected]}
                  onPress={() => setSelectedGrade(item.grade)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${info.gu}. ${info.sub}`}
                >
                  <View style={[styles.numTile, isSelected && { backgroundColor: colors.primary }]}>
                    {item.grade === 'college' ? (
                      <MaterialIcons name="work-outline" size={22} color={isSelected ? colors.onPrimary : colors.primary} />
                    ) : (
                      <Text style={[styles.numText, isSelected && { color: colors.onPrimary }]}>{item.grade}</Text>
                    )}
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {info.title}
                      <Text style={styles.rowTitleEn}>{`  ${info.gu}`}</Text>
                    </Text>
                    <Text style={styles.rowSub} numberOfLines={1}>{info.sub}</Text>
                  </View>
                  <MaterialIcons
                    name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
                    size={24}
                    color={isSelected ? colors.primary : colors.outline}
                  />
                </TouchableOpacity>
              );
            })}
            <Text style={styles.note}>
              {isSchool
                ? tr('School classes follow the GSEB syllabus in Gujarati medium.', 'શાળાનાં ધોરણો GSEB ગુજરાતી માધ્યમના અભ્યાસક્રમ પ્રમાણે છે.')
                : tr('College content is in English.', 'કૉલેજનું સાહિત્ય અંગ્રેજીમાં છે.')}
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85} onPress={handleConfirm} accessibilityRole="button">
            <Text style={styles.confirmBtnText}>
              {selectedGrade === 'college'
                ? selectedGrade === currentGrade
                  ? tr('Keep College', 'કૉલેજ જ રાખો')
                  : tr('Switch to College', 'કૉલેજ પસંદ કરો')
                : selectedGrade === currentGrade
                  ? tr(`Keep Class ${selectedGrade}`, `ધોરણ ${selectedGrade} જ રાખો`)
                  : tr(`Switch to Class ${selectedGrade}`, `ધોરણ ${selectedGrade} પસંદ કરો`)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const makeStyles = (c: typeof MindSprintColors) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    card: {
      backgroundColor: c.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 18,
      paddingBottom: 24,
      maxHeight: '88%',
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
    },
    handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: c.surfaceContainerHigh, marginTop: 10, marginBottom: 8 },
    header: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, gap: 8 },
    title: { fontFamily: MindSprintFonts.heading, fontSize: 22, lineHeight: 28, color: c.onSurface },
    subtitle: { fontSize: 14, color: c.onSurfaceVariant, marginTop: 2 },
    closeBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -8 },
    body: { marginTop: 8 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 66,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.outlineVariant,
      backgroundColor: c.surface,
    },
    rowSelected: { borderWidth: 2, borderColor: c.primary, backgroundColor: c.primaryFixed },
    numTile: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: c.primaryFixed },
    numText: { fontFamily: MindSprintFonts.heading, fontSize: 18, lineHeight: 24, color: c.primary },
    rowTitle: { fontFamily: MindSprintFonts.title, fontSize: 16, lineHeight: 22, color: c.onSurface },
    rowTitleEn: { fontFamily: undefined, fontSize: 13.5, fontWeight: '500', color: c.onSurfaceVariant },
    rowSub: { fontSize: 13, color: c.onSurfaceVariant, marginTop: 1 },
    note: { fontSize: 13, color: c.onSurfaceVariant, marginTop: 6, paddingHorizontal: 4 },
    confirmBtn: {
      minHeight: 52,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.accent,
      marginTop: 8,
    },
    confirmBtnText: { fontFamily: MindSprintFonts.label, fontSize: 17, color: c.onAccent },
  });
