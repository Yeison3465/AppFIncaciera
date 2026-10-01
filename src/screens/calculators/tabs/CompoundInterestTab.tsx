import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import {
  ChartDataPoint,
  FinancialAreaChart,
  FinancialStepper,
  PrimaryButton,
  SecondaryButton,
} from '../../../components';
import { AURA_COLORS } from '../../../constants/theme';
import { calculateCompoundInterest } from '../../../modules';
import { CompoundingFrequency, TimeUnit } from '../../../types/financial';

export interface CompoundInterestTabProps {
  onCalculate?: () => void;
}

/**
 * Pestaña: Interés Compuesto (RF-05)
 * Implementada 100% con clases de Tailwind CSS / NativeWind.
 */
const CompoundInterestTabComponent: React.FC<CompoundInterestTabProps> = ({ onCalculate }) => {
  const [compoundInitialDeposit, setCompoundInitialDeposit] = useState<number>(0);
  const [compoundFrequency, setCompoundFrequency] = useState<CompoundingFrequency>('monthly');
  const [compoundPeriodicDeposit, setCompoundPeriodicDeposit] = useState<number>(0);
  const [compoundIncludePeriodic, setCompoundIncludePeriodic] = useState<boolean>(false);
  const [compoundRateNominal, setCompoundRateNominal] = useState<number>(0);
  const [compoundTerm, setCompoundTerm] = useState<number>(0);
  const [compoundTermUnit, setCompoundTermUnit] = useState<TimeUnit>('years');

  const compoundResult = useMemo(() => {
    try {
      return calculateCompoundInterest({
        initialDeposit: compoundInitialDeposit,
        nominalAnnualRate: compoundRateNominal,
        term: compoundTerm,
        termUnit: compoundTermUnit,
        compoundingFrequency: compoundFrequency,
        periodicDeposit: compoundPeriodicDeposit,
        includePeriodicDeposit: compoundIncludePeriodic,
      });
    } catch {
      return null;
    }
  }, [compoundInitialDeposit, compoundRateNominal, compoundTerm, compoundTermUnit, compoundFrequency, compoundPeriodicDeposit, compoundIncludePeriodic]);

  const resetCompound = () => {
    setCompoundInitialDeposit(0);
    setCompoundFrequency('monthly');
    setCompoundPeriodicDeposit(0);
    setCompoundIncludePeriodic(false);
    setCompoundRateNominal(0);
    setCompoundTerm(0);
    setCompoundTermUnit('years');
  };

  const formatCurrency = (amount: number) => {
    return `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const unitLabel = compoundTermUnit === 'years' ? 'Años' : compoundTermUnit === 'months' ? 'Meses' : 'Días';

  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!compoundResult) return [];

    const points: ChartDataPoint[] = [];

    // Punto de partida inicial (Periodo 0)
    points.push({
      value: compoundResult.initialDeposit,
      secondaryValue: compoundResult.initialDeposit,
      label: '0',
      periodLabel: 'Inicio',
    });

    const breakdown = compoundResult.breakdown;
    if (breakdown.length === 0) return points;

    if (breakdown.length <= 15) {
      breakdown.forEach((item) => {
        const isEnd = item.period === breakdown.length;
        points.push({
          value: item.endingBalance,
          secondaryValue: item.totalContributedToDate,
          label: isEnd || item.period % 3 === 0 ? `${item.period}` : '',
          periodLabel: compoundTermUnit === 'years'
            ? `Año ${item.year}`
            : compoundTermUnit === 'months'
              ? `Mes ${item.period}`
              : `Periodo ${item.period}`,
        });
      });
    } else {
      // Mapeo anual agrupado
      const yearlyMap = new Map<number, typeof compoundResult.breakdown[0]>();
      for (const item of breakdown) {
        yearlyMap.set(item.year, item);
      }

      const totalYears = yearlyMap.size;
      const labelStep = totalYears <= 6 ? 1 : totalYears <= 15 ? 3 : 5;

      Array.from(yearlyMap.entries()).forEach(([year, item]) => {
        const isMilestone = year % labelStep === 0 || year === totalYears;
        points.push({
          value: item.endingBalance,
          secondaryValue: item.totalContributedToDate,
          label: isMilestone ? `${year}` : '',
          periodLabel: `Año ${year}`,
        });
      });
    }

    return points;
  }, [compoundResult, compoundTermUnit]);

  if (!compoundResult) return null;

  return (
    <View>
      {/* TÍTULO PRINCIPAL DE LA PESTAÑA */}
      <View className="pt-1 pb-1 px-0.5">
        <Text className="text-3xl font-extrabold text-textDark tracking-tight">
          Interés Compuesto
        </Text>
      </View>

      {/* HERO CARD INTERÉS COMPUESTO */}
      <View className="bg-white rounded-3xl p-5 my-2.5 border border-gray-100">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[11px] font-medium text-textMutedDark tracking-wider">
            VALOR FUTURO ESTIMADO
          </Text>
          <View className="flex-row items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-md">
            <Ionicons name="trending-up" size={13} color={AURA_COLORS.emeraldGreen} />
            <Text className="text-[10px] font-bold text-emerald-800">
              +{compoundResult.totalReturnPercentage.toFixed(1)}% ({compoundResult.multiplier.toFixed(2)}x)
            </Text>
          </View>
        </View>

        <Text
          className="text-[34px] font-extrabold text-textDark tracking-tight my-1"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {formatCurrency(compoundResult.futureValue)}
        </Text>

        {/* 2 Columnas de métricas */}
        <View className="flex-row gap-3 my-3">
          <View className="flex-1 bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-1.5">
              <View className="w-2 h-2 rounded-full bg-gray-500" />
              <Text className="text-[13px] font-medium text-gray-700">Capital Aportado</Text>
            </View>
            <Text
              className="text-[22px] font-extrabold text-textDark tracking-tight"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(compoundResult.totalPrincipalContributed)}
            </Text>
            <Text className="text-xs text-textMutedDark mt-1">
              {compoundResult.principalPercentage}% del total
            </Text>
          </View>

          <View className="flex-1 bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-1.5">
              <View className="w-2 h-2 rounded-full bg-emerald-500" />
              <Text className="text-[13px] font-medium text-emerald-600">Rendimiento Ganado</Text>
            </View>
            <Text
              className="text-[22px] font-extrabold text-emerald-600 tracking-tight"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              +{formatCurrency(compoundResult.totalInterestEarned)}
            </Text>
            <Text className="text-xs text-emerald-600 mt-1">
              {compoundResult.interestPercentage}% interés puro
            </Text>
          </View>
        </View>

        {/* Gráfica de Crecimiento Exponencial con Scrubber */}
        <FinancialAreaChart
          data={chartData}
          primaryColor={AURA_COLORS.amberGold}
          secondaryColor="#9CA3AF"
          primaryLabel="Valor Proyectado"
          secondaryLabel="Capital Aportado"
          showSecondaryLine={compoundIncludePeriodic && compoundPeriodicDeposit > 0}
          badgeText={`Meta: ${compoundTerm} ${unitLabel}`}
        />
      </View>

      {/* FORMULARIO: CONFIGURACIÓN DE PROYECCIÓN */}
      <View className="bg-white rounded-2xl p-5 my-2.5 border border-gray-100">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-textDark">Configuración de Proyección</Text>
          <Ionicons name="options-outline" size={20} color={AURA_COLORS.textDark} />
        </View>

        {/* Frecuencia de Capitalización */}
        <View className="my-2">
          <Text className="text-base font-semibold text-textMutedDark mb-1.5">Frecuencia de Capitalización</Text>
          <View className="flex-row bg-gray-100 rounded-xl p-1 gap-1">
            {(['daily', 'monthly', 'quarterly', 'annual'] as CompoundingFrequency[]).map((freq) => {
              const labels: Record<CompoundingFrequency, string> = {
                daily: 'Diaria',
                monthly: 'Mensual',
                quarterly: 'Trimestral',
                annual: 'Anual',
              };
              const isSel = compoundFrequency === freq;
              return (
                <TouchableOpacity
                  key={freq}
                  onPress={() => setCompoundFrequency(freq)}
                  className={`flex-1 py-2 items-center justify-center rounded-lg ${isSel ? 'bg-obsidian' : 'bg-transparent'
                    }`}
                >
                  <Text
                    className={`text-[11px] font-bold ${isSel ? 'text-white' : 'text-textDark'
                      }`}
                    numberOfLines={1}
                  >
                    {labels[freq]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Depósito Inicial */}
        <FinancialStepper
          label="Depósito Inicial"
          labelClassName="text-base font-semibold text-textMutedDark"
          value={compoundInitialDeposit}
          onChange={setCompoundInitialDeposit}
          step={1000}
          min={0}
          prefix="$"
        />

        {/* Aporte Periódico Mensual con Switch */}
        <View className="my-2">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-base font-semibold text-textMutedDark">Aporte Periódico Mensual</Text>
            <View className="flex-row items-center gap-2">
              {compoundIncludePeriodic && (
                <View className="bg-amber-100 px-2 py-0.5 rounded">
                  <Text className="text-[10px] font-bold text-amber-800">Activo</Text>
                </View>
              )}
              <Switch
                value={compoundIncludePeriodic}
                onValueChange={setCompoundIncludePeriodic}
                trackColor={{ false: '#E5E7EB', true: AURA_COLORS.obsidian }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
          {compoundIncludePeriodic && (
            <FinancialStepper
              label=""
              value={compoundPeriodicDeposit}
              onChange={setCompoundPeriodicDeposit}
              step={50}
              min={0}
              prefix="$"
            />
          )}
        </View>

        {/* Tasa Nominal Anual */}
        <FinancialStepper
          label="Tasa Nominal Anual (%)"
          subLabel="Pactada antes de capitalizaciones"
          labelClassName="text-base font-semibold text-textMutedDark"
          value={compoundRateNominal}
          onChange={setCompoundRateNominal}
          step={0.25}
          min={0}
          decimals={1}
          suffix="%"
        />

        {/* Plazo o Periodo de Tiempo */}
        <View className="my-2">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-base font-semibold text-textMutedDark">Plazo o Periodo de Tiempo</Text>
            <Text className="text-[11px] text-textMutedDark">Horizonte (t)</Text>
          </View>
          <View>
            <FinancialStepper
              label=""
              value={compoundTerm}
              onChange={setCompoundTerm}
              step={1}
              min={0}
            />
            {/* Selector de unidad de tiempo: Años, Meses, Días */}
            <View className="flex-row gap-2 mt-1.5">
              {(['years', 'months', 'days'] as TimeUnit[]).map((unit) => {
                const labels: Record<TimeUnit, string> = {
                  years: 'Años',
                  months: 'Meses',
                  days: 'Días',
                };
                const isSel = compoundTermUnit === unit;
                return (
                  <TouchableOpacity
                    key={unit}
                    onPress={() => setCompoundTermUnit(unit)}
                    className={`flex-1 py-1.5 items-center justify-center rounded-lg border ${isSel
                        ? 'bg-obsidian border-obsidian'
                        : 'bg-gray-50 border-gray-200'
                      }`}
                  >
                    <Text
                      className={`text-xs font-bold ${isSel ? 'text-white' : 'text-textDark'
                        }`}
                    >
                      {labels[unit]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* BLOQUE: EFECTO BOLA DE NIEVE */}
      <View className="bg-gray-100 rounded-2xl p-4 my-2.5 flex-row items-start">
        <View className="w-10 h-10 rounded-full bg-[#FEEBC8] items-center justify-center mr-3.5 mt-0.5">
          <Ionicons name="bulb" size={20} color="#F59E0B" />
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-textDark mb-1">Efecto Bola de Nieve</Text>
          <Text className="text-xs text-gray-600 leading-[19px] font-normal">
            {`En un plazo de ${compoundTerm} ${unitLabel.toLowerCase()} al ${compoundRateNominal}%, tus intereses generados superan el ${compoundResult.totalReturnPercentage.toFixed(0)}% del capital que aportaste. El tiempo es el factor exponencial clave.`}
          </Text>
        </View>
      </View>

      {/* BOTONES DE ACCIÓN */}
      <View className="mt-2 gap-2.5">
        <PrimaryButton
          title="Recalcular Proyección"
          iconName="sync"
          iconPosition="left"
          iconColor={AURA_COLORS.amberGold}
          onPress={() => onCalculate?.()}
        />
        <View className="flex-row gap-2">
          <SecondaryButton
            title="Restablecer"
            iconName="refresh"
            onPress={resetCompound}
            style={{ flex: 1 }}
          />
          <SecondaryButton
            title="Compartir Reporte"
            iconName="share-outline"
            onPress={() => { }}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </View>
  );
};

export const CompoundInterestTab = React.memo(CompoundInterestTabComponent);

