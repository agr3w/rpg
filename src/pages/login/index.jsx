// Outro componente onde você deseja utilizar a autenticação
import AuthComponent from 'components/SingIn';
import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // ajuste o caminho se necessário

const emailIsValid = (email) => /\S+@\S+\.\S+/.test(email);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!emailIsValid(email)) return alert('Email inválido');
    if (password.length < 6) return alert('Senha precisa ter ao menos 6 caracteres');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // redirecionar / atualizar estado
    } catch (err) {
      console.error('Erro ao logar:', err);
      alert(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!emailIsValid(email)) return alert('Email inválido');
    if (password.length < 6) return alert('Senha precisa ter ao menos 6 caracteres');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // pós-registro
    } catch (err) {
      console.error('Erro durante o registro:', err);
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Pagina de Login</h1>
      <AuthComponent />
      {/* Formulário de Login/Registro aqui, utilizando email, password, handleSignIn e handleRegister */}
    </div>
  );
};

export default Login;
