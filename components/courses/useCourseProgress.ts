import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { getLastChapter, LastChapter } from '@/services/learningProgress';
import { getSavedChapterIds, getSavedTextbookIds } from '@/services/offlineChapters';

/** Storage keys are shared with Home (completion) and older app versions, so keep them stable. */
export const completedKey = (grade: string, email?: string) =>
  `@mindsprint_completed_chapters_${grade}_${email || 'guest'}`;
export const bookmarkKey = (grade: string, email?: string) =>
  `@mindsprint_bookmarked_chapters_${grade}_${email || 'guest'}`;

function toggleIn(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

/**
 * Per-student course progress: done chapters, bookmarks, offline copies and
 * the last opened chapter. Reloaded whenever the screen comes into focus, so
 * the list, the chapter page and Lectures always agree.
 */
export function useCourseProgress(grade: string, email?: string) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [savedChapterIds, setSavedChapterIds] = useState<string[]>([]);
  const [savedTextbookIds, setSavedTextbookIds] = useState<string[]>([]);
  const [lastChapter, setLastChapter] = useState<LastChapter | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const [doneRaw, bookRaw, saved, books, last] = await Promise.all([
            AsyncStorage.getItem(completedKey(grade, email)),
            AsyncStorage.getItem(bookmarkKey(grade, email)),
            getSavedChapterIds().catch(() => [] as string[]),
            getSavedTextbookIds().catch(() => [] as string[]),
            getLastChapter(grade, email),
          ]);
          if (!active) return;
          setCompletedIds(doneRaw ? JSON.parse(doneRaw) : []);
          setBookmarkedIds(bookRaw ? JSON.parse(bookRaw) : []);
          setSavedChapterIds(saved);
          setSavedTextbookIds(books);
          setLastChapter(last);
        } catch {
          // storage unavailable: keep empty progress
        }
      })();
      return () => {
        active = false;
      };
    }, [grade, email])
  );

  const toggleComplete = useCallback(
    (chapterId: string) => {
      setCompletedIds((prev) => {
        const next = toggleIn(prev, chapterId);
        AsyncStorage.setItem(completedKey(grade, email), JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [grade, email]
  );

  const toggleBookmark = useCallback(
    (chapterId: string) => {
      setBookmarkedIds((prev) => {
        const next = toggleIn(prev, chapterId);
        AsyncStorage.setItem(bookmarkKey(grade, email), JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [grade, email]
  );

  return {
    completedIds,
    bookmarkedIds,
    savedChapterIds,
    setSavedChapterIds,
    savedTextbookIds,
    setSavedTextbookIds,
    lastChapter,
    setLastChapter,
    toggleComplete,
    toggleBookmark,
  };
}
