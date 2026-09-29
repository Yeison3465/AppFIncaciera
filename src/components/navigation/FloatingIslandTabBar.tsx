import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../constants/theme';

export type TabKey = 'calc' | 'loans' | 'cards' | 'flows' | 'profile';

interface TabItem {
  key: TabKey;
  label: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
}

const TABS: TabItem[] = [
  { key: 'calc', label: 'Calc', iconActive: 'calculator', iconInactive: 'calculator-outline' },
  { key: 'loans', label: 'Préstamos', iconActive: 'business', iconInactive: 'business-outline' },
  { key: 'cards', label: 'Tarjetas', iconActive: 'card', iconInactive: 'card-outline' },
  { key: 'flows', label: 'Flujos', iconActive: 'swap-vertical', iconInactive: 'swap-vertical-outline' },
  { key: 'profile', label: 'Perfil', iconActive: 'person', iconInactive: 'person-outline' },
];

interface FloatingIslandTabBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
  style?: ViewStyle;
}

/**
 * Tab Bar Flotante (Floating Island Dock) - Aura Financial V2.5
 * Barra suspendida tipo píldora fija sobre el margen inferior con 5 nodos.
 * Implementado con Tailwind CSS / NativeWind seguro contra race conditions.
 */
export const FloatingIslandTabBar: React.FC<FloatingIslandTabBarProps> = ({
  activeTab,
  onTabPress,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <View
      className="px-5 pt-2 bg-transparent"
      style={[{ paddingBottom: bottomPadding }, style]}
    >
      <View className="h-[62px] bg-obsidian rounded-full flex-row items-center justify-around px-3 border border-borderSubtle">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => onTabPress(tab.key)}
              className="items-center justify-center py-1 px-2.5 min-w-[54px]"
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.iconInactive}
                size={20}
                color={isActive ? AURA_COLORS.amberGold : AURA_COLORS.textMuted}
              />
              <Text
                className={`text-[10px] mt-0.5 ${
                  isActive ? 'text-amberGold font-bold' : 'text-textMuted font-semibold'
                }`}
              >
                {tab.label}
              </Text>
              {isActive && (
                <View className="w-1 h-1 rounded-full bg-amberGold mt-0.5" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
