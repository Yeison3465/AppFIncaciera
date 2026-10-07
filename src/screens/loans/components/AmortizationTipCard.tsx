import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

/**
 * Tarjeta de Consejo Financiero: Optimización de Amortización
 * Estilo idéntico a las tarjetas educativas de la pestaña Calculadoras ("Efecto Bola de Nieve").
 */
export const AmortizationTipCard: React.FC = () => {
  return (
    <View className="bg-gray-100 rounded-2xl p-4 flex-row items-start">
      <View className="w-10 h-10 rounded-full bg-[#FEEBC8] items-center justify-center mr-3.5 mt-0.5">
        <Ionicons name="bulb" size={20} color="#F59E0B" />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-bold text-textDark mb-1">
          Optimización de Amortización
        </Text>
        <Text className="text-xs text-gray-600 leading-[19px] font-normal">
          Al realizar abonos extraordinarios a capital en los primeros 6 periodos, reduces significativamente el total de intereses pagados sin penalizaciones financieras.
        </Text>
      </View>
    </View>
  );
};
