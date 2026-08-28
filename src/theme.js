// src/theme.js
import { createTheme, alpha } from "@mui/material/styles";

export function createAppTheme({ mode = "dark", style = "parchment" } = {}) {
  const isDark = mode === "dark";

  // Fundos e Papéis
  const backgroundDefault = isDark ? "#0f0e0d" : "#f4ede3";
  const paperBase = isDark ? "#1e1814" : "#FFF6EA";
  const paperElevated = isDark ? "#28211b" : "#fdfbf7";

  // Textos
  const textPrimary = isDark ? "#f5ede0" : "#2c1a10";
  const textSecondary = isDark ? "rgba(245, 237, 224, 0.7)" : "rgba(44, 26, 16, 0.75)";

  const paperBg =
    style === "parchment"
      ? isDark
        ? `linear-gradient(180deg, rgba(35, 28, 23, 0.96) 0%, rgba(26, 21, 17, 0.98) 100%)`
        : `linear-gradient(180deg, ${alpha("#fffaf2", 0.92)} 0%, ${alpha(paperBase, 0.94)} 100%)`
      : "none";

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? "#d47a37" : "#833c0b", contrastText: "#fff" },
      secondary: { main: isDark ? "#e5b324" : "#bf8f00" },
      background: {
        default: backgroundDefault,
        paper: paperBase,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      rpg: {
        style,
        leather: isDark ? "#3d2d23" : "#ba9173",
        ink: textPrimary,
        stroke: isDark ? "rgba(212, 122, 55, 0.25)" : "rgba(92, 64, 51, 0.2)",
        paperBg,
        paperElevated,
      },
    },

    shape: { borderRadius: 14 },

    typography: {
      fontFamily: `"Cinzel", "Roboto", Helvetica, Arial, sans-serif`,
      h4: { fontWeight: 900, letterSpacing: 0.2, color: textPrimary },
      h6: { fontWeight: 800, color: textPrimary },
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

      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
          disableTouchRipple: true,
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: theme.palette.rpg?.paperBg || "none",
            color: theme.palette.text.primary,
          }),
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
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            marginInline: theme.spacing(1),
            marginBlock: theme.spacing(0.5),
            transition: "background-color 150ms ease, color 150ms ease",
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
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            transition: "transform 150ms ease",
            "&:hover": { transform: "translateY(-2px)" },
            "& .MuiCardActionArea-focusHighlight": {
              backgroundColor: alpha(theme.palette.primary.main, 0.10),
            },
          }),
        },
      },

      MuiButton: {
        defaultProps: {
          disableRipple: true,
          disableElevation: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            paddingInline: theme.spacing(2),
            transition: "background-color 150ms ease, border-color 150ms ease, color 150ms ease, transform 150ms ease",
            "&:active": {
              transform: "scale(0.98)",
            },
          }),
        },
      },

      MuiIconButton: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            transition: "background-color 150ms ease, color 150ms ease, transform 150ms ease",
            "&:active": {
              transform: "scale(0.96)",
            },
          },
        },
      },

      MuiDialog: {
        defaultProps: {
          transitionDuration: 150,
        },
      },
    },
  });
}

// mantém compatibilidade com imports antigos (ThemeProvider theme={theme})
const theme = createAppTheme({ mode: "dark", style: "parchment" });
export default theme;