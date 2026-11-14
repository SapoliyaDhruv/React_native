import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import type { LastChapter } from '@/services/learningProgress';

interface Props {
  last: LastChapter;
  onPress: () => void;
}

/** "Continue where you left off" row used on Courses and Lectures. */
export const ContinueLearningCard: React.FC<Props> = ({ last, onPress }) => {
  const { colors } = useTheme();
  const { tr, isGujarati } = useLanguage();
  const title = isGujarati && last.titleGujarati ? last.titleGujarati : last.title;
  const kicker =
    last.action === 'video'
      ? tr('You were watching', 'તમે જોઈ રહ્યા હતા')
      : last.action === 'pdf'
        ? tr('You were reading', 'તમે વાંચી રહ્યા હતા')
        : tr('You were studying', 'તમે અભ્યાસ કરી રહ્યા હતા');
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${tr('Continue with chapter', 'પ્રકરણ ચાલુ રાખો')} ${last.chapterNumber}, ${title}`}
      style={[styles.card, { backgroundColor: colors.primaryFixed }]}
    >
      <View style={[styles.icon, { backgroundColor: colors.primary }]}>
        <MaterialIcons name={last.action === 'video' ? 'play-arrow' : 'menu-book'} size={22} color={colors.onPrimary} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.kicker, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
          {kicker} · {last.subjectName}
        </Text>
        <Text numberOfLines={2} style={[styles.title, { color: colors.onSurface }]}>
          {last.chapterNumber}. {title}
        </Text>
      </View>
      <Text style={[styles.cta, { color: colors.primary }]}>{tr('Continue', 'ચાલુ રાખો')}</Text>
      <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, minHeight: 64 },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  kicker: { fontSize: 12.5, fontWeight: '600' },
  title: { fontFamily: MindSprintFonts.title, fontSize: 15.5, lineHeight: 21, marginTop: 1 },
  cta: { fontFamily: MindSprintFonts.label, fontSize: 14 },
});
