import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { SubjectChapter } from '@/constants/academicData';
import { GlossaryTooltip } from '@/components/mindsprint/GlossaryTooltip';

interface Props {
  chapter: SubjectChapter | null;
  onClose: () => void;
  onQuiz: (chapter: SubjectChapter) => void;
}

const GLOSSARY_TERMS = ['photosynthesis', 'chlorophyll', 'circuit', 'resistance', 'primenumber', 'gravity'];

/** Chapter summary, formulas, exercise answers and concepts in one reader sheet. */
export const NotesModal: React.FC<Props> = ({ chapter, onClose, onQuiz }) => {
  const { colors } = useTheme();
  const { tr, isGujarati } = useLanguage();
  const [glossaryTerm, setGlossaryTerm] = useState<string | null>(null);

  const formulas = (isGujarati ? chapter?.keyFormulasGujarati : chapter?.keyFormulas) || chapter?.keyFormulas || [];

  return (
    <Modal visible={!!chapter} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={2}>
              {isGujarati && chapter?.titleGujarati ? chapter.titleGujarati : chapter?.title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel={tr('Close', 'બંધ કરો')}>
              <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }} contentContainerStyle={{ gap: 14 }}>
            <View>
              <Text style={[styles.heading, { color: colors.onSurface }]}>{tr('Summary', 'સારાંશ')}</Text>
              <Text style={[styles.body, { color: colors.onSurface }]}>
                {(isGujarati && chapter?.summaryGujarati) || chapter?.summary}
              </Text>
            </View>

            {formulas.length > 0 && (
              <View style={[styles.box, { backgroundColor: colors.primaryFixed, borderColor: colors.primaryFixed }]}>
                <Text style={[styles.heading, { color: colors.primary }]}>{tr('Key formulas', 'મુખ્ય સૂત્રો')}</Text>
                {formulas.map((f, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <MaterialIcons name="functions" size={15} color={colors.primary} />
                    <Text style={[styles.bulletText, { color: colors.onSurface }]}>{f}</Text>
                  </View>
                ))}
              </View>
            )}

            {(chapter?.exerciseSolutions || []).length > 0 && (
              <View style={[styles.box, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}>
                <Text style={[styles.heading, { color: colors.onSurface }]}>{tr('Textbook exercise answers', 'સ્વાધ્યાયના જવાબ')}</Text>
                {chapter?.exerciseSolutions?.map((ex, i) => (
                  <View key={i} style={{ gap: 3, paddingVertical: 4 }}>
                    <Text style={[styles.qText, { color: colors.onSurface }]}>
                      {i + 1}. {(isGujarati && ex.questionGujarati) || ex.question}
                    </Text>
                    <Text style={[styles.aText, { color: colors.onSurfaceVariant }]}>
                      {(isGujarati && ex.answerGujarati) || ex.answer}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {(chapter?.concepts || []).map((concept, i) => (
              <View key={i} style={[styles.box, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}>
                <Text style={[styles.heading, { color: colors.onSurface }]}>
                  {(isGujarati && concept.headingGujarati) || concept.heading}
                </Text>
                <Text style={[styles.body, { color: colors.onSurface }]}>
                  {(isGujarati && concept.explanationGujarati) || concept.explanation}
                </Text>
              </View>
            ))}

            <View style={[styles.box, { backgroundColor: colors.tertiaryContainer, borderColor: colors.tertiaryContainer }]}>
              <Text style={[styles.heading, { color: colors.onTertiaryContainer }]}>
                {tr('Word meanings (English ↔ Gujarati)', 'શબ્દાર્થ (અંગ્રેજી ↔ ગુજરાતી)')}
              </Text>
              <View style={styles.termRow}>
                {GLOSSARY_TERMS.map((term) => (
                  <TouchableOpacity key={term} onPress={() => setGlossaryTerm(term)} style={[styles.termChip, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.termText, { color: colors.onTertiaryContainer }]}>{term}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.secondaryBtn, { borderColor: colors.outlineVariant }]} onPress={onClose}>
              <Text style={[styles.btnText, { color: colors.onSurface }]}>{tr('Close', 'બંધ કરો')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
              onPress={() => chapter && onQuiz(chapter)}
            >
              <MaterialIcons name="quiz" size={18} color={colors.onPrimary} />
              <Text style={[styles.btnText, { color: colors.onPrimary }]}>{tr('Take quiz', 'ક્વિઝ આપો')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <GlossaryTooltip visible={!!glossaryTerm} termKeyOrText={glossaryTerm || ''} onClose={() => setGlossaryTerm(null)} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, gap: 12, maxHeight: '90%' },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { flex: 1, fontFamily: MindSprintFonts.heading, fontSize: 19, lineHeight: 25 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  heading: { fontFamily: MindSprintFonts.title, fontSize: 15.5, lineHeight: 21, marginBottom: 4 },
  body: { fontSize: 14, lineHeight: 21 },
  box: { padding: 12, borderRadius: 14, borderWidth: 1, gap: 6 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 20 },
  qText: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  aText: { fontSize: 13.5, lineHeight: 19 },
  termRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  termChip: { paddingHorizontal: 10, minHeight: 32, justifyContent: 'center', borderRadius: 10 },
  termText: { fontSize: 13, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10 },
  secondaryBtn: { flex: 1, minHeight: 48, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { flex: 1, minHeight: 48, borderRadius: 14, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontFamily: MindSprintFonts.label, fontSize: 15 },
});
