import React, { useState, useEffect, useCallback } from 'react';
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
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'expo-router';
import { ApiService } from '@/services/api';
import { AcademicGrade, ACADEMIC_CURRICULUM, subjectsForStream } from '@/constants/academicData';

export default function LeaderboardScreen() {
  const { colors, isDarkMode } = useTheme();
  const { tr } = useLanguage();
  const router = useRouter();
  const { user } = useAuth();

  const userGrade: AcademicGrade = (user?.grade as AcademicGrade) || 'college';
  const isSchool = userGrade !== 'college';

  // Build subject filter list from curriculum
  const curriculum = ACADEMIC_CURRICULUM[userGrade];
  const subjectFilters = isSchool && curriculum
    ? [
        { key: 'All', label: 'બધા વિષયો', color: '#1D3A8A' },
        ...subjectsForStream(curriculum.subjects, userGrade, user?.stream).map((s) => ({
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
  const [loaded, setLoaded] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  const fetchLeaderboard = useCallback(
    () => ApiService.getLeaderboard(userGrade, user?.email, selectedSubject !== 'All' ? selectedSubject : undefined),
    [userGrade, user?.email, selectedSubject]
  );

  const applyResult = (data: any) => {
    if (data && data.leaderboard) {
      setLeaderboardData(data.leaderboard);
      setUserRank(data.userRank);
    } else {
      setLeaderboardData([]);
      setUserRank(null);
    }
  };

  useEffect(() => {
    let active = true;
    fetchLeaderboard()
      .then((data) => { if (active) applyResult(data); })
      .catch((e) => console.warn('Leaderboard fetch note:', e))
      .finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, [fetchLeaderboard]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard()
      .then(applyResult)
      .catch((e) => console.warn('Leaderboard fetch note:', e))
      .finally(() => setRefreshing(false));
  };

  const top3 = leaderboardData.slice(0, 3);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader
        title={tr('Rankings', 'રેન્કિંગ')}
        subtitle={isSchool ? tr(`Class ${userGrade} · students on your syllabus`, `ધોરણ ${userGrade} · તમારા અભ્યાસક્રમના વિદ્યાર્થીઓ`) : tr('Campus placement candidates', 'કેમ્પસ પ્લેસમેન્ટ ઉમેદવારો')}
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

        {/* Not ranked yet: no tests taken (or server offline) */}
        {userRank && userRank.rank == null && leaderboardData.length > 0 && (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant, paddingVertical: 16 }]}>
            <Text style={[styles.emptyTitle, { color: colors.onSurface, fontSize: 16 }]}>
              {tr('You are not ranked yet', 'તમારો હજુ રેન્ક નથી')}
            </Text>
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
              {tr('Take a test to get your rank.', 'રેન્ક મેળવવા માટે ટેસ્ટ આપો.')}
            </Text>
          </View>
        )}

        {/* Your Standing Banner */}
        {userRank && userRank.rank != null && (
          <View
            style={[
              styles.yourStandingCard,
              {
                backgroundColor: colors.primaryFixed,
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
                  {tr('You', 'તમે')}
                </Text>
                <Text style={[styles.standingSub, { color: colors.onSurfaceVariant }]}>
                  {tr(`${userRank.accuracy}% accuracy · ${userRank.streak}-day streak`, `${userRank.accuracy}% ચોકસાઈ · ${userRank.streak} દિવસની સ્ટ્રીક`)}
                </Text>
              </View>
            </View>
            <Text style={[styles.standingPoints, { color: colors.primary }]}>
              {userRank.points} pts
            </Text>
          </View>
        )}

        {loaded && leaderboardData.length === 0 && (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
            <MaterialIcons name="emoji-events" size={30} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
              {tr('No rankings yet', 'હજુ કોઈ રેન્કિંગ નથી')}
            </Text>
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
              {tr(
                'Rankings appear when the server is online and students take tests. Take a quiz to get on the board.',
                'સર્વર ચાલુ હોય અને વિદ્યાર્થીઓ ટેસ્ટ આપે ત્યારે રેન્કિંગ દેખાશે. બોર્ડ પર આવવા ક્વિઝ આપો.'
              )}
            </Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/exam?limit=10' as any)}
              accessibilityRole="button"
            >
              <Text style={[styles.emptyBtnText, { color: colors.onPrimary }]}>{tr('Take a quiz', 'ક્વિઝ આપો')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Rest of Leaderboard List */}
        {leaderboardData.length > 0 && (
          <Text style={[styles.listSectionHeading, { color: colors.onSurface }]}>
            {tr('All rankings', 'બધા રેન્ક')}
          </Text>
        )}

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
                    {isSchool ? tr(`Class ${userGrade}`, `ધોરણ ${userGrade}`) : item.college}
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
  emptyCard: {
    alignItems: 'center',
    gap: 8,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  emptyTitle: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 18,
    lineHeight: 24,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  emptyBtn: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 6,
  },
  emptyBtnText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 15,
  },
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
