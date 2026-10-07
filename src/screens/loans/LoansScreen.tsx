import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AURA_COLORS } from '../../constants/theme';
import { calculateLoanSimulation } from '../../modules/loans/loanCalculator';
import {
  AmortizationSystem,
  InsuranceType,
  LoanPaymentFrequency,
  LoanRateType,
  LoanSimulationResult,
} from '../../modules/loans/loanTypes';
import {
  AmortizationScheduleTab,
  LoanSimulatorTab,
} from './components';

type LoansScreenTab = 'simulator' | 'schedule';

const EMPTY_SIMULATION_RESULT: LoanSimulationResult = {
  amount: 0,
  term: 0,
  frequency: 'monthly',
  system: 'frances',
  annualRate: 0,
  rateType: 'effective',
  periodicRate: 0,
  periodicRateDecimal: 0,
  periodicRateLabel: '0.00% mensual',
  estimatedInstallment: 0,
  firstInstallment: 0,
  lastInstallment: 0,
  baseInstallment: 0,
  totalPrincipal: 0,
  totalInterest: 0,
  totalInsurance: 0,
  totalOtherCosts: 0,
  totalAdditionalCharges: 0,
  totalCost: 0,
  schedule: [],
  summary: {
    capitalPercentage: 0,
    interestPercentage: 0,
    chargesPercentage: 0,
  },
};

/**
 * LoansScreen - Aura Financial V2.5
 * Pantalla completa de Préstamos y Amortización.
 * Integra el motor financiero puro, sincronización en vivo y fidelidad 1:1 con Stitch.
 */
export const LoansScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState<LoansScreenTab>('simulator');

  // Estado del préstamo (Valores predeterminados en 0)
  const [amount, setAmount] = useState<number>(0);
  const [annualRate, setAnnualRate] = useState<number>(0);
  const [rateType, setRateType] = useState<LoanRateType>('effective');
  const [term, setTerm] = useState<number>(0);
  const [frequency, setFrequency] = useState<LoanPaymentFrequency>('monthly');
  const [system, setSystem] = useState<AmortizationSystem>('frances');
  const [insuranceType, setInsuranceType] = useState<InsuranceType>('fixed');
  const [insuranceValue, setInsuranceValue] = useState<number>(0);
  const [otherCosts, setOtherCosts] = useState<number>(0);

  // Cálculo en vivo determinista puro con manejo defensivo
  const simulationResult = useMemo<LoanSimulationResult>(() => {
    if (amount <= 0 || term < 1) {
      return EMPTY_SIMULATION_RESULT;
    }
    try {
      return calculateLoanSimulation({
        amount,
        annualRate,
        rateType,
        term,
        frequency,
        system,
        insuranceType,
        insuranceValue,
        otherCosts,
        startDate: '2025-05-15',
      });
    } catch {
      return EMPTY_SIMULATION_RESULT;
    }
  }, [
    amount,
    annualRate,
    rateType,
    term,
    frequency,
    system,
    insuranceType,
    insuranceValue,
    otherCosts,
  ]);

  const handleTabChange = (tab: LoansScreenTab) => {
    setActiveTab(tab);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleReset = () => {
    setAmount(0);
    setAnnualRate(0);
    setRateType('effective');
    setTerm(0);
    setFrequency('monthly');
    setSystem('frances');
    setInsuranceType('fixed');
    setInsuranceValue(0);
    setOtherCosts(0);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0
  );

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER SUPERIOR (Aura Financial) */}
      <View
        className="px-5 pb-3 bg-white border-b border-[#F0F0F2]"
        style={{ paddingTop: topInset + 8 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="relative w-10 h-10 rounded-full bg-[#121316] items-center justify-center">
              <Text className="text-white font-black text-sm tracking-wide">A</Text>
              <View className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#F59E0B] rounded-full border-2 border-white" />
            </View>
            <View>
              <Text className="text-lg font-black text-textDark leading-tight tracking-tight">
                Aura Financial
              </Text>
              <Text className="text-xs font-semibold text-textMutedDark">
                Préstamos & Amortización
              </Text>
            </View>
          </View>
        </View>

        {/* SELECTOR DE TABS SUPERIOR (Simulador | Amortización) */}
        <View className="flex-row bg-gray-100 rounded-full p-1 mt-3">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabChange('simulator')}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-full ${
              activeTab === 'simulator' ? 'bg-obsidian' : 'bg-transparent'
            }`}
          >
            <Ionicons
              name="calculator"
              size={15}
              color={activeTab === 'simulator' ? '#FFFFFF' : AURA_COLORS.textDark}
              style={{ marginRight: 6 }}
            />
            <Text
              className={`text-xs font-bold ${
                activeTab === 'simulator' ? 'text-white' : 'text-textDark'
              }`}
            >
              Simulador
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabChange('schedule')}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-full ${
              activeTab === 'schedule' ? 'bg-obsidian' : 'bg-transparent'
            }`}
          >
            <Ionicons
              name="list"
              size={16}
              color={activeTab === 'schedule' ? '#FFFFFF' : AURA_COLORS.textDark}
              style={{ marginRight: 6 }}
            />
            <Text
              className={`text-xs font-bold ${
                activeTab === 'schedule' ? 'text-white' : 'text-textDark'
              }`}
            >
              Amortización
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENIDO PRINCIPAL */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 96, // Espacio para el FloatingIslandTabBar
        }}
      >
        {activeTab === 'simulator' ? (
          <LoanSimulatorTab
            amount={amount}
            setAmount={setAmount}
            annualRate={annualRate}
            setAnnualRate={setAnnualRate}
            rateType={rateType}
            setRateType={setRateType}
            term={term}
            setTerm={setTerm}
            frequency={frequency}
            setFrequency={setFrequency}
            system={system}
            setSystem={setSystem}
            insuranceType={insuranceType}
            setInsuranceType={setInsuranceType}
            insuranceValue={insuranceValue}
            setInsuranceValue={setInsuranceValue}
            otherCosts={otherCosts}
            setOtherCosts={setOtherCosts}
            result={simulationResult}
            onViewAmortization={() => handleTabChange('schedule')}
            onReset={handleReset}
          />
        ) : (
          <AmortizationScheduleTab
            result={simulationResult}
            onBackToSimulator={() => handleTabChange('simulator')}
          />
        )}
      </ScrollView>
    </View>
  );
};
