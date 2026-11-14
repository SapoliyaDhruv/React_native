import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintColors, MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

interface ShareProgressModalProps {
  visible: boolean;
  onClose: () => void;
  masteryPercentage?: number;
  streakDays?: number;
  chaptersCompleted?: number;
  questionsSolved?: number;
}

export const ShareProgressModal: React.FC<ShareProgressModalProps> = ({
  visible,
  onClose,
  // Defaults are zero so the card never shows made-up numbers.
  masteryPercentage = 0,
  streakDays = 0,
  chaptersCompleted = 0,
  questionsSolved = 0,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const { user } = useAuth();

  const studentName = user?.name || 'Student';
  const grade = user?.grade || '10';
  const board = user?.board || 'GSEB';
  const medium = user?.medium || 'Gujarati';

  const shareText = `🎓 *MindSprint Study Progress Report* 🎓
👤 Student: *${studentName}*
📚 ${grade === 'college' ? '*College placements*' : `Standard: *Class ${grade} (${board} • ${medium} Medium)*`}
🔥 Daily Study Streak: *${streakDays} Days*
📖 Chapters Mastered: *${chaptersCompleted}*
✍️ Questions Solved: *${questionsSolved}*
⭐ Overall Curriculum Mastery: *${masteryPercentage}%*

_Consistent daily revision brings top board exam ranks! Keep it up!_ 🚀`;

  const handleShareWhatsApp = async () => {
    const url = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
      }
    } catch {
      Alert.alert('Progress Card Copied', 'Progress report copied! You can paste and send it to parents or teachers.');
    }
  };

  if (!visible) return null;

  const stageLine = grade === 'college' ? 'College · Campus placements' : `Class ${grade} · ${board} · ${medium} medium`;
  const metrics = [
    { label: 'Day streak', value: String(streakDays) },
    { label: 'Chapters done', value: String(chaptersCompleted) },
    { label: 'Questions solved', value: String(questionsSolved) },
    { label: 'Average score', value: `${masteryPercentage}%` },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Share your progress</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
              <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Send this card to your parents or teacher.</Text>

          {/* The card that gets shared */}
          <View style={styles.reportCard}>
            <Text style={styles.reportBrand}>MindSprint progress</Text>
            <Text style={styles.studentName} numberOfLines={1}>{studentName}</Text>
            <Text style={styles.studentMeta} numberOfLines={1}>{stageLine}</Text>
            <View style={styles.metricsGrid}>
              {metrics.map((m) => (
                <View key={m.label} style={styles.metricCard}>
                  <Text style={styles.metricValue}>{m.value}</Text>
                  <Text style={styles.metricLabel}>{m.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.shareBtn} onPress={handleShareWhatsApp} accessibilityRole="button">
            <MaterialIcons name="share" size={20} color="#ffffff" />
            <Text style={styles.shareBtnText}>Share on WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const makeStyles = (c: typeof MindSprintColors) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: { width: '100%', maxWidth: 400, borderRadius: 22, padding: 20, backgroundColor: c.surface, borderWidth: 1, borderColor: c.outlineVariant },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontFamily: MindSprintFonts.heading, fontSize: 20, lineHeight: 26, color: c.onSurface },
    subtitle: { fontSize: 14, color: c.onSurfaceVariant, marginBottom: 14 },
    closeBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -10 },
    reportCard: { borderRadius: 18, padding: 18, backgroundColor: c.heroSurface },
    reportBrand: { fontSize: 13, fontWeight: '600', color: c.accent },
    studentName: { fontFamily: MindSprintFonts.display, fontSize: 24, lineHeight: 32, color: c.onHeroSurface, marginTop: 4 },
    studentMeta: { fontSize: 13.5, color: c.onHeroSurfaceVariant },
    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
    metricCard: { flexBasis: '47%', flexGrow: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.08)' },
    metricValue: { fontFamily: MindSprintFonts.heading, fontSize: 22, lineHeight: 28, color: c.onHeroSurface },
    metricLabel: { fontSize: 12.5, color: c.onHeroSurfaceVariant },
    shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 52, borderRadius: 14, marginTop: 16, backgroundColor: '#1F9E50' },
    shareBtnText: { fontFamily: MindSprintFonts.label, fontSize: 16.5, color: '#ffffff' },
  });
