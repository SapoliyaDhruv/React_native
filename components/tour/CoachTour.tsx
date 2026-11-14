import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, useWindowDimensions, AccessibilityInfo } from 'react-native';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export interface CoachStep {
  /** The view to highlight; must be a descendant of `rootRef`. */
  target: React.RefObject<View | null>;
  title: string;
  body: string;
}

interface Props {
  visible: boolean;
  steps: CoachStep[];
  /** The screen's root view; the overlay is drawn over it and targets are measured against it. */
  rootRef: React.RefObject<View | null>;
  onDone: () => void;
}

type Rect = { x: number; y: number; width: number; height: number };

const PAD = 6;

/**
 * A light coach-mark tour: dims the screen, outlines one element at a time and
 * explains it in a small card. No native modules; it is a plain overlay that
 * the host renders last inside its root view.
 */
export const CoachTour: React.FC<Props> = ({ visible, steps, rootRef, onDone }) => {
  const { colors } = useTheme();
  const { tr } = useLanguage();
  const { height: winH } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  const step = steps[index];

  const measure = useCallback(() => {
    const target = step?.target.current;
    const root = rootRef.current;
    if (!target || !root) {
      setRect(null);
      return;
    }
    target.measureLayout(
      root as any,
      (x, y, width, height) => setRect({ x, y, width, height }),
      () => setRect(null)
    );
  }, [step, rootRef]);

  useEffect(() => {
    if (!visible) return;
    // Wait a frame so layout has settled before measuring.
    const id = setTimeout(measure, 60);
    return () => clearTimeout(id);
  }, [visible, index, measure]);

  useEffect(() => {
    if (visible && step) AccessibilityInfo.announceForAccessibility?.(`${step.title}. ${step.body}`);
  }, [visible, step]);

  if (!visible || !step) return null;

  const isLast = index === steps.length - 1;
  const hole = rect
    ? { x: rect.x - PAD, y: rect.y - PAD, w: rect.width + PAD * 2, h: rect.height + PAD * 2 }
    : null;
  // Put the card below the highlighted element when there is room, otherwise above it.
  const cardBelow = !hole || hole.y + hole.h < winH * 0.55;
  const dim = 'rgba(8, 14, 34, 0.62)';

  const finish = () => {
    setIndex(0);
    onDone();
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none" accessibilityViewIsModal>
      {hole ? (
        <>
          {/* Four dim panels around the highlighted element */}
          <View style={[styles.dim, { backgroundColor: dim, top: 0, left: 0, right: 0, height: Math.max(hole.y, 0) }]} />
          <View style={[styles.dim, { backgroundColor: dim, top: hole.y, left: 0, width: Math.max(hole.x, 0), height: hole.h }]} />
          <View style={[styles.dim, { backgroundColor: dim, top: hole.y, left: hole.x + hole.w, right: 0, height: hole.h }]} />
          <View style={[styles.dim, { backgroundColor: dim, top: hole.y + hole.h, left: 0, right: 0, bottom: 0 }]} />
          <View
            pointerEvents="none"
            style={[styles.outline, { borderColor: colors.accent, top: hole.y, left: hole.x, width: hole.w, height: hole.h }]}
          />
        </>
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: dim }]} />
      )}

      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
          hole
            ? cardBelow
              ? { top: hole.y + hole.h + 12 }
              : { bottom: undefined, top: Math.max(hole.y - 12 - 170, 8) }
            : { top: '35%' },
        ]}
      >
        <Text style={[styles.stepCount, { color: colors.onSurfaceVariant }]}>
          {tr(`${index + 1} of ${steps.length}`, `${steps.length} માંથી ${index + 1}`)}
        </Text>
        <Text style={[styles.title, { color: colors.onSurface }]}>{step.title}</Text>
        <Text style={[styles.body, { color: colors.onSurfaceVariant }]}>{step.body}</Text>
        <View style={styles.actions}>
          {!isLast ? (
            <TouchableOpacity onPress={finish} style={styles.skipBtn} accessibilityRole="button">
              <Text style={[styles.skipText, { color: colors.onSurfaceVariant }]}>{tr('Skip', 'છોડો')}</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <TouchableOpacity
            onPress={() => (isLast ? finish() : setIndex((i) => i + 1))}
            style={[styles.nextBtn, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
          >
            <Text style={[styles.nextText, { color: colors.onPrimary }]}>
              {isLast ? tr('Got it', 'સમજાઈ ગયું') : tr('Next', 'આગળ')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dim: {
    position: 'absolute',
  },
  outline: {
    position: 'absolute',
    borderWidth: 2.5,
    borderRadius: 18,
  },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  stepCount: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  title: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 18,
    lineHeight: 24,
    marginTop: 2,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  skipBtn: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  skipText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 15,
  },
  nextBtn: {
    minHeight: 42,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  nextText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 15,
  },
});
