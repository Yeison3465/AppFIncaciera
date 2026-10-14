import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import {
  saveSessionLoginTime,
  clearSessionLoginTime,
  checkAndEnforceSessionExpiry,
} from '../utils/sessionManager';

export interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  age: number;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  isDuplicate?: boolean;
  requiresEmailConfirmation?: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isExpiredSession: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (params: RegisterParams) => Promise<AuthResult>;
  logout: () => Promise<void>;
  clearExpiredAlert: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExpiredSession, setIsExpiredSession] = useState<boolean>(false);

  const clearExpiredAlert = useCallback(() => {
    setIsExpiredSession(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignorar errores de red al cerrar sesión
    } finally {
      await clearSessionLoginTime();
      setSession(null);
      setUser(null);
    }
  }, []);

  // Función para comprobar si se cumplieron las 24 horas de sesión
  const verifySessionTimeout = useCallback(async () => {
    const expired = await checkAndEnforceSessionExpiry(async () => {
      await logout();
      setIsExpiredSession(true);
    });
    return expired;
  }, [logout]);

  // Inicialización de la sesión
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[AuthContext] Error al obtener sesión inicial:', error);
        }

        if (data.session) {
          const expired = await verifySessionTimeout();
          if (!expired && mounted) {
            setSession(data.session);
            setUser(data.session.user);
          }
        }
      } catch (err) {
        console.error('[AuthContext] Error inesperado en init:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Escucha de cambios de estado en Supabase Auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && newSession) {
          setSession(newSession);
          setUser(newSession.user);
          setIsExpiredSession(false);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          await clearSessionLoginTime();
        } else if (event === 'TOKEN_REFRESHED' && newSession) {
          const expired = await verifySessionTimeout();
          if (!expired) {
            setSession(newSession);
            setUser(newSession.user);
          }
        }
      }
    );

    // Escucha del ciclo de vida de la aplicación móvil (Background -> Foreground)
    const appStateSub = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (nextState === 'active') {
          verifySessionTimeout();
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
      appStateSub.remove();
    };
  }, [verifySessionTimeout]);

  // Inicio de Sesión
  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.session) {
        await saveSessionLoginTime(Date.now());
        setSession(data.session);
        setUser(data.user);
        setIsExpiredSession(false);
        return { success: true };
      }

      return {
        success: false,
        error: 'No se pudo iniciar sesión. Por favor verifica tus credenciales.',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido al iniciar sesión';
      return { success: false, error: message };
    }
  };

  // Registro de Nuevo Usuario
  const register = async (params: RegisterParams): Promise<AuthResult> => {
    try {
      const trimmedEmail = params.email.trim().toLowerCase();
      const fullName = `${params.firstName.trim()} ${params.lastName.trim()}`.trim();

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: params.password,
        options: {
          data: {
            nombre: fullName || trimmedEmail.split('@')[0],
            first_name: params.firstName.trim(),
            last_name: params.lastName.trim(),
            username: params.username.trim(),
            age: params.age,
          },
        },
      });

      if (error) {
        const errorMsg = error.message.toLowerCase();
        const isDuplicate =
          errorMsg.includes('already registered') ||
          errorMsg.includes('already exists') ||
          errorMsg.includes('user with this email') ||
          error.status === 422;

        return {
          success: false,
          error: isDuplicate
            ? 'El correo electrónico ya se encuentra registrado en el sistema.'
            : error.message,
          isDuplicate,
        };
      }

      // En Supabase con confirmación de correo activa, un correo ya existente
      // retorna un objeto usuario con array identities vacío
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return {
          success: false,
          isDuplicate: true,
          error: 'El correo electrónico ya se encuentra registrado en el sistema.',
        };
      }

      // Si Supabase otorgó sesión directa inmediatamente
      if (data.session) {
        await saveSessionLoginTime(Date.now());
        setSession(data.session);
        setUser(data.user);
        setIsExpiredSession(false);
        return { success: true };
      }

      // Si no retornó sesión directa (por ej. si requiriera confirmación), intentar auto-login
      const autoLogin = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: params.password,
      });

      if (autoLogin.data.session) {
        await saveSessionLoginTime(Date.now());
        setSession(autoLogin.data.session);
        setUser(autoLogin.data.user);
        setIsExpiredSession(false);
        return { success: true };
      }

      // Si requiere confirmación por correo previa
      return {
        success: true,
        requiresEmailConfirmation: true,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido en el registro';
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isExpiredSession,
        login,
        register,
        logout,
        clearExpiredAlert,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
