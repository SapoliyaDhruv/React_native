import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { SamplePaper } from '@/constants/academicData';
import { ApiService } from '@/services/api';
import { openPdfUrl } from './chapterLinks';

interface Props {
  grade: string;
  board: string;
  /** Class 11/12: only show papers for these subjects (the student's stream). */
  subjectNames?: string[];
}

/** Full 80-mark exam entry plus official sample / previous papers. */
export const BoardPapersView: React.FC<Props> = ({ grade, board, subjectNames }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const { tr, isGujarati } = useLanguage();
  const [papers, setPapers] = useState<SamplePaper[]>([]);

  useEffect(() => {
    let active = true;
    ApiService.getSamplePapers(grade, board)
      .then((p) => { if (active) setPapers(subjectNames ? p.filter((x) => subjectNames.some((n) => n.toLowerCase() === x.subject.toLowerCase())) : p); })
      .catch(() => { if (active) setPapers([]); });
    return () => { active = false; };
  }, [grade, board, subjectNames?.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={{ gap: 12 }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/board-exam-simulator' as any)}
        style={[styles.hero, { backgroundColor: colors.heroSurface }]}
        accessibilityRole="button"
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.heroTitle, { color: colors.onHeroSurface }]}>
            {tr('Full board exam paper', 'સંપૂર્ણ બોર્ડ પરીક્ષા પેપર')}
          </Text>
          <Text style={[styles.heroSub, { color: colors.onHeroSurfaceVariant }]}>
            {tr('80 marks · 3 hours · sections A to D', '80 ગુણ · 3 કલાક · વિભાગ A થી D')}
          </Text>
        </View>
        <MaterialIcons name="arrow-forward" size={22} color={colors.accent} />
      </TouchableOpacity>

      {papers.length === 0 ? (
        <View style={[styles.card, styles.empty, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
          <MaterialIcons name="description" size={32} color={colors.onSurfaceVariant} />
          <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
            {tr('No sample papers for this class yet. Try the full board exam paper above.', 'આ ધોરણ માટે હજુ નમૂના પેપર નથી. ઉપરનું બોર્ડ પરીક્ષા પેપર અજમાવો.')}
          </Text>
        </View>
      ) : (
        papers.map((paper) => (
          <View key={paper.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
            <Text style={[styles.meta, { color: colors.onSurfaceVariant }]}>
              {[paper.year, `${paper.durationMinutes} min`, `${paper.totalMarks} ${tr('marks', 'ગુણ')}`].filter(Boolean).join(' · ')}
            </Text>
            <Text style={[styles.title, { color: colors.onSurface }]}>
              {(isGujarati && paper.titleGujarati) || paper.title}
            </Text>
            <View style={styles.actions}>
              {paper.officialPdfUrl ? (
                <TouchableOpacity style={[styles.btn, { borderColor: colors.outlineVariant }]} onPress={() => openPdfUrl(paper.officialPdfUrl, colors.primary, tr)}>
                  <MaterialIcons name="picture-as-pdf" size={16} color={colors.primary} />
                  <Text style={[styles.btnText, { color: colors.primary }]}>{tr('Paper', 'પેપર')}</Text>
                </TouchableOpacity>
              ) : null}
              {paper.solutionPdfUrl ? (
                <TouchableOpacity style={[styles.btn, { borderColor: colors.outlineVariant }]} onPress={() => openPdfUrl(paper.solutionPdfUrl, colors.primary, tr)}>
                  <MaterialIcons name="done-all" size={16} color={colors.tertiary} />
                  <Text style={[styles.btnText, { color: colors.tertiary }]}>{tr('Solutions', 'ઉકેલ')}</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => router.push(`/exam?limit=${Math.min(paper.questionCount || 25, 25)}&category=${encodeURIComponent(paper.subject)}` as any)}
              >
                <MaterialIcons name="play-arrow" size={16} color={colors.onPrimary} />
                <Text style={[styles.btnText, { color: colors.onPrimary }]}>{tr('Practise', 'પ્રેક્ટિસ')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, borderRadius: 18 },
  heroTitle: { fontFamily: MindSprintFonts.heading, fontSize: 18, lineHeight: 24 },
  heroSub: { fontSize: 13, marginTop: 2 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 8 },
  empty: { alignItems: 'center', paddingVertical: 24 },
  emptyText: { fontSize: 14, textAlign: 'center' },
  meta: { fontSize: 12.5, fontWeight: '600' },
  title: { fontFamily: MindSprintFonts.title, fontSize: 16, lineHeight: 22 },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 40, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  btnText: { fontFamily: MindSprintFonts.label, fontSize: 14 },
});
