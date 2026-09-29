import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfoBannerProps {
  title: string;
  description: string;
  style?: ViewStyle;
}

/**
 * InfoBanner - Aura Financial V2.5
 * Banner educativo / explicativo con ícono de bombilla para fórmulas y conceptos.
 * Implementado con Tailwind CSS / NativeWind.
 */
export const InfoBanner: React.FC<InfoBannerProps> = ({
  title,
  description,
  style,
}) => {
  return (
    <View
      className="bg-amber-50 rounded-2xl p-4 flex-row items-start border border-amber-100 my-2.5"
      style={style}
    >
      <View className="w-8 h-8 rounded-full bg-amber-200 items-center justify-center mr-3">
        <Ionicons name="bulb" size={18} color="#D97706" />
      </View>
      <View className="flex-1">
        <Text className="text-[13px] font-bold text-amber-900 mb-1">{title}</Text>
        <Text className="text-xs text-amber-800 leading-[18px] font-normal">{description}</Text>
      </View>
    </View>
  );
};
