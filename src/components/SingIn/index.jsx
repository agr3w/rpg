import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Link } from "react-router-dom";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import styles from "./AuthComponent.module.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const emailIsValid = (email) => /\S+@\S+\.\S+/.test(email);

const AuthComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const cleanedEmail = email.trim();
    if (!emailIsValid(cleanedEmail)) {
      setError("Email inválido");
      return;
    }
    if (password.length < 6) {
      setError("Senha precisa ter ao menos 6 caracteres");
      return;
    }
    try {
      console.log("signin payload:", { email: cleanedEmail, passwordLength: password.length });
      await signInWithEmailAndPassword(auth, cleanedEmail, password);
    } catch (err) {
      console.error("Erro ao logar:", err);
      setError(err.message);
      alert(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const cleanedEmail = email.trim();
    if (!emailIsValid(cleanedEmail)) {
      setError("Email inválido");
      return;
    }
    if (password.length < 6) {
      setError("Senha precisa ter ao menos 6 caracteres");
      return;
    }
    try {
      console.log("register payload:", { email: cleanedEmail, passwordLength: password.length });
      await createUserWithEmailAndPassword(auth, cleanedEmail, password);
    } catch (err) {
      console.error("Erro durante o registro:", err);
      setError(err.message);
      alert(err.message);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.authForm}>
      <h2>Login</h2>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        className={styles.inputField}
        style={{ margin: "10px" }}
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
        className={styles.inputField}
        style={{ margin: "10px" }}
        InputProps={{
          endAdornment: (
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleTogglePasswordVisibility}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          ),
        }}
      />
      {error && (
        <Typography
          style={{ marginTop: "0", marginBottom: "10px" }}
          color="error"
        >
          {error}
        </Typography>
      )}
      <Button type="button" variant="contained" onClick={handleSignIn} className={styles.signInButton} style={{ marginTop: "0", marginBottom: "10px" }}>
        Entrar
      </Button>
      <Button type="button" variant="outlined" onClick={handleRegister} className={styles.registerButton} style={{ marginTop: "0", marginBottom: "10px" }}>
        Registrar-se
      </Button>
      <Typography
        variant="body1"
        style={{ marginTop: "5px" }}
        className={styles.registerLink}
      >
        Já tem uma conta?{" "}
        <Link to={"/Login"} className={styles.link}>
          Login
        </Link>
      </Typography>
    </div>
  );
};

export default AuthComponent;
