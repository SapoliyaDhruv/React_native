import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { SubjectChapter } from '@/constants/academicData';

interface Props {
  chapter: SubjectChapter;
  done: boolean;
  bookmarked: boolean;
  savedOffline: boolean;
  isFirst: boolean;
  onOpen: () => void;
  onToggleBookmark: () => void;
}

/** One line per chapter: number (or done tick), title, video length, bookmark. Tap opens the chapter page. */
export const ChapterRow: React.FC<Props> = ({ chapter, done, bookmarked, savedOffline, isFirst, onOpen, onToggleBookmark }) => {
  const { colors } = useTheme();
  const { tr, isGujarati } = useLanguage();
  const title = isGujarati && chapter.titleGujarati ? chapter.titleGujarati : chapter.title;
  const duration = chapter.videos?.[0]?.duration;

  return (
    <View style={[styles.row, !isFirst && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.outlineVariant }]}>
     <TouchableOpacity
      activeOpacity={0.7}
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`${tr('Chapter', 'પ્રકરણ')} ${chapter.chapterNumber}, ${title}${done ? `, ${tr('done', 'પૂર્ણ')}` : ''}`}
      style={styles.main}
     >
      <View style={[styles.num, { backgroundColor: done ? colors.tertiary : colors.surfaceContainerLow }]}>
        {done ? (
          <MaterialIcons name="check" size={18} color={colors.onTertiary} />
        ) : (
          <Text style={[styles.numText, { color: colors.onSurfaceVariant }]}>{chapter.chapterNumber}</Text>
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          {duration ? (
            <>
              <MaterialIcons name="play-circle-outline" size={14} color={colors.onSurfaceVariant} />
              <Text style={[styles.meta, { color: colors.onSurfaceVariant }]}>{duration}</Text>
            </>
          ) : (
            <Text style={[styles.meta, { color: colors.onSurfaceVariant }]}>{tr('No video yet', 'હજુ વિડિયો નથી')}</Text>
          )}
          {savedOffline && (
            <>
              <MaterialIcons name="offline-pin" size={14} color={colors.tertiary} />
              <Text style={[styles.meta, { color: colors.tertiary }]}>{tr('Offline', 'ઑફલાઇન')}</Text>
            </>
          )}
        </View>
      </View>
     </TouchableOpacity>
      <TouchableOpacity
        onPress={onToggleBookmark}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.bookmark}
        accessibilityRole="button"
        accessibilityLabel={bookmarked ? tr('Remove bookmark', 'બુકમાર્ક દૂર કરો') : tr('Bookmark chapter', 'પ્રકરણ બુકમાર્ક કરો')}
      >
        <MaterialIcons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color={bookmarked ? colors.primary : colors.outline} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onOpen} accessibilityElementsHidden importantForAccessibility="no" style={styles.chevron}>
        <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 68, paddingRight: 6 },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 14, paddingVertical: 10, minWidth: 0 },
  chevron: { height: 44, justifyContent: 'center' },
  num: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: MindSprintFonts.label, fontSize: 14 },
  title: { fontFamily: MindSprintFonts.title, fontSize: 16, lineHeight: 21 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  meta: { fontSize: 12.5, marginRight: 6 },
  bookmark: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
