import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MindSprintColors, MindSprintShadows } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  quote?: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  accentColor: string;
  bgGradientColor: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    badge: 'CLASS 6 TO 12 & COLLEGE',
    title: 'Your Complete Academic &',
    highlight: 'Career Companion',
    description:
      'Curated syllabus for GSEB & CBSE (English & Gujarati Medium) from Class 6 to 12, plus comprehensive College Placement prep.',
    iconName: 'school',
    accentColor: '#4f46e5',
    bgGradientColor: '#eef2ff',
  },
  {
    id: '2',
    badge: 'COMPREHENSIVE RESOURCES',
    title: 'Textbooks, Sample Papers &',
    highlight: 'Important Questions',
    description:
      'Master every concept with chapter notes, 1 to 4 marker questions, official board papers, and video masterclasses.',
    iconName: 'menu-book',
    accentColor: '#0ea5e9',
    bgGradientColor: '#f0f9ff',
  },
  {
    id: '3',
    badge: 'INTERACTIVE MOMENTUM',
    title: '1v1 Live Duels & Daily',
    highlight: 'Study Streaks',
    description:
      'Challenge classmates in real-time speed battles, take 60-second daily challenges, and rise on the Gujarat & India leaderboard.',
    iconName: 'sports-kabaddi',
    accentColor: '#f59e0b',
    bgGradientColor: '#fffbeb',
  },
  {
    id: '4',
    badge: 'AI-POWERED ACCELERATOR',
    title: 'Personalized AI Diagnostics &',
    highlight: 'Mock Exams',
    quote: '"Be the better version of yourself"',
    description:
      'Detect and eliminate weak areas with instant AI feedback. Step into school exams and corporate interviews with 100% confidence.',
    iconName: 'auto-awesome',
    accentColor: '#10b981',
    bgGradientColor: '#ecfdf5',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@mindsprint_onboarding_completed', 'true');
    } catch (e) {
      console.error('Failed to set onboarding flag', e);
    }
    router.replace('/login');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinishOnboarding();
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Top Bar with Skip */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={[styles.brandIcon, { backgroundColor: colors.primary }]}>
            <MaterialIcons name="school" size={18} color="#ffffff" />
          </View>
          <Text style={[styles.brandName, { color: colors.primary }]}>MindSprint</Text>
        </View>

        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.skipBtn, { backgroundColor: isDarkMode ? colors.surfaceContainerLow : '#f1f5f9' }]}
            onPress={handleFinishOnboarding}
          >
            <Text style={[styles.skipText, { color: colors.onSurfaceVariant }]}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Visual Card */}
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isDarkMode ? colors.surfaceContainerLow : item.bgGradientColor,
                  borderColor: isDarkMode ? colors.outlineVariant : item.accentColor + '40',
                },
                MindSprintShadows.card,
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: item.accentColor }]}>
                <MaterialIcons name={item.iconName} size={48} color="#ffffff" />
              </View>

              {item.quote && (
                <View style={[styles.quoteBadge, { backgroundColor: isDarkMode ? '#064e3b' : '#d1fae5' }]}>
                  <MaterialIcons name="format-quote" size={16} color="#10b981" />
                  <Text style={styles.quoteText}>{item.quote}</Text>
                </View>
              )}
            </View>

            {/* Content Info */}
            <View style={styles.textContent}>
              <View style={[styles.badgePill, { backgroundColor: item.accentColor + '20' }]}>
                <Text style={[styles.badgeText, { color: item.accentColor }]}>{item.badge}</Text>
              </View>

              <Text style={[styles.title, { color: colors.onSurface }]}>
                {item.title}{' '}
                <Text style={{ color: item.accentColor }}>{item.highlight}</Text>
              </Text>

              <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Bottom Controls */}
      <View style={styles.bottomBar}>
        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    idx === currentIndex
                      ? colors.primary
                      : isDarkMode ? colors.outlineVariant : '#cbd5e1',
                  width: idx === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.nextButton, { backgroundColor: colors.primary }, MindSprintShadows.glow]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === SLIDES.length - 1 ? 'Start Learning 🚀' : 'Continue'}
          </Text>
          <MaterialIcons
            name={currentIndex === SLIDES.length - 1 ? 'check' : 'arrow-forward'}
            size={20}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  skipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: SCREEN_WIDTH - 48,
    height: 240,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    position: 'relative',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  quoteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 14,
  },
  quoteText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10b981',
    fontStyle: 'italic',
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 16,
    fontWeight: '400',
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    gap: 20,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    gap: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
