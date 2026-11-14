import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  checking?: boolean;
  onRetry: () => void;
}

/** Shown only when the MindSprint server cannot be reached. Videos still play; chapter PDFs need the server. */
export const ServerStatusBanner: React.FC<Props> = ({ checking, onRetry }) => {
  const { isDarkMode } = useTheme();
  return (
    <View
      accessibilityRole="alert"
      style={[styles.box, { backgroundColor: isDarkMode ? 'rgba(245,158,11,0.15)' : '#fef3c7', borderColor: '#f59e0b' }]}
    >
      <MaterialIcons name="wifi-off" size={20} color="#b45309" />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: isDarkMode ? '#fcd34d' : '#92400e' }]}>You are offline</Text>
        <Text style={[styles.text, { color: isDarkMode ? '#fde68a' : '#92400e' }]}>
          Videos and saved chapters still work. Chapter PDFs need the server.
        </Text>
      </View>
      <TouchableOpacity
        onPress={onRetry}
        disabled={checking}
        accessibilityRole="button"
        accessibilityLabel="Retry connecting to the server"
        style={[styles.btn, { opacity: checking ? 0.6 : 1 }]}
      >
        <Text style={styles.btnText}>{checking ? 'Checking…' : 'Retry'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, marginHorizontal: 16, marginBottom: 12 },
  title: { fontSize: 14, fontWeight: '700' },
  text: { fontSize: 12, marginTop: 2 },
  btn: { backgroundColor: '#f59e0b', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, minHeight: 36, justifyContent: 'center' },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
});
