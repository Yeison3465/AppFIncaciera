import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
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
    <View style={[styles.wrapper, containerStyle]}>
      <View
        style={[
          styles.container,
          hasError && styles.errorContainer,
          isValid && !hasError && styles.validContainer,
        ]}
      >
        <View style={styles.inputArea}>
          <Text style={[styles.label, hasError && styles.errorLabel]}>{label.toUpperCase()}</Text>
          <TextInput
            placeholderTextColor={AURA_COLORS.textMuted}
            style={[styles.input, hasError && styles.errorInput]}
            {...inputProps}
          />
        </View>

        {isValid && !hasError && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={AURA_COLORS.emeraldGreen}
            style={styles.statusIcon}
          />
        )}

        {hasError && (
          <Ionicons
            name="alert-circle"
            size={20}
            color={AURA_COLORS.redAlert}
            style={styles.statusIcon}
          />
        )}

        {rightIcon && !hasError && !isValid && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.iconButton}>
            <Ionicons name={rightIcon} size={20} color={AURA_COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
  },
  container: {
    minHeight: 58,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: AURA_COLORS.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: AURA_COLORS.redAlertLight,
    borderColor: AURA_COLORS.redAlert,
  },
  validContainer: {
    borderColor: AURA_COLORS.emeraldGreen,
  },
  inputArea: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: AURA_COLORS.textMutedDark,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  errorLabel: {
    color: AURA_COLORS.redAlert,
  },
  input: {
    fontSize: 15,
    fontWeight: '600',
    color: AURA_COLORS.textDark,
    paddingVertical: 0,
  },
  errorInput: {
    color: AURA_COLORS.redAlert,
  },
  statusIcon: {
    marginLeft: 8,
  },
  iconButton: {
    padding: 4,
    marginLeft: 4,
  },
  errorText: {
    color: AURA_COLORS.redAlert,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 6,
    fontWeight: '500',
  },
});
