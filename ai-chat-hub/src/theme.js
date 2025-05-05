import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({ 
  config,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
      },
    },
  },
  colors: {
    billi: {
      50: '#E6F7FF',
      100: '#BAE7FF',
      200: '#91D5FF',
      300: '#69C0FF',
      400: '#40A9FF',
      500: '#1890FF',
      600: '#096DD9',
      700: '#0050B3',
      800: '#003A8C',
      900: '#002766',
    },
    accent: {
      100: '#FFE5F1',
      500: '#FF4D94',
      600: '#F5317F',
      900: '#B3005B',
    },
  },
  components: {
    Box: {
      variants: {
        glass: {
          bg: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'xl',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    Button: {
      variants: {
        'billi-gradient': {
          bg: 'linear-gradient(to right, billi.500, accent.500)',
          color: 'white',
          _hover: {
            bg: 'linear-gradient(to right, billi.600, accent.600)',
            _disabled: {
              bg: 'linear-gradient(to right, billi.500, accent.500)',
            },
          },
        },
      },
    },
  },
});

export default theme;
