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

export const AmortizationCardRow: React.FC<AmortizationCardRowProps> = ({
  row,
  isLast,
  isCompact = false,
}) => {
  const padNumber = String(row.installmentNumber).padStart(2, '0');

  // Modo Compacto
  if (isCompact) {
    return (
      <View
        className={`p-3 rounded-xl mb-2 border ${
          isLast
            ? 'bg-emerald-500/10 border-emerald-500'
            : 'bg-white border-[#ECEBED]'
        }`}
      >
        <View className="flex-row items-center justify-between mb-1.5">
          <View className="flex-row items-center gap-2">
            <View
              className={`px-2 py-0.5 rounded-md ${
                isLast ? 'bg-[#10B981]' : 'bg-[#121316]'
              }`}
            >
              <Text
                className="text-white text-[11px] font-bold"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                #{padNumber}
              </Text>
            </View>
            <Text
              className="text-xs font-semibold text-textDark"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {row.dueDate}
            </Text>
          </View>
          <Text
            className={`text-sm font-extrabold ${
              isLast ? 'text-emerald-600' : 'text-[#121316]'
            }`}
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatCurrency(row.paymentAmount)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between text-xs pt-1 border-t border-gray-100">
          <Text
            className="text-[11px] text-textMutedDark font-medium"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            Cap: <Text className="font-bold text-textDark">{formatCurrency(row.principal)}</Text>
          </Text>
          <Text
            className="text-[11px] text-amber-600 font-medium"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            Int: <Text className="font-bold text-amber-600">{formatCurrency(row.interest)}</Text>
          </Text>
          <Text
            className="text-[11px] text-textMutedDark font-medium"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            Saldo: <Text className={`font-bold ${isLast ? 'text-emerald-600' : 'text-textDark'}`}>{formatCurrency(row.remainingBalance)}</Text>
          </Text>
        </View>
      </View>
    );
  }

  // Modo Detallado
  return (
    <View
      className={`rounded-2xl p-4 mb-3 border ${
        isLast
          ? 'bg-emerald-500/10 border-2 border-[#10B981]'
          : 'bg-white border-[#ECEBED]'
      }`}
    >
      {/* 1. Header de Cuota, Fecha y Valor Total */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2.5">
          <View
            className={`px-2.5 py-1 rounded-lg ${
              isLast ? 'bg-[#10B981]' : 'bg-[#121316]'
            }`}
          >
            <Text
              className="text-white text-xs font-bold"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              Cuota {padNumber}
            </Text>
          </View>
          <View>
            <Text className="text-[10px] text-textMutedDark uppercase font-semibold tracking-wider">
              {isLast ? 'Vencimiento Final' : 'Vencimiento'}
            </Text>
            <Text
              className="text-xs font-bold text-textDark"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {row.dueDate}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-[10px] text-textMutedDark uppercase font-semibold tracking-wider">
            {isLast ? 'Última Cuota Pactada' : 'Valor Total Cuota'}
          </Text>
          <Text
            className={`text-lg font-extrabold ${
              isLast ? 'text-emerald-600' : 'text-[#121316]'
            }`}
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatCurrency(row.paymentAmount)}
          </Text>
        </View>
      </View>

      {/* 2. Grid de 4 Variables (Capital, Interés, Seguro, Otros Costos) */}
      <View className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100/80 bg-gray-50/70 p-2.5 rounded-xl">
        <View className="flex-row gap-2">
          {/* Abono a Capital */}
          <View className="flex-1 bg-white p-2.5 rounded-lg border border-gray-200/60">
            <Text className="text-[10px] text-textMutedDark font-semibold uppercase tracking-wider mb-0.5">
              1. Abono a Capital
            </Text>
            <Text
              className="text-sm font-extrabold text-[#121316]"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(row.principal)}
            </Text>
            <Text className="text-[9px] text-[#10B981] font-semibold mt-0.5">
              {isLast ? 'Capital restante final' : 'Amortización efectiva'}
            </Text>
          </View>

          {/* Interés Periodo */}
          <View className="flex-1 bg-white p-2.5 rounded-lg border border-gray-200/60">
            <Text className="text-[10px] text-textMutedDark font-semibold uppercase tracking-wider mb-0.5">
              2. Interés Periodo
            </Text>
            <Text
              className="text-sm font-extrabold text-[#F59E0B]"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(row.interest)}
            </Text>
            <Text className="text-[9px] text-[#F59E0B] font-semibold mt-0.5">
              {isLast ? 'Intereses saldados' : 'Costo del periodo'}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2 mt-1">
          {/* Seguro de Vida */}
          <View className="flex-1 bg-white p-2.5 rounded-lg border border-gray-200/60">
            <Text className="text-[10px] text-textMutedDark font-semibold uppercase tracking-wider mb-0.5">
              3. Seguro de Vida
            </Text>
            <Text
              className="text-sm font-bold text-textDark"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(row.insurance)}
            </Text>
            <Text className="text-[9px] text-textMutedDark font-medium mt-0.5">
              {isLast ? 'Última póliza' : 'Póliza deudores'}
            </Text>
          </View>

          {/* Otros Costos */}
          <View className="flex-1 bg-white p-2.5 rounded-lg border border-gray-200/60">
            <Text className="text-[10px] text-textMutedDark font-semibold uppercase tracking-wider mb-0.5">
              4. Otros Costos
            </Text>
            <Text
              className="text-sm font-bold text-textDark"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatCurrency(row.otherCosts)}
            </Text>
            <Text className="text-[9px] text-textMutedDark font-medium mt-0.5">
              Manejo / admon
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Saldo Deudor Restante Post-Pago */}
      {isLast ? (
        <View className="mt-2.5 pt-2.5 bg-white p-3 rounded-xl border border-emerald-500/30 flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">
                Saldo Restante Final (Post-Pago)
              </Text>
            </View>
            <Text
              className="text-xl font-black text-emerald-600 leading-tight mt-0.5"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              $ 0.00
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10B981]">
            <Ionicons name="checkmark-done" size={14} color="#FFFFFF" />
            <Text className="text-white text-[11px] font-bold">
              ✓ Saldo Liquidado ($0.00)
            </Text>
          </View>
        </View>
      ) : (
        <View className="mt-2.5 flex-row items-center justify-between bg-gray-100/70 px-3 py-2 rounded-xl">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="trending-down" size={15} color={AURA_COLORS.textMutedDark} />
            <Text className="text-textMutedDark text-xs font-medium">
              Saldo Restante Post-Pago:
            </Text>
          </View>
          <Text
            className="text-sm font-extrabold text-[#121316]"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatCurrency(row.remainingBalance)}
          </Text>
        </View>
      )}
    </View>
  );
};
