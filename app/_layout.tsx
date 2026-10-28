import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';
import { MindSprintThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

function InitialLayout() {
  const { user, isLoading, hasCompletedOnboarding } = useAuth();
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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', gap: 16 }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', letterSpacing: 0.2 }}>
          "Be the better version of yourself"
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
        <MindSprintThemeProvider>
          <InitialLayout />
        </MindSprintThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
