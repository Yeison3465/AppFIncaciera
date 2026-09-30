/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateCompoundInterest } from '../compoundInterest';

describe('Motor Financiero Puro: calculateCompoundInterest (RF-05)', () => {
  const principal = 10000;
  const rate = 9.8; // 9.8% nominal anual / E.A.

  describe('Criterios de Aceptación: Capitalización Anual', () => {
    it('1 Día: Interés ≈ $2.60 - $2.72 (VF ≈ $10.002,60 - $10.002,72) y NUNCA $980.00', () => {
      const result = calculateCompoundInterest({
        initialDeposit: principal,
        annualEffectiveRate: rate,
        compoundingFrequency: 'annual',
        term: 1,
        termUnit: 'days',
        periodicDeposit: 0,
        includePeriodicDeposit: false,
      });

      assert.notStrictEqual(result.totalInterestEarned, 980.00, 'El interés NUNCA debe ser 980.00 para 1 día');
      assert.strictEqual(result.futureValue, 10002.60);
      assert.strictEqual(result.totalInterestEarned, 2.60);
      assert.ok(result.totalInterestEarned >= 2.60 && result.totalInterestEarned <= 2.72);
      assert.strictEqual(result.breakdown.length, 1);
      assert.strictEqual(result.breakdown[0].endingBalance, 10002.60);
    });

    it('1 Mes: Interés fraccionario continuo (≈ $78.21 - $81.67, VF ≈ $10.078,21) y NUNCA $980.00', () => {
      const result = calculateCompoundInterest({
        initialDeposit: principal,
        annualEffectiveRate: rate,
        compoundingFrequency: 'annual',
        term: 1,
        termUnit: 'months',
        periodicDeposit: 0,
        includePeriodicDeposit: false,
      });

      assert.notStrictEqual(result.totalInterestEarned, 980.00, 'El interés NUNCA debe ser 980.00 para 1 mes');
      assert.strictEqual(result.futureValue, 10078.21);
      assert.strictEqual(result.totalInterestEarned, 78.21);
      // Validar que está cerca de la cota superior lineal de 81.67 y nunca en 980
      assert.ok(Math.abs(result.totalInterestEarned - 81.67) < 5.0, 'Debe aproximarse al benchmark mensual');
      assert.strictEqual(result.breakdown.length, 1);
      assert.strictEqual(result.breakdown[0].endingBalance, 10078.21);
    });

    it('1 Año: Interés exacto = $980.00 (VF = $10.980,00)', () => {
      const result = calculateCompoundInterest({
        initialDeposit: principal,
        annualEffectiveRate: rate,
        compoundingFrequency: 'annual',
        term: 1,
        termUnit: 'years',
        periodicDeposit: 0,
        includePeriodicDeposit: false,
      });

      assert.strictEqual(result.futureValue, 10980.00);
      assert.strictEqual(result.totalInterestEarned, 980.00);
      assert.strictEqual(result.breakdown.length, 1);
      assert.strictEqual(result.breakdown[0].endingBalance, 10980.00);
    });
  });

  describe('Criterios de Aceptación: Capitalización Trimestral', () => {
    it('1 Día: Interés ≈ $2.68 - $2.72 (VF ≈ $10.002,69 - $10.002,72) y NUNCA $245.00', () => {
      const result = calculateCompoundInterest({
        initialDeposit: principal,
        annualEffectiveRate: rate,
        compoundingFrequency: 'quarterly',
        term: 1,
        termUnit: 'days',
        periodicDeposit: 0,
        includePeriodicDeposit: false,
      });

      assert.notStrictEqual(result.totalInterestEarned, 245.00, 'El interés NUNCA debe ser 245.00 para 1 día');
      assert.strictEqual(result.futureValue, 10002.69);
      assert.strictEqual(result.totalInterestEarned, 2.69);
      assert.ok(result.totalInterestEarned >= 2.68 && result.totalInterestEarned <= 2.72);
    });

    it('1 Mes: Interés fraccionario continuo = $81.01 (≈ $81.67, VF = $10.081,01) y NUNCA $245.00', () => {
      const result = calculateCompoundInterest({
        initialDeposit: principal,
        annualEffectiveRate: rate,
        compoundingFrequency: 'quarterly',
        term: 1,
        termUnit: 'months',
        periodicDeposit: 0,
        includePeriodicDeposit: false,
      });

      assert.notStrictEqual(result.totalInterestEarned, 245.00, 'El interés NUNCA debe ser 245.00 para 1 mes');
      assert.strictEqual(result.futureValue, 10081.01);
      assert.strictEqual(result.totalInterestEarned, 81.01);
      assert.ok(Math.abs(result.totalInterestEarned - 81.67) < 1.0, 'Debe aproximarse al benchmark mensual');
    });

    it('1 Año: Interés exacto = $1.016,61 (VF = $11.016,61)', () => {
      const result = calculateCompoundInterest({
        initialDeposit: principal,
        annualEffectiveRate: rate,
        compoundingFrequency: 'quarterly',
        term: 1,
        termUnit: 'years',
        periodicDeposit: 0,
        includePeriodicDeposit: false,
      });

      assert.strictEqual(result.futureValue, 11016.61);
      assert.strictEqual(result.totalInterestEarned, 1016.61);
      assert.strictEqual(result.breakdown.length, 4);
      assert.strictEqual(result.breakdown[3].endingBalance, 11016.61);
    });
  });

  describe('Criterios de Aceptación: Capitalización Mensual', () => {
    it('1 Día: Interés ≈ $2.68 - $2.72 (VF = $10.002,71) y NUNCA $81.67', () => {
      const result = calculateCompoundInterest({
        initialDeposit: principal,
        annualEffectiveRate: rate,
        compoundingFrequency: 'monthly',
        term: 1,
        termUnit: 'days',
        periodicDeposit: 0,
        includePeriodicDeposit: false,
      });

      assert.notStrictEqual(result.totalInterestEarned, 81.67, 'El interés NUNCA debe ser 81.67 para 1 día');
      assert.strictEqual(result.futureValue, 10002.71);
      assert.strictEqual(result.totalInterestEarned, 2.71);
      assert.ok(result.totalInterestEarned >= 2.68 && result.totalInterestEarned <= 2.72);
    });

    it('1 Mes: Interés exacto = $81.67 (VF = $10.081,67)', () => {
      const result = calculateCompoundInterest({
        initialDeposit: principal,
        annualEffectiveRate: rate,
        compoundingFrequency: 'monthly',
        term: 1,
        termUnit: 'months',
        periodicDeposit: 0,
        includePeriodicDeposit: false,
      });

      assert.strictEqual(result.futureValue, 10081.67);
      assert.strictEqual(result.totalInterestEarned, 81.67);
      assert.strictEqual(result.breakdown.length, 1);
      assert.strictEqual(result.breakdown[0].endingBalance, 10081.67);
    });

    it('1 Año: Interés exacto = $1.025,24 (VF = $11.025,24)', () => {
      const result = calculateCompoundInterest({
        initialDeposit: principal,
        annualEffectiveRate: rate,
        compoundingFrequency: 'monthly',
        term: 1,
        termUnit: 'years',
        periodicDeposit: 0,
        includePeriodicDeposit: false,
      });

      assert.strictEqual(result.futureValue, 11025.24);
      assert.strictEqual(result.totalInterestEarned, 1025.24);
      assert.strictEqual(result.breakdown.length, 12);
      assert.strictEqual(result.breakdown[11].endingBalance, 11025.24);
    });
  });

  describe('Casos Borde y Validaciones Defensivas', () => {
    it('Plazo 0 retorna balance inicial con 0 interés', () => {
      const result = calculateCompoundInterest({
        initialDeposit: 5000,
        annualEffectiveRate: 12,
        compoundingFrequency: 'monthly',
        term: 0,
        termUnit: 'years',
        periodicDeposit: 0,
        includePeriodicDeposit: false,
      });

      assert.strictEqual(result.futureValue, 5000);
      assert.strictEqual(result.totalInterestEarned, 0);
      assert.strictEqual(result.breakdown.length, 1);
      assert.strictEqual(result.breakdown[0].label, 'Inicio (Año 0)');
    });

    it('Tasa 0% no genera interés acumulado', () => {
      const result = calculateCompoundInterest({
        initialDeposit: 5000,
        annualEffectiveRate: 0,
        compoundingFrequency: 'monthly',
        term: 2,
        termUnit: 'years',
        periodicDeposit: 0,
        includePeriodicDeposit: false,
      });

      assert.strictEqual(result.futureValue, 5000);
      assert.strictEqual(result.totalInterestEarned, 0);
    });

    it('Lanza error si el depósito inicial es negativo', () => {
      assert.throws(() => {
        calculateCompoundInterest({
          initialDeposit: -100,
          annualEffectiveRate: 10,
          compoundingFrequency: 'monthly',
          term: 1,
          termUnit: 'years',
          periodicDeposit: 0,
          includePeriodicDeposit: false,
        });
      }, /El depósito inicial no puede ser negativo/);
    });

    it('Lanza error si la tasa es negativa', () => {
      assert.throws(() => {
        calculateCompoundInterest({
          initialDeposit: 1000,
          annualEffectiveRate: -5,
          compoundingFrequency: 'monthly',
          term: 1,
          termUnit: 'years',
          periodicDeposit: 0,
          includePeriodicDeposit: false,
        });
      }, /La tasa efectiva anual no puede ser negativa/);
    });

    it('Lanza error si el plazo es negativo', () => {
      assert.throws(() => {
        calculateCompoundInterest({
          initialDeposit: 1000,
          annualEffectiveRate: 10,
          compoundingFrequency: 'monthly',
          term: -1,
          termUnit: 'years',
          periodicDeposit: 0,
          includePeriodicDeposit: false,
        });
      }, /El plazo de tiempo no puede ser negativo/);
    });
  });

  describe('Aportes Periódicos (Anualidades continuas y discretas)', () => {
    it('Calcula correctamente aportes mensuales vencidos (timing: end)', () => {
      const result = calculateCompoundInterest({
        initialDeposit: 1000,
        annualEffectiveRate: 12,
        compoundingFrequency: 'monthly',
        term: 1,
        termUnit: 'years',
        periodicDeposit: 100,
        includePeriodicDeposit: true,
        depositTiming: 'end',
      });

      // 1000 * (1 + 0.01)^12 + 100 * ((1.01^12 - 1) / 0.01) = 1126.825 + 1268.25 = 2395.08
      assert.strictEqual(result.initialDeposit, 1000);
      assert.strictEqual(result.totalPrincipalContributed, 2200);
      assert.strictEqual(result.futureValue, 2395.08);
      assert.strictEqual(result.totalInterestEarned, 195.08);
    });

    it('Calcula correctamente aportes mensuales anticipados (timing: beginning)', () => {
      const result = calculateCompoundInterest({
        initialDeposit: 1000,
        annualEffectiveRate: 12,
        compoundingFrequency: 'monthly',
        term: 1,
        termUnit: 'years',
        periodicDeposit: 100,
        includePeriodicDeposit: true,
        depositTiming: 'beginning',
      });

      // 1000 * 1.01^12 + 100 * ((1.01^12 - 1) / 0.01) * 1.01 = 1126.825 + 1280.93 = 2407.76
      assert.strictEqual(result.initialDeposit, 1000);
      assert.strictEqual(result.totalPrincipalContributed, 2200);
      assert.strictEqual(result.futureValue, 2407.76);
      assert.strictEqual(result.totalInterestEarned, 207.76);
    });
  });
});
