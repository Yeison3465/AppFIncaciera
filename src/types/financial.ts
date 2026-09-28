/**
 * Contratos de Tipos Financieros (Aura Financial V2.5)
 * Tipado estricto sin 'any' para motores de cálculo y simuladores.
 */

export type Periodicity = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'quarterly' 
  | 'semiannual' 
  | 'annual';

export type RateType = 'nominal' | 'effective';

export type RateModality = 'arrears' | 'advance'; // Vencida (V) | Anticipada (A)

export type DayCountConvention = 'commercial_360' | 'exact_365';

export type TimeUnit = 'years' | 'months' | 'days';

// ==========================================
// RF-04: INTERÉS SIMPLE
// ==========================================

export interface SimpleInterestInput {
  principal: number; // Capital Inicial (C)
  annualRate: number; // Tasa de Interés Nominal (%)
  ratePeriodicity?: 'annual' | 'monthly'; // Periodicidad de la tasa (def: annual)
  term: number; // Plazo o Periodo de Tiempo (t)
  termUnit: TimeUnit; // Años, Meses, Días
  dayCountConvention: DayCountConvention; // Base de cálculo: 360d o 365d
}

export interface SimpleInterestBreakdownPoint {
  period: number;
  label: string;
  accumulatedInterest: number;
  totalBalance: number;
}

export interface SimpleInterestResult {
  principal: number; // Capital Inicial (C)
  interestEarned: number; // Interés Total generado (I)
  finalAmount: number; // Monto Final Acumulado (S = C + I)
  totalReturnPercentage: number; // Rendimiento Total (% sobre C)
  principalPercentage: number; // % del capital respecto al acumulado
  interestPercentage: number; // % del interés respecto al acumulado
  timeInYears: number; // Tiempo normalizado en años
  breakdown: SimpleInterestBreakdownPoint[]; // Hitos para visualización (Inicio, Hito medio, Fin)
}

// ==========================================
// RF-05: INTERÉS COMPUESTO
// ==========================================

export type CompoundingFrequency = 'monthly' | 'quarterly' | 'annual';

export interface CompoundInterestInput {
  initialDeposit: number; // Depósito Inicial (VP)
  annualEffectiveRate: number; // Tasa Anual E.A. (%)
  termYears: number; // Horizonte en Años (n)
  compoundingFrequency: CompoundingFrequency; // Frecuencia de capitalización
  periodicDeposit: number; // Aporte periódico (ej. mensual)
  includePeriodicDeposit: boolean; // Si se incluye o no el aporte
  depositTiming?: 'beginning' | 'end'; // Al inicio o fin del periodo (def: end)
}

export interface PeriodBreakdown {
  period: number;
  year: number;
  label: string;
  startingBalance: number;
  deposit: number;
  interestEarned: number;
  totalInterestToDate: number;
  totalContributedToDate: number;
  endingBalance: number;
}

export interface CompoundInterestResult {
  initialDeposit: number;
  totalPrincipalContributed: number; // Capital aportado total
  totalInterestEarned: number; // Rendimiento ganado
  futureValue: number; // Valor Futuro Estimado (VF)
  totalReturnPercentage: number; // Rendimiento total porcentual
  multiplier: number; // Factor multiplicador (VF / Capital Aportado)
  principalPercentage: number; // % del capital aportado en el VF
  interestPercentage: number; // % del interés ganado en el VF
  breakdown: PeriodBreakdown[]; // Evolución detallada periodo a periodo
}

// ==========================================
// RF-06: CONVERSIÓN DE TASAS
// ==========================================

export interface RateConversionInput {
  sourceRate: number; // Valor Porcentual Anual / Periódico de entrada (%)
  sourceType: RateType; // Nominal (T.N.) o Efectiva (E.A.)
  sourcePeriodicity: Periodicity; // Periodicidad de origen
  sourceModality: RateModality; // Vencida (V) o Anticipada (A)
  targetType: RateType; // Tipo buscado: Nominal (T.N.) o Efectiva (E.A.)
  targetPeriodicity: Periodicity; // Periodicidad de capitalización destino
  targetModality: RateModality; // Vencida (V) o Anticipada (A)
}

export interface RateConversionResult {
  equivalentRate: number; // Tasa Equivalente Calculada (%)
  effectiveAnnualRate: number; // Tasa Efectiva Anual de referencia normalizada (%)
  targetPeriodicRate: number; // Tasa periódica en el periodo destino (%)
  targetPeriodicLabel: string; // Etiqueta descriptiva (ej. "1.39 % M. Venc.")
  mathematicalFormula: string; // Explicación de la fórmula aplicada
  verified: boolean; // Validación matemática confirmada
}
