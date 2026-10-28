import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { MindSprintShadows } from "@/constants/mindsprintTheme";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { ApiService } from "@/services/api";
import {
  ACADEMIC_CURRICULUM,
  AcademicGrade,
  AcademicSubject,
} from "@/constants/academicData";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface FlashcardItem {
  id: string;
  subject: string;
  chapterTitle?: string;
  question: string;
  questionGujarati?: string;
  answer: string;
  answerGujarati?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "formula" | "definition" | "exercise" | "concept" | "interview";
  color: string;
}

function buildSchoolFlashcards(grade: AcademicGrade, isGSEB: boolean): FlashcardItem[] {
  const curriculum = ACADEMIC_CURRICULUM[grade];
  if (!curriculum) return [];
  const cards: FlashcardItem[] = [];
  curriculum.subjects.forEach((subject: AcademicSubject) => {
    const subName = isGSEB ? (subject.nameGujarati || subject.name) : subject.name;
    subject.chapters.forEach((chapter) => {
      const chapTitle = isGSEB ? (chapter.titleGujarati || chapter.title) : chapter.title;
      // Key Formulas
      (chapter.keyFormulas || []).forEach((formula, idx) => {
        const gujaratiFormula = chapter.keyFormulasGujarati?.[idx];
        cards.push({
          id: `${chapter.id}-f-${idx}`,
          subject: subName,
          chapterTitle: chapTitle,
          question: `Formula / rule in "${chapter.title}"?`,
          questionGujarati: `"${chapter.titleGujarati || chapter.title}" નો સૂત્ર / નિયમ?`,
          answer: formula,
          answerGujarati: gujaratiFormula,
          difficulty: "Medium",
          type: "formula",
          color: subject.color,
        });
      });
      // Exercise Solutions
      (chapter.exerciseSolutions || []).forEach((ex, idx) => {
        cards.push({
          id: `${chapter.id}-ex-${idx}`,
          subject: subName,
          chapterTitle: chapTitle,
          question: ex.question,
          questionGujarati: ex.questionGujarati,
          answer: ex.answer,
          answerGujarati: ex.answerGujarati,
          difficulty: "Easy",
          type: "exercise",
          color: subject.color,
        });
      });
      // Chapter summary card
      cards.push({
        id: `${chapter.id}-def`,
        subject: subName,
        chapterTitle: chapTitle,
        question: `Summarise: "${chapter.title}"`,
        questionGujarati: `"${chapter.titleGujarati || chapter.title}" – આ પ્રકરણ શેના વિષે છે?`,
        answer: chapter.summary,
        answerGujarati: chapter.summaryGujarati,
        difficulty: "Easy",
        type: "definition",
        color: subject.color,
      });
      // Concept cards
      (chapter.concepts || []).forEach((concept, idx) => {
        cards.push({
          id: `${chapter.id}-c-${idx}`,
          subject: subName,
          chapterTitle: chapTitle,
          question: concept.heading,
          questionGujarati: concept.headingGujarati,
          answer: concept.explanation,
          answerGujarati: concept.explanationGujarati,
          difficulty: "Hard",
          type: "concept",
          color: subject.color,
        });
      });
    });
  });
  return cards;
}

function buildSchoolFilters(grade: AcademicGrade, isGSEB: boolean) {
  const curriculum = ACADEMIC_CURRICULUM[grade];
  if (!curriculum) return [{ key: "All", label: "All", color: "#6366f1" }];
  const filters: { key: string; label: string; color: string }[] = [
    { key: "All", label: "All", color: "#6366f1" },
  ];
  curriculum.subjects.forEach((sub) => {
    const name = isGSEB ? (sub.nameGujarati || sub.name) : sub.name;
    filters.push({
      key: name,
      label: name,
      color: sub.color,
    });
  });
  return filters;
}

function difficultyColor(d: string) {
  if (d === "Easy") return { bg: "#dcfce7", text: "#166534" };
  if (d === "Hard") return { bg: "#fee2e2", text: "#991b1b" };
  return { bg: "#fef9c3", text: "#854d0e" };
}

function typeIcon(t: string): keyof typeof MaterialIcons.glyphMap {
  if (t === "formula") return "functions";
  if (t === "exercise") return "edit";
  if (t === "concept") return "psychology";
  if (t === "interview") return "business-center";
  return "lightbulb";
}

export default function FlashcardsScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();

  const userGrade: AcademicGrade = (user?.grade as AcademicGrade) || "college";
  const isSchoolMode = userGrade !== "college";
  const isGSEB = isSchoolMode && user?.medium === "Gujarati";

  const [allCards, setAllCards] = useState<FlashcardItem[]>([]);
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const storageKey = `@mindsprint_flashcard_mastered_${userGrade}_${user?.email || "guest"}`;
  const skippedKey = `@mindsprint_flashcard_skipped_${userGrade}_${user?.email || "guest"}`;

  const schoolFilters = isSchoolMode ? buildSchoolFilters(userGrade, isGSEB) : [];
  const collegeFilters = [
    { key: "All", label: "All", color: "#6366f1" },
    { key: "HR Interview", label: "HR", color: "#f59e0b" },
    { key: "React & JS", label: "React", color: "#38bdf8" },
    { key: "Data Structures", label: "DSA", color: "#a78bfa" },
  ];
  const filterList = isSchoolMode ? schoolFilters : collegeFilters;

  useEffect(() => {
    async function loadSaved() {
      try {
        const [mData, sData] = await Promise.all([
          AsyncStorage.getItem(storageKey),
          AsyncStorage.getItem(skippedKey),
        ]);
        if (mData) setMasteredIds(JSON.parse(mData));
        if (sData) setSkippedIds(JSON.parse(sData));
      } catch (_) {}
    }
    loadSaved();
  }, [storageKey, skippedKey]);

  useEffect(() => {
    async function loadCards() {
      setLoading(true);
      try {
        if (isSchoolMode) {
          const built = buildSchoolFlashcards(userGrade, isGSEB);
          setAllCards(built);
          setCards(built);
        } else {
          const data = await ApiService.getFlashcards("All");
          const mapped: FlashcardItem[] = (data || []).map((d: any) => ({
            id: d.id || String(Math.random()),
            subject: d.topic || "General",
            question: d.question,
            answer: d.answer,
            difficulty: (d.difficulty || "Medium") as "Easy" | "Medium" | "Hard",
            type: "interview" as const,
            color: "#6366f1",
          }));
          setAllCards(mapped);
          setCards(mapped);
        }
      } catch (e) {
        console.warn("Flashcard load error:", e);
      } finally {
        setLoading(false);
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    }
    loadCards();
  }, [userGrade, isSchoolMode, isGSEB]);

  useEffect(() => {
    if (selectedFilter === "All") {
      setCards(allCards);
    } else {
      setCards(allCards.filter((c) => c.subject === selectedFilter));
    }
    setCurrentIndex(0);
    setIsFlipped(false);
    flipAnim.setValue(0);
  }, [selectedFilter, allCards]);

  const currentCard = cards[currentIndex];
  const isMastered = currentCard ? masteredIds.includes(currentCard.id) : false;
  const isSkipped = currentCard ? skippedIds.includes(currentCard.id) : false;
  const masteredCount = cards.filter((c) => masteredIds.includes(c.id)).length;
  const progressPercent = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  const animateSlide = (direction: "left" | "right", callback: () => void) => {
    Animated.timing(slideAnim, {
      toValue: direction === "right" ? -SCREEN_WIDTH : SCREEN_WIDTH,
      duration: 160,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH);
      callback();
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 22, bounciness: 4 }).start();
    });
  };

  const handleFlip = () => {
    Animated.spring(flipAnim, { toValue: isFlipped ? 0 : 1, friction: 8, tension: 10, useNativeDriver: true }).start();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    animateSlide("right", () => {
      setIsFlipped(false); flipAnim.setValue(0);
      setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
    });
  };

  const handlePrev = () => {
    animateSlide("left", () => {
      setIsFlipped(false); flipAnim.setValue(0);
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
    });
  };

  const toggleMastered = async () => {
    if (!currentCard) return;
    const updated = isMastered
      ? masteredIds.filter((id) => id !== currentCard.id)
      : [...masteredIds, currentCard.id];
    if (!isMastered && updated.length === cards.length) {
      Alert.alert("Deck Mastered! 🎓", "You have mastered all flashcards!");
    }
    setMasteredIds(updated);
    try { await AsyncStorage.setItem(storageKey, JSON.stringify(updated)); } catch (_) {}
  };

  const toggleSkipped = async () => {
    if (!currentCard) return;
    const updated = isSkipped ? skippedIds.filter((id) => id !== currentCard.id) : [...skippedIds, currentCard.id];
    setSkippedIds(updated);
    try { await AsyncStorage.setItem(skippedKey, JSON.stringify(updated)); } catch (_) {}
  };

  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
  const backOpacity  = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const frontRotate  = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });
  const backRotate   = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ["180deg", "360deg"] });

  const diffStyle   = currentCard ? difficultyColor(currentCard.difficulty) : { bg: "#f1f5f9", text: "#64748b" };
  const displayQ    = isGSEB && currentCard?.questionGujarati ? currentCard.questionGujarati : currentCard?.question || "";
  const displayA    = isGSEB && currentCard?.answerGujarati   ? currentCard.answerGujarati   : currentCard?.answer   || "";
  const displaySub  = currentCard?.subject || "";
  const displayChap = currentCard?.chapterTitle || "";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? "#1e1b4b" : "#eef2ff", borderBottomColor: colors.outlineVariant }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            {isSchoolMode ? `Class ${userGrade} Flashcards 📇` : "Placement Flashcards 📇"}
          </Text>
          <Text style={[styles.headerSub, { color: colors.onSurfaceVariant }]}>
            {cards.length} Cards • {masteredCount} Mastered ({progressPercent}%)
          </Text>
        </View>
        <View style={[styles.progressPill, { backgroundColor: isDarkMode ? "rgba(16,185,129,0.2)" : "#dcfce7" }]}>
          <MaterialIcons name="check-circle" size={13} color="#10b981" />
          <Text style={styles.progressPillText}>{progressPercent}%</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Progress bar */}
        <View style={[styles.progressBarTrack, { backgroundColor: isDarkMode ? colors.surfaceContainerHigh : "#e2e8f0" }]}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: "#10b981" }]} />
        </View>

        {/* Subject filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {filterList.map((f) => {
            const isSel = selectedFilter === f.key;
            return (
              <TouchableOpacity key={f.key} style={[styles.filterChip, { backgroundColor: isSel ? f.color : isDarkMode ? colors.surfaceContainerLow : colors.surfaceContainerLowest, borderColor: isSel ? f.color : colors.outlineVariant }]} onPress={() => setSelectedFilter(f.key)}>
                <Text style={[styles.filterChipText, { color: isSel ? "#ffffff" : colors.onSurface }]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading ? (
          <View style={{ paddingVertical: 60, alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>Building deck...</Text>
          </View>
        ) : cards.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surfaceContainerLowest }]}>
            <MaterialIcons name="style" size={44} color={colors.outline} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>No Flashcards Found</Text>
          </View>
        ) : (
          <>
            {/* Counter + action row */}
            <View style={styles.counterRow}>
              <Text style={[styles.counterText, { color: colors.onSurfaceVariant }]}>
                {`Card ${currentIndex + 1} of ${cards.length}`}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity style={[styles.actionBadgeBtn, { backgroundColor: isSkipped ? "rgba(239,68,68,0.15)" : colors.surfaceContainerHigh }]} onPress={toggleSkipped}>
                  <MaterialIcons name={isSkipped ? "undo" : "skip-next"} size={16} color={isSkipped ? "#ef4444" : colors.outline} />
                  <Text style={[styles.actionBadgeText, { color: isSkipped ? "#ef4444" : colors.onSurfaceVariant }]}>{isSkipped ? "Unskip" : "Skip"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBadgeBtn, { backgroundColor: isMastered ? "rgba(16,185,129,0.15)" : colors.surfaceContainerHigh }]} onPress={toggleMastered}>
                  <MaterialIcons name={isMastered ? "check-circle" : "radio-button-unchecked"} size={16} color={isMastered ? "#10b981" : colors.outline} />
                  <Text style={[styles.actionBadgeText, { color: isMastered ? "#10b981" : colors.onSurfaceVariant }]}>{isMastered ? "Mastered ✓" : "Got It?"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Flip card */}
            {currentCard && (
              <TouchableOpacity activeOpacity={0.95} onPress={handleFlip}>
                <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                  {/* Front */}
                  <Animated.View style={[styles.flashcard, { backgroundColor: isDarkMode ? colors.surfaceContainerLowest : "#ffffff", borderColor: currentCard.color, position: "absolute", width: "100%", transform: [{ rotateY: frontRotate }], opacity: frontOpacity }, MindSprintShadows.card]}>
                    <View style={styles.cardTopRow}>
                      <View style={[styles.subjectBadge, { backgroundColor: currentCard.color + "20", borderColor: currentCard.color }]}>
                        <MaterialIcons name={typeIcon(currentCard.type)} size={14} color={currentCard.color} />
                        <Text style={[styles.subjectBadgeText, { color: currentCard.color }]}>{displaySub}</Text>
                      </View>
                      <View style={[styles.difficultyBadge, { backgroundColor: diffStyle.bg }]}>
                        <Text style={[styles.difficultyText, { color: diffStyle.text }]}>{currentCard.difficulty}</Text>
                      </View>
                    </View>
                    {displayChap ? <Text style={[styles.chapterLabel, { color: colors.onSurfaceVariant }]}>📌 {displayChap}</Text> : null}
                    <View style={styles.cardBodyFront}>
                      <MaterialIcons name="help-outline" size={32} color={currentCard.color + "60"} />
                      <Text style={[styles.questionText, { color: colors.onSurface }]}>{displayQ}</Text>
                    </View>
                    <View style={[styles.flipHint, { backgroundColor: currentCard.color + "12" }]}>
                      <MaterialIcons name="touch-app" size={18} color={currentCard.color} />
                      <Text style={[styles.flipHintText, { color: currentCard.color }]}>Tap to reveal answer</Text>
                    </View>
                  </Animated.View>
                  {/* Back */}
                  <Animated.View style={[styles.flashcard, { backgroundColor: isDarkMode ? currentCard.color + "18" : currentCard.color + "10", borderColor: currentCard.color, width: "100%", transform: [{ rotateY: backRotate }], opacity: backOpacity }, MindSprintShadows.card]}>
                    <View style={styles.cardTopRow}>
                      <View style={[styles.subjectBadge, { backgroundColor: currentCard.color + "20", borderColor: currentCard.color }]}>
                        <MaterialIcons name="check" size={14} color={currentCard.color} />
                        <Text style={[styles.subjectBadgeText, { color: currentCard.color }]}>Answer</Text>
                      </View>
                      <View style={[styles.difficultyBadge, { backgroundColor: diffStyle.bg }]}>
                        <Text style={[styles.difficultyText, { color: diffStyle.text }]}>{currentCard.difficulty}</Text>
                      </View>
                    </View>
                    <View style={styles.cardBodyBack}>
                      <Text style={[styles.answerHeading, { color: currentCard.color }]}>✅ Answer:</Text>
                      <Text style={[styles.answerText, { color: colors.onSurface }]}>{displayA}</Text>
                    </View>
                    <View style={[styles.flipHint, { backgroundColor: currentCard.color + "12" }]}>
                      <MaterialIcons name="flip" size={18} color={currentCard.color} />
                      <Text style={[styles.flipHintText, { color: currentCard.color }]}>Tap to see question</Text>
                    </View>
                  </Animated.View>
                </Animated.View>
              </TouchableOpacity>
            )}

            <View style={{ height: 340 }} />

            {/* Navigation */}
            <View style={styles.controlsRow}>
              <TouchableOpacity style={[styles.navBtn, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : "#f1f5f9", borderColor: colors.outlineVariant }]} onPress={handlePrev}>
                <MaterialIcons name="chevron-left" size={22} color={colors.onSurface} />
                <Text style={[styles.navBtnText, { color: colors.onSurface }]}>Prev</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.flipBtn, { backgroundColor: currentCard?.color || colors.primary }]} onPress={handleFlip}>
                <MaterialIcons name="flip" size={20} color="#ffffff" />
                <Text style={styles.flipBtnText}>{isFlipped ? "Question" : "Answer"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navBtn, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : "#f1f5f9", borderColor: colors.outlineVariant }]} onPress={handleNext}>
                <Text style={[styles.navBtnText, { color: colors.onSurface }]}>Next</Text>
                <MaterialIcons name="chevron-right" size={22} color={colors.onSurface} />
              </TouchableOpacity>
            </View>

            {/* Stats row */}
            <View style={[styles.statsRow, { backgroundColor: isDarkMode ? colors.surfaceContainerLowest : "#ffffff", borderColor: colors.outlineVariant }]}>
              {[
                { label: "Total", value: cards.length, color: colors.primary },
                { label: "Mastered", value: masteredCount, color: "#10b981" },
                { label: "Remaining", value: cards.length - masteredCount, color: "#f59e0b" },
                { label: "Skipped", value: skippedIds.filter((id) => cards.some((c) => c.id === id)).length, color: "#ef4444" },
              ].map((stat) => (
                <View key={stat.label} style={styles.statItem}>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, gap: 10 },
  backBtn: { padding: 6, borderRadius: 8 },
  headerTitle: { fontSize: 15.5, fontWeight: "800", letterSpacing: -0.2 },
  headerSub: { fontSize: 11.5, marginTop: 2 },
  progressPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 14 },
  progressPillText: { fontSize: 10.5, fontWeight: "800", color: "#10b981" },
  scrollContainer: { padding: 16, gap: 14, paddingBottom: 40 },
  progressBarTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 3 },
  chipScroll: { gap: 8, paddingBottom: 2 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
  filterChipText: { fontSize: 12, fontWeight: "700" },
  loadingText: { fontSize: 13, marginTop: 12, fontWeight: "500" },
  emptyCard: { padding: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyTitle: { fontSize: 15, fontWeight: "700" },
  counterRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  counterText: { fontSize: 13, fontWeight: "600" },
  actionBadgeBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  actionBadgeText: { fontSize: 11.5, fontWeight: "700" },
  flashcard: { borderRadius: 24, borderWidth: 2, padding: 20, minHeight: 320, justifyContent: "space-between", backfaceVisibility: "hidden" },
  cardTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  subjectBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1 },
  subjectBadgeText: { fontSize: 11.5, fontWeight: "800" },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  difficultyText: { fontSize: 10.5, fontWeight: "700" },
  chapterLabel: { fontSize: 11.5, fontWeight: "600", marginTop: 4 },
  cardBodyFront: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 24, gap: 16 },
  questionText: { fontSize: 18, fontWeight: "700", textAlign: "center", lineHeight: 26 },
  flipHint: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, alignSelf: "center" },
  flipHintText: { fontSize: 12.5, fontWeight: "700" },
  cardBodyBack: { flex: 1, paddingVertical: 12, gap: 10, justifyContent: "center" },
  answerHeading: { fontSize: 14, fontWeight: "800" },
  answerText: { fontSize: 15, lineHeight: 22, fontWeight: "500" },
  controlsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  navBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 11, borderRadius: 12, borderWidth: 1, gap: 4 },
  navBtnText: { fontSize: 13, fontWeight: "700" },
  flipBtn: { flex: 1.4, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 13, borderRadius: 14, gap: 6 },
  flipBtnText: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  statsRow: { flexDirection: "row", borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  statItem: { flex: 1, paddingVertical: 12, alignItems: "center", gap: 2 },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 10.5, fontWeight: "600" },
});
