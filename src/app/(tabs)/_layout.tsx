import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#000' },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Inicio' }}
      />
      <Tabs.Screen
        name="transactions"
        options={{ title: 'Transacciones' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil' }}
      />
    </Tabs>
  );
}

