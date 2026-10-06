import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AURA_COLORS } from '../../constants/theme';

/**
 * LoansScreen - Aura Financial V2.5
 * Pantalla inicial de Préstamos (Fase 2).
 * Proporciona el punto de entrada y marcador de posición estilizado
 * bajo el sistema de diseño Aura Financial.
 */
export const LoansScreen: React.FC = () => {
  const insets = useSafeAreaInsets();


  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0
  );

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER SUPERIOR */}
      <View
        className="flex-row items-center justify-between px-5 pb-3 bg-white border-b border-[#F0F0F2]"
        style={{ paddingTop: topInset + 8 }}
      >
        <View className="flex-row items-center gap-3">
          <View className="w-[38px] h-[38px] rounded-full bg-obsidian items-center justify-center">
            <Text className="text-white font-extrabold text-base">A</Text>
          </View>
          <View>
            <Text className="text-[10px] font-bold text-textMutedDark tracking-wider">
              AURA FINANCIAL
            </Text>
            <Text className="text-xl font-extrabold text-textDark tracking-tight">
              Préstamos
            </Text>
          </View>
        </View>

        <View className="flex-row items-center bg-[#F4F4F5] px-3 py-1.5 rounded-full">
          <View className="w-2 h-2 rounded-full bg-amberGold mr-1.5" />
          <Text className="text-xs font-semibold text-textDark">Fase 2</Text>
        </View>
      </View>

      {/* CONTENIDO PRINCIPAL */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 32,
          paddingBottom: 24,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* TARJETA PRINCIPAL DEL PLACEHOLDER */}
        <View className="w-full bg-white rounded-3xl p-6 border border-[#E4E4E7] shadow-sm items-center">
          {/* ICONO CON ANILLO DECORATIVO */}
          <View className="w-20 h-20 rounded-full bg-amberGoldLight items-center justify-center mb-5 border border-amberGold/20">
            <Ionicons name="business" size={38} color={AURA_COLORS.amberGold} />
          </View>

          {/* TÍTULO PRINCIPAL SOLICITADO */}
          <Text className="text-2xl font-black text-textDark text-center tracking-tight mb-2">
            Aquí van los préstamos
          </Text>

          {/* SUBTÍTULO / DESCRIPCIÓN */}
          <Text className="text-sm font-medium text-textMutedDark text-center leading-relaxed mb-6 max-w-[280px]">
            Espacio reservado para la simulación, amortización y control de préstamos financieros.
          </Text>

          {/* CHIPS DE PRÓXIMAS CARACTERÍSTICAS */}
          <View className="w-full pt-4 border-t border-[#F0F0F2] flex-row flex-wrap justify-center gap-2">
            <View className="bg-[#F4F4F5] px-3 py-1.5 rounded-full">
              <Text className="text-[11px] font-semibold text-textMutedDark">
                Sistema Francés
              </Text>
            </View>
            <View className="bg-[#F4F4F5] px-3 py-1.5 rounded-full">
              <Text className="text-[11px] font-semibold text-textMutedDark">
                Sistema Alemán
              </Text>
            </View>
            <View className="bg-[#F4F4F5] px-3 py-1.5 rounded-full">
              <Text className="text-[11px] font-semibold text-textMutedDark">
                Tablas de Amortización
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
