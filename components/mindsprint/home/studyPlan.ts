import type { AcademicGrade, AcademicSubject, SubjectChapter } from '@/constants/academicData';

export type ExamCountdown = {
  /** 'board' for Class 10 (SSC) and 12 (HSC), 'final' for other school classes */
  kind: 'board' | 'final';
  date: Date;
  days: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Next occurrence of `month`/`day` (1-based month) on or after today. */
function nextDate(month: number, day: number, now: Date): Date {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const candidate = new Date(now.getFullYear(), month - 1, day);
  return candidate >= today ? candidate : new Date(now.getFullYear() + 1, month - 1, day);
}

/**
 * Approximate exam date for a school class. GSEB SSC/HSC board exams usually
 * start in early March; school final exams for other classes in early April.
 * Returns null for college students.
 */
export function examCountdown(grade: AcademicGrade, now: Date = new Date()): ExamCountdown | null {
  if (grade === 'college') return null;
  const isBoard = grade === '10' || grade === '12';
  const date = isBoard ? nextDate(3, 1, now) : nextDate(4, 1, now);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((date.getTime() - today.getTime()) / DAY_MS);
  return { kind: isBoard ? 'board' : 'final', date, days };
}

export type PlanItem = { subject: AcademicSubject; chapter: SubjectChapter };

/**
 * Today's plan: the first unfinished chapter of each subject, in subject
 * order, up to `max` items. A subject that is fully done is skipped.
 */
export function nextChapters(
  subjects: AcademicSubject[],
  completedIds: string[],
  max = 3,
  skipChapterId?: string
): PlanItem[] {
  const done = new Set(completedIds);
  const items: PlanItem[] = [];
  for (const subject of subjects) {
    const chapter = (subject.chapters || []).find((c) => !done.has(c.id) && c.id !== skipChapterId);
    if (chapter) items.push({ subject, chapter });
    if (items.length >= max) break;
  }
  return items;
}

/** Number of activity entries completed in the last 7 days. */
export function countThisWeek(activity: { completedAt?: string }[] | undefined, now: Date = new Date()): number {
  if (!activity?.length) return 0;
  const since = now.getTime() - 7 * DAY_MS;
  return activity.filter((a) => {
    const t = a.completedAt ? Date.parse(a.completedAt) : NaN;
    return !Number.isNaN(t) && t >= since;
  }).length;
}

/** Subject name without the bracketed note, e.g. "ગુજરાતી (માતૃભાષા)" → "ગુજરાતી". */
export function shortSubjectName(subject: AcademicSubject, gujarati: boolean): string {
  const name = gujarati && subject.nameGujarati ? subject.nameGujarati : subject.name;
  return name.replace(/\s*\(.*\)\s*/, '').trim();
}

export function chapterTitle(chapter: SubjectChapter, gujarati: boolean): string {
  return (gujarati && chapter.titleGujarati) || chapter.title;
}
