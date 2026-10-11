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
import { SocialAuthButtons } from './SocialAuthButtons';
import { checkEmailFormat } from '../../../utils/authUiHelpers';

interface LoginFormProps {
  onForgotPasswordPress?: () => void;
  onSuccessLogin?: () => void;
}

/**
 * Formulario de Inicio de Sesión (RF-02 - Stitch 1:1)
 * Incluye alerta de credenciales, feedback de formato en vivo y botones rápidos.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onForgotPasswordPress,
  onSuccessLogin,
}) => {
  const [email, setEmail] = useState<string>('usuario@aurafinancial.com');
  const [password, setPassword] = useState<string>('Finanzas2025#');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isEmailValid = checkEmailFormat(email);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccessLogin) {
        onSuccessLogin();
      }
    }, 1000);
  };

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
                Acceso no verificado
              </Text>
              <Text className="text-xs text-red-700 leading-4 mt-0.5">
                Credenciales no reconocidas. Verifica tu correo y contraseña para
                reintentar el acceso.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setShowAlert(false)}
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
            onChangeText={setEmail}
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
            onChangeText={setPassword}
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

      {/* Botones Sociales */}
      <SocialAuthButtons dividerText="o continúa con" />
    </View>
  );
};
