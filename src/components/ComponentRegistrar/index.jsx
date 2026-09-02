// src/components/ComponentRegistrar/index.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  InputAdornment,
  Alert,
  Stack,
  LinearProgress,
  CircularProgress,
  useTheme
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useNavigate } from "react-router-dom";
import { auth } from "APIs/firebaseConfig";

const emailIsValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function RegisterComponent({ onSwitchToLogin }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Cálculo da Força da Senha
  const passwordStrength = useMemo(() => {
    let score = 0;
    const hasMin = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialOrUpper = /[^a-z0-9]/.test(password) || /[A-Z]/.test(password);

    if (hasMin) score += 40;
    if (hasNumber) score += 30;
    if (hasSpecialOrUpper) score += 30;

    let label = "Muito Fraca";
    let color = "#ef5350";
    if (score >= 100) {
      label = "Excelente / Forte";
      color = "#66bb6a";
    } else if (score >= 70) {
      label = "Boa / Segura";
      color = "#ffa726";
    } else if (score >= 40) {
      label = "Razoável";
      color = "#ffca28";
    }

    return { score, label, color, hasMin, hasNumber, hasSpecialOrUpper, ok: hasMin && hasNumber };
  }, [password]);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError("");

    const cleanedName = name.trim();
    const cleanedEmail = email.trim();

    if (!emailIsValid(cleanedEmail)) {
      setError("Por favor, digite um e-mail válido.");
      return;
    }
    if (!passwordStrength.ok) {
      setError("A senha deve ter ao menos 8 caracteres e conter pelo menos um número.");
      return;
    }
    if (!passwordsMatch) {
      setError("A confirmação de senha não confere com a senha digitada.");
      return;
    }

    setSubmitting(true);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(cleanedEmail, password);
      if (cleanedName && userCredential.user) {
        await userCredential.user.updateProfile({
          displayName: cleanedName
        });
      }
      navigate("/");
    } catch (err) {
      console.error("Erro ao registrar conta:", err);
      let msg = "Não foi possível criar sua conta de aventureiro. Tente novamente.";
      if (err.code === "auth/email-already-in-use") {
        msg = "Este e-mail já está em uso por outro aventureiro. Tente fazer login ou recuperar a senha.";
      } else if (err.code === "auth/invalid-email") {
        msg = "O formato do e-mail informado é inválido.";
      } else if (err.code === "auth/weak-password") {
        msg = "A senha é muito fraca. Utilize combinações com números e letras.";
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
          Forjar Conta de Aventureiro
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? "#dcd3c2" : "#6e4b31", fontFamily: "Roboto, sans-serif" }}>
          Registre-se gratuitamente para criar campanhas e gerenciar seus heróis.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
        <TextField
          label="Nome do Aventureiro / Mestre"
          type="text"
          placeholder="Ex: Gandalf, Mestre Weslley, Vax'ildan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon sx={{ color: isDark ? "#ffd700" : "#833c0b", fontSize: 20 }} />
              </InputAdornment>
            )
          }}
          sx={inputStyles}
        />

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
          autoComplete="new-password"
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

        {/* Barra de Força da Senha */}
        {password.length > 0 && (
          <Box sx={{ mt: -0.5, mb: 0.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: isDark ? "#dcd3c2" : "#6e4b31" }}>
                Força da Senha:
              </Typography>
              <Typography variant="caption" sx={{ color: passwordStrength.color, fontWeight: "bold" }}>
                {passwordStrength.label}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={passwordStrength.score}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: passwordStrength.color,
                  borderRadius: 3
                }
              }}
            />
            <Stack direction="row" spacing={1.5} sx={{ mt: 0.8 }} flexWrap="wrap">
              <Typography variant="caption" sx={{ color: passwordStrength.hasMin ? "#66bb6a" : (isDark ? "#888" : "#999"), display: "flex", alignItems: "center", gap: 0.3 }}>
                {passwordStrength.hasMin ? <CheckCircleOutlineIcon sx={{ fontSize: 13 }} /> : "•"} 8+ caracteres
              </Typography>
              <Typography variant="caption" sx={{ color: passwordStrength.hasNumber ? "#66bb6a" : (isDark ? "#888" : "#999"), display: "flex", alignItems: "center", gap: 0.3 }}>
                {passwordStrength.hasNumber ? <CheckCircleOutlineIcon sx={{ fontSize: 13 }} /> : "•"} 1+ número
              </Typography>
            </Stack>
          </Box>
        )}

        <TextField
          label="Confirmar Senha"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          required
          autoComplete="new-password"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: isDark ? "#ffd700" : "#833c0b", fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: confirmPassword.length > 0 && (
              <InputAdornment position="end">
                {passwordsMatch ? (
                  <CheckCircleOutlineIcon sx={{ color: "#66bb6a", fontSize: 20 }} />
                ) : (
                  <CancelOutlinedIcon sx={{ color: "#ef5350", fontSize: 20 }} />
                )}
              </InputAdornment>
            )
          }}
          sx={inputStyles}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <HowToRegIcon />}
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
          {submitting ? "Forjando Herói..." : "Forjar Conta de Aventureiro"}
        </Button>
      </Box>

      {onSwitchToLogin && (
        <Stack direction="row" spacing={0.6} justifyContent="center" alignItems="center" sx={{ mt: 3.5 }}>
          <Typography variant="body2" sx={{ color: isDark ? "#b8ab99" : "#6e4b31" }}>
            Já possui uma conta forjada?
          </Typography>
          <Button
            onClick={onSwitchToLogin}
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
            Fazer Login
          </Button>
        </Stack>
      )}
    </Box>
  );
}
