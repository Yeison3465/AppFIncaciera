import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../constants/theme';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  style?: ViewStyle;
}

/**
 * ErrorBanner - Aura Financial V2.5
 * Banner de alerta inline descartable para validaciones y excepciones.
 */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = 'Ha ocurrido un error',
  message,
  onDismiss,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle" size={18} color={AURA_COLORS.redAlert} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
          <Ionicons name="close" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AURA_COLORS.redAlertLight,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginVertical: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    color: '#B91C1C',
    lineHeight: 16,
  },
  closeButton: {
    padding: 4,
    marginLeft: 6,
  },
});
