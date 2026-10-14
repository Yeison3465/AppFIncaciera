/**
 * Tipos y Contratos para Autenticación y Registro - Aura Financial V2.5
 */

export type AuthTabMode = 'login' | 'register';

export type PasswordStrengthLevel = 'idle' | 'weak' | 'medium' | 'secure' | 'strong';

export interface PasswordValidationState {
  score: number; // 0 a 4
  level: PasswordStrengthLevel;
  label: string;
  hasLength: boolean; // >= 8 caracteres
  hasNumber: boolean; // contiene dígitos
  hasSpecialChar: boolean; // contiene símbolos (#, $, %, etc.)
  feedback?: string; // sugerencia o motivo de robustez
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  username: string;
  age: number;
  email: string;
  password: string;
}
