// src/components/Auth/EmailVerificationBanner.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Collapse,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme
} from "@mui/material";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "contexts/AuthContext";
import { reenviarVerificacao } from "APIs/authService";

export default function EmailVerificationBanner() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user, refreshUser } = useAuth();

  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [toast, setToast] = useState(null);

  // Se não estiver logado, se já tiver confirmado o e-mail ou se tiver dispensado, não renderiza
  if (!user || user.emailVerified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    if (cooldown > 0 || sending) return;
    setSending(true);
    try {
      await reenviarVerificacao(user);
      setToast({
        severity: "success",
        message: "Pergaminho de confirmação reenviado para " + user.email + "!"
      });
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Erro ao reenviar confirmação:", err);
      let msg = "Falha ao enviar e-mail. Tente novamente em instantes.";
      if (err.code === "auth/too-many-requests") {
        msg = "Muitas tentativas em pouco tempo. Aguarde alguns minutos.";
      }
      setToast({ severity: "error", message: msg });
    } finally {
      setSending(false);
    }
  };

  const handleCheck = async () => {
    if (checking) return;
    setChecking(true);
    try {
      const updatedUser = await refreshUser?.();
      if (updatedUser?.emailVerified) {
        setToast({
          severity: "success",
          message: "E-mail confirmado com sucesso! Bem-vindo(a) plenamente ao Reino."
        });
      } else {
        setToast({
          severity: "warning",
          message: "Ainda não detectamos a validação. Certifique-se de clicar no link recebido no seu e-mail."
        });
      }
    } catch (err) {
      console.error("Erro ao verificar status do e-mail:", err);
      setToast({
        severity: "error",
        message: "Não foi possível verificar no momento. Tente novamente."
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <Collapse in={!dismissed}>
        <Box
          sx={{
            width: "100%",
            bgcolor: isDark ? "rgba(45, 26, 12, 0.95)" : "#fffbf0",
            borderBottom: isDark ? "1.5px solid rgba(212,175,55,0.4)" : "1.5px solid rgba(139,94,60,0.35)",
            py: { xs: 1.2, md: 0.9 },
            px: { xs: 2, md: 3 },
            boxShadow: isDark
              ? "0 4px 14px rgba(0,0,0,0.5)"
              : "0 2px 10px rgba(139,94,60,0.08)",
            position: "relative",
            zIndex: 1100
          }}
        >
          <Box
            sx={{
              maxWidth: 1300,
              mx: "auto",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 1.2, sm: 2 }
            }}
          >
            {/* Mensagem e Ícone */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <MarkEmailUnreadIcon
                sx={{
                  color: isDark ? "#ffd700" : "#b25900",
                  fontSize: { xs: 22, sm: 24 },
                  flexShrink: 0
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? "#f3ebd8" : "#442a17",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: { xs: "0.82rem", sm: "0.88rem" },
                  lineHeight: 1.4
                }}
              >
                <strong style={{ fontFamily: "Cinzel, serif", letterSpacing: 0.5 }}>
                  Confirmação de E-mail Pendente:
                </strong>{" "}
                Um pergaminho de verificação foi enviado para <strong>{user.email}</strong>.
              </Typography>
            </Box>

            {/* Ações */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-end" },
                width: { xs: "100%", sm: "auto" }
              }}
            >
              {/* Botão Já Confirmei */}
              <Button
                size="small"
                variant="outlined"
                onClick={handleCheck}
                disabled={checking}
                startIcon={
                  checking ? (
                    <CircularProgress size={13} color="inherit" />
                  ) : (
                    <RefreshIcon sx={{ fontSize: 16 }} />
                  )
                }
                sx={{
                  fontFamily: "Cinzel, serif",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "none",
                  py: 0.4,
                  px: 1.2,
                  color: isDark ? "#ffd700" : "#833c0b",
                  borderColor: isDark ? "rgba(212,175,55,0.4)" : "rgba(139,94,60,0.4)",
                  borderRadius: 1.5,
                  "&:hover": {
                    borderColor: isDark ? "#ffd700" : "#833c0b",
                    bgcolor: isDark ? "rgba(255,215,0,0.08)" : "rgba(139,94,60,0.08)"
                  }
                }}
              >
                {checking ? "Verificando..." : "Já Confirmei"}
              </Button>

              {/* Botão Reenviar E-mail */}
              <Button
                size="small"
                variant="contained"
                onClick={handleResend}
                disabled={sending || cooldown > 0}
                startIcon={
                  sending ? (
                    <CircularProgress size={13} color="inherit" />
                  ) : (
                    <SendIcon sx={{ fontSize: 14 }} />
                  )
                }
                sx={{
                  fontFamily: "Cinzel, serif",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  textTransform: "none",
                  py: 0.4,
                  px: 1.4,
                  bgcolor: isDark ? "#bf8f00" : "#833c0b",
                  color: isDark ? "#120e0a" : "#fff",
                  borderRadius: 1.5,
                  "&:hover": {
                    bgcolor: isDark ? "#ffd700" : "#a34d10"
                  }
                }}
              >
                {sending
                  ? "Enviando..."
                  : cooldown > 0
                  ? `Aguarde ${cooldown}s`
                  : "Reenviar Pergaminho"}
              </Button>

              {/* Fechar Banner nesta sessão */}
              <IconButton
                size="small"
                onClick={() => setDismissed(true)}
                sx={{
                  color: isDark ? "#c2b49e" : "#8c6a46",
                  p: 0.5,
                  "&:hover": { color: isDark ? "#fff" : "#24140b" }
                }}
                title="Ocultar aviso temporariamente"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Collapse>

      {/* Toast Feedback */}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={5000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {toast ? (
          <Alert
            severity={toast.severity}
            onClose={() => setToast(null)}
            sx={{
              borderRadius: 2,
              fontFamily: "Roboto, sans-serif",
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)"
            }}
          >
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
}
