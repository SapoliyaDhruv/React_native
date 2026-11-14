import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const icon = (name: IconName, activeName: IconName = name) =>
    function TabIcon({ color, focused }: { color: import('react-native').ColorValue; focused: boolean }) {
      return (
        <View style={[styles.tabPill, { backgroundColor: focused ? colors.primaryFixed : 'transparent' }]}>
          <MaterialIcons name={focused ? activeName : name} size={22} color={focused ? colors.primary : (color as string)} />
        </View>
      );
    };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineVariant,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? 84 : 64 + Math.max(insets.bottom, 6),
          paddingBottom: Math.max(insets.bottom, 6),
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: MindSprintFonts.label,
          fontSize: 12,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home') }} />
      <Tabs.Screen name="courses" options={{ title: 'Courses', tabBarIcon: icon('menu-book', 'auto-stories') }} />
      <Tabs.Screen name="video" options={{ title: 'Lectures', tabBarIcon: icon('play-circle-outline', 'play-circle-filled') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person-outline', 'person') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabPill: {
    width: 56,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
