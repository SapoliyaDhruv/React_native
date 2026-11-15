/**
 * Cover colours for subjects, chosen to read like a shelf of printed
 * textbooks (deep, ink-like tones that keep white text legible) instead of
 * the bright UI defaults stored in the curriculum data.
 */
type Tone = { cover: string; spine: string; icon: string };

const TONES: { match: RegExp; tone: Tone }[] = [
  { match: /-(math|apt)\b/, tone: { cover: '#1D3A8A', spine: '#12245C', icon: 'calculate' } },
  { match: /-phy\b/, tone: { cover: '#2A3F9E', spine: '#1A2870', icon: 'bolt' } },
  { match: /-chem\b/, tone: { cover: '#12805C', spine: '#0B5C42', icon: 'science' } },
  { match: /-bio\b/, tone: { cover: '#4E7D2A', spine: '#35581B', icon: 'eco' } },
  { match: /-sci\b/, tone: { cover: '#12805C', spine: '#0B5C42', icon: 'science' } },
  { match: /-soc\b/, tone: { cover: '#A4561A', spine: '#7A3D0F', icon: 'public' } },
  { match: /-guj\b/, tone: { cover: '#A3226E', spine: '#76164F', icon: 'edit-note' } },
  { match: /-(eng|lr)\b/, tone: { cover: '#0F6E7A', spine: '#0A4F58', icon: 'translate' } },
  { match: /-(cs|tech)\b/, tone: { cover: '#3A4560', spine: '#262E42', icon: 'computer' } },
  // Class 11/12 Commerce
  { match: /-acc\b/, tone: { cover: '#0E5E6F', spine: '#08434F', icon: 'receipt-long' } },
  { match: /-bom\b/, tone: { cover: '#8A4B12', spine: '#64350B', icon: 'storefront' } },
  { match: /-stat\b/, tone: { cover: '#5B3A9E', spine: '#3F2873', icon: 'bar-chart' } },
  { match: /-eco\b/, tone: { cover: '#2E6B34', spine: '#1F4C24', icon: 'trending-up' } },
  // Class 11/12 Arts
  { match: /-his\b/, tone: { cover: '#8C3B1E', spine: '#652914', icon: 'history-edu' } },
  { match: /-geo\b/, tone: { cover: '#1F5F8B', spine: '#144465', icon: 'terrain' } },
  { match: /-psy\b/, tone: { cover: '#8E2A5E', spine: '#671D43', icon: 'psychology' } },
  { match: /-socio\b/, tone: { cover: '#5A6B1F', spine: '#404D15', icon: 'groups' } },
];

const FALLBACK: Tone = { cover: '#1D3A8A', spine: '#12245C', icon: 'menu-book' };

export function subjectTone(subjectId: string): Tone {
  return TONES.find((t) => t.match.test(subjectId))?.tone ?? FALLBACK;
}
