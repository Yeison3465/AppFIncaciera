import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AURA_COLORS } from '../../constants/theme';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  visible: boolean;
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number;
  onDismiss: () => void;
}

/**
 * Toast - Notificación flotante de alta jerarquía (Aura Financial V2.5)
 * Compatible con iOS, Android y Web. Animación suave con auto-cierre.
 */
export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  title,
  type = 'success',
  duration = 4000,
  onDismiss,
}) => {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [visible, duration]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) {
    return null;
  }

  const isSuccess = type === 'success';
  const isError = type === 'error';

  const iconName = isSuccess
    ? 'checkmark-circle'
    : isError
    ? 'alert-circle'
    : 'information-circle';

  const accentColor = isSuccess
    ? AURA_COLORS.emeraldGreen
    : isError
    ? AURA_COLORS.redAlert
    : AURA_COLORS.amberGold;

  const defaultTitle = isSuccess
    ? 'Operación Exitosa'
    : isError
    ? 'Atención'
    : 'Información';

  const topOffset = Math.max(insets.top, 16) + 8;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: topOffset,
          opacity,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.toastCard}>
        {/* Indicador de acento izquierdo */}
        <View
          style={[styles.accentStripe, { backgroundColor: accentColor }]}
        />

        {/* Icono temático */}
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: isSuccess
                ? AURA_COLORS.emeraldGreenLight
                : isError
                ? AURA_COLORS.redAlertLight
                : AURA_COLORS.amberGoldLight,
            },
          ]}
        >
          <Ionicons name={iconName} size={22} color={accentColor} />
        </View>

        {/* Texto del Toast */}
        <View style={styles.contentWrapper}>
          <Text style={styles.titleText}>{title || defaultTitle}</Text>
          <Text style={styles.messageText}>{message}</Text>
        </View>

        {/* Botón de cierre */}
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={18} color={AURA_COLORS.textMutedDark} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  accentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color: AURA_COLORS.textDark,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  messageText: {
    fontSize: 12,
    color: AURA_COLORS.textMutedDark,
    lineHeight: 16,
  },
  closeButton: {
    padding: 4,
  },
});
