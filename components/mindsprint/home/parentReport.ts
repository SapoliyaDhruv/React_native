import type { PlanItem } from './studyPlan';
import { chapterTitle, shortSubjectName } from './studyPlan';

type Tr = (english: string, gujarati?: string) => string;

export interface ParentReportInput {
  tr: Tr;
  gujarati: boolean;
  studentName: string;
  classLabel: string;
  streak: number;
  testsThisWeek: number;
  avgScore: number;
  chaptersDone: number;
  totalChapters: number;
  next: PlanItem[];
}

/**
 * Plain-text weekly summary for parents, written in the current UI language.
 * Numbers are the student's real figures; zeros are stated plainly.
 */
export function buildParentReport(r: ParentReportInput): string {
  const { tr } = r;
  const lines: string[] = [
    tr(`MindSprint weekly report — ${r.studentName}`, `MindSprint સાપ્તાહિક અહેવાલ — ${r.studentName}`),
    r.classLabel,
    '',
    tr(`Study streak: ${r.streak} ${r.streak === 1 ? 'day' : 'days'}`, `સતત અભ્યાસ: ${r.streak} દિવસ`),
    tr(`Tests this week: ${r.testsThisWeek}`, `આ અઠવાડિયે ટેસ્ટ: ${r.testsThisWeek}`),
    r.testsThisWeek > 0 || r.avgScore > 0
      ? tr(`Average score: ${r.avgScore}%`, `સરેરાશ ગુણ: ${r.avgScore}%`)
      : tr('Average score: no tests yet', 'સરેરાશ ગુણ: હજુ કોઈ ટેસ્ટ નથી'),
    r.totalChapters > 0
      ? tr(`Chapters finished: ${r.chaptersDone} of ${r.totalChapters}`, `પૂરાં થયેલાં પ્રકરણ: ${r.totalChapters} માંથી ${r.chaptersDone}`)
      : tr(`Chapters finished: ${r.chaptersDone}`, `પૂરાં થયેલાં પ્રકરણ: ${r.chaptersDone}`),
  ];

  if (r.next.length > 0) {
    lines.push('', tr('Next to study:', 'હવે ભણવાનું:'));
    for (const item of r.next) {
      lines.push(`• ${shortSubjectName(item.subject, r.gujarati)}: ${chapterTitle(item.chapter, r.gujarati)}`);
    }
  }

  lines.push('', tr('Sent from the MindSprint app.', 'MindSprint ઍપ પરથી મોકલેલ.'));
  return lines.join('\n');
}
