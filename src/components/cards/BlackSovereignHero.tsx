import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
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
    <View style={[styles.card, style]}>
      {/* Cabecera */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="shield-checkmark" size={18} color={AURA_COLORS.amberGold} />
          <Text style={styles.title}>{title}</Text>
        </View>
        {badgeText && (
          <View style={[styles.badge, { borderColor: badgeColor }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
          </View>
        )}
      </View>

      {/* Cuerpo Central */}
      <View style={styles.mainContent}>
        <Text style={styles.mainLabel}>{mainLabel.toUpperCase()}</Text>
        <Text style={styles.mainValue}>{mainValue}</Text>
        {subValueBadge && (
          <View style={styles.subValueRow}>
            <Ionicons name="trending-up" size={14} color={AURA_COLORS.emeraldGreen} />
            <Text style={styles.subValueText}>{subValueBadge}</Text>
          </View>
        )}
      </View>

      {/* Sub-métricas en 2 columnas */}
      <View style={styles.footerGrid}>
        <View style={styles.column}>
          <Text style={styles.colLabel}>{col1Label}</Text>
          <Text style={styles.colValue}>{col1Value}</Text>
          {col1Subtext && <Text style={styles.colSubtext}>{col1Subtext}</Text>}
        </View>

        <View style={styles.divider} />

        <View style={styles.column}>
          <Text style={styles.colLabel}>{col2Label}</Text>
          <Text style={[styles.colValue, styles.col2Value]}>{col2Value}</Text>
          {col2Subtext && <Text style={styles.colSubtext}>{col2Subtext}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AURA_COLORS.obsidian,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: AURA_COLORS.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  mainContent: {
    marginBottom: 18,
  },
  mainLabel: {
    color: AURA_COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  mainValue: {
    color: AURA_COLORS.textPrimary,
    fontSize: 34,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  subValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  subValueText: {
    color: AURA_COLORS.emeraldGreen,
    fontSize: 12,
    fontWeight: '600',
  },
  footerGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  column: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
  colLabel: {
    color: AURA_COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 3,
  },
  colValue: {
    color: AURA_COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  col2Value: {
    color: AURA_COLORS.amberGold,
  },
  colSubtext: {
    color: AURA_COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
});
