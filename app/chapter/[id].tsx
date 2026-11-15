import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { subjectTone } from '@/constants/subjectTones';
import { SubjectChapter } from '@/constants/academicData';
import { ScreenHeader, HeaderIconButton } from '@/components/mindsprint/ScreenHeader';
import { saveLastChapter, LastChapter } from '@/services/learningProgress';
import { offlineSupported, openSavedChapter, saveChapterOffline } from '@/services/offlineChapters';
import { useCourseProgress } from '@/components/courses/useCourseProgress';
import { VideoPlayerModal } from '@/components/courses/VideoPlayerModal';
import { NotesModal } from '@/components/courses/NotesModal';
import { QuizConfigModal } from '@/components/courses/QuizConfigModal';
import { chapterSearchQuery, findChapter, openPdfUrl, openYouTube, subjectLabel, toAbsoluteUrl } from '@/components/courses/chapterLinks';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

/**
 * One chapter, everything in one place: watch, read the PDF, notes, quiz,
 * keep offline, formulas and "mark as done". Opened from Courses, search,
 * Home's Resume button and Lectures.
 * Params: id (chapter id), grade (optional, defaults to the student's), action (video|pdf|notes, optional).
 */
export default function ChapterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { tr, isGujarati } = useLanguage();
  const params = useLocalSearchParams<{ id: string; grade?: string; action?: string }>();
  const grade = params.grade || user?.grade || '7';
  const found = params.id ? findChapter(grade, params.id) : null;
  const subject = found?.subject;
  const chapter = found?.chapter;

  const progress = useCourseProgress(grade, user?.email);
  // A deep link (?action=video|notes from Home's Resume button) opens the right sheet straight away.
  const [videoChapter, setVideoChapter] = useState<SubjectChapter | null>(() =>
    params.action === 'video' && chapter?.videos?.length ? chapter : null
  );
  const [notesChapter, setNotesChapter] = useState<SubjectChapter | null>(() =>
    params.action === 'notes' && chapter ? chapter : null
  );
  const [quizChapter, setQuizChapter] = useState<SubjectChapter | null>(null);
  const [saving, setSaving] = useState(false);

  const remember = (action: LastChapter['action']) => {
    if (!subject || !chapter) return;
    // Persist only: this page doesn't show the "continue" card, other screens reload it on focus.
    saveLastChapter(user?.email, {
        grade,
        subjectId: subject.id,
        chapterId: chapter.id,
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        titleGujarati: chapter.titleGujarati,
        subjectName: subjectLabel(subject, isGujarati),
        action,
      });
  };

  const watch = () => {
    if (!chapter) return;
    if (!chapter.videos?.length) {
      Alert.alert(
        tr('No video for this chapter yet', 'આ પ્રકરણનો વિડિયો હજુ નથી'),
        tr('You can search YouTube for a lesson on this chapter.', 'તમે આ પ્રકરણનો પાઠ YouTube પર શોધી શકો છો.'),
        [
          { text: tr('Search YouTube', 'YouTube પર શોધો'), onPress: () => openYouTube('', chapterSearchQuery(grade, subject, chapter), tr) },
          { text: tr('Close', 'બંધ કરો'), style: 'cancel' },
        ]
      );
      return;
    }
    remember('video');
    setVideoChapter(chapter);
  };

  const openPdf = () => {
    if (!chapter) return;
    remember('pdf');
    openPdfUrl(chapter.textbookPdfUrl || subject?.officialTextbookPdf, colors.primary, tr);
  };

  const openNotes = () => {
    if (!chapter) return;
    remember('notes');
    setNotesChapter(chapter);
  };

  const savedOffline = !!chapter && progress.savedChapterIds.includes(chapter.id);
  const pdfSource = chapter?.chapterPdfUrl || chapter?.textbookPdfUrl;

  const saveOffline = async () => {
    if (!chapter || !pdfSource) return;
    setSaving(true);
    try {
      await saveChapterOffline(chapter.id, toAbsoluteUrl(pdfSource));
      progress.setSavedChapterIds((prev) => (prev.includes(chapter.id) ? prev : [...prev, chapter.id]));
      Alert.alert(tr('Saved for offline use', 'ઑફલાઇન માટે સાચવ્યું'), tr('You can open this chapter without internet.', 'હવે આ પ્રકરણ ઇન્ટરનેટ વગર ખોલી શકશો.'));
    } catch (e: any) {
      Alert.alert(tr('Could not save the chapter', 'પ્રકરણ સાચવી શકાયું નહીં'), e?.message, [
        { text: tr('Try again', 'ફરી પ્રયત્ન કરો'), onPress: saveOffline },
        { text: tr('Close', 'બંધ કરો'), style: 'cancel' },
      ]);
    } finally {
      setSaving(false);
    }
  };

  const openOffline = async () => {
    if (!chapter) return;
    try {
      const opened = await openSavedChapter(chapter.id, chapter.title);
      if (opened) remember('pdf');
      else {
        progress.setSavedChapterIds((prev) => prev.filter((x) => x !== chapter.id));
        Alert.alert(tr('Saved copy not found', 'સાચવેલી નકલ મળી નહીં'), tr('Save the chapter again while you are online.', 'ઓનલાઇન હોવ ત્યારે ફરી સાચવો.'));
      }
    } catch (e: any) {
      Alert.alert(tr('Could not open the saved chapter', 'સાચવેલું પ્રકરણ ખુલી શક્યું નહીં'), e?.message);
    }
  };

  // Deep link from Home's Resume button: run the remembered action once.
  const handledAction = useRef(false);
  useEffect(() => {
    if (handledAction.current || !chapter || !params.action) return;
    handledAction.current = true;
    if (params.action === 'pdf') openPdf();
    else if (params.action === 'video' || params.action === 'notes') remember(params.action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter?.id, params.action]);

  if (!subject || !chapter) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <ScreenHeader title={tr('Chapter', 'પ્રકરણ')} />
        <View style={styles.missing}>
          <MaterialIcons name="search-off" size={40} color={colors.onSurfaceVariant} />
          <Text style={[styles.missingText, { color: colors.onSurface }]}>
            {tr('This chapter could not be found.', 'આ પ્રકરણ મળ્યું નહીં.')}
          </Text>
          <TouchableOpacity style={[styles.secondaryBtn, { borderColor: colors.outlineVariant }]} onPress={() => router.replace('/(tabs)/courses')}>
            <Text style={[styles.secondaryText, { color: colors.primary }]}>{tr('Open Courses', 'અભ્યાસ ખોલો')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const tone = subjectTone(subject.id);
  const done = progress.completedIds.includes(chapter.id);
  const bookmarked = progress.bookmarkedIds.includes(chapter.id);
  const title = isGujarati && chapter.titleGujarati ? chapter.titleGujarati : chapter.title;
  const summary = (isGujarati && chapter.summaryGujarati) || chapter.summary;
  const formulas = (isGujarati ? chapter.keyFormulasGujarati : chapter.keyFormulas) || chapter.keyFormulas || [];
  const video = chapter.videos?.[0];
  const index = subject.chapters.findIndex((c) => c.id === chapter.id);
  const next = index >= 0 ? subject.chapters[index + 1] : undefined;

  const actions: { key: string; icon: IconName; label: string; onPress: () => void; disabled?: boolean; tint?: string }[] = [
    { key: 'pdf', icon: 'picture-as-pdf', label: tr('Open PDF', 'PDF ખોલો'), onPress: openPdf },
    { key: 'notes', icon: 'auto-stories', label: tr('Read notes', 'નોંધ વાંચો'), onPress: openNotes },
    { key: 'quiz', icon: 'quiz', label: tr('Take quiz', 'ક્વિઝ આપો'), onPress: () => setQuizChapter(chapter) },
  ];
  if (offlineSupported && pdfSource) {
    actions.push({
      key: 'offline',
      icon: savedOffline ? 'offline-pin' : 'download-for-offline',
      label: saving ? tr('Saving…', 'સાચવી રહ્યા છીએ…') : savedOffline ? tr('Open offline copy', 'ઑફલાઇન નકલ ખોલો') : tr('Save for offline', 'ઑફલાઇન સાચવો'),
      onPress: savedOffline ? openOffline : saveOffline,
      disabled: saving,
      tint: savedOffline ? colors.tertiary : undefined,
    });
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader
        title={subjectLabel(subject, isGujarati)}
        subtitle={tr(`Chapter ${chapter.chapterNumber} of ${subject.chapters.length}`, `પ્રકરણ ${chapter.chapterNumber} / ${subject.chapters.length}`)}
        right={
          <HeaderIconButton
            icon={bookmarked ? 'bookmark' : 'bookmark-border'}
            color={bookmarked ? colors.primary : undefined}
            label={bookmarked ? tr('Remove bookmark', 'બુકમાર્ક દૂર કરો') : tr('Bookmark chapter', 'પ્રકરણ બુકમાર્ક કરો')}
            onPress={() => progress.toggleBookmark(chapter.id)}
          />
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.titleBlock}>
          <View style={[styles.subjectDot, { backgroundColor: tone.cover }]} />
          <Text style={[styles.title, { color: colors.onSurface }]}>{title}</Text>
          {summary ? <Text style={[styles.summary, { color: colors.onSurfaceVariant }]}>{summary}</Text> : null}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={watch}
          accessibilityRole="button"
          style={[styles.watchBtn, { backgroundColor: colors.primary }]}
        >
          <MaterialIcons name="play-arrow" size={24} color={colors.onPrimary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.watchText, { color: colors.onPrimary }]}>
              {video ? tr(`Watch video · ${video.duration}`, `વિડિયો જુઓ · ${video.duration}`) : tr('Find a video', 'વિડિયો શોધો')}
            </Text>
            {video?.teacher ? (
              <Text style={[styles.watchSub, { color: colors.onPrimary }]} numberOfLines={1}>
                {video.teacher}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>

        <View style={styles.grid}>
          {actions.map((a) => (
            <TouchableOpacity
              key={a.key}
              activeOpacity={0.8}
              disabled={a.disabled}
              onPress={a.onPress}
              accessibilityRole="button"
              style={[styles.gridBtn, { backgroundColor: colors.surface, borderColor: a.tint || colors.outlineVariant, opacity: a.disabled ? 0.6 : 1 }]}
            >
              <MaterialIcons name={a.icon} size={22} color={a.tint || colors.primary} />
              <Text style={[styles.gridText, { color: a.tint || colors.onSurface }]} numberOfLines={2}>
                {a.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => progress.toggleComplete(chapter.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          style={[styles.doneBtn, { backgroundColor: done ? colors.tertiaryContainer : colors.surface, borderColor: done ? colors.tertiary : colors.outlineVariant }]}
        >
          <MaterialIcons name={done ? 'check-circle' : 'radio-button-unchecked'} size={22} color={done ? colors.tertiary : colors.onSurfaceVariant} />
          <Text style={[styles.doneText, { color: done ? colors.onTertiaryContainer : colors.onSurface }]}>
            {done ? tr('Chapter done · tap to undo', 'પ્રકરણ પૂર્ણ · પાછું લેવા ટૅપ કરો') : tr('Mark chapter as done', 'પ્રકરણ પૂર્ણ તરીકે ચિહ્નિત કરો')}
          </Text>
        </TouchableOpacity>

        {formulas.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>{tr('Key formulas', 'મુખ્ય સૂત્રો')}</Text>
            {formulas.map((f, i) => (
              <View key={i} style={styles.formulaRow}>
                <MaterialIcons name="functions" size={16} color={colors.primary} />
                <Text style={[styles.formulaText, { color: colors.onSurface }]}>{f}</Text>
              </View>
            ))}
          </View>
        )}

        {video && (
          <TouchableOpacity
            onPress={() => setVideoChapter(chapter)}
            style={styles.reportLink}
            accessibilityRole="button"
          >
            <MaterialIcons name="flag" size={16} color={colors.onSurfaceVariant} />
            <Text style={[styles.reportText, { color: colors.onSurfaceVariant }]}>
              {tr('Video wrong or not playing? Open it and tap “Report”.', 'વિડિયો ખોટો કે ચાલતો નથી? તેને ખોલીને “જાણ કરો” દબાવો.')}
            </Text>
          </TouchableOpacity>
        )}

        {next && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.replace({ pathname: '/chapter/[id]' as any, params: { id: next.id, grade } })}
            style={[styles.nextBtn, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}
            accessibilityRole="button"
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.nextKicker, { color: colors.onSurfaceVariant }]}>{tr('Next chapter', 'આગળનું પ્રકરણ')}</Text>
              <Text style={[styles.nextTitle, { color: colors.onSurface }]} numberOfLines={2}>
                {next.chapterNumber}. {isGujarati && next.titleGujarati ? next.titleGujarati : next.title}
              </Text>
            </View>
            <MaterialIcons name="arrow-forward" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
      </ScrollView>

      <VideoPlayerModal chapter={videoChapter} subject={subject} grade={grade} email={user?.email} onClose={() => setVideoChapter(null)} />
      <NotesModal
        chapter={notesChapter}
        onClose={() => setNotesChapter(null)}
        onQuiz={(c) => {
          setNotesChapter(null);
          setQuizChapter(c);
        }}
      />
      <QuizConfigModal chapter={quizChapter} onClose={() => setQuizChapter(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, gap: 14, paddingBottom: 40 },
  titleBlock: { gap: 6, paddingTop: 4 },
  subjectDot: { width: 28, height: 5, borderRadius: 3 },
  title: { fontFamily: MindSprintFonts.display, fontSize: 26, lineHeight: 34 },
  summary: { fontSize: 14.5, lineHeight: 21 },
  watchBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 60, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16 },
  watchText: { fontFamily: MindSprintFonts.label, fontSize: 17 },
  watchSub: { fontSize: 12.5, marginTop: 1, opacity: 0.8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridBtn: { flexGrow: 1, flexBasis: '45%', minHeight: 76, borderRadius: 16, borderWidth: 1, padding: 12, gap: 6, justifyContent: 'center' },
  gridText: { fontFamily: MindSprintFonts.label, fontSize: 14.5, lineHeight: 19 },
  doneBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1 },
  doneText: { flex: 1, fontFamily: MindSprintFonts.label, fontSize: 15 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 8 },
  cardTitle: { fontFamily: MindSprintFonts.heading, fontSize: 18, lineHeight: 24 },
  formulaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  formulaText: { flex: 1, fontSize: 14.5, lineHeight: 21 },
  reportLink: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 40 },
  reportText: { flex: 1, fontSize: 13 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1 },
  nextKicker: { fontSize: 12.5, fontWeight: '600' },
  nextTitle: { fontFamily: MindSprintFonts.title, fontSize: 16, lineHeight: 21, marginTop: 1 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  missingText: { fontFamily: MindSprintFonts.title, fontSize: 16, textAlign: 'center' },
  secondaryBtn: { minHeight: 44, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1, justifyContent: 'center' },
  secondaryText: { fontFamily: MindSprintFonts.label, fontSize: 15 },
});
