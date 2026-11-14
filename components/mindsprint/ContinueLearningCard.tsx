import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import type { LastChapter } from '@/services/learningProgress';

interface Props {
  last: LastChapter;
  gujarati: boolean;
  onPress: () => void;
}

const ACTION_LABEL: Record<LastChapter['action'], string> = {
  video: 'You were watching',
  pdf: 'You were reading',
  notes: 'You were studying',
};

export const ContinueLearningCard: React.FC<Props> = ({ last, gujarati, onPress }) => {
  const { colors, isDarkMode } = useTheme();
  const title = gujarati && last.titleGujarati ? last.titleGujarati : last.title;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Continue with chapter ${last.chapterNumber}, ${title}`}
      style={[styles.card, { backgroundColor: isDarkMode ? 'rgba(99,102,241,0.18)' : '#eef2ff', borderColor: colors.primary }]}
    >
      <View style={[styles.icon, { backgroundColor: colors.primary }]}>
        <MaterialIcons name={last.action === 'video' ? 'play-arrow' : 'menu-book'} size={22} color="#ffffff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.kicker, { color: colors.onSurfaceVariant }]}>
          {ACTION_LABEL[last.action]} · {last.subjectName}
        </Text>
        <Text numberOfLines={2} style={[styles.title, { color: colors.onSurface }]}>
          {last.chapterNumber}. {title}
        </Text>
      </View>
      <Text style={[styles.cta, { color: colors.primary }]}>Continue</Text>
      <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1, marginHorizontal: 16, marginBottom: 12 },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  kicker: { fontSize: 11, fontWeight: '600' },
  title: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  cta: { fontSize: 13, fontWeight: '700' },
});
