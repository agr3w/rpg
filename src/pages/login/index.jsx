// Outro componente onde você deseja utilizar a autenticação
import AuthComponent from 'components/SingUp';
import React from 'react';

const YourComponent = () => {
  return (
    <div>
      <h1>Seu componente</h1>
      <AuthComponent />
    </div>
  );
};

export default YourComponent;
