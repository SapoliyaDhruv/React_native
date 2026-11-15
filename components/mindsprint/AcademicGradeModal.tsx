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
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MindSprintColors, MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  AcademicGrade,
  AcademicStream,
  EducationBoard,
  InstructionMedium,
  GRADE_OPTIONS,
  STREAM_OPTIONS,
  gradeHasStreams,
} from '@/constants/academicData';

interface AcademicGradeModalProps {
  visible: boolean;
  currentGrade?: AcademicGrade;
  currentBoard?: EducationBoard;
  currentMedium?: InstructionMedium;
  /** Class 11/12 stream currently saved for the student. */
  currentStream?: AcademicStream;
  onClose: () => void;
  onSave: (grade: AcademicGrade, board: EducationBoard, medium: InstructionMedium, stream?: AcademicStream) => void;
}

export const AcademicGradeModal: React.FC<AcademicGradeModalProps> = ({
  visible,
  currentGrade = 'college',
  currentBoard = 'CBSE',
  currentMedium = 'English',
  currentStream,
  onClose,
  onSave,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const { tr, isGujarati } = useLanguage();
  const [selectedGrade, setSelectedGrade] = useState<AcademicGrade>(currentGrade);
  // Class 11/12 must pick a stream; pre-fill the saved one, otherwise wait for a choice.
  const [selectedStream, setSelectedStream] = useState<AcademicStream | undefined>(currentStream);

  // Reset the selection each time the sheet opens (adjusting state during render, no effect needed).
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setSelectedGrade(currentGrade);
      setSelectedStream(gradeHasStreams(currentGrade) ? currentStream : undefined);
    }
  }

  const isSchool = selectedGrade !== 'college';
  const needsStream = gradeHasStreams(selectedGrade);
  const missingStream = needsStream && !selectedStream;
  const streamInfo = STREAM_OPTIONS.find((o) => o.stream === selectedStream);
  const streamName = streamInfo ? (isGujarati ? streamInfo.labelGujarati : streamInfo.label) : '';
  const unchanged = selectedGrade === currentGrade && (!needsStream || selectedStream === currentStream);

  const tap = () => Haptics.selectionAsync().catch(() => {});

  const pickGrade = (g: AcademicGrade) => {
    tap();
    setSelectedGrade(g);
  };

  const pickStream = (st: AcademicStream) => {
    tap();
    setSelectedStream(st);
  };

  const handleConfirm = () => {
    if (missingStream) return;
    if (selectedGrade === 'college') {
      onSave('college', 'CBSE', 'English');
    } else {
      onSave(selectedGrade, 'GSEB', 'Gujarati', needsStream ? selectedStream : undefined);
    }
    onClose();
  };

  const confirmLabel = (() => {
    if (missingStream) return tr('Choose a stream to continue', 'આગળ વધવા પ્રવાહ પસંદ કરો');
    if (selectedGrade === 'college') return unchanged ? tr('Keep College', 'કૉલેજ જ રાખો') : tr('Switch to College', 'કૉલેજ પસંદ કરો');
    const en = `Class ${selectedGrade}${needsStream ? ` · ${streamInfo?.label}` : ''}`;
    const gu = `ધોરણ ${selectedGrade}${needsStream ? ` · ${streamInfo?.labelGujarati}` : ''}`;
    return unchanged ? tr(`Keep ${en}`, `${gu} જ રાખો`) : tr(`Switch to ${en}`, `${gu} પસંદ કરો`);
  })();

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
          ? tr('GSEB · HSC board · Science, Commerce, Arts', 'GSEB · HSC બોર્ડ · વિજ્ઞાન, વાણિજ્ય, આર્ટ્સ')
          : g === '11'
            ? tr('GSEB · Science, Commerce, Arts', 'GSEB · વિજ્ઞાન, વાણિજ્ય, આર્ટ્સ')
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
                <Animated.View key={item.grade} layout={LinearTransition.duration(220)} style={{ gap: 8 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.row, isSelected && styles.rowSelected]}
                  onPress={() => pickGrade(item.grade)}
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
                {isSelected && gradeHasStreams(item.grade) && (
                  <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOut.duration(120)} style={styles.streamBox}>
                    <Text style={styles.streamTitle}>{tr('Your stream', 'તમારો પ્રવાહ')}</Text>
                    <View style={styles.streamRow} accessibilityRole="radiogroup">
                      {STREAM_OPTIONS.map((o) => {
                        const on = selectedStream === o.stream;
                        return (
                          <TouchableOpacity
                            key={o.stream}
                            activeOpacity={0.85}
                            onPress={() => pickStream(o.stream)}
                            style={[styles.streamCard, on && styles.streamCardOn]}
                            accessibilityRole="radio"
                            accessibilityState={{ selected: on }}
                            accessibilityLabel={`${o.label}. ${o.subjects}`}
                          >
                            <MaterialIcons name={o.icon as any} size={22} color={on ? colors.onPrimary : colors.primary} />
                            <Text style={[styles.streamLabel, on && { color: colors.onPrimary }]} numberOfLines={1}>
                              {isGujarati ? o.labelGujarati.replace(/\s*\(.*\)/, '') : o.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {streamInfo ? (
                      <Animated.Text key={streamInfo.stream} entering={FadeIn.duration(180)} style={styles.streamSubjects}>
                        {tr(`${streamInfo.label}: ${streamInfo.subjects}, plus Gujarati and English.`, `${streamName}: ${streamInfo.subjectsGujarati}, સાથે ગુજરાતી અને અંગ્રેજી.`)}
                      </Animated.Text>
                    ) : (
                      <Text style={styles.streamSubjects}>{tr('Pick one so we show the right subjects.', 'યોગ્ય વિષયો બતાવવા માટે એક પસંદ કરો.')}</Text>
                    )}
                  </Animated.View>
                )}
                </Animated.View>
              );
            })}
            <Text style={styles.note}>
              {isSchool
                ? needsStream
                  ? tr('Your progress is kept. You can change class or stream here any time.', 'તમારી પ્રગતિ સચવાયેલી રહેશે. ધોરણ કે પ્રવાહ અહીંથી ગમે ત્યારે બદલી શકો છો.')
                  : tr('School classes follow the GSEB syllabus in Gujarati medium.', 'શાળાનાં ધોરણો GSEB ગુજરાતી માધ્યમના અભ્યાસક્રમ પ્રમાણે છે.')
                : tr('College content is in English.', 'કૉલેજનું સાહિત્ય અંગ્રેજીમાં છે.')}
            </Text>
          </ScrollView>

          <TouchableOpacity
            style={[styles.confirmBtn, missingStream && styles.confirmBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleConfirm}
            disabled={missingStream}
            accessibilityRole="button"
            accessibilityState={{ disabled: missingStream }}
          >
            <Text style={[styles.confirmBtnText, missingStream && { color: colors.onSurfaceVariant }]}>{confirmLabel}</Text>
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
    confirmBtnDisabled: { backgroundColor: c.surfaceContainerHigh },
    streamBox: {
      marginLeft: 12,
      paddingLeft: 12,
      paddingVertical: 4,
      borderLeftWidth: 2,
      borderLeftColor: c.primaryFixed,
      gap: 8,
    },
    streamTitle: { fontFamily: MindSprintFonts.label, fontSize: 14, color: c.onSurfaceVariant },
    streamRow: { flexDirection: 'row', gap: 8 },
    streamCard: {
      flex: 1,
      minHeight: 72,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.outlineVariant,
      backgroundColor: c.surface,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingHorizontal: 6,
    },
    streamCardOn: { backgroundColor: c.primary, borderColor: c.primary },
    streamLabel: { fontFamily: MindSprintFonts.label, fontSize: 14, color: c.onSurface },
    streamSubjects: { fontSize: 13, lineHeight: 18, color: c.onSurfaceVariant },
    confirmBtnText: { fontFamily: MindSprintFonts.label, fontSize: 17, color: c.onAccent },
  });
