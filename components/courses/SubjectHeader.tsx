import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { subjectTone } from '@/constants/subjectTones';
import { AcademicSubject } from '@/constants/academicData';
import { offlineSupported, openSavedTextbook, saveTextbookOffline } from '@/services/offlineChapters';
import { openPdfUrl, toAbsoluteUrl } from './chapterLinks';

interface Props {
  subject: AcademicSubject;
  doneCount: number;
  textbookSaved: boolean;
  onTextbookSaved: (subjectId: string) => void;
  onTextbookMissing: (subjectId: string) => void;
}

/** Subject card: name, progress, and the full official textbook (open online or keep on the phone). */
export const SubjectHeader: React.FC<Props> = ({ subject, doneCount, textbookSaved, onTextbookSaved, onTextbookMissing }) => {
  const { colors } = useTheme();
  const { tr, isGujarati } = useLanguage();
  const [progress, setProgress] = useState<number | null>(null);
  const tone = subjectTone(subject.id);
  const total = subject.chapters.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const bookTitle = isGujarati
    ? subject.textbookTitleGujarati || subject.nameGujarati || subject.name
    : subject.textbookTitle || subject.name;

  const download = async () => {
    if (!subject.officialTextbookPdf) return;
    setProgress(0);
    try {
      await saveTextbookOffline(subject.id, toAbsoluteUrl(subject.officialTextbookPdf), setProgress);
      onTextbookSaved(subject.id);
      Alert.alert(
        tr('Textbook downloaded', 'પાઠ્યપુસ્તક ડાઉનલોડ થયું'),
        tr('You can now open it without internet.', 'હવે તમે તેને ઇન્ટરનેટ વગર ખોલી શકો છો.')
      );
    } catch (e: any) {
      Alert.alert(tr('Download failed', 'ડાઉનલોડ નિષ્ફળ'), e?.message, [
        { text: tr('Try again', 'ફરી પ્રયત્ન કરો'), onPress: download },
        { text: tr('Close', 'બંધ કરો'), style: 'cancel' },
      ]);
    } finally {
      setProgress(null);
    }
  };

  const openSaved = async () => {
    try {
      const opened = await openSavedTextbook(subject.id, bookTitle);
      if (!opened) {
        onTextbookMissing(subject.id);
        Alert.alert(
          tr('Downloaded copy not found', 'ડાઉનલોડ કરેલી નકલ મળી નહીં'),
          tr('Download the textbook again while you are online.', 'ઓનલાઇન હોવ ત્યારે ફરી ડાઉનલોડ કરો.')
        );
      }
    } catch (e: any) {
      Alert.alert(tr('Could not open the textbook', 'પાઠ્યપુસ્તક ખુલી શક્યું નહીં'), e?.message);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
      <View style={styles.top}>
        <View style={[styles.icon, { backgroundColor: tone.cover }]}>
          <MaterialIcons name={tone.icon as any} size={24} color="#ffffff" />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={2}>
            {isGujarati && subject.nameGujarati ? subject.nameGujarati : subject.name}
          </Text>
          <Text style={[styles.sub, { color: colors.onSurfaceVariant }]}>
            {tr(`${total} chapters · ${doneCount} done`, `${total} પ્રકરણ · ${doneCount} પૂર્ણ`)}
          </Text>
        </View>
        <Text style={[styles.pct, { color: colors.onSurface }]}>{pct}%</Text>
      </View>

      <View style={[styles.track, { backgroundColor: colors.surfaceContainer }]}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: colors.accent }]} />
      </View>

      {subject.officialTextbookPdf && (
        <View style={[styles.bookBox, { backgroundColor: colors.primaryFixed }]}>
          <MaterialIcons name="menu-book" size={20} color={colors.primary} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[styles.bookTitle, { color: colors.primary }]} numberOfLines={2}>
              {bookTitle}
            </Text>
            <Text style={[styles.bookSub, { color: colors.onSurfaceVariant }]}>
              {tr('Full official textbook (PDF)', 'સંપૂર્ણ અધિકૃત પાઠ્યપુસ્તક (PDF)')}
            </Text>
          </View>
        </View>
      )}
      {subject.officialTextbookPdf && (
        <View style={styles.bookActions}>
          <TouchableOpacity
            style={[styles.bookBtn, { borderColor: colors.outlineVariant }]}
            onPress={() => openPdfUrl(subject.officialTextbookPdf, colors.primary, tr)}
            accessibilityRole="button"
          >
            <MaterialIcons name="open-in-new" size={17} color={colors.primary} />
            <Text style={[styles.bookBtnText, { color: colors.primary }]}>{tr('Read online', 'ઓનલાઇન વાંચો')}</Text>
          </TouchableOpacity>
          {offlineSupported && (
            <TouchableOpacity
              style={[styles.bookBtn, { borderColor: textbookSaved ? colors.tertiary : colors.outlineVariant, opacity: progress !== null ? 0.7 : 1 }]}
              disabled={progress !== null}
              onPress={textbookSaved ? openSaved : download}
              accessibilityRole="button"
            >
              <MaterialIcons
                name={textbookSaved ? 'offline-pin' : 'download'}
                size={17}
                color={textbookSaved ? colors.tertiary : colors.primary}
              />
              <Text style={[styles.bookBtnText, { color: textbookSaved ? colors.tertiary : colors.primary }]}>
                {progress !== null
                  ? tr(`Downloading ${Math.round(progress * 100)}%`, `ડાઉનલોડ ${Math.round(progress * 100)}%`)
                  : textbookSaved
                    ? tr('Open downloaded', 'ડાઉનલોડ કરેલું ખોલો')
                    : tr('Download', 'ડાઉનલોડ કરો')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 12 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: MindSprintFonts.heading, fontSize: 19, lineHeight: 25 },
  sub: { fontSize: 13, marginTop: 1 },
  pct: { fontFamily: MindSprintFonts.label, fontSize: 16 },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  bookBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12 },
  bookTitle: { fontFamily: MindSprintFonts.title, fontSize: 15, lineHeight: 20 },
  bookSub: { fontSize: 12, marginTop: 1 },
  bookActions: { flexDirection: 'row', gap: 8 },
  bookBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 42, borderRadius: 12, borderWidth: 1 },
  bookBtnText: { fontFamily: MindSprintFonts.label, fontSize: 14 },
});
