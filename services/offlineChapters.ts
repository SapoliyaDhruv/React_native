/**
 * Save chapter PDFs on the device so students can read them without internet.
 *
 * The server renders every chapter as a printable HTML page. We download that page while online,
 * turn it into a real PDF with expo-print, keep it in the app's document directory and open it with
 * the system share/open sheet. Not supported on web (the browser can already save pages itself).
 */
import { Platform } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INDEX_KEY = '@mindsprint_offline_chapters_v1';

type OfflineEntry = { uri: string; savedAt: number };
type OfflineIndex = Record<string, OfflineEntry>;

export const offlineSupported = Platform.OS !== 'web';

async function readIndex(): Promise<OfflineIndex> {
  try {
    const raw = await AsyncStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as OfflineIndex) : {};
  } catch {
    return {};
  }
}

async function writeIndex(index: OfflineIndex) {
  try {
    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index));
  } catch {}
}

/** Ids of chapters whose PDF file still exists on this device. */
export async function getSavedChapterIds(): Promise<string[]> {
  if (!offlineSupported) return [];
  const index = await readIndex();
  const stillThere = Object.entries(index).filter(([, e]) => {
    try { return new File(e.uri).exists; } catch { return false; }
  });
  if (stillThere.length !== Object.keys(index).length) await writeIndex(Object.fromEntries(stillThere));
  return stillThere.map(([id]) => id);
}

/** Download the chapter page, convert it to a PDF and store it. Throws a readable Error on failure. */
export async function saveChapterOffline(chapterId: string, absoluteUrl: string): Promise<void> {
  if (!offlineSupported) throw new Error('Saving for offline use is not available in the browser.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let html: string;
  try {
    const response = await fetch(absoluteUrl, { signal: controller.signal });
    if (!response.ok) throw new Error(`The server returned ${response.status}.`);
    html = await response.text();
  } catch (e: any) {
    throw new Error(e?.name === 'AbortError' ? 'The server took too long to answer.' : 'Could not reach the server. Check your connection.');
  } finally {
    clearTimeout(timer);
  }

  const { uri } = await Print.printToFileAsync({ html });
  const dir = new Directory(Paths.document, 'chapters');
  if (!dir.exists) dir.create();
  const safeName = chapterId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const target = new File(dir, `${safeName}.pdf`);
  if (target.exists) target.delete();
  new File(uri).copy(target);

  const index = await readIndex();
  index[chapterId] = { uri: target.uri, savedAt: Date.now() };
  await writeIndex(index);
}

/** Open a saved chapter in the system viewer. Returns false if it is no longer on the device. */
export async function openSavedChapter(chapterId: string, title: string): Promise<boolean> {
  if (!offlineSupported) return false;
  const index = await readIndex();
  const entry = index[chapterId];
  if (!entry || !new File(entry.uri).exists) {
    if (entry) { delete index[chapterId]; await writeIndex(index); }
    return false;
  }
  if (!(await Sharing.isAvailableAsync())) throw new Error('This device cannot open saved PDFs from the app.');
  await Sharing.shareAsync(entry.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: title });
  return true;
}

export async function removeSavedChapter(chapterId: string): Promise<void> {
  const index = await readIndex();
  const entry = index[chapterId];
  if (entry) {
    try { const f = new File(entry.uri); if (f.exists) f.delete(); } catch {}
    delete index[chapterId];
    await writeIndex(index);
  }
}

/* ------------------------------------------------------------------ */
/* Full textbooks: the official PDF is downloaded as-is (no printing). */
/* ------------------------------------------------------------------ */

const BOOK_INDEX_KEY = '@mindsprint_offline_textbooks_v1';

async function readBookIndex(): Promise<OfflineIndex> {
  try {
    const raw = await AsyncStorage.getItem(BOOK_INDEX_KEY);
    return raw ? (JSON.parse(raw) as OfflineIndex) : {};
  } catch {
    return {};
  }
}

async function writeBookIndex(index: OfflineIndex) {
  try {
    await AsyncStorage.setItem(BOOK_INDEX_KEY, JSON.stringify(index));
  } catch {}
}

/** Ids of subjects whose full textbook PDF is on this device. */
export async function getSavedTextbookIds(): Promise<string[]> {
  if (!offlineSupported) return [];
  const index = await readBookIndex();
  const stillThere = Object.entries(index).filter(([, e]) => {
    try { return new File(e.uri).exists; } catch { return false; }
  });
  if (stillThere.length !== Object.keys(index).length) await writeBookIndex(Object.fromEntries(stillThere));
  return stillThere.map(([id]) => id);
}

/**
 * Download a subject's full textbook PDF into the app's documents folder.
 * `onProgress` receives 0..1 when the server reports a size. Throws a readable Error on failure.
 */
export async function saveTextbookOffline(
  subjectId: string,
  absoluteUrl: string,
  onProgress?: (fraction: number) => void
): Promise<void> {
  if (!offlineSupported) throw new Error('Downloading textbooks is not available in the browser.');
  const dir = new Directory(Paths.document, 'textbooks');
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  const safeName = subjectId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const target = new File(dir, `${safeName}.pdf`);
  try {
    const file = await File.downloadFileAsync(absoluteUrl, target, {
      idempotent: true,
      onProgress: onProgress
        ? (p) => {
            if (p.totalBytes > 0) onProgress(p.bytesWritten / p.totalBytes);
          }
        : undefined,
    });
    if (!file.exists || file.size === 0) throw new Error('empty');
    const index = await readBookIndex();
    index[subjectId] = { uri: file.uri, savedAt: Date.now() };
    await writeBookIndex(index);
  } catch {
    try { if (target.exists) target.delete(); } catch {}
    throw new Error('Could not download the textbook. Check your internet connection and try again.');
  }
}

/** Open a downloaded textbook. Returns false if it is no longer on the device. */
export async function openSavedTextbook(subjectId: string, title: string): Promise<boolean> {
  if (!offlineSupported) return false;
  const index = await readBookIndex();
  const entry = index[subjectId];
  if (!entry || !new File(entry.uri).exists) {
    if (entry) { delete index[subjectId]; await writeBookIndex(index); }
    return false;
  }
  if (!(await Sharing.isAvailableAsync())) throw new Error('This device cannot open saved PDFs from the app.');
  await Sharing.shareAsync(entry.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: title });
  return true;
}
