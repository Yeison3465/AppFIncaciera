import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../constants/theme';

interface BlackSovereignHeroProps {
  title?: string;
  badgeText?: string;
  badgeColor?: string;
  mainLabel: string;
  mainValue: string;
  subValueBadge?: string;
  col1Label: string;
  col1Value: string;
  col1Subtext?: string;
  col2Label: string;
  col2Value: string;
  col2Subtext?: string;
  style?: ViewStyle;
}

/**
 * Hero de Resultados Financieros (BlackSovereignHero) - Aura Financial V2.5
 * Tarjeta premium oscura para el resultado central de simulaciones y proyecciones.
 * Implementado con Tailwind CSS / NativeWind seguro contra race conditions.
 */
export const BlackSovereignHero: React.FC<BlackSovereignHeroProps> = ({
  title = 'BLACK SOVEREIGN HERO',
  badgeText,
  badgeColor = AURA_COLORS.amberGold,
  mainLabel,
  mainValue,
  subValueBadge,
  col1Label,
  col1Value,
  col1Subtext,
  col2Label,
  col2Value,
  col2Subtext,
  style,
}) => {
  return (
    <View
      className="bg-obsidian rounded-[20px] p-5 my-2.5 border border-borderSubtle"
      style={style}
    >
      {/* Cabecera */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-2">
          <Ionicons name="shield-checkmark" size={18} color={AURA_COLORS.amberGold} />
          <Text className="text-gray-300 text-xs font-bold tracking-wider">{title}</Text>
        </View>
        {badgeText && (
          <View
            className="px-2.5 py-1 rounded-lg border bg-darkCard"
            style={{ borderColor: badgeColor }}
          >
            <Text
              className="text-[11px] font-bold"
              style={{ color: badgeColor, fontVariant: ['tabular-nums'] }}
            >
              {badgeText}
            </Text>
          </View>
        )}
      </View>

      {/* Cuerpo Central */}
      <View className="mb-[18px]">
        <Text className="text-textMuted text-[11px] font-bold tracking-widest mb-1.5">
          {mainLabel.toUpperCase()}
        </Text>
        <Text
          className="text-textPrimary text-[34px] font-extrabold tracking-tight"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {mainValue}
        </Text>
        {subValueBadge && (
          <View className="flex-row items-center gap-1 mt-1">
            <Ionicons name="trending-up" size={14} color={AURA_COLORS.emeraldGreen} />
            <Text className="text-emeraldGreen text-xs font-semibold">{subValueBadge}</Text>
          </View>
        )}
      </View>

      {/* Sub-métricas en 2 columnas */}
      <View className="flex-row bg-darkCard rounded-[14px] p-3 items-center">
        <View className="flex-1">
          <Text className="text-textMuted text-[11px] font-semibold mb-0.5">{col1Label}</Text>
          <Text
            className="text-textPrimary text-[15px] font-bold"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {col1Value}
          </Text>
          {col1Subtext && (
            <Text
              className="text-textMuted text-[10px] mt-0.5"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {col1Subtext}
            </Text>
          )}
        </View>

        <View className="w-[1px] h-9 bg-gray-700 mx-3" />

        <View className="flex-1">
          <Text className="text-textMuted text-[11px] font-semibold mb-0.5">{col2Label}</Text>
          <Text
            className="text-amberGold text-[15px] font-bold"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {col2Value}
          </Text>
          {col2Subtext && (
            <Text
              className="text-textMuted text-[10px] mt-0.5"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {col2Subtext}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
