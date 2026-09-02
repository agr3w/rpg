// src/components/SingIn/index.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  InputAdornment,
  Alert,
  Stack,
  CircularProgress,
  useTheme
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { auth } from "APIs/firebaseConfig";
import ForgotPasswordModal from "components/Auth/ForgotPasswordModal";

const emailIsValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function AuthComponent({ onSwitchToRegister }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setError("");

    const cleanedEmail = email.trim();
    if (!emailIsValid(cleanedEmail)) {
      setError("Por favor, digite um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve conter ao menos 6 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      await auth.signInWithEmailAndPassword(cleanedEmail, password);
      navigate("/");
    } catch (err) {
      console.error("Erro ao autenticar:", err);
      let msg = "Não foi possível entrar. Verifique seu e-mail e senha.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        msg = "E-mail ou senha incorretos. Verifique seus dados.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Muitas tentativas sem sucesso. Aguarde alguns instantes.";
      } else if (err.code === "auth/network-request-failed") {
        msg = "Falha de conexão com a taverna. Verifique sua internet.";
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      bgcolor: isDark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.92)",
      boxShadow: isDark 
        ? "inset 0 2px 4px rgba(0,0,0,0.6)" 
        : "inset 0 2px 4px rgba(0,0,0,0.05), 0 2px 8px rgba(100,50,0,0.04)",
      transition: "all 0.2s ease",
      "& fieldset": {
        borderColor: isDark ? "rgba(212,175,55,0.35)" : "rgba(139,94,60,0.35)",
        borderWidth: "1.5px"
      },
      "&:hover fieldset": {
        borderColor: isDark ? "#ffd700" : "#833c0b",
        borderWidth: "1.5px"
      },
      "&.Mui-focused fieldset": {
        borderColor: isDark ? "#ffd700" : "#833c0b",
        borderWidth: "2px",
        boxShadow: isDark ? "0 0 12px rgba(255,215,0,0.3)" : "0 0 12px rgba(131,60,11,0.25)"
      },
      "& input": {
        color: isDark ? "#f5f0e6" : "#24140b",
        py: 1.6,
        fontFamily: "Roboto, sans-serif"
      }
    },
    "& .MuiInputLabel-root": {
      color: isDark ? "#ffd700" : "#833c0b",
      fontFamily: "Cinzel, serif",
      fontWeight: 800,
      "&.Mui-focused": {
        color: isDark ? "#ffd700" : "#833c0b"
      }
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Cinzel, serif",
            fontWeight: 900,
            color: isDark ? "#ffd700" : "#6d3008",
            letterSpacing: 0.8,
            mb: 0.5
          }}
        >
          Acessar Grimório
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? "#dcd3c2" : "#6e4b31", fontFamily: "Roboto, sans-serif" }}>
          Entre com suas credenciais para continuar sua campanha.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSignIn} sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          autoComplete="email"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon sx={{ color: isDark ? "#ffd700" : "#833c0b", fontSize: 20 }} />
              </InputAdornment>
            )
          }}
          sx={inputStyles}
        />

        <TextField
          label="Senha"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          autoComplete="current-password"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: isDark ? "#ffd700" : "#833c0b", fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((s) => !s)}
                  edge="end"
                  size="small"
                  sx={{ color: isDark ? "#aaa" : "#777" }}
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={inputStyles}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            size="small"
            onClick={() => setForgotOpen(true)}
            sx={{
              color: isDark ? "#dcd3c2" : "#833c0b",
              fontSize: "0.82rem",
              fontFamily: "Roboto, sans-serif",
              fontWeight: 600,
              textTransform: "none",
              p: 0,
              minWidth: 0,
              "&:hover": { textDecoration: "underline", bgcolor: "transparent" }
            }}
          >
            Esqueceu a senha?
          </Button>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
          sx={{
            mt: 0.8,
            py: 1.5,
            bgcolor: isDark ? "#bf8f00" : "#833c0b",
            color: isDark ? "#120e0a" : "#fff",
            fontFamily: "Cinzel, serif",
            fontWeight: 900,
            fontSize: "1.02rem",
            letterSpacing: 1,
            borderRadius: 2.5,
            boxShadow: isDark 
              ? "0 6px 20px rgba(212,175,55,0.4), inset 0 1px 1px rgba(255,255,255,0.3)" 
              : "0 6px 20px rgba(131,60,11,0.35), inset 0 1px 1px rgba(255,255,255,0.3)",
            "&:hover": {
              bgcolor: isDark ? "#ffd700" : "#a34d10",
              boxShadow: isDark 
                ? "0 8px 25px rgba(212,175,55,0.6)" 
                : "0 8px 25px rgba(131,60,11,0.5)",
              transform: "translateY(-1px)"
            }
          }}
        >
          {submitting ? "Entrando na Campanha..." : "Entrar na Campanha"}
        </Button>
      </Box>

      {onSwitchToRegister && (
        <Stack direction="row" spacing={0.6} justifyContent="center" alignItems="center" sx={{ mt: 3.5 }}>
          <Typography variant="body2" sx={{ color: isDark ? "#b8ab99" : "#6e4b31" }}>
            Ainda não tem uma conta?
          </Typography>
          <Button
            onClick={onSwitchToRegister}
            sx={{
              color: isDark ? "#ffd700" : "#833c0b",
              fontWeight: 900,
              fontFamily: "Cinzel, serif",
              textTransform: "none",
              p: 0,
              minWidth: 0,
              "&:hover": { textDecoration: "underline", bgcolor: "transparent" }
            }}
          >
            Criar conta de Aventureiro
          </Button>
        </Stack>
      )}

      {/* Modal de Esqueci Minha Senha */}
      <ForgotPasswordModal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        defaultEmail={email}
      />
    </Box>
  );
}
