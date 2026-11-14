import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { AcademicSubject } from '@/constants/academicData';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { subjectTone } from '@/constants/subjectTones';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  subjects: AcademicSubject[];
  gujarati: boolean;
  completedIds: string[];
  onOpen: (subject: AcademicSubject) => void;
}

// Shrink the cover title when a single word would not fit the cover width.
const isLongName = (name: string) =>
  name.length > 14 || name.split(/\s+/).some((w) => w.length > 9);

/**
 * The Home screen's signature element: each subject is a textbook cover on a
 * shelf. The spine on the left and the progress ribbon at the bottom make it
 * read as a physical book; tapping opens that subject in Courses.
 */
export const TextbookShelf: React.FC<Props> = ({ subjects, gujarati, completedIds, onOpen }) => {
  const { colors } = useTheme();
  const { tr } = useLanguage();

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {subjects.map((sub) => {
          const tone = subjectTone(sub.id);
          const total = sub.chapters?.length || 0;
          const done = (sub.chapters || []).filter((c) => completedIds.includes(c.id)).length;
          const pct = total ? done / total : 0;
          const name = gujarati && sub.nameGujarati ? sub.nameGujarati.replace(/\s*\(.*\)\s*/, '') : sub.name;
          const secondary = gujarati && sub.nameGujarati ? sub.name : null;

          return (
            <TouchableOpacity
              key={sub.id}
              activeOpacity={0.85}
              onPress={() => onOpen(sub)}
              accessibilityRole="button"
              accessibilityLabel={tr(`${sub.name}, ${total} chapters, ${done} done`, `${name}, ${total} પ્રકરણ, ${done} પૂરાં`)}
              style={[styles.book, { backgroundColor: tone.cover }]}
            >
              <View style={[styles.spine, { backgroundColor: tone.spine }]} />
              <View style={styles.cover}>
                <MaterialIcons name={tone.icon as any} size={22} color="rgba(255,255,255,0.85)" />
                <View style={{ flex: 1 }} />
                <Text style={[styles.name, isLongName(name) && styles.nameLong]} numberOfLines={3}>
                  {name}
                </Text>
                {secondary ? (
                  <Text style={styles.secondary} numberOfLines={1}>
                    {secondary}
                  </Text>
                ) : null}
                <Text style={styles.meta}>
                  {done > 0 ? tr(`${done}/${total} done`, `${done}/${total} પૂરાં`) : tr(`${total} chapters`, `${total} પ્રકરણ`)}
                </Text>
              </View>
              <View style={styles.ribbonTrack}>
                <View style={[styles.ribbonFill, { width: `${Math.max(pct * 100, pct > 0 ? 6 : 0)}%`, backgroundColor: colors.accent }]} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {/* The shelf itself */}
      <View style={[styles.shelf, { backgroundColor: colors.outlineVariant }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 2,
  },
  book: {
    width: 118,
    height: 160,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  spine: {
    width: 9,
  },
  cover: {
    flex: 1,
    paddingHorizontal: 11,
    paddingTop: 12,
    paddingBottom: 14,
  },
  name: {
    fontFamily: MindSprintFonts.heading,
    color: '#ffffff',
    fontSize: 17,
    lineHeight: 22,
  },
  nameLong: {
    fontSize: 14.5,
    lineHeight: 19,
  },
  secondary: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11.5,
    marginTop: 1,
  },
  meta: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 6,
  },
  ribbonTrack: {
    position: 'absolute',
    left: 9,
    right: 0,
    bottom: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  ribbonFill: {
    height: 4,
  },
  shelf: {
    height: 6,
    marginHorizontal: 10,
    marginTop: 0,
    borderRadius: 3,
  },
});
