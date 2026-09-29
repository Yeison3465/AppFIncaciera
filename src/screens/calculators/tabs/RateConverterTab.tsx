import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  FinancialStepper,
  InfoBanner,
  PrimaryButton,
  SecondaryButton,
} from '../../../components';
import { AURA_COLORS } from '../../../constants/theme';
import { convertRate } from '../../../modules';
import { Periodicity, RateModality, RateType } from '../../../types/financial';

export interface RateConverterTabProps {
  onCalculate?: () => void;
}

/**
 * Pestaña: Conversión de Tasas (RF-06)
 * Implementada 100% con clases de Tailwind CSS / NativeWind.
 */
const RateConverterTabComponent: React.FC<RateConverterTabProps> = ({ onCalculate }) => {
  const [rateSourceValue, setRateSourceValue] = useState<number>(0);
  const [rateSourceType, setRateSourceType] = useState<RateType>('effective');
  const [rateSourcePeriodicity, setRateSourcePeriodicity] = useState<Periodicity>('annual');
  const [rateSourceModality, setRateSourceModality] = useState<RateModality>('arrears');

  const [rateTargetType, setRateTargetType] = useState<RateType>('effective');
  const [rateTargetPeriodicity, setRateTargetPeriodicity] = useState<Periodicity>('monthly');
  const [rateTargetModality, setRateTargetModality] = useState<RateModality>('arrears');

  const rateResult = useMemo(() => {
    try {
      return convertRate({
        sourceRate: rateSourceValue,
        sourceType: rateSourceType,
        sourcePeriodicity: rateSourcePeriodicity,
        sourceModality: rateSourceModality,
        targetType: rateTargetType,
        targetPeriodicity: rateTargetPeriodicity,
        targetModality: rateTargetModality,
      });
    } catch {
      return null;
    }
  }, [rateSourceValue, rateSourceType, rateSourcePeriodicity, rateSourceModality, rateTargetType, rateTargetPeriodicity, rateTargetModality]);

  const handleTransposeRates = () => {
    const prevSourceType = rateSourceType;
    const prevSourcePeriodicity = rateSourcePeriodicity;
    const prevSourceModality = rateSourceModality;

    setRateSourceType(rateTargetType);
    setRateSourcePeriodicity(rateTargetPeriodicity);
    setRateSourceModality(rateTargetModality);

    setRateTargetType(prevSourceType);
    setRateTargetPeriodicity(prevSourcePeriodicity);
    setRateTargetModality(prevSourceModality);

    if (rateResult) {
      setRateSourceValue(rateResult.equivalentRate);
    }
  };

  const resetRates = () => {
    setRateSourceValue(0);
    setRateSourceType('effective');
    setRateSourcePeriodicity('annual');
    setRateSourceModality('arrears');
    setRateTargetType('effective');
    setRateTargetPeriodicity('monthly');
    setRateTargetModality('arrears');
  };

  const periodicities: { key: Periodicity; label: string }[] = [
    { key: 'annual', label: 'Anual' },
    { key: 'semiannual', label: 'Semestral' },
    { key: 'quarterly', label: 'Trimestral' },
    { key: 'monthly', label: 'Mensual' },
    { key: 'weekly', label: 'Semanal' },
    { key: 'daily', label: 'Diario' },
  ];

  if (!rateResult) return null;

  return (
    <View>
      {/* HERO CARD CONVERSIÓN DE TASAS */}
      <View className="bg-white rounded-3xl p-5 my-2.5 border border-gray-100">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[11px] font-bold text-textMuted tracking-wider">
            TASA EQUIVALENTE CALCULADA
          </Text>
          <View className="bg-amber-100 px-2 py-0.5 rounded-md">
            <Text className="text-[10px] font-bold text-amber-800">Fórmula Financiera Exacta</Text>
          </View>
        </View>

        <Text
          className="text-[34px] font-extrabold text-textDark tracking-tight my-1"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {rateResult.equivalentRate.toFixed(2)} %{' '}
          <Text className="text-xl font-bold text-amberGold">
            {rateTargetType === 'effective'
              ? rateTargetPeriodicity === 'annual'
                ? 'E.A.'
                : 'E.P.'
              : 'T.N.'}
          </Text>
        </Text>

        <View className="flex-row items-center gap-1.5 mt-1 mb-4">
          <Ionicons name="checkmark-circle" size={15} color={AURA_COLORS.emeraldGreen} />
          <Text className="text-xs font-semibold text-emeraldGreen">
            Equivalencia Matemática Verificada
          </Text>
        </View>

        {/* 2 Columnas de métricas */}
        <View className="flex-row gap-2.5">
          <View className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <Text className="text-[10px] font-semibold text-textMutedDark mb-1">
              TASA PERIÓDICA DESTINO
            </Text>
            <Text
              className="text-sm font-bold text-textDark"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {rateResult.targetPeriodicLabel}
            </Text>
          </View>

          <View className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <Text className="text-[10px] font-semibold text-textMutedDark mb-1">
              FACTOR MATEMÁTICO
            </Text>
            <Text
              className="text-xs font-bold text-gray-700"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {rateResult.mathematicalFormula}
            </Text>
          </View>
        </View>
      </View>

      {/* SECCIÓN 1: TASA DE ORIGEN */}
      <View className="bg-white rounded-2xl p-5 my-2.5 border border-gray-100">
        <View className="flex-row items-center gap-2 mb-4">
          <View className="w-6 h-6 rounded-full bg-obsidian items-center justify-center">
            <Text className="text-white text-xs font-bold">1</Text>
          </View>
          <Text className="text-base font-bold text-textDark">Tasa de Origen (Entrada)</Text>
        </View>

        {/* Tipo de Tasa */}
        <View className="my-2">
          <Text className="text-xs font-semibold text-textDark mb-1.5">Tipo de Tasa</Text>
          <View className="flex-row bg-gray-100 rounded-xl p-1 gap-1">
            <TouchableOpacity
              onPress={() => setRateSourceType('nominal')}
              className={`flex-1 py-2 items-center justify-center rounded-lg ${rateSourceType === 'nominal' ? 'bg-obsidian' : 'bg-transparent'
                }`}
            >
              <Text
                className={`text-xs font-bold ${rateSourceType === 'nominal' ? 'text-white' : 'text-textDark'
                  }`}
              >
                Nominal (T.N.)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRateSourceType('effective')}
              className={`flex-1 py-2 items-center justify-center rounded-lg ${rateSourceType === 'effective' ? 'bg-obsidian' : 'bg-transparent'
                }`}
            >
              <Text
                className={`text-xs font-bold ${rateSourceType === 'effective' ? 'text-white' : 'text-textDark'
                  }`}
              >
                Efectiva (E.A.)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Valor Porcentual */}
        <FinancialStepper
          label="Valor Porcentual Anual"
          subLabel="Paso fino ±0.1%"
          value={rateSourceValue}
          onChange={setRateSourceValue}
          step={0.1}
          min={0}
          decimals={2}
          suffix="%"
        />

        {/* Periodicidad Base */}
        <View className="my-2">
          <Text className="text-xs font-semibold text-textDark mb-1.5">Periodicidad Base</Text>
          <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} className="py-1">
            {periodicities.map(({ key, label }) => {
              const isSel = rateSourcePeriodicity === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setRateSourcePeriodicity(key)}
                  className={`px-3 py-1.5 rounded-lg border mr-2 ${isSel ? 'bg-obsidian border-obsidian' : 'bg-gray-50 border-gray-200'
                    }`}
                >
                  <Text className={`text-xs font-bold ${isSel ? 'text-white' : 'text-textDark'}`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Modalidad Temporal */}
        <View className="my-2">
          <Text className="text-xs font-semibold text-textDark mb-1.5">Modalidad Temporal</Text>
          <View className="flex-row bg-gray-100 rounded-xl p-1 gap-1">
            <TouchableOpacity
              onPress={() => setRateSourceModality('arrears')}
              className={`flex-1 py-2 items-center justify-center rounded-lg ${rateSourceModality === 'arrears' ? 'bg-obsidian' : 'bg-transparent'
                }`}
            >
              <Text
                className={`text-xs font-bold ${rateSourceModality === 'arrears' ? 'text-white' : 'text-textDark'
                  }`}
              >
                Vencida (V)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRateSourceModality('advance')}
              className={`flex-1 py-2 items-center justify-center rounded-lg ${rateSourceModality === 'advance' ? 'bg-obsidian' : 'bg-transparent'
                }`}
            >
              <Text
                className={`text-xs font-bold ${rateSourceModality === 'advance' ? 'text-white' : 'text-textDark'
                  }`}
              >
                Anticipada (A)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* BOTÓN TRANSPONER PARÁMETROS */}
      <View className="items-center my-1">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleTransposeRates}
          className="flex-row items-center gap-2 bg-obsidian px-5 py-2.5 rounded-full"
        >
          <Ionicons name="swap-vertical" size={16} color={AURA_COLORS.amberGold} />
          <Text className="text-white text-xs font-bold">Transponer Parámetros</Text>
        </TouchableOpacity>
      </View>

      {/* SECCIÓN 2: TASA DESTINO */}
      <View className="bg-white rounded-2xl p-5 my-2.5 border border-gray-100">
        <View className="flex-row items-center gap-2 mb-4">
          <View className="w-6 h-6 rounded-full bg-amber-600 items-center justify-center">
            <Text className="text-white text-xs font-bold">2</Text>
          </View>
          <Text className="text-base font-bold text-textDark">Tasa Destino (Requerida)</Text>
        </View>

        {/* Tipo de Salida */}
        <View className="my-2">
          <Text className="text-xs font-semibold text-textDark mb-1.5">Tipo de Salida Buscado</Text>
          <View className="flex-row bg-gray-100 rounded-xl p-1 gap-1">
            <TouchableOpacity
              onPress={() => setRateTargetType('nominal')}
              className={`flex-1 py-2 items-center justify-center rounded-lg ${rateTargetType === 'nominal' ? 'bg-obsidian' : 'bg-transparent'
                }`}
            >
              <Text
                className={`text-xs font-bold ${rateTargetType === 'nominal' ? 'text-white' : 'text-textDark'
                  }`}
              >
                Nominal (T.N.)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRateTargetType('effective')}
              className={`flex-1 py-2 items-center justify-center rounded-lg ${rateTargetType === 'effective' ? 'bg-obsidian' : 'bg-transparent'
                }`}
            >
              <Text
                className={`text-xs font-bold ${rateTargetType === 'effective' ? 'text-white' : 'text-textDark'
                  }`}
              >
                Efectiva (E.A.)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Periodicidad Destino */}
        <View className="my-2">
          <Text className="text-xs font-semibold text-textDark mb-1.5">Periodicidad de Capitalización</Text>
          <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} className="py-1">
            {periodicities.map(({ key, label }) => {
              const isSel = rateTargetPeriodicity === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setRateTargetPeriodicity(key)}
                  className={`px-3 py-1.5 rounded-lg border mr-2 ${isSel ? 'bg-obsidian border-obsidian' : 'bg-gray-50 border-gray-200'
                    }`}
                >
                  <Text className={`text-xs font-bold ${isSel ? 'text-white' : 'text-textDark'}`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Modalidad Temporal Destino */}
        <View className="my-2">
          <Text className="text-xs font-semibold text-textDark mb-1.5">Modalidad Temporal</Text>
          <View className="flex-row bg-gray-100 rounded-xl p-1 gap-1">
            <TouchableOpacity
              onPress={() => setRateTargetModality('arrears')}
              className={`flex-1 py-2 items-center justify-center rounded-lg ${rateTargetModality === 'arrears' ? 'bg-obsidian' : 'bg-transparent'
                }`}
            >
              <Text
                className={`text-xs font-bold ${rateTargetModality === 'arrears' ? 'text-white' : 'text-textDark'
                  }`}
              >
                Vencida (V)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRateTargetModality('advance')}
              className={`flex-1 py-2 items-center justify-center rounded-lg ${rateTargetModality === 'advance' ? 'bg-obsidian' : 'bg-transparent'
                }`}
            >
              <Text
                className={`text-xs font-bold ${rateTargetModality === 'advance' ? 'text-white' : 'text-textDark'
                  }`}
              >
                Anticipada (A)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* INFO BANNER CONVERSIÓN */}
      <InfoBanner
        title="Diferencia Clave entre Tasas"
        description="Una Tasa Nominal (T.N.) no contempla la reinversión de intereses y es una tasa de referencia lineal. La Tasa Efectiva Anual (E.A.) refleja el costo o rendimiento financiero real considerando la capitalización compuesta periódica."
      />

      {/* BOTONES DE ACCIÓN */}
      <View className="mt-2 gap-2.5">
        <PrimaryButton
          title="Convertir y Homologar Tasa"
          iconName="arrow-up-circle-outline"
          iconPosition="left"
          onPress={() => onCalculate?.()}
        />
        <SecondaryButton
          title="Invertir Tasas / Limpiar"
          iconName="refresh"
          onPress={resetRates}
        />
      </View>
    </View>
  );
};

export const RateConverterTab = React.memo(RateConverterTabComponent);

