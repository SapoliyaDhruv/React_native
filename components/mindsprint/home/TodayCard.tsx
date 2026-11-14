import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintFonts, MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface Action {
  label: string;
  icon: IconName;
  onPress: () => void;
}

interface Props {
  /** Small context line, e.g. "ગણિત · Chapter 3" */
  context: string;
  title: string;
  subtitle?: string;
  primary: Action;
  secondary?: Action;
}

/** The one dark, high-emphasis card on Home: what to study right now. */
export const TodayCard: React.FC<Props> = ({ context, title, subtitle, primary, secondary }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.heroSurface }, MindSprintShadows.glow]}>
      <Text style={[styles.context, { color: colors.onHeroSurfaceVariant }]} numberOfLines={1}>
        {context}
      </Text>
      <Text style={[styles.title, { color: colors.onHeroSurface }]} numberOfLines={3}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.onHeroSurfaceVariant }]} numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={primary.onPress}
          accessibilityRole="button"
          style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
        >
          <MaterialIcons name={primary.icon} size={20} color={colors.onAccent} />
          <Text style={[styles.primaryText, { color: colors.onAccent }]}>{primary.label}</Text>
        </TouchableOpacity>
        {secondary ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={secondary.onPress}
            accessibilityRole="button"
            style={styles.secondaryBtn}
          >
            <MaterialIcons name={secondary.icon} size={18} color="#ffffff" />
            <Text style={styles.secondaryText}>{secondary.label}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 20,
    marginHorizontal: 16,
  },
  context: {
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontFamily: MindSprintFonts.display,
    fontSize: 26,
    lineHeight: 34,
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  primaryText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 16,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  secondaryText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 15,
    color: '#ffffff',
  },
});
