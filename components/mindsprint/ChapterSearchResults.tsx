import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { subjectTone } from '@/constants/subjectTones';
import type { AcademicSubject, SubjectChapter } from '@/constants/academicData';

export type ChapterSearchHit = { subject: AcademicSubject; chapter: SubjectChapter };

interface Props {
  query: string;
  hits: ChapterSearchHit[];
  onOpenChapter: (hit: ChapterSearchHit) => void;
  onWatch: (hit: ChapterSearchHit) => void;
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

/** Search results across every subject: tap a result to open its chapter page, or play its video. */
export const ChapterSearchResults: React.FC<Props> = ({ query, hits, onOpenChapter, onWatch, onClear }) => {
  const { colors } = useTheme();
  const { tr, isGujarati } = useLanguage();

  if (hits.length === 0) {
    return (
      <View style={styles.empty}>
        <MaterialIcons name="search-off" size={36} color={colors.onSurfaceVariant} />
        <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
          {tr(`No chapters match “${query}”`, `“${query}” માટે કોઈ પ્રકરણ મળ્યું નહીં`)}
        </Text>
        <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
          {tr('Try a shorter word, a chapter number, or the subject name.', 'ટૂંકો શબ્દ, પ્રકરણ નંબર કે વિષયનું નામ લખો.')}
        </Text>
        <TouchableOpacity onPress={onClear} accessibilityRole="button" style={[styles.clearBtn, { borderColor: colors.primary }]}>
          <Text style={[styles.clearText, { color: colors.primary }]}>{tr('Clear search', 'શોધ સાફ કરો')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ gap: 10 }}>
      <Text style={[styles.count, { color: colors.onSurfaceVariant }]}>
        {tr(`${hits.length} chapter${hits.length === 1 ? '' : 's'} found`, `${hits.length} પ્રકરણ મળ્યાં`)}
      </Text>
      <View style={[styles.list, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
        {hits.map((hit, i) => {
          const { subject, chapter } = hit;
          const title = isGujarati && chapter.titleGujarati ? chapter.titleGujarati : chapter.title;
          const subjectName = isGujarati && subject.nameGujarati ? subject.nameGujarati : subject.name;
          const video = chapter.videos?.[0];
          return (
            <View
              key={`${subject.id}-${chapter.id}`}
              style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.outlineVariant }]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onOpenChapter(hit)}
                accessibilityRole="button"
                accessibilityLabel={`${subjectName}, ${tr('chapter', 'પ્રકરણ')} ${chapter.chapterNumber}, ${title}`}
                style={{ flex: 1, minWidth: 0, paddingVertical: 4 }}
              >
                <Text style={[styles.subject, { color: subjectTone(subject.id).cover }]} numberOfLines={1}>{subjectName}</Text>
                <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={2}>
                  {chapter.chapterNumber}. {title}
                </Text>
              </TouchableOpacity>
              {video ? (
                <TouchableOpacity
                  onPress={() => onWatch(hit)}
                  accessibilityRole="button"
                  accessibilityLabel={tr('Watch video', 'વિડિયો જુઓ')}
                  style={[styles.watch, { backgroundColor: colors.primary }]}
                >
                  <MaterialIcons name="play-arrow" size={18} color={colors.onPrimary} />
                  <Text style={[styles.watchText, { color: colors.onPrimary }]}>{video.duration}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  count: { fontSize: 13, fontWeight: '600' },
  list: { borderWidth: 1, borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 64, paddingHorizontal: 14, paddingVertical: 10 },
  subject: { fontFamily: MindSprintFonts.label, fontSize: 12.5 },
  title: { fontFamily: MindSprintFonts.title, fontSize: 15.5, lineHeight: 21 },
  watch: { flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 36, paddingHorizontal: 10, borderRadius: 18 },
  watchText: { fontFamily: MindSprintFonts.label, fontSize: 13 },
  empty: { alignItems: 'center', padding: 32, gap: 8 },
  emptyTitle: { fontFamily: MindSprintFonts.title, fontSize: 16, textAlign: 'center' },
  emptyText: { fontSize: 13.5, textAlign: 'center' },
  clearBtn: { marginTop: 8, borderWidth: 1, borderRadius: 12, paddingHorizontal: 18, minHeight: 44, justifyContent: 'center' },
  clearText: { fontFamily: MindSprintFonts.label, fontSize: 15 },
});
