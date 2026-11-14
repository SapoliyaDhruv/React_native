import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { SubjectChapter } from '@/constants/academicData';

interface Props {
  chapters: SubjectChapter[];
  onOpenChapter: (chapter: SubjectChapter) => void;
}

/** Every chapter's key formulas on one page, for quick revision. */
export const FormulasView: React.FC<Props> = ({ chapters, onOpenChapter }) => {
  const { colors } = useTheme();
  const { tr, isGujarati } = useLanguage();
  return (
    <View style={{ gap: 12 }}>
      {chapters.map((chap) => {
        const formulas = (isGujarati ? chap.keyFormulasGujarati : chap.keyFormulas) || chap.keyFormulas || [];
        return (
          <View key={chap.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
            <TouchableOpacity onPress={() => onOpenChapter(chap)} style={styles.headRow} accessibilityRole="button">
              <Text style={[styles.heading, { color: colors.onSurface }]} numberOfLines={2}>
                {chap.chapterNumber}. {isGujarati && chap.titleGujarati ? chap.titleGujarati : chap.title}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
            </TouchableOpacity>
            {formulas.length > 0 ? (
              formulas.map((f, i) => (
                <View key={i} style={styles.row}>
                  <MaterialIcons name="functions" size={15} color={colors.primary} />
                  <Text style={[styles.text, { color: colors.onSurface }]}>{f}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.empty, { color: colors.onSurfaceVariant }]}>
                {tr('No formulas in this chapter.', 'આ પ્રકરણમાં કોઈ સૂત્ર નથી.')}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 8 },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heading: { flex: 1, fontFamily: MindSprintFonts.title, fontSize: 16, lineHeight: 21 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  text: { flex: 1, fontSize: 14, lineHeight: 20 },
  empty: { fontSize: 13.5 },
});
