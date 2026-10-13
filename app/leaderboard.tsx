import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/services/api';
import { AcademicGrade, ACADEMIC_CURRICULUM } from '@/constants/academicData';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade: AcademicGrade = (user?.grade as AcademicGrade) || 'college';
  const isSchool = userGrade !== 'college';
  const isGSEB = isSchool && user?.medium === 'Gujarati';

  // Build subject filter list from curriculum
  const curriculum = ACADEMIC_CURRICULUM[userGrade];
  const subjectFilters = isSchool && curriculum
    ? [
        { key: 'All', label: 'All Subjects', color: '#6366f1' },
        ...curriculum.subjects.map((s) => ({
          key: s.name,
          label: isGSEB ? (s.nameGujarati || s.name) : s.name,
          color: s.color,
        })),
      ]
    : [
        { key: 'All', label: 'All', color: '#6366f1' },
        { key: 'Quantitative Aptitude', label: 'Quant', color: '#f59e0b' },
        { key: 'Data Structures & Algorithms', label: 'DSA', color: '#a78bfa' },
        { key: 'React & JS', label: 'React', color: '#38bdf8' },
      ];

  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<'weekly' | 'allTime'>('weekly');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  const loadLeaderboard = async () => {
    try {
      const subjectParam = selectedSubject !== 'All' ? selectedSubject : undefined;
      const data = await ApiService.getLeaderboard(userGrade, user?.email, subjectParam);
      if (data && data.leaderboard) {
        setLeaderboardData(data.leaderboard);
        setUserRank(data.userRank);
      }
    } catch (e) {
      console.warn('Leaderboard fetch note:', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [userGrade, user?.email, selectedSubject]);

  const onRefresh = () => {
    setRefreshing(true);
    loadLeaderboard();
  };

  const top3 = leaderboardData.slice(0, 3);
  const restRanks = leaderboardData.slice(3);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header Bar */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.outlineVariant,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            {isSchool ? `Class ${userGrade} Peer Leaderboard` : 'Campus Placement Leaderboard'}
          </Text>
          <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
            {isSchool ? 'Top Scholars in Your Syllabus' : 'Top Candidates Targeting TCS, Infosys & FAANG'}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Tab Switcher */}
        <View
          style={[
            styles.tabBar,
            { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f1f5f9' },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.tabBtn,
              selectedTab === 'weekly' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setSelectedTab('weekly')}
          >
            <Text
              style={[
                styles.tabBtnText,
                { color: selectedTab === 'weekly' ? '#ffffff' : colors.onSurface },
              ]}
            >
              This Week's Sprints ⚡
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              selectedTab === 'allTime' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setSelectedTab('allTime')}
          >
            <Text
              style={[
                styles.tabBtnText,
                { color: selectedTab === 'allTime' ? '#ffffff' : colors.onSurface },
              ]}
            >
              All-Time Legends 👑
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subject Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subjectChipScroll}>
          {subjectFilters.map((f) => {
            const isSel = selectedSubject === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.subjectChip,
                  {
                    backgroundColor: isSel ? f.color : isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                    borderColor: isSel ? f.color : colors.outlineVariant,
                  },
                ]}
                onPress={() => setSelectedSubject(f.key)}
              >
                <Text style={[styles.subjectChipText, { color: isSel ? '#ffffff' : colors.onSurface }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {top3.length >= 3 && (
          <View style={styles.podiumContainer}>
            {/* Rank 2 - Silver */}
            <View style={[styles.podiumColumn, { marginTop: 24 }]}>
              <View style={[styles.podiumAvatarCircle, { borderColor: '#94a3b8' }]}>
                <Text style={styles.podiumEmoji}>{top3[1].avatar}</Text>
              </View>
              <Text style={[styles.podiumName, { color: colors.onSurface }]} numberOfLines={1}>
                {top3[1].name.split(' ')[0]}
              </Text>
              <Text style={[styles.podiumPoints, { color: '#94a3b8' }]}>{top3[1].points} pts</Text>
              <View style={[styles.podiumBar, { height: 75, backgroundColor: '#94a3b8' }]}>
                <Text style={styles.podiumRankNumber}>2</Text>
              </View>
            </View>

            {/* Rank 1 - Gold (Center, Highest) */}
            <View style={styles.podiumColumn}>
              <MaterialIcons name="emoji-events" size={24} color="#f59e0b" style={{ marginBottom: -4 }} />
              <View style={[styles.podiumAvatarCircle, { borderColor: '#f59e0b', width: 62, height: 62, borderRadius: 31 }]}>
                <Text style={[styles.podiumEmoji, { fontSize: 26 }]}>{top3[0].avatar}</Text>
              </View>
              <Text style={[styles.podiumName, { color: colors.onSurface, fontWeight: '800' }]} numberOfLines={1}>
                {top3[0].name.split(' ')[0]}
              </Text>
              <Text style={[styles.podiumPoints, { color: '#f59e0b', fontWeight: '800' }]}>{top3[0].points} pts</Text>
              <View style={[styles.podiumBar, { height: 100, backgroundColor: '#f59e0b' }]}>
                <Text style={styles.podiumRankNumber}>1</Text>
              </View>
            </View>

            {/* Rank 3 - Bronze */}
            <View style={[styles.podiumColumn, { marginTop: 36 }]}>
              <View style={[styles.podiumAvatarCircle, { borderColor: '#d97706' }]}>
                <Text style={styles.podiumEmoji}>{top3[2].avatar}</Text>
              </View>
              <Text style={[styles.podiumName, { color: colors.onSurface }]} numberOfLines={1}>
                {top3[2].name.split(' ')[0]}
              </Text>
              <Text style={[styles.podiumPoints, { color: '#d97706' }]}>{top3[2].points} pts</Text>
              <View style={[styles.podiumBar, { height: 55, backgroundColor: '#d97706' }]}>
                <Text style={styles.podiumRankNumber}>3</Text>
              </View>
            </View>
          </View>
        )}

        {/* Your Standing Banner */}
        {userRank && (
          <View
            style={[
              styles.yourStandingCard,
              {
                backgroundColor: isDarkMode ? 'rgba(129,140,248,0.15)' : '#eff6ff',
                borderColor: colors.primary,
              },
              MindSprintShadows.glow,
            ]}
          >
            <View style={styles.standingLeft}>
              <View style={[styles.standingRankBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.standingRankText}>#{userRank.rank}</Text>
              </View>
              <View>
                <Text style={[styles.standingTitle, { color: colors.onSurface }]}>
                  Your Standing ({user?.name || 'You'})
                </Text>
                <Text style={[styles.standingSub, { color: colors.onSurfaceVariant }]}>
                  {userRank.accuracy}% Accuracy • 🔥 {userRank.streak} Days
                </Text>
              </View>
            </View>
            <Text style={[styles.standingPoints, { color: colors.primary }]}>
              {userRank.points} pts
            </Text>
          </View>
        )}

        {/* Rest of Leaderboard List */}
        <Text style={[styles.listSectionHeading, { color: colors.onSurface }]}>
          Complete Leaderboard Rankings
        </Text>

        <View style={styles.ranksList}>
          {leaderboardData.map((item) => (
            <View
              key={item.id}
              style={[
                styles.rankItemCard,
                {
                  backgroundColor: colors.surfaceContainerLowest,
                  borderColor: colors.outlineVariant,
                },
                MindSprintShadows.card,
              ]}
            >
              <View style={styles.rankLeft}>
                <Text style={[styles.rankNumber, { color: colors.outline }]}>
                  #{item.rank}
                </Text>
                <Text style={styles.rankAvatar}>{item.avatar}</Text>
                <View>
                  <Text style={[styles.rankItemName, { color: colors.onSurface }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.rankItemCollege, { color: colors.onSurfaceVariant }]}>
                    {isSchool ? `Class ${userGrade}` : item.college}
                  </Text>
                </View>
              </View>

              <View style={styles.rankRight}>
                <Text style={[styles.rankItemPoints, { color: colors.primary }]}>
                  {item.points} pts
                </Text>
                <View style={styles.streakSmallRow}>
                  <MaterialIcons name="local-fire-department" size={13} color="#f59e0b" />
                  <Text style={[styles.streakSmallText, { color: '#f59e0b' }]}>
                    {item.streak}d
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 12,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  subjectChipScroll: {
    gap: 8,
    paddingBottom: 2,
  },
  subjectChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  subjectChipText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  podiumColumn: {
    alignItems: 'center',
    width: 90,
  },
  podiumAvatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 4,
  },
  podiumEmoji: {
    fontSize: 22,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '700',
  },
  podiumPoints: {
    fontSize: 11,
    marginTop: 1,
    marginBottom: 6,
  },
  podiumBar: {
    width: '100%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  podiumRankNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  yourStandingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 14,
  },
  standingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  standingRankBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  standingRankText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  standingTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  standingSub: {
    fontSize: 11,
    marginTop: 2,
  },
  standingPoints: {
    fontSize: 16,
    fontWeight: '900',
  },
  listSectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  ranksList: {
    gap: 10,
  },
  rankItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rankNumber: {
    fontSize: 13,
    fontWeight: '800',
    width: 24,
  },
  rankAvatar: {
    fontSize: 20,
  },
  rankItemName: {
    fontSize: 14,
    fontWeight: '700',
  },
  rankItemCollege: {
    fontSize: 11,
    marginTop: 1,
  },
  rankRight: {
    alignItems: 'flex-end',
  },
  rankItemPoints: {
    fontSize: 14,
    fontWeight: '800',
  },
  streakSmallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  streakSmallText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
