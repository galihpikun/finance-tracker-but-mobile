import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: "#22c55e",
    tabBarInactiveTintColor: "#94a3b8",

    tabBarStyle: {
      position: "absolute",
      bottom: 20,
      left: 16,
      right: 16,
      height: 70,
      borderRadius: 20,
      backgroundColor: "#1e293b",
      borderTopWidth: 0,
      elevation: 10,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },

    tabBarLabelStyle: {
      fontSize: 12,
      marginBottom: 6,
    },

    tabBarIconStyle: {
      marginTop: 6,
    },

    tabBarButton: HapticTab,
  }}
>
      <Tabs.Screen
  name="home"
  options={{
    title: "Home",
    tabBarIcon: ({ color }) => (
      <IconSymbol size={24} name="house.fill" color={color} />
    ),
  }}
/>
      <Tabs.Screen
  name="dashboard"
  options={{
    title: "Dashboard",
    tabBarIcon: ({ color }) => (
      <IconSymbol size={24} name="chart.pie.fill" color={color} />
    ),
  }}
/>

<Tabs.Screen
  name="savings"
  options={{
    title: "Savings",
    tabBarIcon: ({ color }) => (
      <IconSymbol size={24} name="wallet.pass.fill" color={color} />
    ),
  }}
/>

<Tabs.Screen
  name="profile"
  options={{
    title: "Profile",
    tabBarIcon: ({ color }) => (
      <IconSymbol size={24} name="person.fill" color={color} />
    ),
  }}
/>
    </Tabs>
  );
}
