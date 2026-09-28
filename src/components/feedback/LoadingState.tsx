import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { AURA_COLORS } from '../../constants/theme';

interface LoadingStateProps {
  message?: string;
  subtitle?: string;
  infrastructureBadge?: string;
  style?: ViewStyle;
}

/**
 * LoadingState - Aura Financial V2.5
 * Spinner animado con subtítulo y badge técnico de infraestructura.
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Sincronizando Simulación...',
  subtitle = 'Calculando proyección matemática',
  infrastructureBadge = 'PostgreSQL RLS',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        <ActivityIndicator size="small" color={AURA_COLORS.amberGold} style={styles.spinner} />
        <View style={styles.textContainer}>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {infrastructureBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{infrastructureBadge}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 13,
    fontWeight: '700',
    color: AURA_COLORS.textDark,
  },
  subtitle: {
    fontSize: 11,
    color: AURA_COLORS.textMutedDark,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
});
