import React, { useMemo, useState } from "react";
import { auth } from "APIs/firebaseConfig";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const emailIsValid = (email) => /\S+@\S+\.\S+/.test(email);

const RegisterComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordRules = useMemo(() => {
    const hasMin = password.length >= 8;
    const hasNumber = /\d/.test(password);
    return { hasMin, hasNumber, ok: hasMin && hasNumber };
  }, [password]);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleTogglePasswordVisibility = () => setShowPassword((s) => !s);

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError("");

    const cleanedEmail = email.trim();
    if (!emailIsValid(cleanedEmail)) return setError("Email inválido.");
    if (!passwordRules.ok) return setError("A senha deve ter pelo menos 8 caracteres e conter um número.");
    if (!passwordsMatch) return setError("As senhas não coincidem.");

    setSubmitting(true);
    try {
      await auth.createUserWithEmailAndPassword(cleanedEmail, password);
      navigate("/");
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Não foi possível criar a conta. Tente outro email ou tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
      <Stack spacing={1} sx={{ textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 1000, color: "var(--rpg-ink)" }}>
          Cadastro
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Forje sua conta e comece a registrar a jornada.
        </Typography>
      </Stack>

      <Divider sx={{ my: 2, borderColor: "rgba(0,0,0,0.06)" }} />

      <Box component="form" onSubmit={handleRegister}>
        <Stack spacing={2}>
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
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility} edge="end" aria-label="Mostrar/ocultar senha">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirmar senha"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility} edge="end" aria-label="Mostrar/ocultar senha">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormHelperText sx={{ m: 0 }}>
            Regras da senha:{" "}
            <b style={{ color: passwordRules.hasMin ? "var(--rpg-accent2)" : "inherit" }}>8+ caracteres</b>{" "}
            e{" "}
            <b style={{ color: passwordRules.hasNumber ? "var(--rpg-accent2)" : "inherit" }}>1 número</b>.
          </FormHelperText>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={
              submitting ||
              !email.trim() ||
              !passwordRules.ok ||
              !passwordsMatch
            }
            sx={{ fontWeight: 950 }}
          >
            {submitting ? "Criando..." : "Criar conta"}
          </Button>

          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            type="button"
            fullWidth
            sx={{ fontWeight: 900 }}
          >
            Já tenho uma conta
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default RegisterComponent;
