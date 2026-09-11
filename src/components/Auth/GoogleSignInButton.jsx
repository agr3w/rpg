// src/components/Auth/GoogleSignInButton.jsx
import React, { useState } from "react";
import { Button, CircularProgress, Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "APIs/firebaseConfig";

// Ícone oficial SVG do Google (colorido e nítido)
const GoogleSvgIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ display: "block" }}>
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export default function GoogleSignInButton({
  onError,
  text = "Continuar com o Google",
  disabled = false,
  showDivider = true,
  dividerText = "OU CONECTE COM",
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (loading || disabled) return;
    onError?.("");
    setLoading(true);

    try {
      await auth.signInWithPopup(googleProvider);
      navigate("/");
    } catch (err) {
      console.error("Erro na autenticação com Google:", err);
      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request"
      ) {
        // Usuário apenas fechou o pop-up, nenhuma ação de erro necessária
        return;
      }

      let msg = "Não foi possível autenticar com o Google. Tente novamente.";
      if (err.code === "auth/popup-blocked") {
        msg = "O pop-up de login foi bloqueado pelo seu navegador. Por favor, permita pop-ups para este site.";
      } else if (err.code === "auth/account-exists-with-different-credential") {
        msg = "Já existe uma conta associada a este e-mail com outro método de login.";
      } else if (err.code === "auth/operation-not-allowed") {
        msg = "O provedor Google ainda não foi ativado no Firebase Console (Authentication > Sign-in method).";
      } else if (err.code === "auth/unauthorized-domain") {
        msg = "Domínio não autorizado. Adicione este domínio na aba 'Domínios autorizados' do Firebase Authentication.";
      } else if (err.code === "auth/network-request-failed") {
        msg = "Falha de conexão com os servidores. Verifique sua conexão com a internet.";
      }

      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {showDivider && (
        <Box sx={{ display: "flex", alignItems: "center", my: 2.2 }}>
          <Box
            sx={{
              flex: 1,
              height: "1px",
              bgcolor: isDark ? "rgba(212,175,55,0.22)" : "rgba(139,94,60,0.22)",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              px: 1.6,
              fontFamily: "Cinzel, serif",
              fontWeight: 800,
              color: isDark ? "#b8ab99" : "#77553b",
              fontSize: "0.74rem",
              letterSpacing: 0.8,
            }}
          >
            {dividerText}
          </Typography>
          <Box
            sx={{
              flex: 1,
              height: "1px",
              bgcolor: isDark ? "rgba(212,175,55,0.22)" : "rgba(139,94,60,0.22)",
            }}
          />
        </Box>
      )}

      <Button
        type="button"
        variant="outlined"
        size="large"
        fullWidth
        onClick={handleGoogleSignIn}
        disabled={loading || disabled}
        startIcon={
          loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <GoogleSvgIcon />
          )
        }
        sx={{
          py: 1.35,
          bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "#fffdf9",
          color: isDark ? "#f5f0e6" : "#24140b",
          border: isDark
            ? "1.5px solid rgba(212, 175, 55, 0.35)"
            : "1.5px solid rgba(139, 94, 60, 0.35)",
          borderRadius: 2.5,
          fontFamily: "Cinzel, serif",
          fontWeight: 800,
          fontSize: "0.92rem",
          letterSpacing: 0.6,
          textTransform: "none",
          boxShadow: isDark
            ? "0 4px 14px rgba(0, 0, 0, 0.4)"
            : "0 2px 8px rgba(100, 50, 0, 0.06)",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: isDark ? "rgba(255, 215, 0, 0.1)" : "#f9f2e3",
            borderColor: isDark ? "#ffd700" : "#833c0b",
            boxShadow: isDark
              ? "0 6px 18px rgba(212, 175, 55, 0.25)"
              : "0 4px 14px rgba(131, 60, 11, 0.15)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "scale(0.99)",
          },
        }}
      >
        {loading ? "Conectando ao Google..." : text}
      </Button>
    </Box>
  );
}
