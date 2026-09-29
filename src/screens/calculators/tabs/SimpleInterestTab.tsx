import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../../constants/theme';
import {
  PrimaryButton,
  SecondaryButton,
  FinancialStepper,
  InfoBanner,
  FinancialAreaChart,
  ChartDataPoint,
} from '../../../components';
import { calculateSimpleInterest } from '../../../modules';
import { DayCountConvention, TimeUnit } from '../../../types/financial';

export interface SimpleInterestTabProps {
  onCalculate?: () => void;
}

/**
 * Pestaña: Interés Simple (RF-04)
 * Implementada 100% con clases de Tailwind CSS / NativeWind.
 */
export const SimpleInterestTab: React.FC<SimpleInterestTabProps> = ({ onCalculate }) => {
  const [simplePrincipal, setSimplePrincipal] = useState<number>(0);
  const [simpleRate, setSimpleRate] = useState<number>(0);
  const [simpleRatePeriodicity, setSimpleRatePeriodicity] = useState<'annual' | 'monthly'>('annual');
  const [simpleTerm, setSimpleTerm] = useState<number>(0);
  const [simpleTermUnit, setSimpleTermUnit] = useState<TimeUnit>('years');
  const [simpleConvention, setSimpleConvention] = useState<DayCountConvention>('commercial_360');

  const simpleResult = useMemo(() => {
    try {
      return calculateSimpleInterest({
        principal: simplePrincipal,
        annualRate: simpleRate,
        ratePeriodicity: simpleRatePeriodicity,
        term: simpleTerm,
        termUnit: simpleTermUnit,
        dayCountConvention: simpleConvention,
      });
    } catch {
      return null;
    }
  }, [simplePrincipal, simpleRate, simpleRatePeriodicity, simpleTerm, simpleTermUnit, simpleConvention]);

  const resetSimple = () => {
    setSimplePrincipal(0);
    setSimpleRate(0);
    setSimpleRatePeriodicity('annual');
    setSimpleTerm(0);
    setSimpleTermUnit('years');
    setSimpleConvention('commercial_360');
  };

  const formatCurrency = (amount: number) => {
    return `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!simpleResult) return [];

    const steps = 5;
    const points: ChartDataPoint[] = [];
    const totalYears = simpleResult.timeInYears;
    const totalInterest = simpleResult.interestEarned;
    const principal = simpleResult.principal;

    for (let i = 0; i <= steps; i++) {
      const fraction = i / steps;
      const currentYear = totalYears * fraction;
      const balance = principal + totalInterest * fraction;

      let label = '';
      if (i === 0) label = '0';
      else if (i === Math.floor(steps / 2)) label = `${currentYear.toFixed(1)}a`;
      else if (i === steps) label = `${totalYears.toFixed(1)}a`;

      points.push({
        value: Number(balance.toFixed(2)),
        secondaryValue: principal,
        label,
        periodLabel: i === 0 ? 'Inicio (Año 0)' : `Año ${currentYear.toFixed(1)}`,
      });
    }

    return points;
  }, [simpleResult]);

  if (!simpleResult) return null;

  return (
    <View>
      {/* HERO CARD INTERÉS SIMPLE */}
      <View className="bg-white rounded-3xl p-5 my-2.5 border border-gray-100">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[11px] font-bold text-textMuted tracking-wider">
            MONTO FINAL ACUMULADO (S)
          </Text>
          <View className="bg-amber-100 px-2 py-0.5 rounded-md">
            <Text className="text-[10px] font-bold text-amber-800">Interés Lineal Simple</Text>
          </View>
        </View>

        <Text
          className="text-[34px] font-extrabold text-textDark tracking-tight my-1"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {formatCurrency(simpleResult.finalAmount)}
        </Text>

        <View className="flex-row items-center gap-1.5 mt-1 mb-4">
          <Ionicons name="arrow-up-outline" size={14} color={AURA_COLORS.emeraldGreen} />
          <Text className="text-xs font-semibold text-emeraldGreen">
            +{simpleResult.totalReturnPercentage.toFixed(2)}% Rendimiento Total
          </Text>
          <Text className="text-xs text-gray-400">•</Text>
          <Text className="text-xs text-textMutedDark">Ganancia Lineal</Text>
        </View>

        {/* 2 Columnas de métricas */}
        <View className="flex-row gap-2.5 mb-4">
          <View className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <View className="flex-row items-center gap-1.5 mb-1">
              <View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <Text className="text-[10px] font-semibold text-textMutedDark">CAPITAL INICIAL (C)</Text>
            </View>
            <Text
              className="text-base font-bold text-textDark"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(simpleResult.principal)}
            </Text>
            <Text className="text-[11px] text-textMuted mt-0.5">
              {simpleResult.principalPercentage}% del acumulado
            </Text>
          </View>

          <View className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <View className="flex-row items-center gap-1.5 mb-1">
              <View className="w-1.5 h-1.5 rounded-full bg-emeraldGreen" />
              <Text className="text-[10px] font-semibold text-textMutedDark">INTERÉS TOTAL (I)</Text>
            </View>
            <Text
              className="text-base font-bold text-emeraldGreen"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              +{formatCurrency(simpleResult.interestEarned)}
            </Text>
            <Text className="text-[11px] text-emeraldGreen mt-0.5">
              {simpleResult.interestPercentage}% de retorno
            </Text>
          </View>
        </View>

        {/* Gráfica de Proyección Lineal Interactiva */}
        <FinancialAreaChart
          data={chartData}
          primaryColor={AURA_COLORS.emeraldGreen}
          secondaryColor="#9CA3AF"
          primaryLabel="Capital + Interés"
          secondaryLabel="Capital Inicial (C)"
          showSecondaryLine={true}
          badgeText={`Plazo: ${simpleTerm} ${simpleTermUnit === 'years' ? 'Años' : simpleTermUnit === 'months' ? 'Meses' : 'Días'}`}
        />
      </View>

      {/* FORMULARIO: CONFIGURACIÓN DEL CÁLCULO */}
      <View className="bg-white rounded-2xl p-5 my-2.5 border border-gray-100">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="options-outline" size={18} color={AURA_COLORS.amberGold} />
            <Text className="text-base font-bold text-textDark">Configuración del Cálculo</Text>
          </View>
          <View className="bg-gray-100 px-2 py-0.5 rounded-md">
            <Text className="text-[10px] font-bold text-textMutedDark">Aura V3</Text>
          </View>
        </View>

        {/* Capital Inicial */}
        <FinancialStepper
          label="Capital Inicial ($)"
          subLabel="Principal (C)"
          value={simplePrincipal}
          onChange={setSimplePrincipal}
          step={1000}
          min={100}
          prefix="$"
          accessoryIcon="copy-outline"
        />

        {/* Tasa de Interés Nominal */}
        <View className="my-2">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xs font-semibold text-textDark">Tasa de Interés Nominal (%)</Text>
            <View className="flex-row bg-gray-100 rounded-lg p-0.5">
              <TouchableOpacity
                onPress={() => setSimpleRatePeriodicity('annual')}
                className={`px-2.5 py-1 rounded-md ${
                  simpleRatePeriodicity === 'annual' ? 'bg-obsidian' : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    simpleRatePeriodicity === 'annual' ? 'text-white' : 'text-textMutedDark'
                  }`}
                >
                  Anual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSimpleRatePeriodicity('monthly')}
                className={`px-2.5 py-1 rounded-md ${
                  simpleRatePeriodicity === 'monthly' ? 'bg-obsidian' : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    simpleRatePeriodicity === 'monthly' ? 'text-white' : 'text-textMutedDark'
                  }`}
                >
                  Mensual
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FinancialStepper
            label=""
            value={simpleRate}
            onChange={setSimpleRate}
            step={0.25}
            min={0}
            decimals={2}
            suffix="%"
            accessoryIcon="pricetag-outline"
          />
        </View>

        {/* Plazo o Periodo */}
        <View className="my-2">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xs font-semibold text-textDark">Plazo o Periodo de Tiempo</Text>
            <Text className="text-[11px] text-textMutedDark">Duración (t)</Text>
          </View>
          <View>
            <FinancialStepper
              label=""
              value={simpleTerm}
              onChange={setSimpleTerm}
              step={1}
              min={0}
              accessoryIcon="calendar-outline"
            />
            {/* Selector de unidad de tiempo */}
            <View className="flex-row gap-2 mt-1.5">
              {(['years', 'months', 'days'] as TimeUnit[]).map((unit) => {
                const labels: Record<TimeUnit, string> = {
                  years: 'Años',
                  months: 'Meses',
                  days: 'Días',
                };
                const isSel = simpleTermUnit === unit;
                return (
                  <TouchableOpacity
                    key={unit}
                    onPress={() => setSimpleTermUnit(unit)}
                    className={`flex-1 py-1.5 items-center justify-center rounded-lg border ${
                      isSel
                        ? 'bg-obsidian border-obsidian'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSel ? 'text-white' : 'text-textDark'
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

        {/* Base de Cálculo Diaria */}
        <View className="my-2">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-xs font-semibold text-textDark">Base de Cálculo Diaria</Text>
            <Text className="text-[11px] text-textMutedDark">Convención Financiera</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSimpleConvention('commercial_360')}
              className={`flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-xl border ${
                simpleConvention === 'commercial_360'
                  ? 'bg-amber-50 border-amberGold'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color={simpleConvention === 'commercial_360' ? AURA_COLORS.amberGold : AURA_COLORS.textDark}
                style={{ marginRight: 6 }}
              />
              <Text
                className={`text-xs font-bold ${
                  simpleConvention === 'commercial_360' ? 'text-amber-800' : 'text-textDark'
                }`}
              >
                Comercial (360d)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSimpleConvention('exact_365')}
              className={`flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-xl border ${
                simpleConvention === 'exact_365'
                  ? 'bg-amber-50 border-amberGold'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <Ionicons
                name="calendar-clear-outline"
                size={14}
                color={simpleConvention === 'exact_365' ? AURA_COLORS.amberGold : AURA_COLORS.textDark}
                style={{ marginRight: 6 }}
              />
              <Text
                className={`text-xs font-bold ${
                  simpleConvention === 'exact_365' ? 'text-amber-800' : 'text-textDark'
                }`}
              >
                Real / Exacto (365d)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* INFO BANNER INTERÉS SIMPLE */}
      <InfoBanner
        title="Fórmula Directa I = C · i · t"
        description="En el interés simple, los rendimientos generados no se reinvierten ni capitalizan ciclo a ciclo; la ganancia se mantiene constante y estrictamente proporcional al capital inicial depositado."
      />

      {/* BOTONES DE ACCIÓN */}
      <View className="mt-2 gap-2.5">
        <PrimaryButton
          title="Calcular Interés Simple"
          iconName="arrow-up-circle-outline"
          iconPosition="left"
          onPress={() => onCalculate?.()}
        />
        <SecondaryButton
          title="Restablecer Valores Predeterminados"
          iconName="refresh"
          onPress={resetSimple}
        />
      </View>
    </View>
  );
};
