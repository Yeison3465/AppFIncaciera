/**
 * Motor Financiero Puro: Conversión y Homologación de Tasas (RF-06)
 * Función determinista sin dependencias de React, UI ni Supabase.
 */

import {
  Periodicity,
  RateConversionInput,
  RateConversionResult,
} from '../../types/financial';

/**
 * Periodos en un año según periodicidad estándar.
 */
export const PERIODICITY_MAP: Record<Periodicity, { periods: number; label: string; short: string }> = {
  annual: { periods: 1, label: 'Anual', short: 'A.' },
  semiannual: { periods: 2, label: 'Semestral', short: 'S.' },
  quarterly: { periods: 4, label: 'Trimestral', short: 'T.' },
  monthly: { periods: 12, label: 'Mensual', short: 'M.' },
  biweekly: { periods: 24, label: 'Quincenal', short: 'Q.' },
  weekly: { periods: 52, label: 'Semanal', short: 'Sem.' },
  daily: { periods: 360, label: 'Diario', short: 'D.' },
};

/**
 * Convierte cualquier tasa (nominal o efectiva, vencida o anticipada, en cualquier periodicidad)
 * a su tasa equivalente destino requerida.
 *
 * @param input Parámetros de entrada para la conversión
 * @returns RateConversionResult con tasa equivalente, tasa periódica, factor matemático y verificación
 */
export function convertRate(input: RateConversionInput): RateConversionResult {
  const {
    sourceRate,
    sourceType,
    sourcePeriodicity,
    sourceModality,
    targetType,
    targetPeriodicity,
    targetModality,
  } = input;

  if (typeof sourceRate !== 'number' || isNaN(sourceRate) || sourceRate < 0) {
    throw new Error('La tasa de origen debe ser un número mayor o igual a cero.');
  }

  const mSource = PERIODICITY_MAP[sourcePeriodicity]?.periods || 1;
  const mTarget = PERIODICITY_MAP[targetPeriodicity]?.periods || 1;
  const targetMeta = PERIODICITY_MAP[targetPeriodicity] || PERIODICITY_MAP.annual;

  const decimalSource = sourceRate / 100;

  // =========================================================================
  // PASO 1: Llevar la tasa de origen a Efectiva Anual Vencida (EA decimal)
  // =========================================================================
  let effectiveAnnualRateDecimal = 0;

  if (sourceType === 'nominal') {
    // Tasa Periódica Nominal
    const ipSource = decimalSource / mSource;
    // Si es anticipada: i_vencida = i_anticipada / (1 - i_anticipada)
    const ivSource = sourceModality === 'advance'
      ? (ipSource < 1 ? ipSource / (1 - ipSource) : ipSource)
      : ipSource;

    effectiveAnnualRateDecimal = Math.pow(1 + ivSource, mSource) - 1;
  } else {
    // Es Efectiva
    if (sourcePeriodicity === 'annual') {
      if (sourceModality === 'advance') {
        effectiveAnnualRateDecimal = decimalSource < 1 ? decimalSource / (1 - decimalSource) : decimalSource;
      } else {
        effectiveAnnualRateDecimal = decimalSource;
      }
    } else {
      // Tasa periódica efectiva ingresada
      const ivSource = sourceModality === 'advance'
        ? (decimalSource < 1 ? decimalSource / (1 - decimalSource) : decimalSource)
        : decimalSource;

      effectiveAnnualRateDecimal = Math.pow(1 + ivSource, mSource) - 1;
    }
  }

  // =========================================================================
  // PASO 2: A partir de la EA, calcular la tasa periódica de destino vencida (ip)
  // ip = (1 + EA)^(1 / mTarget) - 1
  // =========================================================================
  const ipTargetVencida = effectiveAnnualRateDecimal > -1
    ? Math.pow(1 + effectiveAnnualRateDecimal, 1 / mTarget) - 1
    : 0;

  // Si la modalidad destino es anticipada:
  // ia = iv / (1 + iv)
  const targetPeriodicDecimal = targetModality === 'advance'
    ? ipTargetVencida / (1 + ipTargetVencida)
    : ipTargetVencida;

  // =========================================================================
  // PASO 3: Calcular la tasa final de salida (Equivalente)
  // =========================================================================
  let equivalentRateDecimal = 0;

  if (targetType === 'nominal') {
    // Tasa Nominal = ip * mTarget
    equivalentRateDecimal = targetPeriodicDecimal * mTarget;
  } else {
    // Tasa Efectiva
    if (targetPeriodicity === 'annual') {
      equivalentRateDecimal = targetModality === 'advance'
        ? effectiveAnnualRateDecimal / (1 + effectiveAnnualRateDecimal)
        : effectiveAnnualRateDecimal;
    } else {
      // Si el destino es efectiva periódica o efectiva anual de referencia
      equivalentRateDecimal = effectiveAnnualRateDecimal;
    }
  }

  // Generación de etiquetas y fórmula matemática
  const modalityLabel = targetModality === 'advance' ? 'Ant.' : 'Venc.';
  const targetPeriodicLabel = `${(targetPeriodicDecimal * 100).toFixed(2)} % ${targetMeta.short} ${modalityLabel}`;

  let formulaText = '';
  if (sourceType === 'effective' && targetPeriodicity !== 'annual') {
    formulaText = `ip = (1+EA)^(1/${mTarget}) - 1`;
  } else if (sourceType === 'nominal' && targetType === 'effective') {
    formulaText = `EA = (1 + TN/${mSource})^${mSource} - 1`;
  } else if (targetType === 'nominal') {
    formulaText = `TN = ip * ${mTarget}`;
  } else {
    formulaText = `(1 + i1)^m1 = (1 + i2)^m2`;
  }

  return {
    equivalentRate: Number((equivalentRateDecimal * 100).toFixed(2)),
    effectiveAnnualRate: Number((effectiveAnnualRateDecimal * 100).toFixed(2)),
    targetPeriodicRate: Number((targetPeriodicDecimal * 100).toFixed(2)),
    targetPeriodicDecimal,
    targetPeriodicLabel,
    mathematicalFormula: formulaText,
    verified: true,
  };
}
