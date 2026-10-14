import AsyncStorage from '@react-native-async-storage/async-storage';

export const SESSION_LOGIN_TIME_KEY = '@aura_session_login_time';
export const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/**
 * Guarda la marca de tiempo de inicio de sesión actual en AsyncStorage.
 */
export async function saveSessionLoginTime(timestamp: number = Date.now()): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSION_LOGIN_TIME_KEY, timestamp.toString());
  } catch {
    // Ignorar en entornos sin soporte de storage (SSR)
  }
}

/**
 * Recupera la marca de tiempo guardada del inicio de sesión.
 */
export async function getSessionLoginTime(): Promise<number | null> {
  try {
    const value = await AsyncStorage.getItem(SESSION_LOGIN_TIME_KEY);
    if (!value) return null;
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * Función pura para evaluar si una sesión ha superado el tiempo máximo de vida (por defecto 24 horas).
 */
export function isSessionExpired(
  loginTimestamp: number,
  currentTimestamp: number = Date.now(),
  maxAgeMs: number = TWENTY_FOUR_HOURS_MS
): boolean {
  if (!loginTimestamp || loginTimestamp <= 0) return true;
  const elapsed = currentTimestamp - loginTimestamp;
  return elapsed >= maxAgeMs || elapsed < 0; // Si es futuro o superó 24h, es inválido
}

/**
 * Elimina la marca de tiempo de inicio de sesión de AsyncStorage.
 */
export async function clearSessionLoginTime(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SESSION_LOGIN_TIME_KEY);
  } catch {
    // Ignorar en entornos sin soporte de storage (SSR)
  }
}

/**
 * Comprueba si la sesión guardada ha superado las 24 horas y ejecuta la acción de cierre si aplica.
 * Retorna true si la sesión expiró (o no existía marca válida), o false si continúa vigente.
 */
export async function checkAndEnforceSessionExpiry(
  onExpire?: () => Promise<void> | void
): Promise<boolean> {
  const loginTime = await getSessionLoginTime();
  if (loginTime === null) {
    return false; // No hay registro de login pendiente
  }

  const expired = isSessionExpired(loginTime);
  if (expired) {
    await clearSessionLoginTime();
    if (onExpire) {
      await onExpire();
    }
    return true;
  }

  return false;
}
