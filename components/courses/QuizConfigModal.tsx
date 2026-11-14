import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { SubjectChapter } from '@/constants/academicData';

interface Props {
  chapter: SubjectChapter | null;
  onClose: () => void;
}

const LIMITS = [5, 10, 25];

/** Pick how many questions, then start a chapter quiz. */
export const QuizConfigModal: React.FC<Props> = ({ chapter, onClose }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const { tr, isGujarati } = useLanguage();
  const [limit, setLimit] = useState(10);

  const start = () => {
    if (!chapter) return;
    onClose();
    router.push({ pathname: '/exam', params: { category: chapter.title, limit: String(limit) } });
  };

  return (
    <Modal visible={!!chapter} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={2}>
                {isGujarati && chapter?.titleGujarati ? chapter.titleGujarati : chapter?.title}
              </Text>
              <Text style={[styles.sub, { color: colors.onSurfaceVariant }]}>
                {tr('How many questions?', 'કેટલા પ્રશ્નો?')}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel={tr('Close', 'બંધ કરો')}>
              <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <View style={styles.limitRow}>
            {LIMITS.map((n) => {
              const selected = n === limit;
              return (
                <TouchableOpacity
                  key={n}
                  onPress={() => setLimit(n)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={[styles.limitChip, { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.outlineVariant }]}
                >
                  <Text style={[styles.limitText, { color: selected ? colors.onPrimary : colors.onSurface }]}>
                    {n} {tr('questions', 'પ્રશ્નો')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={[styles.startBtn, { backgroundColor: colors.accent }]} onPress={start} accessibilityRole="button">
            <MaterialIcons name="play-arrow" size={20} color={colors.onAccent} />
            <Text style={[styles.startText, { color: colors.onAccent }]}>{tr('Start quiz', 'ક્વિઝ શરૂ કરો')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, gap: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { fontFamily: MindSprintFonts.heading, fontSize: 19, lineHeight: 25 },
  sub: { fontSize: 13.5, marginTop: 2 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  limitRow: { flexDirection: 'row', gap: 10 },
  limitChip: { flex: 1, minHeight: 48, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  limitText: { fontFamily: MindSprintFonts.label, fontSize: 14 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 52, borderRadius: 14 },
  startText: { fontFamily: MindSprintFonts.label, fontSize: 16 },
});
