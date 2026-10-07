import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect } from 'react-native-svg';
import { AURA_COLORS } from '../../../constants/theme';
import {
  PrimaryButton,
  SecondaryButton,
  FinancialStepper,
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
const SimpleInterestTabComponent: React.FC<SimpleInterestTabProps> = ({ onCalculate }) => {
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

  const multiplier = simpleResult.principal > 0
    ? (simpleResult.finalAmount / simpleResult.principal)
    : 1;

  return (
    <View className="space-y-4">
      {/* TÍTULO PRINCIPAL DE LA PESTAÑA */}
      <View className="pt-1 pb-1 px-0.5">
        <Text className="text-3xl font-extrabold text-textDark tracking-tight">
          Interés Simple
        </Text>
      </View>

      {/* HERO CARD INTERÉS SIMPLE */}
      <View className="bg-white rounded-3xl p-5 my-2.5 border border-gray-100">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[11px] font-medium text-textMutedDark tracking-wider">
            MONTO FINAL ACUMULADO
          </Text>
          <View className="flex-row items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-md">
            <Ionicons name="trending-up" size={13} color={AURA_COLORS.emeraldGreen} />
            <Text className="text-[10px] font-bold text-emerald-800">
              +{simpleResult.totalReturnPercentage.toFixed(1)}% ({multiplier.toFixed(2)}x)
            </Text>
          </View>
        </View>

        <Text
          className="text-[34px] font-extrabold text-textDark tracking-tight my-1"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {formatCurrency(simpleResult.finalAmount)}
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
              {formatCurrency(simpleResult.principal)}
            </Text>
            <Text className="text-xs text-textMutedDark mt-1">
              {simpleResult.principalPercentage}% del total
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
              +{formatCurrency(simpleResult.interestEarned)}
            </Text>
            <Text className="text-xs text-emerald-600 mt-1">
              {simpleResult.interestPercentage}% interés puro
            </Text>
          </View>
        </View>

        {/* Gráfica de Proyección Lineal Interactiva */}
        <FinancialAreaChart
          data={chartData}
          primaryColor={AURA_COLORS.emeraldGreen}
          secondaryColor="#9CA3AF"
          primaryLabel="Valor Proyectado"
          secondaryLabel=""
          showSecondaryLine={false}
          badgeText={`Plazo: ${simpleTerm} ${simpleTermUnit === 'years' ? 'Años' : simpleTermUnit === 'months' ? 'Meses' : 'Días'}`}
        />
      </View>

      {/* FORMULARIO: CONFIGURACIÓN DEL CÁLCULO */}
      <View className="bg-white rounded-2xl p-5 my-2.5 border border-gray-100">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-textDark">Configuración del Cálculo</Text>
          <Ionicons name="options-outline" size={20} color={AURA_COLORS.textDark} />
        </View>

        {/* Capital Inicial */}
        <FinancialStepper
          label="Capital Inicial"
          labelClassName="text-base font-semibold text-textMutedDark"
          value={simplePrincipal}
          onChange={setSimplePrincipal}
          step={1000}
          min={100}
          prefix="$"
        />

        {/* Tasa de Interés Nominal */}
        <View className="my-2">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-base font-semibold text-textMutedDark">Tasa de Interés Nominal</Text>
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
          />
        </View>

        {/* Plazo o Periodo */}
        <View className="my-2">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-base font-semibold text-textMutedDark">Plazo o Periodo de Tiempo</Text>
            <Text className="text-[11px] text-textMutedDark">Duración (t)</Text>
          </View>
          <View>
            <FinancialStepper
              label=""
              value={simpleTerm}
              onChange={setSimpleTerm}
              step={1}
              min={0}
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
            <Text className="text-base font-semibold text-textMutedDark">Base de Cálculo Diaria</Text>
            <Text className="text-[11px] text-textMutedDark">Convención Financiera</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSimpleConvention('commercial_360')}
              className={`flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-full border ${
                simpleConvention === 'commercial_360'
                  ? 'bg-obsidian border-obsidian'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {simpleConvention === 'commercial_360' ? (
                <View style={{ marginRight: 6 }}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                    <Path d="m9 12 2 2 4-4" />
                  </Svg>
                </View>
              ) : (
                <Ionicons
                  name="shield-checkmark-outline"
                  size={15}
                  color={AURA_COLORS.textDark}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                className={`text-xs font-bold ${
                  simpleConvention === 'commercial_360' ? 'text-white' : 'text-textDark'
                }`}
              >
                Comercial (360d)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSimpleConvention('exact_365')}
              className={`flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-full border ${
                simpleConvention === 'exact_365'
                  ? 'bg-obsidian border-obsidian'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {simpleConvention === 'exact_365' ? (
                <View style={{ marginRight: 6 }}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                    <Path d="m9 12 2 2 4-4" />
                  </Svg>
                </View>
              ) : (
                <Ionicons
                  name="calendar-clear-outline"
                  size={15}
                  color={AURA_COLORS.textDark}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                className={`text-xs font-bold ${
                  simpleConvention === 'exact_365' ? 'text-white' : 'text-textDark'
                }`}
              >
                Real / Exacto (365d)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* BLOQUE: FÓRMULA DIRECTA */}
      <View className="bg-gray-100 rounded-2xl p-4 my-2.5 flex-row items-start">
        <View className="w-10 h-10 rounded-full bg-[#FEEBC8] items-center justify-center mr-3.5 mt-0.5">
          <Ionicons name="calculator-outline" size={20} color="#F59E0B" />
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-textDark mb-1">Fórmula Directa I = C · i · t</Text>
          <Text className="text-xs text-gray-600 leading-[19px] font-normal">
            En el interés simple, los rendimientos generados no se reinvierten ni capitalizan ciclo a ciclo; la ganancia se mantiene constante y estrictamente proporcional al capital inicial depositado.
          </Text>
        </View>
      </View>

      {/* BOTONES DE ACCIÓN */}
      <View className="mt-2 gap-2.5">
        <PrimaryButton
          title="Calcular Interés Simple"
          iconPosition="left"
          customIcon={
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <Rect x="3" y="4" width="18" height="12" rx="2" />
              <Path d="m9 10 2 2 4-4" />
              <Path d="M2 20h20" />
            </Svg>
          }
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

export const SimpleInterestTab = React.memo(SimpleInterestTabComponent);

