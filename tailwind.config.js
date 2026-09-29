/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        obsidian: '#121316',
        darkCard: '#1E2025',
        lightSurface: '#F4F4F5',
        cardWhite: '#FFFFFF',
        borderSubtle: 'rgba(255, 255, 255, 0.1)',
        borderLight: '#E4E4E7',
        amberGold: '#FF9E00',
        amberGoldLight: 'rgba(255, 158, 0, 0.15)',
        emeraldGreen: '#10B981',
        emeraldGreenLight: 'rgba(16, 185, 129, 0.15)',
        redAlert: '#EF4444',
        redAlertLight: '#FEE2E2',
        textPrimary: '#FFFFFF',
        textDark: '#121316',
        textMuted: '#9CA3AF',
        textMutedDark: '#71717A',
      },
    },
  },
  plugins: [],
};

