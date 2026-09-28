import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../constants/theme';

interface FinancialStepperProps {
  label: string;
  subLabel?: string;
  value: number;
  onChange: (val: number) => void;
  step?: number;
  min?: number;
  max?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  accessoryIcon?: keyof typeof Ionicons.glyphMap;
  onAccessoryPress?: () => void;
  badgeText?: string;
  badgeVariant?: 'amber' | 'emerald' | 'neutral';
  style?: ViewStyle;
}

/**
 * Input Numérico Bloque Financiero (FinancialStepper) - Aura Financial V2.5
 * Control numérico de alta precisión para capitales, aportes, plazos y tasas.
 * Con regla obligatoria de números tabulares (tabular-nums).
 */
export const FinancialStepper: React.FC<FinancialStepperProps> = ({
  label,
  subLabel,
  value,
  onChange,
  step = 100,
  min = 0,
  max,
  decimals = 0,
  prefix,
  suffix,
  accessoryIcon,
  onAccessoryPress,
  badgeText,
  badgeVariant = 'neutral',
  style,
}) => {
  const [textValue, setTextValue] = useState<string>(
    decimals > 0 ? value.toFixed(decimals) : String(value)
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (!isEditing) {
      setTextValue(decimals > 0 ? value.toFixed(decimals) : String(value));
    }
  }, [value, decimals, isEditing]);

  const handleDecrement = () => {
    const next = Math.max(min, Number((value - step).toFixed(decimals > 0 ? decimals : 2)));
    onChange(next);
  };

  const handleIncrement = () => {
    const next = max !== undefined ? Math.min(max, Number((value + step).toFixed(decimals > 0 ? decimals : 2))) : Number((value + step).toFixed(decimals > 0 ? decimals : 2));
    onChange(next);
  };

  const handleTextChange = (text: string) => {
    setTextValue(text);
    const parsed = parseFloat(text.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= min && (max === undefined || parsed <= max)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseFloat(textValue.replace(',', '.'));
    if (isNaN(parsed) || parsed < min) {
      onChange(min);
      setTextValue(decimals > 0 ? min.toFixed(decimals) : String(min));
    } else if (max !== undefined && parsed > max) {
      onChange(max);
      setTextValue(decimals > 0 ? max.toFixed(decimals) : String(max));
    } else {
      setTextValue(decimals > 0 ? parsed.toFixed(decimals) : String(parsed));
    }
  };

  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'amber':
        return {
          bg: AURA_COLORS.amberGoldLight,
          text: AURA_COLORS.amberGold,
        };
      case 'emerald':
        return {
          bg: AURA_COLORS.emeraldGreenLight,
          text: AURA_COLORS.emeraldGreen,
        };
      case 'neutral':
      default:
        return {
          bg: '#E4E4E7',
          text: AURA_COLORS.textMutedDark,
        };
    }
  };

  const badgeColors = getBadgeStyle();

  return (
    <View style={[styles.container, style]}>
      {/* Header con Labels y Badges */}
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.headerRight}>
          {badgeText && (
            <View style={[styles.badge, { backgroundColor: badgeColors.bg }]}>
              <Text style={[styles.badgeText, { color: badgeColors.text }]}>{badgeText}</Text>
            </View>
          )}
          {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
        </View>
      </View>

      {/* Fila del Control Numérico */}
      <View style={styles.stepperBox}>
        {/* Botón Decremento */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDecrement}
          style={styles.stepButton}
        >
          <Ionicons name="remove" size={20} color={AURA_COLORS.textDark} />
        </TouchableOpacity>

        {/* Bloque Central de Valor con Tabular Nums */}
        <View style={styles.valueRow}>
          {prefix && <Text style={styles.prefixText}>{prefix}</Text>}
          <TextInput
            keyboardType="numeric"
            value={textValue}
            onFocus={() => setIsEditing(true)}
            onChangeText={handleTextChange}
            onBlur={handleBlur}
            style={styles.numericInput}
            selectTextOnFocus
          />
          {suffix && <Text style={styles.suffixText}>{suffix}</Text>}
        </View>

        {/* Botón Incremento */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleIncrement}
          style={styles.stepButton}
        >
          <Ionicons name="add" size={20} color={AURA_COLORS.textDark} />
        </TouchableOpacity>

        {/* Icono Accesorio opcional */}
        {accessoryIcon && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onAccessoryPress}
            style={styles.accessoryButton}
          >
            <Ionicons name={accessoryIcon} size={18} color={AURA_COLORS.textMutedDark} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subLabel: {
    fontSize: 12,
    color: AURA_COLORS.textMutedDark,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 6,
    height: 58,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  valueRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  prefixText: {
    fontSize: 18,
    fontWeight: '700',
    color: AURA_COLORS.textDark,
    marginRight: 6,
    fontVariant: ['tabular-nums'],
  },
  suffixText: {
    fontSize: 16,
    fontWeight: '700',
    color: AURA_COLORS.textDark,
    marginLeft: 6,
    fontVariant: ['tabular-nums'],
  },
  numericInput: {
    fontSize: 20,
    fontWeight: '800',
    color: AURA_COLORS.textDark,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    paddingVertical: 0,
    minWidth: 70,
  },
  accessoryButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
    marginLeft: 4,
  },
});
