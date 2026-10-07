import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AURA_COLORS } from '../../../constants/theme';

export interface LoanStepperProps {
  /** Valor numérico o texto formateado a mostrar en el centro */
  value: React.ReactNode;
  /** Sufijo o unidad que acompaña al valor (e.g. "Meses", "%", "/ cuota") */
  suffix?: React.ReactNode;
  /** Callback al presionar el botón de decremento [-] */
  onDecrement: () => void;
  /** Callback al presionar el botón de incremento [+] */
  onIncrement: () => void;
  /** Deshabilita el botón de decremento (e.g. cuando el valor es 0) */
  disableDecrement?: boolean;
  /** Deshabilita el botón de incremento */
  disableIncrement?: boolean;
  /** Clases CSS / NativeWind adicionales para el contenedor */
  className?: string;
}

/**
 * Control Stepper Estandarizado de Préstamos - Aura Financial V2.5
 * Replica el patrón ergonómico y visual de "Plazo y Periodicidad".
 */
export const LoanStepper: React.FC<LoanStepperProps> = ({
  value,
  suffix,
  onDecrement,
  onIncrement,
  disableDecrement = false,
  disableIncrement = false,
  className = '',
}) => {
  return (
    <View
      className={`flex-row items-center justify-between bg-gray-100 p-1.5 rounded-full border border-gray-200/50 ${className}`}
    >
      {/* Botón Decremento [-] */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDecrement}
        disabled={disableDecrement}
        className={`w-10 h-10 rounded-full bg-white border border-gray-200/60 items-center justify-center ${
          disableDecrement ? 'opacity-35' : ''
        }`}
      >
        <Ionicons name="remove" size={20} color={AURA_COLORS.textDark} />
      </TouchableOpacity>

      {/* Bloque Central de Valor Numérico con Tabular Nums */}
      <View className="flex-row items-baseline gap-1.5">
        <Text
          className="text-xl font-black text-textDark"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {value}
        </Text>
        {suffix && (
          typeof suffix === 'string' ? (
            <Text className="text-sm font-bold text-textMutedDark">
              {suffix}
            </Text>
          ) : (
            suffix
          )
        )}
      </View>

      {/* Botón Incremento [+] */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onIncrement}
        disabled={disableIncrement}
        className={`w-10 h-10 rounded-full bg-white border border-gray-200/60 items-center justify-center ${
          disableIncrement ? 'opacity-35' : ''
        }`}
      >
        <Ionicons name="add" size={20} color={AURA_COLORS.textDark} />
      </TouchableOpacity>
    </View>
  );
};
