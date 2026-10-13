import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MindSprintShadows } from '../../constants/mindsprintTheme';
import { TrackType } from '../../constants/mindsprintData';
import { useTheme } from '../../context/ThemeContext';

interface TrackSwitcherProps {
  activeTrack: TrackType;
  onSelectTrack: (track: TrackType) => void;
}

type TrackOption = {
  id: TrackType;
  label: string;
  emoji: string;
};

const tracks: TrackOption[] = [
  { id: 'placement', label: 'Placement Prep', emoji: '🎯' },
  { id: 'it_skills', label: 'IT Skill Hub', emoji: '💻' },
  { id: 'school', label: 'School (1-12)', emoji: '🎓' },
];

export const TrackSwitcher: React.FC<TrackSwitcherProps> = ({
  activeTrack,
  onSelectTrack,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tracks.map((track) => {
          const isActive = activeTrack === track.id;
          return (
            <TouchableOpacity
              key={track.id}
              activeOpacity={0.8}
              onPress={() => onSelectTrack(track.id)}
              style={[
                styles.trackChip,
                isActive
                  ? { backgroundColor: '#3525cd' }
                  : {
                      backgroundColor: colors.surfaceContainerLowest,
                      borderColor: colors.outlineVariant,
                      borderWidth: 1,
                    },
                isActive && MindSprintShadows.glow,
              ]}
            >
              <Text style={styles.emojiText}>{track.emoji}</Text>
              <Text
                style={[
                  styles.labelText,
                  { color: isActive ? '#ffffff' : colors.onSurface },
                ]}
              >
                {track.label}
              </Text>
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
    gap: 10,
    paddingRight: 16,
  },
  trackChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    gap: 8,
  },
  emojiText: {
    fontSize: 14,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
