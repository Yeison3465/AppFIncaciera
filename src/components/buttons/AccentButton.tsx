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

interface AccentButtonProps {
  title: string;
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Botón Acento (Amber Gold) - Aura Financial V2.5
 * Fondo #FF9E00, altura 52px, radio 9999px (píldora), texto oscuro enérgico.
 * Implementado con Tailwind CSS / NativeWind seguro contra race conditions.
 */
export const AccentButton: React.FC<AccentButtonProps> = ({
  title,
  onPress,
  iconName = 'calculator',
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
      className="h-[52px] bg-amberGold rounded-full flex-row items-center justify-center px-6"
      style={[{ opacity: disabled ? 0.5 : 1 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={AURA_COLORS.textDark} size="small" />
      ) : (
        <View className="flex-row items-center justify-center">
          {iconName && (
            <Ionicons
              name={iconName}
              size={18}
              color={AURA_COLORS.textDark}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            className="text-textDark text-[15px] font-extrabold tracking-wide"
            style={textStyle}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
