import React from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../constants/theme';

interface IconButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  label?: string;
  variant?: 'obsidian' | 'amber' | 'outline' | 'surface';
  size?: number;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * Botón Circular de Acción Rápida (FAB / Quick Action) - Aura Financial V2.5
 * Implementado con Tailwind CSS / NativeWind seguro contra race conditions.
 */
export const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  onPress,
  label,
  variant = 'surface',
  size = 48,
  disabled = false,
  style,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'obsidian':
        return AURA_COLORS.obsidian;
      case 'amber':
        return AURA_COLORS.amberGold;
      case 'outline':
        return 'transparent';
      case 'surface':
      default:
        return '#FFFFFF';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'obsidian':
        return AURA_COLORS.textPrimary;
      case 'amber':
        return AURA_COLORS.textDark;
      case 'outline':
      case 'surface':
      default:
        return AURA_COLORS.textDark;
    }
  };

  const isOutline = variant === 'outline';

  return (
    <View className="items-center">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled}
        className={`items-center justify-center ${
          isOutline ? 'border border-borderLight' : ''
        }`}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: getBackgroundColor(),
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        <Ionicons name={iconName} size={size * 0.44} color={getIconColor()} />
      </TouchableOpacity>
      {label ? (
        <Text className="text-[11px] font-semibold text-textMuted mt-1">
          {label}
        </Text>
      ) : null}
    </View>
  );
};
