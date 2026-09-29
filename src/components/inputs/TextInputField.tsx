import React from 'react';
import {
  View,
  Text,
  TextInput,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../constants/theme';

interface TextInputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  isValid?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

/**
 * Input de Texto Aura (Floating/Inset Label) - Aura Financial V2.5
 * Implementado con Tailwind CSS / NativeWind.
 */
export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  error,
  isValid,
  rightIcon,
  onRightIconPress,
  containerStyle,
  ...inputProps
}) => {
  const hasError = !!error;

  return (
    <View className="my-1.5" style={containerStyle}>
      <View
        className={`min-h-[58px] rounded-[14px] bg-white border-[1.2px] px-4 py-2 flex-row items-center ${
          hasError
            ? 'bg-redAlertLight border-redAlert'
            : isValid
            ? 'border-emeraldGreen'
            : 'border-borderLight'
        }`}
      >
        <View className="flex-1 justify-center">
          <Text
            className={`text-[10px] font-bold tracking-wider mb-0.5 ${
              hasError ? 'text-redAlert' : 'text-textMutedDark'
            }`}
          >
            {label.toUpperCase()}
          </Text>
          <TextInput
            placeholderTextColor={AURA_COLORS.textMuted}
            className={`text-[15px] font-semibold py-0 ${
              hasError ? 'text-redAlert' : 'text-textDark'
            }`}
            {...inputProps}
          />
        </View>

        {isValid && !hasError && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={AURA_COLORS.emeraldGreen}
            style={{ marginLeft: 8 }}
          />
        )}

        {hasError && (
          <Ionicons
            name="alert-circle"
            size={20}
            color={AURA_COLORS.redAlert}
            style={{ marginLeft: 8 }}
          />
        )}

        {rightIcon && !hasError && !isValid && (
          <TouchableOpacity onPress={onRightIconPress} className="p-1 ml-1">
            <Ionicons name={rightIcon} size={20} color={AURA_COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {hasError && (
        <Text className="text-redAlert text-xs mt-1 ml-1.5 font-medium">{error}</Text>
      )}
    </View>
  );
};
