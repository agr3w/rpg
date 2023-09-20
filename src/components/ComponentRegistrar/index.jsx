import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Button, TextField, Typography, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "./RegisterComponent.module.css";
import { Link } from "react-router-dom";

const RegisterComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    // Validate password
    setPasswordValid(newPassword.length >= 8 && /\d/.test(newPassword));
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    if (!passwordValid) {
      setError(
        "Password must be at least 8 characters long and contain at least one number."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    // TODO: Add email format validation if needed

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User registered:", user);
        setError(""); // Reset error message
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        setError("Error during registration. Please try again.");
      });
  };

  return (
    <div className={styles.registerForm}>
      <h2>Cadastro</h2>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={handleEmailChange}
        variant="outlined"
        className={styles.inputField}
        style={{ margin: "10px" }}
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={handlePasswordChange}
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
      <TextField
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
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
      {error && <Typography color="error">{error}</Typography>}
      {!passwordValid && (
        <Typography
          color="error"
          style={{ marginTop: "0", marginBottom: "10px" }}
          className={styles.error}
        >
          A senha deve ter pelo menos: <li>8 caracteres</li>{" "}
          <li>conter pelo menos um número.</li>
        </Typography>
      )}
      <Button
        variant="contained"
        onClick={handleRegister}
        className={styles.registerButton}
        style={{ marginTop: "0", marginBottom: "10px" }}
        disabled={
          !passwordValid ||
          password !== confirmPassword ||
          error !== "" ||
          !email
        }
      >
        Registrar-se
      </Button>

      <Link to={"/login"}>
        <Button
          variant="outlined"
          style={{ marginTop: "5px" }}
          className={styles.registerButton}
        >
          Já tenho uma conta
        </Button>
      </Link>
    </div>
  );
};

export default RegisterComponent;
