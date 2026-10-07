/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateLoanSimulation } from '../loanCalculator';

describe('Motor Financiero Puro: calculateLoanSimulation (RF-07 y RF-08)', () => {

  describe('Test 1: Sistema Francés con valores estándar (Aura Mockup Benchmark)', () => {
    it('Calcula cuota uniforme, intereses, abono a capital y saldo final 0.00', () => {
      const result = calculateLoanSimulation({
        amount: 15000,
        annualRate: 12.5,
        rateType: 'effective',
        term: 24,
        frequency: 'monthly',
        system: 'frances',
        insuranceType: 'fixed',
        insuranceValue: 15,
        otherCosts: 10,
        startDate: '2025-05-15',
      });

      // Verificación de cuota periódica estimada
      assert.strictEqual(result.baseInstallment, 704.96);
      assert.strictEqual(result.estimatedInstallment, 729.96);
      assert.strictEqual(result.firstInstallment, 729.96);
      assert.strictEqual(result.schedule.length, 24);

      // Verificación de conservación de capital
      assert.strictEqual(result.totalPrincipal, 15000.00, 'La suma de capitales debe ser exactamente 15,000.00');

      // Verificación de saldo final en $0.00
      const lastRow = result.schedule[result.schedule.length - 1];
      assert.strictEqual(lastRow.remainingBalance, 0.00, 'El saldo de la última cuota debe ser 0.00');

      // Verificación de total de intereses acumulados
      assert.strictEqual(result.totalInterest, 1918.94);

      // Verificación de totales de seguros y costos ($25 * 24 = $600)
      assert.strictEqual(result.totalInsurance, 360.00);
      assert.strictEqual(result.totalOtherCosts, 240.00);
      assert.strictEqual(result.totalAdditionalCharges, 600.00);

      // Costo total del crédito: 15000 + 1918.94 + 600 = 17518.94
      assert.strictEqual(result.totalCost, 17518.94);

      // Comportamiento del sistema francés: interés decreciente, capital creciente
      const row1 = result.schedule[0];
      const row2 = result.schedule[1];
      assert.ok(row1.interest > row2.interest, 'El interés del mes 1 debe ser mayor al del mes 2');
      assert.ok(row1.principal < row2.principal, 'El abono a capital del mes 1 debe ser menor al del mes 2');

      // Fechas secuenciales
      assert.strictEqual(row1.dueDate, '15 May 2025');
      assert.strictEqual(row2.dueDate, '15 Jun 2025');
    });
  });

  describe('Test 2: Sistema Alemán con abono constante y cuotas decrecientes', () => {
    it('Abono constante ($625/mes), cuotas decrecientes, capital 100% y saldo final 0.00', () => {
      const result = calculateLoanSimulation({
        amount: 15000,
        annualRate: 12.5,
        rateType: 'effective',
        term: 24,
        frequency: 'monthly',
        system: 'aleman',
        insuranceType: 'fixed',
        insuranceValue: 15,
        otherCosts: 10,
        startDate: '2025-05-15',
      });

      assert.strictEqual(result.schedule.length, 24);

      // En el sistema alemán, el abono a capital es constante (15000 / 24 = 625.00)
      for (let i = 0; i < 23; i++) {
        assert.strictEqual(result.schedule[i].principal, 625.00);
      }
      assert.strictEqual(result.schedule[23].principal, 625.00);

      // Cuotas decrecientes: primera cuota > última cuota
      assert.ok(
        result.firstInstallment > result.lastInstallment,
        `La primera cuota (${result.firstInstallment}) debe ser mayor que la última (${result.lastInstallment})`
      );

      // Conservación de capital y saldo 0.00
      assert.strictEqual(result.totalPrincipal, 15000.00);
      assert.strictEqual(result.schedule[23].remainingBalance, 0.00);

      // En Sistema Alemán el costo total de intereses es menor que en Francés
      assert.ok(result.totalInterest < 1918.94, 'El total de intereses en Alemán debe ser menor que en Francés');
    });
  });

  describe('Test 3: Seguros y cargos adicionales periódicos', () => {
    it('Calcula seguros fijos y cargos de administración acumulados exactamente', () => {
      const result = calculateLoanSimulation({
        amount: 10000,
        annualRate: 10,
        term: 12,
        frequency: 'monthly',
        insuranceType: 'fixed',
        insuranceValue: 20,
        otherCosts: 5,
      });

      assert.strictEqual(result.totalInsurance, 240.00); // 12 * 20
      assert.strictEqual(result.totalOtherCosts, 60.00);  // 12 * 5
      assert.strictEqual(result.totalAdditionalCharges, 300.00);
      assert.strictEqual(result.totalCost, 10000 + result.totalInterest + 300);
    });

    it('Calcula seguro porcentual sobre el saldo deudor decreciente', () => {
      const result = calculateLoanSimulation({
        amount: 10000,
        annualRate: 12,
        term: 12,
        frequency: 'monthly',
        insuranceType: 'percentage',
        insuranceValue: 0.10, // 0.10% mensual sobre saldo
        otherCosts: 0,
      });

      // El seguro del primer mes debe ser sobre 10,000 (10000 * 0.001 = 10.00)
      assert.strictEqual(result.schedule[0].insurance, 10.00);
      // El seguro del último mes debe ser menor al del primero
      const lastRow = result.schedule[result.schedule.length - 1];
      assert.ok(lastRow.insurance < 10.00, 'El seguro porcentual debe decrecer con el saldo');
      assert.strictEqual(lastRow.remainingBalance, 0.00);
      assert.strictEqual(result.totalPrincipal, 10000.00);
    });
  });

  describe('Test 4: Caso límite con tasa 0% de interés', () => {
    it('Calcula sin intereses: cuota pura igual a capital/plazo + cargos', () => {
      const result = calculateLoanSimulation({
        amount: 12000,
        annualRate: 0,
        term: 12,
        frequency: 'monthly',
        system: 'frances',
        insuranceType: 'fixed',
        insuranceValue: 10,
        otherCosts: 5,
      });

      assert.strictEqual(result.totalInterest, 0.00);
      assert.strictEqual(result.baseInstallment, 1000.00);
      assert.strictEqual(result.estimatedInstallment, 1015.00); // 1000 + 10 + 5
      assert.strictEqual(result.totalPrincipal, 12000.00);
      assert.strictEqual(result.schedule[11].remainingBalance, 0.00);

      // Todas las cuotas deben tener interés 0 y principal 1000
      for (const row of result.schedule) {
        assert.strictEqual(row.interest, 0.00);
        assert.strictEqual(row.principal, 1000.00);
        assert.strictEqual(row.paymentAmount, 1015.00);
      }
    });
  });

  describe('Test 5: Caso límite con plazo de 1 sola cuota', () => {
    it('Liquida todo el capital en la única cuota con saldo final en 0.00', () => {
      const result = calculateLoanSimulation({
        amount: 5000,
        annualRate: 12,
        term: 1,
        frequency: 'monthly',
        system: 'frances',
        insuranceType: 'fixed',
        insuranceValue: 15,
        otherCosts: 5,
      });

      assert.strictEqual(result.schedule.length, 1);
      const singleRow = result.schedule[0];
      assert.strictEqual(singleRow.installmentNumber, 1);
      assert.strictEqual(singleRow.principal, 5000.00);
      assert.strictEqual(singleRow.remainingBalance, 0.00);
      assert.strictEqual(result.totalPrincipal, 5000.00);
      assert.strictEqual(singleRow.insurance, 15.00);
      assert.strictEqual(singleRow.otherCosts, 5.00);
    });
  });

  describe('Test 6: Validaciones defensivas contra entradas inválidas', () => {
    it('Lanza error si el monto es <= 0 o NaN', () => {
      assert.throws(() => {
        calculateLoanSimulation({
          amount: 0,
          annualRate: 10,
          term: 12,
        });
      }, /El monto del préstamo debe ser un número mayor a cero/);

      assert.throws(() => {
        calculateLoanSimulation({
          amount: -5000,
          annualRate: 10,
          term: 12,
        });
      }, /El monto del préstamo debe ser un número mayor a cero/);

      assert.throws(() => {
        calculateLoanSimulation({
          amount: NaN,
          annualRate: 10,
          term: 12,
        });
      }, /El monto del préstamo debe ser un número mayor a cero/);
    });

    it('Lanza error si el plazo es < 1 o no entero', () => {
      assert.throws(() => {
        calculateLoanSimulation({
          amount: 10000,
          annualRate: 10,
          term: 0,
        });
      }, /El plazo del préstamo debe ser un número entero de al menos 1 cuota/);

      assert.throws(() => {
        calculateLoanSimulation({
          amount: 10000,
          annualRate: 10,
          term: 2.5,
        });
      }, /El plazo del préstamo debe ser un número entero de al menos 1 cuota/);
    });

    it('Lanza error si la tasa es negativa', () => {
      assert.throws(() => {
        calculateLoanSimulation({
          amount: 10000,
          annualRate: -5,
          term: 12,
        });
      }, /La tasa de interés no puede ser un número negativo/);
    });
  });

  describe('Test 7: Periodicidades alternativas (Quincenal y Trimestral)', () => {
    it('Calcula correctamente para periodicidad quincenal', () => {
      const result = calculateLoanSimulation({
        amount: 10000,
        annualRate: 12,
        term: 24, // 24 quincenas (1 año)
        frequency: 'biweekly',
        system: 'frances',
      });

      assert.strictEqual(result.schedule.length, 24);
      assert.strictEqual(result.totalPrincipal, 10000.00);
      assert.strictEqual(result.schedule[23].remainingBalance, 0.00);
      assert.strictEqual(result.frequency, 'biweekly');
    });

    it('Calcula correctamente para periodicidad trimestral', () => {
      const result = calculateLoanSimulation({
        amount: 20000,
        annualRate: 15,
        term: 8, // 8 trimestres (2 años)
        frequency: 'quarterly',
        system: 'frances',
      });

      assert.strictEqual(result.schedule.length, 8);
      assert.strictEqual(result.totalPrincipal, 20000.00);
      assert.strictEqual(result.schedule[7].remainingBalance, 0.00);
      assert.strictEqual(result.frequency, 'quarterly');
    });
  });

});
