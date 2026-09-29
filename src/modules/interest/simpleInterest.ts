/**
 * Motor Financiero Puro: Interés Simple (RF-04)
 * Función determinista sin dependencias de React, UI ni Supabase.
 */

import { SimpleInterestInput, SimpleInterestResult, SimpleInterestBreakdownPoint } from '../../types/financial';

/**
 * Calcula el interés simple, monto final y porcentajes de rentabilidad.
 * Fórmula: I = C * i * t
 * Monto Final: S = C + I
 *
 * @param input Parámetros de entrada para el cálculo
 * @returns SimpleInterestResult con desglose y métricas
 */
export function calculateSimpleInterest(input: SimpleInterestInput): SimpleInterestResult {
  const {
    principal,
    annualRate,
    ratePeriodicity = 'annual',
    term,
    termUnit,
    dayCountConvention = 'commercial_360',
  } = input;

  // Validaciones defensivas de entrada
  if (typeof principal !== 'number' || isNaN(principal) || principal < 0) {
    throw new Error('El capital inicial no puede ser negativo.');
  }

  if (typeof annualRate !== 'number' || isNaN(annualRate) || annualRate < 0) {
    throw new Error('La tasa de interés debe ser un número mayor o igual a cero.');
  }

  if (typeof term !== 'number' || isNaN(term) || term < 0) {
    throw new Error('El plazo de tiempo no puede ser negativo.');
  }

  // 1. Normalización del tiempo t a años según unidad y convención de base diaria
  let timeInYears = 0;
  const daysInYear = dayCountConvention === 'commercial_360' ? 360 : 365;

  switch (termUnit) {
    case 'years':
      timeInYears = term;
      break;
    case 'months':
      timeInYears = term / 12;
      break;
    case 'days':
      timeInYears = term / daysInYear;
      break;
    default:
      timeInYears = term;
  }

  // 2. Normalización de la tasa nominal anual (decimal)
  let decimalAnnualRate = annualRate / 100;
  if (ratePeriodicity === 'monthly') {
    decimalAnnualRate = (annualRate * 12) / 100;
  }

  // 3. Cálculo de Interés Total e Importe Acumulado
  const interestEarned = principal * decimalAnnualRate * timeInYears;
  const finalAmount = principal + interestEarned;

  // 4. Métricas porcentuales
  const totalReturnPercentage = principal > 0 ? (interestEarned / principal) * 100 : 0;
  const principalPercentage = finalAmount > 0 ? (principal / finalAmount) * 100 : 0;
  const interestPercentage = finalAmount > 0 ? (interestEarned / finalAmount) * 100 : 0;

  // 5. Hitos para gráfica de proyección lineal (Inicio, Hito medio, Fin)
  const halfTime = timeInYears / 2;
  const halfInterest = interestEarned / 2;

  const breakdown: SimpleInterestBreakdownPoint[] = [
    {
      period: 0,
      label: 'Inicio (Año 0)',
      accumulatedInterest: 0,
      totalBalance: principal,
    },
    {
      period: Number(halfTime.toFixed(1)),
      label: `Hito medio (${halfTime.toFixed(1)}a)`,
      accumulatedInterest: Number(halfInterest.toFixed(2)),
      totalBalance: Number((principal + halfInterest).toFixed(2)),
    },
    {
      period: Number(timeInYears.toFixed(1)),
      label: `${timeInYears.toFixed(1)} Años`,
      accumulatedInterest: Number(interestEarned.toFixed(2)),
      totalBalance: Number(finalAmount.toFixed(2)),
    },
  ];

  return {
    principal: Number(principal.toFixed(2)),
    interestEarned: Number(interestEarned.toFixed(2)),
    finalAmount: Number(finalAmount.toFixed(2)),
    totalReturnPercentage: Number(totalReturnPercentage.toFixed(2)),
    principalPercentage: Number(principalPercentage.toFixed(1)),
    interestPercentage: Number(interestPercentage.toFixed(1)),
    timeInYears: Number(timeInYears.toFixed(4)),
    breakdown,
  };
}
