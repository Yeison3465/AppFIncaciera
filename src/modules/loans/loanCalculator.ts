/**
 * Motor Financiero Puro: Simulador de Préstamos y Cronograma de Amortización (RF-07 y RF-08)
 * Función determinista pura sin dependencias de React, UI ni Supabase.
 * Cumple con KISS, YAGNI y estricta separación de capas.
 */

import { convertRate } from '../rates/rateConverter';
import {
  AmortizationRow,
  LoanPaymentFrequency,
  LoanSimulationInput,
  LoanSimulationResult,
} from './loanTypes';

const SPANISH_SHORT_MONTHS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

/**
 * Redondeo financiero exacto a 2 decimales para evitar problemas de coma flotante.
 */
export function round2(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

function parseStartDate(startDate?: string | Date): Date {
  if (!startDate) return new Date();
  if (startDate instanceof Date) return new Date(startDate.getTime());
  if (typeof startDate === 'string') {
    const parts = startDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    const parsed = new Date(startDate);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }
  return new Date();
}

/**
 * Proyecta la fecha estimada de vencimiento para la cuota i (0-indexada).
 */
function calculateDueDate(baseDate: Date, index: number, frequency: LoanPaymentFrequency): string {
  const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  if (frequency === 'monthly') {
    d.setMonth(baseDate.getMonth() + index);
  } else if (frequency === 'quarterly') {
    d.setMonth(baseDate.getMonth() + index * 3);
  } else if (frequency === 'biweekly') {
    d.setDate(baseDate.getDate() + index * 14);
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = SPANISH_SHORT_MONTHS[d.getMonth()] || 'Ene';
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Simula y calcula un crédito con su tabla completa de amortización (RF-07 y RF-08).
 *
 * @param input Parámetros de entrada de la simulación
 * @returns LoanSimulationResult con desglose completo y tabla de cuotas
 */
export function calculateLoanSimulation(input: LoanSimulationInput): LoanSimulationResult {
  const {
    amount,
    annualRate,
    rateType = 'effective',
    term,
    frequency = 'monthly',
    system = 'frances',
    insuranceType = 'fixed',
    insuranceValue = 0,
    otherCosts = 0,
    startDate,
  } = input;

  // Validaciones defensivas
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    throw new Error('El monto del préstamo debe ser un número mayor a cero.');
  }

  if (typeof term !== 'number' || isNaN(term) || term < 1 || !Number.isInteger(term)) {
    throw new Error('El plazo del préstamo debe ser un número entero de al menos 1 cuota.');
  }

  if (typeof annualRate !== 'number' || isNaN(annualRate) || annualRate < 0) {
    throw new Error('La tasa de interés no puede ser un número negativo o inválido.');
  }

  if (typeof insuranceValue !== 'number' || isNaN(insuranceValue) || insuranceValue < 0) {
    throw new Error('El seguro no puede tener un valor negativo.');
  }

  if (typeof otherCosts !== 'number' || isNaN(otherCosts) || otherCosts < 0) {
    throw new Error('Los otros costos no pueden tener un valor negativo.');
  }

  // 1. Obtener la tasa periódica efectiva vencida exacta (ip) reutilizando convertRate
  let targetPeriodicity: 'monthly' | 'biweekly' | 'quarterly' = 'monthly';
  let periodsPerYear = 12;
  let freqUnitLabel = 'mensual';

  if (frequency === 'biweekly') {
    targetPeriodicity = 'biweekly';
    periodsPerYear = 24;
    freqUnitLabel = 'quincenal';
  } else if (frequency === 'quarterly') {
    targetPeriodicity = 'quarterly';
    periodsPerYear = 4;
    freqUnitLabel = 'trimestral';
  }

  let ipDecimal = 0;
  if (annualRate > 0) {
    const conversion = convertRate({
      sourceRate: annualRate,
      sourceType: rateType,
      sourcePeriodicity: 'annual',
      sourceModality: 'arrears',
      targetType: 'effective',
      targetPeriodicity,
      targetModality: 'arrears',
    });
    ipDecimal = conversion.targetPeriodicDecimal ?? (conversion.targetPeriodicRate / 100);
  }

  const periodicRatePercentage = Number((ipDecimal * 100).toFixed(3));
  const periodicRateLabel = `${periodicRatePercentage.toFixed(3)}% ${freqUnitLabel}`;

  // Fecha base para vencimientos
  const baseDate = parseStartDate(startDate);

  // 2. Cálculo según Sistema de Amortización
  const schedule: AmortizationRow[] = [];
  let remainingDebt = amount;

  // Cuota base para Sistema Francés
  let baseInstallment = 0;
  if (system === 'frances') {
    if (ipDecimal > 0) {
      baseInstallment = round2((amount * ipDecimal) / (1 - Math.pow(1 + ipDecimal, -term)));
    } else {
      baseInstallment = round2(amount / term);
    }
  }

  // Abono constante para Sistema Alemán
  const germanPrincipalPerPeriod = round2(amount / term);

  for (let i = 1; i <= term; i++) {
    const isLast = i === term;
    const dueDate = calculateDueDate(baseDate, i - 1, frequency);

    // Interés del periodo
    const interest = round2(remainingDebt * ipDecimal);

    // Seguro del periodo
    let insurance = 0;
    if (insuranceType === 'fixed') {
      insurance = round2(insuranceValue);
    } else {
      // Porcentaje sobre saldo restante anterior
      insurance = round2(remainingDebt * (insuranceValue / 100));
    }

    const periodOtherCosts = round2(otherCosts);

    let principal = 0;

    if (system === 'frances') {
      if (isLast) {
        // En la última cuota, el capital amortizado es exactamente la deuda remanente
        // para garantizar que la suma sea idéntica al monto y saldo final 0.00
        principal = remainingDebt;
      } else {
        principal = round2(baseInstallment - interest);
        // Salvaguarda si la cuota base calculada es menor al interés
        if (principal > remainingDebt) {
          principal = remainingDebt;
        }
      }
    } else {
      // Sistema Alemán: Abono a capital constante
      if (isLast) {
        principal = remainingDebt;
      } else {
        principal = germanPrincipalPerPeriod;
      }
    }

    // Saldo restante tras este pago
    const newRemainingDebt = isLast ? 0.00 : round2(Math.max(0, remainingDebt - principal));

    // Cuota total periódica a pagar
    const paymentAmount = round2(principal + interest + insurance + periodOtherCosts);

    schedule.push({
      installmentNumber: i,
      dueDate,
      paymentAmount,
      principal,
      interest,
      insurance,
      otherCosts: periodOtherCosts,
      remainingBalance: newRemainingDebt,
    });

    remainingDebt = newRemainingDebt;
  }

  // 3. Totales acumulados y métricas clave
  const totalPrincipal = round2(schedule.reduce((acc, row) => acc + row.principal, 0));
  const totalInterest = round2(schedule.reduce((acc, row) => acc + row.interest, 0));
  const totalInsurance = round2(schedule.reduce((acc, row) => acc + row.insurance, 0));
  const totalOtherCosts = round2(schedule.reduce((acc, row) => acc + row.otherCosts, 0));
  const totalAdditionalCharges = round2(totalInsurance + totalOtherCosts);
  const totalCost = round2(totalPrincipal + totalInterest + totalAdditionalCharges);

  const firstInstallment = schedule[0]?.paymentAmount ?? 0;
  const lastInstallment = schedule[schedule.length - 1]?.paymentAmount ?? 0;
  const estimatedInstallment = system === 'frances' ? firstInstallment : firstInstallment;

  // Porcentajes de distribución para visualización
  const capitalPercentage = totalCost > 0 ? Number(((totalPrincipal / totalCost) * 100).toFixed(1)) : 0;
  const interestPercentage = totalCost > 0 ? Number(((totalInterest / totalCost) * 100).toFixed(1)) : 0;
  const chargesPercentage = totalCost > 0 ? Number(Math.max(0, 100 - capitalPercentage - interestPercentage).toFixed(1)) : 0;

  return {
    amount,
    term,
    frequency,
    system,
    annualRate,
    rateType,
    periodicRate: periodicRatePercentage,
    periodicRateDecimal: ipDecimal,
    periodicRateLabel,
    estimatedInstallment,
    firstInstallment,
    lastInstallment,
    baseInstallment,
    totalPrincipal,
    totalInterest,
    totalInsurance,
    totalOtherCosts,
    totalAdditionalCharges,
    totalCost,
    schedule,
    summary: {
      capitalPercentage,
      interestPercentage,
      chargesPercentage,
    },
  };
}
