import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { GLOSSARY_DICTIONARY, GlossaryTerm, findGlossaryTerm } from '@/constants/glossaryData';

interface GlossaryTooltipProps {
  visible: boolean;
  termKeyOrText: string;
  onClose: () => void;
}

export const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({
  visible,
  termKeyOrText,
  onClose,
}) => {
  const { colors, isDarkMode } = useTheme();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const term: GlossaryTerm | null = findGlossaryTerm(termKeyOrText) || GLOSSARY_DICTIONARY[termKeyOrText] || null;

  const handleSpeak = (textToSpeak: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  if (!term) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.surfaceContainerLowest }, MindSprintShadows.glow]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={[styles.subjectBadge, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.2)' : '#e0e7ff' }]}>
              <Text style={[styles.subjectBadgeText, { color: colors.primary }]}>{term.subject}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Bilingual Title */}
          <View style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.englishTitle, { color: colors.primary }]}>
                {term.englishTerm}
              </Text>
              <TouchableOpacity
                style={[styles.audioBtn, { backgroundColor: isSpeaking ? '#10b981' : colors.primary }]}
                onPress={() => handleSpeak(term.englishTerm)}
              >
                <MaterialIcons name={isSpeaking ? 'volume-up' : 'volume-down'} size={18} color="#ffffff" />
                <Text style={styles.audioBtnText}>{isSpeaking ? 'Playing' : 'Listen'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.gujaratiTitle, { color: colors.onSurface }]}>
              {term.gujaratiTerm}
            </Text>

            {term.phoneticPronunciation && (
              <Text style={[styles.phoneticText, { color: colors.onSurfaceVariant }]}>
                /{term.phoneticPronunciation}/
              </Text>
            )}
          </View>

          {/* Definitions */}
          <View style={[styles.defCard, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc' }]}>
            <Text style={[styles.defLabel, { color: colors.outline }]}>English Meaning:</Text>
            <Text style={[styles.defText, { color: colors.onSurface }]}>
              {term.definitionEnglish}
            </Text>

            <View style={{ height: 1, backgroundColor: colors.outlineVariant, marginVertical: 6 }} />

            <Text style={[styles.defLabel, { color: colors.outline }]}>ગુજરાતી સરળ અર્થ:</Text>
            <Text style={[styles.defText, { color: colors.onSurface }]}>
              {term.definitionGujarati}
            </Text>
          </View>

          {/* Example Formula or Equation */}
          {term.exampleEnglish && (
            <View style={[styles.exampleBox, { backgroundColor: 'rgba(59, 130, 246, 0.08)' }]}>
              <Text style={[styles.exampleLabel, { color: '#2563eb' }]}>Equation / Example:</Text>
              <Text style={[styles.exampleText, { color: colors.onSurface }]}>
                {term.exampleEnglish}
              </Text>
            </View>
          )}

          {/* Got it CTA */}
          <TouchableOpacity
            style={[styles.gotItBtn, { backgroundColor: colors.primary }]}
            onPress={onClose}
          >
            <Text style={styles.gotItBtnText}>Understood ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 20,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  englishTitle: {
    fontSize: 19,
    fontWeight: '800',
  },
  gujaratiTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  phoneticText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  audioBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  defCard: {
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  defLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  defText: {
    fontSize: 13,
    lineHeight: 18,
  },
  exampleBox: {
    borderRadius: 12,
    padding: 12,
    gap: 2,
  },
  exampleLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  exampleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  gotItBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  gotItBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
