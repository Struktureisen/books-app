import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Search, Library, Users, Settings } from 'lucide-react-native';

type IconProps = {
  color: string;
  size: number;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }: IconProps) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Suche',
          tabBarIcon: ({ color, size }: IconProps) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-books"
        options={{
          title: 'Meine Bücher',
          tabBarIcon: ({ color, size }: IconProps) => <Library size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }: IconProps) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Einstellungen',
          tabBarIcon: ({ color, size }: IconProps) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
