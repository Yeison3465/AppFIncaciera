import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
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
 */
export const FloatingIslandTabBar: React.FC<FloatingIslandTabBarProps> = ({
  activeTab,
  onTabPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.dock}>
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => onTabPress(tab.key)}
              style={styles.tabButton}
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.iconInactive}
                size={20}
                color={isActive ? AURA_COLORS.amberGold : AURA_COLORS.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  dock: {
    height: 62,
    backgroundColor: AURA_COLORS.obsidian,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AURA_COLORS.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    minWidth: 54,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: AURA_COLORS.textMuted,
    marginTop: 2,
  },
  activeTabLabel: {
    color: AURA_COLORS.amberGold,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: AURA_COLORS.amberGold,
    marginTop: 3,
  },
});
