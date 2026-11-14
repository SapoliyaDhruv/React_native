import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Share,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows, MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { notify } from '@/components/common/dialogs';
import { Question } from '@/constants/mindsprintData';
import { WeakSpotAnalyzer } from '@/components/mindsprint/WeakSpotAnalyzer';
import { ConfettiEffect } from '@/components/mindsprint/ConfettiEffect';

interface ExamResultViewProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  bookmarkedQuestionIds: number[];
  isDiagnostic?: boolean;
  /** Server didn't store this result; show a small note. */
  savedOnDevice?: boolean;
  onToggleBookmark: (qId: number) => void;
  onDone: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  questions,
  userAnswers,
  bookmarkedQuestionIds,
  isDiagnostic = false,
  savedOnDevice = false,
  onToggleBookmark,
  onDone,
}) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { tr } = useLanguage();

  const [showCertModal, setShowCertModal] = useState(false);
  // Generated once per result, not on every render.
  const [certId] = useState(() => 'MS-' + Math.random().toString(36).substring(2, 9).toUpperCase());

  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswer) {
      correctCount++;
    }
  });

  const percentage = Math.round((correctCount / questions.length) * 100);
  const isPassed = percentage >= 60;
  const isCertificateEligible = percentage >= 80;

  const examTitle = isDiagnostic
    ? tr('Weak-topic check', 'નબળા વિષયોની ચકાસણી')
    : user?.grade && user?.grade !== 'college'
    ? tr(`Class ${user?.grade} practice test`, `ધોરણ ${user?.grade} પ્રેક્ટિસ ટેસ્ટ`)
    : tr('Aptitude & IT mock test', 'એપ્ટિટ્યુડ અને IT મોક ટેસ્ટ');

  const todayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const handleShareScorecard = async () => {
    try {
      const shareMsg = `I scored ${percentage}% (${correctCount}/${questions.length}) on the ${examTitle} on MindSprint.`;
      await Share.share({
        message: shareMsg,
        title: 'MindSprint',
      });
    } catch (err: any) {
      notify(tr('Could not share your score', 'સ્કોર શેર થઈ શક્યો નહીં'), err.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Confetti Burst for celebration */}
      {isPassed && <ConfettiEffect />}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Score Card */}
        <View
          style={[
            styles.resultCard,
            {
              backgroundColor: colors.surface,
              borderColor: isDiagnostic ? '#2F6FD6' : colors.outlineVariant,
              borderWidth: isDiagnostic ? 2 : 1,
            },
            MindSprintShadows.card,
          ]}
        >
          {isDiagnostic && (
            <View style={styles.diagnosticPill}>
              <MaterialIcons name="auto-awesome" size={14} color="#2F6FD6" />
              <Text style={styles.diagnosticPillText}>{tr('Weak-topic report', 'નબળા વિષયોનો રિપોર્ટ')}</Text>
            </View>
          )}

          <View
            style={[
              styles.trophyCircle,
              { backgroundColor: isPassed ? 'rgba(18, 128, 92, 0.15)' : 'rgba(200, 55, 45, 0.15)' },
            ]}
          >
            <MaterialIcons
              name={isPassed ? 'emoji-events' : 'school'}
              size={36}
              color={isPassed ? '#12805C' : '#C8372D'}
            />
          </View>

          <Text style={[styles.resultTitle, { color: colors.onSurface }]}>
            {isPassed ? (percentage >= 80 ? tr('Excellent work', 'ખૂબ સરસ') : tr('You passed', 'તમે પાસ થયા')) : tr('Test finished', 'ટેસ્ટ પૂરો થયો')}
          </Text>
          <Text style={[styles.resultSubtitle, { color: colors.onSurfaceVariant }]}>
            {examTitle}
          </Text>

          {/* Score & Pass Badge */}
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreNumber, { color: isPassed ? '#12805C' : colors.primary }]}>
              {percentage}%
            </Text>
            <View
              style={[
                styles.passBadge,
                { backgroundColor: isPassed ? '#12805C' : '#C8372D' },
              ]}
            >
              <Text style={styles.passText}>
                {isPassed ? tr('Passed', 'પાસ') : tr('Needs practice', 'વધુ પ્રેક્ટિસ કરો')}
              </Text>
            </View>
          </View>

          {/* 3-Col Stats Grid */}
          <View
            style={[
              styles.statsGrid,
              { borderTopColor: colors.outlineVariant },
            ]}
          >
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#12805C' }]}>{correctCount}</Text>
              <Text style={[styles.statLbl, { color: colors.outline }]}>{tr('Correct', 'સાચા')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#C8372D' }]}>
                {questions.length - correctCount}
              </Text>
              <Text style={[styles.statLbl, { color: colors.outline }]}>{tr('Incorrect', 'ખોટા')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: colors.onSurface }]}>
                {Object.keys(userAnswers).length}
              </Text>
              <Text style={[styles.statLbl, { color: colors.outline }]}>{tr('Attempted', 'પ્રયાસ કર્યા')}</Text>
            </View>
          </View>

          {/* Certificate & Share Action Bar */}
          <View style={styles.actionButtonsRow}>
            {isCertificateEligible && (
              <TouchableOpacity
                style={[styles.certActionBtn, { backgroundColor: '#F4A30B' }, MindSprintShadows.glow]}
                activeOpacity={0.85}
                onPress={() => setShowCertModal(true)}
              >
                <MaterialIcons name="workspace-premium" size={18} color="#ffffff" />
                <Text style={styles.certActionBtnText}>{tr('View certificate', 'પ્રમાણપત્ર જુઓ')}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.shareActionBtn, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
              onPress={handleShareScorecard}
            >
              <MaterialIcons name="share" size={18} color={colors.onPrimary} />
              <Text style={[styles.shareActionBtnText, { color: colors.onPrimary }]}>{tr('Share score', 'સ્કોર શેર કરો')}</Text>
            </TouchableOpacity>
          </View>
          {savedOnDevice && (
            <View style={styles.savedNote}>
              <MaterialIcons name="smartphone" size={16} color={colors.onSurfaceVariant} />
              <Text style={[styles.savedNoteText, { color: colors.onSurfaceVariant }]}>
                {tr(
                  'Saved on this phone. It will not appear in rankings until the server is online.',
                  'આ ફોનમાં સેવ થયું. સર્વર ચાલુ થાય ત્યાં સુધી રેન્કિંગમાં નહીં દેખાય.'
                )}
              </Text>
            </View>
          )}
        </View>

        {/* AI Weak Spot Analyzer */}
        <WeakSpotAnalyzer questions={questions} userAnswers={userAnswers} />

        {/* Solutions & Explanations */}
        <Text style={[styles.solutionsHeading, { color: colors.onSurface }]}>
          {tr('Answers and explanations', 'જવાબ અને સમજૂતી')}
        </Text>

        {questions.map((q, idx) => {
          const userAns = userAnswers[idx];
          const isCorrect = userAns === q.correctAnswer;

          return (
            <View
              key={q.id}
              style={[
                styles.explanationCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isCorrect ? colors.tertiary : userAns !== undefined ? colors.error : colors.outlineVariant,
                },
                MindSprintShadows.card,
              ]}
            >
              <View style={styles.questionMetaHeader}>
                <Text style={[styles.qIndexText, { color: colors.outline }]}>
                  {tr('Question', 'પ્રશ્ન')} {idx + 1} · {q.category}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: isCorrect ? colors.tertiaryContainer : colors.errorContainer },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: isCorrect ? colors.onTertiaryContainer : colors.error }]}>
                      {isCorrect ? tr('Correct', 'સાચો') : userAns === undefined ? tr('Skipped', 'છોડી દીધો') : tr('Incorrect', 'ખોટો')}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => onToggleBookmark(q.id)} style={{ padding: 4 }}>
                    <MaterialIcons
                      name={bookmarkedQuestionIds.includes(q.id) ? 'bookmark' : 'bookmark-border'}
                      size={20}
                      color={bookmarkedQuestionIds.includes(q.id) ? colors.primary : colors.outline}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.explQuestionText, { color: colors.onSurface }]}>
                {q.questionText}
              </Text>

              {/* Options Breakdown */}
              <View style={{ gap: 6, marginVertical: 8 }}>
                {q.options.map((opt, optIdx) => {
                  const isCorrectAnswer = optIdx === q.correctAnswer;
                  const isUserChosen = optIdx === userAns;

                  let bg = colors.surfaceContainerLow;
                  let border = colors.outlineVariant;
                  let textClr = colors.onSurface;
                  let badge = null;

                  if (isUserChosen && isCorrectAnswer) {
                    bg = colors.tertiaryContainer;
                    border = colors.tertiary;
                    textClr = colors.onTertiaryContainer;
                    badge = tr('Your answer · correct', 'તમારો જવાબ · સાચો');
                  } else if (isUserChosen && !isCorrectAnswer) {
                    bg = colors.errorContainer;
                    border = colors.error;
                    textClr = colors.onSurface;
                    badge = tr('Your answer', 'તમારો જવાબ');
                  } else if (isCorrectAnswer) {
                    bg = colors.tertiaryContainer;
                    border = colors.tertiary;
                    textClr = colors.onTertiaryContainer;
                    badge = tr('Correct answer', 'સાચો જવાબ');
                  }

                  return (
                    <View
                      key={optIdx}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        borderRadius: 10,
                        borderWidth: 1,
                        backgroundColor: bg,
                        borderColor: border,
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={{ fontSize: 13, color: textClr, fontWeight: '500', flex: 1 }}>
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </Text>
                      {badge && (
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 6,
                            backgroundColor: isUserChosen && !isCorrectAnswer ? colors.error : colors.tertiary,
                          }}
                        >
                          <Text style={{ fontSize: 10.5, fontWeight: '700', color: isUserChosen && !isCorrectAnswer ? colors.surface : colors.onTertiary }}>
                            {badge}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Explanation Box */}
              <View
                style={[
                  styles.explBox,
                  { backgroundColor: colors.surfaceContainerLow },
                ]}
              >
                <Text style={[styles.explTitle, { color: colors.primary }]}>{tr('Explanation', 'સમજૂતી')}</Text>
                <Text style={[styles.explContent, { color: colors.onSurface }]}>
                  {q.explanation}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Done Button */}
        <TouchableOpacity
          style={[styles.doneBtn, { backgroundColor: colors.primary }, MindSprintShadows.glow]}
          activeOpacity={0.85}
          onPress={onDone}
        >
          <Text style={[styles.doneBtnText, { color: colors.onPrimary }]}>{tr('Back to home', 'હોમ પર પાછા જાઓ')}</Text>
          <MaterialIcons name="home" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </ScrollView>

      {/* Verified Certificate Modal */}
      <Modal
        visible={showCertModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCertModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.certModalCard, { backgroundColor: '#ffffff' }, MindSprintShadows.glow]}>
            {/* Certificate Header Banner */}
            <View style={styles.certHeader}>
              <MaterialIcons name="verified" size={28} color="#F4A30B" />
              <Text style={styles.certBrand}>MINDSPRINT ACADEMY</Text>
              <Text style={styles.certMainTitle}>CERTIFICATE OF EXCELLENCE</Text>
              <Text style={styles.certSubText}>This is to officially certify that</Text>
            </View>

            {/* Recipient Name */}
            <Text style={styles.certStudentName}>{user?.name || 'Verified Scholar'}</Text>
            <View style={styles.certLine} />

            <Text style={styles.certBodyText}>
              has successfully cleared the <Text style={{ fontWeight: '800' }}>{examTitle}</Text> with an exceptional mastery score of:
            </Text>

            {/* Score Pill */}
            <View style={styles.certScoreBadge}>
              <Text style={styles.certScoreText}>{percentage}% SCORE</Text>
            </View>

            {/* Verification Footer */}
            <View style={styles.certFooterRow}>
              <View>
                <Text style={styles.certMetaLabel}>DATE ISSUED</Text>
                <Text style={styles.certMetaVal}>{todayDate}</Text>
              </View>
              <View style={styles.qrBox}>
                <MaterialIcons name="qr-code" size={44} color="#12245C" />
                <Text style={styles.qrSub}>{certId}</Text>
              </View>
            </View>

            {/* Modal Actions */}
            <View style={styles.certModalActionRow}>
              <TouchableOpacity
                style={[styles.certShareBtn, { backgroundColor: colors.primary }]}
                onPress={handleShareScorecard}
              >
                <MaterialIcons name="share" size={18} color="#ffffff" />
                <Text style={styles.certShareBtnText}>Share to LinkedIn / WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.certCloseBtn}
                onPress={() => setShowCertModal(false)}
              >
                <Text style={styles.certCloseBtnText}>{tr('Close', 'બંધ કરો')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  savedNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 12,
  },
  savedNoteText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  resultCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  diagnosticPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(47, 111, 214, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  diagnosticPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2F6FD6',
    letterSpacing: 0.5,
  },
  trophyCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  resultTitle: {
    fontFamily: MindSprintFonts.display,
    fontSize: 26,
    lineHeight: 34,
    textAlign: 'center',
    marginTop: 12,
  },
  resultSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 14,
  },
  scoreNumber: {
    fontFamily: MindSprintFonts.display,
    fontSize: 48,
    lineHeight: 56,
  },
  passBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  passText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 8,
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLbl: {
    fontSize: 11,
    marginTop: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    width: '100%',
  },
  certActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
  },
  certActionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  shareActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
  },
  shareActionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  solutionsHeading: {
    fontFamily: MindSprintFonts.heading,
    fontSize: 20,
    lineHeight: 26,
    marginTop: 24,
    marginBottom: 12,
  },
  explanationCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  questionMetaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  qIndexText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  explQuestionText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 4,
  },
  explBox: {
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
    gap: 4,
  },
  explTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  explContent: {
    fontSize: 12,
    lineHeight: 18,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 10,
  },
  doneBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  // Certificate Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  certModalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#F4A30B',
  },
  certHeader: {
    alignItems: 'center',
    gap: 4,
  },
  certBrand: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F4A30B',
    letterSpacing: 1,
  },
  certMainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#12245C',
    marginTop: 2,
  },
  certSubText: {
    fontSize: 12,
    color: '#5A6680',
    marginTop: 6,
  },
  certStudentName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1D3A8A',
    marginTop: 8,
    textAlign: 'center',
  },
  certLine: {
    height: 2,
    width: 140,
    backgroundColor: '#CDD6E4',
    marginVertical: 8,
  },
  certBodyText: {
    fontSize: 12,
    color: '#5A6680',
    textAlign: 'center',
    lineHeight: 18,
  },
  certScoreBadge: {
    backgroundColor: '#12805C',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginVertical: 12,
  },
  certScoreText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  certFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#DCE2EE',
    paddingTop: 12,
    marginTop: 6,
  },
  certMetaLabel: {
    fontSize: 10,
    color: '#9AA6C0',
    fontWeight: '700',
  },
  certMetaVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#12245C',
    marginTop: 2,
  },
  qrBox: {
    alignItems: 'center',
  },
  qrSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#5A6680',
  },
  certModalActionRow: {
    width: '100%',
    marginTop: 18,
    gap: 8,
  },
  certShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  certShareBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  certCloseBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  certCloseBtnText: {
    color: '#5A6680',
    fontSize: 13,
    fontWeight: '600',
  },
});
