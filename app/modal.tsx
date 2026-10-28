import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

export default function AboutModalScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="school" size={36} color="#ffffff" />
        </View>
        <Text style={[styles.title, { color: colors.primary }]}>MindSprint v1.2.0</Text>
        <Text style={[styles.sub, { color: colors.onSurfaceVariant }]}>
          Empowering Gujarat's Students for Campus Placements & Board Exam Excellence
        </Text>

        <View style={styles.infoRow}>
          <MaterialIcons name="verified" size={16} color="#10b981" />
          <Text style={[styles.infoText, { color: colors.onSurface }]}>CBSE & GSEB Class 6–12 Curriculum Aligned</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="code" size={16} color="#3b82f6" />
          <Text style={[styles.infoText, { color: colors.onSurface }]}>GTU & Engineering Campus Recruitment Tracks</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="auto-awesome" size={16} color="#8b5cf6" />
          <Text style={[styles.infoText, { color: colors.onSurface }]}>Multimodal Gemini AI Doubt Solver & Voice Viva</Text>
        </View>

        <TouchableOpacity
          style={[styles.closeBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  sub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    width: '100%',
  },
  infoText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  closeBtn: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
