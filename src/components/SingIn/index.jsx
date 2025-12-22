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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "APIs/firebaseConfig";
import styles from "./AuthComponent.module.css";

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
    if (!emailIsValid(cleanedEmail))
      return setError("Email inválido");
    if (password.length < 6)
      return setError("Senha precisa ter ao menos 6 caracteres");
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
    if (!emailIsValid(cleanedEmail))
      return setError("Email inválido");
    if (password.length < 6)
      return setError("Senha precisa ter ao menos 6 caracteres");
    try {
      await auth.createUserWithEmailAndPassword(cleanedEmail, password);
      navigate("/");
    } catch (err) {
      console.error("Erro durante o registro:", err);
      setError(err.message || "Erro durante o registro");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.32 } },
  };

  return (
    <motion.div initial="hidden" animate="show" variants={cardVariants}>
      <Paper
        elevation={6}
        sx={{
          maxWidth: 420,
          mx: "auto",
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSignIn}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ textAlign: "center", color: "primary.main" }}
          >
            Entrar
          </Typography>

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
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    aria-label="toggle password"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography
              color="error"
              variant="body2"
              sx={{ textAlign: "center" }}
            >
              {error}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              mt: 1,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignIn}
              className={styles.signInButton}
              style={{
                marginTop: "0",
                marginBottom: "10px",
              }}
            >
              Entrar
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", mt: 1 }}
            className={styles.registerLink}
          >
            Ainda não tem conta?{" "}
            <Link to="/Registrar-se" className={styles.link}>
              Criar conta
            </Link>
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default AuthComponent;
