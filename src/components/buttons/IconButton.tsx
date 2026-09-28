import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
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
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: getBackgroundColor(),
          },
          isOutline && styles.outlineBorder,
          disabled && styles.disabled,
          style,
        ]}
      >
        <Ionicons name={iconName} size={size * 0.44} color={getIconColor()} />
      </TouchableOpacity>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  outlineBorder: {
    borderWidth: 1.5,
    borderColor: AURA_COLORS.borderLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: AURA_COLORS.textMutedDark,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});
