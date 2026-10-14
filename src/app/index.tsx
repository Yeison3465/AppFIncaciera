import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { AURA_COLORS } from '../constants/theme';

/**
 * Punto de entrada principal de Finanzas App.
 * Controla la navegación inicial:
 * - Si no hay sesión activa: Redirige a /login
 * - Si hay sesión vigente: Redirige a /(tabs)
 */
export default function AppEntry() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F7F8]">
        <View className="w-14 h-14 rounded-2xl bg-obsidian items-center justify-center mb-4 shadow-sm">
          <Text className="text-2xl font-black text-amberGold tracking-tighter">A</Text>
        </View>
        <ActivityIndicator size="small" color={AURA_COLORS.amberGold} />
        <Text className="text-xs font-semibold text-textMutedDark mt-3">
          Verificando credenciales seguras...
        </Text>
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
