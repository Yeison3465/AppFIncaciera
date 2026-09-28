/**
 * Tokens de Diseño Oficiales - Aura Financial V2.5
 */

export const AURA_COLORS = {
  // Fondos y Superficies Principales
  obsidian: '#121316',          // Fondo oscuro primario y botones de máxima jerarquía (#111111 en mockups)
  darkCard: '#1E2025',          // Superficie de tarjetas oscuras elevadas y contenedores
  lightSurface: '#F4F4F5',      // Fondo claro neutro de apoyo
  cardWhite: '#FFFFFF',         // Superficie blanca limpia para tarjetas claras
  borderSubtle: 'rgba(255, 255, 255, 0.1)', // Bordes sutiles en modo oscuro
  borderLight: '#E4E4E7',       // Bordes en superficies claras

  // Acentos y Estados Financieros
  amberGold: '#FF9E00',         // Acciones destacadas, simulaciones y selección activa (#FF9E00 / #F59E0B)
  amberGoldLight: 'rgba(255, 158, 0, 0.15)', // Píldoras y badges de simulación
  emeraldGreen: '#10B981',      // Ingresos, rendimientos positivos y validación exitosa
  emeraldGreenLight: 'rgba(16, 185, 129, 0.15)', // Badges de tasa positiva
  redAlert: '#EF4444',          // Gastos, deudas pendientes y alertas de error
  redAlertLight: '#FEE2E2',     // Fondos para banners y modales de error

  // Tipografía y Textos
  textPrimary: '#FFFFFF',       // Texto sobre fondos obsidian o darkCard
  textDark: '#121316',          // Texto sobre fondos claros o botones acento
  textMuted: '#9CA3AF',         // Textos secundarios, labels y placeholders
  textMutedDark: '#71717A',     // Subtítulos sobre superficie clara
};

export const AURA_TYPOGRAPHY = {
  tabular: {
    fontVariant: ['tabular-nums'] as const,
  },
};
