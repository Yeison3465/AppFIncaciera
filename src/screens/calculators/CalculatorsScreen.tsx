import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../constants/theme';
import {
  PrimaryButton,
  SecondaryButton,
  FinancialStepper,
  InfoBanner,
  FloatingIslandTabBar,
  TabKey,
} from '../../components';
import {
  calculateSimpleInterest,
  calculateCompoundInterest,
  convertRate,
} from '../../modules';
import {
  Periodicity,
  RateType,
  RateModality,
  DayCountConvention,
  TimeUnit,
  CompoundingFrequency,
} from '../../types/financial';

type CalculatorTab = 'compound' | 'simple' | 'rates';

export const CalculatorsScreen: React.FC = () => {
  const [activeCalcTab, setActiveCalcTab] = useState<CalculatorTab>('simple');
  const [activeBottomTab, setActiveBottomTab] = useState<TabKey>('calc');

  // ==========================================
  // ESTADO: INTERÉS SIMPLE (RF-04)
  // ==========================================
  const [simplePrincipal, setSimplePrincipal] = useState<number>(10000);
  const [simpleRate, setSimpleRate] = useState<number>(9.5);
  const [simpleRatePeriodicity, setSimpleRatePeriodicity] = useState<'annual' | 'monthly'>('annual');
  const [simpleTerm, setSimpleTerm] = useState<number>(5);
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
    setSimplePrincipal(10000);
    setSimpleRate(9.5);
    setSimpleRatePeriodicity('annual');
    setSimpleTerm(5);
    setSimpleTermUnit('years');
    setSimpleConvention('commercial_360');
  };

  // ==========================================
  // ESTADO: INTERÉS COMPUESTO (RF-05)
  // ==========================================
  const [compoundInitialDeposit, setCompoundInitialDeposit] = useState<number>(10000);
  const [compoundFrequency, setCompoundFrequency] = useState<CompoundingFrequency>('monthly');
  const [compoundPeriodicDeposit, setCompoundPeriodicDeposit] = useState<number>(350);
  const [compoundIncludePeriodic, setCompoundIncludePeriodic] = useState<boolean>(true);
  const [compoundRateEA, setCompoundRateEA] = useState<number>(9.5);
  const [compoundTermYears, setCompoundTermYears] = useState<number>(15);

  const compoundResult = useMemo(() => {
    try {
      return calculateCompoundInterest({
        initialDeposit: compoundInitialDeposit,
        annualEffectiveRate: compoundRateEA,
        termYears: compoundTermYears,
        compoundingFrequency: compoundFrequency,
        periodicDeposit: compoundPeriodicDeposit,
        includePeriodicDeposit: compoundIncludePeriodic,
      });
    } catch {
      return null;
    }
  }, [compoundInitialDeposit, compoundRateEA, compoundTermYears, compoundFrequency, compoundPeriodicDeposit, compoundIncludePeriodic]);

  const resetCompound = () => {
    setCompoundInitialDeposit(10000);
    setCompoundFrequency('monthly');
    setCompoundPeriodicDeposit(350);
    setCompoundIncludePeriodic(true);
    setCompoundRateEA(9.5);
    setCompoundTermYears(15);
  };

  // ==========================================
  // ESTADO: CONVERSIÓN DE TASAS (RF-06)
  // ==========================================
  const [rateSourceValue, setRateSourceValue] = useState<number>(18.0);
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
    setRateSourceValue(18.0);
    setRateSourceType('effective');
    setRateSourcePeriodicity('annual');
    setRateSourceModality('arrears');
    setRateTargetType('effective');
    setRateTargetPeriodicity('monthly');
    setRateTargetModality('arrears');
  };

  // Helper para formato de moneda
  const formatCurrency = (amount: number) => {
    return `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER SUPERIOR */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View>
            <Text style={styles.appSuperTitle}>AURA FINANCIAL</Text>
            <Text style={styles.appTitle}>Calculadoras</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="notifications-outline" size={20} color={AURA_COLORS.textDark} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="person-circle-outline" size={26} color={AURA_COLORS.textDark} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SELECTOR DE TABS SUPERIOR (Compuesto | Simple | Tasas) */}
      <View style={styles.tabBarContainer}>
        <View style={styles.tabPillContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveCalcTab('compound')}
            style={[styles.calcTab, activeCalcTab === 'compound' && styles.activeCalcTab]}
          >
            <Ionicons
              name="trending-up"
              size={15}
              color={activeCalcTab === 'compound' ? AURA_COLORS.textPrimary : AURA_COLORS.textDark}
              style={styles.tabIcon}
            />
            <Text style={[styles.calcTabText, activeCalcTab === 'compound' && styles.activeCalcTabText]}>
              Compuesto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveCalcTab('simple')}
            style={[styles.calcTab, activeCalcTab === 'simple' && styles.activeCalcTab]}
          >
            <Text
              style={[
                styles.tabSymbol,
                { color: activeCalcTab === 'simple' ? AURA_COLORS.textPrimary : AURA_COLORS.textDark },
              ]}
            >
              Σ
            </Text>
            <Text style={[styles.calcTabText, activeCalcTab === 'simple' && styles.activeCalcTabText]}>
              Simple
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveCalcTab('rates')}
            style={[styles.calcTab, activeCalcTab === 'rates' && styles.activeCalcTab]}
          >
            <Ionicons
              name="swap-horizontal"
              size={15}
              color={activeCalcTab === 'rates' ? AURA_COLORS.textPrimary : AURA_COLORS.textDark}
              style={styles.tabIcon}
            />
            <Text style={[styles.calcTabText, activeCalcTab === 'rates' && styles.activeCalcTabText]}>
              Tasas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENIDO PRINCIPAL */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ========================================================================= */}
        {/* VISTA 1: INTERÉS SIMPLE (RF-04) */}
        {/* ========================================================================= */}
        {activeCalcTab === 'simple' && simpleResult && (
          <View>
            {/* HERO CARD INTERÉS SIMPLE */}
            <View style={styles.heroCard}>
              <View style={styles.heroHeaderRow}>
                <Text style={styles.heroPreTitle}>MONTO FINAL ACUMULADO (S)</Text>
                <View style={styles.heroTag}>
                  <Text style={styles.heroTagText}>Interés Lineal Simple</Text>
                </View>
              </View>

              <Text style={styles.heroMainAmount}>{formatCurrency(simpleResult.finalAmount)}</Text>

              <View style={styles.heroSubRow}>
                <Ionicons name="arrow-up-outline" size={14} color={AURA_COLORS.emeraldGreen} />
                <Text style={styles.heroReturnText}>
                  +{simpleResult.totalReturnPercentage.toFixed(2)}% Rendimiento Total
                </Text>
                <Text style={styles.heroDotSeparator}>•</Text>
                <Text style={styles.heroSubDesc}>Ganancia Lineal</Text>
              </View>

              {/* 2 Columnas de métricas */}
              <View style={styles.metricGrid}>
                <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricDot, { backgroundColor: '#9CA3AF' }]} />
                    <Text style={styles.metricTitle}>CAPITAL INICIAL (C)</Text>
                  </View>
                  <Text style={styles.metricValue}>{formatCurrency(simpleResult.principal)}</Text>
                  <Text style={styles.metricSubtext}>
                    {simpleResult.principalPercentage}% del acumulado
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricDot, { backgroundColor: AURA_COLORS.emeraldGreen }]} />
                    <Text style={styles.metricTitle}>INTERÉS TOTAL (I)</Text>
                  </View>
                  <Text style={[styles.metricValue, { color: AURA_COLORS.emeraldGreen }]}>
                    +{formatCurrency(simpleResult.interestEarned)}
                  </Text>
                  <Text style={[styles.metricSubtext, { color: AURA_COLORS.emeraldGreen }]}>
                    {simpleResult.interestPercentage}% de retorno
                  </Text>
                </View>
              </View>

              {/* Gráfica de Proyección Lineal */}
              <View style={styles.chartContainer}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Proyección constante: I = C · i · t</Text>
                  <Text style={styles.chartBadgeText}>{simpleTerm} Años</Text>
                </View>

                {/* Línea de proyección estilizada */}
                <View style={styles.lineChartBox}>
                  <View style={styles.linearLineContainer}>
                    <View style={styles.linearLineGradient} />
                    <View style={[styles.chartNode, styles.nodeStart]} />
                    <View style={[styles.chartNode, styles.nodeMid]} />
                    <View style={[styles.chartNode, styles.nodeEnd]} />
                  </View>
                  <View style={styles.chartLabelsRow}>
                    <Text style={styles.chartLabel}>Inicio (Año 0)</Text>
                    <Text style={styles.chartLabel}>
                      Hito medio ({(simpleResult.timeInYears / 2).toFixed(1)}a)
                    </Text>
                    <Text style={[styles.chartLabel, styles.chartLabelHighlight]}>
                      {formatCurrency(simpleResult.finalAmount)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* FORMULARIO: CONFIGURACIÓN DEL CÁLCULO */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleGroup}>
                  <Ionicons name="options-outline" size={18} color={AURA_COLORS.amberGold} />
                  <Text style={styles.sectionTitle}>Configuración del Cálculo</Text>
                </View>
                <View style={styles.auraBadge}>
                  <Text style={styles.auraBadgeText}>Aura V3</Text>
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
              <View style={styles.fieldWithSelector}>
                <View style={styles.inlineHeader}>
                  <Text style={styles.fieldTitle}>Tasa de Interés Nominal (%)</Text>
                  <View style={styles.miniPillSelector}>
                    <TouchableOpacity
                      onPress={() => setSimpleRatePeriodicity('annual')}
                      style={[
                        styles.miniPill,
                        simpleRatePeriodicity === 'annual' && styles.miniPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.miniPillText,
                          simpleRatePeriodicity === 'annual' && styles.miniPillTextActive,
                        ]}
                      >
                        Anual
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setSimpleRatePeriodicity('monthly')}
                      style={[
                        styles.miniPill,
                        simpleRatePeriodicity === 'monthly' && styles.miniPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.miniPillText,
                          simpleRatePeriodicity === 'monthly' && styles.miniPillTextActive,
                        ]}
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
                  min={0.1}
                  decimals={2}
                  suffix="%"
                  accessoryIcon="pricetag-outline"
                />
              </View>

              {/* Plazo o Periodo */}
              <View style={styles.fieldWithSelector}>
                <View style={styles.inlineHeader}>
                  <Text style={styles.fieldTitle}>Plazo o Periodo de Tiempo</Text>
                  <Text style={styles.fieldSub}>Duración (t)</Text>
                </View>
                <View style={styles.stepperWithInlineUnit}>
                  <FinancialStepper
                    label=""
                    value={simpleTerm}
                    onChange={setSimpleTerm}
                    step={1}
                    min={1}
                    accessoryIcon="calendar-outline"
                  />
                  {/* Selector de unidad de tiempo */}
                  <View style={styles.unitSelectorRow}>
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
                          style={[styles.unitBtn, isSel && styles.unitBtnActive]}
                        >
                          <Text style={[styles.unitBtnText, isSel && styles.unitBtnTextActive]}>
                            {labels[unit]}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Base de Cálculo Diaria */}
              <View style={styles.conventionBox}>
                <View style={styles.inlineHeader}>
                  <Text style={styles.fieldTitle}>Base de Cálculo Diaria</Text>
                  <Text style={styles.fieldSub}>Convención Financiera</Text>
                </View>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setSimpleConvention('commercial_360')}
                    style={[
                      styles.conventionBtn,
                      simpleConvention === 'commercial_360' && styles.conventionBtnActive,
                    ]}
                  >
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={14}
                      color={
                        simpleConvention === 'commercial_360'
                          ? AURA_COLORS.amberGold
                          : AURA_COLORS.textDark
                      }
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.conventionBtnText,
                        simpleConvention === 'commercial_360' && styles.conventionBtnTextActive,
                      ]}
                    >
                      Comercial (360d)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setSimpleConvention('exact_365')}
                    style={[
                      styles.conventionBtn,
                      simpleConvention === 'exact_365' && styles.conventionBtnActive,
                    ]}
                  >
                    <Ionicons
                      name="calendar-clear-outline"
                      size={14}
                      color={
                        simpleConvention === 'exact_365'
                          ? AURA_COLORS.amberGold
                          : AURA_COLORS.textDark
                      }
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.conventionBtnText,
                        simpleConvention === 'exact_365' && styles.conventionBtnTextActive,
                      ]}
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
            <View style={styles.actionButtons}>
              <PrimaryButton
                title="Calcular Interés Simple"
                iconName="calculator"
                iconPosition="left"
                onPress={() => {}}
                style={styles.mainActionButton}
              />
              <SecondaryButton
                title="Restablecer Valores Predeterminados"
                iconName="refresh"
                onPress={resetSimple}
              />
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* VISTA 2: INTERÉS COMPUESTO (RF-05) */}
        {/* ========================================================================= */}
        {activeCalcTab === 'compound' && compoundResult && (
          <View>
            {/* HERO CARD INTERÉS COMPUESTO */}
            <View style={styles.heroCard}>
              <View style={styles.heroHeaderRow}>
                <Text style={styles.heroPreTitle}>VALOR FUTURO ESTIMADO</Text>
                <View style={styles.heroGrowthBadge}>
                  <Ionicons name="trending-up" size={13} color={AURA_COLORS.emeraldGreen} />
                  <Text style={styles.heroGrowthText}>
                    +{compoundResult.totalReturnPercentage.toFixed(1)}% ({compoundResult.multiplier.toFixed(2)}x)
                  </Text>
                </View>
              </View>

              <Text style={styles.heroMainAmount}>{formatCurrency(compoundResult.futureValue)}</Text>

              {/* Curva de Crecimiento Exponencial */}
              <View style={styles.compoundChartBox}>
                <View style={styles.curveContainer}>
                  <View style={styles.curveLine} />
                  <View style={[styles.curvePoint, { left: '0%', bottom: 10 }]} />
                  <View style={[styles.curvePoint, { left: '33%', bottom: 25 }]} />
                  <View style={[styles.curvePoint, { left: '66%', bottom: 50 }]} />
                  <View style={[styles.curvePoint, styles.curvePointMeta, { right: 0, bottom: 85 }]} />
                </View>
                <View style={styles.chartLabelsRow}>
                  <Text style={styles.chartLabel}>Año 0</Text>
                  <Text style={styles.chartLabel}>Año 5</Text>
                  <Text style={styles.chartLabel}>Año 10</Text>
                  <Text style={[styles.chartLabel, styles.chartLabelHighlight]}>
                    Año {compoundTermYears} [Meta]
                  </Text>
                </View>
              </View>

              {/* 2 Columnas de métricas */}
              <View style={styles.metricGrid}>
                <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricDot, { backgroundColor: '#9CA3AF' }]} />
                    <Text style={styles.metricTitle}>Capital Aportado</Text>
                  </View>
                  <Text style={styles.metricValue}>
                    {formatCurrency(compoundResult.totalPrincipalContributed)}
                  </Text>
                  <Text style={styles.metricSubtext}>
                    {compoundResult.principalPercentage}% del total
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricDot, { backgroundColor: AURA_COLORS.emeraldGreen }]} />
                    <Text style={styles.metricTitle}>Rendimiento Ganado</Text>
                  </View>
                  <Text style={[styles.metricValue, { color: AURA_COLORS.emeraldGreen }]}>
                    +{formatCurrency(compoundResult.totalInterestEarned)}
                  </Text>
                  <Text style={[styles.metricSubtext, { color: AURA_COLORS.emeraldGreen }]}>
                    {compoundResult.interestPercentage}% interés puro
                  </Text>
                </View>
              </View>
            </View>

            {/* FORMULARIO: CONFIGURACIÓN DE PROYECCIÓN */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Configuración de Proyección</Text>
                <Ionicons name="options-outline" size={18} color={AURA_COLORS.textDark} />
              </View>

              {/* Frecuencia de Capitalización */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldTitle}>Frecuencia de Capitalización</Text>
                <View style={styles.frequencyRow}>
                  {(['monthly', 'quarterly', 'annual'] as CompoundingFrequency[]).map((freq) => {
                    const labels: Record<CompoundingFrequency, string> = {
                      monthly: 'Mensual',
                      quarterly: 'Trimestral',
                      annual: 'Anual',
                    };
                    const isSel = compoundFrequency === freq;
                    return (
                      <TouchableOpacity
                        key={freq}
                        onPress={() => setCompoundFrequency(freq)}
                        style={[styles.freqBtn, isSel && styles.freqBtnActive]}
                      >
                        <Text style={[styles.freqBtnText, isSel && styles.freqBtnTextActive]}>
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
                value={compoundInitialDeposit}
                onChange={setCompoundInitialDeposit}
                step={1000}
                min={0}
                prefix="$"
              />

              {/* Aporte Periódico Mensual con Switch */}
              <View style={styles.fieldBlock}>
                <View style={styles.inlineHeader}>
                  <Text style={styles.fieldTitle}>Aporte Periódico Mensual</Text>
                  <View style={styles.toggleBadgeGroup}>
                    {compoundIncludePeriodic && (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>Activo</Text>
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

              {/* Fila Doble: Tasa Anual E.A. y Horizonte */}
              <View style={styles.stepperRow}>
                <View style={styles.halfCol}>
                  <FinancialStepper
                    label="Tasa Anual E.A."
                    value={compoundRateEA}
                    onChange={setCompoundRateEA}
                    step={0.25}
                    min={0.1}
                    decimals={1}
                    suffix="%"
                  />
                </View>
                <View style={styles.halfCol}>
                  <FinancialStepper
                    label="Horizonte (Años)"
                    value={compoundTermYears}
                    onChange={setCompoundTermYears}
                    step={1}
                    min={1}
                    max={60}
                    suffix="a"
                  />
                </View>
              </View>
            </View>

            {/* INFO BANNER EFECTO BOLA DE NIEVE */}
            <InfoBanner
              title="Efecto Bola de Nieve"
              description={`En un plazo de ${compoundTermYears} años al ${compoundRateEA}%, tus intereses generados superan el ${compoundResult.totalReturnPercentage.toFixed(0)}% del capital que aportaste. El tiempo es el factor exponencial clave.`}
            />

            {/* BOTONES DE ACCIÓN */}
            <View style={styles.actionButtons}>
              <PrimaryButton
                title="Recalcular Proyección"
                iconName="sync-outline"
                iconPosition="left"
                onPress={() => {}}
                style={styles.mainActionButton}
              />
              <View style={styles.secondaryBtnRow}>
                <SecondaryButton
                  title="Restablecer"
                  iconName="refresh"
                  onPress={resetCompound}
                  style={styles.halfSecondaryBtn}
                />
                <SecondaryButton
                  title="Compartir Reporte"
                  iconName="share-outline"
                  onPress={() => {}}
                  style={styles.halfSecondaryBtn}
                />
              </View>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* VISTA 3: CONVERSIÓN DE TASAS (RF-06) */}
        {/* ========================================================================= */}
        {activeCalcTab === 'rates' && rateResult && (
          <View>
            {/* HERO CARD CONVERSIÓN DE TASAS */}
            <View style={styles.heroCard}>
              <View style={styles.heroHeaderRow}>
                <Text style={styles.heroPreTitle}>TASA EQUIVALENTE CALCULADA</Text>
                <View style={styles.heroTag}>
                  <Text style={styles.heroTagText}>Fórmula Financiera Exacta</Text>
                </View>
              </View>

              <Text style={styles.heroMainAmount}>
                {rateResult.equivalentRate.toFixed(2)} %{' '}
                <Text style={styles.heroRateTypeLabel}>
                  {rateTargetType === 'effective'
                    ? rateTargetPeriodicity === 'annual'
                      ? 'E.A.'
                      : 'E.P.'
                    : 'T.N.'}
                </Text>
              </Text>

              <View style={styles.heroSubRow}>
                <Ionicons name="checkmark-circle" size={15} color={AURA_COLORS.emeraldGreen} />
                <Text style={[styles.heroReturnText, { color: AURA_COLORS.emeraldGreen }]}>
                  Equivalencia Matemática Verificada
                </Text>
              </View>

              {/* 2 Columnas de métricas */}
              <View style={styles.metricGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricTitle}>TASA PERIÓDICA DESTINO</Text>
                  <Text style={styles.metricValue}>{rateResult.targetPeriodicLabel}</Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricTitle}>FACTOR MATEMÁTICO</Text>
                  <Text style={[styles.metricValue, { fontSize: 13, color: '#374151' }]}>
                    {rateResult.mathematicalFormula}
                  </Text>
                </View>
              </View>
            </View>

            {/* SECCIÓN 1: TASA DE ORIGEN */}
            <View style={styles.sectionCard}>
              <View style={styles.badgeStepHeader}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepCircleText}>1</Text>
                </View>
                <Text style={styles.stepTitle}>Tasa de Origen (Entrada)</Text>
                <Ionicons name="log-in-outline" size={18} color="#6B7280" style={{ marginLeft: 'auto' }} />
              </View>

              {/* Tipo de Tasa */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldTitle}>Tipo de Tasa</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    onPress={() => setRateSourceType('nominal')}
                    style={[styles.segmentBtn, rateSourceType === 'nominal' && styles.segmentBtnActive]}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        rateSourceType === 'nominal' && styles.segmentBtnTextActive,
                      ]}
                    >
                      Nominal (T.N.)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setRateSourceType('effective')}
                    style={[styles.segmentBtn, rateSourceType === 'effective' && styles.segmentBtnActive]}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        rateSourceType === 'effective' && styles.segmentBtnTextActive,
                      ]}
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
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldTitle}>Periodicidad Base</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {(['annual', 'semiannual', 'quarterly', 'monthly', 'weekly', 'daily'] as Periodicity[]).map(
                    (p) => {
                      const labels: Record<Periodicity, string> = {
                        annual: 'Anual',
                        semiannual: 'Semestral',
                        quarterly: 'Trimestral',
                        monthly: 'Mensual',
                        weekly: 'Semanal',
                        daily: 'Diario',
                      };
                      const isSel = rateSourcePeriodicity === p;
                      return (
                        <TouchableOpacity
                          key={p}
                          onPress={() => setRateSourcePeriodicity(p)}
                          style={[styles.chipBtn, isSel && styles.chipBtnActive]}
                        >
                          <Text style={[styles.chipBtnText, isSel && styles.chipBtnTextActive]}>
                            {labels[p]}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </ScrollView>
              </View>

              {/* Modalidad Temporal */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldTitle}>Modalidad Temporal</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    onPress={() => setRateSourceModality('arrears')}
                    style={[
                      styles.segmentBtn,
                      rateSourceModality === 'arrears' && styles.segmentBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        rateSourceModality === 'arrears' && styles.segmentBtnTextActive,
                      ]}
                    >
                      Vencida (V)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setRateSourceModality('advance')}
                    style={[
                      styles.segmentBtn,
                      rateSourceModality === 'advance' && styles.segmentBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        rateSourceModality === 'advance' && styles.segmentBtnTextActive,
                      ]}
                    >
                      Anticipada (A)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* BOTÓN TRANSPONER PARÁMETROS */}
            <View style={styles.transposeWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleTransposeRates}
                style={styles.transposeButton}
              >
                <Ionicons name="swap-vertical" size={16} color={AURA_COLORS.amberGold} />
                <Text style={styles.transposeButtonText}>Transponer Parámetros</Text>
              </TouchableOpacity>
            </View>

            {/* SECCIÓN 2: TASA DESTINO */}
            <View style={styles.sectionCard}>
              <View style={styles.badgeStepHeader}>
                <View style={[styles.stepCircle, { backgroundColor: '#D97706' }]}>
                  <Text style={styles.stepCircleText}>2</Text>
                </View>
                <Text style={styles.stepTitle}>Tasa Destino (Requerida)</Text>
                <Ionicons name="log-out-outline" size={18} color="#6B7280" style={{ marginLeft: 'auto' }} />
              </View>

              {/* Tipo de Salida */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldTitle}>Tipo de Salida Buscado</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    onPress={() => setRateTargetType('nominal')}
                    style={[styles.segmentBtn, rateTargetType === 'nominal' && styles.segmentBtnActive]}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        rateTargetType === 'nominal' && styles.segmentBtnTextActive,
                      ]}
                    >
                      Nominal (T.N.)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setRateTargetType('effective')}
                    style={[styles.segmentBtn, rateTargetType === 'effective' && styles.segmentBtnActive]}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        rateTargetType === 'effective' && styles.segmentBtnTextActive,
                      ]}
                    >
                      Efectiva (E.A.)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Periodicidad Destino */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldTitle}>Periodicidad de Capitalización</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {(['annual', 'semiannual', 'quarterly', 'monthly', 'weekly', 'daily'] as Periodicity[]).map(
                    (p) => {
                      const labels: Record<Periodicity, string> = {
                        annual: 'Anual',
                        semiannual: 'Semestral',
                        quarterly: 'Trimestral',
                        monthly: 'Mensual',
                        weekly: 'Semanal',
                        daily: 'Diario',
                      };
                      const isSel = rateTargetPeriodicity === p;
                      return (
                        <TouchableOpacity
                          key={p}
                          onPress={() => setRateTargetPeriodicity(p)}
                          style={[styles.chipBtn, isSel && styles.chipBtnActive]}
                        >
                          <Text style={[styles.chipBtnText, isSel && styles.chipBtnTextActive]}>
                            {labels[p]}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </ScrollView>
              </View>

              {/* Modalidad Temporal Destino */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldTitle}>Modalidad Temporal</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    onPress={() => setRateTargetModality('arrears')}
                    style={[
                      styles.segmentBtn,
                      rateTargetModality === 'arrears' && styles.segmentBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        rateTargetModality === 'arrears' && styles.segmentBtnTextActive,
                      ]}
                    >
                      Vencida (V)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setRateTargetModality('advance')}
                    style={[
                      styles.segmentBtn,
                      rateTargetModality === 'advance' && styles.segmentBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        rateTargetModality === 'advance' && styles.segmentBtnTextActive,
                      ]}
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
            <View style={styles.actionButtons}>
              <PrimaryButton
                title="Convertir y Homologar Tasa"
                iconName="sync"
                iconPosition="left"
                onPress={() => {}}
                style={styles.mainActionButton}
              />
              <SecondaryButton
                title="Invertir Tasas / Limpiar"
                iconName="refresh"
                onPress={resetRates}
              />
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* DOCK FLOTANTE INFERIOR */}
      <FloatingIslandTabBar
        activeTab={activeBottomTab}
        onTabPress={setActiveBottomTab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: AURA_COLORS.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  appSuperTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: AURA_COLORS.textMutedDark,
    letterSpacing: 0.8,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AURA_COLORS.textDark,
    letterSpacing: -0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: AURA_COLORS.amberGold,
    position: 'absolute',
    top: 9,
    right: 9,
  },
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  tabPillContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 9999,
    padding: 4,
  },
  calcTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 9999,
  },
  activeCalcTab: {
    backgroundColor: AURA_COLORS.obsidian,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabSymbol: {
    fontSize: 15,
    fontWeight: '800',
    marginRight: 6,
  },
  calcTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: AURA_COLORS.textDark,
  },
  activeCalcTabText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // HERO CARD STYLES
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ECEEF2',
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heroPreTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: AURA_COLORS.textMutedDark,
    letterSpacing: 0.5,
  },
  heroTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: AURA_COLORS.textMutedDark,
  },
  heroGrowthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: AURA_COLORS.emeraldGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroGrowthText: {
    fontSize: 11,
    fontWeight: '700',
    color: AURA_COLORS.emeraldGreen,
  },
  heroMainAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: AURA_COLORS.textDark,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
    marginVertical: 4,
  },
  heroRateTypeLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: AURA_COLORS.amberGold,
  },
  heroSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  heroReturnText: {
    fontSize: 12,
    fontWeight: '700',
    color: AURA_COLORS.emeraldGreen,
  },
  heroDotSeparator: {
    color: AURA_COLORS.textMuted,
    fontSize: 12,
  },
  heroSubDesc: {
    fontSize: 12,
    color: AURA_COLORS.textMutedDark,
    fontWeight: '500',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metricDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  metricTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: AURA_COLORS.textMutedDark,
    letterSpacing: 0.2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: AURA_COLORS.textDark,
    fontVariant: ['tabular-nums'],
  },
  metricSubtext: {
    fontSize: 11,
    color: AURA_COLORS.textMutedDark,
    marginTop: 2,
    fontWeight: '500',
  },

  // LINE CHART (SIMPLE)
  chartContainer: {
    backgroundColor: '#FFFDF7',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginTop: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78350F',
  },
  chartBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: AURA_COLORS.amberGold,
  },
  lineChartBox: {
    paddingVertical: 10,
  },
  linearLineContainer: {
    height: 36,
    position: 'relative',
    justifyContent: 'center',
  },
  linearLineGradient: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 4,
    backgroundColor: AURA_COLORS.amberGold,
    borderRadius: 2,
    transform: [{ rotate: '-6deg' }],
  },
  chartNode: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AURA_COLORS.amberGold,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nodeStart: {
    left: 6,
    bottom: 8,
    backgroundColor: '#111111',
  },
  nodeMid: {
    left: '50%',
    bottom: 14,
  },
  nodeEnd: {
    right: 6,
    bottom: 22,
  },
  chartLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: AURA_COLORS.textMutedDark,
  },
  chartLabelHighlight: {
    fontWeight: '800',
    color: AURA_COLORS.textDark,
  },

  // COMPOUND CHART
  compoundChartBox: {
    backgroundColor: '#FFFDF7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginVertical: 10,
  },
  curveContainer: {
    height: 70,
    position: 'relative',
    justifyContent: 'center',
  },
  curveLine: {
    position: 'absolute',
    left: 4,
    right: 4,
    height: 4,
    backgroundColor: AURA_COLORS.amberGold,
    borderRadius: 2,
    transform: [{ rotate: '-12deg' }],
  },
  curvePoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: AURA_COLORS.amberGold,
  },
  curvePointMeta: {
    backgroundColor: AURA_COLORS.amberGold,
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // FORM SECTION CARD
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECEEF2',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AURA_COLORS.textDark,
  },
  auraBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  auraBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: AURA_COLORS.textMutedDark,
  },
  fieldBlock: {
    marginVertical: 8,
  },
  fieldWithSelector: {
    marginVertical: 8,
  },
  inlineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  fieldSub: {
    fontSize: 12,
    color: AURA_COLORS.textMutedDark,
    fontWeight: '500',
  },
  miniPillSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 9999,
    padding: 2,
  },
  miniPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  miniPillActive: {
    backgroundColor: AURA_COLORS.obsidian,
  },
  miniPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: AURA_COLORS.textDark,
  },
  miniPillTextActive: {
    color: '#FFFFFF',
  },
  stepperWithInlineUnit: {
    position: 'relative',
  },
  unitSelectorRow: {
    flexDirection: 'row',
    position: 'absolute',
    right: 85,
    top: 15,
    gap: 4,
  },
  unitBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  unitBtnActive: {
    backgroundColor: AURA_COLORS.obsidian,
  },
  unitBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: AURA_COLORS.textDark,
  },
  unitBtnTextActive: {
    color: '#FFFFFF',
  },
  conventionBox: {
    marginTop: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  conventionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
  },
  conventionBtnActive: {
    backgroundColor: AURA_COLORS.obsidian,
  },
  conventionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: AURA_COLORS.textDark,
  },
  conventionBtnTextActive: {
    color: '#FFFFFF',
  },
  frequencyRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginTop: 4,
  },
  freqBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  freqBtnActive: {
    backgroundColor: AURA_COLORS.obsidian,
  },
  freqBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: AURA_COLORS.textDark,
  },
  freqBtnTextActive: {
    color: '#FFFFFF',
  },
  toggleBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
  },

  // RATES SECTION SPECIFIC
  badgeStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: AURA_COLORS.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AURA_COLORS.textDark,
  },
  segmentBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: AURA_COLORS.obsidian,
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: AURA_COLORS.textDark,
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chipScroll: {
    marginTop: 6,
  },
  chipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  chipBtnActive: {
    backgroundColor: AURA_COLORS.obsidian,
  },
  chipBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: AURA_COLORS.textDark,
  },
  chipBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  transposeWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  transposeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AURA_COLORS.obsidian,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  transposeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // ACTION BUTTONS
  actionButtons: {
    marginTop: 8,
    gap: 10,
  },
  mainActionButton: {
    marginBottom: 2,
  },
  secondaryBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  halfSecondaryBtn: {
    flex: 1,
  },
});
