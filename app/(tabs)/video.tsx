import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { subjectTone } from '@/constants/subjectTones';
import { ACADEMIC_CURRICULUM, AcademicGrade, AcademicSubject, SubjectChapter } from '@/constants/academicData';
import { VIDEO_LECTURES_DATA, VideoLecture } from '@/constants/videoData';
import { VideoPlayerView } from '@/components/mindsprint/VideoPlayerView';
import { useCourseProgress } from '@/components/courses/useCourseProgress';
import { subjectLabel } from '@/components/courses/chapterLinks';
import { saveLastChapter } from '@/services/learningProgress';

type Item = { subject: AcademicSubject; chapter: SubjectChapter };

/** Player data for a chapter: reuse the lecture record (notes, comments) when one exists. */
function toLecture({ subject, chapter }: Item): VideoLecture {
  const video = chapter.videos![0];
  const match = VIDEO_LECTURES_DATA.find((l) => l.youtubeVideoId === video.youtubeVideoId);
  const base: VideoLecture = match ?? {
    id: `chapter-${chapter.id}`,
    category: subject.name,
    categoryGujarati: subject.nameGujarati,
    title: chapter.title,
    instructor: video.teacher,
    duration: video.duration,
    durationSeconds: 0,
    youtubeVideoId: video.youtubeVideoId,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.youtubeVideoId}/hqdefault.jpg`,
    playbackMode: 'embed',
    description: chapter.summary,
    timeStampedNotes: [],
    comments: [],
  };
  return {
    ...base,
    title: `${chapter.chapterNumber}. ${chapter.title}`,
    titleGujarati: chapter.titleGujarati ? `${chapter.chapterNumber}. ${chapter.titleGujarati}` : undefined,
    description: chapter.summary || base.description,
    descriptionGujarati: chapter.summaryGujarati || base.descriptionGujarati,
    instructor: video.teacher || base.instructor,
    duration: video.duration || base.duration,
  };
}

/**
 * Lectures = "Watching": the video you're on, then what to watch next.
 * Browsing every chapter lives in Courses; this tab is only the queue.
 */
export default function WatchingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { tr, isGujarati } = useLanguage();
  const grade = (user?.grade || '7') as AcademicGrade;
  const subjects = useMemo(() => (ACADEMIC_CURRICULUM[grade] || ACADEMIC_CURRICULUM['7']).subjects, [grade]);
  const progress = useCourseProgress(grade, user?.email);
  const done = progress.completedIds;

  const all: Item[] = useMemo(
    () => subjects.flatMap((s) => s.chapters.filter((c) => c.videos?.length).map((c) => ({ subject: s, chapter: c }))),
    [subjects]
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const last = progress.lastChapter;
  const current =
    all.find((x) => x.chapter.id === selectedId) ||
    all.find((x) => x.chapter.id === last?.chapterId) ||
    all.find((x) => !done.includes(x.chapter.id)) ||
    all[0];

  // Up next: the following unfinished chapters in this subject, then the next one in each other subject.
  const sameSubject = current
    ? current.subject.chapters
        .filter((c) => c.chapterNumber > current.chapter.chapterNumber && c.videos?.length && !done.includes(c.id))
        .slice(0, 3)
        .map((c) => ({ subject: current.subject, chapter: c }))
    : [];
  const otherSubjects = subjects
    .filter((s) => s.id !== current?.subject.id)
    .map((s) => {
      const c = s.chapters.find((ch) => ch.videos?.length && !done.includes(ch.id));
      return c ? { subject: s, chapter: c } : null;
    })
    .filter((x): x is Item => !!x);

  const select = (item: Item) => {
    setSelectedId(item.chapter.id);
    progress.setLastChapter(
      saveLastChapter(user?.email, {
        grade,
        subjectId: item.subject.id,
        chapterId: item.chapter.id,
        chapterNumber: item.chapter.chapterNumber,
        title: item.chapter.title,
        titleGujarati: item.chapter.titleGujarati,
        subjectName: subjectLabel(item.subject, isGujarati),
        action: 'video',
      })
    );
  };

  const videosLeft = all.filter((x) => !done.includes(x.chapter.id)).length;
  const lecture = current ? toLecture(current) : null;
  const currentDone = !!current && done.includes(current.chapter.id);

  const renderRow = (item: Item, i: number) => {
    const video = item.chapter.videos![0];
    return (
      <TouchableOpacity
        key={item.chapter.id}
        activeOpacity={0.75}
        onPress={() => select(item)}
        accessibilityRole="button"
        accessibilityLabel={`${subjectLabel(item.subject, isGujarati)}, ${tr('chapter', 'પ્રકરણ')} ${item.chapter.chapterNumber}`}
        style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.outlineVariant }]}
      >
        <View style={styles.thumbBox}>
          <Image source={{ uri: `https://i.ytimg.com/vi/${video.youtubeVideoId}/mqdefault.jpg` }} style={styles.thumb} />
          <View style={styles.durationTag}>
            <Text style={styles.durationText}>{video.duration}</Text>
          </View>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.rowSubject, { color: subjectTone(item.subject.id).cover }]} numberOfLines={1}>
            {subjectLabel(item.subject, isGujarati)} · {tr(`Ch ${item.chapter.chapterNumber}`, `પ્ર. ${item.chapter.chapterNumber}`)}
          </Text>
          <Text style={[styles.rowTitle, { color: colors.onSurface }]} numberOfLines={2}>
            {isGujarati && item.chapter.titleGujarati ? item.chapter.titleGujarati : item.chapter.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={[styles.headerTitle, { color: colors.onSurface }]}>{tr('Watching', 'વિડિયો')}</Text>
          <Text numberOfLines={1} style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
            {grade === 'college' ? tr('College', 'કૉલેજ') : tr(`Class ${grade}`, `ધોરણ ${grade}`)} · {tr(`${videosLeft} videos left`, `${videosLeft} વિડિયો બાકી`)}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {lecture && current ? (
          <>
            <VideoPlayerView
              key={current.chapter.id}
              lecture={lecture}
              isBookmarked={progress.bookmarkedIds.includes(current.chapter.id)}
              onToggleBookmark={() => progress.toggleBookmark(current.chapter.id)}
            />
            <View style={styles.actions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => progress.toggleComplete(current.chapter.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: currentDone }}
                style={[styles.actionBtn, { backgroundColor: currentDone ? colors.tertiaryContainer : colors.surface, borderColor: currentDone ? colors.tertiary : colors.outlineVariant }]}
              >
                <MaterialIcons name={currentDone ? 'check-circle' : 'radio-button-unchecked'} size={20} color={currentDone ? colors.tertiary : colors.primary} />
                <Text style={[styles.actionText, { color: currentDone ? colors.onTertiaryContainer : colors.onSurface }]}>
                  {currentDone ? tr('Done · undo', 'પૂર્ણ · પાછું લો') : tr('Mark as done', 'પૂર્ણ કરો')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: '/chapter/[id]', params: { id: current.chapter.id, grade } })}
                accessibilityRole="button"
                style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}
              >
                <MaterialIcons name="menu-book" size={20} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.onSurface }]}>{tr('Open chapter', 'પ્રકરણ ખોલો')}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.empty}>
            <MaterialIcons name="video-library" size={40} color={colors.onSurfaceVariant} />
            <Text style={[styles.emptyText, { color: colors.onSurface }]}>
              {tr('No videos for your class yet.', 'તમારા ધોરણ માટે હજુ વિડિયો નથી.')}
            </Text>
          </View>
        )}

        {sameSubject.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>{tr('Up next', 'આગળ જુઓ')}</Text>
            <View style={[styles.list, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
              {sameSubject.map(renderRow)}
            </View>
          </View>
        )}

        {otherSubjects.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>{tr('Next in other subjects', 'બીજા વિષયોમાં આગળ')}</Text>
            <View style={[styles.list, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
              {otherSubjects.map(renderRow)}
            </View>
          </View>
        )}

        <TouchableOpacity onPress={() => router.push('/(tabs)/courses')} style={styles.allLink} accessibilityRole="button">
          <Text style={[styles.allLinkText, { color: colors.primary }]}>{tr('Browse all chapters in Courses', 'બધાં પ્રકરણ અભ્યાસમાં જુઓ')}</Text>
          <MaterialIcons name="arrow-forward" size={18} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  headerTitle: { fontFamily: MindSprintFonts.heading, fontSize: 22, lineHeight: 28 },
  headerSub: { fontSize: 13, fontWeight: '500' },
  scroll: { paddingBottom: 40, gap: 16 },
  actions: { flexDirection: 'row', gap: 10, paddingHorizontal: 16 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 48, borderRadius: 14, borderWidth: 1, paddingHorizontal: 8 },
  actionText: { fontFamily: MindSprintFonts.label, fontSize: 14.5, flexShrink: 1 },
  section: { gap: 10, paddingHorizontal: 16 },
  sectionTitle: { fontFamily: MindSprintFonts.heading, fontSize: 19, lineHeight: 25 },
  list: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10 },
  thumbBox: { width: 112, height: 63, borderRadius: 10, overflow: 'hidden', backgroundColor: '#000' },
  thumb: { width: '100%', height: '100%' },
  durationTag: { position: 'absolute', right: 4, bottom: 4, backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 },
  durationText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  rowSubject: { fontFamily: MindSprintFonts.label, fontSize: 12.5 },
  rowTitle: { fontFamily: MindSprintFonts.title, fontSize: 15, lineHeight: 20 },
  empty: { alignItems: 'center', gap: 10, padding: 32 },
  emptyText: { fontFamily: MindSprintFonts.title, fontSize: 16, textAlign: 'center' },
  allLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 48 },
  allLinkText: { fontFamily: MindSprintFonts.label, fontSize: 15 },
});
