import React, { useState } from 'react';
import { Alert, Dimensions, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { AcademicSubject, ChapterVideo, SubjectChapter } from '@/constants/academicData';
import { ApiService } from '@/services/api';
import { chapterSearchQuery, openYouTube } from './chapterLinks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = Math.round((Math.min(SCREEN_WIDTH, 720) - 40) * 9 / 16);

type ReportReason = 'wrong-topic' | 'wrong-chapter' | 'not-playing' | 'other';

interface Props {
  chapter: SubjectChapter | null;
  subject?: AcademicSubject;
  grade: string;
  email?: string;
  onClose: () => void;
}

/** Bottom sheet with the chapter's video, a YouTube link, a search link and the report button. */
export const VideoPlayerModal: React.FC<Props> = ({ chapter, subject, grade, email, onClose }) => {
  const { colors } = useTheme();
  const { tr, isGujarati } = useLanguage();
  // Which video of the chapter is playing; reset when another chapter opens.
  const [selection, setSelection] = useState<{ chapterId?: string; videoId?: string }>({});
  const videos = chapter?.videos || [];
  const active: ChapterVideo | undefined =
    (selection.chapterId === chapter?.id && videos.find((v) => v.id === selection.videoId)) || videos[0];

  const submitReport = async (reason: ReportReason) => {
    if (!active || !chapter) return;
    const ok = await ApiService.reportVideo({
      youtubeVideoId: active.youtubeVideoId,
      grade,
      subjectId: subject?.id,
      chapterNumber: chapter.chapterNumber,
      reason,
      email,
    });
    Alert.alert(
      ok ? tr('Thank you', 'આભાર') : tr('Could not send the report', 'રિપોર્ટ મોકલી શકાયો નહીં'),
      ok
        ? tr('We will check this video and fix it.', 'અમે આ વિડિયો તપાસીને સુધારીશું.')
        : tr('Check your internet connection and try again.', 'ઇન્ટરનેટ કનેક્શન તપાસો અને ફરી પ્રયત્ન કરો.')
    );
  };

  const reportVideo = () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(tr('Report this video as wrong or not working?', 'આ વિડિયો ખોટો કે ચાલતો નથી તેની જાણ કરવી છે?'))) {
        submitReport('other');
      }
      return;
    }
    Alert.alert(tr('What is wrong with this video?', 'આ વિડિયોમાં શું ખોટું છે?'), undefined, [
      { text: tr('Wrong topic', 'ખોટો વિષય'), onPress: () => submitReport('wrong-topic') },
      { text: tr('Wrong chapter', 'ખોટું પ્રકરણ'), onPress: () => submitReport('wrong-chapter') },
      { text: tr('Not playing', 'ચાલતો નથી'), onPress: () => submitReport('not-playing') },
      { text: tr('Cancel', 'રદ કરો'), style: 'cancel' },
    ]);
  };

  const title = chapter ? (isGujarati && chapter.titleGujarati ? chapter.titleGujarati : chapter.title) : '';

  return (
    <Modal visible={!!chapter} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={2}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel={tr('Close', 'બંધ કરો')}>
              <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {active && active.embeddable === false && (
            // The teacher has turned off playing inside other apps, so it opens in YouTube instead.
            <TouchableOpacity
              style={[styles.ytOnly, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}
              onPress={() => chapter && openYouTube(active.youtubeVideoId, chapterSearchQuery(grade, subject, chapter), tr)}
              accessibilityRole="button"
            >
              <MaterialIcons name="smart-display" size={40} color={colors.primary} />
              <Text style={[styles.ytOnlyTitle, { color: colors.onSurface }]}>{tr('Watch on YouTube', 'YouTube પર જુઓ')}</Text>
              <Text style={[styles.ytOnlySub, { color: colors.onSurfaceVariant }]}>
                {tr('This teacher allows the lesson to play only in the YouTube app.', 'આ શિક્ષક પાઠ ફક્ત YouTube એપમાં જોવા દે છે.')}
              </Text>
            </TouchableOpacity>
          )}

          {active && active.embeddable !== false && (
            <View style={styles.player}>
              {Platform.OS === 'web' ? (
                <iframe
                  key={active.youtubeVideoId}
                  src={`https://www.youtube-nocookie.com/embed/${active.youtubeVideoId}?rel=0&modestbranding=1&enablejsapi=1`}
                  width="100%"
                  height={VIDEO_HEIGHT}
                  style={{ border: 'none', borderRadius: 14 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <YoutubePlayer
                  key={active.youtubeVideoId}
                  height={VIDEO_HEIGHT}
                  play
                  videoId={active.youtubeVideoId}
                  initialPlayerParams={{ controls: true, modestbranding: true, rel: false }}
                />
              )}
            </View>
          )}

          {active && (
            <View style={styles.nowPlaying}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.nowTitle, { color: colors.onSurface }]} numberOfLines={1}>
                  {isGujarati && active.titleGujarati ? active.titleGujarati : active.title}
                </Text>
                <Text style={[styles.nowSub, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                  {[active.teacher, active.duration].filter(Boolean).join(' · ')}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.ytBtn, { borderColor: colors.outlineVariant }]}
                onPress={() => chapter && openYouTube(active.youtubeVideoId, chapterSearchQuery(grade, subject, chapter), tr)}
                accessibilityRole="button"
              >
                <MaterialIcons name="open-in-new" size={16} color={colors.primary} />
                <Text style={[styles.ytBtnText, { color: colors.primary }]}>YouTube</Text>
              </TouchableOpacity>
            </View>
          )}

          {videos.length > 1 && (
            <ScrollView style={{ maxHeight: 180 }} showsVerticalScrollIndicator={false}>
              {videos.map((vid) => {
                const selected = active?.id === vid.id;
                return (
                  <TouchableOpacity
                    key={vid.id}
                    onPress={() => setSelection({ chapterId: chapter?.id, videoId: vid.id })}
                    style={[styles.option, { borderColor: selected ? colors.primary : colors.outlineVariant, backgroundColor: selected ? colors.primaryFixed : colors.surface }]}
                  >
                    <MaterialIcons name={selected ? 'play-arrow' : 'video-library'} size={18} color={selected ? colors.primary : colors.onSurfaceVariant} />
                    <Text style={[styles.optionText, { color: colors.onSurface }]} numberOfLines={2}>
                      {vid.teacher} · {vid.duration}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <View style={styles.links}>
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => chapter && openYouTube('', chapterSearchQuery(grade, subject, chapter), tr)}
              accessibilityRole="button"
            >
              <MaterialIcons name="search" size={18} color={colors.primary} />
              <Text style={[styles.linkText, { color: colors.primary }]}>
                {tr('Find other videos for this chapter', 'આ પ્રકરણના બીજા વિડિયો શોધો')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkRow} onPress={reportVideo} accessibilityRole="button">
              <MaterialIcons name="flag" size={18} color={colors.onSurfaceVariant} />
              <Text style={[styles.linkText, { color: colors.onSurfaceVariant }]}>
                {tr('Wrong or not playing? Report this video', 'ખોટો કે ચાલતો નથી? આ વિડિયોની જાણ કરો')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, gap: 14, maxHeight: '92%' },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { flex: 1, fontFamily: MindSprintFonts.heading, fontSize: 19, lineHeight: 25 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  player: { width: '100%', backgroundColor: '#000000', borderRadius: 14, overflow: 'hidden' },
  ytOnly: { width: '100%', height: VIDEO_HEIGHT, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 24 },
  ytOnlyTitle: { fontFamily: MindSprintFonts.label, fontSize: 17 },
  ytOnlySub: { fontSize: 13.5, textAlign: 'center' },
  nowPlaying: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nowTitle: { fontFamily: MindSprintFonts.title, fontSize: 15, lineHeight: 20 },
  nowSub: { fontSize: 12.5, marginTop: 1 },
  ytBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 40, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  ytBtnText: { fontFamily: MindSprintFonts.label, fontSize: 14 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  optionText: { flex: 1, fontSize: 13.5 },
  links: { gap: 2 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  linkText: { flex: 1, fontFamily: MindSprintFonts.label, fontSize: 14 },
});
