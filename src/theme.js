// src/theme.js
import { createTheme, alpha } from "@mui/material/styles";

export function createAppTheme({ mode = "dark", style = "parchment" } = {}) {
  const isDark = mode === "dark";

  const backgroundDefault = isDark ? "#101210" : "#f4ede3";
  const paperBase = isDark ? "#DFD6CD" : "#FFF6EA";

  const paperBg =
    style === "parchment"
      ? `linear-gradient(180deg, ${alpha("#fffaf2", 0.92)} 0%, ${alpha(paperBase, 0.94)} 100%)`
      : "none";

  return createTheme({
    palette: {
      mode,
      primary: { main: "#833c0b", contrastText: "#fff" },
      secondary: { main: "#bf8f00" },
      background: {
        default: backgroundDefault,
        paper: paperBase,
      },
      text: {
        primary: "#2c1a10",
        secondary: alpha("#2c1a10", 0.78),
      },
      rpg: {
        style, // ✅ expõe o preset atual
        leather: "#ba9173",
        ink: "#2c1a10",
        stroke: alpha("#000", 0.12),
      },
    },

    shape: { borderRadius: 14 },

    typography: {
      fontFamily: `"Cinzel", "Roboto", Helvetica, Arial, sans-serif`,
      h4: { fontWeight: 900, letterSpacing: 0.2, color: "#2c1a10" },
      h6: { fontWeight: 800, color: "#2c1a10" },
      button: { fontWeight: 800, textTransform: "none" },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: backgroundDefault,
            // leve “textura” quando parchment (sem asset)
            backgroundImage:
              style === "parchment"
                ? `
                  radial-gradient(70% 55% at 20% 10%, rgba(255,255,255,0.06), rgba(0,0,0,0)),
                  radial-gradient(70% 55% at 80% 0%, rgba(255,255,255,0.04), rgba(0,0,0,0))
                `
                : "none",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: paperBg,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
            backgroundColor: alpha(theme.palette.background.paper, 0.88),
            backgroundImage:
              style === "parchment"
                ? `
                  linear-gradient(180deg,
                    ${alpha(theme.palette.background.paper, 0.95)} 0%,
                    ${alpha(theme.palette.rpg.leather, 0.45)} 100%
                  )
                `
                : "none",
            borderBottom: `1px solid ${alpha("#000", 0.14)}`,
            boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
          }),
        },
      },

      MuiToolbar: {
        styleOverrides: {
          root: { minHeight: 64 },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.background.paper, 0.96),
            backgroundImage:
              style === "parchment"
                ? `
                  linear-gradient(180deg,
                    ${alpha(theme.palette.background.paper, 0.98)} 0%,
                    ${alpha(theme.palette.rpg.leather, 0.35)} 100%
                  )
                `
                : "none",
            color: theme.palette.text.primary,
            borderRight: `1px solid ${alpha("#000", 0.14)}`,
          }),
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${alpha("#000", 0.12)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.98),
            boxShadow: "0 14px 35px rgba(0,0,0,0.22)",
          }),
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            marginInline: theme.spacing(1),
            marginBlock: theme.spacing(0.5),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
            "&.Mui-selected, &.Mui-selected:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
            },
          }),
        },
      },

      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.background.paper, 0.92),
            border: `1px solid ${theme.palette.rpg?.stroke || alpha("#000", 0.12)}`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            overflow: "hidden",
          }),
        },
      },

      MuiCardActionArea: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            transition: "transform 220ms ease",
            "&:hover": { transform: "translateY(-2px)" },
            "& .MuiCardActionArea-focusHighlight": {
              backgroundColor: alpha(theme.palette.primary.main, 0.10),
            },
          }),
        },
      },

      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            paddingInline: theme.spacing(2),
          }),
        },
      },
    },
  });
}

// mantém compatibilidade com imports antigos (ThemeProvider theme={theme})
const theme = createAppTheme({ mode: "dark", style: "parchment" });
export default theme;