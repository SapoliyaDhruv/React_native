import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';

export interface ToolItem {
  key: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
}

/** A single grouped list of tools — one calm card instead of rainbow tiles. */
export const ToolList: React.FC<{ items: ToolItem[] }> = ({ items }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
      {items.map((item, i) => (
        <TouchableOpacity
          key={item.key}
          activeOpacity={0.7}
          onPress={item.onPress}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}. ${item.subtitle}`}
          style={[
            styles.row,
            i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.outlineVariant },
          ]}
        >
          <View style={[styles.iconBox, { backgroundColor: colors.primaryFixed }]}>
            <MaterialIcons name={item.icon} size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.onSurface }]}>{item.title}</Text>
            <Text style={[styles.sub, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
              {item.subtitle}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: MindSprintFonts.title,
    fontSize: 15.5,
    lineHeight: 21,
  },
  sub: {
    fontSize: 12.5,
    marginTop: 1,
  },
});
