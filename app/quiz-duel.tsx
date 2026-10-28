import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Alert,
  TextInput,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/services/api';
import { Question } from '@/constants/mindsprintData';
import { AcademicGrade } from '@/constants/academicData';
import { MistakeStorage } from '@/services/mistakeStorage';

type DuelPhase = 'select_subject' | 'matching' | 'duel' | 'finished';

interface SubjectOption {
  id: string;
  name: string;
  nameGujarati?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  subtitle: string;
  subtitleGujarati?: string;
}

const SCHOOL_SUBJECT_OPTIONS: SubjectOption[] = [
  {
    id: 'All',
    name: 'All Subjects Mixed',
    nameGujarati: 'સર્વ વિષયો (મિશ્ર લડાઈ)',
    icon: 'shuffle',
    color: '#6366f1',
    subtitle: 'Fast 5-question blitz across all subjects',
    subtitleGujarati: 'બધા વિષયોમાંથી રેન્ડમ ૫ ઝડપી પ્રશ્નો',
  },
  {
    id: 'Mathematics',
    name: 'Mathematics',
    nameGujarati: 'ગણિત',
    icon: 'calculate',
    color: '#3b82f6',
    subtitle: 'Numbers, fractions, integers & geometry',
    subtitleGujarati: 'સંખ્યાઓ, અપૂર્ણાંક, પૂર્ણાંકો & ભૂમિતિ',
  },
  {
    id: 'Science',
    name: 'Science & Experiments',
    nameGujarati: 'વિજ્ઞાન અને પ્રયોગો',
    icon: 'biotech',
    color: '#10b981',
    subtitle: 'Food, circuits, living organisms & matter',
    subtitleGujarati: 'પ્રકાશ, પરિપથ, વનસ્પતિ & સજીવો',
  },
  {
    id: 'Social Science',
    name: 'Social Science',
    nameGujarati: 'સામાજિક વિજ્ઞાન',
    icon: 'public',
    color: '#f59e0b',
    subtitle: 'History, civilizations, maps & Earth',
    subtitleGujarati: 'ઇતિહાસ, હડપ્પીય સભ્યતા & પૃથ્વી',
  },
  {
    id: 'English',
    name: 'English & Grammar',
    nameGujarati: 'અંગ્રેજી વ્યાકરણ',
    icon: 'menu-book',
    color: '#ec4899',
    subtitle: 'Grammar rules, tenses & vocabulary',
    subtitleGujarati: 'વ્યાકરણ, કાળ અને શબ્દભંડોળ',
  },
];

const COLLEGE_SUBJECT_OPTIONS: SubjectOption[] = [
  {
    id: 'All',
    name: 'All Topics Mixed',
    icon: 'shuffle',
    color: '#6366f1',
    subtitle: 'Quant, DSA & Web fundamentals',
  },
  {
    id: 'Quantitative Aptitude',
    name: 'Quantitative Aptitude',
    icon: 'calculate',
    color: '#f59e0b',
    subtitle: 'Arithmetic, speed math & time-distance',
  },
  {
    id: 'Data Structures & Algorithms',
    name: 'Data Structures & Algorithms',
    icon: 'code',
    color: '#a78bfa',
    subtitle: 'Arrays, Trees, Stacks & Complexity',
  },
  {
    id: 'React & JavaScript',
    name: 'React & JavaScript',
    icon: 'language',
    color: '#38bdf8',
    subtitle: 'Hooks, Async/Await, ES6 & Event Loop',
  },
];

const PEER_OPPONENTS = [
  { name: 'Aarav Patel', avatar: '🧑‍🎓', schoolSchool: 'DPS Ahmedabad', college: 'LDCE Ahmedabad' },
  { name: 'Priya Sharma', avatar: '👩‍🎓', schoolSchool: 'Gyanmanjari Vidyapith', college: 'VGEC Chandkheda' },
  { name: 'Rohan Mehta', avatar: '👨‍🎓', schoolSchool: 'St. Xavier High School', college: 'DA-IICT Gandhinagar' },
  { name: 'Ananya Desai', avatar: '👩‍🔬', schoolSchool: 'Shreyas Foundation', college: 'Nirma University' },
  { name: 'Devendra Shah', avatar: '🧑‍💻', schoolSchool: 'Utkarsh Vidyalaya', college: 'BVM Anand' },
];

export default function QuizDuelScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade: AcademicGrade = (user?.grade as AcademicGrade) || 'college';
  const isSchoolMode = userGrade !== 'college';
  const isGSEB = isSchoolMode && user?.medium === 'Gujarati';

  const subjectOptions = isSchoolMode ? SCHOOL_SUBJECT_OPTIONS : COLLEGE_SUBJECT_OPTIONS;

  const [phase, setPhase] = useState<DuelPhase>('select_subject');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('All');
  const [opponent, setOpponent] = useState(PEER_OPPONENTS[0]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(12);
  const [myScore, setMyScore] = useState<number>(0);
  const [oppScore, setOppScore] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isRoundAnswered, setIsRoundAnswered] = useState<boolean>(false);
  const [earnedXp, setEarnedXp] = useState<number>(0);
  const [totalUserXp, setTotalUserXp] = useState<number>(0);
  const [roomMode, setRoomMode] = useState<'random' | 'create_room' | 'join_room'>('random');
  const [createdRoomCode, setCreatedRoomCode] = useState<string>('');
  const [inputRoomCode, setInputRoomCode] = useState<string>('');
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(null);
  const [playerRole, setPlayerRole] = useState<'host' | 'guest' | 'solo'>('solo');
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState<boolean>(false);
  const [isMultiplayer, setIsMultiplayer] = useState<boolean>(false);
  const [myCorrectCount, setMyCorrectCount] = useState<number>(0);
  const [userAnswersRecord, setUserAnswersRecord] = useState<Record<number, number>>({});

  const radarSpin = useRef(new Animated.Value(0)).current;
  const roomPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const xpStorageKey = `@mindsprint_duel_xp_${userGrade}_${user?.email || 'guest'}`;

  // Cleanup room polling on unmount
  useEffect(() => {
    return () => {
      if (roomPollRef.current) clearInterval(roomPollRef.current);
    };
  }, []);

  // Load saved XP
  useEffect(() => {
    async function loadXp() {
      try {
        const raw = await AsyncStorage.getItem(xpStorageKey);
        if (raw) setTotalUserXp(parseInt(raw, 10));
      } catch (_) {}
    }
    loadXp();
  }, [xpStorageKey]);

  // Radar Animation Loop
  useEffect(() => {
    if (phase === 'matching') {
      radarSpin.setValue(0);
      Animated.loop(
        Animated.timing(radarSpin, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [phase, radarSpin]);

  // Create real multiplayer duel room on backend
  const handleCreateRoom = async (subjectId: string = selectedSubjectId) => {
    setIsCreatingRoom(true);
    setSelectedSubjectId(subjectId);
    if (roomPollRef.current) clearInterval(roomPollRef.current);

    try {
      const resp = await ApiService.createDuelRoom({
        host: {
          name: user?.name || 'You',
          email: user?.email || '',
          avatar: '🧑‍🎓',
          schoolOrCollege: isSchoolMode ? 'Gujarat Board School' : 'Campus Engineering',
        },
        grade: userGrade,
        subject: subjectId,
      });

      if (resp && resp.success && resp.roomCode) {
        setCreatedRoomCode(resp.roomCode);
        setActiveRoomCode(resp.roomCode);
        setPlayerRole('host');
        setIsMultiplayer(true);
        if (resp.room && resp.room.questions && resp.room.questions.length > 0) {
          setQuestions(resp.room.questions);
        }

        // Start polling room state until guest joins
        roomPollRef.current = setInterval(async () => {
          const roomCheck = await ApiService.getDuelRoom(resp.roomCode);
          if (roomCheck && roomCheck.success && roomCheck.room && roomCheck.room.guest) {
            if (roomPollRef.current) clearInterval(roomPollRef.current);
            setOpponent({
              name: roomCheck.room.guest.name,
              avatar: roomCheck.room.guest.avatar || '👩‍🎓',
              schoolSchool: roomCheck.room.guest.schoolOrCollege,
              college: roomCheck.room.guest.schoolOrCollege,
            });
            setPhase('matching');
            setTimeout(() => {
              setPhase('duel');
              setCurrentQIndex(0);
              setMyScore(0);
              setOppScore(0);
              setMyCorrectCount(0);
              setSelectedOpt(null);
              setIsRoundAnswered(false);
              setTimerSeconds(12);
            }, 1200);
          }
        }, 1500);
      } else {
        const localCode = Math.floor(1000 + Math.random() * 9000).toString();
        setCreatedRoomCode(localCode);
        setActiveRoomCode(localCode);
      }
    } catch (e) {
      const localCode = Math.floor(1000 + Math.random() * 9000).toString();
      setCreatedRoomCode(localCode);
      setActiveRoomCode(localCode);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  // Join existing multiplayer duel room via 4-digit PIN
  const handleJoinRoom = async () => {
    if (inputRoomCode.length !== 4) return;
    setIsJoiningRoom(true);

    try {
      const resp = await ApiService.joinDuelRoom({
        roomCode: inputRoomCode,
        guest: {
          name: user?.name || 'Classmate',
          email: user?.email || '',
          avatar: '👩‍🎓',
          schoolOrCollege: isSchoolMode ? 'Gujarat Board School' : 'Campus Engineering',
        },
      });

      if (resp && resp.success && resp.room) {
        setActiveRoomCode(inputRoomCode);
        setPlayerRole('guest');
        setIsMultiplayer(true);
        setOpponent({
          name: resp.room.host.name,
          avatar: resp.room.host.avatar || '🧑‍🎓',
          schoolSchool: resp.room.host.schoolOrCollege,
          college: resp.room.host.schoolOrCollege,
        });
        if (resp.room.questions && resp.room.questions.length > 0) {
          setQuestions(resp.room.questions);
        }
        setPhase('matching');
        setTimeout(() => {
          setPhase('duel');
          setCurrentQIndex(0);
          setMyScore(0);
          setOppScore(0);
          setMyCorrectCount(0);
          setSelectedOpt(null);
          setIsRoundAnswered(false);
          setTimerSeconds(12);
        }, 1500);
      } else {
        Alert.alert('Cannot Join Room', resp?.error || 'Room code not found or already expired. Please check with your classmate.');
      }
    } catch (e) {
      Alert.alert('Connection Error', 'Could not connect to duel server. Please try again.');
    } finally {
      setIsJoiningRoom(false);
    }
  };

  const startMatchmaking = async (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setPhase('matching');
    if (roomPollRef.current) clearInterval(roomPollRef.current);

    try {
      const resp = await ApiService.getRandomDuelMatch({
        grade: userGrade,
        subject: subjectId,
        email: user?.email,
        name: user?.name,
      });

      if (resp && resp.success) {
        if (resp.isMultiplayerRoom && resp.roomCode) {
          setActiveRoomCode(resp.roomCode);
          setPlayerRole('guest');
          setIsMultiplayer(true);
        } else {
          setActiveRoomCode(null);
          setPlayerRole('solo');
          setIsMultiplayer(false);
        }

        if (resp.opponent) {
          setOpponent({
            name: resp.opponent.name,
            avatar: resp.opponent.avatar || '👩‍🎓',
            schoolSchool: resp.opponent.schoolSchool || resp.opponent.schoolOrCollege || 'Gujarat Board School',
            college: resp.opponent.college || resp.opponent.schoolOrCollege || 'Engineering Campus',
          });
        }

        if (resp.questions && resp.questions.length > 0) {
          setQuestions(resp.questions);
        }
      } else {
        // Fallback to randomized cohort peer & localized questions
        const randomOpp = PEER_OPPONENTS[Math.floor(Math.random() * PEER_OPPONENTS.length)];
        setOpponent(randomOpp);
        const categoryParam = subjectId === 'All' ? undefined : subjectId;
        const fetched = await ApiService.getQuestions(categoryParam, user?.email, 5, undefined, userGrade);
        if (fetched && fetched.length > 0) {
          setQuestions(fetched.slice(0, 5));
        } else {
          setQuestions(
            isSchoolMode
              ? [
                  {
                    id: 101,
                    questionText: 'ત્રિકોણના ત્રણેય ખૂણાઓનો સરવાળો કેટલો થાય છે?',
                    questionTextGujarati: 'ત્રિકોણના ત્રણેય ખૂણાઓનો સરવાળો કેટલો થાય છે?',
                    category: 'ગણિત',
                    categoryGujarati: 'ગણિત',
                    options: ['90°', '180°', '270°', '360°'],
                    optionsGujarati: ['90°', '180°', '270°', '360°'],
                    correctAnswer: 1,
                    explanation: 'ત્રિકોણના અંદરના ત્રણેય ખૂણાઓનો સરવાળો હંમેશાં 180° થાય છે.',
                  },
                  {
                    id: 102,
                    questionText: 'વનસ્પતિમાં પ્રકાશસંશ્લેષણ માટે સૂર્યપ્રકાશ શોષતું લીલું રંજકદ્રવ્ય કયું છે?',
                    questionTextGujarati: 'વનસ્પતિમાં પ્રકાશસંશ્લેષણ માટે સૂર્યપ્રકાશ શોષતું લીલું રંજકદ્રવ્ય કયું છે?',
                    category: 'વિજ્ઞાન',
                    categoryGujarati: 'વિજ્ઞાન',
                    options: ['ક્લોરોફિલ (હરિદ્રવ્ય)', 'હિમોગ્લોબિન', 'કેરોટીન', 'એન્થોસાયનિન'],
                    optionsGujarati: ['ક્લોરોફિલ (હરિદ્રવ્ય)', 'હિમોગ્લોબિન', 'કેરોટીન', 'એન્થોસાયનિન'],
                    correctAnswer: 0,
                    explanation: 'ક્લોરોફિલ (હરિદ્રવ્ય) સૂર્યપ્રકાશ શોષીને ખોરાક બનાવવામાં મદદ કરે છે.',
                  },
                  {
                    id: 103,
                    questionText: 'વિશાળ જાહેર સ્નાનાગાર સિંધુ સંસ્કૃતિના કયા પ્રાચીન નગરમાંથી મળી આવ્યું હતું?',
                    questionTextGujarati: 'વિશાળ જાહેર સ્નાનાગાર સિંધુ સંસ્કૃતિના કયા પ્રાચીન નગરમાંથી મળી આવ્યું હતું?',
                    category: 'સામાજિક વિજ્ઞાન',
                    categoryGujarati: 'સામાજિક વિજ્ઞાન',
                    options: ['ઇજિપ્ત', 'મોહેં-જો-દડો (હડપ્પા)', 'મેસોપોટેમિયા', 'રોમ'],
                    optionsGujarati: ['ઇજિપ્ત', 'મોહેં-જો-દડો (હડપ્પા)', 'મેસોપોટેમિયા', 'રોમ'],
                    correctAnswer: 1,
                    explanation: 'મોહેં-જો-દડો ખાતેથી વિશાળ જાહેર સ્નાનાગારના અવશેષો મળી આવ્યા હતા.',
                  },
                  {
                    id: 104,
                    questionText: 'કિંમત શોધો: (-12) + (-8) = ?',
                    questionTextGujarati: 'કિંમત શોધો: (-12) + (-8) = ?',
                    category: 'ગણિત',
                    categoryGujarati: 'ગણિત',
                    options: ['-4', '+20', '-20', '+4'],
                    optionsGujarati: ['-4', '+20', '-20', '+4'],
                    correctAnswer: 2,
                    explanation: '(-12) + (-8) = -20.',
                  },
                  {
                    id: 105,
                    questionText: 'બલ્બ પ્રકાશિત કરવા માટે સતત વિદ્યુત પ્રવાહ વહેવા દેતો પરિપથ કયો છે?',
                    questionTextGujarati: 'બલ્બ પ્રકાશિત કરવા માટે સતત વિદ્યુત પ્રવાહ વહેવા દેતો પરિપથ કયો છે?',
                    category: 'વિજ્ઞાન',
                    categoryGujarati: 'વિજ્ઞાન',
                    options: ['ખુલ્લો પરિપથ', 'બંધ પરિપથ', 'શોર્ટ સર્કિટ', 'તૂટેલો પરિપથ'],
                    optionsGujarati: ['ખુલ્લો પરિપથ', 'બંધ પરિપથ', 'શોર્ટ સર્કિટ', 'તૂટેલો પરિપથ'],
                    correctAnswer: 1,
                    explanation: 'બંધ પરિપથ વિદ્યુત પ્રવાહના વહન માટે અવિરત માર્ગ પૂરો પાડે છે.',
                  },
                ]
              : [
                  {
                    id: 101,
                    questionText: 'What is the sum of angles in a triangle?',
                    category: 'Mathematics',
                    options: ['90°', '180°', '270°', '360°'],
                    correctAnswer: 1,
                    explanation: 'The interior angles of a triangle always sum to 180°.',
                  },
                  {
                    id: 102,
                    questionText: 'Which green pigment in plants traps sunlight for photosynthesis?',
                    category: 'Science',
                    options: ['Chlorophyll', 'Hemoglobin', 'Carotene', 'Anthocyanin'],
                    correctAnswer: 0,
                    explanation: 'Chlorophyll traps sunlight for photosynthesis.',
                  },
                  {
                    id: 103,
                    questionText: 'Which ancient civilization built the Great Bath at Mohenjo-daro?',
                    category: 'Social Science',
                    options: ['Egyptian', 'Indus Valley (Harappan)', 'Mesopotamian', 'Roman'],
                    correctAnswer: 1,
                    explanation: 'The Indus Valley Civilization built the Great Bath.',
                  },
                  {
                    id: 104,
                    questionText: 'Evaluate: (-12) + (-8) = ?',
                    category: 'Mathematics',
                    options: ['-4', '+20', '-20', '+4'],
                    correctAnswer: 2,
                    explanation: '(-12) + (-8) = -20.',
                  },
                  {
                    id: 105,
                    questionText: 'What type of electric circuit allows continuous current flow to light a bulb?',
                    category: 'Science',
                    options: ['Open circuit', 'Closed circuit', 'Short circuit', 'Broken circuit'],
                    correctAnswer: 1,
                    explanation: 'A closed circuit provides an unbroken path.',
                  },
                ]
          );
        }
      }
    } catch (e) {
      console.warn('Duel question load note:', e);
      const randomOpp = PEER_OPPONENTS[Math.floor(Math.random() * PEER_OPPONENTS.length)];
      setOpponent(randomOpp);
    } finally {
      setTimeout(() => {
        setPhase('duel');
        setCurrentQIndex(0);
        setMyScore(0);
        setOppScore(0);
        setMyCorrectCount(0);
        setUserAnswersRecord({});
        setSelectedOpt(null);
        setIsRoundAnswered(false);
        setTimerSeconds(12);
      }, 2000);
    }
  };

  const currentQ = questions[currentQIndex] || questions[0];

  const handleNextRound = useCallback(async () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOpt(null);
      setIsRoundAnswered(false);
      setTimerSeconds(12);
    } else {
      // Duel finished -> calculate reward
      setPhase('finished');
      let xp = 30; // base participation
      if (myScore > oppScore) {
        xp = 150; // victory bonus
      } else if (myScore === oppScore) {
        xp = 75; // tie bonus
      }
      setEarnedXp(xp);

      const newTotal = totalUserXp + xp;
      setTotalUserXp(newTotal);
      try {
        await AsyncStorage.setItem(xpStorageKey, newTotal.toString());
      } catch (_) {}

      // Submit exam result to backend for leaderboard standings and recent activity
      ApiService.submitExamResult({
        userEmail: user?.email || 'guest@mindsprint.edu',
        scorePercentage: Math.min(100, Math.round((myScore / 450) * 100)),
        correctCount: myCorrectCount,
        totalQuestions: questions.length || 5,
        userAnswers: userAnswersRecord,
        weakCategories: [],
        grade: userGrade,
        category: `1v1 Quiz Duel (${selectedSubjectId})`,
      }).catch(() => {});
    }
  }, [currentQIndex, questions.length, myScore, oppScore, totalUserXp, xpStorageKey, user?.email, myCorrectCount, userAnswersRecord, userGrade, selectedSubjectId]);

  // Round countdown timer
  useEffect(() => {
    if (phase !== 'duel' || isRoundAnswered) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRoundAnswered(true);
          setTimeout(() => {
            handleNextRound();
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isRoundAnswered, handleNextRound]);

  const handleAnswer = async (index: number) => {
    if (isRoundAnswered || !currentQ) return;

    setSelectedOpt(index);
    setIsRoundAnswered(true);

    const isCorrect = index === currentQ.correctAnswer;
    const pointsEarned = isCorrect ? Math.max(30, 40 + timerSeconds * 5) : 0;
    setMyScore((prev) => prev + pointsEarned);
    if (isCorrect) {
      setMyCorrectCount((prev) => prev + 1);
    }
    setUserAnswersRecord((prev) => ({ ...prev, [currentQIndex]: index }));

    if (!isCorrect && currentQ) {
      MistakeStorage.addMistake({
        questionText: currentQ.questionText,
        questionTextGujarati: (currentQ as any).questionTextGujarati,
        options: currentQ.options,
        selectedAnswer: index,
        correctAnswer: currentQ.correctAnswer,
        correctAnswerText: currentQ.options?.[currentQ.correctAnswer],
        explanation: currentQ.explanation || 'Review chapter concepts for this question.',
        explanationGujarati: (currentQ as any).explanationGujarati,
        subject: selectedSubjectId === 'All' ? 'Curriculum' : selectedSubjectId,
        grade: userGrade,
      }, user?.email || 'guest', userGrade).catch(() => {});
    }

    // Sync score with backend if in active multiplayer room
    if (isMultiplayer && activeRoomCode) {
      try {
        const scoreSync = await ApiService.updateDuelScore({
          roomCode: activeRoomCode,
          role: playerRole === 'host' ? 'host' : 'guest',
          pointsEarned,
          roundIndex: currentQIndex,
        });
        if (scoreSync && scoreSync.success && typeof scoreSync.opponentScore === 'number') {
          setOppScore(scoreSync.opponentScore);
        }
      } catch (err) {
        console.warn('Multiplayer score sync note:', err);
      }
    } else {
      // Dynamic realistic peer simulation (Practice Bot Mode)
      const oppIsCorrect = Math.random() < 0.75;
      const oppPoints = oppIsCorrect ? Math.floor(Math.random() * 25) + 40 : 0;
      setOppScore((prev) => prev + oppPoints);
    }

    setTimeout(() => {
      handleNextRound();
    }, 1600);
  };

  const handleRematch = () => {
    startMatchmaking(selectedSubjectId);
  };

  const spinInterpolate = radarSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.outlineVariant,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            if (phase === 'duel') {
              Alert.alert(
                'Quit Active Duel?',
                'Leaving now will forfeit this match.',
                [
                  { text: 'Resume', style: 'cancel' },
                  { text: 'Quit Match', style: 'destructive', onPress: () => router.back() },
                ]
              );
            } else {
              router.back();
            }
          }}
          style={styles.backBtn}
        >
          <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            1v1 Speed Quiz Duel ⚔️
          </Text>
          <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
            {isSchoolMode
              ? `Class ${userGrade} • Live Peer Battle`
              : 'Placement Aptitude Speed Battle'}
          </Text>
        </View>

        {/* XP Badge Pill */}
        <View style={[styles.xpPill, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
          <MaterialIcons name="local-fire-department" size={16} color="#f59e0b" />
          <Text style={styles.xpPillText}>{totalUserXp} XP</Text>
        </View>
      </View>

      {/* PHASE 1: PRE-DUEL SUBJECT SELECTION */}
      {phase === 'select_subject' && (
        <ScrollView contentContainerStyle={styles.selectionScroll} showsVerticalScrollIndicator={false}>
          {/* Banner */}
          <View style={[styles.heroCard, { backgroundColor: '#1e1b4b' }, MindSprintShadows.glow]}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                LIVE 1v1 PEER ARENA ⚔️
              </Text>
            </View>
            <Text style={styles.heroTitle}>
              Choose Your Battle Subject & Beat the Clock!
            </Text>
            <Text style={styles.heroSub}>
              5 fast questions, 12 seconds per question. Highest score wins bonus leaderboard XP!
            </Text>
          </View>

          {/* Duel Mode Selector: Quick Match vs Create Room vs Join Room */}
          <View style={[styles.modeTabsRow, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f1f5f9' }]}>
            <TouchableOpacity
              style={[styles.modeTabBtn, roomMode === 'random' && { backgroundColor: colors.primary }]}
              onPress={() => setRoomMode('random')}
            >
              <Text style={[styles.modeTabBtnText, { color: roomMode === 'random' ? '#ffffff' : colors.onSurface }]}>
                ⚡ Random Peer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTabBtn, roomMode === 'create_room' && { backgroundColor: colors.primary }]}
              onPress={() => {
                setRoomMode('create_room');
                if (!createdRoomCode) {
                  handleCreateRoom(selectedSubjectId);
                }
              }}
            >
              <Text style={[styles.modeTabBtnText, { color: roomMode === 'create_room' ? '#ffffff' : colors.onSurface }]}>
                👥 Create Room
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTabBtn, roomMode === 'join_room' && { backgroundColor: colors.primary }]}
              onPress={() => setRoomMode('join_room')}
            >
              <Text style={[styles.modeTabBtnText, { color: roomMode === 'join_room' ? '#ffffff' : colors.onSurface }]}>
                🔑 Join Room
              </Text>
            </TouchableOpacity>
          </View>

          {/* CREATE ROOM CARD */}
          {roomMode === 'create_room' && (
            <View style={[styles.roomCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.primary }, MindSprintShadows.card]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={[styles.roomLabel, { color: colors.onSurface }]}>Your Private Duel Room Code:</Text>
                  <Text style={[styles.roomSub, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
                    {isCreatingRoom
                      ? 'Generating live room...'
                      : '🟢 Live Room Active • Waiting for classmate...'}
                  </Text>
                </View>
                <View style={[styles.codeBadge, { backgroundColor: colors.primary }]}>
                  {isCreatingRoom ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.codeText}>{createdRoomCode || '...'}</Text>
                  )}
                </View>
              </View>

              <Text style={[styles.roomSub, { color: colors.onSurfaceVariant, marginTop: 8 }]}>
                Share this 4-digit PIN with your classmate to compete live on the same 5 questions!
              </Text>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                <TouchableOpacity
                  style={[styles.waShareBtn, { backgroundColor: '#25D366', flex: 1 }]}
                  disabled={!createdRoomCode}
                  onPress={() => {
                    const msg = `⚔️ Hey! Join my Class ${userGrade} Quiz Duel on MindSprint!\n🔑 Room PIN: *${createdRoomCode}*\nEnter this PIN in the Quiz Duel screen to play live! 🚀`;
                    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(msg)}`).catch(() => {
                      Linking.openURL(`https://wa.me/?text=${encodeURIComponent(msg)}`);
                    });
                  }}
                >
                  <MaterialIcons name="share" size={16} color="#ffffff" />
                  <Text style={styles.waShareBtnText}>Share PIN on WhatsApp 💬</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.waShareBtn, { backgroundColor: isDarkMode ? colors.surfaceContainerHigh : '#f1f5f9', borderWidth: 1, borderColor: colors.outlineVariant }]}
                  onPress={() => startMatchmaking(selectedSubjectId)}
                >
                  <Text style={[styles.waShareBtnText, { color: colors.onSurface }]}>Play vs Bot 🤖</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* JOIN ROOM CARD */}
          {roomMode === 'join_room' && (
            <View style={[styles.roomCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }, MindSprintShadows.card]}>
              <Text style={[styles.roomLabel, { color: colors.onSurface }]}>Enter Classmate's 4-Digit Room Code:</Text>
              <View style={styles.joinInputRow}>
                <TextInput
                  style={[styles.pinInput, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f8fafc', color: colors.onSurface, borderColor: colors.outlineVariant }]}
                  placeholder="e.g. 8421"
                  placeholderTextColor={colors.outline}
                  keyboardType="number-pad"
                  maxLength={4}
                  value={inputRoomCode}
                  onChangeText={setInputRoomCode}
                />
                <TouchableOpacity
                  style={[styles.joinBtn, { backgroundColor: colors.primary, opacity: inputRoomCode.length === 4 && !isJoiningRoom ? 1 : 0.5 }]}
                  disabled={inputRoomCode.length !== 4 || isJoiningRoom}
                  onPress={handleJoinRoom}
                >
                  {isJoiningRoom ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.joinBtnText}>Join Battle ⚔️</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>
            Select Battle Subject:
          </Text>

          <View style={styles.subjectsGrid}>
            {subjectOptions.map((sub) => {
              const displayName = isGSEB && sub.nameGujarati ? sub.nameGujarati : sub.name;
              const displaySub = isGSEB && sub.subtitleGujarati ? sub.subtitleGujarati : sub.subtitle;

              return (
                <TouchableOpacity
                  key={sub.id}
                  activeOpacity={0.85}
                  style={[
                    styles.subjectCard,
                    {
                      backgroundColor: colors.surfaceContainerLowest,
                      borderColor: colors.outlineVariant,
                      borderLeftColor: sub.color,
                    },
                    MindSprintShadows.card,
                  ]}
                  onPress={() => startMatchmaking(sub.id)}
                >
                  <View style={[styles.subjectIconBox, { backgroundColor: sub.color + '20' }]}>
                    <MaterialIcons name={sub.icon} size={24} color={sub.color} />
                  </View>

                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[styles.subjectName, { color: colors.onSurface }]}>
                      {displayName}
                    </Text>
                    <Text style={[styles.subjectDesc, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                      {displaySub}
                    </Text>
                  </View>

                  <MaterialIcons name="chevron-right" size={22} color={sub.color} />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* PHASE 2: MATCHMAKING RADAR */}
      {phase === 'matching' && (
        <View style={styles.matchmakingCenter}>
          <View style={[styles.radarOuterCircle, { borderColor: isDarkMode ? 'rgba(99, 102, 241, 0.3)' : '#c7d2fe' }]}>
            <Animated.View
              style={[
                styles.radarScanner,
                {
                  transform: [{ rotate: spinInterpolate }],
                },
              ]}
            >
              <View style={[styles.radarBlip, { backgroundColor: colors.primary }]} />
            </Animated.View>
            <MaterialIcons name="sports-kabaddi" size={44} color={colors.primary} />
          </View>

          <Text style={[styles.matchingTitle, { color: colors.onSurface }]}>
            Finding an Active Classmate...
          </Text>
          <Text style={[styles.matchingSub, { color: colors.onSurfaceVariant }]}>
            {isSchoolMode
              ? `Matching you with a student in Class ${userGrade}`
              : 'Connecting with an active candidate in your placement pool'}
          </Text>

          <View style={[styles.matchedPeerPreview, { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }]}>
            <Text style={styles.matchedAvatar}>{opponent.avatar}</Text>
            <View>
              <Text style={[styles.matchedName, { color: colors.onSurface }]}>{opponent.name}</Text>
              <Text style={[styles.matchedSchool, { color: colors.onSurfaceVariant }]}>
                {isSchoolMode ? opponent.schoolSchool : opponent.college}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* PHASE 3: LIVE DUEL QUESTION ARENA */}
      {phase === 'duel' && (
        <View style={styles.arenaContainer}>
          {/* Live Head-to-Head Scoreboard Bar */}
          <View style={[styles.scoreboardCard, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#1e1b4b' }, MindSprintShadows.card]}>
            <View style={styles.playerCol}>
              <Text style={styles.sbName}>🧑‍🎓 You</Text>
              <Text style={styles.sbPoints}>{myScore} pts</Text>
            </View>

            {/* Countdown Timer Bubble */}
            <View
              style={[
                styles.timerBubble,
                { backgroundColor: timerSeconds <= 4 ? '#ef4444' : '#f59e0b' },
              ]}
            >
              <Text style={styles.timerText}>{timerSeconds}s</Text>
            </View>

            <View style={[styles.playerCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.sbName}>{opponent.avatar} {opponent.name.split(' ')[0]}</Text>
              <Text style={[styles.sbPoints, { color: '#f87171' }]}>{oppScore} pts</Text>
            </View>
          </View>

          {/* Round Indicator */}
          <View style={styles.roundIndicatorRow}>
            <Text style={[styles.roundText, { color: colors.onSurfaceVariant }]}>
              {`Round ${currentQIndex + 1} of ${questions.length} • ${currentQ?.category || 'Speed Drill'}`}
            </Text>
          </View>

          {/* Question Card */}
          {currentQ && (
            <View
              style={[
                styles.duelQuestionCard,
                {
                  backgroundColor: colors.surfaceContainerLowest,
                  borderColor: colors.outlineVariant,
                },
                MindSprintShadows.card,
              ]}
            >
              <Text style={[styles.duelQText, { color: colors.onSurface }]}>
                {isSchoolMode && (currentQ as any).questionTextGujarati ? (currentQ as any).questionTextGujarati : currentQ.questionText}
              </Text>

              {/* 4 Interactive Options */}
              <View style={styles.optionsList}>
                {(isSchoolMode && (currentQ as any).optionsGujarati && (currentQ as any).optionsGujarati.length > 0
                  ? (currentQ as any).optionsGujarati
                  : currentQ.options
                ).map((opt: string, idx: number) => {
                  const isSelected = selectedOpt === idx;
                  const isCorrect = idx === currentQ.correctAnswer;

                  let bg = isDarkMode ? colors.surfaceContainerLow : '#f8fafc';
                  let border = isDarkMode ? colors.outlineVariant : '#e2e8f0';
                  let textClr = colors.onSurface;

                  if (isRoundAnswered) {
                    if (isCorrect) {
                      bg = isDarkMode ? 'rgba(16, 185, 129, 0.25)' : '#d1fae5';
                      border = '#10b981';
                      textClr = '#065f46';
                    } else if (isSelected && !isCorrect) {
                      bg = isDarkMode ? 'rgba(239, 68, 68, 0.25)' : '#fee2e2';
                      border = '#ef4444';
                      textClr = '#991b1b';
                    }
                  }

                  return (
                    <TouchableOpacity
                      key={idx}
                      disabled={isRoundAnswered}
                      activeOpacity={0.8}
                      style={[
                        styles.optBtn,
                        { backgroundColor: bg, borderColor: border },
                        isSelected && { borderWidth: 2 },
                      ]}
                      onPress={() => handleAnswer(idx)}
                    >
                      <View style={[styles.optLetterCircle, { backgroundColor: isDarkMode ? colors.surfaceContainerHigh : '#e2e8f0' }]}>
                        <Text style={[styles.optLetterText, { color: colors.onSurface }]}>
                          {String.fromCharCode(65 + idx)}
                        </Text>
                      </View>
                      <Text style={[styles.optLabel, { color: textClr }]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}

      {/* PHASE 4: DUEL FINAL RESULT PODIUM */}
      {phase === 'finished' && (
        <View style={styles.duelFinishedContainer}>
          <View
            style={[
              styles.podiumCard,
              {
                backgroundColor: colors.surfaceContainerLowest,
                borderColor: colors.outlineVariant,
              },
              MindSprintShadows.card,
            ]}
          >
            <View
              style={[
                styles.resultIconCircle,
                { backgroundColor: myScore > oppScore ? 'rgba(16, 185, 129, 0.15)' : myScore === oppScore ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)' },
              ]}
            >
              <MaterialIcons
                name={myScore > oppScore ? 'emoji-events' : myScore === oppScore ? 'handshake' : 'sports-kabaddi'}
                size={44}
                color={myScore > oppScore ? '#10b981' : myScore === oppScore ? '#f59e0b' : '#ef4444'}
              />
            </View>

            <Text style={[styles.duelResultHeading, { color: colors.onSurface }]}>
              {myScore > oppScore
                ? 'VICTORY! 🏆'
                : myScore === oppScore
                ? 'WELL PLAYED! TIE 🤝'
                : 'GOOD FIGHT! 💪'}
            </Text>

            {/* Score Comparison Box */}
            <View style={styles.scoreComparisonRow}>
              <View style={styles.playerScoreBox}>
                <Text style={styles.scoreAvatar}>🧑‍🎓</Text>
                <Text style={[styles.playerName, { color: colors.onSurface }]}>
                  You
                </Text>
                <Text style={[styles.scoreBig, { color: colors.primary }]}>{myScore} pts</Text>
              </View>

              <Text style={[styles.vsText, { color: colors.outline }]}>VS</Text>

              <View style={styles.playerScoreBox}>
                <Text style={styles.scoreAvatar}>{opponent.avatar}</Text>
                <Text style={[styles.playerName, { color: colors.onSurface }]}>{opponent.name}</Text>
                <Text style={[styles.scoreBig, { color: '#ef4444' }]}>{oppScore} pts</Text>
              </View>
            </View>

            {/* Earned XP Pill */}
            <View style={[styles.rewardPill, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <MaterialIcons name="local-fire-department" size={18} color="#f59e0b" />
              <Text style={styles.rewardText}>
                {`+${earnedXp} Duel XP added to your leaderboard standing! (Total: ${totalUserXp} XP)`}
              </Text>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={[styles.rematchBtn, { backgroundColor: colors.primary }, MindSprintShadows.glow]}
              onPress={handleRematch}
            >
              <MaterialIcons name="replay" size={20} color="#ffffff" />
              <Text style={styles.rematchBtnText}>
                Play Rematch ⚔️
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryBtn, { borderColor: colors.outlineVariant }]}
              onPress={() => setPhase('select_subject')}
            >
              <MaterialIcons name="grid-view" size={18} color={colors.primary} />
              <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>
                Change Subject 🔄
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 58,
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
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  xpPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#b45309',
  },
  selectionScroll: {
    padding: 16,
    gap: 16,
    paddingBottom: 36,
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    gap: 8,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 25,
  },
  heroSub: {
    fontSize: 13,
    color: '#c7d2fe',
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  subjectsGrid: {
    gap: 12,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderLeftWidth: 4,
    gap: 12,
  },
  subjectIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '800',
  },
  subjectDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  matchmakingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  radarOuterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  radarScanner: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
  },
  radarBlip: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: 6,
  },
  matchingTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  matchingSub: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 280,
  },
  matchedPeerPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginTop: 12,
    width: '100%',
    maxWidth: 300,
  },
  matchedAvatar: {
    fontSize: 28,
  },
  matchedName: {
    fontSize: 14,
    fontWeight: '800',
  },
  matchedSchool: {
    fontSize: 12,
  },
  arenaContainer: {
    padding: 16,
    gap: 14,
  },
  scoreboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
  },
  playerCol: {
    gap: 2,
  },
  sbName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#c7d2fe',
  },
  sbPoints: {
    fontSize: 20,
    fontWeight: '900',
    color: '#34d399',
  },
  timerBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  roundIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  roundText: {
    fontSize: 12,
    fontWeight: '700',
  },
  duelQuestionCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  duelQText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
  },
  optionsList: {
    gap: 10,
  },
  optBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  optLetterCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optLetterText: {
    fontSize: 12,
    fontWeight: '800',
  },
  optLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  duelFinishedContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  podiumCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 14,
  },
  resultIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  duelResultHeading: {
    fontSize: 22,
    fontWeight: '900',
  },
  scoreComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  playerScoreBox: {
    alignItems: 'center',
    gap: 4,
  },
  scoreAvatar: {
    fontSize: 32,
  },
  playerName: {
    fontSize: 13,
    fontWeight: '700',
  },
  scoreBig: {
    fontSize: 22,
    fontWeight: '900',
  },
  vsText: {
    fontSize: 16,
    fontWeight: '900',
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    width: '100%',
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
    flex: 1,
  },
  rematchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    width: '100%',
    gap: 8,
    marginTop: 4,
  },
  rematchBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    width: '100%',
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modeTabsRow: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 6,
    marginBottom: 8,
  },
  modeTabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTabBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  roomCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    gap: 10,
    marginBottom: 10,
  },
  roomLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  codeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  },
  roomSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  waShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  waShareBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  joinInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pinInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 4,
  },
  joinBtn: {
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});

