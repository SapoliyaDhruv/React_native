import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface Props {
  title: string;
  subtitle?: string;
  /** Leading icon: back arrow by default, `close` for exits that end a session. */
  leadingIcon?: IconName;
  onBack?: () => void;
  /** Optional element on the right (a pill, an icon button, etc.). */
  right?: React.ReactNode;
}

/**
 * Shared header for stack screens: 40px back button, Baloo title,
 * plain surface with a hairline bottom border.
 */
export const ScreenHeader: React.FC<Props> = ({ title, subtitle, leadingIcon = 'arrow-back', onBack, right }) => {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
      <TouchableOpacity
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/(tabs)')))}
        style={styles.backBtn}
        accessibilityRole="button"
        accessibilityLabel={leadingIcon === 'close' ? 'Close' : 'Go back'}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <MaterialIcons name={leadingIcon} size={24} color={colors.onSurface} />
      </TouchableOpacity>
      <View style={styles.titleCol}>
        <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
};

/** Small icon button sized to sit in the header's right slot. */
export const HeaderIconButton: React.FC<{ icon: IconName; onPress: () => void; label: string; color?: string }> = ({ icon, onPress, label, color }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={styles.backBtn} accessibilityRole="button" accessibilityLabel={label}>
      <MaterialIcons name={icon} size={24} color={color ?? colors.onSurface} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 60,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 20,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 12.5,
    marginTop: -1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 8,
  },
});
