import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../constants/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  iconColor?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Botón Primario (Obsidian) - Aura Financial V2.5
 * Fondo #121316, altura 52px, radio 9999px (píldora).
 * Implementado con Tailwind CSS / NativeWind seguro contra race conditions.
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  iconName = 'arrow-forward',
  iconPosition = 'right',
  iconColor,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      className="h-[52px] bg-obsidian rounded-full flex-row items-center justify-center px-6"
      style={[{ opacity: disabled ? 0.5 : 1 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={AURA_COLORS.textPrimary} size="small" />
      ) : (
        <View className="flex-row items-center justify-center">
          {iconName && iconPosition === 'left' && (
            <Ionicons
              name={iconName}
              size={18}
              color={iconColor ?? AURA_COLORS.textPrimary}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            className="text-textPrimary text-[15px] font-bold tracking-wide"
            style={textStyle}
          >
            {title}
          </Text>
          {iconName && iconPosition === 'right' && (
            <Ionicons
              name={iconName}
              size={18}
              color={iconColor ?? AURA_COLORS.textPrimary}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};
