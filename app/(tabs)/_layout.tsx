import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDarkMode ? '#94a3b8' : '#64748b',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#0f1423' : '#ffffff',
          borderTopColor: colors.outlineVariant,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 62 + Math.max(insets.bottom, 6),
          paddingBottom: Math.max(insets.bottom, 6),
          paddingTop: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDarkMode ? 0.35 : 0.06,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabPill,
                {
                  backgroundColor: focused
                    ? isDarkMode
                      ? 'rgba(129,140,248,0.2)'
                      : '#e0e7ff'
                    : 'transparent',
                },
              ]}
            >
              <MaterialIcons
                name={focused ? 'home' : 'home'}
                size={23}
                color={focused ? colors.primary : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabPill,
                {
                  backgroundColor: focused
                    ? isDarkMode
                      ? 'rgba(129,140,248,0.2)'
                      : '#e0e7ff'
                    : 'transparent',
                },
              ]}
            >
              <MaterialIcons
                name="menu-book"
                size={22}
                color={focused ? colors.primary : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="video"
        options={{
          title: 'Lectures',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabPill,
                {
                  backgroundColor: focused
                    ? isDarkMode
                      ? 'rgba(129,140,248,0.2)'
                      : '#e0e7ff'
                    : 'transparent',
                },
              ]}
            >
              <MaterialIcons
                name={focused ? 'ondemand-video' : 'ondemand-video'}
                size={22}
                color={focused ? colors.primary : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabPill,
                {
                  backgroundColor: focused
                    ? isDarkMode
                      ? 'rgba(129,140,248,0.2)'
                      : '#e0e7ff'
                    : 'transparent',
                },
              ]}
            >
              <MaterialIcons
                name={focused ? 'person' : 'person-outline'}
                size={23}
                color={focused ? colors.primary : color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabPill: {
    width: 48,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


