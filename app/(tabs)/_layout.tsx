import { Tabs } from 'expo-router';
import { Home, Library, Search, Settings, Users } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type IconProps = {
  color: string;
  size: number;
};

export default function TabLayout() {
  const { theme, isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDarkMode ? '#888' : '#666',
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          elevation: 0,
          shadowOpacity: 0.1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: theme.card,
          elevation: 0,
          shadowOpacity: 0.1,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.text,
          fontSize: 18,
        },
        headerShown: true,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        lazy: true,
        freezeOnBlur: Platform.OS === 'android',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }: IconProps) => <Home size={size} color={color} />,
          headerTitle: 'Buch App',
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Entdecken',
          tabBarIcon: ({ color, size }: IconProps) => <Search size={size} color={color} />,
          headerTitle: 'Bücher entdecken',
        }}
      />
      <Tabs.Screen
        name="my-books"
        options={{
          title: 'Meine Bücher',
          tabBarIcon: ({ color, size }: IconProps) => <Library size={size} color={color} />,
          headerTitle: 'Meine Bibliothek',
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }: IconProps) => <Users size={size} color={color} />,
          headerTitle: 'Community',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Einstellungen',
          tabBarIcon: ({ color, size }: IconProps) => <Settings size={size} color={color} />,
          headerTitle: 'Einstellungen',
        }}
      />
    </Tabs>
  );
}
