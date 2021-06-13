import { createMuiTheme } from '@material-ui/core/styles';

export const DarkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#C3073F',
    },
    secondary: {
      main: '#5703FF',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
});

export const LightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#00B0FF',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF5722',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
});
