import { Tabs } from 'expo-router';
import React from 'react';
import { FloatingIslandTabBar } from '../../components';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingIslandTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Calculadoras' }}
      />
      <Tabs.Screen
        name="loans"
        options={{ title: 'Préstamos' }}
      />
    </Tabs>
  );
}
