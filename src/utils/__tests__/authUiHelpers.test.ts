import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkEmailFormat,
  calculatePasswordStrength,
  validateAgeRange,
  checkPasswordsMatch,
} from '../authUiHelpers';

describe('Auth UI Helpers - Validaciones de Interfaz y Medidor de Contraseña', () => {
  describe('checkEmailFormat', () => {
    it('reconoce correos válidos institucionales y personales', () => {
      assert.equal(checkEmailFormat('usuario@aurafinancial.com'), true);
      assert.equal(checkEmailFormat('alejandro.morales@banco.org'), true);
      assert.equal(checkEmailFormat('test+tag@gmail.com'), true);
    });

    it('rechaza formatos de correo inválidos o vacíos', () => {
      assert.equal(checkEmailFormat(''), false);
      assert.equal(checkEmailFormat('usuario'), false);
      assert.equal(checkEmailFormat('usuario@'), false);
      assert.equal(checkEmailFormat('@aurafinancial.com'), false);
      assert.equal(checkEmailFormat('usuario@sinpunto'), false);
    });
  });

  describe('calculatePasswordStrength', () => {
    it('retorna estado idle cuando la contraseña está vacía', () => {
      const res = calculatePasswordStrength('');
      assert.equal(res.score, 0);
      assert.equal(res.level, 'idle');
      assert.equal(res.label, 'Pendiente');
      assert.equal(res.hasLength, false);
      assert.equal(res.hasNumber, false);
      assert.equal(res.hasSpecialChar, false);
    });

    it('clasifica como Débil cuando no cumple longitud mínima ni complejidad', () => {
      const res = calculatePasswordStrength('abc');
      assert.equal(res.score, 1);
      assert.equal(res.level, 'weak');
      assert.equal(res.label, 'Débil');
      assert.equal(res.hasLength, false);
    });

    it('clasifica como Débil contraseñas de solo números, secuenciales o comunes como 12345678', () => {
      const resSequential = calculatePasswordStrength('12345678');
      assert.equal(resSequential.score, 1);
      assert.equal(resSequential.level, 'weak');
      assert.equal(resSequential.label, 'Débil');

      const resRepeated = calculatePasswordStrength('11111111');
      assert.equal(resRepeated.score, 1);
      assert.equal(resRepeated.level, 'weak');

      const resCommon = calculatePasswordStrength('password123');
      assert.equal(resCommon.score, 1);
      assert.equal(resCommon.level, 'weak');
    });

    it('clasifica como Media cuando cumple 8 caracteres y números o símbolos', () => {
      const res = calculatePasswordStrength('abcdefgh1');
      assert.equal(res.hasLength, true);
      assert.equal(res.hasNumber, true);
      assert.equal(res.score >= 2, true);
    });

    it('clasifica como Fuerte cuando tiene 10+ caracteres, números y símbolos especiales', () => {
      const res = calculatePasswordStrength('AuraSuperKey2025!#');
      assert.equal(res.score, 4);
      assert.equal(res.level, 'strong');
      assert.equal(res.label, 'Fuerte');
      assert.equal(res.hasLength, true);
      assert.equal(res.hasNumber, true);
      assert.equal(res.hasSpecialChar, true);
    });
  });

  describe('validateAgeRange', () => {
    it('valida edades dentro del rango bancario KYC (18 a 99 años)', () => {
      assert.equal(validateAgeRange(18), true);
      assert.equal(validateAgeRange(28), true);
      assert.equal(validateAgeRange(99), true);
    });

    it('rechaza menores de 18 o mayores de 99 años y decimales', () => {
      assert.equal(validateAgeRange(17), false);
      assert.equal(validateAgeRange(100), false);
      assert.equal(validateAgeRange(0), false);
      assert.equal(validateAgeRange(-5), false);
      assert.equal(validateAgeRange(25.5), false);
    });
  });

  describe('checkPasswordsMatch', () => {
    it('valida cuando ambas contraseñas son idénticas', () => {
      assert.equal(checkPasswordsMatch('Password2025!', 'Password2025!'), true);
      assert.equal(checkPasswordsMatch('Aura123#', 'Aura123#'), true);
    });

    it('rechaza cuando las contraseñas difieren o alguna está vacía', () => {
      assert.equal(checkPasswordsMatch('Password2025!', 'Password2025?'), false);
      assert.equal(checkPasswordsMatch('Password2025!', 'password2025!'), false);
      assert.equal(checkPasswordsMatch('Password2025!', ''), false);
      assert.equal(checkPasswordsMatch('', 'Password2025!'), false);
      assert.equal(checkPasswordsMatch('', ''), false);
    });
  });
});
