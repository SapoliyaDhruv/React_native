import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';
import { MindSprintThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import {
  useFonts,
  BalooBhai2_600SemiBold,
  BalooBhai2_700Bold,
  BalooBhai2_800ExtraBold,
} from '@expo-google-fonts/baloo-bhai-2';

function InitialLayout() {
  const { user, isLoading, hasCompletedOnboarding } = useAuth();
  // Heading font (Gujarati + Latin). If it fails to load we still render with system fonts.
  const [fontsLoaded, fontError] = useFonts({
    BalooBhai2_600SemiBold,
    BalooBhai2_700Bold,
    BalooBhai2_800ExtraBold,
  });
  const fontsReady = fontsLoaded || !!fontError;
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const currentScreen = segments[0] as string | undefined;

    if (!hasCompletedOnboarding && currentScreen !== 'onboarding') {
      router.replace('/onboarding');
      return;
    }

    if (hasCompletedOnboarding) {
      const inAuthGroup = currentScreen === 'login';
      const inOnboarding = currentScreen === 'onboarding';

      if (!user && !inAuthGroup && !inOnboarding) {
        router.replace('/login');
      } else if (user && (inAuthGroup || inOnboarding)) {
        router.replace('/(tabs)');
      }
    }
  }, [user, isLoading, hasCompletedOnboarding, segments]);

  if (isLoading || !fontsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#12245C', gap: 16 }}>
        <ActivityIndicator size="large" color="#F4A30B" />
        <Text style={{ color: '#B9C6EA', fontSize: 14, fontWeight: '600' }}>
          MindSprint
        </Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="exam" options={{ headerShown: false }} />
      <Stack.Screen name="flashcards" options={{ headerShown: false }} />
      <Stack.Screen name="cheatsheets" options={{ headerShown: false }} />
      <Stack.Screen name="bookmarks" options={{ headerShown: false }} />
      <Stack.Screen name="exam-review" options={{ headerShown: false }} />
      <Stack.Screen name="error-vault" options={{ headerShown: false }} />
      <Stack.Screen name="doubt-solver" options={{ headerShown: false }} />
      <Stack.Screen name="board-exam-simulator" options={{ headerShown: false }} />
      <Stack.Screen name="interview-simulator" options={{ headerShown: false }} />
      <Stack.Screen name="quiz-duel" options={{ headerShown: false }} />
      <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
      <Stack.Screen name="mastery-analytics" options={{ headerShown: false }} />
      <Stack.Screen name="profile-edit" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <MindSprintThemeProvider>
            <InitialLayout />
          </MindSprintThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
