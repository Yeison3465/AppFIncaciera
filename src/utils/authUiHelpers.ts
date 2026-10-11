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
 * Evalúa la robustez de una contraseña devolviendo el estado de validación y puntaje (0 a 4).
 * Replica la lógica y categorías exactas del diseño de Stitch:
 * - Nivel 1: Débil (rojo)
 * - Nivel 2: Media (ámbar)
 * - Nivel 3: Segura (dorado / secondary)
 * - Nivel 4: Fuerte (verde esmeralda)
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
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  let score = 1;
  let level: PasswordValidationState['level'] = 'weak';
  let label = 'Débil';

  if (hasLength && hasNumber && hasSpecialChar && password.length >= 10) {
    score = 4;
    level = 'strong';
    label = 'Fuerte';
  } else if (hasLength && hasNumber && password.length >= 8) {
    score = 3;
    level = 'secure';
    label = 'Segura';
  } else if (hasLength && (hasNumber || hasSpecialChar)) {
    score = 2;
    level = 'medium';
    label = 'Media';
  } else {
    score = 1;
    level = 'weak';
    label = 'Débil';
  }

  return {
    score,
    level,
    label,
    hasLength,
    hasNumber,
    hasSpecialChar,
  };
}

/**
 * Valida el rango legal de edad bancaria (18 a 99 años).
 */
export function validateAgeRange(age: number): boolean {
  return Number.isInteger(age) && age >= 18 && age <= 99;
}
