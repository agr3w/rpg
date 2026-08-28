import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import Rout from "./Route";
import "styles/reset.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import "./APIs/firebaseConfig";
import { AuthProvider } from "contexts/AuthContext";
import { PreferencesProvider, usePreferences } from "contexts/PreferencesContext";
import { createAppTheme } from "./theme";

const root = ReactDOM.createRoot(document.getElementById("root"));

function AppWithTheme() {
  const { prefs } = usePreferences();
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const resolvedMode =
    prefs.themeMode === "system"
      ? prefersDark
        ? "dark"
        : "light"
      : prefs.themeMode;

  const theme = useMemo(
    () => createAppTheme({ mode: resolvedMode, style: prefs.themeStyle }),
    [resolvedMode, prefs.themeStyle]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Rout />
      </AuthProvider>
    </ThemeProvider>
  );
}

export const App = () => {
  return (
    <React.StrictMode>
      <PreferencesProvider>
        <AppWithTheme />
      </PreferencesProvider>
    </React.StrictMode>
  );
};

root.render(<App />);
