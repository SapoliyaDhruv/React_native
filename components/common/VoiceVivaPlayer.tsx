import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useTheme } from '@/context/ThemeContext';

interface VoiceVivaPlayerProps {
  textToRead: string;
  label?: string;
  size?: 'small' | 'medium';
}

export const VoiceVivaPlayer: React.FC<VoiceVivaPlayerProps> = ({
  textToRead,
  label = 'Listen',
  size = 'small',
}) => {
  const { colors, isDarkMode } = useTheme();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      } else {
        Speech.stop();
      }
    };
  }, []);

  const handleToggleSpeak = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        const cleanText = textToRead.replace(/[*_#`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
      }
    } else {
      if (isPlaying) {
        Speech.stop();
        setIsPlaying(false);
      } else {
        Speech.stop();
        setIsPlaying(true);
        const cleanText = textToRead.replace(/[*_#`]/g, '');
        Speech.speak(cleanText, {
          rate: 0.95,
          pitch: 1.0,
          onStart: () => setIsPlaying(true),
          onDone: () => setIsPlaying(false),
          onStopped: () => setIsPlaying(false),
          onError: () => setIsPlaying(false),
        });
      }
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor: isPlaying
            ? 'rgba(18, 128, 92, 0.15)'
            : isDarkMode
            ? colors.surfaceContainerHigh
            : '#EEF2F8',
          borderColor: isPlaying ? '#12805C' : colors.outlineVariant,
        },
      ]}
      onPress={handleToggleSpeak}
    >
      <MaterialIcons
        name={isPlaying ? 'volume-up' : 'volume-down'}
        size={size === 'small' ? 16 : 18}
        color={isPlaying ? '#12805C' : colors.primary}
      />
      <Text
        style={[
          styles.labelText,
          { color: isPlaying ? '#0B5C42' : colors.primary },
        ]}
      >
        {isPlaying ? 'Speaking... 🗣️' : label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    alignSelf: 'flex-start',
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
