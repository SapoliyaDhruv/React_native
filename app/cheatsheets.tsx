import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { CheatSheetItem, FormulaStorage } from '@/constants/cheatsheetsData';
import { AcademicGrade } from '@/constants/academicData';
import { ApiService } from '@/services/api';
import * as Clipboard from 'expo-clipboard';

const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'School Math':
      return { borderLeftColor: '#3b82f6', bg: '#dbeafe', text: '#1e40af' };
    case 'School Science':
    case 'Physics & Chemistry':
      return { borderLeftColor: '#10b981', bg: '#d1fae5', text: '#065f46' };
    case 'Quant Formulas':
      return { borderLeftColor: '#3b82f6', bg: '#dbeafe', text: '#1e40af' };
    case 'DSA Time Complexities':
      return { borderLeftColor: '#8b5cf6', bg: '#f3e8ff', text: '#6b21a8' };
    case 'React & JS':
      return { borderLeftColor: '#059669', bg: '#d1fae5', text: '#065f46' };
    default:
      return { borderLeftColor: '#f59e0b', bg: '#fef3c7', text: '#92400e' };
  }
};

export default function CheatSheetsScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade: AcademicGrade = user?.grade || 'college';
  const isSchoolMode = userGrade !== 'college';

  const [formulas, setFormulas] = useState<CheatSheetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [saved, fetched] = await Promise.all([
          FormulaStorage.getSavedIds(user?.email),
          ApiService.getFormulas(userGrade),
        ]);
        setSavedIds(saved);
        setFormulas(fetched);
      } catch (err) {
        console.warn('Error loading dynamic formulas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.email, userGrade]);

  const filteredItems = formulas.filter((item) => {
    let matchesFilter = true;
    if (selectedFilter === 'Saved') {
      matchesFilter = savedIds.includes(item.id);
    } else if (selectedFilter !== 'All') {
      matchesFilter = item.category === selectedFilter;
    }

    const titleText = isSchoolMode && user?.medium === 'Gujarati' && item.titleGujarati ? item.titleGujarati : item.title;

    const matchesSearch =
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.formulas.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleCopyFormula = async (title: string, formulaText: string) => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(formulaText);
      } else {
        await Clipboard.setStringAsync(formulaText);
      }
      Alert.alert('Formula Copied 📋', `"${formulaText}" copied to clipboard!`);
    } catch (e) {
      Alert.alert('Formula Copied 📋', `"${formulaText}" copied for quick revision!`);
    }
  };

  const toggleSave = async (item: CheatSheetItem) => {
    const res = await FormulaStorage.toggleSave(user?.email, item.id);
    setSavedIds(res.ids);
    Alert.alert(
      res.saved ? 'Bookmark Saved ⭐️' : 'Bookmark Removed',
      res.saved
        ? `"${item.title}" saved to your Bookmarks collection!`
        : `"${item.title}" removed from saved formulas.`
    );
  };

  const filterCategories = isSchoolMode
    ? ['All', `Saved (${savedIds.length})`, 'School Math', 'School Science', 'Physics & Chemistry']
    : ['All', `Saved (${savedIds.length})`, 'Quant Formulas', 'DSA Time Complexities', 'React & JS'];

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
            {isSchoolMode ? `Class ${userGrade} Formula Hub` : 'Formula & Revision Cheat Sheets'}
          </Text>
          <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
            {isSchoolMode
              ? `${user?.board || 'CBSE'} • ${user?.medium === 'Gujarati' ? 'ગુજરાતી માધ્યમ' : 'English Medium'}`
              : 'Quant Formulas, Complexities & Tech Notes'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: colors.outlineVariant,
            },
          ]}
        >
          <MaterialIcons name="search" size={20} color={colors.outline} />
          <TextInput
            style={[styles.searchInput, { color: colors.onSurface }]}
            placeholder="Search formulas (e.g. Area, Ohm, Speed, React)..."
            placeholderTextColor={colors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={18} color={colors.outline} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {filterCategories.map((cat) => {
            const filterKey = cat.startsWith('Saved') ? 'Saved' : cat;
            const isSelected = selectedFilter === filterKey;
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
                onPress={() => setSelectedFilter(filterKey)}
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

        {/* Loading Indicator */}
        {loading && (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <View style={[styles.emptyStateCard, { backgroundColor: colors.surfaceContainerLowest }]}>
            <MaterialIcons name="bookmark-border" size={40} color={colors.outline} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
              {selectedFilter === 'Saved' ? 'No Saved Formulas Yet' : 'No Formulas Found'}
            </Text>
            <Text style={[styles.emptySub, { color: colors.onSurfaceVariant }]}>
              {selectedFilter === 'Saved'
                ? 'Tap the bookmark icon on any formula card to save it.'
                : 'Try searching with different terms like Area, Equations, or Speed.'}
            </Text>
          </View>
        )}

        {/* Formula Cards List */}
        <View style={styles.cardsList}>
          {filteredItems.map((item) => {
            const isSaved = savedIds.includes(item.id);
            const catStyle = getCategoryStyle(item.category);
            const displayTitle = isSchoolMode && user?.medium === 'Gujarati' && item.titleGujarati ? `${item.titleGujarati} (${item.title})` : item.title;

            return (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surfaceContainerLowest,
                    borderColor: colors.outlineVariant,
                    borderLeftColor: catStyle.borderLeftColor,
                  },
                  MindSprintShadows.card,
                ]}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1, gap: 6 }}>
                    <View style={[styles.categoryTag, { backgroundColor: catStyle.bg }]}>
                      <Text style={[styles.categoryTagText, { color: catStyle.text }]}>
                        {item.category}
                      </Text>
                    </View>
                    <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
                      {displayTitle}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => toggleSave(item)} style={styles.bookmarkBtn}>
                    <MaterialIcons
                      name={isSaved ? 'bookmark' : 'bookmark-outline'}
                      size={24}
                      color={isSaved ? colors.primary : colors.outline}
                    />
                  </TouchableOpacity>
                </View>

                {/* Formulas List Box */}
                <View style={[styles.formulaBox, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc' }]}>
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

                {/* Key Takeaways */}
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
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 12,
  },
  scrollContainer: {
    padding: 16,
    gap: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
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
  cardsList: {
    gap: 16,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderLeftWidth: 6,
    padding: 18,
    gap: 14,
  },
  cardHeader: {
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
  emptyStateCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
});
