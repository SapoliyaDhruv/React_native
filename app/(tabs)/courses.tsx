import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { subjectTone } from '@/constants/subjectTones';
import { ACADEMIC_CURRICULUM, AcademicGrade, GradeCurriculum, SubjectChapter, effectiveStream, streamLabel, subjectsForStream } from '@/constants/academicData';
import { ApiService } from '@/services/api';
import { ServerStatusBanner } from '@/components/mindsprint/ServerStatusBanner';
import { ContinueLearningCard } from '@/components/mindsprint/ContinueLearningCard';
import { ChapterSearchResults, searchChapters } from '@/components/mindsprint/ChapterSearchResults';
import { useCourseProgress } from '@/components/courses/useCourseProgress';
import { ChapterRow } from '@/components/courses/ChapterRow';
import { SubjectHeader } from '@/components/courses/SubjectHeader';
import { FormulasView } from '@/components/courses/FormulasView';
import { ImportantQuestionsView } from '@/components/courses/ImportantQuestionsView';
import { BoardPapersView } from '@/components/courses/BoardPapersView';

type View_ = 'chapters' | 'formulas' | 'imp' | 'papers';

/**
 * Courses: pick a subject, scan its chapters, tap one to open the chapter page.
 * Formulas, important questions and board papers are one tap away in the chips.
 */
export default function CoursesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { tr, isGujarati, toggleLang } = useLanguage();

  const userGrade = (user?.grade || '7') as AcademicGrade;
  const isSchoolMode = userGrade !== 'college';
  const localCurriculum = ACADEMIC_CURRICULUM[userGrade] || ACADEMIC_CURRICULUM['7'];
  const stream = effectiveStream(userGrade, user?.stream);

  const [curriculum, setCurriculum] = useState<GradeCurriculum>(localCurriculum);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(localCurriculum.subjects[0]?.id || '');
  const [view, setView] = useState<View_>('chapters');
  const [searchQuery, setSearchQuery] = useState('');
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [checkingServer, setCheckingServer] = useState(false);

  const progress = useCourseProgress(userGrade, user?.email);

  const checkServer = async () => {
    setCheckingServer(true);
    setServerOnline(await ApiService.checkServer());
    setCheckingServer(false);
  };

  useEffect(() => {
    let active = true;
    ApiService.checkServer().then((ok) => { if (active) setServerOnline(ok); });
    return () => { active = false; };
  }, []);

  // Grade changed: show the bundled curriculum immediately, then sync from the server.
  const [loadedGrade, setLoadedGrade] = useState(userGrade);
  if (loadedGrade !== userGrade) {
    setLoadedGrade(userGrade);
    setCurriculum(localCurriculum);
    setSelectedSubjectId(localCurriculum.subjects[0]?.id || '');
  }
  useEffect(() => {
    let active = true;
    ApiService.getCurriculum(userGrade)
      .then((data) => {
        if (active && data?.subjects?.length) setCurriculum(data);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [userGrade]);

  // Class 11/12: only the student's stream (Science / Commerce / Arts) plus shared language subjects.
  const subjects = subjectsForStream(curriculum.subjects, userGrade, stream);
  const subject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const chapters = subject?.chapters || [];
  const doneInSubject = chapters.filter((c) => progress.completedIds.includes(c.id)).length;
  const gradeDone = subjects.reduce((n, s) => n + s.chapters.filter((c) => progress.completedIds.includes(c.id)).length, 0);
  const gradeTotal = subjects.reduce((n, s) => n + s.chapters.length, 0);
  const gradePct = gradeTotal ? Math.round((gradeDone / gradeTotal) * 100) : 0;

  const isSearching = searchQuery.trim().length > 0;
  const hits = isSearching ? searchChapters(subjects, searchQuery) : [];

  const openChapter = (chap: SubjectChapter, action?: 'video' | 'pdf' | 'notes') =>
    router.push({ pathname: '/chapter/[id]' as any, params: { id: chap.id, grade: userGrade, ...(action ? { action } : {}) } });

  // Home links here with ?subject=<id> (textbook shelf) and &resume=<ts> (Resume button).
  const params = useLocalSearchParams<{ subject?: string; resume?: string }>();
  const [appliedSubject, setAppliedSubject] = useState<string | undefined>(undefined);
  if (params.subject !== appliedSubject) {
    setAppliedSubject(params.subject);
    if (params.subject && subjects.some((s) => s.id === params.subject)) {
      setSelectedSubjectId(params.subject);
      setSearchQuery('');
      setView('chapters');
    }
  }
  const handledResume = useRef<string | undefined>(undefined);
  const last = progress.lastChapter;
  useEffect(() => {
    if (!params.resume || handledResume.current === params.resume || !last) return;
    handledResume.current = params.resume;
    router.push({ pathname: '/chapter/[id]' as any, params: { id: last.chapterId, grade: userGrade, action: last.action } });
  }, [params.resume, last, router, userGrade]);

  const chips: { key: View_; label: string }[] = [
    { key: 'chapters', label: tr('Chapters', 'પ્રકરણ') },
    { key: 'formulas', label: tr('Formulas', 'સૂત્રો') },
    { key: 'imp', label: tr('Important questions', 'મહત્વના પ્રશ્નો') },
    { key: 'papers', label: tr('Board papers', 'બોર્ડ પેપર') },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={[styles.headerTitle, { color: colors.onSurface }]}>
            {isSchoolMode ? tr(`Class ${userGrade} courses`, `ધોરણ ${userGrade} અભ્યાસ`) : tr('Placement courses', 'પ્લેસમેન્ટ અભ્યાસ')}
          </Text>
          <Text numberOfLines={1} style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
            {isSchoolMode
              ? `${user?.board || 'GSEB'}${stream ? ` · ${streamLabel(stream, isGujarati)}` : ''} · ${user?.medium === 'English' ? tr('English medium', 'અંગ્રેજી માધ્યમ') : tr('Gujarati medium', 'ગુજરાતી માધ્યમ')}`
              : tr('Campus recruitment tracks', 'કેમ્પસ ભરતી')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleLang}
          accessibilityRole="button"
          accessibilityLabel={isGujarati ? 'Switch app to English' : 'એપ ગુજરાતીમાં બદલો'}
          style={[styles.pill, { borderColor: colors.outlineVariant, backgroundColor: colors.surface }]}
        >
          <MaterialIcons name="translate" size={16} color={colors.primary} />
          <Text style={[styles.pillText, { color: colors.primary }]}>{isGujarati ? 'ગુજ' : 'EN'}</Text>
        </TouchableOpacity>
        <View style={[styles.pill, { backgroundColor: colors.tertiaryContainer, borderColor: colors.tertiaryContainer }]} accessibilityLabel={tr(`${gradePct}% of chapters done`, `${gradePct}% પ્રકરણ પૂર્ણ`)}>
          <MaterialIcons name="check-circle" size={15} color={colors.tertiary} />
          <Text style={[styles.pillText, { color: colors.onTertiaryContainer }]}>{gradePct}%</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {serverOnline === false && <ServerStatusBanner checking={checkingServer} onRetry={checkServer} />}

        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
          <MaterialIcons name="search" size={20} color={colors.onSurfaceVariant} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={tr('Search any chapter or subject', 'કોઈપણ પ્રકરણ કે વિષય શોધો')}
            placeholderTextColor={colors.onSurfaceVariant}
            accessibilityLabel={tr('Search chapters', 'પ્રકરણ શોધો')}
            returnKeyType="search"
            autoCorrect={false}
            style={[styles.searchInput, { color: colors.onSurface }]}
          />
          {isSearching && (
            <TouchableOpacity onPress={() => setSearchQuery('')} accessibilityRole="button" accessibilityLabel={tr('Clear search', 'શોધ સાફ કરો')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="close" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
        </View>

        {isSearching ? (
          <ChapterSearchResults
            query={searchQuery}
            hits={hits}
            onClear={() => setSearchQuery('')}
            onOpenChapter={(hit) => openChapter(hit.chapter)}
            onWatch={(hit) => openChapter(hit.chapter, 'video')}
          />
        ) : (
          <>
            {last && (
              <ContinueLearningCard
                last={last}
                onPress={() => router.push({ pathname: '/chapter/[id]' as any, params: { id: last.chapterId, grade: userGrade, action: last.action } })}
              />
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {subjects.map((sub) => {
                const selected = sub.id === subject?.id;
                const tone = subjectTone(sub.id);
                return (
                  <TouchableOpacity
                    key={sub.id}
                    activeOpacity={0.75}
                    onPress={() => setSelectedSubjectId(sub.id)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected }}
                    style={[styles.subjectChip, { backgroundColor: selected ? tone.cover : colors.surface, borderColor: selected ? tone.cover : colors.outlineVariant }]}
                  >
                    <MaterialIcons name={tone.icon as any} size={16} color={selected ? '#ffffff' : tone.cover} />
                    <Text style={[styles.subjectChipText, { color: selected ? '#ffffff' : colors.onSurface }]}>
                      {isGujarati && sub.nameGujarati ? sub.nameGujarati : sub.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {subject && (
              <SubjectHeader
                subject={subject}
                doneCount={doneInSubject}
                textbookSaved={progress.savedTextbookIds.includes(subject.id)}
                onTextbookSaved={(id) => progress.setSavedTextbookIds((p) => (p.includes(id) ? p : [...p, id]))}
                onTextbookMissing={(id) => progress.setSavedTextbookIds((p) => p.filter((x) => x !== id))}
              />
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {chips.map((c) => {
                const selected = view === c.key;
                return (
                  <TouchableOpacity
                    key={c.key}
                    onPress={() => setView(c.key)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected }}
                    style={[styles.viewChip, { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.outlineVariant }]}
                  >
                    <Text style={[styles.viewChipText, { color: selected ? colors.onPrimary : colors.onSurface }]}>{c.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {view === 'chapters' && (
              <View style={[styles.list, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
                {chapters.map((chap, i) => (
                  <ChapterRow
                    key={chap.id}
                    chapter={chap}
                    isFirst={i === 0}
                    done={progress.completedIds.includes(chap.id)}
                    bookmarked={progress.bookmarkedIds.includes(chap.id)}
                    savedOffline={progress.savedChapterIds.includes(chap.id)}
                    onOpen={() => openChapter(chap)}
                    onToggleBookmark={() => progress.toggleBookmark(chap.id)}
                  />
                ))}
              </View>
            )}
            {view === 'formulas' && <FormulasView chapters={chapters} onOpenChapter={(c) => openChapter(c)} />}
            {view === 'imp' && <ImportantQuestionsView grade={userGrade} subjectName={subject?.name} />}
            {view === 'papers' && <BoardPapersView grade={userGrade} board={isSchoolMode ? 'GSEB' : user?.board || 'CBSE'} subjectNames={stream ? subjects.map((s) => s.name) : undefined} />}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontFamily: MindSprintFonts.heading, fontSize: 22, lineHeight: 28 },
  headerSub: { fontSize: 13, fontWeight: '500' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 36, paddingHorizontal: 11, borderRadius: 18, borderWidth: 1 },
  pillText: { fontFamily: MindSprintFonts.label, fontSize: 14 },
  scroll: { padding: 16, gap: 14, paddingBottom: 40 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, minHeight: 48 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 8 },
  chipRow: { gap: 8, paddingVertical: 2 },
  subjectChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, minHeight: 40, borderRadius: 20, borderWidth: 1 },
  subjectChipText: { fontFamily: MindSprintFonts.label, fontSize: 14.5 },
  viewChip: { paddingHorizontal: 14, minHeight: 36, justifyContent: 'center', borderRadius: 18, borderWidth: 1 },
  viewChipText: { fontFamily: MindSprintFonts.label, fontSize: 14 },
  list: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
});
