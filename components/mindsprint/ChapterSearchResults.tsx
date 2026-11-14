import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import type { AcademicSubject, SubjectChapter } from '@/constants/academicData';

export type ChapterSearchHit = { subject: AcademicSubject; chapter: SubjectChapter };

interface Props {
  query: string;
  hits: ChapterSearchHit[];
  gujarati: boolean;
  onWatch: (hit: ChapterSearchHit) => void;
  onPdf: (hit: ChapterSearchHit) => void;
  onOpenSubject: (hit: ChapterSearchHit) => void;
  onClear: () => void;
}

/** Case-insensitive match on chapter title, Gujarati title, subject name or chapter number. */
export function searchChapters(subjects: AcademicSubject[], query: string): ChapterSearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: ChapterSearchHit[] = [];
  for (const subject of subjects) {
    const subjectText = `${subject.name} ${subject.nameGujarati || ''}`.toLowerCase();
    for (const chapter of subject.chapters) {
      const text = `${chapter.title} ${chapter.titleGujarati || ''} ${subjectText} ${chapter.chapterNumber}`.toLowerCase();
      if (q.split(/\s+/).every((word) => text.includes(word))) hits.push({ subject, chapter });
    }
  }
  return hits;
}

export const ChapterSearchResults: React.FC<Props> = ({ query, hits, gujarati, onWatch, onPdf, onOpenSubject, onClear }) => {
  const { colors, isDarkMode } = useTheme();
  const cardBg = isDarkMode ? colors.surfaceContainerLowest : '#ffffff';

  if (hits.length === 0) {
    return (
      <View style={styles.empty}>
        <MaterialIcons name="search-off" size={36} color={colors.onSurfaceVariant} />
        <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>No chapters match “{query}”</Text>
        <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
          Try a shorter word, a chapter number, or the subject name.
        </Text>
        <TouchableOpacity onPress={onClear} accessibilityRole="button" style={[styles.clearBtn, { borderColor: colors.primary }]}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>Clear search</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 16, gap: 10 }}>
      <Text style={[styles.count, { color: colors.onSurfaceVariant }]}>
        {hits.length} chapter{hits.length === 1 ? '' : 's'} found
      </Text>
      {hits.map((hit) => {
        const { subject, chapter } = hit;
        const title = gujarati && chapter.titleGujarati ? chapter.titleGujarati : chapter.title;
        const subjectName = gujarati && subject.nameGujarati ? subject.nameGujarati : subject.name;
        const video = chapter.videos?.[0];
        return (
          <View key={`${subject.id}-${chapter.id}`} style={[styles.card, { backgroundColor: cardBg, borderColor: colors.outlineVariant }]}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => onOpenSubject(hit)} accessibilityRole="button" accessibilityLabel={`Open ${subjectName}`}>
              <Text style={[styles.subject, { color: subject.color }]}>{subjectName}</Text>
              <Text style={[styles.title, { color: colors.onSurface }]}>
                {chapter.chapterNumber}. {title}
              </Text>
              {video ? (
                <Text style={[styles.meta, { color: colors.onSurfaceVariant }]}>
                  🎬 {video.duration} · {video.teacher}
                </Text>
              ) : null}
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => onWatch(hit)} accessibilityRole="button" style={[styles.btn, { backgroundColor: '#ef4444' }]}>
                <MaterialIcons name="smart-display" size={18} color="#ffffff" />
                <Text style={styles.btnText}>Watch</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPdf(hit)} accessibilityRole="button" style={[styles.btn, { backgroundColor: isDarkMode ? 'rgba(239,68,68,0.15)' : '#fee2e2', borderWidth: 1, borderColor: '#ef4444' }]}>
                <MaterialIcons name="picture-as-pdf" size={18} color="#ef4444" />
                <Text style={[styles.btnText, { color: '#ef4444' }]}>PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  count: { fontSize: 12, fontWeight: '600' },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 10 },
  subject: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  meta: { fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44, borderRadius: 10 },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  empty: { alignItems: 'center', padding: 32, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  emptyText: { fontSize: 13, textAlign: 'center' },
  clearBtn: { marginTop: 8, borderWidth: 1, borderRadius: 10, paddingHorizontal: 18, minHeight: 44, justifyContent: 'center' },
});
