import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../../constants/theme';

/**
 * Pie de Seguridad y Certificación Bancaria (Stitch 1:1)
 * Protocolo de cifrado y módulos HSM.
 */
export const AuthSecurityFooter: React.FC = () => {
  return (
    <View className="mt-6 mb-8 px-4 items-center justify-center text-center">
      {/* Badge de Certificación */}
      <View className="flex-row items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-200/80 shadow-xs mb-2">
        <Ionicons
          name="shield-checkmark"
          size={16}
          color={AURA_COLORS.emeraldGreen}
        />
        <Text className="text-xs font-semibold text-textDark">
          Cifrado Bancario SSL 256-Bit
        </Text>
        <View className="w-1 h-1 rounded-full bg-gray-400 mx-0.5" />
        <Text className="text-xs font-light text-textMutedDark">
          ISO/IEC 27001
        </Text>
      </View>

      {/* Leyenda explicativa de resguardo criptográfico */}
      <Text className="text-[11px] text-center text-textMutedDark/90 max-w-xs leading-4">
        Tus transacciones y llaves criptográficas están resguardadas en módulos
        de hardware seguro (HSM).
      </Text>
    </View>
  );
};
