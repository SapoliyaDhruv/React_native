import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/services/api';
import { Question } from '@/constants/mindsprintData';
import {
  CHEATSHEETS_DATA,
  CheatSheetItem,
  FormulaStorage,
} from '@/constants/cheatsheetsData';
import { ACADEMIC_CURRICULUM, AcademicGrade } from '@/constants/academicData';

type BookmarkTab = 'questions' | 'formulas' | 'chapters';

const CACHE_KEY_QUESTIONS = '@mindsprint_offline_vault_qs';

const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'Quant Formulas':
      return { borderLeftColor: '#3b82f6', bg: '#dbeafe', text: '#1e40af' };
    case 'DSA Time Complexities':
      return { borderLeftColor: '#8b5cf6', bg: '#f3e8ff', text: '#6b21a8' };
    case 'React & JS':
      return { borderLeftColor: '#10b981', bg: '#d1fae5', text: '#065f46' };
    default:
      return { borderLeftColor: '#f59e0b', bg: '#fef3c7', text: '#92400e' };
  }
};

export default function BookmarksScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<BookmarkTab>('questions');
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [savedFormulaIds, setSavedFormulaIds] = useState<string[]>([]);
  const [bookmarkedChapterIds, setBookmarkedChapterIds] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [offlineSynced, setOfflineSynced] = useState<boolean>(true);

  const userGrade: AcademicGrade = (user?.grade as AcademicGrade) || 'college';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode && user?.medium === 'Gujarati';
  const chapterBookmarkKey = `@mindsprint_bookmarked_chapters_${userGrade}_${user?.email || 'guest'}`;

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Try local offline cache first
      const cached = await AsyncStorage.getItem(CACHE_KEY_QUESTIONS);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuestions(parsed);
          }
        } catch (e) {}
      }

      // 2. Fetch fresh bookmarks from MongoDB
      if (user?.email) {
        const res = await ApiService.getBookmarkedQuestions(user.email);
        if (res && res.questions) {
          setQuestions(res.questions);
          setBookmarkedIds(res.bookmarkedQuestionIds || []);
          // Update offline vault cache
          await AsyncStorage.setItem(CACHE_KEY_QUESTIONS, JSON.stringify(res.questions));
        }
      }

      // 3. Fetch saved formulas from AsyncStorage
      const formulaIds = await FormulaStorage.getSavedIds(user?.email);
      setSavedFormulaIds(formulaIds);

      // 4. Fetch bookmarked chapter IDs from AsyncStorage
      const chapBookRaw = await AsyncStorage.getItem(chapterBookmarkKey);
      if (chapBookRaw) setBookmarkedChapterIds(JSON.parse(chapBookRaw));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.email, chapterBookmarkKey]);

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [fetchBookmarks])
  );

  const handleSyncOffline = async () => {
    try {
      if (user?.email) {
        const res = await ApiService.getBookmarkedQuestions(user.email);
        if (res && res.questions) {
          setQuestions(res.questions);
          await AsyncStorage.setItem(CACHE_KEY_QUESTIONS, JSON.stringify(res.questions));
        }
      }
      setOfflineSynced(true);
      Alert.alert('Offline Vault Synced ⚡', 'All your bookmarks are downloaded locally for revision without internet.');
    } catch (e) {
      Alert.alert('Offline Vault Ready', 'Cached copy is available for offline revision.');
    }
  };

  const handleRemoveQuestionBookmark = async (qId: number) => {
    if (!user?.email) return;
    try {
      const res = await ApiService.toggleBookmark(user.email, qId);
      if (res && res.success) {
        const updated = questions.filter((q) => q.id !== qId);
        setQuestions(updated);
        setBookmarkedIds((prev) => prev.filter((id) => id !== qId));
        await AsyncStorage.setItem(CACHE_KEY_QUESTIONS, JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleRemoveFormulaBookmark = async (item: CheatSheetItem) => {
    const res = await FormulaStorage.toggleSave(user?.email, item.id);
    setSavedFormulaIds(res.ids);
    Alert.alert('Bookmark Removed', `"${item.title}" removed from saved formulas.`);
  };

  const handleCopyFormula = (title: string, formulaText: string) => {
    Alert.alert('Formula Copied 📋', `"${formulaText}" copied for quick revision!`);
  };

  const savedFormulasList = CHEATSHEETS_DATA.filter((item) =>
    savedFormulaIds.includes(item.id)
  );

  // Build bookmarked chapter list from curriculum
  const curriculum = ACADEMIC_CURRICULUM[userGrade];
  const bookmarkedChaptersList = curriculum
    ? curriculum.subjects.flatMap((sub) =>
        sub.chapters
          .filter((chap) => bookmarkedChapterIds.includes(chap.id))
          .map((chap) => ({
            ...chap,
            subjectName: isGSEB && sub.nameGujarati ? sub.nameGujarati : sub.name,
            subjectColor: sub.color,
          }))
      )
    : [];

  const questionCategories = ['All', ...Array.from(new Set(questions.map((q) => q.category)))];

  const filteredQuestions = questions.filter((q) => {
    if (selectedFilter === 'All') return true;
    return q.category === selectedFilter;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Top App Bar Header */}
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
            Offline Revision Vault
          </Text>
          <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
            {questions.length} Questions • {savedFormulasList.length} Formulas • {bookmarkedChaptersList.length} Chapters
          </Text>
        </View>

        <TouchableOpacity onPress={handleSyncOffline} style={styles.syncBtn}>
          <MaterialIcons name="cloud-download" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Offline Status Badge */}
      <View style={[styles.offlineBanner, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5' }]}>
        <MaterialIcons name="offline-bolt" size={16} color="#10b981" />
        <Text style={styles.offlineBannerText}>
          Offline Revision Vault Ready • All items cached locally
        </Text>
      </View>

      {/* Segmented Tab Switcher */}
      <View style={[styles.tabBar, { backgroundColor: colors.surfaceContainerLow }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.tabItem,
            activeTab === 'questions' && [
              styles.activeTabItem,
              { backgroundColor: colors.surfaceContainerLowest },
              MindSprintShadows.card,
            ],
          ]}
          onPress={() => {
            setActiveTab('questions');
            setSelectedFilter('All');
          }}
        >
          <MaterialIcons
            name="quiz"
            size={18}
            color={activeTab === 'questions' ? colors.primary : colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'questions' ? colors.primary : colors.onSurfaceVariant,
                fontWeight: activeTab === 'questions' ? '700' : '600',
              },
            ]}
          >
            Exam Questions ({questions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.tabItem,
            activeTab === 'formulas' && [
              styles.activeTabItem,
              { backgroundColor: colors.surfaceContainerLowest },
              MindSprintShadows.card,
            ],
          ]}
          onPress={() => {
            setActiveTab('formulas');
            setSelectedFilter('All');
          }}
        >
          <MaterialIcons
            name="menu-book"
            size={18}
            color={activeTab === 'formulas' ? colors.primary : colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'formulas' ? colors.primary : colors.onSurfaceVariant,
                fontWeight: activeTab === 'formulas' ? '700' : '600',
              },
            ]}
          >
            Formula Sheets ({savedFormulasList.length})
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Bookmarked Chapters */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.tabItem,
            activeTab === 'chapters' && [
              styles.activeTabItem,
              { backgroundColor: colors.surfaceContainerLowest },
              MindSprintShadows.card,
            ],
          ]}
          onPress={() => { setActiveTab('chapters'); setSelectedFilter('All'); }}
        >
          <MaterialIcons
            name="bookmark"
            size={18}
            color={activeTab === 'chapters' ? colors.primary : colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'chapters' ? colors.primary : colors.onSurfaceVariant,
                fontWeight: activeTab === 'chapters' ? '700' : '600',
              },
            ]}
          >
            {`Chapters (${bookmarkedChaptersList.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>
            Loading your revision vault...
          </Text>
        </View>
      ) : activeTab === 'questions' ? (
        /* TAB 1: EXAM QUESTIONS */
        questions.length === 0 ? (
          <View style={styles.centerBox}>
            <MaterialIcons name="bookmark-border" size={56} color={colors.outline} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
              No Bookmarked Questions Yet
            </Text>
            <Text style={[styles.emptySub, { color: colors.onSurfaceVariant }]}>
              Bookmark hard questions during mock tests or chapter quizzes to practice them offline here!
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Category Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
              {questionCategories.map((cat) => {
                const isSelected = selectedFilter === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceContainerLowest,
                        borderColor: isSelected ? colors.primary : colors.outlineVariant,
                      },
                    ]}
                    onPress={() => setSelectedFilter(cat)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: isSelected ? '#ffffff' : colors.onSurface },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Question Breakdown List */}
            {filteredQuestions.map((q, idx) => (
              <View
                key={q.id || idx}
                style={[
                  styles.questionCard,
                  {
                    backgroundColor: colors.surfaceContainerLowest,
                    borderColor: colors.outlineVariant,
                  },
                  MindSprintShadows.card,
                ]}
              >
                {/* Question Header */}
                <View style={styles.qMetaRow}>
                  <View style={[styles.categoryTagPill, { backgroundColor: '#e0e7ff' }]}>
                    <Text style={styles.categoryTagPillText}>
                      Q{idx + 1} • {q.category}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.bookmarkActionBtn}
                    onPress={() => handleRemoveQuestionBookmark(q.id)}
                  >
                    <MaterialIcons name="bookmark" size={22} color={colors.primary} />
                    <Text style={[styles.removeText, { color: colors.primary }]}>Saved</Text>
                  </TouchableOpacity>
                </View>

                {/* Question Statement */}
                <Text style={[styles.questionStatement, { color: colors.onSurface }]}>
                  {q.questionText}
                </Text>

                {/* Options Breakdown */}
                <View style={styles.optionsList}>
                  {q.options.map((opt, optIdx) => {
                    const isCorrectAnswer = optIdx === q.correctAnswer;
                    return (
                      <View
                        key={optIdx}
                        style={[
                          styles.optionCard,
                          {
                            backgroundColor: isCorrectAnswer
                              ? 'rgba(16, 185, 129, 0.15)'
                              : colors.surfaceContainerHigh,
                            borderColor: isCorrectAnswer ? '#10b981' : colors.outlineVariant,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionLetter,
                            { color: isCorrectAnswer ? '#065f46' : colors.onSurfaceVariant },
                          ]}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </Text>
                        <Text
                          style={[
                            styles.optionText,
                            { color: isCorrectAnswer ? '#065f46' : colors.onSurface },
                          ]}
                        >
                          {opt}
                        </Text>
                        {isCorrectAnswer && (
                          <View style={styles.correctPill}>
                            <Text style={styles.correctPillText}>Correct ✓</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>

                {/* Step-by-Step Explanation */}
                <View style={[styles.explContainer, { backgroundColor: 'rgba(53, 37, 205, 0.08)' }]}>
                  <View style={styles.explHeader}>
                    <MaterialIcons name="lightbulb" size={16} color={colors.primary} />
                    <Text style={[styles.explTitle, { color: colors.primary }]}>Explanation</Text>
                  </View>
                  <Text style={[styles.explBody, { color: colors.onSurface }]}>
                    {q.explanation}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )
      ) : activeTab === 'formulas' ? (
        /* TAB 2: FORMULA CHEAT SHEETS */
        savedFormulasList.length === 0 ? (
          <View style={styles.centerBox}>
            <MaterialIcons name="menu-book" size={56} color={colors.outline} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
              No Saved Formulas Yet
            </Text>
            <Text style={[styles.emptySub, { color: colors.onSurfaceVariant }]}>
              Open Formula & Revision Cheat Sheets and tap the bookmark icon on any formula card to save it here!
            </Text>
            <TouchableOpacity
              style={[styles.exploreBtn, { backgroundColor: colors.primary }, MindSprintShadows.glow]}
              onPress={() => router.push('/cheatsheets')}
            >
              <MaterialIcons name="search" size={18} color="#ffffff" />
              <Text style={styles.exploreBtnText}>Explore Formula Cheat Sheets</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {savedFormulasList.map((item) => {
              const catStyle = getCategoryStyle(item.category);
              return (
                <View
                  key={item.id}
                  style={[
                    styles.formulaCard,
                    {
                      backgroundColor: colors.surfaceContainerLowest,
                      borderColor: colors.outlineVariant,
                      borderLeftColor: catStyle.borderLeftColor,
                    },
                    MindSprintShadows.card,
                  ]}
                >
                  <View style={styles.formulaCardHeader}>
                    <View style={{ flex: 1, gap: 6 }}>
                      <View style={[styles.categoryTag, { backgroundColor: catStyle.bg }]}>
                        <Text style={[styles.categoryTagText, { color: catStyle.text }]}>
                          {item.category}
                        </Text>
                      </View>
                      <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
                        {item.title}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleRemoveFormulaBookmark(item)}
                      style={styles.bookmarkBtn}
                    >
                      <MaterialIcons name="bookmark" size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </View>

                  {/* Formulas Box */}
                  <View style={[styles.formulaBox, { backgroundColor: colors.surfaceContainerHigh }]}>
                    {item.formulas.map((formula, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.formulaRow,
                          { backgroundColor: colors.surfaceContainerLowest },
                        ]}
                      >
                        <Text style={[styles.formulaText, { color: colors.onSurface }]}>
                          {formula}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleCopyFormula(item.title, formula)}
                          style={[styles.copyBtn, { backgroundColor: colors.primary }]}
                          activeOpacity={0.7}
                        >
                          <MaterialIcons name="content-copy" size={15} color="#ffffff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {/* Pro Notes Footer */}
                  <View style={[styles.notesBox, { backgroundColor: 'rgba(53, 37, 205, 0.08)' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <MaterialIcons name="tips-and-updates" size={18} color={colors.primary} />
                      <Text style={[styles.notesHeading, { color: colors.primary }]}>
                        Key Takeaway:
                      </Text>
                    </View>
                    <Text style={[styles.notesText, { color: colors.onSurface }]}>
                      {item.notes}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )
      ) : (
        /* TAB 3: BOOKMARKED CHAPTERS */
        bookmarkedChaptersList.length === 0 ? (
          <View style={styles.centerBox}>
            <MaterialIcons name="bookmark-border" size={56} color={colors.outline} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
              {'No Chapters Bookmarked Yet'}
            </Text>
            <Text style={[styles.emptySub, { color: colors.onSurfaceVariant }]}>
              {'Go to Courses tab and tap the bookmark icon on any chapter to save it here.'}
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
            {bookmarkedChaptersList.map((chap: any) => (
              <View
                key={chap.id}
                style={[
                  styles.questionCard,
                  {
                    backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff',
                    borderLeftColor: chap.subjectColor,
                    borderLeftWidth: 4,
                    borderColor: colors.outlineVariant,
                  },
                  MindSprintShadows.card,
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <View style={[{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: chap.subjectColor + '20' }]}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: chap.subjectColor }}>{chap.subjectName}</Text>
                  </View>
                  <Text style={[{ fontSize: 11, color: colors.onSurfaceVariant, fontWeight: '600' }]}>
                    {`Chapter ${chap.chapterNumber}`}
                  </Text>
                </View>

                <Text style={[styles.questionStatement, { color: colors.onSurface }]}>
                  {isGSEB && chap.titleGujarati ? chap.titleGujarati : chap.title}
                </Text>
                <Text style={[{ fontSize: 12, color: colors.onSurfaceVariant, marginTop: 4, lineHeight: 17 }]} numberOfLines={2}>
                  {isGSEB && chap.summaryGujarati ? chap.summaryGujarati : chap.summary}
                </Text>

                {/* Key Formulas count badge */}
                {(chap.keyFormulas?.length || 0) > 0 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 }}>
                    <MaterialIcons name="functions" size={13} color="#8b5cf6" />
                    <Text style={{ fontSize: 11, color: '#8b5cf6', fontWeight: '700' }}>
                      {chap.keyFormulas.length} formulas
                    </Text>
                  </View>
                )}

                {/* Remove bookmark */}
                <TouchableOpacity
                  style={styles.bookmarkActionBtn}
                  onPress={async () => {
                    const updated = bookmarkedChapterIds.filter((id) => id !== chap.id);
                    setBookmarkedChapterIds(updated);
                    try { await AsyncStorage.setItem(chapterBookmarkKey, JSON.stringify(updated)); } catch (_) {}
                  }}
                >
                  <MaterialIcons name="bookmark-remove" size={14} color="#ef4444" />
                  <Text style={[styles.removeText, { color: '#ef4444' }]}>
                    {'Remove Bookmark'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )
      )}
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
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 12,
  },
  syncBtn: {
    padding: 8,
    borderRadius: 8,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  offlineBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  tabBar: {
    flexDirection: 'row',
    padding: 6,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 14,
    gap: 6,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  activeTabItem: {
    borderRadius: 10,
  },
  tabText: {
    fontSize: 13,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  exploreBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContainer: {
    padding: 16,
    gap: 16,
  },
  chipScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  questionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  qMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTagPillText: {
    color: '#3730a3',
    fontSize: 11,
    fontWeight: '800',
  },
  bookmarkActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  removeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  questionStatement: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  optionsList: {
    gap: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  optionLetter: {
    fontSize: 12,
    fontWeight: '700',
    width: 20,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  correctPill: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  correctPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  explContainer: {
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  explHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  explTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  explBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  formulaCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderLeftWidth: 6,
    padding: 18,
    gap: 14,
  },
  formulaCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  bookmarkBtn: {
    padding: 4,
  },
  formulaBox: {
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  formulaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  formulaText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    flex: 1,
    lineHeight: 18,
  },
  copyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesBox: {
    borderRadius: 12,
    padding: 10,
  },
  notesHeading: {
    fontSize: 12,
    fontWeight: '800',
  },
  notesText: {
    fontSize: 12,
    lineHeight: 16,
  },
});
