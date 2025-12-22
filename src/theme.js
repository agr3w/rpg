// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#833c0b', // Aquele marrom avermelhado dos títulos/botões
            contrastText: '#fff',
        },
        secondary: {
            main: '#bf8f00', // O dourado dos sublinhados e detalhes
        },
        background: {
            default: '#eceff1', // Fundo geral da página
            paper: '#DFD6CD',   // Aquele bege estilo "papel/pergaminho" dos painéis
        },
        text: {
            primary: '#333333',
            secondary: '#833c0b', // Usar o marrom para textos de destaque
        },
        // Customização para as cores de "Couro" dos cards
        rpg: {
            card: '#ba9173',
            border: '#000000',
        },
    },
    typography: {
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        h1: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#833c0b',
        },
        h2: {
            fontSize: '24px',
            color: '#833c0b',
            textDecoration: 'underline #bf8f00', // Aquele sublinhado dourado
        },
    },
    components: {
        // Estilizando todos os Cards automaticamente
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ba9173', // Cor padrão dos cards
                    borderRadius: '10px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // Sua sombra
                },
            },
        },
        // Estilizando os Inputs para ficarem bonitos no fundo bege
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                },
            },
        },
        // Botões mais robustos
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 'bold',
                    textTransform: 'none', // Tira o CAPS LOCK automático
                },
            },
        },
    },
});

export default theme;