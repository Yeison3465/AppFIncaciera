import { PasswordValidationState } from '../types/auth';

/**
 * Valida si un string cumple el formato de correo electrónico.
 */
export function checkEmailFormat(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Lista negra de contraseñas excesivamente comunes y predecibles.
 */
const COMMON_PASSWORDS = new Set([
  '12345678',
  '123456789',
  '1234567890',
  '87654321',
  '11111111',
  '00000000',
  'password',
  'password123',
  'admin123',
  'admin1234',
  'qwerty123',
  'qwertyuiop',
  'abc12345',
  'contrasena',
  'contraseña',
  'iloveyou',
  'welcome1',
]);

/**
 * Verifica si un texto es una secuencia simple (ascendente o descendente) de números o letras.
 */
function isSequential(str: string): boolean {
  if (str.length < 4) return false;
  let isAscending = true;
  let isDescending = true;
  for (let i = 1; i < str.length; i++) {
    const diff = str.charCodeAt(i) - str.charCodeAt(i - 1);
    if (diff !== 1) isAscending = false;
    if (diff !== -1) isDescending = false;
  }
  return isAscending || isDescending;
}

/**
 * Verifica si todos los caracteres son repetidos (ej. '11111111', 'aaaaaaaa').
 */
function isRepeatedChars(str: string): boolean {
  if (str.length < 4) return false;
  return /^(\w)\1+$/.test(str);
}

/**
 * Evalúa la robustez de una contraseña devolviendo el estado de validación y puntaje (0 a 4).
 * Criterios bancarios de seguridad:
 * - Nivel 0 (idle): Pendiente
 * - Nivel 1 (weak): Débil (longitud < 8, secuencias como 12345678, solo números o solo letras)
 * - Nivel 2 (medium): Media (8+ caracteres, combinación de letras con números o símbolos)
 * - Nivel 3 (secure): Segura (8+ caracteres, combinación de letras y números)
 * - Nivel 4 (strong): Fuerte (10+ caracteres, combinación completa de letras, números y símbolos)
 */
export function calculatePasswordStrength(password: string): PasswordValidationState {
  if (!password || password.length === 0) {
    return {
      score: 0,
      level: 'idle',
      label: 'Pendiente',
      hasLength: false,
      hasNumber: false,
      hasSpecialChar: false,
    };
  }

  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isOnlyNumbers = /^\d+$/.test(password);
  const isOnlyLetters = /^[a-zA-Z]+$/.test(password);

  const lower = password.toLowerCase();
  const isCommon =
    COMMON_PASSWORDS.has(lower) ||
    isSequential(password) ||
    isRepeatedChars(password);

  let score = 1;
  let level: PasswordValidationState['level'] = 'weak';
  let label = 'Débil';
  let feedback = 'La robustez de la contraseña es demasiado baja.';

  if (!hasLength) {
    score = 1;
    level = 'weak';
    label = 'Débil';
    feedback = 'La contraseña debe contener al menos 8 caracteres.';
  } else if (isCommon) {
    score = 1;
    level = 'weak';
    label = 'Débil';
    feedback = 'La contraseña es muy común o predecible. Evita secuencias obvias.';
  } else if (isOnlyNumbers) {
    score = 1;
    level = 'weak';
    label = 'Débil';
    feedback = 'La contraseña no puede estar compuesta solo de números. Combina con letras y símbolos.';
  } else if (isOnlyLetters) {
    score = 1;
    level = 'weak';
    label = 'Débil';
    feedback = 'La contraseña no puede contener solo letras. Agrega números o símbolos.';
  } else if (hasLength && hasNumber && hasLetter && hasSpecialChar && password.length >= 10) {
    score = 4;
    level = 'strong';
    label = 'Fuerte';
    feedback = 'Contraseña robusta y altamente segura.';
  } else if (hasLength && hasNumber && hasLetter && (hasSpecialChar || password.length >= 8)) {
    score = 3;
    level = 'secure';
    label = 'Segura';
    feedback = 'Contraseña segura con buena combinación.';
  } else if (hasLength && (hasNumber || hasSpecialChar) && hasLetter) {
    score = 2;
    level = 'medium';
    label = 'Media';
    feedback = 'Contraseña aceptable. Agrega símbolos especiales para mayor seguridad.';
  } else {
    score = 1;
    level = 'weak';
    label = 'Débil';
    feedback = 'La robustez es baja. Combina letras mayúsculas, minúsculas, números y símbolos.';
  }

  return {
    score,
    level,
    label,
    hasLength,
    hasNumber,
    hasSpecialChar,
    feedback,
  };
}

/**
 * Valida el rango legal de edad bancaria (18 a 99 años).
 */
export function validateAgeRange(age: number): boolean {
  return Number.isInteger(age) && age >= 18 && age <= 99;
}

/**
 * Valida si la contraseña y su confirmación coinciden exactamente.
 */
export function checkPasswordsMatch(password: string, confirmPassword: string): boolean {
  if (!password || !confirmPassword) return false;
  return password === confirmPassword;
}
