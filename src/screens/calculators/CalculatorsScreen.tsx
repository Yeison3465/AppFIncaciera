import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingIslandTabBar, TabKey } from '../../components';
import { AURA_COLORS } from '../../constants/theme';
import {
  CompoundInterestTab,
  RateConverterTab,
  SimpleInterestTab,
} from './tabs';

type CalculatorTab = 'compound' | 'simple' | 'rates';

/**
 * CalculatorsScreen - Aura Financial V2.5
 * Pantalla principal de calculadoras financieras (Fase 1: RF-04, RF-05, RF-06).
 * Arquitectura modular y estilizado 100% con clases de Tailwind CSS / NativeWind.
 */
export const CalculatorsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeCalcTab, setActiveCalcTab] = useState<CalculatorTab>('compound');
  const [activeBottomTab, setActiveBottomTab] = useState<TabKey>('calc');

  const handleScrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const handleTabChange = useCallback((tab: CalculatorTab) => {
    if (tab !== activeCalcTab) {
      setActiveCalcTab(tab);
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [activeCalcTab]);

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0);
  const bottomInset = Math.max(insets.bottom, 16);

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER SUPERIOR */}
      <View
        className="flex-row items-center justify-between px-5 pb-3 bg-white"
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
              Calculadoras
            </Text>
          </View>
        </View>
      </View>

      {/* SELECTOR DE TABS SUPERIOR (Compuesto | Simple | Tasas) */}
      <View className="bg-white px-5 pb-3 border-b border-[#F0F0F2]">
        <View className="flex-row bg-gray-100 rounded-full p-1">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleTabChange('compound')}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-full ${activeCalcTab === 'compound' ? 'bg-obsidian' : 'bg-transparent'
              }`}
          >
            <Ionicons
              name="trending-up"
              size={15}
              color={activeCalcTab === 'compound' ? AURA_COLORS.textPrimary : AURA_COLORS.textDark}
              style={{ marginRight: 4 }}
            />
            <Text
              className={`text-xs font-semibold ${activeCalcTab === 'compound' ? 'text-white font-bold' : 'text-textDark'
                }`}
            >
              Compuesto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleTabChange('simple')}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-full ${activeCalcTab === 'simple' ? 'bg-obsidian' : 'bg-transparent'
              }`}
          >
            <Text
              className={`text-sm font-bold mr-1 ${activeCalcTab === 'simple' ? 'text-white' : 'text-textDark'
                }`}
            >
              Σ
            </Text>
            <Text
              className={`text-xs font-semibold ${activeCalcTab === 'simple' ? 'text-white font-bold' : 'text-textDark'
                }`}
            >
              Simple
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleTabChange('rates')}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-full ${activeCalcTab === 'rates' ? 'bg-obsidian' : 'bg-transparent'
              }`}
          >
            <Ionicons
              name="swap-horizontal"
              size={15}
              color={activeCalcTab === 'rates' ? AURA_COLORS.textPrimary : AURA_COLORS.textDark}
              style={{ marginRight: 4 }}
            />
            <Text
              className={`text-xs font-semibold ${activeCalcTab === 'rates' ? 'text-white font-bold' : 'text-textDark'
                }`}
            >
              Tasas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENIDO PRINCIPAL PERSISTENTE (Keep-Alive) */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
      >
        <View style={{ display: activeCalcTab === 'compound' ? 'flex' : 'none' }}>
          <CompoundInterestTab onCalculate={handleScrollToTop} />
        </View>

        <View style={{ display: activeCalcTab === 'simple' ? 'flex' : 'none' }}>
          <SimpleInterestTab onCalculate={handleScrollToTop} />
        </View>

        <View style={{ display: activeCalcTab === 'rates' ? 'flex' : 'none' }}>
          <RateConverterTab onCalculate={handleScrollToTop} />
        </View>
      </ScrollView>

      {/* DOCK FLOTANTE INFERIOR */}
      <FloatingIslandTabBar
        activeTab={activeBottomTab}
        onTabPress={setActiveBottomTab}
      />
    </View>
  );
};
