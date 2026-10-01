import React, { useState, useMemo } from 'react';
import { View, Text, Dimensions, LayoutChangeEvent, Platform } from 'react-native';
import { LineChart, lineDataItem } from 'react-native-gifted-charts';
import { AURA_COLORS } from '../../constants/theme';

export interface ChartDataPoint {
  value: number;
  label?: string;
  secondaryValue?: number;
  periodLabel?: string;
}

export interface FinancialAreaChartProps {
  data: ChartDataPoint[];
  primaryColor?: string;
  secondaryColor?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  height?: number;
  showSecondaryLine?: boolean;
  formatTooltipValue?: (val: number) => string;
  badgeText?: string;
}

const defaultFormatCompact = (val: number): string => {
  if (val >= 1_000_000) {
    return `$${(val / 1_000_000).toFixed(1)}M`;
  }
  if (val >= 1_000) {
    return `$${(val / 1_000).toFixed(0)}k`;
  }
  return `$${Math.round(val)}`;
};

const defaultFormatCurrency = (val: number): string => {
  return `$ ${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const FinancialAreaChart: React.FC<FinancialAreaChartProps> = ({
  data,
  primaryColor = AURA_COLORS.amberGold,
  secondaryColor = '#9CA3AF',
  primaryLabel = 'Saldo Total',
  secondaryLabel = 'Capital Aportado',
  height = 190,
  showSecondaryLine = false,
  formatTooltipValue = defaultFormatCurrency,
  badgeText,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const [containerWidth, setContainerWidth] = useState<number>(screenWidth - 56);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 50 && Math.abs(width - containerWidth) > 5) {
      setContainerWidth(width);
    }
  };

  // Preparamos los datos optimizados para gifted-charts
  const { line1Data, line2Data, maxValue, spacing } = useMemo(() => {
    if (!data || data.length === 0) {
      return { line1Data: [], line2Data: [], maxValue: 100, spacing: 30 };
    }

    // Calculamos el espaciado dinámico para que la gráfica ocupe exactamente el ancho disponible
    const yAxisWidth = 52;
    const availableWidth = Math.max(containerWidth - yAxisWidth - 24, 180);
    const calculatedSpacing = data.length > 1 ? availableWidth / (data.length - 1) : availableWidth;

    let maxVal = 0;
    const l1: lineDataItem[] = data.map((item) => {
      if (item.value > maxVal) maxVal = item.value;
      if (item.secondaryValue && item.secondaryValue > maxVal) maxVal = item.secondaryValue;

      return {
        value: item.value,
        label: item.label,
        dataPointText: '',
      };
    });

    const l2: lineDataItem[] = showSecondaryLine
      ? data.map((item) => ({
          value: item.secondaryValue ?? 0,
        }))
      : [];

    if (l1.length === 1) {
      l1.push({
        value: l1[0].value,
        label: '',
        dataPointText: '',
      });
      if (showSecondaryLine && l2.length === 1) {
        l2.push({
          value: l2[0].value,
        });
      }
    }

    return {
      line1Data: l1,
      line2Data: l2,
      maxValue: maxVal > 0 ? Math.ceil(maxVal * 1.08) : 100,
      spacing: calculatedSpacing,
    };
  }, [data, containerWidth, showSecondaryLine]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View onLayout={handleLayout} className="w-full my-2 bg-gray-50 rounded-2xl p-3.5 border border-gray-100">
      {/* HEADER DE LEYENDAS Y BADGE */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1.5">
            <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
            <Text className="text-[11px] font-semibold text-textDark">{primaryLabel}</Text>
          </View>

          {showSecondaryLine && Boolean(secondaryLabel) && (
            <View className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
              <Text className="text-[11px] font-medium text-textMuted">{secondaryLabel}</Text>
            </View>
          )}
        </View>

        {badgeText && (
          <View className="bg-amber-100 px-2 py-0.5 rounded">
            <Text className="text-[10px] font-bold text-amber-800">{badgeText}</Text>
          </View>
        )}
      </View>

      {/* ÁREA DE GRÁFICA CON GIFTED CHARTS */}
      <View
        className="overflow-hidden items-center justify-center"
        style={{ touchAction: 'pan-y' }}
      >
        <LineChart
          disableScroll={true}
          nestedScrollEnabled={true}
          areaChart
          curved={line1Data.length > 2}
          data={line1Data}
          {...(showSecondaryLine && line2Data.length > 0 ? { data2: line2Data } : {})}
          height={height}
          width={Math.max(containerWidth - 54, 180)}
          spacing={spacing}
          initialSpacing={10}
          endSpacing={10}
          maxValue={maxValue}
          noOfSections={4}
          yAxisColor="transparent"
          xAxisColor="#E5E7EB"
          xAxisThickness={1}
          rulesType="solid"
          rulesColor="#F3F4F6"
          rulesThickness={1}
          yAxisTextStyle={{
            color: '#9CA3AF',
            fontSize: 10,
            fontFamily: 'System',
          }}
          formatYLabel={(label: string) => defaultFormatCompact(parseFloat(label) || 0)}
          xAxisLabelTextStyle={{
            color: '#6B7280',
            fontSize: 9,
            fontWeight: '500',
          }}
          // Estilo Línea Principal
          color={primaryColor}
          thickness={2.5}
          startFillColor={primaryColor}
          endFillColor={primaryColor}
          startOpacity={0.25}
          endOpacity={0.02}
          // Estilo Línea Secundaria (Aporte)
          color2={secondaryColor}
          thickness2={1.8}
          strokeDashArray2={[4, 4]}
          // Puntos y Focos
          hideDataPoints={Platform.OS === 'web' || data.length > 15}
          focusEnabled={false}
          dataPointsColor={primaryColor}
          dataPointsRadius={3.5}
          // Pointer interactivo al tocar (long press para no secuestrar el scroll vertical)
          pointerConfig={{
            pointerStripColor: '#D1D5DB',
            pointerStripWidth: 1.5,
            pointerStripUptoDataPoint: true,
            pointerColor: primaryColor,
            radius: 4,
            autoAdjustPointerLabelPosition: true,
            pointerLabelWidth: 120,
            pointerLabelHeight: 52,
            activatePointersOnLongPress: true,
            pointerLabelComponent: (items: any) => {
              const item = items?.[0];
              if (!item) return null;
              const index = line1Data.findIndex((d) => d.value === item.value);
              const original = index >= 0 ? data[index] : null;

              return (
                <View className="bg-obsidian px-2.5 py-1.5 rounded-lg border border-gray-700 shadow-md">
                  <Text className="text-[9px] text-gray-400 font-medium">
                    {original?.periodLabel || (original?.label ? `Año ${original.label}` : 'Proyección')}
                  </Text>
                  <Text
                    className="text-xs font-bold text-white"
                    style={{ fontVariant: ['tabular-nums'] }}
                  >
                    {formatTooltipValue(item.value)}
                  </Text>
                </View>
              );
            },
          }}
        />
      </View>
      <Text className="text-[10px] text-center text-textMuted mt-1">
        Mantén presionado sobre la curva para explorar la evolución temporal
      </Text>
    </View>
  );
};
