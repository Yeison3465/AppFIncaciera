import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../constants/theme';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  style?: ViewStyle;
}

/**
 * ErrorBanner - Aura Financial V2.5
 * Banner de alerta inline descartable para validaciones y excepciones.
 * Implementado con Tailwind CSS / NativeWind.
 */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = 'Ha ocurrido un error',
  message,
  onDismiss,
  style,
}) => {
  return (
    <View
      className="bg-redAlertLight rounded-[14px] p-3.5 flex-row items-center border border-red-200 my-2"
      style={style}
    >
      <View className="w-8 h-8 rounded-full bg-[#FEE2E2] items-center justify-center mr-2.5">
        <Ionicons name="alert-circle" size={18} color={AURA_COLORS.redAlert} />
      </View>
      <View className="flex-1">
        <Text className="text-xs font-bold text-red-800 mb-0.5">{title}</Text>
        <Text className="text-xs text-red-700 leading-4">{message}</Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} className="p-1 ml-1.5">
          <Ionicons name="close" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
};
