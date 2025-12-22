// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#6b2f1f', // mais profundo e elegante (substitui marrom claro)
            contrastText: '#fff',
        },
        secondary: {
            main: '#d4a017', // dourado mais vivo
        },
        background: {
            default: '#f3efe9', // pergaminho mais claro e quente
            paper: '#fffaf5',   // painéis mais claros e com contraste suave
        },
        text: {
            primary: '#212121',
            secondary: '#6b2f1f',
        },
        rpg: {
            card: '#e7d7c7', // tom de couro mais neutro e menos "triste"
            border: '#6b2f1f',
        },
    },
    typography: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        h1: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#6b2f1f',
        },
        h2: {
            fontSize: '24px',
            color: '#6b2f1f',
            textDecoration: 'underline #d4a017',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#e7d7c7',
                    borderRadius: '10px',
                    boxShadow: '0px 6px 18px rgba(20,20,20,0.14)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: '#fff',
                    borderRadius: '6px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: '700',
                    textTransform: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                },
            },
        },
    },
});

export default theme;