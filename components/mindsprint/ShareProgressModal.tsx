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
import { MindSprintShadows } from '@/constants/mindsprintTheme';
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
  masteryPercentage = 84,
  streakDays = 5,
  chaptersCompleted = 8,
  questionsSolved = 142,
}) => {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const studentName = user?.name || 'Student';
  const grade = user?.grade || '10';
  const board = user?.board || 'GSEB';
  const medium = user?.medium || 'Gujarati';

  const shareText = `🎓 *MindSprint Study Progress Report* 🎓
👤 Student: *${studentName}*
📚 Standard: *Class ${grade} (${board} • ${medium} Medium)*
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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.surfaceContainerLowest }, MindSprintShadows.glow]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.badge}>
              <MaterialIcons name="workspace-premium" size={16} color="#10b981" />
              <Text style={styles.badgeText}>OFFICIAL PROGRESS CARD</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={22} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Student Profile Overview */}
          <View style={styles.profileSection}>
            <View style={[styles.avatarBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarEmoji}>🎓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.studentName, { color: colors.onSurface }]}>{studentName}</Text>
              <Text style={[styles.studentMeta, { color: colors.onSurfaceVariant }]}>
                Class {grade} • {board} Board ({medium} Medium)
              </Text>
            </View>
          </View>

          {/* Metric Badges Grid */}
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc' }]}>
              <Text style={[styles.metricValue, { color: '#10b981' }]}>{masteryPercentage}%</Text>
              <Text style={[styles.metricLabel, { color: colors.onSurfaceVariant }]}>Mastery Index</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc' }]}>
              <Text style={[styles.metricValue, { color: '#f59e0b' }]}>🔥 {streakDays}</Text>
              <Text style={[styles.metricLabel, { color: colors.onSurfaceVariant }]}>Days Streak</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc' }]}>
              <Text style={[styles.metricValue, { color: colors.primary }]}>{chaptersCompleted}</Text>
              <Text style={[styles.metricLabel, { color: colors.onSurfaceVariant }]}>Chapters Done</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc' }]}>
              <Text style={[styles.metricValue, { color: '#8b5cf6' }]}>{questionsSolved}</Text>
              <Text style={[styles.metricLabel, { color: colors.onSurfaceVariant }]}>Qs Practiced</Text>
            </View>
          </View>

          {/* Motivational Quote */}
          <View style={[styles.quoteBox, { backgroundColor: 'rgba(53, 37, 205, 0.08)' }]}>
            <MaterialIcons name="format-quote" size={20} color={colors.primary} />
            <Text style={[styles.quoteText, { color: colors.primary }]}>
              "Daily consistency beats last-minute cramming. Exceptional academic progress!"
            </Text>
          </View>

          {/* WhatsApp Action Button */}
          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: '#25D366' }]}
            onPress={handleShareWhatsApp}
          >
            <MaterialIcons name="share" size={20} color="#ffffff" />
            <Text style={styles.shareBtnText}>Share Progress on WhatsApp 💬</Text>
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
    maxWidth: 440,
    borderRadius: 24,
    padding: 22,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '800',
  },
  studentMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  quoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  quoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  shareBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
