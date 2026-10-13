import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Share,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Question } from '@/constants/mindsprintData';
import { WeakSpotAnalyzer } from '@/components/mindsprint/WeakSpotAnalyzer';
import { ConfettiEffect } from '@/components/mindsprint/ConfettiEffect';

interface ExamResultViewProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  bookmarkedQuestionIds: number[];
  isDiagnostic?: boolean;
  onToggleBookmark: (qId: number) => void;
  onDone: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  questions,
  userAnswers,
  bookmarkedQuestionIds,
  isDiagnostic = false,
  onToggleBookmark,
  onDone,
}) => {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const [showCertModal, setShowCertModal] = useState(false);

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
    ? 'AI Weak-Spot Diagnostic Exam'
    : user?.grade && user?.grade !== 'college'
    ? `Class ${user?.grade} (${user?.board || 'CBSE'}) Mock Assessment`
    : 'Quantitative & IT Placement Mock Test';

  const certId = 'MS-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const todayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const handleShareScorecard = async () => {
    try {
      const studentName = user?.name || 'A MindSprint Scholar';
      const shareMsg = `🎓 Proud Moment! I just scored ${percentage}% on the ${examTitle} on MindSprint! 🚀\n\n🎯 Score: ${correctCount}/${questions.length} Correct\n📜 Certificate ID: ${certId}\n\n#MindSprint #Education #LearningGoals #Exams`;
      await Share.share({
        message: shareMsg,
        title: 'MindSprint Academic Achievement',
      });
    } catch (err: any) {
      Alert.alert('Share Error', err.message);
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
              backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff',
              borderColor: isDiagnostic ? '#8b5cf6' : colors.outlineVariant,
              borderWidth: isDiagnostic ? 2 : 1,
            },
            MindSprintShadows.card,
          ]}
        >
          {isDiagnostic && (
            <View style={styles.diagnosticPill}>
              <MaterialIcons name="auto-awesome" size={14} color="#8b5cf6" />
              <Text style={styles.diagnosticPillText}>AI DIAGNOSTIC REPORT</Text>
            </View>
          )}

          <View
            style={[
              styles.trophyCircle,
              { backgroundColor: isPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' },
            ]}
          >
            <MaterialIcons
              name={isPassed ? 'emoji-events' : 'school'}
              size={36}
              color={isPassed ? '#10b981' : '#ef4444'}
            />
          </View>

          <Text style={[styles.resultTitle, { color: colors.onSurface }]}>
            {isPassed ? (percentage >= 80 ? 'Outstanding Mastery! 🌟' : 'Assessment Passed! 🎉') : 'Assessment Completed'}
          </Text>
          <Text style={[styles.resultSubtitle, { color: colors.onSurfaceVariant }]}>
            {examTitle}
          </Text>

          {/* Score & Pass Badge */}
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreNumber, { color: isPassed ? '#10b981' : colors.primary }]}>
              {percentage}%
            </Text>
            <View
              style={[
                styles.passBadge,
                { backgroundColor: isPassed ? '#10b981' : '#ef4444' },
              ]}
            >
              <Text style={styles.passText}>
                {isPassed ? 'PASSED & VERIFIED 🚀' : 'NEEDS PRACTICE 💪'}
              </Text>
            </View>
          </View>

          {/* 3-Col Stats Grid */}
          <View
            style={[
              styles.statsGrid,
              { borderTopColor: isDarkMode ? colors.outlineVariant : '#e5e7eb' },
            ]}
          >
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#10b981' }]}>{correctCount}</Text>
              <Text style={[styles.statLbl, { color: colors.outline }]}>Correct</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#ef4444' }]}>
                {questions.length - correctCount}
              </Text>
              <Text style={[styles.statLbl, { color: colors.outline }]}>Incorrect</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: colors.onSurface }]}>
                {Object.keys(userAnswers).length}
              </Text>
              <Text style={[styles.statLbl, { color: colors.outline }]}>Attempted</Text>
            </View>
          </View>

          {/* Certificate & Share Action Bar */}
          <View style={styles.actionButtonsRow}>
            {isCertificateEligible && (
              <TouchableOpacity
                style={[styles.certActionBtn, { backgroundColor: '#f59e0b' }, MindSprintShadows.glow]}
                activeOpacity={0.85}
                onPress={() => setShowCertModal(true)}
              >
                <MaterialIcons name="workspace-premium" size={18} color="#ffffff" />
                <Text style={styles.certActionBtnText}>View Certificate 🎖️</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.shareActionBtn, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
              onPress={handleShareScorecard}
            >
              <MaterialIcons name="share" size={18} color="#ffffff" />
              <Text style={styles.shareActionBtnText}>Share Scorecard</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Weak Spot Analyzer */}
        <WeakSpotAnalyzer questions={questions} userAnswers={userAnswers} />

        {/* Solutions & Explanations */}
        <Text style={[styles.solutionsHeading, { color: colors.onSurface }]}>
          Solutions & Detailed Explanations
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
                  backgroundColor: isDarkMode ? colors.surfaceContainerLowest : '#ffffff',
                  borderColor: isCorrect ? '#10b981' : userAns !== undefined ? '#ef4444' : colors.outlineVariant,
                },
                MindSprintShadows.card,
              ]}
            >
              <View style={styles.questionMetaHeader}>
                <Text style={[styles.qIndexText, { color: colors.outline }]}>
                  Question {idx + 1} • {q.category}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: isCorrect ? '#10b981' : '#ef4444' }]}>
                      {isCorrect ? 'Correct ✓' : userAns === undefined ? 'Skipped' : 'Incorrect ✗'}
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

                  let bg = isDarkMode ? colors.surfaceContainerLow : '#f8fafc';
                  let border = isDarkMode ? colors.outlineVariant : '#e2e8f0';
                  let textClr = colors.onSurface;
                  let badge = null;

                  if (isUserChosen && isCorrectAnswer) {
                    bg = 'rgba(16, 185, 129, 0.15)';
                    border = '#10b981';
                    textClr = '#065f46';
                    badge = 'Your Answer ✓';
                  } else if (isUserChosen && !isCorrectAnswer) {
                    bg = 'rgba(239, 68, 68, 0.15)';
                    border = '#ef4444';
                    textClr = '#991b1b';
                    badge = 'Your Choice ✗';
                  } else if (isCorrectAnswer) {
                    bg = 'rgba(16, 185, 129, 0.15)';
                    border = '#10b981';
                    textClr = '#065f46';
                    badge = 'Correct Answer ✓';
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
                            backgroundColor: isUserChosen && !isCorrectAnswer ? '#ef4444' : '#10b981',
                          }}
                        >
                          <Text style={{ fontSize: 10, fontWeight: '700', color: '#ffffff' }}>
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
                  { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f1f5f9' },
                ]}
              >
                <Text style={[styles.explTitle, { color: colors.primary }]}>Explanation:</Text>
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
          <Text style={styles.doneBtnText}>Back to Dashboard</Text>
          <MaterialIcons name="home" size={20} color="#ffffff" />
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
              <MaterialIcons name="verified" size={28} color="#f59e0b" />
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
                <MaterialIcons name="qr-code" size={44} color="#1e1b4b" />
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
                <Text style={styles.certCloseBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  diagnosticPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8b5cf6',
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
    fontSize: 22,
    fontWeight: '800',
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
    fontSize: 44,
    fontWeight: '900',
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
    fontSize: 17,
    fontWeight: '700',
    marginVertical: 14,
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
    borderColor: '#f59e0b',
  },
  certHeader: {
    alignItems: 'center',
    gap: 4,
  },
  certBrand: {
    fontSize: 11,
    fontWeight: '800',
    color: '#f59e0b',
    letterSpacing: 1,
  },
  certMainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e1b4b',
    marginTop: 2,
  },
  certSubText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
  },
  certStudentName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3525cd',
    marginTop: 8,
    textAlign: 'center',
  },
  certLine: {
    height: 2,
    width: 140,
    backgroundColor: '#cbd5e1',
    marginVertical: 8,
  },
  certBodyText: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
  certScoreBadge: {
    backgroundColor: '#10b981',
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
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginTop: 6,
  },
  certMetaLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
  },
  certMetaVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e1b4b',
    marginTop: 2,
  },
  qrBox: {
    alignItems: 'center',
  },
  qrSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
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
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
});
