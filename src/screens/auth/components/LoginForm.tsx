import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../../constants/theme';
import { PrimaryButton } from '../../../components';
import { checkEmailFormat } from '../../../utils/authUiHelpers';
import { useAuth } from '../../../context/AuthContext';

interface LoginFormProps {
  onForgotPasswordPress?: () => void;
  onSuccessLogin?: () => void;
  onSwitchToRegister?: () => void;
}

/**
 * Formulario de Inicio de Sesión (RF-02 - Stitch 1:1)
 * Conectado a Supabase Auth y persistencia segura.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onForgotPasswordPress,
  onSuccessLogin,
  onSwitchToRegister,
}) => {
  const { login, isExpiredSession, clearExpiredAlert } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isEmailValid = checkEmailFormat(email);

  const handleDismissAlert = () => {
    setErrorMessage(null);
    clearExpiredAlert();
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    if (!isEmailValid) {
      setErrorMessage('Por favor ingresa un formato de correo electrónico válido.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (onSuccessLogin) {
        onSuccessLogin();
      }
    } else {
      setErrorMessage(
        result.error || 'Credenciales no reconocidas. Verifica tu correo y contraseña para reintentar el acceso.'
      );
    }
  };

  const showAlert = Boolean(errorMessage || isExpiredSession);
  const alertTitle = isExpiredSession ? 'Sesión Expirada (24 Horas)' : 'Acceso no verificado';
  const alertDescription = isExpiredSession
    ? 'Por políticas de seguridad bancaria, tu sesión ha finalizado tras 24 horas. Por favor ingresa nuevamente.'
    : errorMessage;

  return (
    <View className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
      {/* Banner de Alerta / Advertencia de Acceso (RF-02) */}
      {showAlert && (
        <View className="mb-4 p-3.5 rounded-xl bg-[#FEE2E2] flex-row items-start justify-between border border-red-200">
          <View className="flex-row items-start flex-1 mr-2">
            <Ionicons
              name="alert-circle"
              size={20}
              color={AURA_COLORS.redAlert}
              style={{ marginRight: 8, marginTop: 1 }}
            />
            <View className="flex-1">
              <Text className="text-xs font-bold text-red-900">
                {alertTitle}
              </Text>
              <Text className="text-xs text-red-700 leading-4 mt-0.5">
                {alertDescription}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleDismissAlert}
            className="p-1 -mr-1 -mt-1"
          >
            <Ionicons name="close" size={18} color="#991B1B" />
          </TouchableOpacity>
        </View>
      )}

      {/* Campo: Correo Electrónico */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-[11px] font-bold tracking-wider text-textMutedDark uppercase">
            Correo Electrónico
          </Text>
          <Text className="text-[11px] text-textMuted">
            Institucional o Personal
          </Text>
        </View>

        <View className="h-12 rounded-xl bg-gray-100 flex-row items-center px-3.5 border border-transparent focus:border-gray-300">
          <Ionicons
            name="mail-outline"
            size={19}
            color={AURA_COLORS.textMuted}
            style={{ marginRight: 10 }}
          />
          <TextInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={AURA_COLORS.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            className="flex-1 text-sm font-semibold text-textDark py-0"
          />
          {isEmailValid && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={AURA_COLORS.emeraldGreen}
            />
          )}
        </View>
      </View>

      {/* Campo: Contraseña con botón de visibilidad */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-[11px] font-bold tracking-wider text-textMutedDark uppercase">
            Contraseña
          </Text>
          <TouchableOpacity onPress={onForgotPasswordPress}>
            <Text
              className="text-[11px] font-bold"
              style={{ color: AURA_COLORS.amberGold }}
            >
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-12 rounded-xl bg-gray-100 flex-row items-center px-3.5 border border-transparent focus:border-gray-300">
          <Ionicons
            name="lock-closed-outline"
            size={19}
            color={AURA_COLORS.textMuted}
            style={{ marginRight: 10 }}
          />
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="••••••••••••"
            placeholderTextColor={AURA_COLORS.textMuted}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            className="flex-1 text-sm font-semibold text-textDark tracking-wider py-0"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-1"
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={AURA_COLORS.textMutedDark}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón Principal: Obsidian 52px */}
      <PrimaryButton
        title="Iniciar Sesión"
        onPress={handleSubmit}
        loading={isLoading}
        iconName="arrow-forward"
      />

      {/* Enlace para cambiar a Registro */}
      <View className="flex-row items-center justify-center mt-5">
        <Text className="text-xs text-textMutedDark">
          ¿No tienes una cuenta aún?
        </Text>
        <TouchableOpacity onPress={onSwitchToRegister} className="ml-1.5">
          <Text
            className="text-xs font-bold"
            style={{ color: AURA_COLORS.amberGold }}
          >
            Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
