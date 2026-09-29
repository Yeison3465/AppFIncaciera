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

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  variant?: 'outline' | 'filledLight';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Botón Secundario (Outline / Filled Light) - Aura Financial V2.5
 * Altura 52px, radio 9999px.
 * Implementado con Tailwind CSS / NativeWind seguro contra race conditions.
 */
export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  iconName,
  variant = 'filledLight',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      className={`h-[52px] rounded-full flex-row items-center justify-center px-5 ${
        isOutline
          ? 'bg-transparent border-[1.5px] border-borderLight'
          : 'bg-[#EBECEF]'
      }`}
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
            className="text-textDark text-sm font-semibold"
            style={textStyle}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
