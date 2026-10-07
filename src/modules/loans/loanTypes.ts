/**
 * Contratos de Tipos para Préstamos y Amortización (RF-07 y RF-08)
 * Aura Financial V2.5
 */

export type AmortizationSystem = 'frances' | 'aleman';

export type LoanPaymentFrequency = 'monthly' | 'biweekly' | 'quarterly';

export type InsuranceType = 'fixed' | 'percentage';

export type LoanRateType = 'effective' | 'nominal';

export interface LoanSimulationInput {
  amount: number; // Monto solicitado del préstamo ($)
  annualRate: number; // Tasa de interés anual (%)
  rateType?: LoanRateType; // Efectiva Anual (E.A.) o Tasa Nominal (Mes Vencido) (def: effective)
  term: number; // Plazo en número de cuotas (n)
  frequency?: LoanPaymentFrequency; // Periodicidad de pago (def: monthly)
  system?: AmortizationSystem; // Sistema de amortización: 'frances' o 'aleman' (def: frances)
  insuranceType?: InsuranceType; // Seguro de vida: 'fixed' ($) o 'percentage' (% sobre saldo)
  insuranceValue?: number; // Valor fijo ($) por cuota o % mensual sobre saldo
  otherCosts?: number; // Gastos fijos de administración o manejo por cuota ($)
  startDate?: string | Date; // Fecha inicial o de desembolso para proyectar vencimientos
}

export interface AmortizationRow {
  installmentNumber: number; // 1. Número de cuota (1, 2, ..., n)
  dueDate: string; // 2. Fecha estimada de vencimiento (ej. "15 May 2025")
  paymentAmount: number; // 3. Valor total de la cuota periódica (Capital + Interés + Seguro + Otros)
  principal: number; // 4. Abono a capital del periodo
  interest: number; // 5. Interés devengado del periodo (Saldo * ip)
  insurance: number; // 6. Seguro de vida de la cuota
  otherCosts: number; // 7. Gastos fijos de administración / manejo
  remainingBalance: number; // 8. Saldo deudor restante tras el pago (0.00 en última cuota)
}

export interface LoanDistributionSummary {
  capitalPercentage: number; // % del capital sobre el gran total pagado
  interestPercentage: number; // % de los intereses sobre el gran total pagado
  chargesPercentage: number; // % de seguros y cargos sobre el gran total pagado
}

export interface LoanSimulationResult {
  amount: number; // Monto solicitado (Capital original)
  term: number; // Número total de periodos (n)
  frequency: LoanPaymentFrequency; // Periodicidad aplicada
  system: AmortizationSystem; // Sistema de amortización utilizado
  annualRate: number; // Tasa anual original (%)
  rateType: LoanRateType; // Tipo de tasa ingresada
  periodicRate: number; // Tasa periódica efectiva (ip en %, ej. 0.986%)
  periodicRateDecimal: number; // Tasa periódica en decimal exacto (ip)
  periodicRateLabel: string; // Etiqueta descriptiva (ej. "0.986% mensual")
  estimatedInstallment: number; // Cuota periódica estimada (o inicial en Alemán)
  firstInstallment: number; // Valor de la primera cuota total
  lastInstallment: number; // Valor de la última cuota total
  baseInstallment: number; // Cuota financiera base (sin cargos adicionales)
  totalPrincipal: number; // Suma de abonos a capital (exactamente igual al monto)
  totalInterest: number; // Suma acumulada de intereses devengados
  totalInsurance: number; // Suma acumulada de seguros de vida
  totalOtherCosts: number; // Suma acumulada de costos fijos de manejo
  totalAdditionalCharges: number; // Total acumulado de seguros + costos fijos
  totalCost: number; // Costo Total del Crédito (Capital + Intereses + Seguros + Otros)
  schedule: AmortizationRow[]; // Cronograma detallado de todas las cuotas (RF-08)
  summary: LoanDistributionSummary; // Porcentajes de composición para barras de progreso
}
