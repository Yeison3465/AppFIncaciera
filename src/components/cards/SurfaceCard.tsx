import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AURA_COLORS } from '../../constants/theme';

interface SurfaceCardProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'outline';
  style?: ViewStyle;
}

/**
 * Tarjeta de Superficie (SurfaceCard) - Aura Financial V2.5
 * Contenedor base modular con radio 16-20px y sombras suaves.
 */
export const SurfaceCard: React.FC<SurfaceCardProps> = ({
  children,
  variant = 'light',
  style,
}) => {
  return (
    <View
      style={[
        styles.card,
        variant === 'dark' && styles.darkCard,
        variant === 'outline' && styles.outlineCard,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#F0F0F2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: AURA_COLORS.darkCard,
    borderColor: AURA_COLORS.borderSubtle,
    shadowOpacity: 0.2,
  },
  outlineCard: {
    backgroundColor: 'transparent',
    borderColor: AURA_COLORS.borderLight,
    shadowOpacity: 0,
    elevation: 0,
  },
});
