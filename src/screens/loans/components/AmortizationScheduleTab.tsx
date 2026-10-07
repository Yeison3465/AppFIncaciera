import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AURA_COLORS } from '../../../constants/theme';
import { LoanSimulationResult } from '../../../modules/loans/loanTypes';
import { formatCurrency } from '../../../utils/formatters';
import { AmortizationCardRow } from './AmortizationCardRow';

interface AmortizationScheduleTabProps {
  result: LoanSimulationResult;
  onBackToSimulator?: () => void;
}

export const AmortizationScheduleTab: React.FC<AmortizationScheduleTabProps> = ({
  result,
}) => {
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Por defecto: solo ver las 5 primeras y la última (resumida)
  const [showAllInstallments, setShowAllInstallments] = useState<boolean>(false);

  // Estados de feedback y carga no bloqueante
  const [isTogglingAll, setIsTogglingAll] = useState<boolean>(false);
  const [isChangingMode, setIsChangingMode] = useState<boolean>(false);
  const [visibleBatchCount, setVisibleBatchCount] = useState<number>(30);

  // Period chips dinámicos según el plazo total con soporte para todos los años
  const periodChips = useMemo(() => {
    if (!result || result.schedule.length === 0) return [];

    const chips: { key: string; label: string }[] = [
      { key: 'all', label: `Todas (${result.schedule.length})` },
    ];

    if (result.frequency === 'monthly') {
      const years = Math.ceil(result.term / 12);
      for (let y = 1; y <= years; y++) {
        const start = (y - 1) * 12 + 1;
        const end = Math.min(result.term, y * 12);
        chips.push({
          key: `year_${y}`,
          label: `Año ${y} (${start}-${end})`,
        });
      }
    } else if (result.frequency === 'biweekly') {
      const years = Math.ceil(result.term / 24);
      for (let y = 1; y <= years; y++) {
        const start = (y - 1) * 24 + 1;
        const end = Math.min(result.term, y * 24);
        chips.push({
          key: `year_${y}`,
          label: `Año ${y} (${start}-${end})`,
        });
      }
    } else if (result.frequency === 'quarterly') {
      const years = Math.ceil(result.term / 4);
      for (let y = 1; y <= years; y++) {
        const start = (y - 1) * 4 + 1;
        const end = Math.min(result.term, y * 4);
        chips.push({
          key: `year_${y}`,
          label: `Año ${y} (${start}-${end})`,
        });
      }
    }

    return chips;
  }, [result?.term, result?.frequency, result?.schedule?.length]);

  // Filtrado de cuotas
  const filteredSchedule = useMemo(() => {
    if (!result || !result.schedule) return [];

    return result.schedule.filter((row) => {
      // Filtro por chip de periodo
      if (selectedPeriodFilter.startsWith('year_')) {
        const yearNum = parseInt(selectedPeriodFilter.replace('year_', ''), 10);
        const perYear =
          result.frequency === 'biweekly' ? 24 : result.frequency === 'quarterly' ? 4 : 12;
        const start = (yearNum - 1) * perYear + 1;
        const end = yearNum * perYear;
        if (row.installmentNumber < start || row.installmentNumber > end) {
          return false;
        }
      }

      // Filtro por búsqueda textual (cuota o fecha)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const numStr = String(row.installmentNumber);
        const padNumStr = String(row.installmentNumber).padStart(2, '0');
        const matchNum =
          numStr.includes(q) || padNumStr.includes(q) || `cuota ${numStr}`.includes(q);
        const matchDate = row.dueDate.toLowerCase().includes(q);
        if (!matchNum && !matchDate) {
          return false;
        }
      }

      return true;
    });
  }, [result?.schedule, selectedPeriodFilter, searchQuery, result?.frequency]);

  // Reiniciar lote visible al cambiar filtros o búsqueda
  useEffect(() => {
    setVisibleBatchCount(30);
  }, [selectedPeriodFilter, searchQuery]);

  // Carga progresiva por lotes (chunking) cuando se visualizan todas las cuotas
  useEffect(() => {
    if (showAllInstallments && visibleBatchCount < filteredSchedule.length) {
      const timer = setTimeout(() => {
        setVisibleBatchCount((prev) => Math.min(filteredSchedule.length, prev + 30));
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [showAllInstallments, visibleBatchCount, filteredSchedule.length]);

  // Handler no bloqueante con spinner para alternar "Todas" vs "1-5 y fin"
  const handleToggleShowAll = () => {
    if (!showAllInstallments) {
      setIsTogglingAll(true);
      setTimeout(() => {
        setShowAllInstallments(true);
        setIsTogglingAll(false);
      }, 40);
    } else {
      setShowAllInstallments(false);
      setVisibleBatchCount(30);
    }
  };

  // Handler no bloqueante para alternar Vista Detallada vs Compacta
  const handleToggleCompact = (compact: boolean) => {
    if (compact === isCompact) return;
    if (filteredSchedule.length > 20 && showAllInstallments) {
      setIsChangingMode(true);
      setTimeout(() => {
        setIsCompact(compact);
        setIsChangingMode(false);
      }, 40);
    } else {
      setIsCompact(compact);
    }
  };

  // Estado vacío si no hay cálculo o los valores son 0
  if (!result || result.amount <= 0 || result.schedule.length === 0) {
    return (
      <View className="space-y-5 pb-8">
        <View className="pt-1 pb-1 px-0.5">
          <Text className="text-3xl font-extrabold text-textDark tracking-tight">
            Tabla de Amortización
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-6 border border-gray-100 items-center justify-center my-4 space-y-3">
          <View className="w-16 h-16 rounded-full bg-amber-100 items-center justify-center mb-1">
            <Ionicons name="calculator-outline" size={32} color="#F59E0B" />
          </View>
          <Text className="text-lg font-bold text-textDark text-center">
            Sin datos de amortización
          </Text>
          <Text className="text-xs text-textMutedDark text-center max-w-[280px]">
            Ingresa un monto y plazo mayor a 0 en el Simulador para generar automáticamente tu tabla de amortización.
          </Text>
        </View>
      </View>
    );
  }

  // Lista a renderizar considerando lote progresivo
  const isPeriodFilterActive = selectedPeriodFilter !== 'all';
  const shouldShowAllDirectly = isPeriodFilterActive || showAllInstallments || filteredSchedule.length <= 6;
  const itemsToRender = shouldShowAllDirectly
    ? filteredSchedule.slice(0, visibleBatchCount)
    : [];

  return (
    <View className="space-y-5 pb-8">
      {/* 1. Encabezado de la pestaña y Contexto del Préstamo */}
      <View className="space-y-2 pt-1">
        <View className="flex-row items-center justify-between flex-wrap gap-2">
          <Text className="text-3xl font-extrabold text-textDark tracking-tight">
            Tabla de Amortización
          </Text>
          <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121316]">
            <Ionicons name="checkmark-circle" size={14} color="#F59E0B" />
            <Text className="text-xs font-bold text-white">
              {result.system === 'frances'
                ? 'Método Francés (Cuota Fija)'
                : 'Método Alemán (Abono Constante)'}
            </Text>
          </View>
        </View>

        {/* Barra de contexto con mayor legibilidad */}
        <View className="flex-row items-center gap-2 px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200/70 flex-wrap mt-1">
          <Ionicons name="wallet-outline" size={18} color="#F59E0B" />
          <Text
            className="text-sm text-textDark font-medium"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            <Text className="font-extrabold text-[#121316]">{formatCurrency(result.amount)}</Text> · {result.term} {result.frequency === 'biweekly' ? 'Quincenas' : result.frequency === 'quarterly' ? 'Trimestres' : 'Meses'} · Tasa <Text className="font-bold">{result.annualRate.toFixed(2)}% {result.rateType === 'effective' ? 'E.A.' : 'MV'}</Text> · Cuota Base: <Text className="font-bold text-[#121316]">{formatCurrency(result.baseInstallment)}</Text>
          </Text>
        </View>
      </View>

      {/* 2. Totales Acumulados (Estilo Hero Card) */}
      <View className="bg-white rounded-3xl p-6 border border-gray-100 space-y-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold text-textMutedDark tracking-wider uppercase">
            COSTO TOTAL ACUMULADO
          </Text>
          <View className="flex-row items-center gap-1.5 bg-emerald-100 px-3 py-1 rounded-md">
            <Ionicons name="shield-checkmark" size={14} color={AURA_COLORS.emeraldGreen} />
            <Text className="text-xs font-bold text-emerald-800">
              100% Liquidable
            </Text>
          </View>
        </View>

        <Text
          className="text-4xl font-extrabold text-textDark tracking-tight my-1"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {formatCurrency(result.totalCost)}
        </Text>
        <Text className="text-xs text-textMutedDark mb-1">
          Total desembolsado a lo largo de {result.term} cuotas periódicas
        </Text>

        {/* 2 Columnas de métricas en cajas grises con amplio padding */}
        <View className="flex-row gap-3 my-2">
          {/* 1. Suma Abonos a Capital */}
          <View className="flex-1 bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-gray-600" />
              <Text className="text-sm font-semibold text-gray-700">Capital Amortizado</Text>
            </View>
            <Text
              className="text-2xl font-extrabold text-textDark tracking-tight"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(result.totalPrincipal)}
            </Text>
            <Text className="text-xs text-textMutedDark mt-1">
              100% del monto inicial
            </Text>
          </View>

          {/* 2. Total Intereses */}
          <View className="flex-1 bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <Text className="text-sm font-semibold text-amber-600">Total Intereses</Text>
            </View>
            <Text
              className="text-2xl font-extrabold text-amber-600 tracking-tight"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(result.totalInterest)}
            </Text>
            <Text className="text-xs text-amber-600 mt-1">
              {((result.totalInterest / (result.totalPrincipal || 1)) * 100).toFixed(1)}% s/ capital
            </Text>
          </View>
        </View>

        {/* Fila secundaria: Seguros y Costos Adicionales */}
        <View className="bg-gray-50 rounded-2xl p-4 flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-semibold text-gray-700">
              Seguros y Gastos Adicionales
            </Text>
            <Text className="text-xs text-textMutedDark mt-0.5">
              {formatCurrency(result.totalInsurance)} seguro + {formatCurrency(result.totalOtherCosts)} manejo
            </Text>
          </View>
          <Text
            className="text-lg font-extrabold text-textDark"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatCurrency(result.totalAdditionalCharges)}
          </Text>
        </View>

        {/* Barra de Distribución Proporcional */}
        <View className="pt-2 border-t border-gray-100 space-y-2">
          <View className="flex-row items-center justify-between text-xs mb-1">
            <Text className="text-xs font-semibold text-textMutedDark">
              Distribución Total del Flujo
            </Text>
            <Text
              className="text-xs font-extrabold text-[#121316]"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              Saldo Final: $ 0.00
            </Text>
          </View>

          <View className="w-full h-3 rounded-full bg-gray-200 overflow-hidden flex-row">
            <View
              style={{ width: `${result.summary.capitalPercentage}%` }}
              className="h-full bg-[#121316]"
            />
            <View
              style={{ width: `${result.summary.interestPercentage}%` }}
              className="h-full bg-[#F59E0B]"
            />
            <View
              style={{ width: `${result.summary.chargesPercentage}%` }}
              className="h-full bg-gray-400"
            />
          </View>

          <View className="flex-row items-center justify-between pt-1">
            <View className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-[#121316]" />
              <Text
                className="text-xs font-bold text-textDark"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                Capital ({result.summary.capitalPercentage}%)
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <Text
                className="text-xs font-bold text-textDark"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                Interés ({result.summary.interestPercentage}%)
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              <Text
                className="text-xs font-medium text-textMutedDark"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                Gastos ({result.summary.chargesPercentage}%)
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Filtros Interactivos & Opciones de Visualización */}
      <View className="space-y-3">
        {/* Fila de Toggles: Detallada/Compacta y Ver Resumida/Todas */}
        <View className="flex-row items-center gap-2">
          {/* Toggle Vista Detallada vs Compacta */}
          <View className="flex-1 flex-row items-center bg-white p-1 rounded-2xl border border-gray-100">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleToggleCompact(false)}
              className={`flex-1 py-2.5 px-3 rounded-xl flex-row items-center justify-center gap-1.5 ${
                !isCompact ? 'bg-obsidian' : 'bg-transparent'
              }`}
            >
              <Ionicons
                name="albums-outline"
                size={15}
                color={!isCompact ? '#F59E0B' : AURA_COLORS.textMutedDark}
              />
              <Text
                className={`text-xs font-bold ${
                  !isCompact ? 'text-white' : 'text-textMutedDark'
                }`}
              >
                Detallada
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleToggleCompact(true)}
              className={`flex-1 py-2.5 px-3 rounded-xl flex-row items-center justify-center gap-1.5 ${
                isCompact ? 'bg-obsidian' : 'bg-transparent'
              }`}
            >
              <Ionicons
                name="list-outline"
                size={15}
                color={isCompact ? '#F59E0B' : AURA_COLORS.textMutedDark}
              />
              <Text
                className={`text-xs font-bold ${
                  isCompact ? 'text-white' : 'text-textMutedDark'
                }`}
              >
                Compacta
              </Text>
            </TouchableOpacity>
          </View>

          {/* Toggle Ver Todas vs Resumida (con Spinner inmediato) */}
          {filteredSchedule.length > 6 && !isPeriodFilterActive && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggleShowAll}
              disabled={isTogglingAll}
              className={`py-2.5 px-3.5 rounded-2xl flex-row items-center justify-center gap-1.5 border ${
                showAllInstallments
                  ? 'bg-obsidian border-obsidian'
                  : 'bg-white border-gray-100'
              }`}
            >
              {isTogglingAll ? (
                <ActivityIndicator
                  size="small"
                  color={showAllInstallments ? '#FFFFFF' : '#121316'}
                />
              ) : (
                <Ionicons
                  name={showAllInstallments ? 'eye-outline' : 'eye-off-outline'}
                  size={15}
                  color={showAllInstallments ? '#FFFFFF' : AURA_COLORS.textDark}
                />
              )}
              <Text
                className={`text-xs font-bold ${
                  showAllInstallments ? 'text-white' : 'text-textDark'
                }`}
              >
                {isTogglingAll ? 'Cargando...' : showAllInstallments ? 'Todas' : '1-5 y fin'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Chips de filtro por periodos con Scroll Horizontal fluido */}
        {periodChips.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 2, paddingBottom: 4 }}
            className="flex-row"
          >
            {periodChips.map((chip) => {
              const isSel = selectedPeriodFilter === chip.key;
              return (
                <TouchableOpacity
                  key={chip.key}
                  activeOpacity={0.7}
                  onPress={() => setSelectedPeriodFilter(chip.key)}
                  className={`px-4 py-2 rounded-full border ${
                    isSel
                      ? 'bg-obsidian border-obsidian'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isSel ? 'text-white font-bold' : 'text-textDark'
                    }`}
                    style={{ fontVariant: ['tabular-nums'] }}
                  >
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Barra de Búsqueda Rápida */}
        <View className="relative w-full">
          <View className="flex-row items-center bg-white rounded-2xl border border-gray-100 px-4 h-12">
            <Ionicons name="search" size={18} color={AURA_COLORS.textMutedDark} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar cuota # o fecha..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-2.5 text-sm font-medium text-textDark"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* 4. Cronograma Detallado de Cuotas */}
      <View className="space-y-3">
        <View className="flex-row items-center justify-between px-1 mb-1">
          <View className="flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <Text className="text-xs font-bold uppercase tracking-wider text-textMutedDark">
              Plan de Pagos {isPeriodFilterActive && `· Filtrado por ${periodChips.find((c) => c.key === selectedPeriodFilter)?.label ?? ''}`}
            </Text>
          </View>
          <Text
            className="text-xs font-semibold text-textMutedDark"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {filteredSchedule.length} Cuotas
          </Text>
        </View>

        {/* Indicador de cambio de modo si está en proceso */}
        {isChangingMode && (
          <View className="py-4 items-center justify-center">
            <ActivityIndicator size="small" color="#F59E0B" />
            <Text className="text-xs text-textMutedDark mt-2">
              Actualizando vista...
            </Text>
          </View>
        )}

        {/* Lista de cuotas */}
        {(() => {
          if (filteredSchedule.length === 0) {
            return (
              <View className="p-8 items-center justify-center bg-white rounded-2xl border border-gray-100">
                <Ionicons name="search-outline" size={32} color={AURA_COLORS.textMutedDark} />
                <Text className="text-sm font-bold text-textDark mt-2">
                  No se encontraron cuotas
                </Text>
                <Text className="text-xs text-textMutedDark mt-1">
                  Prueba cambiando los filtros o el texto de búsqueda.
                </Text>
              </View>
            );
          }

          // Si el filtro de periodo está activo, o el usuario seleccionó "Todas", o son <= 6 cuotas:
          if (shouldShowAllDirectly) {
            return (
              <View>
                {itemsToRender.map((row) => (
                  <AmortizationCardRow
                    key={row.installmentNumber}
                    row={row}
                    isLast={row.installmentNumber === result.schedule.length}
                    isCompact={isCompact}
                  />
                ))}

                {/* Si faltan cuotas por cargar del lote progresivo, mostrar feedback sutil */}
                {visibleBatchCount < filteredSchedule.length && (
                  <View className="py-3 items-center justify-center flex-row gap-2">
                    <ActivityIndicator size="small" color="#F59E0B" />
                    <Text className="text-xs font-semibold text-textMutedDark">
                      Cargando cuotas restantes ({visibleBatchCount} de {filteredSchedule.length})...
                    </Text>
                  </View>
                )}
              </View>
            );
          }

          // Vista por defecto (Filtro 'all' con showAllInstallments falso): 5 primeras + separador + última
          const firstFive = filteredSchedule.slice(0, 5);
          const lastOne = filteredSchedule[filteredSchedule.length - 1];
          const hiddenCount = filteredSchedule.length - 6;

          return (
            <View>
              {firstFive.map((row) => (
                <AmortizationCardRow
                  key={row.installmentNumber}
                  row={row}
                  isLast={false}
                  isCompact={isCompact}
                />
              ))}

              {/* Separador Elipsis Interactivo con Spinner en botón */}
              <View className="my-3 py-4 px-5 bg-gray-50 rounded-2xl items-center justify-center border border-dashed border-gray-300">
                <Text className="text-xs font-semibold text-textMutedDark text-center">
                  Mostrando 5 primeras cuotas y última ({hiddenCount} cuotas intermedias ocultas)
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleToggleShowAll}
                  disabled={isTogglingAll}
                  className="mt-3 py-2.5 px-5 bg-obsidian rounded-full flex-row items-center justify-center gap-2"
                >
                  {isTogglingAll && <ActivityIndicator size="small" color="#FFFFFF" />}
                  <Text className="text-xs font-bold text-white">
                    {isTogglingAll ? 'Cargando cuotas...' : `Ver todas las ${filteredSchedule.length} cuotas`}
                  </Text>
                </TouchableOpacity>
              </View>

              <AmortizationCardRow
                key={lastOne.installmentNumber}
                row={lastOne}
                isLast={lastOne.installmentNumber === result.schedule.length}
                isCompact={isCompact}
              />
            </View>
          );
        })()}
      </View>
    </View>
  );
};
