import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AURA_COLORS } from '../../../constants/theme';
import {
  AmortizationSystem,
  InsuranceType,
  LoanPaymentFrequency,
  LoanRateType,
  LoanSimulationResult,
} from '../../../modules/loans/loanTypes';
import { formatCurrency, formatCurrencyInt } from '../../../utils/formatters';
import { AmortizationTipCard } from './AmortizationTipCard';
import { LoanStepper } from './LoanStepper';

interface LoanSimulatorTabProps {
  amount: number;
  setAmount: (val: number) => void;
  annualRate: number;
  setAnnualRate: (val: number) => void;
  rateType: LoanRateType;
  setRateType: (val: LoanRateType) => void;
  term: number;
  setTerm: (val: number) => void;
  frequency: LoanPaymentFrequency;
  setFrequency: (val: LoanPaymentFrequency) => void;
  system: AmortizationSystem;
  setSystem: (val: AmortizationSystem) => void;
  insuranceType: InsuranceType;
  setInsuranceType: (val: InsuranceType) => void;
  insuranceValue: number;
  setInsuranceValue: (val: number) => void;
  otherCosts: number;
  setOtherCosts: (val: number) => void;
  result: LoanSimulationResult;
  onViewAmortization: () => void;
  onReset: () => void;
}

export const LoanSimulatorTab: React.FC<LoanSimulatorTabProps> = ({
  amount,
  setAmount,
  annualRate,
  setAnnualRate,
  rateType,
  setRateType,
  term,
  setTerm,
  frequency,
  setFrequency,
  system,
  setSystem,
  insuranceType,
  setInsuranceType,
  insuranceValue,
  setInsuranceValue,
  otherCosts,
  setOtherCosts,
  result,
  onViewAmortization,
  onReset,
}) => {
  // Helpers para montos y steppers (con mínimo en 0)
  const handleAmountInc = () => setAmount(Math.min(100000, amount + 1000));
  const handleAmountDec = () => setAmount(Math.max(0, amount - 1000));

  const handleRateInc = () => setAnnualRate(Math.min(50, Number((annualRate + 0.25).toFixed(2))));
  const handleRateDec = () => setAnnualRate(Math.max(0, Number((annualRate - 0.25).toFixed(2))));

  const handleTermInc = () => setTerm(Math.min(120, term + (frequency === 'biweekly' ? 2 : 1)));
  const handleTermDec = () => setTerm(Math.max(0, term - (frequency === 'biweekly' ? 2 : 1)));

  const handleInsInc = () => {
    if (insuranceType === 'fixed') {
      setInsuranceValue(Number((insuranceValue + 1).toFixed(2)));
    } else {
      setInsuranceValue(Number((insuranceValue + 0.05).toFixed(2)));
    }
  };

  const handleInsDec = () => {
    if (insuranceType === 'fixed') {
      setInsuranceValue(Math.max(0, Number((insuranceValue - 1).toFixed(2))));
    } else {
      setInsuranceValue(Math.max(0, Number((insuranceValue - 0.05).toFixed(2))));
    }
  };

  const handleFeeInc = () => setOtherCosts(Number((otherCosts + 1).toFixed(2)));
  const handleFeeDec = () => setOtherCosts(Math.max(0, Number((otherCosts - 1).toFixed(2))));

  // Frecuencia labels
  const freqLabel = frequency === 'biweekly' ? '/ quincena' : frequency === 'quarterly' ? '/ trim.' : '/ mes';
  const termUnitLabel = frequency === 'biweekly' ? 'Quincenas' : frequency === 'quarterly' ? 'Trimestres' : 'Meses';

  // Quick Chips
  const AMOUNT_CHIPS = [
    { label: '$5M', val: 5000 },
    { label: '$10M', val: 10000 },
    { label: '$15M', val: 15000 },
    { label: '$20M', val: 20000 },
  ];

  const RATE_CHIPS = [10.5, 12.5, 15.0, 18.0];
  const TERM_CHIPS = [12, 24, 36, 48];

  const hasCalculation = result && result.amount > 0 && result.term > 0;

  return (
    <View className="space-y-4">
      {/* 1. Título principal de la pestaña (Estilo idéntico a Calculadoras) */}
      <View className="pt-1 pb-1 px-0.5">
        <Text className="text-3xl font-extrabold text-textDark tracking-tight">
          Simulador de Crédito
        </Text>
      </View>

      {/* 2. Tarjeta Hero de Resultados (Estilo idéntico a CompoundInterestTab) */}
      <View className="bg-white rounded-3xl p-5 my-1 border border-gray-100">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[11px] font-medium text-textMutedDark tracking-wider uppercase">
            CUOTA ESTIMADA
          </Text>
          <View className="flex-row items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-md">
            <Ionicons name="trending-up" size={13} color={AURA_COLORS.emeraldGreen} />
            <Text className="text-[10px] font-bold text-emerald-800">
              {system === 'frances' ? 'Cuota Fija' : 'Abono Constante'}
            </Text>
          </View>
        </View>

        <Text
          className="text-[34px] font-extrabold text-textDark tracking-tight my-1"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {formatCurrency(hasCalculation ? result.estimatedInstallment : 0)}
        </Text>

        <Text className="text-xs text-textMutedDark mb-2">
          {system === 'frances'
            ? `Cuota periódica proyectada ${freqLabel}`
            : hasCalculation && result.firstInstallment > 0
              ? `Rango decreciente: ${formatCurrency(result.firstInstallment)} → ${formatCurrency(result.lastInstallment)}`
              : 'Cuotas periódicas decrecientes'}
        </Text>

        {/* 2 Columnas de métricas en cajas grises */}
        <View className="flex-row gap-3 my-3">
          <View className="flex-1 bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-1.5">
              <View className="w-2 h-2 rounded-full bg-gray-500" />
              <Text className="text-[13px] font-medium text-gray-700">Capital Solicitado</Text>
            </View>
            <Text
              className="text-[22px] font-extrabold text-textDark tracking-tight"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(hasCalculation ? result.totalPrincipal : 0)}
            </Text>
            <Text className="text-xs text-textMutedDark mt-1">
              {term > 0 ? `${term} ${termUnitLabel}` : '0 cuotas'}
            </Text>
          </View>

          <View className="flex-1 bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-1.5">
              <View className="w-2 h-2 rounded-full bg-amber-500" />
              <Text className="text-[13px] font-medium text-amber-600">Total Intereses</Text>
            </View>
            <Text
              className="text-[22px] font-extrabold text-amber-600 tracking-tight"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(hasCalculation ? result.totalInterest : 0)}
            </Text>
            <Text className="text-xs text-amber-600 mt-1">
              {hasCalculation && result.totalPrincipal > 0
                ? `${((result.totalInterest / result.totalPrincipal) * 100).toFixed(1)}% s/ capital`
                : '0.0%'}
            </Text>
          </View>
        </View>

        {/* Fila secundaria: Seguros & Gastos y Costo Total del Crédito */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-gray-50 rounded-2xl p-3.5">
            <Text className="text-xs font-medium text-gray-600 mb-1">Seguros & Gastos</Text>
            <Text
              className="text-base font-extrabold text-textDark"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(hasCalculation ? result.totalAdditionalCharges : 0)}
            </Text>
          </View>

          <View className="flex-1 bg-gray-50 rounded-2xl p-3.5">
            <Text className="text-xs font-medium text-emerald-700 mb-1">Costo Total Crédito</Text>
            <Text
              className="text-base font-extrabold text-emerald-600"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(hasCalculation ? result.totalCost : 0)}
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Selector de Sistema de Amortización */}
      <View className="bg-white border border-gray-100 rounded-2xl p-5 my-1 space-y-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-lg font-bold text-textDark">
            Sistema de Amortización
          </Text>
          <View className="px-2.5 py-0.5 rounded-full bg-gray-100">
            <Text className="text-[11px] font-semibold text-textMutedDark">
              {system === 'frances' ? 'Cuota Constante' : 'Abono Constante'}
            </Text>
          </View>
        </View>

        <View className="flex-row p-1 bg-gray-100 rounded-xl gap-2 mt-2 mb-2">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSystem('frances')}
            className={`flex-1 py-2.5 px-3 rounded-lg items-center justify-center ${
              system === 'frances' ? 'bg-obsidian' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                system === 'frances' ? 'text-white' : 'text-textDark'
              }`}
            >
              Sistema Francés
            </Text>
            <Text
              className={`text-[10px] mt-0.5 ${
                system === 'frances' ? 'text-gray-300' : 'text-textMutedDark'
              }`}
            >
              Cuota Fija Mensual
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSystem('aleman')}
            className={`flex-1 py-2.5 px-3 rounded-lg items-center justify-center ${
              system === 'aleman' ? 'bg-obsidian' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                system === 'aleman' ? 'text-white' : 'text-textDark'
              }`}
            >
              Sistema Alemán
            </Text>
            <Text
              className={`text-[10px] mt-0.5 ${
                system === 'aleman' ? 'text-gray-300' : 'text-textMutedDark'
              }`}
            >
              Abono Constante
            </Text>
          </TouchableOpacity>
        </View>

        <View className="rounded-xl bg-gray-50 p-3 border border-gray-100">
          <Text className="text-xs text-textMutedDark leading-relaxed">
            <Text className="font-bold text-textDark">
              {system === 'frances' ? 'Sistema Francés: ' : 'Sistema Alemán: '}
            </Text>
            {system === 'frances'
              ? 'Cuotas periódicas uniformes de principio a fin (Abono a capital crece progresivamente, interés decrece).'
              : 'Amortización de capital constante en todas las cuotas; los intereses y la cuota total decrecen en el tiempo.'}
          </Text>
        </View>
      </View>

      {/* 4. Formulario de Parámetros del Préstamo */}
      <View className="bg-white border border-gray-100 rounded-2xl p-5 my-1 space-y-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-bold text-textDark">
            Parámetros del Crédito
          </Text>
          <Ionicons name="options-outline" size={20} color={AURA_COLORS.textDark} />
        </View>

        <View className="my-2">
          <View className="mb-2">
            <Text className="text-base font-semibold text-textMutedDark">
              Monto del Préstamo
            </Text>
          </View>

          {/* Stepper táctil Aura */}
          <LoanStepper
            value={formatCurrencyInt(amount)}
            suffix={
              amount > 0 ? (
                <Ionicons name="checkmark-circle" size={16} color="#F59E0B" />
              ) : undefined
            }
            onDecrement={handleAmountDec}
            onIncrement={handleAmountInc}
            disableDecrement={amount <= 0}
          />

          {/* Chips de Selección Rápida ($5M, $10M, $15M, $20M) */}
          <View className="flex-row items-center justify-between pt-2.5 gap-2">
            {AMOUNT_CHIPS.map((chip) => {
              const isSelected = amount === chip.val;
              return (
                <TouchableOpacity
                  key={chip.val}
                  activeOpacity={0.7}
                  onPress={() => setAmount(chip.val)}
                  className={`flex-1 py-1.5 rounded-full items-center justify-center border ${
                    isSelected
                      ? 'bg-obsidian border-obsidian'
                      : 'bg-gray-50 border-[#E4E4E7]'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-textDark'
                    }`}
                    style={{ fontVariant: ['tabular-nums'] }}
                  >
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CAMPO 2: Tasa de Interés */}
        <View className="my-2 pt-2 border-t border-gray-100">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-semibold text-textMutedDark">
              Tasa de Interés (%)
            </Text>
            <Text className="text-xs font-bold text-[#F59E0B]">
              Tasa Anual
            </Text>
          </View>

          {/* Selector tipo de tasa: E.A. vs Mes Vencido con gap generoso */}
          <View className="flex-row p-1 bg-gray-100 rounded-xl gap-2 mt-1 mb-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRateType('effective')}
              className={`flex-1 py-2.5 px-3 rounded-lg items-center justify-center ${
                rateType === 'effective' ? 'bg-obsidian' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  rateType === 'effective' ? 'text-white' : 'text-textDark'
                }`}
              >
                Efectiva Anual (E.A.)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRateType('nominal')}
              className={`flex-1 py-2.5 px-3 rounded-lg items-center justify-center ${
                rateType === 'nominal' ? 'bg-obsidian' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  rateType === 'nominal' ? 'text-white' : 'text-textDark'
                }`}
              >
                Mes Vencido (Nominal)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stepper de Tasa con ajuste fino ±0.25% */}
          <LoanStepper
            value={annualRate.toFixed(2)}
            suffix={
              <View className="flex-row items-baseline gap-1">
                <Text className="text-sm font-bold text-textMutedDark">%</Text>
                <Text className="text-[11px] text-textMutedDark ml-0.5">(±0.25%)</Text>
              </View>
            }
            onDecrement={handleRateDec}
            onIncrement={handleRateInc}
            disableDecrement={annualRate <= 0}
          />

          {/* Chips Rápidos de Tasas */}
          <View className="flex-row items-center justify-between pt-2.5 gap-2">
            {RATE_CHIPS.map((r) => {
              const isSelected = Math.abs(annualRate - r) < 0.01;
              return (
                <TouchableOpacity
                  key={r}
                  activeOpacity={0.7}
                  onPress={() => setAnnualRate(r)}
                  className={`flex-1 py-1.5 rounded-full items-center justify-center border ${
                    isSelected
                      ? 'bg-obsidian border-obsidian'
                      : 'bg-gray-50 border-[#E4E4E7]'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-textDark'
                    }`}
                    style={{ fontVariant: ['tabular-nums'] }}
                  >
                    {r.toFixed(1)}%
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CAMPO 3: Plazo y Periodicidad */}
        <View className="my-2 pt-2 border-t border-gray-100">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-semibold text-textMutedDark">
              Plazo y Periodicidad
            </Text>
            <Text className="text-xs text-textMutedDark">
              Frecuencia de amortización
            </Text>
          </View>

          {/* Selector de frecuencia con gap generoso */}
          <View className="flex-row p-1 bg-gray-100 rounded-xl gap-2 mt-1 mb-3">
            {(['monthly', 'biweekly', 'quarterly'] as LoanPaymentFrequency[]).map((freq) => {
              const isSel = frequency === freq;
              const label = freq === 'monthly' ? 'Mensual' : freq === 'biweekly' ? 'Quincenal' : 'Trimestral';
              return (
                <TouchableOpacity
                  key={freq}
                  activeOpacity={0.8}
                  onPress={() => setFrequency(freq)}
                  className={`flex-1 py-2.5 px-2 rounded-lg items-center justify-center ${
                    isSel ? 'bg-obsidian' : 'bg-transparent'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSel ? 'text-white' : 'text-textDark'
                    }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Stepper de Plazo */}
          <LoanStepper
            value={term}
            suffix={termUnitLabel}
            onDecrement={handleTermDec}
            onIncrement={handleTermInc}
            disableDecrement={term <= 0}
          />

          {/* Chips Rápidos de Plazos */}
          <View className="flex-row items-center justify-between pt-2.5 gap-2">
            {TERM_CHIPS.map((t) => {
              const isSelected = term === t;
              return (
                <TouchableOpacity
                  key={t}
                  activeOpacity={0.7}
                  onPress={() => setTerm(t)}
                  className={`flex-1 py-1.5 rounded-full items-center justify-center border ${
                    isSelected
                      ? 'bg-obsidian border-obsidian'
                      : 'bg-gray-50 border-[#E4E4E7]'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-textDark'
                    }`}
                    style={{ fontVariant: ['tabular-nums'] }}
                  >
                    {t} {frequency === 'biweekly' ? 'q' : 'm'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CAMPO 4: Seguros y Costos Periódicos Asociados */}
        <View className="my-2 pt-2 border-t border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-textMutedDark">
              Seguros y Costos Periódicos
            </Text>
            <Ionicons name="shield-checkmark-outline" size={18} color="#F59E0B" />
          </View>

          <View className="space-y-4">
            {/* Seguro de Vida Deudores */}
            <View>
              <View className="flex-row items-center justify-between mb-2.5">
                <View>
                  <Text className="text-base font-bold text-textDark">
                    Seguro de Vida Deudores
                  </Text>
                  <Text className="text-xs text-textMutedDark mt-0.5">
                    Póliza obligatoria
                  </Text>
                </View>

                {/* Toggle $ Fijo vs % Saldo */}
                <View className="flex-row p-1 bg-gray-100 rounded-xl gap-1">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setInsuranceType('fixed');
                    }}
                    className={`px-3 py-1.5 rounded-lg ${
                      insuranceType === 'fixed' ? 'bg-obsidian' : 'bg-transparent'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        insuranceType === 'fixed' ? 'text-white' : 'text-textMutedDark'
                      }`}
                    >
                      $ Fijo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setInsuranceType('percentage');
                    }}
                    className={`px-3 py-1.5 rounded-lg ${
                      insuranceType === 'percentage' ? 'bg-obsidian' : 'bg-transparent'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        insuranceType === 'percentage' ? 'text-white' : 'text-textMutedDark'
                      }`}
                    >
                      % Saldo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Stepper Seguro Estandarizado */}
              <LoanStepper
                value={
                  insuranceType === 'fixed'
                    ? formatCurrency(insuranceValue)
                    : `${insuranceValue.toFixed(2)} %`
                }
                suffix={insuranceType === 'fixed' ? '/ cuota' : 's/ saldo'}
                onDecrement={handleInsDec}
                onIncrement={handleInsInc}
                disableDecrement={insuranceValue <= 0}
              />
            </View>

            {/* Otros Costos Periódicos */}
            <View className="pt-2 border-t border-gray-100">
              <View className="mb-2.5">
                <Text className="text-base font-bold text-textDark">
                  Otros Costos Periódicos
                </Text>
                <Text className="text-xs text-textMutedDark mt-0.5">
                  Gastos de administración y manejo
                </Text>
              </View>

              {/* Stepper Otros Costos Estandarizado */}
              <LoanStepper
                value={formatCurrency(otherCosts)}
                suffix="/ cuota"
                onDecrement={handleFeeDec}
                onIncrement={handleFeeInc}
                disableDecrement={otherCosts <= 0}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Tip Card de Optimización de Amortización (Mockup Stitch) */}
      <View className="my-2">
        <AmortizationTipCard />
      </View>

      {/* 5. Botones de Acción */}
      <View className="space-y-3 pt-2 mb-6">
        {/* Botón Ver Tabla de Amortización (Texto centrado) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onViewAmortization}
          className="w-full h-[52px] bg-[#F59E0B] rounded-full items-center justify-center px-4"
        >
          <Text className="text-[#121316] font-extrabold text-base text-center">
            Ver Tabla de Amortización
          </Text>
        </TouchableOpacity>

        {/* Botón Restablecer Valores a 0 */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onReset}
          className="w-full h-11 bg-white border border-[#ECEBED] rounded-full flex-row items-center justify-center gap-2 mt-1"
        >
          <Ionicons name="refresh" size={16} color={AURA_COLORS.textMutedDark} />
          <Text className="text-xs font-semibold text-textMutedDark">
            Restablecer Valores Predeterminados
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
