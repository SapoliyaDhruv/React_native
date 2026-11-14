import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { ImportantQuestion } from '@/constants/academicData';
import { ApiService } from '@/services/api';

interface Props {
  grade: string;
  subjectName?: string;
}

/** Board questions that come up often, filterable by marks, with model answers. */
export const ImportantQuestionsView: React.FC<Props> = ({ grade, subjectName }) => {
  const { colors } = useTheme();
  const { tr, isGujarati } = useLanguage();
  const [marks, setMarks] = useState<number | null>(null);
  const [questions, setQuestions] = useState<ImportantQuestion[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    ApiService.getImportantQuestions(grade, subjectName, marks || undefined)
      .then((qs) => { if (active) setQuestions(qs); })
      .catch(() => { if (active) setQuestions([]); });
    return () => { active = false; };
  }, [grade, subjectName, marks]);

  const filters = [
    { marks: null, label: tr('All', 'બધા') },
    { marks: 1, label: tr('1 mark', '1 ગુણ') },
    { marks: 2, label: tr('2 marks', '2 ગુણ') },
    { marks: 3, label: tr('3 marks', '3 ગુણ') },
    { marks: 4, label: tr('4 marks', '4 ગુણ') },
  ];

  return (
    <View style={{ gap: 12 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {filters.map((f) => {
          const selected = marks === f.marks;
          return (
            <TouchableOpacity
              key={f.label}
              onPress={() => setMarks(f.marks)}
              style={[styles.chip, { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.outlineVariant }]}
            >
              <Text style={[styles.chipText, { color: selected ? colors.onPrimary : colors.onSurface }]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {questions.length === 0 ? (
        <View style={[styles.card, styles.empty, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
          <MaterialIcons name="star-outline" size={32} color={colors.onSurfaceVariant} />
          <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
            {tr('No questions for this filter yet. Try "All".', 'આ પસંદગી માટે હજુ પ્રશ્નો નથી. "બધા" પસંદ કરો.')}
          </Text>
        </View>
      ) : (
        questions.map((q) => {
          const open = expanded.includes(q.id);
          const qText = (isGujarati && q.questionTextGujarati) || q.questionText;
          const answer = (isGujarati && q.modelAnswerGujarati) || q.modelAnswer;
          const chTitle = (isGujarati && q.chapterTitleGujarati) || q.chapterTitle;
          const tip = (isGujarati && q.examinerTipsGujarati) || q.examinerTips;
          return (
            <View key={q.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: open ? colors.primary : colors.outlineVariant }]}>
              <View style={styles.metaRow}>
                <View style={[styles.marks, { backgroundColor: colors.primaryFixed }]}>
                  <Text style={[styles.marksText, { color: colors.primary }]}>
                    {tr(`${q.marks} ${q.marks === 1 ? 'mark' : 'marks'}`, `${q.marks} ગુણ`)}
                  </Text>
                </View>
                <Text style={[styles.chap, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                  {tr('Ch', 'પ્ર.')} {q.chapterNumber}: {chTitle}
                </Text>
              </View>
              {q.frequentlyAskedYears && q.frequentlyAskedYears.length > 0 && (
                <Text style={[styles.years, { color: colors.onAccentContainer }]}>
                  {tr('Asked in', 'પૂછાયેલ')} {q.frequentlyAskedYears.slice(0, 3).join(', ')}
                </Text>
              )}
              <Text style={[styles.qText, { color: colors.onSurface }]}>{qText}</Text>
              <TouchableOpacity
                onPress={() => setExpanded((p) => (p.includes(q.id) ? p.filter((x) => x !== q.id) : [...p, q.id]))}
                style={[styles.toggle, { borderColor: colors.outlineVariant }]}
                accessibilityRole="button"
              >
                <Text style={[styles.toggleText, { color: colors.primary }]}>
                  {open ? tr('Hide answer', 'જવાબ છુપાવો') : tr('Show model answer', 'આદર્શ જવાબ જુઓ')}
                </Text>
                <MaterialIcons name={open ? 'expand-less' : 'expand-more'} size={20} color={colors.primary} />
              </TouchableOpacity>
              {open && (
                <View style={[styles.answer, { backgroundColor: colors.surfaceContainerLow }]}>
                  <Text style={[styles.ansHead, { color: colors.tertiary }]}>{tr('Model answer', 'આદર્શ જવાબ')}</Text>
                  <Text style={[styles.ansText, { color: colors.onSurface }]}>{answer}</Text>
                  {(q.stepWiseMarking || []).length > 0 && (
                    <>
                      <Text style={[styles.ansHead, { color: colors.primary }]}>{tr('Marks for each step', 'દરેક પગલાના ગુણ')}</Text>
                      {q.stepWiseMarking!.map((step) => (
                        <View key={step.stepNumber} style={styles.stepRow}>
                          <Text style={[styles.stepMarks, { color: colors.primary }]}>+{step.marksAllocated}</Text>
                          <Text style={[styles.ansText, { color: colors.onSurface, flex: 1 }]}>
                            {(isGujarati && step.textGujarati) || step.text}
                          </Text>
                        </View>
                      ))}
                    </>
                  )}
                  {tip ? (
                    <View style={[styles.tip, { backgroundColor: colors.accentContainer }]}>
                      <MaterialIcons name="lightbulb-outline" size={16} color={colors.onAccentContainer} />
                      <Text style={[styles.ansText, { color: colors.onAccentContainer, flex: 1 }]}>{tip}</Text>
                    </View>
                  ) : null}
                </View>
              )}
            </View>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 14, minHeight: 36, justifyContent: 'center', borderRadius: 18, borderWidth: 1 },
  chipText: { fontFamily: MindSprintFonts.label, fontSize: 14 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  empty: { alignItems: 'center', paddingVertical: 24 },
  emptyText: { fontSize: 14, textAlign: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  marks: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  marksText: { fontFamily: MindSprintFonts.label, fontSize: 12.5 },
  chap: { flex: 1, fontSize: 12.5 },
  years: { fontSize: 12.5, fontWeight: '600' },
  qText: { fontFamily: MindSprintFonts.title, fontSize: 16, lineHeight: 23 },
  toggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 42, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  toggleText: { fontFamily: MindSprintFonts.label, fontSize: 14 },
  answer: { padding: 12, borderRadius: 12, gap: 8 },
  ansHead: { fontFamily: MindSprintFonts.label, fontSize: 14 },
  ansText: { fontSize: 14, lineHeight: 20 },
  stepRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  stepMarks: { fontFamily: MindSprintFonts.label, fontSize: 14, minWidth: 24 },
  tip: { flexDirection: 'row', gap: 8, padding: 10, borderRadius: 10, alignItems: 'flex-start' },
});
