import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jfpddodmnbtsafogqats.supabase.co';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_8WrIzH5BIpYhAO70NOhXVw__G3ZhXs3';

/**
 * Adaptador de almacenamiento seguro para SSR y Multiplataforma (iOS, Android, Web).
 * En el renderizado estático/SSR de Expo Router (Node.js para web), `window` no existe,
 * por lo que evitamos acceder a AsyncStorage para no provocar ReferenceError.
 */
const safeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return null;
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Ignorar errores en SSR
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Ignorar errores en SSR
    }
  },
};

/**
 * Cliente centralizado de Supabase configurado con persistencia nativa
 * compatible con React Native, Web y SSR en Expo SDK 57.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
