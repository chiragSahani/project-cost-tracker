import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: {
      50: '#E6F2FF',
      100: '#C9E0FF',
      200: '#A1C4FD',
      300: '#7BA9F9',
      400: '#5B8DEF',
      500: '#3182CE', // Primary color
      600: '#2B6CB0',
      700: '#1E4E8C',
      800: '#153E75',
      900: '#1A365D',
    },
    secondary: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      200: '#81E6D9',
      300: '#4FD1C5',
      400: '#38B2AC',
      500: '#319795', // Secondary color
      600: '#2C7A7B',
      700: '#285E61',
      800: '#234E52',
      900: '#1D4044',
    },
    accent: {
      50: '#FAF5FF',
      100: '#E9D8FD',
      200: '#D6BCFA',
      300: '#B794F4',
      400: '#9F7AEA',
      500: '#805AD5', // Accent color
      600: '#6B46C1',
      700: '#553C9A',
      800: '#44337A',
      900: '#322659',
    },
    success: {
      500: '#38A169',
    },
    warning: {
      500: '#DD6B20',
    },
    error: {
      500: '#E53E3E',
    },
  },
  fonts: {
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: (props: { colorScheme: string }) => ({
          bg: `${props.colorScheme}.500`,
          color: 'white',
          _hover: {
            bg: `${props.colorScheme}.600`,
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          transition: 'all 0.2s ease-in-out',
        }),
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'md',
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          _hover: {
            boxShadow: 'lg',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
});

export default theme;