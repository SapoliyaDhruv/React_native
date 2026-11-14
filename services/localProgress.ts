import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * On-device record of finished tests.
 *
 * Every submitted test is stored here (in addition to the server) so that the
 * dashboard, weak topics and streak show the student's REAL activity when the
 * server or database is unreachable — never invented numbers. With no tests
 * recorded, everything is empty/zero.
 */
export type LocalResult = {
  id: string;
  grade: string;
  category: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  weakCategories: string[];
  createdAt: string; // ISO
};

const MAX_RESULTS = 200;
const keyFor = (email?: string) => `@mindsprint_local_results_${(email || 'guest').toLowerCase()}`;

export async function getLocalResults(email?: string): Promise<LocalResult[]> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(email));
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function addLocalResult(email: string | undefined, result: Omit<LocalResult, 'id' | 'createdAt'>): Promise<void> {
  try {
    const list = await getLocalResults(email);
    const entry: LocalResult = {
      ...result,
      id: `local_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const next = [entry, ...list].slice(0, MAX_RESULTS);
    await AsyncStorage.setItem(keyFor(email), JSON.stringify(next));
  } catch {
    // storage unavailable — nothing to record
  }
}

/** Results for one grade (college also matches results saved without a grade). */
function forGrade(list: LocalResult[], grade?: string) {
  if (!grade) return list;
  return list.filter((r) => (r.grade || 'college') === grade);
}

const dayKey = (d: Date) => d.toISOString().split('T')[0];

/** Consecutive days with at least one test, ending today or yesterday. 0 if none. */
export function computeStreak(list: LocalResult[], now = new Date()): number {
  const days = new Set(list.map((r) => dayKey(new Date(r.createdAt))));
  if (days.size === 0) return 0;
  const cursor = new Date(dayKey(now));
  if (!days.has(dayKey(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

/** Same shape as GET /api/user/dashboard-stats, computed from on-device results. */
export async function computeLocalDashboardStats(email?: string, grade = 'college') {
  const results = forGrade(await getLocalResults(email), grade);
  const totalTests = results.length;
  const avgScore = totalTests
    ? Math.round(results.reduce((a, r) => a + (r.scorePercentage || 0), 0) / totalTests)
    : 0;
  const totalQuestionsAnswered = results.reduce((a, r) => a + (r.totalQuestions || 0), 0);
  const weakCategoriesMap: Record<string, number> = {};
  results.forEach((r) => (r.weakCategories || []).forEach((c) => (weakCategoriesMap[c] = (weakCategoriesMap[c] || 0) + 1)));
  const streakCount = computeStreak(results);

  const unlockedBadges: string[] = [];
  if (totalTests >= 1) unlockedBadges.push('first_step');
  if (results.some((r) => r.scorePercentage === 100)) unlockedBadges.push('bullseye');
  if (totalTests >= 3) unlockedBadges.push('quant_master');
  if (totalTests >= 5) unlockedBadges.push('dsa_ninja');
  if (streakCount >= 7) unlockedBadges.push('streak_flame');

  return {
    userEmail: email || 'guest',
    grade,
    streakCount,
    totalTests,
    avgScore,
    totalQuestionsAnswered,
    recentActivity: results.slice(0, 5).map((r) => ({
      id: r.id,
      scorePercentage: r.scorePercentage,
      correctCount: r.correctCount,
      totalQuestions: r.totalQuestions,
      createdAt: r.createdAt,
      grade: r.grade,
      category: r.category,
    })),
    weakCategoriesMap,
    unlockedBadges,
    source: 'device' as const,
  };
}

/** Top weak topics from on-device results; empty when there are no tests. */
export async function computeLocalWeakSpots(email?: string, grade = 'college') {
  const results = forGrade(await getLocalResults(email), grade);
  const counts: Record<string, number> = {};
  results.forEach((r) => (r.weakCategories || []).forEach((c) => (counts[c] = (counts[c] || 0) + 1)));
  const weakTopics = Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, 3);
  return { weakTopics, totalTests: results.length };
}
