import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f97316',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f6fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: ['"Plus Jakarta Sans"', '"Roboto"', '"Helvetica"', '"Arial"', 'sans-serif'].join(','),
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
    subtitle1: {
      color: '#6b7280',
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'transparent',
      },
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(37, 99, 235, 0.92), rgba(14, 116, 144, 0.92))',
          backdropFilter: 'blur(16px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingLeft: 20,
          paddingRight: 20,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 22,
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 22,
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
    },
  },
});
