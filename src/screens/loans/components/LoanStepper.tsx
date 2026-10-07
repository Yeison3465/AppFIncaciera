import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AURA_COLORS } from '../../../constants/theme';

export interface LoanStepperProps {
  /** Valor numérico controlado editable desde el teclado */
  numericValue?: number;
  /** Callback al editar el número directamente o con botones */
  onChangeNumber?: (val: number) => void;
  /** Valor estático o formateado para retrocompatibilidad */
  value?: React.ReactNode;
  /** Prefijo monetario o símbolo (ej. "$") */
  prefix?: string;
  /** Sufijo o unidad que acompaña al valor (e.g. "Meses", "%", "/ cuota") */
  suffix?: React.ReactNode;
  /** Valor mínimo permitido (default: 0) */
  min?: number;
  /** Valor máximo permitido opcional */
  max?: number;
  /** Número de decimales (default: 0) */
  decimals?: number;
  /** Placeholder cuando el campo está vacío */
  placeholder?: string;
  /** Callback al presionar el botón de decremento [-] */
  onDecrement?: () => void;
  /** Callback al presionar el botón de incremento [+] */
  onIncrement?: () => void;
  /** Deshabilita el botón de decremento */
  disableDecrement?: boolean;
  /** Deshabilita el botón de incremento */
  disableIncrement?: boolean;
  /** Clases CSS / NativeWind adicionales para el contenedor */
  className?: string;
}

/**
 * Control Stepper Estandarizado de Préstamos - Aura Financial V2.5
 * Soporta edición directa táctil/teclado con formateo automático en vivo y botones de microajuste.
 */
export const LoanStepper: React.FC<LoanStepperProps> = ({
  numericValue,
  onChangeNumber,
  value,
  prefix,
  suffix,
  min = 0,
  max,
  decimals = 0,
  placeholder = '0',
  onDecrement,
  onIncrement,
  disableDecrement = false,
  disableIncrement = false,
  className = '',
}) => {
  const isEditable = onChangeNumber !== undefined;

  const formatDisplay = (num?: number): string => {
    if (num === undefined || isNaN(num)) return '0';
    if (decimals > 0) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    return num.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
  };

  const initialText = numericValue !== undefined ? (numericValue > 0 ? String(numericValue) : '0') : '';
  const [textValue, setTextValue] = useState<string>(initialText);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (!isEditing && numericValue !== undefined) {
      setTextValue(numericValue > 0 ? String(numericValue) : '0');
    }
  }, [numericValue, isEditing]);

  const handleFocus = () => {
    if (!isEditable) return;
    setIsEditing(true);
    setTextValue(numericValue !== undefined && numericValue > 0 ? String(numericValue) : '');
  };

  const handleTextChange = (text: string) => {
    // Permitir dígitos y coma/punto para decimales
    const sanitized = decimals > 0 
      ? text.replace(/[^0-9.,]/g, '')
      : text.replace(/[^0-9]/g, '');

    setTextValue(sanitized);

    if (sanitized === '' || sanitized === '.' || sanitized === ',') {
      if (onChangeNumber) onChangeNumber(min);
      return;
    }

    const normalized = sanitized.replace(',', '.');
    const parsed = parseFloat(normalized);

    if (!isNaN(parsed)) {
      let finalVal = parsed;
      if (max !== undefined && finalVal > max) {
        finalVal = max;
      }
      if (onChangeNumber) {
        onChangeNumber(finalVal);
      }
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (!textValue || textValue.trim() === '') {
      if (onChangeNumber) onChangeNumber(min);
      setTextValue(String(min));
      return;
    }

    const normalized = textValue.replace(',', '.');
    let parsed = parseFloat(normalized);

    if (isNaN(parsed) || parsed < min) {
      parsed = min;
    } else if (max !== undefined && parsed > max) {
      parsed = max;
    }

    if (decimals > 0) {
      parsed = Number(parsed.toFixed(decimals));
    } else {
      parsed = Math.round(parsed);
    }

    if (onChangeNumber) onChangeNumber(parsed);
    setTextValue(String(parsed));
  };

  const displayFormatted = isEditing
    ? textValue
    : numericValue !== undefined
      ? formatDisplay(numericValue)
      : value !== undefined
        ? String(value)
        : '0';

  return (
    <View
      className={`flex-row items-center justify-between bg-gray-100 p-1.5 rounded-full border ${
        isEditing ? 'border-amber-400 bg-amber-50/20' : 'border-gray-200/50'
      } ${className}`}
    >
      {/* Botón Decremento [-] */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDecrement}
        disabled={disableDecrement || !onDecrement}
        className={`w-10 h-10 rounded-full bg-white border border-gray-200/60 items-center justify-center ${
          disableDecrement || !onDecrement ? 'opacity-35' : ''
        }`}
      >
        <Ionicons name="remove" size={20} color={AURA_COLORS.textDark} />
      </TouchableOpacity>

      {/* Bloque Central de Valor Numérico con Edición Directa por Teclado */}
      <View className="flex-1 flex-row items-center justify-center px-1">
        {prefix && (
          <Text
            className="text-lg font-black text-textDark mr-1"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {prefix}
          </Text>
        )}

        {isEditable ? (
          <TextInput
            keyboardType={decimals > 0 ? (Platform.OS === 'ios' ? 'decimal-pad' : 'numeric') : 'number-pad'}
            value={displayFormatted}
            onFocus={handleFocus}
            onChangeText={handleTextChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            className="text-xl font-black text-textDark text-center py-1 min-w-[70px] max-w-[160px]"
            style={{
              fontVariant: ['tabular-nums'],
              ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
            }}
            selectTextOnFocus
          />
        ) : (
          <Text
            className="text-xl font-black text-textDark"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {value}
          </Text>
        )}

        {suffix && (
          typeof suffix === 'string' ? (
            <Text className="text-sm font-bold text-textMutedDark ml-1">
              {suffix}
            </Text>
          ) : (
            <View className="ml-1">{suffix}</View>
          )
        )}
      </View>

      {/* Botón Incremento [+] */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onIncrement}
        disabled={disableIncrement || !onIncrement}
        className={`w-10 h-10 rounded-full bg-white border border-gray-200/60 items-center justify-center ${
          disableIncrement || !onIncrement ? 'opacity-35' : ''
        }`}
      >
        <Ionicons name="add" size={20} color={AURA_COLORS.textDark} />
      </TouchableOpacity>
    </View>
  );
};
