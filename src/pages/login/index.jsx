import React, { useState } from "react";
import AuthComponent from "components/SingIn";
import { auth } from "APIs/firebaseConfig"; // usar export compat centralizado
import { useNavigate } from "react-router-dom";

const emailIsValid = (email) => /\S+@\S+\.\S+/.test(email);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!emailIsValid(email)) return alert("Email inválido");
    if (password.length < 6) return alert("Senha precisa ter ao menos 6 caracteres");
    try {
      // compat API
      await auth.signInWithEmailAndPassword(email, password);
      navigate("/");
    } catch (err) {
      console.error("Erro ao logar:", err);
      alert(err.message || "Erro ao autenticar");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!emailIsValid(email)) return alert("Email inválido");
    if (password.length < 6) return alert("Senha precisa ter ao menos 6 caracteres");
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      navigate("/");
    } catch (err) {
      console.error("Erro durante o registro:", err);
      alert(err.message || "Erro ao registrar");
    }
  };

  return (
    <div>
      <h1>Pagina de Login</h1>
      <AuthComponent />
      {/* se quiser usar form custom, ligar handleSignIn / handleRegister aos botões */}
    </div>
  );
};

export default Login;
