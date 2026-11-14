import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
  Alert,
  Share,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintColors, MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

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
  const { tr } = useLanguage();

  const studentName = user?.name || tr('Student', 'વિદ્યાર્થી');
  const grade = user?.grade || '10';
  const board = user?.board || 'GSEB';
  const isGujaratiMedium = (user?.medium || 'Gujarati') === 'Gujarati';

  const stageLine =
    grade === 'college'
      ? tr('College · Campus placements', 'કૉલેજ · કૅમ્પસ પ્લેસમેન્ટ')
      : tr(
          `Class ${grade} · ${board} · ${isGujaratiMedium ? 'Gujarati' : 'English'} medium`,
          `ધોરણ ${grade} · ${board} · ${isGujaratiMedium ? 'ગુજરાતી' : 'અંગ્રેજી'} માધ્યમ`
        );

  const metrics = [
    { label: tr('Day streak', 'દિવસ સતત'), value: String(streakDays) },
    { label: tr('Chapters done', 'પૂરાં પ્રકરણ'), value: String(chaptersCompleted) },
    { label: tr('Questions solved', 'ઉકેલેલા પ્રશ્નો'), value: String(questionsSolved) },
    { label: tr('Average score', 'સરેરાશ ગુણ'), value: `${masteryPercentage}%` },
  ];

  const shareText = [
    tr(`MindSprint progress — ${studentName}`, `MindSprint પ્રગતિ — ${studentName}`),
    stageLine,
    '',
    ...metrics.map((m) => `${m.label}: ${m.value}`),
    '',
    tr('Sent from the MindSprint app.', 'MindSprint ઍપ પરથી મોકલેલ.'),
  ].join('\n');

  const handleShareWhatsApp = async () => {
    const url = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      await Linking.openURL(supported ? url : `https://wa.me/?text=${encodeURIComponent(shareText)}`);
    } catch {
      handleShareAny();
    }
  };

  const handleShareAny = async () => {
    try {
      await Share.share({ message: shareText });
    } catch {
      Alert.alert(
        tr('Could not open sharing', 'શેર કરી શકાયું નહીં'),
        tr('Try again, or take a screenshot of the card.', 'ફરી પ્રયાસ કરો, અથવા કાર્ડનો સ્ક્રીનશૉટ લો.')
      );
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{tr('Share your progress', 'તમારી પ્રગતિ શેર કરો')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel={tr('Close', 'બંધ કરો')}>
              <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>{tr('Send this card to your parents or teacher.', 'આ કાર્ડ માતા-પિતા કે શિક્ષકને મોકલો.')}</Text>

          {/* The card that gets shared */}
          <View style={styles.reportCard}>
            <Text style={styles.reportBrand}>{tr('MindSprint progress', 'MindSprint પ્રગતિ')}</Text>
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
            <Text style={styles.shareBtnText}>{tr('Share on WhatsApp', 'WhatsApp પર શેર કરો')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.otherBtn} onPress={handleShareAny} accessibilityRole="button">
            <Text style={styles.otherBtnText}>{tr('Share with another app', 'બીજી ઍપથી શેર કરો')}</Text>
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
    otherBtn: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
    otherBtnText: { fontFamily: MindSprintFonts.label, fontSize: 15, color: c.primary },
  });
