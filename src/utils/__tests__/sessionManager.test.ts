import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  isSessionExpired,
  TWENTY_FOUR_HOURS_MS,
} from '../sessionManager';

describe('Gestor de Expiración de Sesión de 24 Horas (sessionManager)', () => {
  test('Identifica sesión válida si han pasado menos de 24 horas', () => {
    const loginTime = 1000000;
    const currentTime = loginTime + (23 * 60 * 60 * 1000); // 23 horas después
    assert.strictEqual(isSessionExpired(loginTime, currentTime), false);
  });

  test('Identifica sesión recién creada como válida (0 ms transcurridos)', () => {
    const loginTime = 1000000;
    assert.strictEqual(isSessionExpired(loginTime, loginTime), false);
  });

  test('Expira la sesión exactamente a las 24 horas transcurridas', () => {
    const loginTime = 1000000;
    const currentTime = loginTime + TWENTY_FOUR_HOURS_MS; // Exactamente 24h
    assert.strictEqual(isSessionExpired(loginTime, currentTime), true);
  });

  test('Expira la sesión si han pasado más de 24 horas (ej. 25 horas)', () => {
    const loginTime = 1000000;
    const currentTime = loginTime + (25 * 60 * 60 * 1000);
    assert.strictEqual(isSessionExpired(loginTime, currentTime), true);
  });

  test('Maneja casos anómalos o timestamps inválidos como expirados', () => {
    assert.strictEqual(isSessionExpired(0, 1000), true);
    assert.strictEqual(isSessionExpired(-500, 1000), true);
    // Timestamp en el futuro (reloj alterado del sistema)
    assert.strictEqual(isSessionExpired(2000, 1000), true);
  });
});
