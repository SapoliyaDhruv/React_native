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
  Share,
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
import { AcademicGrade, EducationBoard, InstructionMedium, ACADEMIC_CURRICULUM } from '@/constants/academicData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '@/context/LanguageContext';
import { buildParentReport } from '@/components/mindsprint/home/parentReport';
import { countThisWeek, nextChapters } from '@/components/mindsprint/home/studyPlan';

const AVATAR_PRESETS = ['🧑‍🎓', '👩‍🎓', '👩‍🔬', '🧑‍💻', '👨‍🚀', '🦁', '⚡', '🎯', '🦉', '🚀'];

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDpTpadB_GY_XTy7q4R83ni9Q0r3ovKCNCuNHvfTLdAAUsEDZQQ26lLxFQO_WijYLtiUQadQJ_c0VDSE0fHXcuipv31vufAkHZtjG1aj35AKp-BjX-2zVCFy4qBBlHxSdFhkGtwh5DKfM4qwVUmYdc-K3yrzrEPvVhlN2E9YXrZH1pl8ECG17oL9IkbPI8NtjpIidsOBmstyEVvCWiL4dNDK14kJBzDlDXzw8GOBDLwWHwzKNd5EGU3';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const { user, logout, updateAcademicProfile, updateUserProfile } = useAuth();
  const { tr, lang, setLang, isGujarati } = useLanguage();
  const [userStats, setUserStats] = useState<any>(null);
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>([]);
  const [showGradeModal, setShowGradeModal] = useState<boolean>(false);
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const handlePickFromGallery = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          tr('Allow photo access', 'ફોટો જોવાની પરવાનગી આપો'),
          tr('To choose a profile picture, allow MindSprint to open your photos in Settings.', 'પ્રોફાઇલ ફોટો પસંદ કરવા, Settings માં MindSprint ને ફોટો ખોલવાની પરવાનગી આપો.')
        );
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
        Alert.alert(
          tr('Allow camera access', 'કૅમેરાની પરવાનગી આપો'),
          tr('To take a profile photo, allow MindSprint to use the camera in Settings.', 'પ્રોફાઇલ ફોટો લેવા, Settings માં MindSprint ને કૅમેરા વાપરવાની પરવાનગી આપો.')
        );
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

  const userGrade = user?.grade || 'college';
  const isSchoolMode = userGrade !== 'college';

  const userEmail = user?.email;
  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (userEmail) {
        ApiService.getDashboardStats(userEmail, userGrade)
          .then((stats) => { if (active && stats) setUserStats(stats); })
          .catch(() => {});
      }
      AsyncStorage.getItem(`@mindsprint_completed_chapters_${userGrade}_${userEmail || 'guest'}`)
        .then((raw) => { if (active) setCompletedChapterIds(raw ? JSON.parse(raw) : []); })
        .catch(() => {});
      return () => { active = false; };
    }, [userEmail, userGrade])
  );

  const handleSaveGrade = async (grade: AcademicGrade, board: EducationBoard, medium: InstructionMedium) => {
    await updateAcademicProfile(grade, board, medium);
    Alert.alert(
      tr('Class changed', 'ધોરણ બદલાયું'),
      grade === 'college'
        ? tr('You will now see college placement content.', 'હવે તમને કૉલેજ પ્લેસમેન્ટનું સાહિત્ય દેખાશે.')
        : tr(`You will now see Class ${grade} chapters, videos and tests.`, `હવે તમને ધોરણ ${grade} નાં પ્રકરણ, વિડિયો અને ટેસ્ટ દેખાશે.`)
    );
  };

  const classLabel = isSchoolMode
    ? tr(`Class ${userGrade}`, `ધોરણ ${userGrade}`)
    : tr('College', 'કૉલેજ');

  const hasActivity = (Number(userStats?.totalTests) || 0) > 0 || (userStats?.recentActivity?.length || 0) > 0;
  const streak = hasActivity ? Number(userStats?.streakCount) || 0 : 0;
  const curriculumSubjects = ACADEMIC_CURRICULUM[userGrade]?.subjects || [];
  const totalChapters = curriculumSubjects.reduce((n, sub) => n + (sub.chapters?.length || 0), 0);

  const handleShareParentReport = async () => {
    const message = buildParentReport({
      tr,
      gujarati: isGujarati,
      studentName: user?.name || tr('Student', 'વિદ્યાર્થી'),
      classLabel: isSchoolMode
        ? tr(`Class ${userGrade} · ${user?.board || 'GSEB'}`, `ધોરણ ${userGrade} · ${user?.board || 'GSEB'}`)
        : tr('College · Campus placements', 'કૉલેજ · કૅમ્પસ પ્લેસમેન્ટ'),
      streak,
      testsThisWeek: countThisWeek(userStats?.recentActivity),
      avgScore: Number(userStats?.avgScore) || 0,
      chaptersDone: completedChapterIds.length,
      totalChapters,
      next: isSchoolMode ? nextChapters(curriculumSubjects, completedChapterIds, 3) : [],
    });
    try {
      await Share.share({ message });
    } catch {
      Alert.alert(
        tr('Could not open sharing', 'શેર કરી શકાયું નહીં'),
        tr('Try again in a moment.', 'થોડી વાર પછી ફરી પ્રયાસ કરો.')
      );
    }
  };

  const go = (route: string) => () => router.push(route as any);

  const learnItems: ToolItem[] = [
    { key: 'bookmarks', icon: 'bookmark-border', title: tr('Saved chapters and questions', 'સાચવેલાં પ્રકરણ અને પ્રશ્નો'), subtitle: tr('Everything you bookmarked', 'તમે સાચવેલું બધું'), onPress: go('/bookmarks') },
    { key: 'formulas', icon: 'functions', title: isSchoolMode ? tr(`Class ${userGrade} formula sheets`, `ધોરણ ${userGrade} સૂત્ર પત્રક`) : tr('Formula and revision sheets', 'સૂત્ર અને પુનરાવર્તન પત્રક'), subtitle: isSchoolMode ? tr('Maths formulas and science notes', 'ગણિતનાં સૂત્રો અને વિજ્ઞાનની નોંધ') : tr('Quant formulas, DSA and core notes', 'ક્વૉન્ટ સૂત્રો, DSA અને મુખ્ય નોંધ'), onPress: go('/cheatsheets') },
    { key: 'flashcards', icon: 'style', title: tr('Flashcards', 'ફ્લૅશકાર્ડ'), subtitle: isSchoolMode ? tr('Quick revision by chapter', 'પ્રકરણ પ્રમાણે ઝડપી પુનરાવર્તન') : tr('HR and technical Q&A', 'HR અને ટેક્નિકલ પ્રશ્નોત્તર'), onPress: go('/flashcards') },
    { key: 'mastery', icon: 'insights', title: tr('My strengths', 'મારા મજબૂત વિષયો'), subtitle: tr('Accuracy by topic and what to revise', 'વિષય પ્રમાણે ચોકસાઈ અને શું ફરી ભણવું'), onPress: go('/mastery-analytics') },
  ];

  const practiseItems: ToolItem[] = [
    ...(isSchoolMode
      ? [{ key: 'board', icon: 'assignment', title: tr('Board exam paper', 'બોર્ડ પરીક્ષાનું પેપર'), subtitle: tr('Full 80-mark timed paper with marking', 'ગુણાંકન સાથે 80 ગુણનું સમયબદ્ધ પેપર'), onPress: go('/board-exam-simulator') } as ToolItem]
      : []),
    { key: 'interview', icon: 'record-voice-over', title: isSchoolMode ? tr('Viva practice', 'મૌખિક પરીક્ષાની પ્રેક્ટિસ') : tr('Interview practice', 'ઇન્ટરવ્યૂની પ્રેક્ટિસ'), subtitle: isSchoolMode ? tr('Answer oral exam questions aloud', 'મૌખિક પ્રશ્નોના જવાબ બોલીને આપો') : tr('Answer HR and technical questions', 'HR અને ટેક્નિકલ પ્રશ્નોના જવાબ આપો'), onPress: go('/interview-simulator') },
    { key: 'vault', icon: 'replay', title: tr('Fix my mistakes', 'મારી ભૂલો સુધારો'), subtitle: tr('Retry questions you got wrong', 'ખોટા પડેલા પ્રશ્નો ફરી કરો'), onPress: go('/error-vault') },
    { key: 'doubt', icon: 'photo-camera', title: tr('Scan a doubt', 'શંકાનો ફોટો પાડો'), subtitle: tr('Photo of a question → step-by-step help', 'પ્રશ્નનો ફોટો → પગલાવાર મદદ'), onPress: go('/doubt-solver') },
    { key: 'duel', icon: 'sports-kabaddi', title: tr('1v1 quiz duel', '1v1 ક્વિઝ મુકાબલો'), subtitle: tr('5 quick questions against a classmate', 'સહાધ્યાયી સામે 5 ઝડપી પ્રશ્નો'), onPress: go('/quiz-duel') },
    { key: 'leaderboard', icon: 'emoji-events', title: tr('Rankings', 'રેન્કિંગ'), subtitle: isSchoolMode ? tr('Class, school and Gujarat rankings', 'વર્ગ, શાળા અને ગુજરાત રેન્કિંગ') : tr('Campus rankings', 'કૅમ્પસ રેન્કિંગ'), onPress: go('/leaderboard') },
  ];

  const BADGES = [
    { id: 'first_step', icon: 'emoji-events', title: tr('First step', 'પહેલું પગલું'), sub: tr('Finish your first test', 'પહેલો ટેસ્ટ પૂરો કરો') },
    { id: 'bullseye', icon: 'gps-fixed', title: tr('Bullseye', 'પૂરા ગુણ'), sub: tr('Score 100% in a test', 'ટેસ્ટમાં 100% મેળવો') },
    { id: 'quant_master', icon: 'calculate', title: tr('Maths master', 'ગણિત નિષ્ણાત'), sub: tr('Finish 3 maths tests', 'ગણિતના 3 ટેસ્ટ પૂરા કરો') },
    { id: 'dsa_ninja', icon: 'account-tree', title: tr('Logic ninja', 'તર્ક નિષ્ણાત'), sub: tr('Finish 5 logic drills', 'તર્કની 5 પ્રેક્ટિસ પૂરી કરો') },
    { id: 'streak_flame', icon: 'local-fire-department', title: tr('Week streak', 'અઠવાડિયાની સ્ટ્રીક'), sub: tr('Study 7 days in a row', 'સતત 7 દિવસ ભણો') },
  ];
  // Only badges the server says are earned; nothing is unlocked by default.
  const totalTests = Number(userStats?.totalTests) || 0;
  const unlocked: string[] = (Array.isArray(userStats?.unlockedBadges) ? userStats.unlockedBadges : []).filter(
    (id: string) => totalTests > 0 || id === 'streak_flame'
  );

  const isEmojiAvatar = !!user?.avatarUrl && !user.avatarUrl.startsWith('http') && !user.avatarUrl.startsWith('file:') && !user.avatarUrl.startsWith('data:');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>{tr('Profile', 'પ્રોફાઇલ')}</Text>

        {/* Who you are */}
        <View style={styles.identityRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowAvatarModal(true)}
            style={styles.avatarWrapper}
            accessibilityRole="button"
            accessibilityLabel={tr('Change profile picture', 'પ્રોફાઇલ ફોટો બદલો')}
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
            <Text style={styles.userName} numberOfLines={1}>{user?.name || tr('Guest student', 'મહેમાન વિદ્યાર્થી')}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{user?.email || 'guest@mindsprint.app'}</Text>
            <View style={styles.statusChip}>
              <MaterialIcons name={user?.isGuest ? 'person-outline' : 'verified'} size={14} color={colors.onTertiaryContainer} />
              <Text style={styles.statusChipText}>{user?.isGuest ? tr('Guest', 'મહેમાન') : tr('Signed in', 'સાઇન ઇન')}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.editProfileBtn} onPress={() => router.push('/profile-edit')} accessibilityRole="button">
          <MaterialIcons name="edit" size={18} color={colors.primary} />
          <Text style={styles.editProfileBtnText}>{tr('Edit profile', 'પ્રોફાઇલ બદલો')}</Text>
        </TouchableOpacity>

        {/* Quick numbers */}
        <View style={styles.statsCard}>
          {[
            { label: tr('Tests taken', 'આપેલા ટેસ્ટ'), value: String(userStats?.totalTests || 0) },
            { label: tr('Day streak', 'દિવસ સતત'), value: String(streak) },
            { label: tr('Average', 'સરેરાશ'), value: `${userStats?.avgScore || 0}%` },
          ].map((st, i) => (
            <View key={st.label} style={[styles.statCell, i > 0 && styles.statDivider]}>
              <Text style={styles.statValue}>{st.value}</Text>
              <Text style={styles.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* What you're studying */}
        <Text style={styles.sectionHeading}>{tr('Studying', 'હાલનો અભ્યાસ')}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.curriculumCard}
          onPress={() => setShowGradeModal(true)}
          accessibilityRole="button"
          accessibilityLabel={tr(`Change class. Current: ${classLabel}`, `ધોરણ બદલો. હાલ: ${classLabel}`)}
        >
          <View style={styles.curriculumIconCircle}>
            <MaterialIcons name={isSchoolMode ? 'school' : 'work-outline'} size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.currTitle} numberOfLines={1}>{classLabel}</Text>
            <Text style={styles.currSubtitle} numberOfLines={1}>
              {user?.grade === 'college'
                ? tr('Campus placements', 'કૅમ્પસ પ્લેસમેન્ટ')
                : tr(
                    `${user?.board || 'GSEB'} board · ${user?.medium === 'English' ? 'English' : 'Gujarati'} medium`,
                    `${user?.board || 'GSEB'} બોર્ડ · ${user?.medium === 'English' ? 'અંગ્રેજી' : 'ગુજરાતી'} માધ્યમ`
                  )}
            </Text>
          </View>
          <Text style={styles.changeText}>{tr('Change', 'બદલો')}</Text>
        </TouchableOpacity>

        {/* Badges */}
        <Text style={styles.sectionHeading}>{tr('Badges', 'બૅજ')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll} style={styles.badgesStrip}>
          {BADGES.map((b) => {
            const isUnlocked = unlocked.includes(b.id);
            return (
              <View
                key={b.id}
                style={[styles.achievementBadgeCard, isUnlocked && styles.achievementUnlocked]}
                accessibilityLabel={`${b.title}: ${isUnlocked ? tr('earned', 'મળ્યો') : tr('not earned yet', 'હજુ મળ્યો નથી')}. ${b.sub}`}
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
        <Text style={styles.sectionHeading}>{tr('Settings', 'સેટિંગ્સ')}</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.menuIconBox}>
              <MaterialIcons name="translate" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.menuTitle}>Language / ભાષા</Text>
              <Text style={styles.menuSubtitle} numberOfLines={1}>{tr('Buttons, menus and chapter names', 'બટન, મેનુ અને પ્રકરણનાં નામ')}</Text>
            </View>
          </View>
          <View style={styles.langRow} accessibilityRole="radiogroup">
            {([['gu', 'ગુજરાતી'], ['en', 'English']] as const).map(([code, label]) => {
              const selected = lang === code;
              return (
                <TouchableOpacity
                  key={code}
                  onPress={() => setLang(code)}
                  style={[styles.langOption, selected && styles.langOptionSelected]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={label}
                >
                  <Text style={[styles.langOptionText, selected && styles.langOptionTextSelected]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={[styles.settingRow, styles.settingDivider]}>
            <View style={styles.menuIconBox}>
              <MaterialIcons name={isDarkMode ? 'dark-mode' : 'light-mode'} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>{tr('Dark mode', 'ડાર્ક મોડ')}</Text>
              <Text style={styles.menuSubtitle}>{tr('Easier on the eyes at night', 'રાત્રે આંખોને આરામ')}</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primary }}
              thumbColor="#ffffff"
              {...({ activeThumbColor: '#ffffff' } as object)}
              accessibilityLabel={tr('Dark mode', 'ડાર્ક મોડ')}
            />
          </View>
        </View>

        <Text style={styles.sectionHeading}>{tr('For parents', 'માતા-પિતા માટે')}</Text>
        <ToolList
          items={[
            {
              key: 'parent-report',
              icon: 'family-restroom',
              title: tr('Share weekly report with parents', 'માતા-પિતાને સાપ્તાહિક અહેવાલ મોકલો'),
              subtitle: tr('Streak, tests, scores and what is next', 'સ્ટ્રીક, ટેસ્ટ, ગુણ અને હવે શું ભણવું'),
              onPress: handleShareParentReport,
            },
          ]}
        />

        <Text style={styles.sectionHeading}>{tr('Learn', 'ભણો')}</Text>
        <ToolList items={learnItems} />

        <Text style={styles.sectionHeading}>{tr('Practise', 'પ્રેક્ટિસ')}</Text>
        <ToolList items={practiseItems} />

        <TouchableOpacity style={styles.signOutBtn} onPress={logout} accessibilityRole="button">
          <MaterialIcons name="logout" size={20} color={colors.error} />
          <Text style={styles.signOutBtnText}>{user?.isGuest ? tr('Leave guest mode and sign in', 'મહેમાન મોડ છોડી સાઇન ઇન કરો') : tr('Sign out', 'સાઇન આઉટ')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Avatar picker */}
      <Modal visible={showAvatarModal} transparent animationType="fade" onRequestClose={() => setShowAvatarModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{tr('Profile picture', 'પ્રોફાઇલ ફોટો')}</Text>
              <TouchableOpacity onPress={() => setShowAvatarModal(false)} style={styles.closeBtn} accessibilityLabel={tr('Close', 'બંધ કરો')}>
                <MaterialIcons name="close" size={22} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <View style={styles.photoActionsRow}>
              <TouchableOpacity style={[styles.photoActionBtn, { backgroundColor: colors.primary }]} onPress={handlePickFromGallery}>
                <MaterialIcons name="photo-library" size={18} color={colors.onPrimary} />
                <Text style={[styles.photoActionBtnText, { color: colors.onPrimary }]}>{tr('Choose photo', 'ફોટો પસંદ કરો')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.photoActionBtn, styles.photoActionOutline]} onPress={handleTakePhoto}>
                <MaterialIcons name="photo-camera" size={18} color={colors.primary} />
                <Text style={[styles.photoActionBtnText, { color: colors.primary }]}>{tr('Take photo', 'ફોટો લો')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubheading}>{tr('Or pick an avatar', 'અથવા અવતાર પસંદ કરો')}</Text>
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
    settingDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.outlineVariant },
    langRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingBottom: 14 },
    langOption: { flex: 1, minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: c.outlineVariant, alignItems: 'center', justifyContent: 'center', backgroundColor: c.surface },
    langOptionSelected: { borderWidth: 2, borderColor: c.primary, backgroundColor: c.primaryFixed },
    langOptionText: { fontFamily: MindSprintFonts.label, fontSize: 15.5, color: c.onSurface },
    langOptionTextSelected: { color: c.primary },
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
