/**
 * Motor Financiero Puro: Interés Compuesto y Proyección de Ahorro (RF-05)
 * Función determinista sin dependencias de React, UI ni Supabase.
 */

import {
  CompoundInterestInput,
  CompoundInterestResult,
  PeriodBreakdown,
  CompoundingFrequency,
} from '../../types/financial';

/**
 * Mapeo de frecuencias de capitalización a periodos por año.
 */
export const COMPOUNDING_PERIODS_PER_YEAR: Record<CompoundingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  annual: 1,
};

/**
 * Calcula la proyección de interés compuesto con aportes periódicos opcionales.
 * Fórmula base: VF = VP * (1 + i)^n + PMT * [((1 + i)^n - 1) / i]
 *
 * @param input Parámetros de entrada para el cálculo
 * @returns CompoundInterestResult con desglose periodo a periodo y métricas consolidadas
 */
export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const {
    initialDeposit,
    annualEffectiveRate,
    termYears,
    compoundingFrequency,
    periodicDeposit,
    includePeriodicDeposit,
    depositTiming = 'end',
  } = input;

  // Validaciones defensivas de entrada
  if (typeof initialDeposit !== 'number' || isNaN(initialDeposit) || initialDeposit < 0) {
    throw new Error('El depósito inicial no puede ser negativo.');
  }

  if (typeof annualEffectiveRate !== 'number' || isNaN(annualEffectiveRate) || annualEffectiveRate < 0) {
    throw new Error('La tasa efectiva anual no puede ser negativa.');
  }

  if (typeof termYears !== 'number' || isNaN(termYears) || termYears <= 0) {
    throw new Error('El horizonte en años debe ser mayor a cero.');
  }

  const effectivePeriodicDeposit = includePeriodicDeposit && typeof periodicDeposit === 'number' && !isNaN(periodicDeposit) && periodicDeposit > 0
    ? periodicDeposit
    : 0;

  const periodsPerYear = COMPOUNDING_PERIODS_PER_YEAR[compoundingFrequency] || 12;
  const totalPeriods = Math.round(termYears * periodsPerYear);

  // Tasa periódica efectiva ip a partir de la tasa anual efectiva (EA)
  // ip = (1 + EA)^(1 / m) - 1
  const decimalEA = annualEffectiveRate / 100;
  const periodicRate = decimalEA > 0 ? Math.pow(1 + decimalEA, 1 / periodsPerYear) - 1 : 0;

  // Ajuste del aporte periódico según la frecuencia de capitalización
  // Si el usuario ingresa un aporte mensual pero capitaliza trimestral o anual:
  let periodContribution = effectivePeriodicDeposit;
  if (compoundingFrequency === 'quarterly') {
    periodContribution = effectivePeriodicDeposit * 3;
  } else if (compoundingFrequency === 'annual') {
    periodContribution = effectivePeriodicDeposit * 12;
  }

  const breakdown: PeriodBreakdown[] = [];
  let currentBalance = initialDeposit;
  let totalContributed = initialDeposit;
  let totalInterest = 0;

  for (let period = 1; period <= totalPeriods; period++) {
    const startingBalance = currentBalance;
    let interestEarned = 0;
    let deposit = 0;

    if (depositTiming === 'beginning') {
      deposit = periodContribution;
      totalContributed += deposit;
      interestEarned = (startingBalance + deposit) * periodicRate;
      currentBalance = startingBalance + deposit + interestEarned;
    } else {
      // Vencido (al final del periodo)
      interestEarned = startingBalance * periodicRate;
      deposit = periodContribution;
      totalContributed += deposit;
      currentBalance = startingBalance + interestEarned + deposit;
    }

    totalInterest += interestEarned;

    const currentYear = Math.ceil(period / periodsPerYear);

    breakdown.push({
      period,
      year: currentYear,
      label: `Periodo ${period} (Año ${currentYear})`,
      startingBalance: Number(startingBalance.toFixed(2)),
      deposit: Number(deposit.toFixed(2)),
      interestEarned: Number(interestEarned.toFixed(2)),
      totalInterestToDate: Number(totalInterest.toFixed(2)),
      totalContributedToDate: Number(totalContributed.toFixed(2)),
      endingBalance: Number(currentBalance.toFixed(2)),
    });
  }

  const futureValue = currentBalance;
  const totalReturnPercentage = totalContributed > 0 ? (totalInterest / totalContributed) * 100 : 0;
  const multiplier = totalContributed > 0 ? futureValue / totalContributed : 1;
  const principalPercentage = futureValue > 0 ? (totalContributed / futureValue) * 100 : 0;
  const interestPercentage = futureValue > 0 ? (totalInterest / futureValue) * 100 : 0;

  return {
    initialDeposit: Number(initialDeposit.toFixed(2)),
    totalPrincipalContributed: Number(totalContributed.toFixed(2)),
    totalInterestEarned: Number(totalInterest.toFixed(2)),
    futureValue: Number(futureValue.toFixed(2)),
    totalReturnPercentage: Number(totalReturnPercentage.toFixed(2)),
    multiplier: Number(multiplier.toFixed(2)),
    principalPercentage: Number(principalPercentage.toFixed(1)),
    interestPercentage: Number(interestPercentage.toFixed(1)),
    breakdown,
  };
}
