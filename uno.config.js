import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      dark: '#1e293b',
      light: '#f8fafc',
    },
  },
  shortcuts: {
    'btn-primary': 'px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors',
    'card': 'bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow',
  },
})

