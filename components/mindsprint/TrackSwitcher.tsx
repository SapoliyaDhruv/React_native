import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintFonts } from '../../constants/mindsprintTheme';
import { TrackType } from '../../constants/mindsprintData';
import { useTheme } from '../../context/ThemeContext';

interface TrackSwitcherProps {
  activeTrack: TrackType;
  onSelectTrack: (track: TrackType) => void;
}

type TrackOption = {
  id: TrackType;
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
};

const tracks: TrackOption[] = [
  { id: 'placement', label: 'Placement prep', icon: 'work-outline' },
  { id: 'it_skills', label: 'IT skills', icon: 'computer' },
  { id: 'school', label: 'School (Class 7–12)', icon: 'school' },
];

export const TrackSwitcher: React.FC<TrackSwitcherProps> = ({ activeTrack, onSelectTrack }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tracks.map((track) => {
          const isActive = activeTrack === track.id;
          return (
            <TouchableOpacity
              key={track.id}
              activeOpacity={0.8}
              onPress={() => onSelectTrack(track.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              style={[
                styles.trackChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  borderColor: isActive ? colors.primary : colors.outlineVariant,
                },
              ]}
            >
              <MaterialIcons name={track.icon} size={18} color={isActive ? colors.onPrimary : colors.primary} />
              <Text style={[styles.labelText, { color: isActive ? colors.onPrimary : colors.onSurface }]}>{track.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  trackChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    minHeight: 40,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  labelText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 14,
  },
});
