import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

/** Mapeo bidireccional entre la ruta de Expo Router y el tab key correspondiente */
const ROUTE_TO_TAB: Record<string, TabKey> = {
  index: 'calc',
  loans: 'loans',
  cards: 'cards',
  flows: 'flows',
  profile: 'profile',
};

const TAB_TO_ROUTE: Record<TabKey, string> = {
  calc: 'index',
  loans: 'loans',
  cards: 'cards',
  flows: 'flows',
  profile: 'profile',
};

export interface NavigationRouteItem {
  key: string;
  name: string;
  params?: unknown;
}

export interface NavigationStateItem {
  index: number;
  routes: NavigationRouteItem[];
}

export interface NavigationHelpersItem {
  navigate: (...args: any[]) => void;
  dispatch?: (...args: any[]) => void;
}

export interface NavigationInsetsItem {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface FloatingIslandTabBarProps {
  state?: NavigationStateItem;
  navigation?: NavigationHelpersItem;
  insets?: NavigationInsetsItem;
  activeTab?: TabKey;
  onTabPress?: (tab: TabKey) => void;
  style?: ViewStyle;
}


/**
 * Tab Bar Flotante (Floating Island Dock) - Aura Financial V2.5
 * Barra suspendida tipo píldora fija sobre el margen inferior con 5 nodos.
 * Conectado con la navegación de Expo Router como Single Source of Truth.
 */
export const FloatingIslandTabBar: React.FC<FloatingIslandTabBarProps> = ({
  state,
  navigation,
  insets: propInsets,
  activeTab: manualActiveTab,
  onTabPress: manualOnTabPress,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(propInsets?.bottom ?? insets.bottom, 16);

  // Tab activo: derivado automáticamente de la ruta activa del navegador
  let currentActiveTab: TabKey = manualActiveTab ?? 'calc';
  if (state && state.routes && state.index !== undefined) {
    const activeRouteName = state.routes[state.index]?.name;
    if (activeRouteName && ROUTE_TO_TAB[activeRouteName]) {
      currentActiveTab = ROUTE_TO_TAB[activeRouteName];
    }
  }

  const handlePress = (tab: TabItem) => {
    // 1. Invocar callback manual si fue suministrado
    manualOnTabPress?.(tab.key);

    // 2. Si cuenta con navigation de Expo Router, despachar la navegación al instante
    if (navigation && state) {
      const targetRouteName = TAB_TO_ROUTE[tab.key];
      const isRouteRegistered = state.routes.some((r) => r.name === targetRouteName);

      if (isRouteRegistered) {
        navigation.navigate(targetRouteName);
      }
    }
  };

  return (
    <View
      className="px-5 pt-2 bg-[#F8F9FA]"
      style={[{ paddingBottom: bottomPadding }, style]}
    >
      <View className="h-[62px] bg-obsidian rounded-full flex-row items-center justify-around px-3 border border-borderSubtle">
        {TABS.map((tab) => {
          const isActive = tab.key === currentActiveTab;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => handlePress(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
              className="items-center justify-center py-1 px-2.5 min-w-[54px] cursor-pointer hover:opacity-80 active:opacity-60"
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

