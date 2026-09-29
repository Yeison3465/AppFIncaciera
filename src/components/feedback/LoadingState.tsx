import React from 'react';
import { View, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { AURA_COLORS } from '../../constants/theme';

interface LoadingStateProps {
  message?: string;
  subtitle?: string;
  infrastructureBadge?: string;
  style?: ViewStyle;
}

/**
 * LoadingState - Aura Financial V2.5
 * Spinner animado con subtítulo y badge técnico de infraestructura.
 * Implementado con Tailwind CSS / NativeWind.
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Sincronizando Simulación...',
  subtitle = 'Calculando proyección matemática',
  infrastructureBadge = 'PostgreSQL RLS',
  style,
}) => {
  return (
    <View
      className="bg-cardWhite rounded-2xl p-4 border border-gray-200 my-2.5"
      style={style}
    >
      <View className="flex-row items-center">
        <ActivityIndicator
          size="small"
          color={AURA_COLORS.amberGold}
          style={{ marginRight: 12 }}
        />
        <View className="flex-1">
          <Text className="text-[13px] font-bold text-textDark">{message}</Text>
          <Text className="text-[11px] text-textMutedDark mt-0.5">{subtitle}</Text>
        </View>
        {infrastructureBadge && (
          <View className="px-2 py-0.5 bg-amber-100 rounded-md ml-2">
            <Text className="text-[10px] font-bold text-amber-700">{infrastructureBadge}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
