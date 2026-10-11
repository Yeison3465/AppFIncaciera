import React from 'react';
import { useRouter } from 'expo-router';
import { AuthScreen } from '../../screens';

export default function RegisterRoute() {
  const router = useRouter();

  return (
    <AuthScreen
      initialMode="register"
      onNavigateHome={() => router.replace('/(tabs)')}
    />
  );
}
