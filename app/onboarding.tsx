import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface OnboardingSlide {
  id: string;
  title: string;
  titleGu: string;
  description: string;
  descriptionGu: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  points: string[];
  pointsGu: string[];
}

// Stable config objects for FlatList (must not change between renders).
const VIEWABILITY_CONFIG = { viewAreaCoveragePercentThreshold: 50 };

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Every chapter in one place',
    titleGu: 'દરેક પ્રકરણ એક જ જગ્યાએ',
    description: 'Class 7 to 12 (GSEB, Gujarati medium) and college placement prep.',
    descriptionGu: 'ધોરણ 7 થી 12 (GSEB, ગુજરાતી માધ્યમ) અને કૉલેજ પ્લેસમેન્ટની તૈયારી.',
    iconName: 'play-lesson',
    points: ['A full video lesson for each chapter', 'The official textbook PDF', 'Short notes and formulas'],
    pointsGu: ['દરેક પ્રકરણનો પૂરો વિડિયો પાઠ', 'સત્તાવાર પાઠ્યપુસ્તકની PDF', 'ટૂંકી નોંધ અને સૂત્રો'],
  },
  {
    id: '2',
    title: 'Practise the way the board tests',
    titleGu: 'બોર્ડ પરીક્ષા જેવી પ્રેક્ટિસ',
    description: 'Questions written in the same style as your exam paper.',
    descriptionGu: 'તમારા પરીક્ષાપત્ર જેવી જ શૈલીના પ્રશ્નો.',
    iconName: 'assignment',
    points: ['1 to 4 mark important questions', 'Full 80-mark board papers', 'A quick quiz after every chapter'],
    pointsGu: ['1 થી 4 ગુણના મહત્વના પ્રશ્નો', '80 ગુણનાં પૂરાં બોર્ડ પેપર', 'દરેક પ્રકરણ પછી ઝડપી ક્વિઝ'],
  },
  {
    id: '3',
    title: 'Study a little every day',
    titleGu: 'રોજ થોડું ભણો',
    description: 'Small daily goals keep you moving before exams.',
    descriptionGu: 'નાના રોજિંદા લક્ષ્યો પરીક્ષા પહેલાં તમને આગળ રાખે છે.',
    iconName: 'local-fire-department',
    points: ['A new question every day', '1v1 quiz duels with classmates', 'Gujarat-wide rankings'],
    pointsGu: ['રોજ એક નવો પ્રશ્ન', 'સહાધ્યાયીઓ સાથે 1v1 ક્વિઝ મુકાબલો', 'આખા ગુજરાતનું રેન્કિંગ'],
  },
  {
    id: '4',
    title: 'Know what to revise next',
    titleGu: 'હવે શું ફરી ભણવું તે જાણો',
    description: 'Your tests show which topics need more work.',
    descriptionGu: 'તમારા ટેસ્ટ બતાવે છે કે કયા વિષય પર વધુ મહેનત જોઈએ.',
    iconName: 'insights',
    points: ['Weak topics found from your answers', 'Retry questions you got wrong', 'Progress saved as you go'],
    pointsGu: ['તમારા જવાબો પરથી નબળા વિષયો', 'ખોટા પડેલા પ્રશ્નો ફરી કરો', 'પ્રગતિ સાથે સાથે સચવાય છે'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { completeOnboarding } = useAuth();
  const { tr, isGujarati, lang, setLang } = useLanguage();
  const { width: screenWidth } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleFinishOnboarding = async () => {
    try {
      await completeOnboarding();
    } catch (e) {
      console.error('Failed to complete onboarding flag', e);
    }
    router.replace('/login');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    } else {
      handleFinishOnboarding();
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.heroSurface }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={[styles.brandIcon, { backgroundColor: colors.accent }]}>
            <MaterialIcons name="auto-stories" size={18} color={colors.onAccent} />
          </View>
          <Text style={[styles.brandName, { color: colors.onHeroSurface }]}>MindSprint</Text>
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.langToggle}
            onPress={() => setLang(lang === 'gu' ? 'en' : 'gu')}
            accessibilityRole="button"
            accessibilityLabel={lang === 'gu' ? 'Switch to English' : 'ગુજરાતીમાં બદલો'}
          >
            <MaterialIcons name="translate" size={16} color={colors.onHeroSurface} />
            <Text style={[styles.langToggleText, { color: colors.onHeroSurface }]}>{lang === 'gu' ? 'English' : 'ગુજરાતી'}</Text>
          </TouchableOpacity>
          {currentIndex < SLIDES.length - 1 && (
            <TouchableOpacity activeOpacity={0.7} style={styles.skipBtn} onPress={handleFinishOnboarding} accessibilityRole="button">
              <Text style={[styles.skipText, { color: colors.onHeroSurfaceVariant }]}>{tr('Skip', 'છોડો')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialNumToRender={SLIDES.length}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          flatListRef.current?.scrollToOffset({
            offset: info.index * screenWidth,
            animated: true,
          });
        }}
        onMomentumScrollEnd={(ev) => {
          const nextIdx = Math.round(ev.nativeEvent.contentOffset.x / screenWidth);
          if (nextIdx >= 0 && nextIdx < SLIDES.length) {
            setCurrentIndex(nextIdx);
          }
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        renderItem={({ item }: { item: OnboardingSlide }) => (
          <View style={[styles.slide, { width: screenWidth }]}>
            <View style={styles.slideInner}>
              <View style={[styles.iconTile, { backgroundColor: colors.accent }]}>
                <MaterialIcons name={item.iconName} size={40} color={colors.onAccent} />
              </View>
              <Text style={[styles.title, { color: colors.onHeroSurface }]}>{isGujarati ? item.titleGu : item.title}</Text>
              <Text style={[styles.description, { color: colors.onHeroSurfaceVariant }]}>{isGujarati ? item.descriptionGu : item.description}</Text>

              <View style={styles.pointsCard}>
                {(isGujarati ? item.pointsGu : item.points).map((pt, i) => (
                  <View key={pt} style={[styles.pointRow, i > 0 && styles.pointDivider]}>
                    <MaterialIcons name="check-circle" size={20} color={colors.accent} />
                    <Text style={[styles.pointText, { color: colors.onHeroSurface }]}>{pt}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.bottomBar}>
        <View style={styles.paginationRow} accessibilityLabel={tr(`Step ${currentIndex + 1} of ${SLIDES.length}`, `${SLIDES.length} માંથી પગલું ${currentIndex + 1}`)}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor: idx === currentIndex ? colors.accent : 'rgba(255,255,255,0.25)',
                  width: idx === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.nextButton, { backgroundColor: colors.accent }]}
          onPress={handleNext}
          accessibilityRole="button"
        >
          <Text style={[styles.nextButtonText, { color: colors.onAccent }]}>
            {currentIndex === SLIDES.length - 1 ? tr('Get started', 'શરૂ કરો') : tr('Next', 'આગળ')}
          </Text>
          <MaterialIcons name="arrow-forward" size={20} color={colors.onAccent} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  langToggleText: { fontFamily: MindSprintFonts.label, fontSize: 14 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 60,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontFamily: MindSprintFonts.heading, fontSize: 20, lineHeight: 26 },
  skipBtn: { minHeight: 44, minWidth: 56, alignItems: 'center', justifyContent: 'center' },
  skipText: { fontFamily: MindSprintFonts.label, fontSize: 15.5 },
  slide: { paddingHorizontal: 24, paddingTop: 28 },
  slideInner: { width: '100%', maxWidth: 480, alignSelf: 'center' },
  iconTile: { width: 76, height: 76, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontFamily: MindSprintFonts.display, fontSize: 32, lineHeight: 40 },
  description: { fontSize: 16, lineHeight: 24, marginTop: 8 },
  pointsCard: {
    marginTop: 26,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 16,
  },
  pointRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 54 },
  pointDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.18)' },
  pointText: { fontSize: 15.5, flex: 1 },
  bottomBar: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12, gap: 20 },
  paginationRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  dot: { height: 8, borderRadius: 4 },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    borderRadius: 16,
    gap: 8,
  },
  nextButtonText: { fontFamily: MindSprintFonts.label, fontSize: 17 },
});
