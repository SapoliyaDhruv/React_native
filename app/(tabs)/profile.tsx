import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { MindSprintColors, MindSprintFonts } from '@/constants/mindsprintTheme';
import { ToolList, ToolItem } from '@/components/mindsprint/home/ToolList';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/services/api';
import { AcademicGradeModal } from '@/components/mindsprint/AcademicGradeModal';
import { AcademicGrade, EducationBoard, InstructionMedium, GRADE_OPTIONS } from '@/constants/academicData';

const AVATAR_PRESETS = ['🧑‍🎓', '👩‍🎓', '👩‍🔬', '🧑‍💻', '👨‍🚀', '🦁', '⚡', '🎯', '🦉', '🚀'];

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDpTpadB_GY_XTy7q4R83ni9Q0r3ovKCNCuNHvfTLdAAUsEDZQQ26lLxFQO_WijYLtiUQadQJ_c0VDSE0fHXcuipv31vufAkHZtjG1aj35AKp-BjX-2zVCFy4qBBlHxSdFhkGtwh5DKfM4qwVUmYdc-K3yrzrEPvVhlN2E9YXrZH1pl8ECG17oL9IkbPI8NtjpIidsOBmstyEVvCWiL4dNDK14kJBzDlDXzw8GOBDLwWHwzKNd5EGU3';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const { user, logout, updateAcademicProfile, updateUserProfile } = useAuth();
  const [userStats, setUserStats] = useState<any>(null);
  const [showGradeModal, setShowGradeModal] = useState<boolean>(false);
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const handlePickFromGallery = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Needed', 'Please allow photo gallery access to select an avatar.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const uri = res.assets[0].uri;
        await updateUserProfile({ avatarUrl: uri });
        if (user?.email) {
          ApiService.updateProfile({ email: user.email, name: user.name, avatarUrl: uri }).catch(() => {});
        }
        setShowAvatarModal(false);
      }
    } catch (e) {
      console.warn('Gallery pick error:', e);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Needed', 'Please allow camera access to take a profile photo.');
        return;
      }
      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const uri = res.assets[0].uri;
        await updateUserProfile({ avatarUrl: uri });
        if (user?.email) {
          ApiService.updateProfile({ email: user.email, name: user.name, avatarUrl: uri }).catch(() => {});
        }
        setShowAvatarModal(false);
      }
    } catch (e) {
      console.warn('Camera take error:', e);
    }
  };

  const handleSelectEmojiAvatar = async (emoji: string) => {
    await updateUserProfile({ avatarUrl: emoji });
    if (user?.email) {
      ApiService.updateProfile({ email: user.email, name: user.name, avatarUrl: emoji }).catch(() => {});
    }
    setShowAvatarModal(false);
  };

  useFocusEffect(
    useCallback(() => {
      async function loadStats() {
        if (user?.email) {
          const stats = await ApiService.getDashboardStats(user.email);
          if (stats) setUserStats(stats);
        }
      }
      loadStats();
    }, [user?.email])
  );

  const handleSaveGrade = async (grade: AcademicGrade, board: EducationBoard, medium: InstructionMedium) => {
    await updateAcademicProfile(grade, board, medium);
    Alert.alert(
      'અભ્યાસક્રમ અપડેટ થયો! 🎓',
      `તમારો લર્નિંગ ટ્રેક હવે ${grade === 'college' ? 'College Placements (English)' : `ધોરણ ${grade} (GSEB ગુજરાતી માધ્યમ)`} તરીકે સેટ થયો છે.`
    );
  };

  const userGrade = user?.grade || 'college';
  const isSchoolMode = userGrade !== 'college';

  const currentGradeObj = GRADE_OPTIONS.find((g) => g.grade === userGrade) || GRADE_OPTIONS[7];

  const go = (route: string) => () => router.push(route as any);

  const learnItems: ToolItem[] = [
    { key: 'bookmarks', icon: 'bookmark-border', title: 'Saved chapters and questions', subtitle: 'Everything you bookmarked', onPress: go('/bookmarks') },
    { key: 'formulas', icon: 'functions', title: isSchoolMode ? `Class ${userGrade} formula sheets` : 'Formula and revision sheets', subtitle: isSchoolMode ? 'Maths formulas and science notes' : 'Quant formulas, DSA and core notes', onPress: go('/cheatsheets') },
    { key: 'flashcards', icon: 'style', title: 'Flashcards', subtitle: isSchoolMode ? 'Quick revision by chapter' : 'HR and technical Q&A', onPress: go('/flashcards') },
    { key: 'mastery', icon: 'insights', title: 'My strengths', subtitle: 'Accuracy by topic and what to revise', onPress: go('/mastery-analytics') },
  ];

  const practiseItems: ToolItem[] = [
    ...(isSchoolMode
      ? [{ key: 'board', icon: 'assignment', title: 'Board exam paper', subtitle: 'Full 80-mark timed paper with marking', onPress: go('/board-exam-simulator') } as ToolItem]
      : []),
    { key: 'interview', icon: 'record-voice-over', title: isSchoolMode ? 'Viva practice' : 'Interview practice', subtitle: isSchoolMode ? 'Answer oral exam questions aloud' : 'Answer HR and technical questions', onPress: go('/interview-simulator') },
    { key: 'vault', icon: 'replay', title: 'Fix my mistakes', subtitle: 'Retry questions you got wrong', onPress: go('/error-vault') },
    { key: 'doubt', icon: 'photo-camera', title: 'Scan a doubt', subtitle: 'Photo of a question → step-by-step help', onPress: go('/doubt-solver') },
    { key: 'duel', icon: 'sports-kabaddi', title: '1v1 quiz duel', subtitle: '5 quick questions against a classmate', onPress: go('/quiz-duel') },
    { key: 'leaderboard', icon: 'emoji-events', title: 'Rankings', subtitle: isSchoolMode ? 'Class, school and Gujarat rankings' : 'Campus rankings', onPress: go('/leaderboard') },
  ];

  const BADGES = [
    { id: 'first_step', icon: 'emoji-events', title: 'First step', sub: 'Finish your first test' },
    { id: 'bullseye', icon: 'gps-fixed', title: 'Bullseye', sub: 'Score 100% in a test' },
    { id: 'quant_master', icon: 'calculate', title: 'Maths master', sub: 'Finish 3 maths tests' },
    { id: 'dsa_ninja', icon: 'account-tree', title: 'Logic ninja', sub: 'Finish 5 logic drills' },
    { id: 'streak_flame', icon: 'local-fire-department', title: 'Week streak', sub: 'Study 7 days in a row' },
  ];
  const unlocked: string[] = userStats?.unlockedBadges || ['first_step'];

  const isEmojiAvatar = !!user?.avatarUrl && !user.avatarUrl.startsWith('http') && !user.avatarUrl.startsWith('file:') && !user.avatarUrl.startsWith('data:');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Profile</Text>

        {/* Who you are */}
        <View style={styles.identityRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowAvatarModal(true)}
            style={styles.avatarWrapper}
            accessibilityRole="button"
            accessibilityLabel="Change profile picture"
          >
            {isEmojiAvatar ? (
              <View style={[styles.avatar, styles.emojiAvatarBox]}>
                <Text style={styles.emojiAvatarText}>{user!.avatarUrl}</Text>
              </View>
            ) : (
              <Image source={{ uri: user?.avatarUrl || AVATAR_URL }} style={styles.avatar} />
            )}
            <View style={styles.cameraBadge}>
              <MaterialIcons name="photo-camera" size={13} color={colors.onPrimary} />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.userName} numberOfLines={1}>{user?.name || 'Guest student'}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{user?.email || 'guest@mindsprint.app'}</Text>
            <View style={styles.statusChip}>
              <MaterialIcons name={user?.isGuest ? 'person-outline' : 'verified'} size={14} color={colors.onTertiaryContainer} />
              <Text style={styles.statusChipText}>{user?.isGuest ? 'Guest' : 'Signed in'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.editProfileBtn} onPress={() => router.push('/profile-edit')} accessibilityRole="button">
          <MaterialIcons name="edit" size={18} color={colors.primary} />
          <Text style={styles.editProfileBtnText}>Edit profile</Text>
        </TouchableOpacity>

        {/* Quick numbers */}
        <View style={styles.statsCard}>
          {[
            { label: 'Tests taken', value: String(userStats?.totalTests || 0) },
            { label: 'Day streak', value: String(userStats?.streakCount || 1) },
            { label: 'Average', value: `${userStats?.avgScore || 0}%` },
          ].map((st, i) => (
            <View key={st.label} style={[styles.statCell, i > 0 && styles.statDivider]}>
              <Text style={styles.statValue}>{st.value}</Text>
              <Text style={styles.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* What you're studying */}
        <Text style={styles.sectionHeading}>Studying</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.curriculumCard}
          onPress={() => setShowGradeModal(true)}
          accessibilityRole="button"
          accessibilityLabel={`Change class. Current: ${currentGradeObj.label}`}
        >
          <View style={styles.curriculumIconCircle}>
            <MaterialIcons name={isSchoolMode ? 'school' : 'work-outline'} size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.currTitle} numberOfLines={1}>{currentGradeObj.label}</Text>
            <Text style={styles.currSubtitle} numberOfLines={1}>
              {user?.grade === 'college'
                ? 'Campus placements'
                : `${user?.board || 'GSEB'} board · ${user?.medium || 'Gujarati'} medium`}
            </Text>
          </View>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>

        {/* Badges */}
        <Text style={styles.sectionHeading}>Badges</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll} style={styles.badgesStrip}>
          {BADGES.map((b) => {
            const isUnlocked = unlocked.includes(b.id);
            return (
              <View
                key={b.id}
                style={[styles.achievementBadgeCard, isUnlocked && styles.achievementUnlocked]}
                accessibilityLabel={`${b.title}: ${isUnlocked ? 'earned' : 'not earned yet'}. ${b.sub}`}
              >
                <View style={[styles.badgeIconCircle, { backgroundColor: isUnlocked ? colors.accentContainer : colors.surfaceContainerLow }]}>
                  <MaterialIcons name={(isUnlocked ? b.icon : 'lock-outline') as any} size={22} color={isUnlocked ? colors.accent : colors.outline} />
                </View>
                <Text style={[styles.achievementTitle, !isUnlocked && { color: colors.onSurfaceVariant }]} numberOfLines={1}>{b.title}</Text>
                <Text style={styles.achievementSub} numberOfLines={2}>{b.sub}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Settings */}
        <Text style={styles.sectionHeading}>Settings</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.menuIconBox}>
              <MaterialIcons name={isDarkMode ? 'dark-mode' : 'light-mode'} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Dark mode</Text>
              <Text style={styles.menuSubtitle}>Easier on the eyes at night</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primary }}
              thumbColor="#ffffff"
              {...({ activeThumbColor: '#ffffff' } as object)}
              accessibilityLabel="Dark mode"
            />
          </View>
        </View>

        <Text style={styles.sectionHeading}>Learn</Text>
        <ToolList items={learnItems} />

        <Text style={styles.sectionHeading}>Practise</Text>
        <ToolList items={practiseItems} />

        <TouchableOpacity style={styles.signOutBtn} onPress={logout} accessibilityRole="button">
          <MaterialIcons name="logout" size={20} color={colors.error} />
          <Text style={styles.signOutBtnText}>{user?.isGuest ? 'Leave guest mode and sign in' : 'Sign out'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Avatar picker */}
      <Modal visible={showAvatarModal} transparent animationType="fade" onRequestClose={() => setShowAvatarModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile picture</Text>
              <TouchableOpacity onPress={() => setShowAvatarModal(false)} style={styles.closeBtn} accessibilityLabel="Close">
                <MaterialIcons name="close" size={22} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <View style={styles.photoActionsRow}>
              <TouchableOpacity style={[styles.photoActionBtn, { backgroundColor: colors.primary }]} onPress={handlePickFromGallery}>
                <MaterialIcons name="photo-library" size={18} color={colors.onPrimary} />
                <Text style={[styles.photoActionBtnText, { color: colors.onPrimary }]}>Choose photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.photoActionBtn, styles.photoActionOutline]} onPress={handleTakePhoto}>
                <MaterialIcons name="photo-camera" size={18} color={colors.primary} />
                <Text style={[styles.photoActionBtnText, { color: colors.primary }]}>Take photo</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubheading}>Or pick an avatar</Text>
            <View style={styles.emojiGrid}>
              {AVATAR_PRESETS.map((emoji, idx) => {
                const selected = user?.avatarUrl === emoji;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.emojiBtn, selected && styles.emojiBtnSelected]}
                    onPress={() => handleSelectEmojiAvatar(emoji)}
                    accessibilityState={{ selected }}
                  >
                    <Text style={styles.emojiGridText}>{emoji}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      <AcademicGradeModal
        visible={showGradeModal}
        currentGrade={user?.grade || 'college'}
        currentBoard={user?.board || 'CBSE'}
        currentMedium={user?.medium || 'English'}
        onClose={() => setShowGradeModal(false)}
        onSave={handleSaveGrade}
      />
    </SafeAreaView>
  );
}

const makeStyles = (c: typeof MindSprintColors) =>
  StyleSheet.create({
    safeArea: { flex: 1 },
    scrollContainer: { padding: 16, paddingBottom: 40 },
    screenTitle: { fontFamily: MindSprintFonts.heading, fontSize: 26, lineHeight: 34, color: c.onSurface, marginBottom: 14 },
    identityRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: c.primaryFixed },
    emojiAvatarBox: { alignItems: 'center', justifyContent: 'center' },
    emojiAvatarText: { fontSize: 38 },
    cameraBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: c.background,
      backgroundColor: c.primary,
    },
    userName: { fontFamily: MindSprintFonts.heading, fontSize: 22, lineHeight: 28, color: c.onSurface },
    userEmail: { fontSize: 14, color: c.onSurfaceVariant },
    statusChip: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 4,
      marginTop: 6,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: c.tertiaryContainer,
    },
    statusChipText: { fontSize: 12.5, fontWeight: '600', color: c.onTertiaryContainer },
    editProfileBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      minHeight: 44,
      marginTop: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.outlineVariant,
      backgroundColor: c.surface,
    },
    editProfileBtnText: { fontFamily: MindSprintFonts.label, fontSize: 15, color: c.primary },
    statsCard: {
      flexDirection: 'row',
      marginTop: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.outlineVariant,
      backgroundColor: c.surface,
      paddingVertical: 12,
    },
    statCell: { flex: 1, alignItems: 'center' },
    statDivider: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: c.outlineVariant },
    statValue: { fontFamily: MindSprintFonts.display, fontSize: 24, lineHeight: 30, color: c.onSurface },
    statLabel: { fontSize: 12.5, color: c.onSurfaceVariant },
    sectionHeading: { fontFamily: MindSprintFonts.heading, fontSize: 18, lineHeight: 24, color: c.onSurface, marginTop: 26, marginBottom: 10 },
    curriculumCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.outlineVariant,
      backgroundColor: c.surface,
      padding: 14,
      minHeight: 68,
    },
    curriculumIconCircle: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: c.primaryFixed },
    currTitle: { fontFamily: MindSprintFonts.title, fontSize: 16, lineHeight: 22, color: c.onSurface },
    currSubtitle: { fontSize: 13, color: c.onSurfaceVariant, marginTop: 1 },
    changeText: { fontFamily: MindSprintFonts.label, fontSize: 15, color: c.primary, paddingLeft: 4 },
    badgesStrip: { marginHorizontal: -16 },
    badgesScroll: { gap: 10, paddingHorizontal: 16 },
    achievementBadgeCard: {
      width: 116,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.outlineVariant,
      backgroundColor: c.surface,
    },
    achievementUnlocked: { borderColor: c.accent },
    badgeIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    achievementTitle: { fontFamily: MindSprintFonts.title, fontSize: 14.5, lineHeight: 20, color: c.onSurface },
    achievementSub: { fontSize: 12, lineHeight: 16, color: c.onSurfaceVariant, marginTop: 2 },
    settingsCard: { borderRadius: 16, borderWidth: 1, borderColor: c.outlineVariant, backgroundColor: c.surface },
    settingRow: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64, paddingHorizontal: 14, paddingVertical: 10 },
    menuIconBox: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: c.primaryFixed },
    menuTitle: { fontFamily: MindSprintFonts.title, fontSize: 15.5, lineHeight: 21, color: c.onSurface },
    menuSubtitle: { fontSize: 12.5, color: c.onSurfaceVariant, marginTop: 1 },
    signOutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      minHeight: 50,
      marginTop: 28,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.outlineVariant,
      backgroundColor: c.surface,
    },
    signOutBtnText: { fontFamily: MindSprintFonts.label, fontSize: 15.5, color: c.error },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: {
      width: '100%',
      maxWidth: 380,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: c.outlineVariant,
      backgroundColor: c.surface,
      padding: 20,
      gap: 14,
    },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    modalTitle: { fontFamily: MindSprintFonts.heading, fontSize: 20, lineHeight: 26, color: c.onSurface },
    closeBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -10 },
    photoActionsRow: { flexDirection: 'row', gap: 10 },
    photoActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 46, borderRadius: 12 },
    photoActionOutline: { borderWidth: 1, borderColor: c.outlineVariant, backgroundColor: c.surface },
    photoActionBtnText: { fontFamily: MindSprintFonts.label, fontSize: 14.5 },
    modalSubheading: { fontSize: 13.5, fontWeight: '600', color: c.onSurfaceVariant, marginTop: 4 },
    emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
    emojiBtn: {
      width: 52,
      height: 52,
      borderRadius: 26,
      borderWidth: 2,
      borderColor: 'transparent',
      backgroundColor: c.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emojiBtnSelected: { borderColor: c.primary, backgroundColor: c.primaryFixed },
    emojiGridText: { fontSize: 26 },
  });
