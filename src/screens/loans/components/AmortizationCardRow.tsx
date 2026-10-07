import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { AURA_COLORS } from '../../../constants/theme';
import { AmortizationRow } from '../../../modules/loans/loanTypes';
import { formatCurrency } from '../../../utils/formatters';

interface AmortizationCardRowProps {
  row: AmortizationRow;
  isLast: boolean;
  isCompact?: boolean;
}

export const AmortizationCardRow = React.memo<AmortizationCardRowProps>(
  function AmortizationCardRow({ row, isLast, isCompact = false }) {
    const padNumber = String(row.installmentNumber).padStart(2, '0');

    // Modo Compacto con mayor espaciado y tipografía clara
    if (isCompact) {
      return (
        <View
          className={`p-4 rounded-2xl mb-3.5 border ${
            isLast
              ? 'bg-emerald-500/10 border-emerald-500'
              : 'bg-white border-[#ECEBED]'
          }`}
        >
          <View className="flex-row items-center justify-between mb-2.5">
            <View className="flex-row items-center gap-2.5">
              <View
                className={`px-2.5 py-1 rounded-md ${
                  isLast ? 'bg-[#10B981]' : 'bg-[#121316]'
                }`}
              >
                <Text
                  className="text-white text-xs font-bold"
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  #{padNumber}
                </Text>
              </View>
              <Text
                className="text-sm font-semibold text-textDark"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {row.dueDate}
              </Text>
            </View>
            <Text
              className={`text-base font-extrabold ${
                isLast ? 'text-emerald-600' : 'text-[#121316]'
              }`}
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(row.paymentAmount)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between pt-2.5 border-t border-gray-100">
            <Text
              className="text-xs text-textMutedDark font-medium"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              Cap: <Text className="font-bold text-textDark">{formatCurrency(row.principal)}</Text>
            </Text>
            <Text
              className="text-xs text-amber-600 font-medium"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              Int: <Text className="font-bold text-amber-600">{formatCurrency(row.interest)}</Text>
            </Text>
            <Text
              className="text-xs text-textMutedDark font-medium"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              Saldo: <Text className={`font-bold ${isLast ? 'text-emerald-600' : 'text-textDark'}`}>{formatCurrency(row.remainingBalance)}</Text>
            </Text>
          </View>
        </View>
      );
    }

    // Modo Detallado con mayor separación, jerarquía y tipografía generosa
    return (
      <View
        className={`rounded-2xl p-5 mb-4.5 border ${
          isLast
            ? 'bg-emerald-500/10 border-2 border-[#10B981]'
            : 'bg-white border-[#ECEBED]'
        }`}
      >
        {/* 1. Header de Cuota, Fecha y Valor Total */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <View
              className={`px-3 py-1.5 rounded-xl ${
                isLast ? 'bg-[#10B981]' : 'bg-[#121316]'
              }`}
            >
              <Text
                className="text-white text-sm font-bold"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                Cuota {padNumber}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-textMutedDark uppercase font-semibold tracking-wider">
                {isLast ? 'Vencimiento Final' : 'Vencimiento'}
              </Text>
              <Text
                className="text-sm font-bold text-textDark mt-0.5"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {row.dueDate}
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-xs text-textMutedDark uppercase font-semibold tracking-wider">
              {isLast ? 'Última Cuota' : 'Valor Total'}
            </Text>
            <Text
              className={`text-xl font-extrabold mt-0.5 ${
                isLast ? 'text-emerald-600' : 'text-[#121316]'
              }`}
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(row.paymentAmount)}
            </Text>
          </View>
        </View>

        {/* 2. Grid de 4 Variables (Capital, Interés, Seguro, Otros Costos) con espacio holgado */}
        <View className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 gap-3">
          <View className="flex-row gap-3">
            {/* Abono a Capital */}
            <View className="flex-1 bg-white p-3.5 rounded-xl border border-gray-200/70 shadow-sm">
              <Text className="text-xs text-textMutedDark font-semibold uppercase tracking-wider mb-1">
                1. Abono a Capital
              </Text>
              <Text
                className="text-base font-extrabold text-[#121316]"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {formatCurrency(row.principal)}
              </Text>
              <Text className="text-xs text-[#10B981] font-semibold mt-1">
                {isLast ? 'Capital liquidado' : 'Amortización neta'}
              </Text>
            </View>

            {/* Interés Periodo */}
            <View className="flex-1 bg-white p-3.5 rounded-xl border border-gray-200/70 shadow-sm">
              <Text className="text-xs text-textMutedDark font-semibold uppercase tracking-wider mb-1">
                2. Interés Periodo
              </Text>
              <Text
                className="text-base font-extrabold text-[#F59E0B]"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {formatCurrency(row.interest)}
              </Text>
              <Text className="text-xs text-[#F59E0B] font-semibold mt-1">
                {isLast ? 'Interés final' : 'Costo periodo'}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            {/* Seguro de Vida */}
            <View className="flex-1 bg-white p-3.5 rounded-xl border border-gray-200/70 shadow-sm">
              <Text className="text-xs text-textMutedDark font-semibold uppercase tracking-wider mb-1">
                3. Seguro de Vida
              </Text>
              <Text
                className="text-base font-bold text-textDark"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {formatCurrency(row.insurance)}
              </Text>
              <Text className="text-xs text-textMutedDark font-medium mt-1">
                {isLast ? 'Póliza final' : 'Póliza deudores'}
              </Text>
            </View>

            {/* Otros Costos */}
            <View className="flex-1 bg-white p-3.5 rounded-xl border border-gray-200/70 shadow-sm">
              <Text className="text-xs text-textMutedDark font-semibold uppercase tracking-wider mb-1">
                4. Otros Costos
              </Text>
              <Text
                className="text-base font-bold text-textDark"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {formatCurrency(row.otherCosts)}
              </Text>
              <Text className="text-xs text-textMutedDark font-medium mt-1">
                Manejo / admon
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Saldo Deudor Restante Post-Pago */}
        {isLast ? (
          <View className="mt-3.5 flex-row items-center justify-between bg-emerald-50/70 px-4 py-3 rounded-xl border border-emerald-500/20">
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={17} color="#10B981" />
              <Text className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Saldo Restante Final (Post-Pago):
              </Text>
            </View>
            <Text
              className="text-base font-extrabold text-emerald-700"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              $ 0.00
            </Text>
          </View>
        ) : (
          <View className="mt-3.5 flex-row items-center justify-between bg-gray-100/80 px-4 py-3 rounded-xl">
            <View className="flex-row items-center gap-2">
              <Ionicons name="trending-down" size={16} color={AURA_COLORS.textMutedDark} />
              <Text className="text-textMutedDark text-xs font-medium">
                Saldo Restante Post-Pago:
              </Text>
            </View>
            <Text
              className="text-base font-extrabold text-[#121316]"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(row.remainingBalance)}
            </Text>
          </View>
        )}
      </View>
    );
  }
);
