/**
 * Opening chapter resources (PDFs, YouTube) and finding chapters by id.
 * Shared by the Courses list, the Chapter page and the Lectures tab.
 */
import { Alert, Linking, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { API_BASE_URL } from '@/services/api';
import {
  ACADEMIC_CURRICULUM,
  AcademicGrade,
  AcademicSubject,
  SubjectChapter,
} from '@/constants/academicData';

type Tr = (english: string, gujarati?: string) => string;

/** Backend routes such as /api/curriculum/textbook-view?... become absolute server URLs. */
export function toAbsoluteUrl(url: string): string {
  if (url.startsWith('http')) return url;
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE_URL.replace(/\/api\/?$/, '')}${normalizedPath}`;
}

/** Open a PDF / web page in the in-app browser, falling back to the system browser. */
export async function openPdfUrl(url: string | undefined, toolbarColor: string, tr: Tr): Promise<void> {
  const fullUrl = toAbsoluteUrl(url || 'https://gujarat-education.gov.in/textbook/textbook.htm');

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.open(fullUrl, '_blank');
    return;
  }

  try {
    await WebBrowser.openBrowserAsync(fullUrl, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      toolbarColor,
    });
  } catch {
    try {
      await Linking.openURL(fullUrl);
    } catch {
      try {
        await Linking.openURL(`https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}`);
      } catch {
        Alert.alert(
          tr('Could not open the textbook', 'પાઠ્યપુસ્તક ખુલી શક્યું નહીં'),
          tr(
            'Check your internet connection and try again. If it keeps failing, make sure the MindSprint server is running.',
            'ઇન્ટરનેટ કનેક્શન તપાસો અને ફરી પ્રયત્ન કરો.'
          ),
          [
            { text: tr('Try again', 'ફરી પ્રયત્ન કરો'), onPress: () => openPdfUrl(url, toolbarColor, tr) },
            { text: tr('Close', 'બંધ કરો'), style: 'cancel' },
          ]
        );
      }
    }
  }
}

/** Open a YouTube video in the app (or browser). With no id, searches YouTube for `searchFallback`. */
export async function openYouTube(videoId: string, searchFallback: string | undefined, tr: Tr): Promise<void> {
  const webUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(searchFallback || 'GSEB Gujarati Medium')}`;
  const appUrl = videoId ? `vnd.youtube://${videoId}` : webUrl;

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.open(webUrl, '_blank');
    return;
  }

  try {
    if (await Linking.canOpenURL(appUrl)) {
      await Linking.openURL(appUrl);
      return;
    }
  } catch {}
  try {
    await Linking.openURL(webUrl);
  } catch {
    try {
      await WebBrowser.openBrowserAsync(webUrl);
    } catch {
      Alert.alert(
        tr('Could not open the video', 'વિડિયો ખુલી શક્યો નહીં'),
        tr('Check your internet connection and try again.', 'ઇન્ટરનેટ કનેક્શન તપાસો અને ફરી પ્રયત્ન કરો.'),
        [
          { text: tr('Try again', 'ફરી પ્રયત્ન કરો'), onPress: () => openYouTube(videoId, searchFallback, tr) },
          { text: tr('Close', 'બંધ કરો'), style: 'cancel' },
        ]
      );
    }
  }
}

/** YouTube search text for a chapter, in the student's language of study. */
export function chapterSearchQuery(grade: string, subject: AcademicSubject | undefined, chap: SubjectChapter): string {
  const chNum = chap.chapterNumber ? `પ્રકરણ ${chap.chapterNumber} ` : '';
  return `ધોરણ ${grade} ${subject?.nameGujarati || subject?.name || ''} ${chNum}${chap.titleGujarati || chap.title} GSEB`;
}

/** Look a chapter up across a grade's subjects (local curriculum is the single source of truth). */
export function findChapter(
  grade: string,
  chapterId: string
): { subject: AcademicSubject; chapter: SubjectChapter } | null {
  const curriculum = ACADEMIC_CURRICULUM[grade as AcademicGrade];
  const grades = curriculum ? [curriculum] : Object.values(ACADEMIC_CURRICULUM);
  for (const g of grades) {
    for (const subject of g.subjects) {
      const chapter = subject.chapters.find((c) => c.id === chapterId);
      if (chapter) return { subject, chapter };
    }
  }
  return null;
}

/** Chapter title in the chosen language, with its number. */
export function chapterLabel(chap: SubjectChapter, gujarati: boolean): string {
  return `${chap.chapterNumber}. ${gujarati && chap.titleGujarati ? chap.titleGujarati : chap.title}`;
}

/** Subject name in the chosen language. */
export function subjectLabel(subject: AcademicSubject | undefined, gujarati: boolean): string {
  if (!subject) return '';
  return gujarati && subject.nameGujarati ? subject.nameGujarati : subject.name;
}
