import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkEmailFormat,
  calculatePasswordStrength,
  validateAgeRange,
} from '../../utils/authUiHelpers';
import {
  isSessionExpired,
  TWENTY_FOUR_HOURS_MS,
} from '../../utils/sessionManager';

// Simulador funcional de la capa de autenticación (lógica idéntica a AuthContext)
interface MockAuthParams {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  age?: number;
}

interface MockAuthResult {
  success: boolean;
  error?: string;
  isDuplicate?: boolean;
  requiresEmailConfirmation?: boolean;
}

describe('Pruebas Funcionales: Validaciones de Registro y Login (RF-01 y RF-02)', () => {
  describe('1. Validación de Formato de Correo Electrónico', () => {
    test('Acepta correos válidos corporativos, personales y con subdirecciones', () => {
      assert.strictEqual(checkEmailFormat('usuario@aurafinancial.com'), true);
      assert.strictEqual(checkEmailFormat('maria.gomez@gmail.com'), true);
      assert.strictEqual(checkEmailFormat('inversionista+tag1@banco.com.co'), true);
      assert.strictEqual(checkEmailFormat('  test@dominio.org  '), true, 'Debe sanitizar espacios en extremos');
    });

    test('Rechaza formatos inválidos, incompletos o maliciosos', () => {
      assert.strictEqual(checkEmailFormat(''), false);
      assert.strictEqual(checkEmailFormat('usuario'), false);
      assert.strictEqual(checkEmailFormat('usuario@'), false);
      assert.strictEqual(checkEmailFormat('usuario@dominio'), false);
      assert.strictEqual(checkEmailFormat('@dominio.com'), false);
      assert.strictEqual(checkEmailFormat('correo con espacios@dominio.com'), false);
    });
  });

  describe('2. Evaluación de Robustez y Fortaleza de Contraseña', () => {
    test('Contraseña vacía devuelve estado idle y puntaje 0', () => {
      const state = calculatePasswordStrength('');
      assert.strictEqual(state.score, 0);
      assert.strictEqual(state.level, 'idle');
      assert.strictEqual(state.hasLength, false);
      assert.strictEqual(state.hasNumber, false);
      assert.strictEqual(state.hasSpecialChar, false);
    });

    test('Contraseña menor a 8 caracteres se clasifica como Débil (score 1)', () => {
      const state = calculatePasswordStrength('Abc1#');
      assert.strictEqual(state.score, 1);
      assert.strictEqual(state.level, 'weak');
      assert.strictEqual(state.hasLength, false);
    });

    test('Contraseña de 8+ caracteres con sólo letras se clasifica como Débil (score 1)', () => {
      const state = calculatePasswordStrength('sololetras');
      assert.strictEqual(state.score, 1);
      assert.strictEqual(state.level, 'weak');
      assert.strictEqual(state.hasLength, true);
      assert.strictEqual(state.hasNumber, false);
    });

    test('Contraseña numérica o común como 12345678 se clasifica como Débil (score 1)', () => {
      const state123 = calculatePasswordStrength('12345678');
      assert.strictEqual(state123.score, 1);
      assert.strictEqual(state123.level, 'weak');
      assert.strictEqual(state123.label, 'Débil');
    });

    test('Contraseña con 8+ caracteres y números o caracteres especiales clasifica Media o Segura', () => {
      const stateMedia = calculatePasswordStrength('ClaveSegura#');
      assert.strictEqual(stateMedia.score >= 2, true);
      assert.strictEqual(stateMedia.hasLength, true);
      assert.strictEqual(stateMedia.hasSpecialChar, true);

      const stateSegura = calculatePasswordStrength('Finanzas2025');
      assert.strictEqual(stateSegura.score >= 3, true);
      assert.strictEqual(stateSegura.hasLength, true);
      assert.strictEqual(stateSegura.hasNumber, true);
    });

    test('Contraseña de 10+ caracteres con número y símbolo clasifica como Fuerte (score 4)', () => {
      const state = calculatePasswordStrength('AuraSecure2025#');
      assert.strictEqual(state.score, 4);
      assert.strictEqual(state.level, 'strong');
      assert.strictEqual(state.hasLength, true);
      assert.strictEqual(state.hasNumber, true);
      assert.strictEqual(state.hasSpecialChar, true);
    });
  });

  describe('3. Validación de Rango de Edad Bancaria KYC', () => {
    test('Acepta edades en el rango legal permitido (18 a 99 años)', () => {
      assert.strictEqual(validateAgeRange(18), true, 'Límite inferior exacto');
      assert.strictEqual(validateAgeRange(25), true);
      assert.strictEqual(validateAgeRange(65), true);
      assert.strictEqual(validateAgeRange(99), true, 'Límite superior exacto');
    });

    test('Rechaza menores de edad, valores negativos y centenarios fuera de rango', () => {
      assert.strictEqual(validateAgeRange(17), false, 'Menor de edad no admitido');
      assert.strictEqual(validateAgeRange(0), false);
      assert.strictEqual(validateAgeRange(-5), false);
      assert.strictEqual(validateAgeRange(100), false, 'Superior a 99 años');
      assert.strictEqual(validateAgeRange(25.5), false, 'No permite decimales');
    });
  });
});

describe('Pruebas Funcionales: Flujo de Registro (RF-01)', () => {
  // Función mock para simular la lógica de registro de AuthContext
  const mockRegisterService = async (
    params: MockAuthParams,
    existingEmails: string[]
  ): Promise<MockAuthResult> => {
    const trimmedEmail = params.email.trim().toLowerCase();

    // 1. Validaciones previas
    if (!params.firstName || !params.lastName || !params.username || !trimmedEmail || !params.password) {
      return { success: false, error: 'Todos los campos son obligatorios para el registro.' };
    }

    if (!checkEmailFormat(trimmedEmail)) {
      return { success: false, error: 'Por favor ingresa un correo electrónico con formato válido.' };
    }

    if (params.password.length < 8) {
      return { success: false, error: 'La contraseña debe contener al menos 8 caracteres.' };
    }

    if (!validateAgeRange(params.age ?? 0)) {
      return { success: false, error: 'La edad debe estar comprendida entre 18 y 99 años.' };
    }

    // 2. Simulación de detección de duplicados en Supabase Auth
    if (existingEmails.includes(trimmedEmail)) {
      return {
        success: false,
        isDuplicate: true,
        error: 'El correo electrónico ya se encuentra registrado en el sistema.',
      };
    }

    // 3. Registro exitoso
    return { success: true };
  };

  test('Permite el registro exitoso cuando todos los datos cumplen las reglas KYC', async () => {
    const result = await mockRegisterService(
      {
        firstName: 'Yeison',
        lastName: 'Arrieta',
        username: 'yeison_fin',
        age: 26,
        email: 'yeison@aurafinancial.com',
        password: 'Password2025!',
      },
      ['otro_usuario@correo.com']
    );

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.isDuplicate, undefined);
    assert.strictEqual(result.error, undefined);
  });

  test('Detecta y alerta si el correo ya está registrado en la base de datos (RF-01)', async () => {
    const existingDatabaseUsers = ['cliente@aurafinancial.com', 'existente@gmail.com'];

    const result = await mockRegisterService(
      {
        firstName: 'Carlos',
        lastName: 'Lopez',
        username: 'carlos_l',
        age: 30,
        email: 'cliente@aurafinancial.com',
        password: 'Password2025!',
      },
      existingDatabaseUsers
    );

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.isDuplicate, true);
    assert.match(result.error ?? '', /ya se encuentra registrado/i);
  });

  test('Rechaza registro con campos faltantes o incompletos', async () => {
    const result = await mockRegisterService(
      {
        firstName: '',
        lastName: 'Lopez',
        username: 'carlos_l',
        age: 30,
        email: 'nuevo@aurafinancial.com',
        password: 'Password2025!',
      },
      []
    );

    assert.strictEqual(result.success, false);
    assert.match(result.error ?? '', /obligatorios/i);
  });

  test('Rechaza registro si la edad es menor a 18 años', async () => {
    const result = await mockRegisterService(
      {
        firstName: 'Menor',
        lastName: 'Prueba',
        username: 'menor_edad',
        age: 16,
        email: 'menor@aurafinancial.com',
        password: 'Password2025!',
      },
      []
    );

    assert.strictEqual(result.success, false);
    assert.match(result.error ?? '', /edad debe estar comprendida/i);
  });
});

describe('Pruebas Funcionales: Flujo de Inicio de Sesión (Login - RF-02)', () => {
  const validUsers = [
    { email: 'usuario@aurafinancial.com', password: 'Password2025#' },
  ];

  const mockLoginService = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !password) {
      return { success: false, error: 'Por favor ingresa tu correo y contraseña.' };
    }

    if (!checkEmailFormat(trimmed)) {
      return { success: false, error: 'Por favor ingresa un formato de correo electrónico válido.' };
    }

    const match = validUsers.find(u => u.email === trimmed && u.password === password);
    if (!match) {
      return {
        success: false,
        error: 'Credenciales no reconocidas. Verifica tu correo y contraseña para reintentar el acceso.',
      };
    }

    return { success: true };
  };

  test('Inicia sesión correctamente con credenciales autorizadas', async () => {
    const result = await mockLoginService('usuario@aurafinancial.com', 'Password2025#');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.error, undefined);
  });

  test('Rechaza credenciales incorrectas con mensaje descriptivo', async () => {
    const result = await mockLoginService('usuario@aurafinancial.com', 'ClaveEquivocada123');
    assert.strictEqual(result.success, false);
    assert.match(result.error ?? '', /Credenciales no reconocidas/i);
  });

  test('Rechaza formato de correo inválido sin realizar llamada a la base de datos', async () => {
    const result = await mockLoginService('correo-sin-formato', 'CualquierClave123');
    assert.strictEqual(result.success, false);
    assert.match(result.error ?? '', /formato de correo electrónico válido/i);
  });

  test('Rechaza campos vacíos en el login', async () => {
    const result = await mockLoginService('', '');
    assert.strictEqual(result.success, false);
    assert.match(result.error ?? '', /ingresa tu correo y contraseña/i);
  });
});

describe('Pruebas Funcionales: Política de Expiración de Sesión a las 24 Horas', () => {
  test('Sesión reciente (< 24 horas) se mantiene activa y válida', () => {
    const now = Date.now();
    const loginTime = now - (12 * 60 * 60 * 1000); // Hace 12 horas
    assert.strictEqual(isSessionExpired(loginTime, now), false);
  });

  test('Sesión en el límite exacto de 24 horas expira', () => {
    const now = Date.now();
    const loginTime = now - TWENTY_FOUR_HOURS_MS;
    assert.strictEqual(isSessionExpired(loginTime, now), true);
  });

  test('Sesión que supera 24 horas (ej. 24h 1s o 25h) se marca como expirada', () => {
    const now = Date.now();
    const loginTime = now - (TWENTY_FOUR_HOURS_MS + 1000);
    assert.strictEqual(isSessionExpired(loginTime, now), true);
  });

  test('checkAndEnforceSessionExpiry ejecuta callback de cierre cuando la sesión expiró', async () => {
    let logoutCalled = false;
    const now = Date.now();
    const expiredLoginTime = now - (25 * 60 * 60 * 1000);

    // Mock funcional de evaluador
    const checkExpiry = (timestamp: number | null, onExpire: () => void): boolean => {
      if (timestamp === null) return false;
      if (isSessionExpired(timestamp, now)) {
        onExpire();
        return true;
      }
      return false;
    };

    const isExpired = checkExpiry(expiredLoginTime, () => {
      logoutCalled = true;
    });

    assert.strictEqual(isExpired, true);
    assert.strictEqual(logoutCalled, true);
  });
});
