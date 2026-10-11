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
      {/* Monograma Aura con acento Amber Gold */}
      <View className="relative items-center justify-center w-14 h-14 rounded-full bg-obsidian shadow-md mb-2.5">
        <Text className="text-white text-2xl font-black tracking-tighter">
          A
        </Text>
        <View
          className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-obsidian"
          style={{ backgroundColor: AURA_COLORS.amberGold }}
        />
      </View>

      {/* Título de Marca y Aplicación */}
      <View className="flex-row items-center justify-center gap-1.5 mb-1.5">
        <Text className="text-xl font-bold text-textDark tracking-tight">
          Aura Financial
        </Text>
        <Text className="text-base text-textMuted font-light">
          · FinanzasApp
        </Text>
      </View>

      {/* Pill Badge Exclusiva */}
      <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-gray-200/80 mt-0.5">
        <View
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: AURA_COLORS.amberGold }}
        />
        <Text className="text-[11px] uppercase tracking-wider font-bold text-textMutedDark">
          Banca Digital Exclusiva
        </Text>
      </View>
    </View>
  );
};
