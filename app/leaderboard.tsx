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
import { ScreenHeader } from '@/components/mindsprint/ScreenHeader';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/services/api';
import { AcademicGrade, ACADEMIC_CURRICULUM } from '@/constants/academicData';

export default function LeaderboardScreen() {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade: AcademicGrade = (user?.grade as AcademicGrade) || 'college';
  const isSchool = userGrade !== 'college';
  const isGSEB = isSchool;

  // Build subject filter list from curriculum
  const curriculum = ACADEMIC_CURRICULUM[userGrade];
  const subjectFilters = isSchool && curriculum
    ? [
        { key: 'All', label: 'બધા વિષયો', color: '#1D3A8A' },
        ...curriculum.subjects.map((s) => ({
          key: s.name,
          label: s.nameGujarati || s.name,
          color: s.color,
        })),
      ]
    : [
        { key: 'All', label: 'All', color: '#1D3A8A' },
        { key: 'Quantitative Aptitude', label: 'Quant', color: '#F4A30B' },
        { key: 'Data Structures & Algorithms', label: 'DSA', color: '#7FB0FF' },
        { key: 'React & JS', label: 'React', color: '#2F6FD6' },
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
      <ScreenHeader
        title="Rankings"
        subtitle={isSchool ? `Class ${userGrade} · students on your syllabus` : 'Campus placement candidates'}
      />

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
            { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#EEF2F8' },
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
                { color: selectedTab === 'weekly' ? colors.onPrimary : colors.onSurface },
              ]}
            >
              This week
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
                { color: selectedTab === 'allTime' ? colors.onPrimary : colors.onSurface },
              ]}
            >
              All time
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
                <Text style={[styles.subjectChipText, { color: isSel ? colors.onPrimary : colors.onSurface }]}>
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
              <View style={[styles.podiumAvatarCircle, { borderColor: '#9AA6C0' }]}>
                <Text style={styles.podiumEmoji}>{top3[1].avatar}</Text>
              </View>
              <Text style={[styles.podiumName, { color: colors.onSurface }]} numberOfLines={1}>
                {top3[1].name.split(' ')[0]}
              </Text>
              <Text style={[styles.podiumPoints, { color: '#9AA6C0' }]}>{top3[1].points} pts</Text>
              <View style={[styles.podiumBar, { height: 75, backgroundColor: '#9AA6C0' }]}>
                <Text style={styles.podiumRankNumber}>2</Text>
              </View>
            </View>

            {/* Rank 1 - Gold (Center, Highest) */}
            <View style={styles.podiumColumn}>
              <MaterialIcons name="emoji-events" size={24} color="#F4A30B" style={{ marginBottom: -4 }} />
              <View style={[styles.podiumAvatarCircle, { borderColor: '#F4A30B', width: 62, height: 62, borderRadius: 31 }]}>
                <Text style={[styles.podiumEmoji, { fontSize: 26 }]}>{top3[0].avatar}</Text>
              </View>
              <Text style={[styles.podiumName, { color: colors.onSurface, fontWeight: '800' }]} numberOfLines={1}>
                {top3[0].name.split(' ')[0]}
              </Text>
              <Text style={[styles.podiumPoints, { color: '#F4A30B', fontWeight: '800' }]}>{top3[0].points} pts</Text>
              <View style={[styles.podiumBar, { height: 100, backgroundColor: '#F4A30B' }]}>
                <Text style={styles.podiumRankNumber}>1</Text>
              </View>
            </View>

            {/* Rank 3 - Bronze */}
            <View style={[styles.podiumColumn, { marginTop: 36 }]}>
              <View style={[styles.podiumAvatarCircle, { borderColor: '#8A5A00' }]}>
                <Text style={styles.podiumEmoji}>{top3[2].avatar}</Text>
              </View>
              <Text style={[styles.podiumName, { color: colors.onSurface }]} numberOfLines={1}>
                {top3[2].name.split(' ')[0]}
              </Text>
              <Text style={[styles.podiumPoints, { color: '#8A5A00' }]}>{top3[2].points} pts</Text>
              <View style={[styles.podiumBar, { height: 55, backgroundColor: '#8A5A00' }]}>
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
                backgroundColor: isDarkMode ? 'rgba(147,172,255,0.15)' : '#E3EDFC',
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
                  You
                </Text>
                <Text style={[styles.standingSub, { color: colors.onSurfaceVariant }]}>
                  {userRank.accuracy}% accuracy · {userRank.streak}-day streak
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
          All rankings
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
                  <MaterialIcons name="local-fire-department" size={13} color="#F4A30B" />
                  <Text style={[styles.streakSmallText, { color: '#F4A30B' }]}>
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
    fontFamily: MindSprintFonts.heading,
    fontSize: 20,
  },
  listSectionHeading: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 20,
    lineHeight: 26,
    marginTop: 8,
    marginBottom: 10,
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
