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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "APIs/firebaseConfig";

const emailIsValid = (email) => /\S+@\S+\.\S+/.test(email);

const AuthComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => setShowPassword((s) => !s);

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setError("");
    const cleanedEmail = email.trim();
    if (!emailIsValid(cleanedEmail)) return setError("Email inválido");
    if (password.length < 6) return setError("Senha precisa ter ao menos 6 caracteres");
    try {
      await auth.signInWithEmailAndPassword(cleanedEmail, password);
      navigate("/");
    } catch (err) {
      console.error("Erro ao logar:", err);
      setError(err.message || "Erro ao autenticar");
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError("");
    const cleanedEmail = email.trim();
    if (!emailIsValid(cleanedEmail)) return setError("Email inválido");
    if (password.length < 6) return setError("Senha precisa ter ao menos 6 caracteres");
    try {
      await auth.createUserWithEmailAndPassword(cleanedEmail, password);
      navigate("/");
    } catch (err) {
      console.error("Erro durante o registro:", err);
      setError(err.message || "Erro durante o registro");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.995 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.36 } },
  };

  return (
    <motion.div initial="hidden" animate="show" variants={cardVariants}>
      <Paper
        elevation={8}
        sx={{
          maxWidth: 480,
          mx: "auto",
          p: 3,
          borderRadius: 3,
          background:
            "linear-gradient(180deg, rgba(255,250,244,1) 0%, rgba(245,238,229,1) 100%)",
          border: (theme) => `1px solid ${theme.palette.rpg?.border || "#6b2f1f"}`,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 1 }}>
          {/* Ornamental header - simple SVG/emoji for D&D vibe */}
          <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.dark", mb: 0.5 }}>
            🐉 RPG Organizer
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Organize suas aventuras — fichas, mapas, músicas e anotações
          </Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: "rgba(0,0,0,0.06)" }} />

        <Box component="form" onSubmit={handleSignIn} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            autoComplete="email"
          />

          <TextField
            label="Senha"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility} edge="end" aria-label="toggle password">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ textAlign: "center" }}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 1, flexWrap: "wrap" }}>
            <Button variant="contained" color="primary" onClick={handleSignIn} sx={{ minWidth: 140 }}>
              Entrar
            </Button>
            <Button variant="outlined" onClick={handleRegister} sx={{ minWidth: 140 }}>
              Registrar-se
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
            Ou experimente
          </Typography>

          {/* Decorative quick-actions: small themed buttons (placeholders para futuro OAuth) */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {/* <Button size="small" variant="contained" sx={{ bgcolor: "secondary.main", color: "#2b160e" }}>
              <span style={{ marginRight: 8 }}>⚔️</span> Dungeon
            </Button> */}
            <Button size="small" variant="contained" sx={{ bgcolor: "secondary.main" }}>
              <span style={{ marginRight: 8 }}>📜</span> Ficha Rápida
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
            Ainda não tem conta?{" "}
            <MuiLink component={Link} to="/Registrar-se" sx={{ fontWeight: 700 }}>
              Criar conta
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default AuthComponent;
