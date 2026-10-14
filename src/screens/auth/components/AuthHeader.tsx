import React from 'react';
import { View, Text } from 'react-native';
import { AURA_COLORS } from '../../../constants/theme';

/**
 * Encabezado de Identidad Aura Financial (Aura Financial V2.5 / Stitch 1:1)
 * Monograma distintivo con acento Amber Gold y badge de Banca Digital Exclusiva.
 */
export const AuthHeader: React.FC = () => {
  return (
    <View className="items-center justify-center pt-2 pb-5 px-4">
      {/* Monograma FinanzasApp con acento Amber Gold */}
      <View className="relative items-center justify-center w-14 h-14 rounded-full bg-obsidian shadow-md mb-2.5">
        <Text className="text-white text-2xl font-black tracking-tighter">
          F
        </Text>
        <View
          className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-obsidian"
          style={{ backgroundColor: AURA_COLORS.amberGold }}
        />
      </View>

      {/* Título de Marca y Aplicación */}
      <View className="items-center justify-center mb-1">
        <Text className="text-2xl font-bold text-textDark tracking-tight">
          FinanzasApp
        </Text>
      </View>
    </View>
  );
};
