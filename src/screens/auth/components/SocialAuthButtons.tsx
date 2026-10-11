import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { AURA_COLORS } from '../../../constants/theme';

interface SocialAuthButtonsProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  dividerText?: string;
}

/**
 * Botones de Autenticación Rápida (Google & Apple ID) - Stitch 1:1
 */
export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onGooglePress,
  onApplePress,
  dividerText = 'o continúa con',
}) => {
  return (
    <View className="w-full mt-5">
      {/* Separador con etiqueta */}
      <View className="relative items-center justify-center mb-4">
        <View className="w-full h-[1px] bg-gray-200" />
        <View className="absolute bg-white px-3">
          <Text className="text-[11px] font-semibold tracking-wider uppercase text-textMutedDark">
            {dividerText}
          </Text>
        </View>
      </View>

      {/* Grid de 2 columnas para Google y Apple ID */}
      <View className="flex-row gap-3">
        {/* Botón Google */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onGooglePress}
          className="flex-1 h-12 rounded-full bg-gray-100/90 flex-row items-center justify-center gap-2 border border-gray-200/50"
        >
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              fill="#4285F4"
            />
            <Path
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
              fill="#34A853"
            />
            <Path
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              fill="#FBBC05"
            />
            <Path
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              fill="#EA4335"
            />
          </Svg>
          <Text className="text-xs font-bold text-textDark">Google</Text>
        </TouchableOpacity>

        {/* Botón Apple ID */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onApplePress}
          className="flex-1 h-12 rounded-full bg-gray-100/90 flex-row items-center justify-center gap-2 border border-gray-200/50"
        >
          <Ionicons name="logo-apple" size={19} color={AURA_COLORS.obsidian} />
          <Text className="text-xs font-bold text-textDark">Apple ID</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
