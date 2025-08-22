// Tema personalizado con colores y estilos de MercadoPago
export const mercadopagoTheme = {
  colors: {
    // Colores principales de MercadoPago
    primary: {
      50: '#E8F4FD',
      100: '#CCE7FB',
      200: '#99CFF7',
      300: '#66B7F3',
      400: '#339FEF',
      500: '#009EE3', // Azul principal MercadoPago
      600: '#0088CC',
      700: '#0072B5',
      800: '#005C9E',
      900: '#004687',
    },
    
    // Colores secundarios
    secondary: {
      50: '#FFF8E1',
      100: '#FFECB3',
      200: '#FFE082',
      300: '#FFD54F',
      400: '#FFCA28',
      500: '#FFC107', // Amarillo MercadoPago
      600: '#FFB300',
      700: '#FFA000',
      800: '#FF8F00',
      900: '#FF6F00',
    },
    
    // Estados
    success: {
      50: '#E8F5E8',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: '#4CAF50',
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
    
    warning: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF9800',
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
    },
    
    error: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      200: '#EF9A9A',
      300: '#E57373',
      400: '#EF5350',
      500: '#F44336',
      600: '#E53935',
      700: '#D32F2F',
      800: '#C62828',
      900: '#B71C1C',
    },
    
    // Grises
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    
    // Colores específicos de MercadoPago
    mercadopago: {
      blue: '#009EE3',
      lightBlue: '#00A8F5',
      darkBlue: '#003DA6',
      yellow: '#FFC107',
      green: '#00A650',
      red: '#CE0E2D',
      black: '#000000',
      darkGray: '#666666',
      lightGray: '#999999',
    }
  },
  
  // Tipografía
  typography: {
    fontFamily: {
      sans: ['Proxima Nova', 'Helvetica Neue', 'Arial', 'sans-serif'],
      mono: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Espaciado
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Bordes
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  
  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Animaciones
  transitions: {
    fast: '150ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
}

// Utilidades para aplicar el tema
export const mpColors = mercadopagoTheme.colors.mercadopago
export const mpTypography = mercadopagoTheme.typography
export const mpSpacing = mercadopagoTheme.spacing

// Clases CSS personalizadas para MercadoPago
export const mpStyles = {
  // Botón principal
  primaryButton: `
    bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg
    transition-colors duration-200 shadow-md hover:shadow-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  `,
  
  // Botón secundario
  secondaryButton: `
    bg-white hover:bg-gray-50 text-blue-500 font-semibold py-2 px-4 rounded-lg
    border border-blue-500 hover:border-blue-600
    transition-colors duration-200 shadow-md hover:shadow-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  `,
  
  // Card estilo MercadoPago
  card: `
    bg-white rounded-lg shadow-lg border border-gray-200 p-6
    hover:shadow-xl transition-shadow duration-200
  `,
  
  // Input estilo MercadoPago
  input: `
    w-full px-3 py-2 border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-colors duration-200
  `,
  
  // Badge estilo MercadoPago
  badge: `
    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
    bg-blue-100 text-blue-800
  `,
  
  // Alert estilo MercadoPago
  alert: `
    p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 text-blue-700
  `,
}

// Configuración para Tailwind CSS
export const mercadopagoTailwindConfig = {
  theme: {
    extend: {
      colors: {
        mp: mercadopagoTheme.colors.mercadopago,
        primary: mercadopagoTheme.colors.primary,
        secondary: mercadopagoTheme.colors.secondary,
      },
      fontFamily: mercadopagoTheme.typography.fontFamily,
      fontSize: mercadopagoTheme.typography.fontSize,
      fontWeight: mercadopagoTheme.typography.fontWeight,
      spacing: mercadopagoTheme.spacing,
      borderRadius: mercadopagoTheme.borderRadius,
      boxShadow: mercadopagoTheme.shadows,
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
    },
  },
} 