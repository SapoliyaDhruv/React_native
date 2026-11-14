/**
 * MindSprint design tokens — "Blue ink & marigold".
 *
 * Grounded in a Gujarat school student's desk: royal-blue ink pens, ruled
 * notebook paper, and marigold (Uttarayan kites, highlighters).
 * - primary   : school-pen blue ink — main actions, links, selected states
 * - accent    : marigold — used sparingly (streaks, the one key action per screen)
 * - tertiary  : leaf green — "done" / correct
 * - surfaces  : cool notebook paper with blue-grey ruled lines
 */
export const MindSprintColors = {
  primary: '#1D3A8A',
  primaryContainer: '#12245C',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#C9D5F5',
  primaryFixed: '#E4EAF8',
  onPrimaryFixedVariant: '#1D3A8A',

  secondary: '#2F6FD6',
  secondaryContainer: '#E3EDFC',
  onSecondaryContainer: '#1B4C9C',
  secondaryFixed: '#C8DAF7',
  onSecondaryFixedVariant: '#16407F',

  tertiary: '#12805C',
  tertiaryContainer: '#DDF3EA',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#0B5C42',
  tertiaryFixed: '#B5E5D2',
  onTertiaryFixed: '#0B5C42',

  accent: '#F4A30B',
  accentContainer: '#FFF1D2',
  onAccent: '#3A2600',
  onAccentContainer: '#8A5A00',

  heroSurface: '#12245C',
  onHeroSurface: '#ffffff',
  onHeroSurfaceVariant: '#B9C6EA',

  background: '#F5F7FB',
  surface: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#EEF2F8',
  surfaceContainer: '#E3E9F2',
  surfaceContainerHigh: '#CDD6E4',
  surfaceContainerHighest: '#A9B5C9',

  onSurface: '#16203A',
  onSurfaceVariant: '#5A6680',
  outline: '#7C879E',
  outlineVariant: '#DCE2EE',

  error: '#C8372D',
  errorContainer: '#FBE3E0',
};

export const MindSprintDarkColors: typeof MindSprintColors = {
  primary: '#93ACFF',
  primaryContainer: '#1B2C63',
  onPrimary: '#0C1222',
  onPrimaryContainer: '#DCE4FF',
  primaryFixed: '#1E2B52',
  onPrimaryFixedVariant: '#C9D5F5',

  secondary: '#7FB0FF',
  secondaryContainer: '#16305C',
  onSecondaryContainer: '#CFE0FF',
  secondaryFixed: '#1E4A8C',
  onSecondaryFixedVariant: '#E3EDFC',

  tertiary: '#4FCB9C',
  tertiaryContainer: '#0E3A2C',
  onTertiary: '#03241A',
  onTertiaryContainer: '#B5E5D2',
  tertiaryFixed: '#12805C',
  onTertiaryFixed: '#DDF3EA',

  accent: '#FFB627',
  accentContainer: '#3A2A08',
  onAccent: '#2A1B00',
  onAccentContainer: '#FFD58A',

  heroSurface: '#1B2C63',
  onHeroSurface: '#ffffff',
  onHeroSurfaceVariant: '#B9C6EA',

  background: '#0C1222',
  surface: '#131B30',
  surfaceContainerLowest: '#131B30',
  surfaceContainerLow: '#1A2440',
  surfaceContainer: '#223052',
  surfaceContainerHigh: '#2D3D66',
  surfaceContainerHighest: '#3C4F80',

  onSurface: '#EEF2FA',
  onSurfaceVariant: '#9AA6C0',
  outline: '#6E7A96',
  outlineVariant: '#26314F',

  error: '#FF8A80',
  errorContainer: '#4A1712',
};

/**
 * Baloo Bhai 2 is designed for Gujarati + Latin, so Gujarati and English
 * headings share one voice. Body text stays on the system font (Noto on
 * Android renders Gujarati well). Custom fonts ignore `fontWeight`, so each
 * weight is its own family.
 */
export const MindSprintFonts = {
  display: 'BalooBhai2_800ExtraBold',
  heading: 'BalooBhai2_700Bold',
  title: 'BalooBhai2_600SemiBold',
  label: 'BalooBhai2_600SemiBold',
};

/** Type scale (sizes / line heights) used by the redesigned screens. */
export const MindSprintType = {
  display: { fontFamily: MindSprintFonts.display, fontSize: 28, lineHeight: 36 },
  h1: { fontFamily: MindSprintFonts.heading, fontSize: 22, lineHeight: 30 },
  h2: { fontFamily: MindSprintFonts.heading, fontSize: 18, lineHeight: 26 },
  title: { fontFamily: MindSprintFonts.title, fontSize: 16, lineHeight: 22 },
  button: { fontFamily: MindSprintFonts.label, fontSize: 15, lineHeight: 20 },
  body: { fontSize: 14.5, lineHeight: 21 },
  small: { fontSize: 12.5, lineHeight: 17 },
} as const;

export const MindSprintRadii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
};

export const MindSprintShadows = {
  // Elevation comes from hairline borders first; shadows stay very soft.
  card: {
    shadowColor: '#16203A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  glow: {
    shadowColor: '#12245C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
};
