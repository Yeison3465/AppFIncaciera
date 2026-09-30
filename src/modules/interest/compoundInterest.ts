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
  daily: 360,
  monthly: 12,
  quarterly: 4,
  annual: 1,
};

/**
 * Calcula la proyección de interés compuesto con aportes periódicos opcionales.
 * Fórmula base: VF = VP * (1 + i)^n + PMT * [((1 + i)^n - 1) / i]
 * Con soporte para exponente continuo/fraccionario en plazos inferiores al periodo de capitalización.
 *
 * @param input Parámetros de entrada para el cálculo
 * @returns CompoundInterestResult con desglose periodo a periodo y métricas consolidadas
 */
export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const {
    initialDeposit,
    annualEffectiveRate,
    compoundingFrequency,
    periodicDeposit,
    includePeriodicDeposit,
    depositTiming = 'end',
  } = input;

  const rawTerm = typeof input.term === 'number' ? input.term : (input.termYears ?? 0);
  const termUnit = input.termUnit ?? 'years';

  // Validaciones defensivas de entrada
  if (typeof initialDeposit !== 'number' || isNaN(initialDeposit) || initialDeposit < 0) {
    throw new Error('El depósito inicial no puede ser negativo.');
  }

  if (typeof annualEffectiveRate !== 'number' || isNaN(annualEffectiveRate) || annualEffectiveRate < 0) {
    throw new Error('La tasa efectiva anual no puede ser negativa.');
  }

  if (typeof rawTerm !== 'number' || isNaN(rawTerm) || rawTerm < 0) {
    throw new Error('El plazo de tiempo no puede ser negativo.');
  }

  // 1. Normalización del plazo a años según la unidad (años, meses, días) con convención comercial (360/12/30)
  let normalizedYears = rawTerm;
  if (termUnit === 'months') {
    normalizedYears = rawTerm / 12;
  } else if (termUnit === 'days') {
    normalizedYears = rawTerm / 360;
  }

  const effectivePeriodicDeposit = includePeriodicDeposit && typeof periodicDeposit === 'number' && !isNaN(periodicDeposit) && periodicDeposit > 0
    ? periodicDeposit
    : 0;

  const periodsPerYear = COMPOUNDING_PERIODS_PER_YEAR[compoundingFrequency] || 12;

  // 2. Periodos exactos continuos en punto flotante (sin redondear arbitrariamente con Math.round o Math.max(1, ...))
  const exactPeriods = rawTerm > 0 ? normalizedYears * periodsPerYear : 0;

  // Tasa periódica según la frecuencia de capitalización m:
  // ip = (Tasa Anual / 100) / periodsPerYear
  const annualRateDecimal = annualEffectiveRate / 100;
  const periodicRate = annualRateDecimal > 0 ? annualRateDecimal / periodsPerYear : 0;

  // Ajuste del aporte periódico según la frecuencia de capitalización
  // Si el usuario ingresa un aporte mensual pero capitaliza diario, trimestral o anual:
  let pmt = effectivePeriodicDeposit;
  if (compoundingFrequency === 'daily') {
    pmt = effectivePeriodicDeposit / 30;
  } else if (compoundingFrequency === 'quarterly') {
    pmt = effectivePeriodicDeposit * 3;
  } else if (compoundingFrequency === 'annual') {
    pmt = effectivePeriodicDeposit * 12;
  }

  // 3. Cálculo de Valor Futuro con capitalización exponencial exacta continua/fraccionaria
  const principalGrowth = exactPeriods > 0
    ? initialDeposit * Math.pow(1 + periodicRate, exactPeriods)
    : initialDeposit;

  let annuityGrowth = 0;
  if (effectivePeriodicDeposit > 0 && exactPeriods > 0) {
    const baseAnnuity = periodicRate > 0
      ? pmt * ((Math.pow(1 + periodicRate, exactPeriods) - 1) / periodicRate)
      : pmt * exactPeriods;
    annuityGrowth = depositTiming === 'beginning' && periodicRate > 0
      ? baseAnnuity * (1 + periodicRate)
      : baseAnnuity;
  }

  const rawFutureValue = principalGrowth + annuityGrowth;
  const totalPeriodicContributed = effectivePeriodicDeposit > 0 && exactPeriods > 0
    ? pmt * exactPeriods
    : 0;
  const rawTotalPrincipal = initialDeposit + totalPeriodicContributed;
  const rawTotalInterest = Math.max(0, rawFutureValue - rawTotalPrincipal);

  // 4. Generación del desglose cronológico (PeriodBreakdown)
  const breakdown: PeriodBreakdown[] = [];
  const fullPeriods = Math.floor(exactPeriods);
  const hasFraction = exactPeriods > fullPeriods && (exactPeriods - fullPeriods) > 1e-7;
  const totalMilestones = fullPeriods + (hasFraction ? 1 : 0);

  let currentBalance = initialDeposit;
  let totalContributed = initialDeposit;
  let totalInterest = 0;

  // Generación periodo a periodo para periodos completos
  for (let period = 1; period <= fullPeriods; period++) {
    const startingBalance = currentBalance;
    let interestEarned = 0;
    let deposit = 0;

    if (depositTiming === 'beginning') {
      deposit = pmt;
      totalContributed += deposit;
      interestEarned = (startingBalance + deposit) * periodicRate;
      currentBalance = startingBalance + deposit + interestEarned;
    } else {
      interestEarned = startingBalance * periodicRate;
      deposit = pmt;
      totalContributed += deposit;
      currentBalance = startingBalance + interestEarned + deposit;
    }

    totalInterest += interestEarned;
    const currentYear = Math.ceil(period / periodsPerYear);

    const shouldRecord = totalMilestones <= 120
      || period === fullPeriods
      || period % (compoundingFrequency === 'daily' ? 30 : 1) === 0;

    if (shouldRecord) {
      breakdown.push({
        period,
        year: currentYear,
        label: compoundingFrequency === 'daily'
          ? `Día ${period} (Año ${currentYear})`
          : `Periodo ${period} (Año ${currentYear})`,
        startingBalance: Number(startingBalance.toFixed(2)),
        deposit: Number(deposit.toFixed(2)),
        interestEarned: Number(interestEarned.toFixed(2)),
        totalInterestToDate: Number(totalInterest.toFixed(2)),
        totalContributedToDate: Number(totalContributed.toFixed(2)),
        endingBalance: Number(currentBalance.toFixed(2)),
      });
    }
  }

  // Si existe un remanente fraccionario (o el plazo total es menor a 1 periodo de capitalización)
  if (hasFraction) {
    const periodNumber = fullPeriods + 1;
    const currentYear = Math.ceil(exactPeriods / periodsPerYear) || 1;
    const startingBalance = currentBalance;
    const deposit = rawTotalPrincipal - totalContributed;
    const endingBalance = rawFutureValue;
    const interestEarned = endingBalance - startingBalance - deposit;

    totalContributed = rawTotalPrincipal;
    totalInterest = rawTotalInterest;

    let periodLabel = `Periodo ${periodNumber} (Año ${currentYear})`;
    if (compoundingFrequency === 'daily') {
      periodLabel = `Día ${rawTerm} (Año ${currentYear})`;
    } else if (termUnit === 'days') {
      periodLabel = `Día ${rawTerm} (Año ${currentYear})`;
    } else if (termUnit === 'months') {
      periodLabel = `Mes ${rawTerm} (Año ${currentYear})`;
    }

    breakdown.push({
      period: periodNumber,
      year: currentYear,
      label: periodLabel,
      startingBalance: Number(startingBalance.toFixed(2)),
      deposit: Number(deposit.toFixed(2)),
      interestEarned: Number(interestEarned.toFixed(2)),
      totalInterestToDate: Number(totalInterest.toFixed(2)),
      totalContributedToDate: Number(totalContributed.toFixed(2)),
      endingBalance: Number(endingBalance.toFixed(2)),
    });
  }

  // Caso inicial (plazo 0 o sin registros)
  if (breakdown.length === 0) {
    breakdown.push({
      period: 0,
      year: 0,
      label: 'Inicio (Año 0)',
      startingBalance: Number(initialDeposit.toFixed(2)),
      deposit: 0,
      interestEarned: 0,
      totalInterestToDate: 0,
      totalContributedToDate: Number(initialDeposit.toFixed(2)),
      endingBalance: Number(initialDeposit.toFixed(2)),
    });
  }

  // Alineación exacta del último hito con las métricas consolidadas
  if (breakdown.length > 0 && exactPeriods > 0) {
    const lastItem = breakdown[breakdown.length - 1];
    lastItem.endingBalance = Number(rawFutureValue.toFixed(2));
    lastItem.totalContributedToDate = Number(rawTotalPrincipal.toFixed(2));
    lastItem.totalInterestToDate = Number(rawTotalInterest.toFixed(2));
  }

  const futureValue = rawFutureValue;
  const totalPrincipalContributed = rawTotalPrincipal;
  const totalInterestEarned = rawTotalInterest;

  const totalReturnPercentage = totalPrincipalContributed > 0
    ? (totalInterestEarned / totalPrincipalContributed) * 100
    : 0;
  const multiplier = totalPrincipalContributed > 0
    ? futureValue / totalPrincipalContributed
    : 1;
  const principalPercentage = futureValue > 0
    ? (totalPrincipalContributed / futureValue) * 100
    : 0;
  const interestPercentage = futureValue > 0
    ? (totalInterestEarned / futureValue) * 100
    : 0;

  return {
    initialDeposit: Number(initialDeposit.toFixed(2)),
    totalPrincipalContributed: Number(totalPrincipalContributed.toFixed(2)),
    totalInterestEarned: Number(totalInterestEarned.toFixed(2)),
    futureValue: Number(futureValue.toFixed(2)),
    totalReturnPercentage: Number(totalReturnPercentage.toFixed(2)),
    multiplier: Number(multiplier.toFixed(2)),
    principalPercentage: Number(principalPercentage.toFixed(1)),
    interestPercentage: Number(interestPercentage.toFixed(1)),
    breakdown,
  };
}
