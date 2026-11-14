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
  } catch (_) {
    return {};
  }
}

async function writeIndex(index: OfflineIndex) {
  try {
    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index));
  } catch (_) {}
}

/** Ids of chapters whose PDF file still exists on this device. */
export async function getSavedChapterIds(): Promise<string[]> {
  if (!offlineSupported) return [];
  const index = await readIndex();
  const stillThere = Object.entries(index).filter(([, e]) => {
    try { return new File(e.uri).exists; } catch (_) { return false; }
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
    try { const f = new File(entry.uri); if (f.exists) f.delete(); } catch (_) {}
    delete index[chapterId];
    await writeIndex(index);
  }
}
