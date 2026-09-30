import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../constants/theme';

interface FinancialStepperProps {
  label: string;
  labelClassName?: string;
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
 * Implementado con Tailwind CSS / NativeWind y regla obligatoria de tabular-nums.
 */
export const FinancialStepper: React.FC<FinancialStepperProps> = ({
  label,
  labelClassName,
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
  const formattedValue = decimals > 0 ? value.toFixed(decimals) : String(value);
  const [textValue, setTextValue] = useState<string>(formattedValue);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const displayValue = isEditing ? textValue : formattedValue;

  const handleDecrement = () => {
    const next = Math.max(min, Number((value - step).toFixed(decimals > 0 ? decimals : 2)));
    onChange(next);
  };

  const handleIncrement = () => {
    const next = max !== undefined ? Math.min(max, Number((value + step).toFixed(decimals > 0 ? decimals : 2))) : Number((value + step).toFixed(decimals > 0 ? decimals : 2));
    onChange(next);
  };

  const handleFocus = () => {
    setTextValue(formattedValue);
    setIsEditing(true);
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
    } else if (max !== undefined && parsed > max) {
      onChange(max);
    } else {
      onChange(parsed);
    }
  };

  const getBadgeClasses = () => {
    switch (badgeVariant) {
      case 'amber':
        return {
          bg: 'bg-amberGoldLight',
          text: 'text-amberGold',
        };
      case 'emerald':
        return {
          bg: 'bg-emeraldGreenLight',
          text: 'text-emeraldGreen',
        };
      case 'neutral':
      default:
        return {
          bg: 'bg-[#E4E4E7]',
          text: 'text-textMutedDark',
        };
    }
  };

  const badgeCls = getBadgeClasses();

  return (
    <View className="my-1.5" style={style}>
      {/* Header con Labels y Badges */}
      {(label || badgeText || subLabel) ? (
        <View className="flex-row justify-between items-center mb-1.5 px-0.5">
          {label ? (
            <Text className={labelClassName || "text-[13px] font-semibold text-gray-700"}>{label}</Text>
          ) : <View />}
          <View className="flex-row items-center gap-1.5">
          {badgeText && (
            <View className={`px-2 py-0.5 rounded-md ${badgeCls.bg}`}>
              <Text
                className={`text-[11px] font-bold ${badgeCls.text}`}
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {badgeText}
              </Text>
            </View>
          )}
          {subLabel && <Text className="text-xs text-textMutedDark font-medium">{subLabel}</Text>}
        </View>
      </View>
      ) : null}

      {/* Fila del Control Numérico */}
      <View className="flex-row items-center bg-gray-100 rounded-xl p-1 h-[54px]">
        {/* Botón Decremento */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDecrement}
          className="w-11 h-11 rounded-full bg-white items-center justify-center ml-[6px]"
        >
          <Ionicons name="remove" size={19} color={AURA_COLORS.textDark} />
        </TouchableOpacity>

        {/* Bloque Central de Valor con Tabular Nums */}
        <View className="flex-1 flex-row items-center justify-center px-2">
          {prefix && (
            <Text
              className="text-lg font-bold text-textDark mr-1.5"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {prefix}
            </Text>
          )}
          <TextInput
            keyboardType="numeric"
            value={displayValue}
            onFocus={handleFocus}
            onChangeText={handleTextChange}
            onBlur={handleBlur}
            className="text-xl font-extrabold text-textDark text-center py-0 min-w-[70px]"
            style={{ fontVariant: ['tabular-nums'] }}
            selectTextOnFocus
          />
          {suffix && (
            <Text
              className="text-base font-bold text-textDark ml-1.5"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {suffix}
            </Text>
          )}
        </View>

        {/* Botón Incremento */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleIncrement}
          className="w-11 h-11 rounded-full bg-white items-center justify-center mr-[6px]"
        >
          <Ionicons name="add" size={19} color={AURA_COLORS.textDark} />
        </TouchableOpacity>

        {/* Icono Accesorio opcional */}
        {accessoryIcon && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onAccessoryPress}
            className="w-9 h-9 rounded-[10px] items-center justify-center bg-gray-200 ml-1"
          >
            <Ionicons name={accessoryIcon} size={18} color={AURA_COLORS.textMutedDark} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
