import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthTabMode } from '../../types/auth';
import { useToast } from '../../context/ToastContext';
import {
  AuthHeader,
  AuthSegmentedPill,
  LoginForm,
  RegisterForm,
} from './components';

interface AuthScreenProps {
  initialMode?: AuthTabMode;
  onNavigateHome?: () => void;
}

/**
 * Pantalla Principal de Autenticación y Registro (Aura Financial V2.5 / Stitch 1:1)
 * Unifica los requerimientos funcionales RF-01 (Registro) y RF-02 (Inicio de Sesión)
 * en un diseño premium tipo "Banca Digital Exclusiva".
 */
export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  onNavigateHome,
}) => {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthTabMode>(initialMode);
  const [prefilledEmail, setPrefilledEmail] = useState<string>('');
  const { showToast } = useToast();

  const handleSuccessRegister = (email?: string) => {
    if (email) {
      setPrefilledEmail(email);
    }
    setMode('login');
    showToast({
      title: '¡Cuenta creada correctamente!',
      message: 'Se creó la cuenta con éxito. Por favor inicia sesión con tus credenciales.',
      type: 'success',
      duration: 4500,
    });
  };

  return (
    <View
      className="flex-1 bg-[#F7F7F8]"
      style={{
        paddingTop: insets.top > 0 ? insets.top : 12,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7F8" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: insets.bottom + 24,
          }}
        >
          {/* Encabezado: Monograma Aura y Badge Exclusiva */}
          <AuthHeader />

          {/* Selector de Pestaña Segmentado (Login vs Registro) */}
          <AuthSegmentedPill mode={mode} onChangeMode={setMode} />

          {/* Contenedor de Formulario Principal con Keep-Alive */}
          <View className="px-4">
            <View style={{ display: mode === 'login' ? 'flex' : 'none' }}>
              <LoginForm
                initialEmail={prefilledEmail}
                onSuccessLogin={onNavigateHome}
                onSwitchToRegister={() => setMode('register')}
              />
            </View>

            <View style={{ display: mode === 'register' ? 'flex' : 'none' }}>
              <RegisterForm
                onSwitchToLogin={() => setMode('login')}
                onSuccessRegister={handleSuccessRegister}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
