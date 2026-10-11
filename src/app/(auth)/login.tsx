import React from 'react';
import { useRouter } from 'expo-router';
import { AuthScreen } from '../../screens';

export default function LoginRoute() {
  const router = useRouter();

  return (
    <AuthScreen
      initialMode="login"
      onNavigateHome={() => router.replace('/(tabs)')}
    />
  );
}
