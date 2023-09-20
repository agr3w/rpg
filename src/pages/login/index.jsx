// Outro componente onde você deseja utilizar a autenticação
import AuthComponent from 'components/SingIn';
import React from 'react';

const Login = () => {
  return (
    <div>
      <h1>Pagina de Login</h1>
      <AuthComponent />
    </div>
  );
};

export default Login;
