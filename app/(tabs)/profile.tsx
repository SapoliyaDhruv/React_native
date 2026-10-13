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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/services/api';
import { AcademicGradeModal } from '@/components/mindsprint/AcademicGradeModal';
import { AcademicGrade, EducationBoard, InstructionMedium, GRADE_OPTIONS } from '@/constants/academicData';

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDpTpadB_GY_XTy7q4R83ni9Q0r3ovKCNCuNHvfTLdAAUsEDZQQ26lLxFQO_WijYLtiUQadQJ_c0VDSE0fHXcuipv31vufAkHZtjG1aj35AKp-BjX-2zVCFy4qBBlHxSdFhkGtwh5DKfM4qwVUmYdc-K3yrzrEPvVhlN2E9YXrZH1pl8ECG17oL9IkbPI8NtjpIidsOBmstyEVvCWiL4dNDK14kJBzDlDXzw8GOBDLwWHwzKNd5EGU3';

type MenuOption = {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  route?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const { user, logout, updateAcademicProfile } = useAuth();
  const [userStats, setUserStats] = useState<any>(null);
  const [showGradeModal, setShowGradeModal] = useState<boolean>(false);

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
      'Curriculum Updated! 🎓',
      `Your learning track is now set to ${grade === 'college' ? 'College Placements' : `Class ${grade} (${board} • ${medium})`}.`
    );
  };

  const userGrade = user?.grade || 'college';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode && user?.medium === 'Gujarati';

  const currentGradeObj = GRADE_OPTIONS.find((g) => g.grade === userGrade) || GRADE_OPTIONS[7];

  const dynamicMenuItems: MenuOption[] = [
    {
      id: 'edit_profile',
      icon: 'manage-accounts',
      title: isSchoolMode ? 'Edit Profile & Academic Goals' : 'Edit Profile & Target Goals',
      subtitle: isSchoolMode ? 'Grade, board & medium settings' : 'Target company, institute & account settings',
      route: '/profile-edit',
    },
    {
      id: 'mastery',
      icon: 'insights',
      title: isSchoolMode ? 'Subject Mastery Radar & Progress' : 'Subject Mastery Radar & AI Prescription',
      subtitle: isSchoolMode ? 'Topic-by-topic syllabus accuracy and recovery plan' : 'Topic-by-topic accuracy and recovery plan',
      route: '/mastery-analytics',
    },
    {
      id: 'duel',
      icon: 'sports-kabaddi',
      title: '1v1 Speed Quiz Duel ⚔️',
      subtitle: 'Real-time 5-question rapid duel with classmates',
      route: '/quiz-duel',
    },
    {
      id: 'interview',
      icon: 'record-voice-over',
      title: isSchoolMode ? 'AI Oral Exam & Viva Simulator 🎙️' : 'AI Mock Interview Simulator',
      subtitle: isSchoolMode ? 'Practice lab viva & concept defense with voice coach' : 'Practice placement & viva questions with AI',
      route: '/interview-simulator',
    },
    {
      id: 'leaderboard',
      icon: 'emoji-events',
      title: isSchoolMode ? 'Class & School Leaderboard 🏆' : 'Campus & School Leaderboard',
      subtitle: 'View peer rankings & state standings',
      route: '/leaderboard',
    },
    {
      id: 'error_vault',
      icon: 'security',
      title: 'AI Error Vault & Mistake Notebook 🛡️',
      subtitle: 'Fix questions answered incorrectly in quizzes & duels',
      route: '/error-vault',
    },
    {
      id: 'doubt_solver',
      icon: 'photo-camera',
      title: 'Snap & Solve AI Doubt Scanner 📸',
      subtitle: 'Instant textbook equation & question matching',
      route: '/doubt-solver',
    },
    {
      id: 'board_sim',
      icon: 'assignment',
      title: '80-Mark Board Exam Simulator 📄',
      subtitle: 'Official 3-hour exam simulation with step-wise rubric',
      route: '/board-exam-simulator',
    },
    {
      id: 'bookmarks',
      icon: 'bookmark-border',
      title: 'Offline Revision Vault & Bookmarks',
      subtitle: 'Study saved chapters & questions with zero internet',
      route: '/bookmarks',
    },
    {
      id: 'formulas',
      icon: 'menu-book',
      title: isSchoolMode ? `Class ${userGrade} Formula Sheets` : 'Formula & Revision Cheat Sheets',
      subtitle: isSchoolMode ? 'Maths formulas & Science revision notes' : 'Quant formulas, DSA & Science notes',
      route: '/cheatsheets',
    },
    {
      id: 'flashcards',
      icon: 'question-answer',
      title: isSchoolMode ? `Class ${userGrade} Concept Flashcards 📇` : 'Placement Flashcard Decks',
      subtitle: isSchoolMode ? 'Chapter formulas & exercise solutions revision' : 'Rapid HR & Tech Q&A revision',
      route: '/flashcards',
    },
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.outlineVariant,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Profile & Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: colors.surfaceContainer,
            },
            MindSprintShadows.card,
          ]}
        >
          <Image source={{ uri: AVATAR_URL }} style={styles.avatar} />
          <Text style={[styles.userName, { color: colors.onSurface }]}>
            {user?.name || 'Guest Student'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.onSurfaceVariant }]}>
            {user?.email || 'guest@mindsprint.app'}
          </Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <MaterialIcons
                name={user?.isGuest ? 'person-outline' : 'workspace-premium'}
                size={14}
                color={colors.onTertiaryFixed}
              />
              <Text style={styles.badgeText}>
                {user?.isGuest ? 'Guest Access' : 'Verified Student'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.editProfileBtn, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.2)' : '#eef2ff' }]}
              onPress={() => router.push('/profile-edit')}
            >
              <MaterialIcons name="edit" size={14} color={colors.primary} />
              <Text style={[styles.editProfileBtnText, { color: colors.primary }]}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Academic Stage & Curriculum Selector Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.curriculumCard,
            {
              backgroundColor: isDarkMode ? 'rgba(129,140,248,0.1)' : '#eff6ff',
              borderColor: isDarkMode ? 'rgba(129,140,248,0.3)' : '#bfdbfe',
            },
            MindSprintShadows.card,
          ]}
          onPress={() => setShowGradeModal(true)}
        >
          <View style={styles.curriculumLeft}>
            <View style={[styles.curriculumIconCircle, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="school" size={24} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.currTagRow}>
                <Text style={[styles.currTag, { color: colors.primary }]}>ACTIVE ACADEMIC STAGE</Text>
              </View>
              <Text style={[styles.currTitle, { color: colors.onSurface }]}>
                {currentGradeObj.label}
              </Text>
              <Text style={[styles.currSubtitle, { color: colors.onSurfaceVariant }]}>
                {user?.grade === 'college'
                  ? 'Campus Recruitment (TCS, Amazon, DSA)'
                  : `${user?.board || 'CBSE'} Board • ${user?.medium || 'English'} Medium`}
              </Text>
            </View>
          </View>
          <View style={[styles.changePill, { backgroundColor: colors.primary }]}>
            <Text style={styles.changePillText}>Change ▾</Text>
          </View>
        </TouchableOpacity>

        {/* Achievements Showcase */}
        <View style={styles.achievementsSection}>
          <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>
            Unlocked Badges & Achievements
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
            {[
              { id: 'first_step', icon: 'emoji-events', title: 'First Step', sub: 'Completed 1st Exam', color: '#f59e0b' },
              { id: 'bullseye', icon: 'gps-fixed', title: 'Bullseye 🎯', sub: '100% Exam Score', color: '#10b981' },
              { id: 'quant_master', icon: 'calculate', title: 'Math Master', sub: '3+ Math/Quant Tests', color: '#3b82f6' },
              { id: 'dsa_ninja', icon: 'account-tree', title: 'Logic Ninja 🥷', sub: '5+ Logic Drills', color: '#8b5cf6' },
              { id: 'streak_flame', icon: 'local-fire-department', title: 'Streak Flame', sub: '7 Day Streak', color: '#ef4444' },
            ].map((b) => {
              const isUnlocked = (userStats?.unlockedBadges || ['first_step']).includes(b.id);
              return (
                <View
                  key={b.id}
                  style={[
                    styles.achievementBadgeCard,
                    {
                      backgroundColor: colors.surfaceContainerLowest,
                      borderColor: isUnlocked ? b.color : colors.outlineVariant,
                      opacity: isUnlocked ? 1 : 0.4,
                    },
                    MindSprintShadows.card,
                  ]}
                >
                  <View style={[styles.badgeIconCircle, { backgroundColor: `${b.color}20` }]}>
                    <MaterialIcons name={b.icon as any} size={24} color={isUnlocked ? b.color : colors.outline} />
                  </View>
                  <Text style={[styles.achievementTitle, { color: colors.onSurface }]}>{b.title}</Text>
                  <Text style={[styles.achievementSub, { color: colors.onSurfaceVariant }]}>{b.sub}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Dark Mode Switch Row Card */}
        <View
          style={[
            styles.darkModeCard,
            {
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: colors.outlineVariant,
            },
          ]}
        >
          <View style={styles.darkModeLeft}>
            <View style={styles.menuIconBox}>
              <MaterialIcons
                name={isDarkMode ? 'dark-mode' : 'light-mode'}
                size={22}
                color={colors.primary}
              />
            </View>
            <View>
              <Text style={[styles.menuTitle, { color: colors.onSurface }]}>Dark Mode</Text>
              <Text style={[styles.menuSubtitle, { color: colors.onSurfaceVariant }]}>
                {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
              </Text>
            </View>
          </View>

          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#c7c4d8', true: colors.primary }}
            thumbColor="#ffffff"
          />
        </View>

        {/* Menu Items */}
        <View
          style={[
            styles.menuContainer,
            {
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: colors.outlineVariant,
            },
          ]}
        >
          {dynamicMenuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => {
                if (item.route) {
                  router.push(item.route as any);
                }
              }}
              style={[
                styles.menuItem,
                index < dynamicMenuItems.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.outlineVariant,
                },
              ]}
            >
              <View style={styles.menuIconBox}>
                <MaterialIcons name={item.icon} size={22} color={colors.primary} />
              </View>
              <View style={styles.menuTextContent}>
                <Text style={[styles.menuTitle, { color: colors.onSurface }]}>
                  {item.title}
                </Text>
                {item.subtitle && (
                  <Text style={[styles.menuSubtitle, { color: colors.onSurfaceVariant }]}>
                    {item.subtitle}
                  </Text>
                )}
              </View>
              <MaterialIcons
                name="chevron-right"
                size={22}
                color={colors.outline}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Switch Account / Sign Out Action */}
        <TouchableOpacity
          style={[
            styles.signOutBtn,
            {
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: colors.primary,
            },
          ]}
          onPress={logout}
        >
          <MaterialIcons name="logout" size={20} color={colors.primary} />
          <Text style={[styles.signOutBtnText, { color: colors.primary }]}>
            {user?.isGuest ? 'Exit Guest Mode & Log In' : 'Log Out of MindSprint'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Grade Selector Modal */}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  editProfileBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  curriculumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
  },
  curriculumLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  curriculumIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currTagRow: {
    marginBottom: 2,
  },
  currTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  currTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  currSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  changePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  changePillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  achievementsSection: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  badgesScroll: {
    gap: 12,
    paddingRight: 16,
  },
  achievementBadgeCard: {
    width: 120,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  achievementSub: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#3525cd',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#70fbbe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#002114',
  },
  darkModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  darkModeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuContainer: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(53, 37, 205, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 20,
    gap: 8,
  },
  signOutBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
