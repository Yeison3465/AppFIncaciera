import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
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

  // Period chips dinámicos según el plazo total
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
      const semesters = Math.ceil(result.term / 12);
      for (let s = 1; s <= semesters; s++) {
        const start = (s - 1) * 12 + 1;
        const end = Math.min(result.term, s * 12);
        chips.push({
          key: `sem_${s}`,
          label: `Semestre ${s} (${start}-${end})`,
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
        const perYear = result.frequency === 'quarterly' ? 4 : 12;
        const start = (yearNum - 1) * perYear + 1;
        const end = yearNum * perYear;
        if (row.installmentNumber < start || row.installmentNumber > end) {
          return false;
        }
      } else if (selectedPeriodFilter.startsWith('sem_')) {
        const semNum = parseInt(selectedPeriodFilter.replace('sem_', ''), 10);
        const start = (semNum - 1) * 12 + 1;
        const end = semNum * 12;
        if (row.installmentNumber < start || row.installmentNumber > end) {
          return false;
        }
      }

      // Filtro por búsqueda textual (cuota o fecha)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const numStr = String(row.installmentNumber);
        const padNumStr = String(row.installmentNumber).padStart(2, '0');
        const matchNum = numStr.includes(q) || padNumStr.includes(q) || `cuota ${numStr}`.includes(q);
        const matchDate = row.dueDate.toLowerCase().includes(q);
        if (!matchNum && !matchDate) {
          return false;
        }
      }

      return true;
    });
  }, [result?.schedule, selectedPeriodFilter, searchQuery, result?.frequency]);

  // Estado vacío si no hay cálculo o los valores son 0
  if (!result || result.amount <= 0 || result.schedule.length === 0) {
    return (
      <View className="space-y-4 pb-8">
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

  return (
    <View className="space-y-4 pb-8">
      {/* 1. Encabezado de la pestaña y Contexto del Préstamo */}
      <View className="space-y-2 pt-1">
        <View className="flex-row items-center justify-between flex-wrap gap-2">
          <Text className="text-3xl font-extrabold text-textDark tracking-tight">
            Tabla de Amortización
          </Text>
          <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-[#121316]">
            <Ionicons name="checkmark-circle" size={13} color="#F59E0B" />
            <Text className="text-[11px] font-bold text-white">
              {result.system === 'frances'
                ? 'Método Francés (Cuota Fija)'
                : 'Método Alemán (Abono Constante)'}
            </Text>
          </View>
        </View>

        {/* Barra de contexto */}
        <View className="flex-row items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gray-100 border border-gray-200/60 flex-wrap mt-1">
          <Ionicons name="wallet-outline" size={16} color="#F59E0B" />
          <Text
            className="text-xs text-textDark font-medium"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            <Text className="font-extrabold text-[#121316]">{formatCurrency(result.amount)}</Text> · {result.term} {result.frequency === 'biweekly' ? 'Quincenas' : result.frequency === 'quarterly' ? 'Trimestres' : 'Meses'} · Tasa <Text className="font-bold">{result.annualRate.toFixed(2)}% {result.rateType === 'effective' ? 'E.A.' : 'MV'}</Text> · Cuota Base: <Text className="font-bold text-[#121316]">{formatCurrency(result.baseInstallment)}</Text>
          </Text>
        </View>
      </View>

      {/* 2. Totales Acumulados (Estilo Hero Card Calculadoras) */}
      <View className="bg-white rounded-3xl p-5 border border-gray-100 space-y-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-[11px] font-medium text-textMutedDark tracking-wider uppercase">
            COSTO TOTAL ACUMULADO
          </Text>
          <View className="flex-row items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-md">
            <Ionicons name="shield-checkmark" size={13} color={AURA_COLORS.emeraldGreen} />
            <Text className="text-[10px] font-bold text-emerald-800">
              100% Liquidable
            </Text>
          </View>
        </View>

        <Text
          className="text-[34px] font-extrabold text-textDark tracking-tight my-1"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {formatCurrency(result.totalCost)}
        </Text>
        <Text className="text-xs text-textMutedDark mb-1">
          Total desembolsado a lo largo de {result.term} cuotas periódicas
        </Text>

        {/* 2 Columnas de métricas en cajas grises */}
        <View className="flex-row gap-3 my-2">
          {/* 1. Suma Abonos a Capital */}
          <View className="flex-1 bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-1.5">
              <View className="w-2 h-2 rounded-full bg-gray-500" />
              <Text className="text-[13px] font-medium text-gray-700">Capital Amortizado</Text>
            </View>
            <Text
              className="text-[22px] font-extrabold text-textDark tracking-tight"
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
              <View className="w-2 h-2 rounded-full bg-amber-500" />
              <Text className="text-[13px] font-medium text-amber-600">Total Intereses</Text>
            </View>
            <Text
              className="text-[22px] font-extrabold text-amber-600 tracking-tight"
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
        <View className="bg-gray-50 rounded-2xl p-3.5 flex-row items-center justify-between">
          <View>
            <Text className="text-xs font-medium text-gray-600">
              Seguros y Gastos Adicionales
            </Text>
            <Text className="text-[10px] text-textMutedDark">
              {formatCurrency(result.totalInsurance)} seguro + {formatCurrency(result.totalOtherCosts)} manejo
            </Text>
          </View>
          <Text
            className="text-base font-extrabold text-textDark"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatCurrency(result.totalAdditionalCharges)}
          </Text>
        </View>

        {/* Barra de Distribución Proporcional */}
        <View className="pt-2 border-t border-gray-100 space-y-1.5">
          <View className="flex-row items-center justify-between text-xs mb-1">
            <Text className="text-xs font-semibold text-textMutedDark">
              Distribución Total del Flujo
            </Text>
            <Text
              className="text-xs font-extrabold text-[#121316]"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              Saldo Final: $0.00
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
                className="text-[11px] font-bold text-textDark"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                Capital ({result.summary.capitalPercentage}%)
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <Text
                className="text-[11px] font-bold text-textDark"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                Interés ({result.summary.interestPercentage}%)
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              <Text
                className="text-[11px] font-medium text-textMutedDark"
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
              onPress={() => setIsCompact(false)}
              className={`flex-1 py-2 px-2.5 rounded-xl flex-row items-center justify-center gap-1 ${
                !isCompact ? 'bg-obsidian' : 'bg-transparent'
              }`}
            >
              <Ionicons
                name="albums-outline"
                size={14}
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
              onPress={() => setIsCompact(true)}
              className={`flex-1 py-2 px-2.5 rounded-xl flex-row items-center justify-center gap-1 ${
                isCompact ? 'bg-obsidian' : 'bg-transparent'
              }`}
            >
              <Ionicons
                name="list-outline"
                size={14}
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

          {/* Toggle Ver Todas vs Resumida (si hay más de 6 cuotas) */}
          {filteredSchedule.length > 6 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowAllInstallments(!showAllInstallments)}
              className={`py-2 px-3 rounded-2xl flex-row items-center justify-center gap-1.5 border ${
                showAllInstallments
                  ? 'bg-obsidian border-obsidian'
                  : 'bg-white border-gray-100'
              }`}
            >
              <Ionicons
                name={showAllInstallments ? 'eye-outline' : 'eye-off-outline'}
                size={15}
                color={showAllInstallments ? '#FFFFFF' : AURA_COLORS.textDark}
              />
              <Text
                className={`text-xs font-bold ${
                  showAllInstallments ? 'text-white' : 'text-textDark'
                }`}
              >
                {showAllInstallments ? 'Todas' : '1-5 y fin'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Chips de filtro por periodos */}
        {periodChips.length > 1 && (
          <View className="flex-row gap-2 overflow-x-auto pb-1">
            {periodChips.map((chip) => {
              const isSel = selectedPeriodFilter === chip.key;
              return (
                <TouchableOpacity
                  key={chip.key}
                  activeOpacity={0.7}
                  onPress={() => setSelectedPeriodFilter(chip.key)}
                  className={`px-3.5 py-1.5 rounded-full border ${
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
          </View>
        )}

        {/* Barra de Búsqueda Rápida */}
        <View className="relative w-full">
          <View className="flex-row items-center bg-white rounded-2xl border border-gray-100 px-3.5 h-11">
            <Ionicons name="search" size={17} color={AURA_COLORS.textMutedDark} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar cuota # o fecha..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-2 text-xs font-medium text-textDark"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
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
              Plan de Pagos
            </Text>
          </View>
          <Text
            className="text-[11px] font-semibold text-textMutedDark"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {filteredSchedule.length} Cuotas
          </Text>
        </View>

        {/* Lista de cuotas con regla: 5 primeras y última por defecto */}
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

          if (showAllInstallments || filteredSchedule.length <= 6) {
            return filteredSchedule.map((row) => (
              <AmortizationCardRow
                key={row.installmentNumber}
                row={row}
                isLast={row.installmentNumber === result.schedule.length}
                isCompact={isCompact}
              />
            ));
          }

          // Vista por defecto: 5 primeras cuotas + separador interactivo + última cuota
          const firstFive = filteredSchedule.slice(0, 5);
          const lastOne = filteredSchedule[filteredSchedule.length - 1];
          const hiddenCount = filteredSchedule.length - 6;

          return (
            <View className="space-y-2">
              {firstFive.map((row) => (
                <AmortizationCardRow
                  key={row.installmentNumber}
                  row={row}
                  isLast={false}
                  isCompact={isCompact}
                />
              ))}

              {/* Separador Elipsis Interactivo */}
              <View className="my-2 py-3.5 px-4 bg-gray-50 rounded-2xl items-center justify-center border border-dashed border-gray-300">
                <Text className="text-xs font-semibold text-textMutedDark text-center">
                  Mostrando 5 primeras cuotas y última ({hiddenCount} cuotas intermedias ocultas)
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowAllInstallments(true)}
                  className="mt-2.5 py-1.5 px-4 bg-obsidian rounded-full items-center justify-center"
                >
                  <Text className="text-xs font-bold text-white">
                    Ver todas las {filteredSchedule.length} cuotas
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
