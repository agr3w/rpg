// src/components/Auth/ForgotPasswordModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  useTheme
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockResetIcon from "@mui/icons-material/LockReset";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { auth } from "APIs/firebaseConfig";

const emailIsValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ForgotPasswordModal({ open, onClose, defaultEmail = "" }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSend = async (e) => {
    e?.preventDefault();
    setStatus(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !emailIsValid(cleanEmail)) {
      setStatus({ type: "error", message: "Por favor, digite um e-mail válido para receber as instruções." });
      return;
    }

    setLoading(true);
    try {
      await auth.sendPasswordResetEmail(cleanEmail);
      setStatus({
        type: "success",
        message: "O pergaminho de redefinição foi enviado para o seu e-mail! Verifique sua caixa de entrada ou spam."
      });
      setTimeout(() => {
        setStatus(null);
        onClose();
      }, 4000);
    } catch (err) {
      console.error("Erro ao resetar senha:", err);
      let errorMsg = "Não foi possível enviar o e-mail de recuperação. Verifique o endereço digitado.";
      if (err.code === "auth/user-not-found") {
        errorMsg = "Nenhum aventureiro encontrado com este e-mail.";
      } else if (err.code === "auth/too-many-requests") {
        errorMsg = "Muitas tentativas em pouco tempo. Aguarde alguns instantes.";
      }
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: isDark ? "#140e0b" : "#fffdf8",
          backgroundImage: isDark
            ? "radial-gradient(circle at 50% 0%, #2a1810 0%, #120b08 100%)"
            : "radial-gradient(circle at 50% 0%, #fff8ec 0%, #f7efe2 100%)",
          border: isDark ? "1px solid rgba(212,175,55,0.45)" : "1px solid rgba(139,94,60,0.35)",
          borderRadius: 3,
          boxShadow: isDark ? "0 24px 70px rgba(0,0,0,0.95)" : "0 20px 50px rgba(0,0,0,0.2)",
          color: isDark ? "#f5f0e6" : "#24140b",
          fontFamily: "Cinzel, sans-serif"
        }
      }}
    >
      <DialogTitle
        sx={{
          p: 2.5,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: isDark ? "1px solid rgba(212,175,55,0.2)" : "1px solid rgba(139,94,60,0.2)",
          bgcolor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.02)"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <LockResetIcon sx={{ color: isDark ? "#ffd700" : "#833c0b", fontSize: 26 }} />
          <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 800, color: isDark ? "#ffd700" : "#833c0b" }}>
            Recuperar Senha
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} disabled={loading} sx={{ color: isDark ? "#aaa" : "#666" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSend}>
        <DialogContent sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2" sx={{ color: isDark ? "#dcd3c2" : "#553a26", lineHeight: 1.6 }}>
            Informe o e-mail cadastrado na sua conta. Enviaremos um link mágico para você forjar uma nova senha de acesso.
          </Typography>

          {status && (
            <Alert severity={status.type} sx={{ borderRadius: 2 }}>
              {status.message}
            </Alert>
          )}

          <TextField
            label="Seu E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            autoFocus
            variant="filled"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon sx={{ color: isDark ? "#ffd700" : "#833c0b", fontSize: 20 }} />
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiFilledInput-root": {
                bgcolor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)",
                border: isDark ? "1px solid rgba(212,175,55,0.3)" : "1px solid rgba(139,94,60,0.25)",
                color: isDark ? "#f5f0e6" : "#24140b",
                borderRadius: 1.5
              },
              "& .MuiInputLabel-root": {
                color: isDark ? "#ffd700" : "#833c0b",
                fontFamily: "Cinzel",
                fontWeight: 700
              }
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
            pt: 1.5,
            borderTop: isDark ? "1px solid rgba(212,175,55,0.2)" : "1px solid rgba(139,94,60,0.2)",
            bgcolor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.02)",
            gap: 1
          }}
        >
          <Button onClick={onClose} disabled={loading} sx={{ color: isDark ? "#b8ab99" : "#666", fontFamily: "Cinzel" }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            sx={{
              bgcolor: isDark ? "#bf8f00" : "#833c0b",
              color: isDark ? "#120e0a" : "#fff",
              fontFamily: "Cinzel",
              fontWeight: 800,
              px: 3,
              "&:hover": { bgcolor: isDark ? "#ffd700" : "#a34d10" }
            }}
          >
            {loading ? "Enviando..." : "Enviar Link"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
