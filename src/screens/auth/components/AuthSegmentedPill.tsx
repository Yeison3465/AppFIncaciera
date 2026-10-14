import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthTabMode } from '../../../types/auth';

import { AURA_COLORS } from '../../../constants/theme';

interface AuthSegmentedPillProps {
  mode: AuthTabMode;
  onChangeMode: (mode: AuthTabMode) => void;
}

/**
 * Selector de Modo de Autenticación Segmentado (Stitch 1:1)
 * Permite conmutar con suavidad entre "Iniciar Sesión" y "Registrarse".
 * Implementado con estilos estables para prevenir advertencias de actualización de NativeWind.
 */
export const AuthSegmentedPill: React.FC<AuthSegmentedPillProps> = ({
  mode,
  onChangeMode,
}) => {
  return (
    <View className="px-4 mb-4">
      <View className="p-1 rounded-full bg-gray-200/80 flex-row items-center">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onChangeMode('login')}
          className="flex-1 py-2.5 rounded-full items-center justify-center"
          style={{
            backgroundColor: mode === 'login' ? AURA_COLORS.obsidian : 'transparent',
          }}
        >
          <Text
            className="text-xs font-semibold tracking-wide"
            style={{
              color: mode === 'login' ? '#FFFFFF' : AURA_COLORS.textMutedDark,
            }}
          >
            Iniciar Sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onChangeMode('register')}
          className="flex-1 py-2.5 rounded-full items-center justify-center"
          style={{
            backgroundColor: mode === 'register' ? AURA_COLORS.obsidian : 'transparent',
          }}
        >
          <Text
            className="text-xs font-semibold tracking-wide"
            style={{
              color: mode === 'register' ? '#FFFFFF' : AURA_COLORS.textMutedDark,
            }}
          >
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
