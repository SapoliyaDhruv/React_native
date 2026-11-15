#!/usr/bin/env node
/**
 * Content audit for MindSprint.
 *
 *   node scripts/audit-content.mjs            offline structure checks (fast, used on every PR)
 *   node scripts/audit-content.mjs --online   also checks every YouTube video and external PDF/book link
 *
 * Exits with code 1 when something is broken. Data lives in backend/data/*.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, 'backend/data', f), 'utf8'));
const curriculum = read('curriculum.json');
const lectures = read('videos.json');
const online = process.argv.includes('--online');

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);

const videoUse = new Map(); // youtube id -> chapter keys
let chapterCount = 0;
let pendingVideos = 0;
const externalUrls = new Set();

for (const [grade, g] of Object.entries(curriculum)) {
  for (const s of g.subjects) {
    const nums = s.chapters.map((c) => c.chapterNumber);
    if (new Set(nums).size !== nums.length) err(`${grade}/${s.id}: duplicate chapter numbers`);
    for (const k of ['officialTextbookPdf', 'shalamitraUrl']) if (s[k]) externalUrls.add(s[k]);
    for (const c of s.chapters) {
      chapterCount++;
      const key = `${grade}/${s.id}/ch${c.chapterNumber}`;
      for (const f of ['textbookPdfUrl', 'chapterPdfUrl', 'textbookViewerUrl']) {
        if (!c[f]) { err(`${key}: missing ${f}`); continue; }
        const q = new URL(c[f], 'http://x').searchParams;
        if (q.get('grade') !== grade || q.get('subject') !== s.id || Number(q.get('chapter')) !== c.chapterNumber) {
          err(`${key}: ${f} points to a different chapter (${c[f]})`);
        }
      }
      for (const f of ['fullBookPdfUrl', 'shalamitraUrl']) if (c[f]?.startsWith('http')) externalUrls.add(c[f]);
      // Subjects flagged videosPending (new Commerce/Arts subjects) may have chapters without videos yet;
      // the app offers a YouTube search for them. Everywhere else a missing video is an error.
      if (!c.videos?.length) (s.videosPending ? pendingVideos++ : err(`${key}: no videos`));
      const ids = (c.videos || []).map((v) => v.youtubeVideoId);
      if (new Set(ids).size !== ids.length) err(`${key}: same video listed twice`);
      for (const id of ids) {
        if (!/^[\w-]{11}$/.test(id || '')) err(`${key}: invalid YouTube id "${id}"`);
        videoUse.set(id, [...(videoUse.get(id) || []), key]);
      }
    }
  }
}
for (const [id, keys] of videoUse) if (keys.length > 1) err(`video ${id} reused by several chapters: ${keys.join(', ')}`);

for (const l of lectures) {
  const g = curriculum[l.grades?.[0]];
  const c = g?.subjects.find((s) => s.id === l.subjectId)?.chapters.find((x) => x.chapterNumber === l.chapterNumber);
  if (c && c.videos[0]?.youtubeVideoId !== l.youtubeVideoId) err(`lecture ${l.id}: video differs from its chapter's first video`);
  if (!c && l.subjectId) warnings.push(`lecture ${l.id}: no matching chapter`);
}

// Offline length check from the stored duration ("9m", "1h 49m"): catches YouTube
// Shorts or clips added as full-chapter videos, even in PR checks.
const MIN_VIDEO_SECONDS = 300;
const parseDuration = (d) => {
  const m = /^(?:(\d+)h)?\s*(?:(\d+)m)?$/.exec(String(d || '').trim());
  return m && (m[1] || m[2]) ? (Number(m[1] || 0) * 60 + Number(m[2] || 0)) * 60 : null;
};
for (const [g, grade] of Object.entries(curriculum)) {
  for (const s of grade.subjects) for (const c of s.chapters) for (const v of c.videos || []) {
    const sec = parseDuration(v.duration);
    if (sec !== null && sec < MIN_VIDEO_SECONDS) err(`${c.id}: video ${v.youtubeVideoId} is only ${v.duration} (minimum ${MIN_VIDEO_SECONDS / 60} min)`);
  }
}

async function pool(items, size, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: size }, async () => { while (i < items.length) { const n = i++; out[n] = await fn(items[n]); } }));
  return out;
}

if (online) {
  const ids = [...new Set([...videoUse.keys(), ...lectures.map((l) => l.youtubeVideoId)])];
  const results = await pool(ids, 10, async (id) => {
    try {
      const r = await fetch(`https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`, { signal: AbortSignal.timeout(20000) });
      return [id, r.status];
    } catch (e) { return [id, `network error (${e.cause?.code || e.message})`]; }
  });
  for (const [id, status] of results) {
    if (status === 200) continue;
    (typeof status === 'number' ? err : (m) => warnings.push(m))(`video ${id}: ${status} (used by ${(videoUse.get(id) || ['lectures']).join(', ')})`);
  }
  const urls = [...externalUrls].filter((u) => /^https?:/.test(u));
  const linkResults = await pool(urls, 8, async (u) => {
    try {
      const r = await fetch(u, { method: 'GET', headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(25000), redirect: 'follow' });
      await r.body?.cancel();
      return [u, r.status];
    } catch (e) { return [u, `network error (${e.cause?.code || e.message})`]; }
  });
  for (const [u, status] of linkResults) {
    if (status === 200) continue;
    // 429 = the site rate-limited this run (shalamitra.in does with many links); not a broken link.
    (typeof status === 'number' && status !== 429 ? err : (m) => warnings.push(m))(`link ${u}: ${status}${status === 429 ? ' (rate limited, not checked)' : ''}`);
  }
  // Real length from the watch page (stored durations can drift or be wrong).
  const chapterIds = [...videoUse.keys()];
  const lengths = await pool(chapterIds, 8, async (id) => {
    try {
      const r = await fetch(`https://www.youtube.com/watch?v=${id}`, {
        headers: { 'user-agent': 'Mozilla/5.0', 'accept-language': 'en', cookie: 'CONSENT=YES+1' },
        signal: AbortSignal.timeout(45000),
      });
      const html = await r.text();
      const len = /"lengthSeconds":"(\d+)"/.exec(html)?.[1];
      const embed = /"playableInEmbed":(true|false)/.exec(html)?.[1];
      return [id, len ? Number(len) : null, embed];
    } catch (e) { return [id, `network error (${e.cause?.code || e.message})`, null]; }
  });
  for (const [id, len, embed] of lengths) {
    const used = (videoUse.get(id) || []).join(', ');
    if (typeof len === 'string') warnings.push(`video ${id}: length not checked, ${len}`);
    else if (len === null) warnings.push(`video ${id}: length not found on watch page`);
    else if (len < MIN_VIDEO_SECONDS) err(`video ${id}: only ${len}s long (used by ${used})`);
    if (embed === 'false') err(`video ${id}: embedding disabled (used by ${used})`);
  }
  console.log(`Online: checked ${ids.length} videos (${chapterIds.length} lengths) and ${urls.length} external links.`);
}

console.log(`Checked ${chapterCount} chapters, ${videoUse.size} distinct videos, ${lectures.length} video lectures.`);
if (pendingVideos) warnings.push(`${pendingVideos} chapters in videosPending subjects have no video yet`);
warnings.forEach((w) => console.warn('warning:', w));
if (errors.length) {
  errors.forEach((e) => console.error('error:', e));
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log('Content audit passed.');
