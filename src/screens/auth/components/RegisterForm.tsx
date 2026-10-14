import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS, AURA_TYPOGRAPHY } from '../../../constants/theme';
import { PrimaryButton } from '../../../components';
import {
  checkEmailFormat,
  calculatePasswordStrength,
} from '../../../utils/authUiHelpers';
import { useAuth } from '../../../context/AuthContext';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
  onSuccessRegister?: () => void;
}

/**
 * Formulario de Registro de Usuario (RF-01 - Stitch 1:1)
 * Conectado con Supabase Auth y validaciones en vivo.
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  onSuccessRegister,
}) => {
  const { register } = useAuth();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [age, setAge] = useState<number>(18);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDuplicateAlert, setIsDuplicateAlert] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Estados derivados
  const isEmailValid = checkEmailFormat(email);
  const strengthState = calculatePasswordStrength(password);
  const isUsernameValid = username.trim().length >= 3;

  const handleAgeMinus = () => {
    if (age > 18) {
      setAge(age - 1);
    }
  };

  const handleAgePlus = () => {
    if (age < 99) {
      setAge(age + 1);
    }
  };

  const handleDismissAlert = () => {
    setErrorMessage(null);
    setIsDuplicateAlert(false);
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    setErrorMessage(null);
    setIsDuplicateAlert(false);
    setSuccessNotice(null);

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      setErrorMessage('Todos los campos son obligatorios para el registro.');
      return;
    }

    if (!isEmailValid) {
      setErrorMessage('Por favor ingresa un correo electrónico con formato válido.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('La contraseña debe contener al menos 8 caracteres.');
      return;
    }

    if (strengthState.score < 2) {
      setErrorMessage(
        strengthState.feedback ||
          'La robustez de la contraseña es demasiado baja. Combina letras, números y caracteres especiales.'
      );
      return;
    }

    setIsLoading(true);
    const result = await register({
      email,
      password,
      firstName,
      lastName,
      username,
      age,
    });
    setIsLoading(false);

    if (result.isDuplicate) {
      setIsDuplicateAlert(true);
      setErrorMessage(
        'El correo electrónico ya se encuentra registrado en el sistema. Verifica tus datos o inicia sesión.'
      );
      return;
    }

    if (!result.success) {
      setErrorMessage(result.error || 'Ocurrió un error al crear la cuenta. Intenta nuevamente.');
      return;
    }

    // Registro exitoso
    if (result.requiresEmailConfirmation) {
      setSuccessNotice(
        'Cuenta registrada exitosamente. Hemos enviado un correo de confirmación para activar tu acceso.'
      );
    } else {
      if (onSuccessRegister) {
        onSuccessRegister();
      }
    }
  };

  // Color para la barra segmentada según score
  const getBarColor = (barIndex: number) => {
    if (barIndex > strengthState.score) {
      return 'bg-gray-200';
    }
    if (strengthState.score === 1) return 'bg-[#EF4444]'; // Crimson Red
    if (strengthState.score === 2) return 'bg-[#F59E0B]'; // Amber Gold
    if (strengthState.score === 3) return 'bg-[#84cc16]'; // Lime/Secure
    return 'bg-[#10B981]'; // Emerald Green (Strong)
  };

  const showAlert = Boolean(errorMessage || isDuplicateAlert);

  return (
    <View className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
      {/* Banner de Validación / Conflicto (RF-01) */}
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
              <Text className="text-[11px] font-bold tracking-wider text-red-900 uppercase">
                {isDuplicateAlert ? 'Correo ya Registrado' : 'Validación de Credenciales'}
              </Text>
              <Text className="text-xs text-red-700 leading-4 mt-0.5">
                {errorMessage}
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

      {/* Banner de Éxito / Confirmación */}
      {successNotice && (
        <View className="mb-4 p-3.5 rounded-xl bg-emerald-50 flex-row items-start justify-between border border-emerald-200">
          <View className="flex-row items-start flex-1 mr-2">
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={AURA_COLORS.emeraldGreen}
              style={{ marginRight: 8, marginTop: 1 }}
            />
            <View className="flex-1">
              <Text className="text-[11px] font-bold tracking-wider text-emerald-900 uppercase">
                Registro Completado
              </Text>
              <Text className="text-xs text-emerald-700 leading-4 mt-0.5">
                {successNotice}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setSuccessNotice(null)}
            className="p-1 -mr-1 -mt-1"
          >
            <Ionicons name="close" size={18} color="#065F46" />
          </TouchableOpacity>
        </View>
      )}

      {/* Encabezado de la Tarjeta */}
      <View className="flex-row items-center justify-between pb-4 border-b border-gray-100 mb-4">
        <View>
          <Text className="text-xl font-bold text-textDark">Crear Cuenta</Text>
          
        </View>
        <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
          <Ionicons
            name="shield-checkmark"
            size={20}
            color={AURA_COLORS.amberGold}
          />
        </View>
      </View>

      {/* Fila Doble: Nombre y Apellido */}
      <View className="flex-row gap-3 mb-3.5">
        <View className="flex-1">
          <Text className="text-[11px] font-bold tracking-wider text-textMutedDark uppercase mb-1">
            Nombre
          </Text>
          <View className="h-12 rounded-xl bg-gray-100 px-3.5 justify-center">
            <TextInput
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Tu nombre"
              placeholderTextColor={AURA_COLORS.textMuted}
              className="text-sm font-semibold text-textDark py-0"
            />
          </View>
        </View>

        <View className="flex-1">
          <Text className="text-[11px] font-bold tracking-wider text-textMutedDark uppercase mb-1">
            Apellido
          </Text>
          <View className="h-12 rounded-xl bg-gray-100 px-3.5 justify-center">
            <TextInput
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Tu apellido"
              placeholderTextColor={AURA_COLORS.textMuted}
              className="text-sm font-semibold text-textDark py-0"
            />
          </View>
        </View>
      </View>

      {/* Campo: Nombre de Usuario */}
      <View className="mb-3.5">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[11px] font-bold tracking-wider text-textMutedDark uppercase">
            Nombre de Usuario
          </Text>
          {isUsernameValid ? (
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-emeraldGreen" />
              <Text className="text-[11px] font-bold text-emeraldGreen">
                Válido
              </Text>
            </View>
          ) : (
            <Text className="text-[11px] text-textMuted">
              Mínimo 3 caracteres
            </Text>
          )}
        </View>

        <View className="h-12 rounded-xl bg-gray-100 flex-row items-center px-3.5 border border-transparent">
          <Text className="text-sm font-bold text-textMuted mr-1.5">@</Text>
          <TextInput
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="usuario_fin"
            placeholderTextColor={AURA_COLORS.textMuted}
            autoCapitalize="none"
            className="flex-1 text-sm font-semibold text-textDark py-0"
          />
          {isUsernameValid && (
            <Ionicons
              name="checkmark-circle"
              size={19}
              color={AURA_COLORS.emeraldGreen}
            />
          )}
        </View>
      </View>

      {/* Campo: Edad (Años) con Stepper Numérico Aura */}
      <View className="mb-3.5">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[11px] font-bold tracking-wider text-textMutedDark uppercase">
            Edad (Años)
          </Text>
          <Text className="text-[11px] text-textMuted">
            Rango válido: 18 - 99 años
          </Text>
        </View>

        <View className="p-2 rounded-xl bg-gray-100 flex-row items-center justify-between">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAgeMinus}
            disabled={age <= 18}
            className="w-10 h-10 rounded-full bg-white border border-gray-200/60 shadow-sm items-center justify-center"
            style={{ opacity: age <= 18 ? 0.4 : 1 }}
          >
            <Ionicons name="remove" size={19} color={AURA_COLORS.textDark} />
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            <Text
              className="text-xl font-extrabold text-textDark"
              style={AURA_TYPOGRAPHY.tabular}
            >
              {age}
            </Text>
            <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-emeraldGreenLight">
              <Ionicons
                name="checkmark"
                size={14}
                color={AURA_COLORS.emeraldGreen}
              />
              <Text className="text-[11px] font-bold text-emeraldGreen">
                Válido
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAgePlus}
            disabled={age >= 99}
            className="w-10 h-10 rounded-full bg-white border border-gray-200/60 shadow-sm items-center justify-center"
            style={{ opacity: age >= 99 ? 0.4 : 1 }}
          >
            <Ionicons name="add" size={19} color={AURA_COLORS.textDark} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Campo: Correo Electrónico */}
      <View className="mb-3.5">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[11px] font-bold tracking-wider text-textMutedDark uppercase">
            Correo Electrónico
          </Text>
          {isEmailValid && (
            <View className="flex-row items-center gap-1">
              <Ionicons
                name="shield-checkmark"
                size={14}
                color={AURA_COLORS.emeraldGreen}
              />
              <Text className="text-[11px] font-bold text-emeraldGreen">
                Formato Válido
              </Text>
            </View>
          )}
        </View>

        <View className="h-12 rounded-xl bg-gray-100 flex-row items-center px-3.5">
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
              if (isDuplicateAlert) setIsDuplicateAlert(false);
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

      {/* Campo: Contraseña con medidor de robustez y micro-chips */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[11px] font-bold tracking-wider text-textMutedDark uppercase">
            Contraseña
          </Text>
          {password.length > 0 ? (
            <Text
              className="text-[11px] font-bold"
              style={{
                color:
                  strengthState.score >= 3
                    ? AURA_COLORS.emeraldGreen
                    : strengthState.score === 2
                    ? AURA_COLORS.amberGold
                    : AURA_COLORS.redAlert,
              }}
            >
              {strengthState.label}
            </Text>
          ) : hasSubmitted ? (
            <Text
              className="text-[11px] font-bold"
              style={{ color: AURA_COLORS.redAlert }}
            >
              {strengthState.label}
            </Text>
          ) : null}
        </View>

        <View className="h-12 rounded-xl bg-gray-100 flex-row items-center px-3.5 mb-2">
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
            className="flex-1 text-sm font-semibold text-textDark tracking-widest py-0"
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

        {/* Medidor Segmentado de Fortaleza (4 Barras) */}
        <View className="flex-row gap-1.5 h-1.5 rounded-full overflow-hidden mb-2">
          <View className={`flex-1 h-full rounded-full ${getBarColor(1)}`} />
          <View className={`flex-1 h-full rounded-full ${getBarColor(2)}`} />
          <View className={`flex-1 h-full rounded-full ${getBarColor(3)}`} />
          <View className={`flex-1 h-full rounded-full ${getBarColor(4)}`} />
        </View>

        {/* Micro-validation Chips */}
        <View className="flex-row flex-wrap gap-1.5 mb-1.5">
          <View
            className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${
              strengthState.hasLength ? 'bg-emeraldGreenLight' : 'bg-gray-100'
            }`}
          >
            <Ionicons
              name={strengthState.hasLength ? 'checkmark' : 'ellipse-outline'}
              size={12}
              color={
                strengthState.hasLength
                  ? AURA_COLORS.emeraldGreen
                  : AURA_COLORS.textMuted
              }
            />
            <Text
              className={`text-[11px] font-medium ${
                strengthState.hasLength
                  ? 'text-emeraldGreen'
                  : 'text-textMutedDark'
              }`}
            >
              8+ caracteres
            </Text>
          </View>

          <View
            className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${
              strengthState.hasNumber ? 'bg-emeraldGreenLight' : 'bg-gray-100'
            }`}
          >
            <Ionicons
              name={strengthState.hasNumber ? 'checkmark' : 'ellipse-outline'}
              size={12}
              color={
                strengthState.hasNumber
                  ? AURA_COLORS.emeraldGreen
                  : AURA_COLORS.textMuted
              }
            />
            <Text
              className={`text-[11px] font-medium ${
                strengthState.hasNumber
                  ? 'text-emeraldGreen'
                  : 'text-textMutedDark'
              }`}
            >
              Números
            </Text>
          </View>

          <View
            className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${
              strengthState.hasSpecialChar ? 'bg-emeraldGreenLight' : 'bg-gray-100'
            }`}
          >
            <Ionicons
              name={
                strengthState.hasSpecialChar ? 'checkmark' : 'ellipse-outline'
              }
              size={12}
              color={
                strengthState.hasSpecialChar
                  ? AURA_COLORS.emeraldGreen
                  : AURA_COLORS.textMuted
              }
            />
            <Text
              className={`text-[11px] font-medium ${
                strengthState.hasSpecialChar
                  ? 'text-emeraldGreen'
                  : 'text-textMutedDark'
              }`}
            >
              Símbolos (#,$,%)
            </Text>
          </View>
        </View>

        <Text className="text-[11px] text-textMutedDark leading-4">
          Cumple con: mín. 8 caracteres, mayúscula, número y símbolo especial.
        </Text>
      </View>

      {/* Nota KYC Informativa */}
      <View className="flex-row items-center gap-1.5 p-2 rounded-lg bg-gray-50 border border-gray-100 mb-4">
        <Ionicons
          name="information-circle"
          size={16}
          color={AURA_COLORS.amberGold}
        />
        <Text className="text-[11px] text-textMutedDark font-medium flex-1">
          Todos los campos son obligatorios para verificación KYC.
        </Text>
      </View>

      {/* Botón Principal: Obsidian 52px */}
      <PrimaryButton
        title="Crear Cuenta Segura"
        onPress={handleSubmit}
        loading={isLoading}
        iconName="arrow-forward"
      />

      {/* Enlace para cambiar a Iniciar Sesión */}
      <View className="flex-row items-center justify-center mt-5">
        <Text className="text-xs text-textMutedDark">
          ¿Ya tienes una cuenta activa?
        </Text>
        <TouchableOpacity onPress={onSwitchToLogin} className="ml-1.5">
          <Text
            className="text-xs font-bold"
            style={{ color: AURA_COLORS.amberGold }}
          >
            Inicia Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
