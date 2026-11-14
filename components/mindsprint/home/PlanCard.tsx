import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { subjectTone } from '@/constants/subjectTones';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { ExamCountdown, PlanItem, chapterTitle, shortSubjectName } from './studyPlan';

interface Props {
  countdown: ExamCountdown | null;
  plan: PlanItem[];
  onOpen: (item: PlanItem) => void;
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_GU = ['જાન્યુ', 'ફેબ્રુ', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 'જુલાઈ', 'ઑગસ્ટ', 'સપ્ટે', 'ઑક્ટો', 'નવે', 'ડિસે'];

/** Exam countdown + "Today's plan": what to study next, one chapter per subject. */
export const PlanCard: React.FC<Props> = ({ countdown, plan, onOpen }) => {
  const { colors } = useTheme();
  const { tr, isGujarati } = useLanguage();

  if (!countdown && plan.length === 0) return null;

  const dateLabel = countdown
    ? `${countdown.date.getDate()} ${(isGujarati ? MONTHS_GU : MONTHS_EN)[countdown.date.getMonth()]} ${countdown.date.getFullYear()}`
    : '';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
      {countdown && (
        <View
          style={styles.countdownRow}
          accessible
          accessibilityLabel={
            countdown.kind === 'board'
              ? tr(`Board exam in ${countdown.days} days, around ${dateLabel}`, `બોર્ડ પરીક્ષાને ${countdown.days} દિવસ બાકી, આશરે ${dateLabel}`)
              : tr(`Final exam in ${countdown.days} days, around ${dateLabel}`, `વાર્ષિક પરીક્ષાને ${countdown.days} દિવસ બાકી, આશરે ${dateLabel}`)
          }
        >
          <Text style={[styles.days, { color: colors.primary }]}>{countdown.days}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.countdownTitle, { color: colors.onSurface }]}>
              {countdown.kind === 'board'
                ? tr('days to your board exam', 'દિવસ બોર્ડ પરીક્ષાને બાકી')
                : tr('days to your final exam', 'દિવસ વાર્ષિક પરીક્ષાને બાકી')}
            </Text>
            <Text style={[styles.countdownSub, { color: colors.onSurfaceVariant }]}>
              {tr(`Expected from about ${dateLabel}`, `આશરે ${dateLabel} થી શરૂ`)}
            </Text>
          </View>
        </View>
      )}

      {plan.length > 0 && (
        <View style={[countdown && styles.planDivider, countdown && { borderTopColor: colors.outlineVariant }]}>
          <Text style={[styles.planHeading, { color: colors.onSurface }]}>{tr("Today's plan", 'આજનો પ્લાન')}</Text>
          {plan.map((item) => {
            const tone = subjectTone(item.subject.id);
            const hasVideo = (item.chapter.videos?.length || 0) > 0;
            return (
              <TouchableOpacity
                key={item.chapter.id}
                activeOpacity={0.7}
                onPress={() => onOpen(item)}
                accessibilityRole="button"
                accessibilityLabel={`${shortSubjectName(item.subject, isGujarati)}, ${chapterTitle(item.chapter, isGujarati)}. ${hasVideo ? tr('Watch', 'જુઓ') : tr('Open', 'ખોલો')}`}
                style={styles.planRow}
              >
                <View style={[styles.spine, { backgroundColor: tone.cover }]} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.planTitle, { color: colors.onSurface }]} numberOfLines={1}>
                    {chapterTitle(item.chapter, isGujarati)}
                  </Text>
                  <Text style={[styles.planSub, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                    {shortSubjectName(item.subject, isGujarati)} · {tr(`Chapter ${item.chapter.chapterNumber}`, `પ્રકરણ ${item.chapter.chapterNumber}`)}
                  </Text>
                </View>
                <View style={[styles.actionPill, { backgroundColor: colors.primaryFixed }]}>
                  <MaterialIcons name={hasVideo ? 'play-arrow' : 'menu-book'} size={16} color={colors.primary} />
                  <Text style={[styles.actionText, { color: colors.primary }]}>
                    {hasVideo ? tr('Watch', 'જુઓ') : tr('Open', 'ખોલો')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  days: {
    fontFamily: MindSprintFonts.display,
    fontSize: 38,
    lineHeight: 46,
    minWidth: 56,
    textAlign: 'center',
  },
  countdownTitle: {
    fontFamily: MindSprintFonts.title,
    fontSize: 16,
    lineHeight: 22,
  },
  countdownSub: {
    fontSize: 12.5,
    marginTop: 1,
  },
  planDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 12,
    paddingTop: 12,
  },
  planHeading: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 17,
    lineHeight: 23,
    marginBottom: 4,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 54,
    paddingVertical: 6,
  },
  spine: {
    width: 5,
    alignSelf: 'stretch',
    borderRadius: 3,
  },
  planTitle: {
    fontFamily: MindSprintFonts.title,
    fontSize: 15,
    lineHeight: 21,
  },
  planSub: {
    fontSize: 12.5,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  actionText: {
    fontFamily: MindSprintFonts.label,
    fontSize: 14,
  },
});
