import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "APIs/firebaseConfig";
import { Link } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import styles from "./AuthComponent.module.css";

const AuthComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed in:", user);
        setError(""); // Reset error message on successful sign-in
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/user-not-found") {
          setError("Usuário não encontrado. Verifique o email.");
        } else if (errorCode === "auth/wrong-password") {
          setError("Senha incorreta. Tente novamente.");
        } else {
          setError("Ocorreu um erro ao fazer login. Tente novamente.");
        }
      });
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
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
        className={styles.inputField}
        style={{ margin: "10px" }}
      />
      {error && (
        <Typography
          style={{ marginTop: "0", marginBottom: "10px" }}
          color="error"
        >
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        onClick={handleSignIn}
        className={styles.signInButton}
        style={{ marginTop: "0", marginBottom: "10px" }}
      >
        Entrar
      </Button>
      <Typography
        variant="body1"
        style={{ marginTop: "5px" }}
        className={styles.registerLink}
      >
        Ainda não tem uma conta?{" "}
        <Link to={"/Registrar-se"} className={styles.link}>
          Registrar-se
        </Link>
      </Typography>
    </div>
  );
};

export default AuthComponent;
