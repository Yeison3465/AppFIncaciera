import React from 'react';
import { View, ViewStyle } from 'react-native';

interface SurfaceCardProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'outline';
  style?: ViewStyle;
}

/**
 * Tarjeta de Superficie (SurfaceCard) - Aura Financial V2.5
 * Contenedor base modular con radio 20px.
 * Implementado con Tailwind CSS / NativeWind seguro contra race conditions.
 */
export const SurfaceCard: React.FC<SurfaceCardProps> = ({
  children,
  variant = 'light',
  style,
}) => {
  const variantClass =
    variant === 'dark'
      ? 'bg-darkCard border-borderSubtle'
      : variant === 'outline'
      ? 'bg-transparent border-borderLight'
      : 'bg-cardWhite border-[#F0F0F2]';

  return (
    <View
      className={`rounded-[20px] p-[18px] my-2 border ${variantClass}`}
      style={style}
    >
      {children}
    </View>
  );
};
