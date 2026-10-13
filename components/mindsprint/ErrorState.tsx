import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  iconName?: keyof typeof MaterialIcons.glyphMap;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  message = 'Please check your connection and try again.',
  onRetry,
  iconName = 'wifi-off',
}) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: isDarkMode ? 'rgba(239,68,68,0.15)' : '#fee2e2' },
        ]}
      >
        <MaterialIcons name={iconName} size={36} color="#ef4444" />
      </View>
      <Text style={[styles.title, { color: colors.onSurface }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.onSurfaceVariant }]}>{message}</Text>

      {onRetry && (
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
          onPress={onRetry}
        >
          <MaterialIcons name="refresh" size={18} color="#ffffff" />
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: 280,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    maxWidth: 280,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
