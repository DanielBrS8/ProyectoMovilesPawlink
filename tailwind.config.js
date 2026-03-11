/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primario: {
          DEFAULT: '#7DD3C0',
          oscuro: '#5BBAA8',
          claro: '#A8E6D8',
        },
        secundario: {
          DEFAULT: '#87CEEB',
          claro: '#B8E2F2',
          oscuro: '#5FAFC9',
        },
        acento: {
          DEFAULT: '#FFB366',
          oscuro: '#E6994D',
          claro: '#FFD4A3',
        },
        fondo: '#F8FAFB',
        tarjeta: '#FFFFFF',
        texto: {
          DEFAULT: '#2D3748',
          claro: '#718096',
        },
        exito: '#68D391',
        advertencia: '#F6AD55',
        peligro: '#FC8181',
        borde: '#E2E8F0',
      },
    },
  },
  plugins: [],
};
