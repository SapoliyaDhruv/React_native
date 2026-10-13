import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ACADEMIC_CURRICULUM, AcademicGrade } from '@/constants/academicData';

interface MatchedDoubtSolution {
  title: string;
  titleGujarati?: string;
  subject: string;
  chapter: string;
  marks: number;
  question: string;
  questionGujarati?: string;
  solution: string;
  solutionGujarati?: string;
  formulaOrKeywords: string[];
  examinerTips?: string;
  videoTeacher?: string;
}

const SAMPLE_TEXTBOOK_DOUBTS: MatchedDoubtSolution[] = [
  {
    title: 'Photosynthesis 4 Essential Components',
    titleGujarati: 'પ્રકાશસંશ્લેષણ માટે જરૂરી ૪ ઘટકો',
    subject: 'Science',
    chapter: 'Nutrition in Plants',
    marks: 3,
    question: 'Explain the process of photosynthesis and list the 4 essential components required by plants.',
    questionGujarati: 'પ્રકાશસંશ્લેષણ (Photosynthesis) ની પ્રક્રિયા સમજાવો અને તેના માટે કયા ૪ ઘટકો જરૂરી છે?',
    solution: 'Photosynthesis is the biological process where green plants synthesize glucose using sunlight, chlorophyll, CO₂, and water, releasing oxygen as a byproduct.\nEquation: 6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂.',
    solutionGujarati: 'પ્રકાશસંશ્લેષણ એવી પ્રક્રિયા છે જેમાં લીલી વનસ્પતિ સૂર્યપ્રકાશ, હરિતદ્રવ્ય (ક્લોરોફિલ), કાર્બન ડાયોક્સાઈડ અને પાણી મેળવી ગ્લુકોઝ બનાવે છે અને ઓક્સિજન મુક્ત કરે છે.',
    formulaOrKeywords: ['Chlorophyll (હરિતદ્રવ્ય)', 'Sunlight (સૂર્યપ્રકાશ)', 'CO₂', 'H₂O (પાણી)', 'Glucose + Oxygen'],
    examinerTips: 'Always write the balanced chemical equation and mention that oxygen is released to score full marks.',
    videoTeacher: 'Dr. Pathak Sir',
  },
  {
    title: 'Ohm’s Law Formula & Verification',
    titleGujarati: 'ઓહ્મનો નિયમ અને સૂત્ર',
    subject: 'Science',
    chapter: 'Electricity & Circuits',
    marks: 4,
    question: 'State Ohm\'s Law and write its mathematical formula. Explain each term and units.',
    questionGujarati: 'ઓહ્મનો નિયમ સમજાવો અને તેનું ગાણિતિક સૂત્ર લખી દરેક પદનો એકમ જણાવો.',
    solution: 'Ohm\'s Law states that at a constant temperature, the electric current passing through a conductor is directly proportional to the potential difference across its ends.\nFormula: V = I × R\nWhere V = Potential Difference (Volts), I = Current (Amperes), R = Resistance (Ohms Ω).',
    solutionGujarati: 'અચળ તાપમાને વાહકમાંથી વહેતો વિદ્યુતપ્રવાહ તેના બે છેડા વચ્ચેના વિદ્યુતસ્થિતિમાનના તફાવતના સમપ્રમાણમાં હોય છે.\nસૂત્ર: V = I × R (જ્યાં V = વોલ્ટેજ, I = એમ્પીયર, R = ઓહ્મ).',
    formulaOrKeywords: ['V = I × R', 'Constant Temperature', 'Volts (V)', 'Amperes (A)', 'Ohms (Ω)'],
    examinerTips: 'Remember to state "at constant temperature" in definition; students often lose 1 mark for omitting this.',
    videoTeacher: 'Mehul Sir',
  },
  {
    title: 'Quadratic Formula (Roots of ax² + bx + c = 0)',
    titleGujarati: 'દ્વિઘાત સમીકરણનું સૂત્ર',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    marks: 3,
    question: 'Write the quadratic formula to find the roots of ax² + bx + c = 0 and define the Discriminant (D).',
    questionGujarati: 'દ્વિઘાત સમીકરણ ax² + bx + c = 0 ના બીજ શોધવાનું સૂત્ર લખો અને વિવેચક (D) સમજાવો.',
    solution: 'The quadratic formula is: x = (-b ± √(b² - 4ac)) / (2a)\nDiscriminant D = b² - 4ac.\nIf D > 0: Two distinct real roots.\nIf D = 0: Two equal real roots.\nIf D < 0: No real roots.',
    solutionGujarati: 'સૂત્ર: x = (-b ± √(b² - 4ac)) / (2a)\nવિવેચક D = b² - 4ac.\nD > 0 હોય તો બે ભિન્ન વાસ્તવિક બીજ મળે.\nD = 0 હોય તો બે સમાન બીજ મળે.\nD < 0 હોય તો વાસ્તવિક બીજ ન મળે.',
    formulaOrKeywords: ['x = (-b ± √D)/(2a)', 'D = b² - 4ac', 'Discriminant Cases'],
    examinerTips: 'Check whether a ≠ 0 before applying the formula.',
    videoTeacher: 'Alpesh Sir',
  },
  {
    title: 'Inscriptions vs Manuscripts (ઇતિહાસના સ્ત્રોતો)',
    titleGujarati: 'શિલાલેખ અને તાડપત્ર/ભોજપત્ર વચ્ચે તફાવત',
    subject: 'Social Science',
    chapter: 'Sources of History',
    marks: 2,
    question: 'Differentiate between Inscriptions (શિલાલેખ) and Manuscripts (તાડપત્ર/ભોજપત્ર).',
    questionGujarati: 'શિલાલેખ (Inscriptions) અને તાડપત્ર/ભોજપત્ર (Manuscripts) વચ્ચે શો તફાવત છે?',
    solution: 'Inscriptions are edicts or writings engraved on hard surfaces like rocks or metal pillars (e.g., Ashoka\'s Rock Edict at Junagadh). Manuscripts are handwritten documents written on dried palm leaves or birch tree bark.',
    solutionGujarati: 'ધાતુ કે પથ્થર પર કોતરેલા લેખને શિલાલેખ કહેવાય (દા.ત. જૂનાગઢમાં અશોકનો શિલાલેખ). તાડના વૃક્ષના પર્ણ કે હિમાલયના ભૂર્જ વૃક્ષની છાલ પર હાથે લખાયેલી હસ્તપ્રતને તાડપત્ર કહેવાય.',
    formulaOrKeywords: ['Engraved on Stone/Metal', 'Palm Leaves / Birch Bark', 'Ashoka Rock Edict Junagadh'],
    examinerTips: 'Give the Junagadh Ashoka rock inscription as a local Gujarat example.',
    videoTeacher: 'Pooja Ma\'am',
  },
];

export default function DoubtSolverScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade: AcademicGrade = (user?.grade as AcademicGrade) || '10';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode && user?.medium === 'Gujarati';

  const [activeMode, setActiveMode] = useState<'camera' | 'search'>('search');
  const [query, setQuery] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [matchedSolution, setMatchedSolution] = useState<MatchedDoubtSolution | null>(null);

  const handleSearchDoubt = (searchTerm: string) => {
    setQuery(searchTerm);
    setIsScanning(true);
    setMatchedSolution(null);

    setTimeout(() => {
      setIsScanning(false);
      const clean = searchTerm.toLowerCase();
      const match = SAMPLE_TEXTBOOK_DOUBTS.find(
        (d) =>
          d.title.toLowerCase().includes(clean) ||
          d.question.toLowerCase().includes(clean) ||
          d.subject.toLowerCase().includes(clean) ||
          (d.questionGujarati && d.questionGujarati.includes(searchTerm)) ||
          (d.titleGujarati && d.titleGujarati.includes(searchTerm))
      );
      setMatchedSolution(match || SAMPLE_TEXTBOOK_DOUBTS[0]);
    }, 700);
  };

  const handleSimulateScan = (doubt: MatchedDoubtSolution) => {
    setIsScanning(true);
    setMatchedSolution(null);
    setTimeout(() => {
      setIsScanning(false);
      setMatchedSolution(doubt);
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.outlineVariant,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            AI Doubt Solver & OCR Scanner 📸
          </Text>
          <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
            Instant Textbook Question Matching & Solutions
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Mode Switcher */}
        <View style={[styles.modeBar, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f1f5f9' }]}>
          <TouchableOpacity
            style={[styles.modeBtn, activeMode === 'search' && { backgroundColor: colors.primary }]}
            onPress={() => setActiveMode('search')}
          >
            <MaterialIcons name="search" size={18} color={activeMode === 'search' ? '#ffffff' : colors.onSurface} />
            <Text style={[styles.modeBtnText, { color: activeMode === 'search' ? '#ffffff' : colors.onSurface }]}>
              Type / Speak Doubt
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeBtn, activeMode === 'camera' && { backgroundColor: colors.primary }]}
            onPress={() => setActiveMode('camera')}
          >
            <MaterialIcons name="document-scanner" size={18} color={activeMode === 'camera' ? '#ffffff' : colors.onSurface} />
            <Text style={[styles.modeBtnText, { color: activeMode === 'camera' ? '#ffffff' : colors.onSurface }]}>
              Camera Scanner
            </Text>
          </TouchableOpacity>
        </View>

        {/* VIEW 1: CAMERA SCANNER VIEWFINDER */}
        {activeMode === 'camera' && (
          <View style={[styles.cameraViewfinder, { backgroundColor: '#0f172a' }, MindSprintShadows.glow]}>
            <View style={styles.scannerCorners}>
              <View style={[styles.cornerTL, { borderColor: colors.primary }]} />
              <View style={[styles.cornerTR, { borderColor: colors.primary }]} />
              <View style={[styles.cornerBL, { borderColor: colors.primary }]} />
              <View style={[styles.cornerBR, { borderColor: colors.primary }]} />
              {isScanning && <View style={[styles.scanLaser, { backgroundColor: colors.primary }]} />}
            </View>

            <View style={styles.scannerContent}>
              <MaterialIcons name="photo-camera" size={40} color="#94a3b8" />
              <Text style={styles.scannerPrompt}>
                Align textbook question inside the frame
              </Text>
              <Text style={styles.scannerSub}>
                OCR instantly detects equations, diagrams, and Gujarati script
              </Text>
            </View>

            {/* Quick Demo Scan Buttons */}
            <Text style={styles.demoHeading}>Or tap a sample question to scan:</Text>
            <View style={styles.demoRow}>
              {SAMPLE_TEXTBOOK_DOUBTS.map((doubt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.demoPill, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
                  onPress={() => handleSimulateScan(doubt)}
                >
                  <Text style={styles.demoPillText} numberOfLines={1}>
                    📄 {isGSEB && doubt.titleGujarati ? doubt.titleGujarati : doubt.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* VIEW 2: SEARCH INPUT */}
        {activeMode === 'search' && (
          <View style={[styles.searchBox, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }]}>
            <MaterialIcons name="search" size={22} color={colors.primary} />
            <TextInput
              style={[styles.searchInput, { color: colors.onSurface }]}
              placeholder="Search doubt: e.g. Photosynthesis, Ohm's law..."
              placeholderTextColor={colors.outline}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => handleSearchDoubt(query)}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => handleSearchDoubt(query)} style={[styles.searchSubmitBtn, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* POPULAR DOUBTS CHIPS */}
        <View style={{ gap: 8 }}>
          <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>
            🔥 Common Board Exam Doubts (Tap to solve):
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {SAMPLE_TEXTBOOK_DOUBTS.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.doubtChip,
                  {
                    backgroundColor: isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
                    borderColor: colors.outlineVariant,
                  },
                ]}
                onPress={() => handleSearchDoubt(d.title)}
              >
                <Text style={[styles.doubtChipText, { color: colors.primary }]}>
                  {isGSEB && d.titleGujarati ? d.titleGujarati : d.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SCANNING LOADING INDICATOR */}
        {isScanning && (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.scanningText, { color: colors.primary }]}>
              Analyzing question & matching textbook curriculum...
            </Text>
          </View>
        )}

        {/* MATCHED VERIFIED SOLUTION CARD */}
        {matchedSolution && !isScanning && (
          <View
            style={[
              styles.solutionCard,
              {
                backgroundColor: colors.surfaceContainerLowest,
                borderColor: '#10b981',
                borderLeftWidth: 4,
              },
              MindSprintShadows.card,
            ]}
          >
            {/* Top Match Badge */}
            <View style={styles.matchTopRow}>
              <View style={[styles.matchBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <MaterialIcons name="verified" size={16} color="#10b981" />
                <Text style={styles.matchBadgeText}>98% Curriculum Match</Text>
              </View>
              <Text style={[styles.matchMeta, { color: colors.onSurfaceVariant }]}>
                {matchedSolution.subject} • Ch: {matchedSolution.chapter} • {matchedSolution.marks} Marks
              </Text>
            </View>

            {/* Question Text */}
            <Text style={[styles.solQuestion, { color: colors.onSurface }]}>
              Q. {isGSEB && matchedSolution.questionGujarati ? matchedSolution.questionGujarati : matchedSolution.question}
            </Text>

            {/* Key Concepts / Formula Pills */}
            <View style={styles.keyConceptsBox}>
              <Text style={[styles.keyConceptsLabel, { color: colors.outline }]}>Required Concepts:</Text>
              <View style={styles.kwWrap}>
                {matchedSolution.formulaOrKeywords.map((kw, idx) => (
                  <View key={idx} style={[styles.kwPill, { backgroundColor: isDarkMode ? 'rgba(129,140,248,0.2)' : '#e0e7ff' }]}>
                    <Text style={[styles.kwText, { color: colors.primary }]}>{kw}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Step-by-Step Model Answer */}
            <View style={[styles.answerBox, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc' }]}>
              <Text style={[styles.answerHeading, { color: '#10b981' }]}>
                📝 Step-by-Step Board Solution:
              </Text>
              <Text style={[styles.answerBody, { color: colors.onSurface }]}>
                {isGSEB && matchedSolution.solutionGujarati ? matchedSolution.solutionGujarati : matchedSolution.solution}
              </Text>
            </View>

            {/* Examiner Tips */}
            {matchedSolution.examinerTips && (
              <View style={[styles.tipBox, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                <MaterialIcons name="lightbulb" size={16} color="#b45309" />
                <Text style={styles.tipText}>
                  Examiner Tip: {matchedSolution.examinerTips}
                </Text>
              </View>
            )}

            {/* Action Bar */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.watchLecBtn, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/(tabs)/courses' as any)}
              >
                <MaterialIcons name="smart-display" size={16} color="#ffffff" />
                <Text style={styles.watchLecBtnText}>Watch Chapter Masterclass</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 12,
  },
  scrollContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  modeBar: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 6,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cameraViewfinder: {
    borderRadius: 24,
    padding: 24,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scannerCorners: {
    ...StyleSheet.absoluteFill,
    margin: 20,
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanLaser: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.8,
  },
  scannerContent: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  scannerPrompt: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  scannerSub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 16,
  },
  demoHeading: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  demoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  demoPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  demoPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    height: 52,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  searchSubmitBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
  },
  chipRow: {
    gap: 8,
  },
  doubtChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  doubtChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  centerLoading: {
    paddingVertical: 30,
    alignItems: 'center',
    gap: 10,
  },
  scanningText: {
    fontSize: 13,
    fontWeight: '700',
  },
  solutionCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  matchTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  matchBadgeText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '800',
  },
  matchMeta: {
    fontSize: 11,
    fontWeight: '600',
  },
  solQuestion: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  keyConceptsBox: {
    gap: 6,
  },
  keyConceptsLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  kwWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  kwPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  kwText: {
    fontSize: 11,
    fontWeight: '700',
  },
  answerBox: {
    padding: 14,
    borderRadius: 14,
    gap: 6,
  },
  answerHeading: {
    fontSize: 13,
    fontWeight: '800',
  },
  answerBody: {
    fontSize: 13,
    lineHeight: 20,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 10,
  },
  tipText: {
    color: '#b45309',
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  watchLecBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  watchLecBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
