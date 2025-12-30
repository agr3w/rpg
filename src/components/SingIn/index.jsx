import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Typography,
  InputAdornment,
  Divider,
  Link as MuiLink,
  Alert,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { auth } from "APIs/firebaseConfig";

const emailIsValid = (email) => /\S+@\S+\.\S+/.test(email);

const AuthComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => setShowPassword((s) => !s);

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setError("");

    const cleanedEmail = email.trim();
    if (!emailIsValid(cleanedEmail)) return setError("Email inválido.");
    if (password.length < 6) return setError("Senha precisa ter ao menos 6 caracteres.");

    setSubmitting(true);
    try {
      await auth.signInWithEmailAndPassword(cleanedEmail, password);
      navigate("/");
    } catch (err) {
      console.error("Erro ao logar:", err);
      setError("Não foi possível entrar. Verifique email e senha.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.995 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.36 } },
  };

  return (
    <motion.div initial="hidden" animate="show" variants={cardVariants}>
      <Paper
        elevation={0}
        sx={{
          mx: "auto",
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          border: "1px solid var(--rpg-stroke)",
          bgcolor: "rgba(0,0,0,0.04)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 1000, color: "var(--rpg-ink)", mb: 0.5 }}>
            RPG Organizer
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Entrar para continuar sua campanha
          </Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: "rgba(0,0,0,0.06)" }} />

        <Box
          component="form"
          onSubmit={handleSignIn}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            autoComplete="email"
          />

          <TextField
            label="Senha"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    aria-label="Mostrar/ocultar senha"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Stack spacing={1.25} sx={{ mt: 0.5 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              sx={{ fontWeight: 950 }}
              fullWidth
            >
              {submitting ? "Entrando..." : "Entrar"}
            </Button>

            <Button
              component={RouterLink}
              to="/Registrar-se"
              variant="outlined"
              type="button"
              fullWidth
              sx={{ fontWeight: 900 }}
            >
              Criar conta
            </Button>

            <Typography variant="body2" sx={{ textAlign: "center", mt: 0.5 }}>
              <MuiLink component={RouterLink} to="/BemVindo" underline="hover" sx={{ fontWeight: 800 }}>
                Ver o que o site oferece
              </MuiLink>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default AuthComponent;
