import AsyncStorage from '@react-native-async-storage/async-storage';

export type LastChapter = {
  grade: string;
  subjectId: string;
  chapterId: string;
  chapterNumber: number;
  title: string;
  titleGujarati?: string;
  subjectName: string;
  action: 'video' | 'pdf' | 'notes';
  at: number;
};

const keyFor = (grade: string, email?: string) => `@mindsprint_last_chapter_${grade}_${email || 'guest'}`;

/** Stores the entry and returns it with its timestamp. */
export function saveLastChapter(email: string | undefined, entry: Omit<LastChapter, 'at'>): LastChapter {
  const stored: LastChapter = { ...entry, at: Date.now() };
  AsyncStorage.setItem(keyFor(entry.grade, email), JSON.stringify(stored)).catch(() => {});
  return stored;
}

export async function getLastChapter(grade: string, email?: string): Promise<LastChapter | null> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(grade, email));
    return raw ? (JSON.parse(raw) as LastChapter) : null;
  } catch (_) {
    return null;
  }
}
